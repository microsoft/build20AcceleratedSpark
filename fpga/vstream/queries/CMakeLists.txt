cmake_minimum_required(VERSION 3.15)

project(cqueries VERSION 0.1)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED True)

set(Boost_USE_STATIC_LIBS ON)
set(Boost_USE_MULTITHREADED ON)
set(Boost_USE_STATIC_RUNTIME OFF)

if(WIN32)
    set(BOOST_INSTALLED "c:\\local\\boost_1_73_0" CACHE PATH "Boost installation path" FORCE)
    set(ENV{BOOST_ROOT} ${BOOST_INSTALLED})
    set(ENV{BOOST_INCLUDEDIR} ${BOOST_INSTALLED})
    set(ENV{BOOST_LIBRARYDIR} "${BOOST_INSTALLED}\\lib64-msvc-14.2")
endif()

find_package(Boost 1.65.1 COMPONENTS REQUIRED date_time)

message(STATUS "${Boost_LIBRARIES}")
message(STATUS "${Boost_INCLUDE_DIR}")

set(CQUERIES_SOURCES 
    cqueries.cpp 
    )

set(VSTREAM_PARSER_DIR parser)

add_executable(cqueries ${CQUERIES_SOURCES})
target_link_libraries(cqueries PUBLIC ${Boost_LIBRARIES})
target_include_directories(cqueries PRIVATE ${VSTREAM_PARSER_DIR} ${Boost_INCLUDE_DIR})
