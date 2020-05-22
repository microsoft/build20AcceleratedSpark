import org.apache.spark.sql.functions.{_ => F}
import org.apache.spark.sql.SparkSession
import org.apache.spark.sql.functions._
import org.apache.spark.sql.types._
import org.apache.spark.sql.DataFrame
import org.apache.log4j._
import org.apache.spark.SparkConf
import org.apache.spark.sql.streaming.Trigger

import sys.process._
import java.io.File
import java.nio.file.{Files, Paths, StandardCopyOption}

import scala.io.Source
import org.apache.commons.io.FilenameUtils

object Benchmark {

    def main(queryIdx: Int = 1, data_path: String = "~/data/taxi_data_cleaned_18_standard", 
        home_dir: String = "~/git/PipeDream/.image", out_path: String="~/data/fpga_queries",
        start: Int=0, count: Int = 0, verbose: Boolean = false) = {

        val taxi_files = new File(data_path).listFiles.drop(start)
        val total = if (count > 0) count else taxi_files.length
        
        println(s"total files: $total")

        val taxi_idxs = start to (total - 1 + start)
        val taxi_data_copy = s"${data_path}_copy"

        println(s"total idxs: ${taxi_idxs.size}")

        val out_dir_res = new File(s"${out_path}/q_${queryIdx}/results")
        val times_dir = new File(s"${out_path}/q_${queryIdx}/monitor")
        
        if(! out_dir_res.exists()) {
            out_dir_res.mkdirs()
        }

        if(! times_dir.exists()) {
            times_dir.mkdirs()
        }

        for(file_id <- taxi_idxs zip taxi_files) {
            file_id match {
                case (idx, taxi_file) => {
                    // fix the file
                    val lineSize = Source.fromFile(taxi_file).getLines.take(1).toList.head.split(',').size

                    val proc = 
                        Process(s"${home_dir}/acceltesthw --file_name ${taxi_file} --query_mode=${queryIdx + 1} --accel_type=0 --num_cols=$lineSize", 
                            new File(home_dir))

                    println(s"Starting. Cols $lineSize, name: $taxi_file")
                    if (verbose) proc.! else proc.!!
                    println(s"Completed")

                    val suffix = FilenameUtils.getBaseName(taxi_file.toString)

                    Files.move(
                        Paths.get(s"${home_dir}/fpga_time.csv"),
                        Paths.get(s"${times_dir.toString}/fpga_time_${suffix}.csv"),
                        StandardCopyOption.REPLACE_EXISTING
                    )
                    for {
                        files <- Option(new File(home_dir).listFiles())
                        file <- files if file.getName.endsWith(".log")
                    } file.delete()
                    
                    // Files.move(
                    //     Paths.get(s"${home_dir}/q1out.csv"),
                    //     Paths.get(s"${out_dir_res.toString}/q0out_${suffix}.csv"),
                    //     StandardCopyOption.REPLACE_EXISTING
                    // )

                    Files.move(
                        Paths.get(s"${home_dir}/q${queryIdx + 1}out.csv"),
                        Paths.get(s"${out_dir_res.toString}/q${queryIdx}out_${suffix}.csv"),
                        StandardCopyOption.REPLACE_EXISTING
                    )

                    // val file_name = new File(taxi_file.toString).getName
                    // Files.move(
                    //     Paths.get(taxi_file.toString),
                    //     Paths.get(s"${taxi_data_copy}/${file_name}"),
                    //     StandardCopyOption.REPLACE_EXISTING
                    // )

                }
            }
        }

    }
}
