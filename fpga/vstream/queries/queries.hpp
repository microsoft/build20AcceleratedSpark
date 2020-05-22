#pragma once

#include "taxirow.hpp"
#include <vector>
#include <algorithm>
#include <memory>
#include <chrono>
#include <functional>
#include <numeric>
#include <map>
#include <execution>
#include "helpers.hpp"
#include <tuple>

using namespace std;

class Queries {

public:
  Queries(TaxiData& _taxiData) : taxiData(_taxiData) {

    bindings.push_back(bind(&Queries::q1, this));
    bindings.push_back(bind(&Queries::q2, this));
    bindings.push_back(bind(&Queries::q3, this));
    bindings.push_back(bind(&Queries::q4, this));
  }

  function<void()> qfunc;

  size_t timeQuery(int nQuery) {

    assert(nQuery >= 0 && nQuery <= 4);

    return timeQuery(bindings[nQuery - 1]);

  }

  //select payment_type, count(*) as total from $tableName group by payment_type
  void q1() {

    auto grp = reduce(execution::par_unseq, taxiData.begin(), taxiData.end(), IntTaxiGroup(), MapReducerPaymentType());
    cout << "total size: " << grp.size() << endl;
  }

  //select passenger_count, avg(total_amount) as avg_amount from $tableName group by passenger_count
  void q2() {

    // group by passenger count
    auto grp = reduce(execution::par_unseq, taxiData.begin(), taxiData.end(), IntTaxiGroup(), MapReducerPassengerCount());
    vector<tuple<int, float>> res(grp.size());

    // create a new map from averages
    transform(execution::par_unseq, grp.begin(), grp.end(), res.begin(),
      
      [](IntTaxiGroup::value_type& entry) {

        // average each amount
        auto amount = transform_reduce(execution::par_unseq, entry.second.begin(), entry.second.end(), 0.0f, plus<float>(), [](auto& r) {return r.totalAmount; });

        amount /= entry.second.size();
        return make_tuple(entry.first, amount);
      });

    cout << "total size: " << res.size() << endl;
  }

  //select passenger_count, year(tpep_pickup_datetime) year, count(*) total FROM $tableName group by passenger_count, year
  void q3() {
    // group by passenger count and year
    auto grp = reduce(execution::par_unseq, taxiData.begin(), taxiData.end(), TupleTaxiGroup(), MapReducerPassengerCountYear(false));
    vector<tuple<int, int, size_t>> res(grp.size());

    transform(execution::par_unseq, grp.begin(), grp.end(), res.begin(),
      [](auto& entry) {return make_tuple(get<0>(entry.first), get<1>(entry.first), entry.second.size()); });

    cout << "total size: " << res.size() << endl;
  }

  //select 
  //  passenger_count, year(tpep_pickup_datetime) as year, cast(trip_distance as int) as distance, count(*) as total
  //  from $tableName
  //  group by passenger_count, year, distance
  //  order by year, total desc
  void q4() {
    auto grp = reduce(execution::par_unseq, taxiData.begin(), taxiData.end(), TupleTaxiGroup(), MapReducerPassengerCountYear(true));
    vector<tuple<int, int, int, size_t>> res(grp.size());

    transform(execution::par_unseq, grp.begin(), grp.end(), res.begin(),
      [](auto& entry) {

        return make_tuple(get<0>(entry.first), get<1>(entry.first), get<2>(entry.first), entry.second.size());

      });

    // sort descending
    sort(execution::par_unseq, res.begin(), res.end(), [](auto& t1, auto& t2) {
      int y1, d1, y2, d2;
      tie(ignore, y1, d1, ignore) = t1;
      tie(ignore, y2, d2, ignore) = t2;

      if (y1 == y2) {
        return d2 < d1;
      }

      return y2 < y1;

      });
    cout << "total size: " << res.size() << endl;

  }

private:

  TaxiData& taxiData;

  size_t timeQuery(function<void()>& qFunc) {
    auto start = std::chrono::high_resolution_clock::now();

    qFunc();

    auto end = std::chrono::high_resolution_clock::now();

    size_t total_time = std::chrono::duration_cast<std::chrono::milliseconds>(end - start).count();
    return total_time;
  }

  vector<function<void()>> bindings;
};