import org.apache.spark.sql.Row
import org.apache.spark.sql.SparkSession
import org.apache.spark.sql.types._

import java.sql.Timestamp

// Data from https://www1.nyc.gov/site/tlc/about/tlc-trip-record-data.page

/*
Yellow Taxi Schema 
==================
Header
VendorID,tpep_pickup_datetime,tpep_dropoff_datetime,passenger_count,trip_distance,RatecodeID,store_and_fwd_flag,PULocationID,DOLocationID,payment_type,fare_amount,extra,mta_tax,tip_amount,tolls_amount,improvement_surcharge,total_amount,congestion_surcharge

 VendorID 
 A code indicating the TPEP provider that provided the record. 
 1= Creative Mobile Technologies, LLC; 2= VeriFone Inc. 

 tpep_pickup_datetime 
 The date and time when the meter was engaged.  

 tpep_dropoff_datetime 
 The date and time when the meter was disengaged.   

 Passenger_count 
 The number of passengers in the vehicle.   
 This is a driver-entered value. 

 Trip_distance 
 The elapsed trip distance in miles reported by the taximeter. 

 PULocationID 
 TLC Taxi Zone in which the taximeter was engaged 

 DOLocationID 
 TLC Taxi Zone in which the taximeter was disengaged 

 RateCodeID 
 The final rate code in effect at the end of the trip. 
 1= Standard rate 2=JFK 3=Newark 4=Nassau or Westchester 5=Negotiated fare 6=Group ride 

 Store_and_fwd_flag 
 This flag indicates whether the trip record was held in vehicle memory before sending to the vendor, aka “store and forward,” because the vehicle did not have a connection to the server.  
 Y= store and forward trip N= not a store and forward trip 

 Payment_type 
 A numeric code signifying how the passenger paid for the trip.  1= Credit card 2= Cash 3= No charge 4= Dispute 5= Unknown 6= Voided trip 

 Fare_amount 
 The time-and-distance fare calculated by the meter. 
 
 Extra 
 Miscellaneous extras and surcharges.  Currently, this only includes the $0.50 and $1 rush hour and overnight charges. 

 MTA_tax 
 $0.50 MTA tax that is automatically triggered based on the metered rate in use. 

 Improvement_surcharge 
 $0.30 improvement surcharge assessed trips at the flag drop. The improvement surcharge began being levied in 2015. 

 Tip_amount 
 Tip amount – This field is automatically populated for credit card tips. Cash tips are not included. 

 Tolls_amount 
 Total amount of all tolls paid in trip.  Total_amount The total amount charged to passengers. Does not include cash tips. 

 */

/*
Green Taxi Data Schema
======================
Header
VendorID,lpep_pickup_datetime,Lpep_dropoff_datetime,Store_and_fwd_flag,RateCodeID,Pickup_longitude,Pickup_latitude,Dropoff_longitude,Dropoff_latitude,Passenger_count,Trip_distance,Fare_amount,Extra,MTA_tax,Tip_amount,Tolls_amount,Ehail_fee,Total_amount,Payment_type,Trip_type

 VendorID 
 A code indicating the LPEP provider that provided the record. 
 1= Creative Mobile Technologies, LLC; 2= VeriFone Inc. lpep_pickup_datetime The date and time when the meter was engaged.  lpep_dropoff_datetime The date and time when the meter was disengaged.   

 Passenger_count 
 The number of passengers in the vehicle.   
 This is a driver-entered value. Trip_distance The elapsed trip distance in miles reported by the taximeter. PULocationID TLC Taxi Zone in which the taximeter was engaged DOLocationID TLC Taxi Zone in which the taximeter was disengaged 

 RateCodeID 
 The final rate code in effect at the end of the trip. 
 1= Standard rate 2=JFK 3=Newark 4=Nassau or Westchester 5=Negotiated fare 6=Group ride 

 Store_and_fwd_flag 
 This flag indicates whether the trip record was held in vehicle memory before sending to the vendor, aka “store and forward,” because the vehicle did not have a connection to the server.  
 Y= store and forward trip N= not a store and forward trip 

 Payment_type 
 A numeric code signifying how the passenger paid for the trip.  1= Credit card 2= Cash 3= No charge 4= Dispute 5= Unknown 6= Voided trip 

 Fare_amount 
 The time-and-distance fare calculated by the meter. 

 Extra 
 Miscellaneous extras and surcharges.  Currently, this only includes the $0.50 and $1 rush hour and overnight charges. 

 MTA_tax 
 $0.50 MTA tax that is automatically triggered based on the metered rate in use. 

 Improvement_surcharge 
 $0.30 improvement surcharge assessed on hailed trips at the flag drop. The improvement surcharge began being levied in 2015. 

 Tip_amount 
 Trip amount – This field is automatically populated for credit card tips. Cash tips are not included. 

 Tolls_amount 
 Total amount of all tolls paid in trip.  

 Total_amount 
 The total amount charged to passengers. Does not include cash tips.

 Trip_type 
 A code indicating whether the trip was a street-hail or a dispatch that is automatically assigned based on the metered rate in use but can be altered by the driver.  
 1= Street-hail 2= Dispatch 
 
 */

/*
Example Queries 

 Query 1 
 SELECT cab_type, count(*) FROM trips_csv GROUP BY cab_type; 

 Query 2 
 SELECT passenger_count, avg(total_amount) FROM trips_orc GROUP BY passenger_count

 Query 3 
 SELECT passenger_count, year(pickup_datetime), count(*) FROM trips_orc GROUP BY passenger_count, year(pickup_datetime)

 Query 4 
 SELECT passenger_count, year(pickup_datetime) trip_year, round(trip_distance), count(*) trips FROM trips_orc GROUP BY passenger_count, year(pickup_datetime), round(trip_distance) ORDER BY trip_year, trips desc; 

 */

/*
Schema for Green Taxi

case class GreenTaxiRide(VendorID: Byte,
  lpep_pickup_datetime: TimestampType,
  lpep_dropoff_datetime: TimestampType,
  Store_and_fwd_flag: Boolean,
  RateCodeID: Byte,
  Pickup_longitude: Float,
  Pickup_latitude: Float,
  Dropoff_longitude: Float,
  Dropoff_latitude: Float,
  Passenger_count: Int,
  Trip_distance: Float,
  Fare_amount: Float,
  Extra: Float,
  MTA_tax: Float,
  Tip_amount: FLoat,
  Tolls_amount: Float,
  Ehail_fee: Float,
  Total_amount: Float,
  Payment_type: Byte,
  Trip_type: Byte)

  case class YellowTaxiRide (
    VendorID: Byte,
    lpep_pickup_datetime: TimestampType,
    lpep_dropoff_datetime: TimestampType,
    passenger_count: Int,
    trip_distance: Float,
    RateCodeID: Byte,
    store_and_fwd_flag: Boolean,
    PULocationID: Int,
    DOLocationID: Int,
    payment_type: Byte,
    fare_amount: Float,
    extra: Float,
    mta_tax: Float,
    tip_amount: FLoat,
    tolls_amount: Float,
    improvement_surcharge:Float,
    total_amount:Float
    congestion_surcharge: Float

 */

object NyTaxiBenchmarks {

  // Converged schema with column projections
  case class YellowTaxiRide (
    //VendorID: Byte,
    pickup_datetime: TimestampType,
    //dropoff_datetime: TimestampType,
    passenger_count: Int,
    trip_distance: Float,
    //RateCodeID: Byte,
    //store_and_fwd_flag: Boolean,
    //PULocationID: Int,
    //DOLocationID: Int,
    //payment_type: Byte,
    //fare_amount: Float,
    //extra: Float,
    //mta_tax: Float,
    //tip_amount: FLoat,
    //tolls_amount: Float,
    //improvement_surcharge:Float,
    total_amount:Float
    //congestion_surcharge: Float
  )

  def main(args: Array[String]) {

    val spark = SparkSession.builder().appName("Spark SQL basic example").config("spark.some.config.option", "some-value").getOrCreate()

    // For implicit conversions like converting RDDs to DataFrames
    import spark.implicits._

    // Print working direcotory
    System.getProperty("user.dir")

    // Define Programmatic Schema
    val schema = StructType(
      List(
        StructField("pickup_datetime", TimestampType, nullable=true),        
        StructField("passenger_count", IntegerType, nullable=true),
        StructField("trip_distance", FloatType, nullable=true),
        StructField("total_amount", FloatType, nullable=true)
      )
    )
    println(schema.toDDL)

    //runBasicCountQuery(spark)

    // Load yellow taxidata
    val nyYellowTaxiDF =  loadYellowTaxiData(spark, schema)

    // Query 1
    val totRides = spark.sql("select count(*) from nyyellowtaxi")
    totRides.show()

    // Query 2
    val avgRides = spark.sql("SELECT passenger_count, avg(total_amount) FROM nyyellowtaxi GROUP BY passenger_count")
    avgRides.show()

    // Query 3
    val psgCount = spark.sql("SELECT passenger_count, year(pickup_datetime), count(*) FROM nyyellowtaxi GROUP BY passenger_count, year(pickup_datetime)")
    psgCount.show()

    // Query 4
    val psgYearCount = spark.sql("SELECT passenger_count, year(pickup_datetime) trip_year, round(trip_distance), count(*) trips FROM nyyellowtaxi GROUP BY passenger_count, year(pickup_datetime), round(trip_distance) ORDER BY trip_year, trips desc")
    psgYearCount.show()

    spark.stop()

  }

  def loadYellowTaxiData(spark: SparkSession, schema: StructType): org.apache.spark.sql.DataFrame = {

    // NyTaxi RDD
    val nyYellowTaxiRDD = spark.sparkContext.textFile("yellow_tripdata_2019-12.csv")
    nyYellowTaxiRDD.take(5).foreach(println)

    // Convert records of ride to Rows
    // Ensure there are no empty rows and fields are proper else filter appropriately
    // e.g. rowRDD.filter(row => row != null && row.length>0)
    val rowRDD = nyYellowTaxiRDD.map(_.split(",")).map(attr => Row(
      Timestamp.valueOf(attr(1)),
      attr(3).toInt,
      attr(4).toFloat,
      attr(16).toFloat
    )
    )
    rowRDD.take(5).foreach(println)
    //rowRDD.collect().foreach(f=>{println(f)})
    
    // Apply the schema to the RDD
    val nyYellowTaxiDF = spark.createDataFrame(rowRDD, schema)
    //nyYellowTaxiDF.show()

    // Creates a temporary view using the DataFrame
    nyYellowTaxiDF.createOrReplaceTempView("nyyellowtaxi")
    // nytaxiDF.createGlobalTempView("nytaxi")

    //val totRides = spark.sql("select count(*) from nyyellowtaxi")
    //totRides.show()

    return nyYellowTaxiDF;
  }

  def runBasicCountQuery(spark: SparkSession): Unit = {
    // NyTaxi RDD
    val nyGreenTaxiRDD = spark.sparkContext.textFile("green_tripdata_2013-08.csv")

    // Programmatic Schema with string values
    val schemaString = "VendorID Store_and_fwd_flag"
    val fields = schemaString.split(" ").map(fieldName => StructField(fieldName, StringType, nullable = true))
    val schema = StructType(fields)

    // Convert records of the RDD (people) to Rows
    val rowRDD = nyGreenTaxiRDD.map(_.split(",")).map(attributes => Row(attributes(0), attributes(3).trim))
    // Apply the schema to the RDD
    val nyGreenTaxiDF = spark.createDataFrame(rowRDD, schema)

    // Creates a temporary view using the DataFrame
    nyGreenTaxiDF.createOrReplaceTempView("nygreentaxi")
    // nyGreenTaxiDF.createGlobalTempView("nygreentaxi")

    // Run the query
    val totRides = spark.sql("select count(*) from nygreentaxi")

    // Show results
    totRides.show()
  }


}



