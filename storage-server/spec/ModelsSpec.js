var mongoose = require('mongoose'),
    settings = require('../config');

describe("Zone", function() {
  var Zone = require('../models/zone');
  var zone = {
    "name": "Test",
    "description": "Test zone",
    "city_name": "Test",
    "city_zip": "02002",
    "area": 50,
    "time_zone": 1
  }
  var station = {
    "zone": "Test",
    "name": "Campus",
    "latitude": 40.43972222,
    "longitude": -3.690277778
  }

  Zone.remove(zone.name, function(err, data) {});

  it("should be able to add a new zone", function() {
    Zone.add(zone, function(err, data) {
        expect(err).toBeNull();
        expect(data).toBeDefined();
        expect(data.name).toEqual(zone.name);
        asyncSpecDone();
    });
    asyncSpecWait();
  });

  it("should be able to get a zone", function() {
    Zone.get(zone.name, function(err, data) {
        expect(err).toBeNull();
        expect(data).toBeDefined();
        expect(data.name).toEqual(zone.name);
        asyncSpecDone();
    });
    asyncSpecWait();
  });


  it("should be able to add a station", function() {
    Zone.addStation(zone.name, station.zone+'-'+station.name, function() {
        Zone.get(zone.name, function(err, data) {
            expect(data.stations.length).toEqual(1)
            expect(data.stations[0]).toEqual(station.zone+'-'+station.name)
            asyncSpecDone();
        });
    });
    asyncSpecWait();
  });

  it("should be able to remove a station", function() {
    Zone.removeStation(zone.name, station.zone+'-'+station.name, function() {
        Zone.get(zone.name, function(err, data) {
            expect(data.stations.length).toEqual(0)
            asyncSpecDone();
        });
    });
    asyncSpecWait();
  });


  it("should be able to remove a zone", function() {
    Zone.remove(zone.name, function(err, data) {
        expect(data.name).toEqual(zone.name)

        Zone.get(zone.name, function(err, data) {
            expect(err).toBeDefined()
            asyncSpecDone();
        });
    });
    asyncSpecWait();
  });
});
