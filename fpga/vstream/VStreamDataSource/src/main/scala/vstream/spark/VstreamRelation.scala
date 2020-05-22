package vstream.spark

import org.apache.spark.rdd.RDD
import org.apache.spark.sql.execution.datasources.csv.CSVDataSource
import org.apache.spark.sql.sources.{BaseRelation, Filter, PrunedFilteredScan}
import org.apache.spark.sql.types.StructType
import org.apache.spark.sql.{Row, SQLContext}
import org.apache.spark.{Partition, TaskContext}

class VstreamRelation(val _sqlContext: SQLContext, val _schema: StructType)
  extends BaseRelation
    with PrunedFilteredScan {
  override def sqlContext: SQLContext = _sqlContext

  override def schema: StructType = _schema

  // do build scan
  override def buildScan(requiredColumns: Array[String], filters: Array[Filter]): RDD[Row] = {

    // return new RDD[Row]
    new CSVDataSource[Row](sqlContext.sparkContext, Nil) {
      override def compute(split: Partition, context: TaskContext): Iterator[Row] = ???

      override protected def getPartitions: Array[Partition] = Array.empty
    }
  }

  override def toString: String = "VStreamProvider"
}
