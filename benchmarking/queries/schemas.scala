import org.apache.spark.sql.types._

object Schemas {
    def getTaxiSchema() = {
        val schema_fields = 
            List(
                StructField("VendorID", IntegerType),
                StructField("tpep_pickup_datetime", TimestampType),
                StructField("tpep_dropoff_datetime", TimestampType),
                StructField("passenger_count", IntegerType),
                StructField("trip_distance", DoubleType),
                StructField("RatecodeID", IntegerType),
                StructField("store_and_fwd_flag", StringType),
                StructField("PULocationID", IntegerType),
                StructField("DOLocationID", IntegerType),
                StructField("payment_type", IntegerType),
                StructField("fare_amount", DoubleType),
                StructField("extra", DoubleType),
                StructField("mta_tax", DoubleType),
                StructField("tip_amount", DoubleType),
                StructField("tolls_amount", DoubleType),
                StructField("improvement_surcharge", DoubleType),
                StructField("total_amount", DoubleType),
                StructField("congestion_surcharge", DoubleType)
            )
        StructType(schema_fields)
    }

    def getMagentaSchema() = {
        val schema_fields = 
            List(
                StructField("Text01", StringType),
                StructField("Text02", StringType),
                StructField("Text03", StringType),
                StructField("Text04", StringType),
                StructField("Text05", StringType),
                StructField("Text06", StringType),
                StructField("IntWritable01", IntegerType),
                StructField("Text07", StringType),
                StructField("Text08", StringType),
                StructField("Text09", StringType),
                StructField("Text10", StringType),
                StructField("Text11", StringType),
                StructField("Text12", StringType),
                StructField("Text13", StringType),
                StructField("LongWritable01", LongType),
                StructField("LongWritable02", LongType),
                StructField("LongWritable03", LongType),
                StructField("LongWritable04", LongType),
                StructField("LongWritable05", LongType),
                StructField("LongWritable06", LongType),
                StructField("Text14", StringType),
                StructField("Text15", StringType),
                StructField("IntWritable02", IntegerType),
                StructField("Text16", StringType),
                StructField("Text17", StringType),
                StructField("Text18", StringType),
                StructField("Text19", StringType),
                StructField("Text20", StringType),
                StructField("IntWritable03", IntegerType),
                StructField("IntWritable04", IntegerType),
                StructField("Text21", StringType),
                StructField("IntWritable05", IntegerType),
                StructField("Text22", StringType),
                StructField("Text23", StringType),
                StructField("Text24", StringType),
                StructField("Text25", StringType),
                StructField("Text26", StringType),
                StructField("IntWritable06", IntegerType),
                StructField("IntWritable07", StringType),
                StructField("Text27", StringType),
                StructField("IntWritable08", IntegerType),
                StructField("Text28", StringType),
                StructField("IntWritable09", IntegerType),
                StructField("IntWritable10", IntegerType),
                StructField("IntWritable11", IntegerType),
                StructField("Text29", StringType),
                StructField("Text30", StringType),
                StructField("Text31", StringType)
            )

        StructType(schema_fields)
    }

    def getMonitorSchema() = {
        val schema_fields = List(
            StructField("timestamp", DateType),
            StructField("numRows", LongType),
            StructField("avgRowSize", IntegerType),
            StructField("inputRowsPerSec", DoubleType),
            StructField("processedRowsPerSec", DoubleType),
            StructField("inputDurationSec", DoubleType),
            StructField("processedDurationSec", DoubleType)
        )
    }

    def getQ0Schema() = {
        val schema_fields = List(
            StructField("passenger_count", IntegerType),
            StructField("year", IntegerType),
            StructField("total", IntegerType)
        )

        StructType(schema_fields)
    }
}