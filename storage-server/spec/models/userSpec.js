var mongoose = require('mongoose'),
    settings = require('../../config');

describe("User", function() {
  var User = require('../../models/user');
  var user = {
    "nickname": "user_123",
    "password": "1234",
    "name": {
      "first": "Pepe",
      "last": "Test"
    },
    "contact": {
      "email": 	"pepe@test.com",
      "phone":  "+34123456789",
      "address": {
        "address": "Test st. 1",
        "city": {
          "name": "Albacete",
          "zip": "02002"
        },
        "country": "Spain"
      }
    }
  };

  User.remove(user.nickname, function(err, data) {});

  it("should be able to add a new user", function() {
    User.add(user, function(err, data) {
      expect(err).toBeNull();
      expect(data).toBeDefined();
      expect(data.nickname).toEqual(user.nickname);
      asyncSpecDone();
    });
    asyncSpecWait();
  });

  it("should be able to get a user", function() {
    User.get(user.nickname, function(err, data) {
      expect(err).toBeNull();
      expect(data).toBeDefined();
      expect(data.nickname).toEqual(user.nickname);
      asyncSpecDone();
    });
    asyncSpecWait();
  });

  it("should be able to authenticate successfully", function() {
    User.authenticate(user.nickname, user.password, function(isOk, err) {
      expect(isOk).toBe(true);
      asyncSpecDone();
    });
    asyncSpecWait();
  });

  it("should be able to detect an incorrect password", function() {
    User.authenticate(user.nickname, 'wrongPass', function(isOk, err) {
      expect(isOk).toBe(false);
      asyncSpecDone();
    });
    asyncSpecWait();
  });

  describe("when it has a susbscription", function() {
    var Zone = require('../../models/zone');
    var zone = {
      "name": "Test",
      "description": "Test zone",
      "city_name": "Test",
      "city_zip": "02002",
      "area": 50,
      "time_zone": 1
    };
    var Subscription = require('../../models/subscription');
    var subscription = {
      "user": user.nickname,
      "zone": "Test",
      "expiration_date": "2017-05-31",
      "type": "basic"
    };

    beforeEach(function() {
      Zone.add(zone, function(err, data) {
        Subscription.add(subscription, function(err, data) {
          asyncSpecDone();
        });
      });
      asyncSpecWait();
    });

    afterEach(function() {
      Zone.remove(zone.name, function(err, data) {
        Subscription.removeByZone(subscription.user, subscription.zone, function(err, data) {
          asyncSpecDone();
        });
      });
      asyncSpecWait();
    });

    it("should be able to get the subscription", function() {
      User.getSubcriptions(user.nickname, function(err, data) {
        expect(data.subscriptions.length).toEqual(1);
        expect(data.subscriptions[0].user).toEqual(subscription.user);
        expect(data.subscriptions[0].zone).toEqual(subscription.zone);
        asyncSpecDone();
      });
      asyncSpecWait();
    });

    it("should be able to get the subscription with its zone", function() {
      User.getSubcriptionsZones(user.nickname, function(err, data) {
        expect(data.subscriptions[0].zone_info.length).toEqual(1);
        expect(data.subscriptions[0].zone_info[0].name).toEqual(subscription.zone);
        asyncSpecDone();
      });
      asyncSpecWait();
    });
  });

  it("should be able to remove a user", function() {
    User.remove(user.nickname, function(err, data) {
      expect(data.nickname).toEqual(user.nickname);

      User.get(user.nickname, function(err, data) {
          expect(err).toBeDefined()
          asyncSpecDone();
      });
    });
    asyncSpecWait();
  });

});
