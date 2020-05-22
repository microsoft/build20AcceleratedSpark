#pragma once

#define VSTREAM_VERSION                                    0x10101010


#define VSTREAM_BEGIN_BLOCK                          0x73A0A073      
#define VSTREAM_END_BLOCK                0x74A0A074

#define VSTREAM_BEGIN_ROW              0x71A0A071

#define VSTREAM_END_ROW                                0x72A0A072

#define VSTREAM_LITTLE_ENDIAN                        0x10101010 
#define VSTREAM_BIG_ENDIAN                             0x11111111

#define VSTREAM_BEGIN_META                                          0x77202077
#define VSTREAM_END_META                               0x76202076

#define VSTREAM_SCHEMA_DEFINITION                           0x75242475
#define VSTREAM_END_SCHEMA_DEFINITION   0x75121275
#define VSTREAM_COLUMN_DEFINITION            0x75464675
#define VSTREAM_END_COLUMN_DEFINITION  0x75323275

// indicating no VStream data follows
#define VSTREAM_TERMINATE  0x7FFFFF7F

// Typecodes are 32 bits in length
//
#define VSTREAM_TYPECODE_NULL                                    0
#define VSTREAM_TYPECODE_BYTE                                    1
#define VSTREAM_TYPECODE_CHAR                                   2
#define VSTREAM_TYPECODE_INT8                                     3
#define VSTREAM_TYPECODE_BOOL                                   4

#define VSTREAM_TYPECODE_INT16                                  5
#define VSTREAM_TYPECODE_UINT16                                6
#define VSTREAM_TYPECODE_WCHAR32                           7
#define VSTREAM_TYPECODE_INT32                                  8
#define VSTREAM_TYPECODE_UINT32                                9
#define VSTREAM_TYPECODE_INT64                                  10
#define VSTREAM_TYPECODE_UINT64                                11

// IEEE 754 4 byte
#define VSTREAM_TYPECODE_FLOAT                                 12

// IEEE 754 8 byte
#define VSTREAM_TYPECODE_DOUBLE                              13

// Seconds since Unix epoch
#define VSTREAM_TYPECODE_TIMESTAMP_SEC  14

// Milliseconds into UNIX epoch
#define VSTREAM_TYPECODE_TIMESTAMP_MIL 15

// Microseconds into the UNIX epoch
#define VSTREAM_TYPECODE_TIMESTAMP_MIC              16

// Nanoseconds into the UNIX epoch
#define VSTREAM_TYPECODE_TIMESTAMP_NAN             17

#define VSTREAM_DYNAMIC_TYPE_MARKER     18

#define VSTREAM_TYPECODE_UUID           19                                   // Linux memory ordering

// 64 bit length prefixed on all of these
//
#define VSTREAM_TYPECODE_UTF8_STRING      20
#define VSTREAM_TYPEOCDE_UTF16_STRING   21
#define VSTREAM_TYPECODE_UTF32_STRING    22

#define VSTREAM_TYPECODE_BUFFER         23

#define VSTREAM_TYPECODE_TUPLE          24

#define VSTREAM_TYPECODE_VECTOR         25

#define VSTREAM_TYPECODE_MAP            26

// 64 bit length prefix, otherwise encoded as UTF8 string
//
#define VSTREAM_TYPECODE_JSON                                    27

#define VSTREAM_TYPECODE_LAST     28



#define VSTREAM_DATEFORMAT_YYYY_MM_DD                                          0x0001                // Space, - or / delimiters
#define VSTREAM_DATEFORMAT_YYYYMMDD                                                            0x0002                // No delimiters
#define VSTREAM_DATEFORMAT_MM_DD_YYYY             0x0004                
#define VSTREAM_DATEFORMAT_DD_MM_YYYY                                                       0x0008
#define VSTREAM_DATEFORMAT_DD_MONTHNAME_YYYY         0x0010
#define VSTERAM_DATEFORMAT_MM_DD_YY                                                            0x0020
#define VSTREAM_DATEFORMAT_MNAME_DD_YYYY                                 0x0040                

#define VSTREAM_TIMEFORMAT_HH_MM_SS                                                            0x1000
#define VSTREAM_TIMEFORMAT_HHMMSS                                                                 0x2000
#define VSTREAM_TIMEFORMAT_HH_MM                                                                  0x4000

#define VSTREAM_DATEFORMAT_SPARK_DEFINED                                      0x8000


#define VSTREAM_TIMEFORMAT_AM_PM                                                     0x00010000
#define VSTREAM_TIMEFORMAT_FRACTIONAL_SECONDS   0x00020000

#define VSTREAM_TIMEZONE_NONE                                                              0x00040000
#define VSTREAM_TIMEZONE_Z                                                                                     0x00080000
#define VSTREAM_TIMEZONE_UTCOFFSET                                                    0x00100000