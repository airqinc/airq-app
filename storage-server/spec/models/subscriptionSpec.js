var mongoose = require('mongoose'),
    settings = require('../../config');

describe("Subscription", function() {
  var Subscription = require('../../models/subscription');
  var subscription = {
    "user": "user_123",
    "zone": "Test",
    "expiration_date": "2017-05-31",
    "type": "basic"
  };

  Subscription.removeByZone(subscription.user, subscription.zone, function(err, data) {});

  it("should be able to add a new subscription", function() {
    Subscription.add(subscription, function(err, data) {
      expect(err).toBeNull();
      expect(data).toBeDefined();
      expect(data.user).toEqual(subscription.user);
      expect(data.zone).toEqual(subscription.zone);
      asyncSpecDone();
    });
    asyncSpecWait();
  });

  it("should be able to get a subscription", function() {
    Subscription.getByZone(subscription.user, subscription.zone, function(err, data) {
      expect(err).toBeNull();
      expect(data).toBeDefined();
      expect(data.user).toEqual(subscription.user);
      expect(data.zone).toEqual(subscription.zone);
      asyncSpecDone();
    });
    asyncSpecWait();
  });

  it("should be able to remove a subscription", function() {
    Subscription.removeByZone(subscription.user, subscription.zone, function(err, data) {
      expect(data.user).toEqual(subscription.user);
      expect(data.zone).toEqual(subscription.zone);

      Subscription.getByZone(subscription.user, subscription.zone, function(err, data) {
          expect(err).toBeDefined()
          asyncSpecDone();
      });
    });
    asyncSpecWait();
  });
});
