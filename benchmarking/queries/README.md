To run, do following

*Install AzureXRT stuff
  cd AzureXRTPackages
  sudo apt install ./*.deb
Reboot the machine.

run
  source /opt/xilinx/xrt/setup.sh
  xbutil validate

this should pass

* Install required tools using following commands 
      sudo apt-get install uuid-dev
      sudo apt-get install libssl-dev 
      sudo apt-get install build-essential
      sudo apt-get install gcc-8
      sudo apt-get install g++-8 
      sudo update-alternatives --install /usr/bin/gcc gcc /usr/bin/gcc-8 60 --slave /usr/bin/g++ g++ /usr/bin/g++-8
      sudo apt install python

* Install cmake. Follow instructions from https://linux4one.com/how-to-install-cmake-on-ubuntu-18-04-linux/

* Setup environment variables (Add it in .bashrc file for convenience) 
     export WFDS_BUILD_ROOT=/home/boris/fpga_demo
     export LD_LIBRARY_PATH=/home/boris/fpga_demo/cpp/external_libs/poco.1.9.2/lib

* Build boost and Poco
 Go to  cpp/external_libs/poco.1.9.2 and run the buildall.sh script. 
 Go to  cpp/external_libs/boost and run the buildall.sh script. 

* Go to build_output/global
 cmake ../../
 cd accel
 make acceltesthw
  

* Run executable like 
  go to fpga_demo
  cpp/build_output/bin/acceltesthw hw -file yellow_tripdata_2019-12.csv
Generates vstream_<csv-file> directory with VStream output
Use smaller csv file for now. Big ones have issues

