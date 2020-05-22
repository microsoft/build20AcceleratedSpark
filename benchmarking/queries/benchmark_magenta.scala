import org.apache.spark.sql.functions.{_ => F}
import org.apache.spark.sql.SparkSession
import org.apache.spark.sql.functions._
import org.apache.spark.sql.types._
import org.apache.spark.sql.streaming.Trigger
import org.apache.spark.sql.streaming.StreamingQuery
import org.apache.spark.sql.DataFrame

import org.apache.log4j._
import java.nio.file.Paths
import org.apache.spark.SparkConf

:load ../listener/querylistener.scala
:load schemas.scala

object BenchMagenta {
    var cols = Array("")

    def getSchema() = Schemas.getMagentaSchema

    def loadData(filePath: String, queryName: String) = {

        val taxi_orig_schema = getSchema()

        val df = spark
            .readStream
            .schema(taxi_orig_schema)
            .option("header", "false")
            .option("maxFilesPerTrigger", 1)
            .csv(filePath)

        df.createOrReplaceTempView(queryName)
        cols = df.columns
        println(s"Created sql table from dataframe")
    }

    /** Our main function where the action happens */
    def runFile(magentaOutDir : String, checkpointLoc: String, tableName: String) = {

        spark.sql(s"select * from $tableName")
            .writeStream
            .format("parquet")
            .outputMode("append")
            .option("path", magentaOutDir)
            .option("startingOffsets", "earliest")
            .option("checkpointLocation", checkpointLoc)
            .queryName("magenta_out")
            .start()
    }

    def main() = {
        val rootPath = "~/yellow/magenta/raw"
        val magentaOutDir = "~/yellow/magenta/processed"
        val checkpointLoc = "~/yellow/magenta/checkpoint"
        val logDir = "~/yellow/magenta/monitor/stats"

        println(s"spark.driver.memory: ${spark.conf.get("spark.driver.memory")}")
        println(s"Running query")

        spark.streams.addListener(new StreamMonitor(logDir, 520, 5))

        // start stream-reading
        loadData(rootPath, "magenta")
        
        // start stsream-writing
        runFile(magentaOutDir, checkpointLoc, "magenta")
    }
}