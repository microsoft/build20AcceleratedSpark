#pragma once

#include <ctime>

struct TaxiRow {
  char vendorId;
  std::tm pickupTime;
  std::tm dropOffTime;
  int passengerCount;
  float tripDistance;
  char rateCode;
  int storeAndFwdFlag;
  int puLocId;
  int doLocId;
  int paymentType;
  float fareAmount;
  float extra;
  float taxAmount;
  float tipAmount;
  float tollsAmount;
  float improvementSurcharge;
  float totalAmount;
  float congestionSurcharge;
};

void parse_time(tm* timestruct, string& dt)
{
  *timestruct = {};
  istringstream ss(dt);
  ss >> get_time(timestruct, "%Y-%m-%d %H:%M:%S");
}

int get_year(tm& dt)
{
  return 1900 + dt.tm_year;
}

TaxiRow parse_taxi_row(vector<string>& row) {

  TaxiRow taxiRow;

  taxiRow.vendorId = stoi(row[0]);
  parse_time(&taxiRow.pickupTime, row[1]);
  parse_time(&taxiRow.dropOffTime, row[2]);

  taxiRow.passengerCount = stoi(row[3]);
  taxiRow.tripDistance = stof(row[4]);
  taxiRow.rateCode = stoi(row[5]);
  taxiRow.storeAndFwdFlag = row[6][0];
  taxiRow.puLocId = stoi(row[7]);
  taxiRow.doLocId = stoi(row[8]);
  taxiRow.paymentType = stoi(row[9]);
  taxiRow.fareAmount = stof(row[10]);
  taxiRow.extra = stof(row[11]);
  taxiRow.taxAmount = stof(row[12]);
  taxiRow.tipAmount = stof(row[13]);
  taxiRow.tollsAmount = stof(row[14]);
  taxiRow.improvementSurcharge = stof(row[15]);
  taxiRow.totalAmount = stof(row[16]);
  taxiRow.congestionSurcharge = stof(row[17]);
  return taxiRow;
}

