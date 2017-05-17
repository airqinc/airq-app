var mongoose = require('mongoose'),
    settings = require('../../config');

describe("Diagnostic", function() {
  var Diagnostic = require('../../models/diagnostic');
  var diagnostic = {
      "zone": "Test",
      "datetime": "2100-05-4 12:00:00",
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
      "isForecast": false,
      "alerts": []
  };

  var forecast = {
      "zone": "Test",
      "datetime": "2100-05-4 12:00:00",
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
      "isForecast": true,
      "alerts": []
  };

  Diagnostic.removeByTime(diagnostic.zone, diagnostic.datetime, diagnostic.isForecast, function(err, data) {});
  Diagnostic.removeByTime(forecast.zone, forecast.datetime, forecast.isForecast, function(err, data) {});

  it("should be able to add a new forecast", function() {
    Diagnostic.add(forecast, function(err, data) {
        expect(err).toBeNull();
        expect(data).toBeDefined();
        expect(data.zone).toEqual(forecast.zone);
        expect(data.datetime).toEqual(forecast.datetime);
        expect(data.isForecast).toEqual(forecast.isForecast);
        expect(data.alerts.length).toEqual(0);
        asyncSpecDone();
    });
    asyncSpecWait();
  });

  it("should be able to add a new diagnostic with the same datetime as a forecast", function() {
    diagnostic.alerts.push({"pollutant":"o3", "category":1})

    Diagnostic.add(diagnostic, function(err, data) {
        expect(err).toBeNull();
        expect(data).toBeDefined();
        expect(data.zone).toEqual(diagnostic.zone);
        expect(data.datetime).toEqual(diagnostic.datetime);
        expect(data.isForecast).toEqual(diagnostic.isForecast);
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
        expect(data.isForecast).toEqual(diagnostic.isForecast);
        asyncSpecDone();
    });
    asyncSpecWait();
  });

  it("should be able to get the latest diagnostic", function() {
    Diagnostic.getLatest(diagnostic.zone, diagnostic.isForecast, 1, function(err, data) {
        expect(err).toBeNull();
        expect(data).toBeDefined();
        expect(data.length).toEqual(1);
        expect(data[0].zone).toEqual(diagnostic.zone);
        expect(data[0].datetime).toEqual(diagnostic.datetime);
        expect(data[0].isForecast).toEqual(diagnostic.isForecast);
        asyncSpecDone();
    });
    asyncSpecWait();
  });

  it("should be able to remove a diagnostic", function() {
    Diagnostic.removeByTime(diagnostic.zone, diagnostic.datetime, diagnostic.isForecast, function(err, data) {
        expect(data.zone).toEqual(diagnostic.zone)
        expect(data.datetime).toEqual(diagnostic.datetime);
        expect(data.isForecast).toEqual(diagnostic.isForecast);

        Diagnostic.getByTime(diagnostic.zone, diagnostic.datetime, diagnostic.isForecast, function(err, data) {
            expect(err).toBeDefined()
            asyncSpecDone();
        });
    });
    asyncSpecWait();
  });

  Diagnostic.removeByTime(forecast.zone, forecast.datetime, forecast.isForecast, function(err, data) {});
});
