var mongoose = require('mongoose'),
    settings = require('../../config');

describe("Diagnostic", function() {
  var Diagnostic = require('../../models/diagnostic');
  var diagnostic = {
      "zone": "Test",
      "datetime": "2017-05-4 12:00:00",
      "dayName": "Thursday",
      "dominentpol": "pm25",
      "iaqi": {
          "o3": 35,
          "pm25": 21,
          "pm10": 9,
          "co": 0.1,
          "so2": 2.6,
          "no2": 7.8,
          "t": 25.92,
          "h": 24,
          "p": 1009
      },
      "aemet": {
          "humidity": 38,
          "windSpeed": 12,
          "rainfall": 0,
          "windChill": 25,
          "temperature": 25,
          "windDirection": "E"
      },
      "isForecast": 0,
      "alerts": []
  };

  var forecast = {
      "zone": "Test",
      "datetime": "2017-05-4 12:00:00",
      "dayName": "Thursday",
      "dominentpol": "pm25",
      "iaqi": {
          "o3": 35,
          "pm25": 21,
          "pm10": 9,
          "co": 0.1,
          "so2": 2.6,
          "no2": 7.8,
          "t": 25.92,
          "h": 24,
          "p": 1009
      },
      "aemet": {
          "humidity": 38,
          "windSpeed": 12,
          "rainfall": 0,
          "windChill": 25,
          "temperature": 25,
          "windDirection": "E"
      },
      "isForecast": 1,
      "alerts": []
  };

  Diagnostic.removeByTime(diagnostic.zone, diagnostic.datetime, diagnostic.isForecast, function(err, data) {});

  it("should be able to add a new diagnostic with alerts", function() {
    diagnostic.alerts.push({"pollutant":"o3", "category":1})

    Diagnostic.add(diagnostic, function(err, data) {
        expect(err).toBeNull();
        expect(data).toBeDefined();
        expect(data.zone).toEqual(diagnostic.zone);
        expect(data.datetime).toEqual(diagnostic.datetime);
        expect(data.alerts.length).toEqual(1);
        asyncSpecDone();
    });
    asyncSpecWait();
  });

  it("should be able to get a diagnostic", function() {
    Diagnostic.getByTime(diagnostic.zone, diagnostic.datetime, diagnostic.isForecast, function(err, data) {
        expect(err).toBeNull();
        expect(data).toBeDefined();
        expect(data.zone).toEqual(diagnostic.zone);
        expect(data.datetime).toEqual(diagnostic.datetime);
        expect(data.isForecast).toEqual(false);
        asyncSpecDone();
    });
    asyncSpecWait();
  });

  it("should be able to remove a diagnostic", function() {
    Diagnostic.removeByTime(diagnostic.zone, diagnostic.datetime, diagnostic.isForecast, function(err, data) {
        expect(data.zone).toEqual(diagnostic.zone)
        expect(data.datetime).toEqual(diagnostic.datetime);
        expect(data.isForecast).toEqual(false);

        Diagnostic.getByTime(diagnostic.zone, diagnostic.datetime, diagnostic.isForecast, function(err, data) {
            expect(err).toBeDefined()
            asyncSpecDone();
        });
    });
    asyncSpecWait();
  });
});
