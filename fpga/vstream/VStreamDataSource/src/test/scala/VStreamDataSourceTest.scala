import java.util.concurrent.TimeUnit

import org.apache.spark.sql.SparkSession
import org.apache.spark.sql.types._

object VStreamDataSourceTest extends App {
  val spark = SparkSession.builder()
    .master("local[*]")
    .appName("VStreamTest")
    .getOrCreate()

  println(s"Spark version ${spark.version}")

  val schema_fields = List(StructField("id", LongType), StructField("payment", FloatType))
  val schema = StructType(schema_fields)

  val ids = spark
    .read
    .format("vstream")
    .schema(schema)
    .load

  ids.show
  }
