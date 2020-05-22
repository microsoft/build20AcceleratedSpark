package vstream.spark

import org.apache.spark.sql.SQLContext
import org.apache.spark.sql.sources.{BaseRelation, DataSourceRegister, SchemaRelationProvider}
import org.apache.spark.sql.types.StructType

class VStreamRelationProvider extends DataSourceRegister
  with SchemaRelationProvider {
  override def shortName(): String = VStreamRelationProvider.SHORT_NAME

  // Create relation
  override def createRelation(_sqlContext: SQLContext,
    parameters: Map[String, String],
    _schema: StructType
  ): BaseRelation = {

    new VstreamRelation(_sqlContext, _schema)
  }
}

object VStreamRelationProvider {
  val SHORT_NAME = "vstream"
}

