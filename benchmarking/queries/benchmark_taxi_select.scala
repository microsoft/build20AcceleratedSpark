import org.apache.spark.sql.functions.{_ => F}
import org.apache.spark.sql.SparkSession
import org.apache.spark.sql.functions._
import org.apache.spark.sql.types._
import org.apache.spark.sql.DataFrame
import org.apache.log4j._
import java.nio.file.Paths
import org.apache.spark.SparkConf

:load schemas.scala

object Benchmark {
    var cols = Array("")

    def getSchema() =  Schemas.getTaxiSchema

    def time[R](block: => R): R = {
        val t0 = System.nanoTime()
        val result = block    // call-by-name
        val t1 = System.nanoTime()
        println(f"Elapsed time: ${(t1 - t0) / 1e9}%1.3fs")
        result
    }

    def loadTaxiData(fileName: String) = {

        val taxi_orig_schema = getSchema()

        val df = spark
            .read
            .schema(taxi_orig_schema)
            .option("header", "false")
            .csv(fileName)

        df.createOrReplaceTempView("nyyellowtaxi")
        cols = df.columns
        println(s"Created sql table from dataframe")
    }

    /** Our main function where the action happens */
    def runFile(file_name: String) = {
        val schema_fields = cols
        val total_cols = schema_fields.length

        var i = 0
        for(i <- 1 to total_cols) {
            val names = schema_fields.slice(0, i).mkString(", ")
            val query_txt = spark.sql(s"select $names from nyyellowtaxi")

            println(s"cols ${i}:")
            time {query_txt.collect()}
        }        
    }

    def main(rootPath: String = "~/yellow/taxi/taxi_data") = {
        val files = List("yellow_tripdata_2012-03.csv", "yellow_tripdata_2019-12.csv")

        println(s"spark.driver.memory: ${spark.conf.get("spark.driver.memory")}")
        var f : String = ""
        for (f <- files.map(Paths.get(rootPath, _).toString)) {
            println(s"Running with $f")
            loadTaxiData(f)
            runFile(f)
        }
    }
}
