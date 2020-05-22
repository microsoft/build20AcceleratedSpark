// *********************************************************************
//            Copyright (C) Microsoft. All rights reserved.
// *********************************************************************
#include <Windows.h>

#include <chrono>
#include <fstream>
#include <iostream>
#include <memory>
#include <string>
#include <vector>
#include <sstream>

#include "Mison/Config.h"
#include "Mison/CsvParser.h"
#include "Mison/CsvReader.h"
#include "Mison/CsvValue.h"
#include "Mison/Field.h"
#include "Mison/JsonParser.h"
#include "Mison/JsonReader.h"
#include "Mison/JsonValue.h"
#include "Mison/Nullable.h"
#include "Mison/Record.h"
#include "Mison/Records.h"

using namespace Mison;

/// <summary>
/// Extract three integer fields from TPC-H lineitem CSV file.
/// Expected parsing throughput: ~835MB/s (Intel Haswell 3.5GHz CPU).
/// </summary>
void CsvParserTpchBenchmark(std::string& path) {
  std::cout << std::endl;
  std::cout << "##### Csv Parser TPC-H lineitem parsing benchmark #####" << std::endl;

  // Extract the first, second, and fifth (integer) fields.
  Config config;
  config.csv.field_delimiter = ',';


for (size_t i = 0; i < 18; i++) {
    std::vector<std::string> fields;

    for (size_t j = 0; j <= i; j++) {
      std::stringstream ss;
      ss << "$" << j;
      fields.push_back(ss.str());
    }
 
    Mison::CsvParser parser(fields, config);

    // Preload data into memory, to exclude I/O time.
    std::unique_ptr<std::ifstream> file(new std::ifstream(path, std::ifstream::binary));

    file->seekg(0, file->end);
    size_t length = file->tellg();

    char* buffer = new char[length];
    file->seekg(0, file->beg);

    // Start timer.
    auto start = std::chrono::high_resolution_clock::now();

    file->read(buffer, length);

    CsvRecords records = parser.Parse(buffer, length, false);

    size_t count = 0;
    int v;
    double d;
    NullableString s;

    for (const CsvRecord& record : records) {
      for (const CsvValue& field_value : record) {
        StringRef string;
        switch (field_value.FieldId()) {
          case 0:
            field_value.GetAsString();
            break;
          case 1:
            field_value.GetAsDateTime().Value();
            break;
          case 2:
            field_value.GetAsDateTime().Value();
            break;
          case 3:
            field_value.GetAsInt().Value();
            break;
          case 4:
            field_value.GetAsDouble().Value();
            break;
          case 5:
            field_value.GetAsDouble().Value();
            break;
          case 6:
            field_value.GetAsString().Value();
            break;
          case 7:
            field_value.GetAsString().Value();
            break;
          case 8:
            field_value.GetAsString().Value();
            break;
          case 9:
            field_value.GetAsString().Value();
            break;
          case 10:
            field_value.GetAsDouble().Value();
            break;
          case 11:
            field_value.GetAsRawText();
            break;
          case 12:
            field_value.GetAsDouble().Value();
            break;
          case 13:
            field_value.GetAsDouble().Value();
            break;
          case 14:
            field_value.GetAsDouble().Value();
            break;
          case 15:
            field_value.GetAsDouble().Value();
            break;
          case 16:
            field_value.GetAsDouble().Value();
            break;
          case 17:
            field_value.GetAsDouble().Value();
            break;
        }
      }
      count++;
    }

    // Stop timer.
    auto end = std::chrono::high_resolution_clock::now();
    size_t time = std::chrono::duration_cast<std::chrono::microseconds>(end - start).count();

    std::cout << "========================== Cols: " << fields.size() << std::endl;
    std::cout << "Parsed " << count << " records." << std::endl;
    std::cout << "Parsing time: " << time / 1000.0 << " ms" << std::endl;
    std::cout << "Pasrsing throughput: " << static_cast<double>(length) / time << " MB/s"
              << std::endl;

    delete[] buffer;
  }
}

int main(int argc, char** argv) {
  SetThreadAffinityMask(GetCurrentThread(), 1);
  std::vector<std::string> paths = {// R"(G:\taxi_data\yellow_tripdata_2019-12.csv)",
                                    R"(G:\taxi_data\yellow_tripdata_2012-03.csv)"};

  for (auto s : paths) {
    CsvParserTpchBenchmark(s);
    //    CsvReaderTpchBenchmark();
  }
  return 0;
}