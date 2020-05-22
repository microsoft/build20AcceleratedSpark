import org.apache.spark.sql.functions.{_ => F}
import org.apache.spark.sql.SparkSession
import org.apache.spark.sql.functions._
import org.apache.spark.sql.types._
import org.apache.spark.sql.DataFrame
import org.apache.log4j._
import java.nio.file.Paths
import org.apache.spark.SparkConf
import org.apache.spark.sql.streaming.Trigger

:load schemas.scala
:load ../listener/querylistener.scala 

object Benchmark {

    def getSchema() =  Schemas.getTaxiSchema

    def loadData(filePath: String, queryName: String) = {

        val taxi_orig_schema = getSchema()

        val df = spark
            .readStream
            .schema(taxi_orig_schema)
            .option("header", "false")
            .option("maxFilesPerTrigger", 1)
            .csv(filePath)

        df.createOrReplaceTempView(queryName)
        println(s"Created sql table from dataframe")
    }

    /** Our main function where the action happens */
    def runFile(outDir: String, checkpointLoc: String, queryStr: String, tableName: String) = {

        spark.sql(queryStr)
            .writeStream
            .foreachBatch((df : DataFrame, epoch : Long) => {
                    df.write
                    .csv(s"${outDir}_$epoch")
            })
            .outputMode("complete")
            .option("startingOffsets", "earliest")
            .option("checkpointLocation", checkpointLoc)
            .trigger(Trigger.ProcessingTime("1 second"))
            .queryName("magenta_out")
            .start()

    }

    def main(queryIdx: Int) = {
        val tableName = "nyyellowtaxi"

        val queryList = List(s"select count(*) as total from $tableName",
            s"select payment_type, count(*) as total from $tableName group by payment_type",
            s"select passenger_count, avg(total_amount) as avg_amount from $tableName group by passenger_count",
            s"select passenger_count, year(tpep_pickup_datetime) year, count(*) total FROM $tableName group by passenger_count, year",
            s"""select passenger_count, year(tpep_pickup_datetime) as year, 
                cast(trip_distance as int) as distance, 
                count(*) as total 
                from $tableName
                group by passenger_count, year, distance
                order by year, total desc
                """
        )
        val queryName = s"q$queryIdx"
        val rootPath = s"~/data/taxi_data_cleaned_18_standard" //root of the dataset
        val magentaOutDir = s"~/data/queries_e8/$queryName/processed/results" // query results
        val checkpointLoc = s"~/data/queries_e8/$queryName/checkpoint" // checkpoint files
        val logDir = s"~/data/queries_e8/$queryName/monitor/results" // profiling results

        println(s"spark.driver.memory: ${spark.conf.get("spark.driver.memory")}")
        println(s"Running query")

        spark.streams.addListener(new StreamMonitor(logDir, 98, 5))

        // start stream-reading
        loadData(rootPath, tableName)
        
        // start stsream-writing
        runFile(magentaOutDir, checkpointLoc, queryList(queryIdx), tableName)
    }
}
