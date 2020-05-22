  #pragma once
#include <string>
#include <iostream>
#include <fstream>
#include <vector>
#include <boost/interprocess/file_mapping.hpp>
#include <boost/interprocess/mapped_region.hpp>

using namespace std;
using namespace boost::interprocess;

#include "vstreamcore.h"
  
class VSFieldIter {

public:
    VSFieldIter(string _fileName) 
      : fileName(_fileName), 
      mapped_file(_fileName.c_str(), read_only),
      mapped_file_region(mapped_file, read_only) {
    

      p = static_cast<char*>(mapped_file_region.get_address());
      sizeBytes = mapped_file_region.get_size();

      // end of current block
      pm = p + sizeBytes;
      start = p;
    }

    virtual ~VSFieldIter() {}

    template <typename T>
    T GetVal() {
      size_t sz = sizeof(T);
      if (p + sz > pm) throw - 1;
      T val = *(T*)p;
      p += sz;
      return val;
    }

    vector<string> getNextRow()
    {
      vector<string> row;

      // need to be at the start of the row or block
      if ((p == start && !IsBeginBlock())
        || (p == start + 4 && !SkipSeq()) 
        || !IsBeginRow()) {
        throw -2; // incorrect positioning
      }
      
      if (IsEndBlock())
      {
        return row;
      }

      
      do {
        // this will be the column type which we can just ignore
        // it looks like the 32-bit type + 32-bits of "0"
        GetULong();
        row.push_back(GetString());

      } while (!IsBeginRow(false));

      return row;
    }

private:

    // file size
    size_t sizeBytes;
    const int rowSize = 300;
    string fileName;

    file_mapping mapped_file;
    mapped_region mapped_file_region;

    // TODO: Not thread safe
    vector<string> curRow;
    char* p;
    char* pm;
    char* start;

    bool IsEndBlock() {
      if (p + 4 > pm) return false;
      uint32_t val = *(uint32_t*)p;
      if (val == VSTREAM_END_BLOCK) {
        return true;
      }
      return false;
    }
    bool IsBeginBlock() {
      if (p + 4 > pm) return false;
      uint32_t val = *(uint32_t*)p;
      if (val == VSTREAM_BEGIN_BLOCK) {
        p = p + 4;
        return true;
      }
      return false;
    }
    bool IsBeginRow(bool advance = true) {
      if (p + 4 > pm) return false;
      uint32_t val = *(uint32_t*)p;
      if (val == VSTREAM_BEGIN_ROW) {
        p = advance ? p + 4 : p;
        return true;
      }
      return false;
    }

    uint32_t GetUInt32() {
      return GetVal<uint32_t>();
    }

    uint64_t GetULong() {
      return GetVal<uint64_t>();
    }

    string GetString() {
      string out;
      for (; *p >= 0x20 && !IsBeginRow(false); p++) {
        out += *p;
      }
      
      return out;
    }

    bool SkipSeq() {
      for(; !IsBeginRow(false); p++) {
        ;
      }
      return true;
    }
  };
