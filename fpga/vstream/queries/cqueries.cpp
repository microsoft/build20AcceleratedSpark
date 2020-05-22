#include <iostream>
#include <vector>
#include <string>
#include <ctime>
#include <filesystem>
#include <iomanip>
#include <sstream>

#include "field_iter.h"
#include "taxirow.hpp"
#include "queries.hpp"

using namespace std;

int main(int argc, char* argv[]) {

  if (argc < 3) {
    cout << "Specify vstream directory and query number on the command line:" << endl << "   cqueries /path/to/vstream 3";
    return 1;
  }

  string path(argv[1]);

  vector<TaxiRow> taxiRows;

  for (const auto& entry : filesystem::directory_iterator(path)) {
    VSFieldIter vsParser(entry.path().string());

    for (vector<string> row = vsParser.getNextRow(); !row.empty(); row = vsParser.getNextRow()) {

      if (row.size() != 18) {
        cout << "corrupt row found: " << taxiRows.size() << endl;
        continue;
      }

      taxiRows.push_back(parse_taxi_row(row));
    }

    cout << taxiRows.size() << endl;
    //*******************
    //TODO: DEBUG ONLY. Break after the frist file!!!!!
    //********************
    break;
  }

  Queries queries(taxiRows);
  int n = atoi(argv[2]);
  auto total_time = queries.timeQuery(n);
  cout << "Runtime of Query "<<n << ": " << total_time << " ms" << endl;

  return 0;
}
