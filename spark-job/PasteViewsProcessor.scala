import org.apache.spark.sql.SparkSession
import org.apache.spark.sql.functions._
import org.apache.spark.sql.streaming.Trigger
import redis.clients.jedis.Jedis

object PasteViewsProcessor {
  def main(args: Array[String]): Unit = {
    val spark = SparkSession.builder
      .appName("PasteViewsProcessor")
      .master("spark://spark-master:7077")
      .getOrCreate()

    import spark.implicits._

    val batchInterval = "1 hour"

    val kafkaStream = spark.readStream
      .format("kafka")
      .option("kafka.bootstrap.servers", "kafka:9092")
      .option("subscribe", "paste-views")
      .load()

    val pasteViews = kafkaStream.selectExpr("CAST(value AS STRING)")
      .as[(String)]
      .map(_.split(","))
      .map(arr => (arr(0), arr(1)))
      .toDF("pasteId", "timestamp")

    val windowedCounts = pasteViews
      .groupBy($"pasteId")
      .count()

    val query = windowedCounts.writeStream
      .foreachBatch { (batchDF: org.apache.spark.sql.DataFrame, batchId: Long) =>
        batchDF.foreachPartition { partition =>
          val jedis = new Jedis("redis", 6379)
          partition.foreach { row =>
            val pasteId = row.getAs[String]("pasteId")
            val count = row.getAs[Long]("count")

            jedis.incrBy(s"paste:$pasteId:total_views", count)
          }
          jedis.close()
        }
      }
      .outputMode("update")
      .trigger(Trigger.ProcessingTime(batchInterval))
      .start()

    query.awaitTermination()
  }
}