#pragma once
#include "taxirow.hpp"
#include <vector>
#include <memory>
#include <numeric>
#include <unordered_map>
#include <utility>
#include <functional>
#include <tuple>

using namespace std;

typedef vector<TaxiRow> TaxiData;
typedef unordered_map<int, TaxiData> IntTaxiGroup;
typedef unordered_map<int, float> IntTaxiGroupAvg;
typedef tuple<int, int, int> PassengerYearDistance;

struct PassengerYearDistanceHash {
  size_t operator()(PassengerYearDistance k) const {
    return get<0>(k) ^ get<1>(k) ^ get<2>(k);
  }
};

struct PassengerYearDistanceEq {
  bool operator()(const PassengerYearDistance& v0, const PassengerYearDistance& v1) const
  {
    return (
      std::get<0>(v0) == std::get<0>(v1) &&
      std::get<1>(v0) == std::get<1>(v1) &&
      std::get<2>(v0) == std::get<2>(v1)
      );
  }
};

typedef unordered_map<PassengerYearDistance, 
  TaxiData, PassengerYearDistanceHash, PassengerYearDistanceEq> TupleTaxiGroup;

// satisfies all the cases of the parallel reduce BinaryOp
struct MapReducerPaymentType {

  IntTaxiGroup operator() (IntTaxiGroup& lhs, IntTaxiGroup& rhs) {
    for (auto const& entry : rhs) {
      if (lhs.find(entry.first) == lhs.end()) {
        lhs.insert(IntTaxiGroup::value_type(entry.first, TaxiData()));
      }

      lhs[entry.first].insert(lhs[entry.first].end(), entry.second.begin(), entry.second.end());
    }
    return lhs;
  }

  IntTaxiGroup operator()(IntTaxiGroup& g, TaxiRow t) {
    if (g.find(t.paymentType) == g.end()) {
      g.insert(IntTaxiGroup::value_type(t.paymentType, TaxiData()));
    }
    g[t.paymentType].push_back(t);
    return g;
  }

  IntTaxiGroup operator()(TaxiRow t, IntTaxiGroup& g) {

    return operator()(g, t);
  }

  IntTaxiGroup operator()(TaxiRow t1, TaxiRow t2) {
    IntTaxiGroup g;
    g.insert(IntTaxiGroup::value_type(t1.paymentType, TaxiData()));
    g[t1.paymentType].push_back(t1);

    if (g.find(t2.paymentType) == g.end()) {
      g.insert(IntTaxiGroup::value_type(t2.paymentType, TaxiData()));
    }
    g[t2.paymentType].push_back(t2);

    return g;
  }
};

// Passenger count reducer
struct MapReducerPassengerCount {
  IntTaxiGroup operator() (IntTaxiGroup& lhs, IntTaxiGroup& rhs) {
    for (auto const& entry : rhs) {
      if (lhs.find(entry.first) == lhs.end()) {
        lhs.insert(IntTaxiGroup::value_type(entry.first, TaxiData()));
      }

      lhs[entry.first].insert(lhs[entry.first].end(), entry.second.begin(), entry.second.end());
    }
    return lhs;
  }

  IntTaxiGroup operator()(IntTaxiGroup& g, TaxiRow t) {
    if (g.find(t.passengerCount) == g.end()) {
      g.insert(IntTaxiGroup::value_type(t.passengerCount, TaxiData()));
    }
    g[t.passengerCount].push_back(t);
    return g;
  }

  IntTaxiGroup operator()(TaxiRow t, IntTaxiGroup& g) {

    return operator()(g, t);
  }

  IntTaxiGroup operator()(TaxiRow t1, TaxiRow t2) {
    IntTaxiGroup g;
    g.insert(IntTaxiGroup::value_type(t1.passengerCount, TaxiData()));
    g[t1.passengerCount].push_back(t1);

    if (g.find(t2.passengerCount) == g.end()) {
      g.insert(IntTaxiGroup::value_type(t2.passengerCount, TaxiData()));
    }
    g[t2.passengerCount].push_back(t2);

    return g;
  }
};

// Reducer by passenger_count, year, distance (optional)
// _includeDistance: set to "true" in order to group by the int of distance as well as passenger_count and year
struct MapReducerPassengerCountYear {

  MapReducerPassengerCountYear(bool _includeDistance = false) : includeDistance(_includeDistance) {}

  TupleTaxiGroup operator() (TupleTaxiGroup& lhs, TupleTaxiGroup& rhs) {
    for (auto const& entry : rhs) {
      if (lhs.find(entry.first) == lhs.end()) {
        lhs.insert(TupleTaxiGroup::value_type(entry.first, TaxiData()));
      }

      lhs[entry.first].insert(lhs[entry.first].end(), entry.second.begin(), entry.second.end());
    }
    return lhs;
  }

  TupleTaxiGroup operator()(TupleTaxiGroup& g, TaxiRow t) {
    auto key = make_key(t);
    if (g.find(key) == g.end()) {
      g.insert(TupleTaxiGroup::value_type(key, TaxiData()));
    }
    g[key].push_back(t);
    return g;
  }

  TupleTaxiGroup operator()(TaxiRow t, TupleTaxiGroup& g) {

    return operator()(g, t);
  }

  TupleTaxiGroup operator()(TaxiRow t1, TaxiRow t2) {

    TupleTaxiGroup g;
    auto key1 = make_key(t1);
    auto key2 = make_key(t2);

    g.insert(TupleTaxiGroup::value_type(key1, TaxiData()));
    g[key1].push_back(t1);

    if (g.find(key2) == g.end()) {
      g.insert(TupleTaxiGroup::value_type(key2, TaxiData()));
    }
    g[key2].push_back(t2);

    return g;
  }

private:
  PassengerYearDistance make_key(TaxiRow& t) {
    return make_tuple(t.passengerCount, get_year(t.pickupTime), includeDistance ? static_cast<int>(t.tripDistance) : 0);
  }

  bool includeDistance;
};