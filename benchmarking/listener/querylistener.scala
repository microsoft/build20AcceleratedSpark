import org.apache.spark.sql.Row

import org.apache.spark.sql.streaming.StreamingQueryListener
import org.apache.spark.sql.streaming.StreamingQueryListener._
import org.apache.spark.internal.Logging
import java.util.concurrent.locks.{Lock, ReentrantLock}

import spark.implicits._

case class Record(timestamp : String, numRows : Long, avgRowSize : Int, 
        inputRowsPerSec : Double, processedRowsPerSec : Double, inputDurationSec : Double, processedDurationSec : Double)

// this is how you use toDF
// 1. import spark.implicits._ from an existing spark session
// 2. define the Record case class containing the schema
// 3. Use in a separate object outside of the class definition
object ConvToDf {        
    def createDF(seqDF : List[Record]) = {
        seqDF.toDF.na.fill(0)
    }
}

class StreamMonitor(val fileName : String, val rowSize: Int, val capacity: Int = 1) extends StreamingQueryListener() with Logging {
    
    private[this] val lock : Lock = new ReentrantLock()
    private[this] var collectedRecs = List[Record]()
    private[this] var queryDone = false
    private[this] var batch = 0
  
    override def onQueryProgress(queryProgress: QueryProgressEvent): Unit = {

        val progress = queryProgress.progress
        val nr = progress.numInputRows

        // since we are streaming the query it's never done
        // check what the next batch brings and terminate processing accordingly
        if (nr == 0 || collectedRecs.length >= capacity) {
            if (queryDone) return
            try {
                lock.lock()
                if(!queryDone) {
                    queryDone = nr == 0
                    
                    if (collectedRecs.length != 0) {
                        ConvToDf.createDF(collectedRecs.reverse)
                            .write
                            .option("header", "false")
                            .csv(s"${fileName}_$batch")
                        batch += 1
                    }
                    collectedRecs = List[Record]()
                }
            }
            catch {
                case e: Throwable => { 
                    logError(s"$e")
                    if (!queryDone) return
                }
            }
            finally {
                lock.unlock()
                if (queryDone) return
            }
        }

        val ts = progress.timestamp
        val inpRowsSec = progress.inputRowsPerSecond
        val procRowsSec = progress.processedRowsPerSecond
        val inpDurationSec = nr / inpRowsSec
        val procDurationSec = nr / procRowsSec

        try {
            lock.lock()
            collectedRecs = Record(ts, nr, rowSize, inpRowsSec, procRowsSec, inpDurationSec, procDurationSec) :: collectedRecs
        }
        catch {
            case e: Throwable => logError(s"$e")
        }
        finally {
            lock.unlock()
        }
    }

    def onQueryStarted(event: QueryStartedEvent): Unit = ()
    def onQueryTerminated(event: QueryTerminatedEvent): Unit = ()
}