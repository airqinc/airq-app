var mongoose = require('mongoose'),
	dbs = require('../config').dbs,
	connections = require('../db');

var subscriptionSchema = new mongoose.Schema({
	user:  { type: String, required: true, ref: 'User' },
	zone:  { type: String, required: true },
  expiration_date:  { type: String, required: true },
  type:  { type: String, required: true, enum: ['basic', 'premium']},
}, {toObject: { virtuals: true }, toJSON: { virtuals: true }});

subscriptionSchema.index({ user: 1, zone: 1}, { unique: true });

subscriptionSchema.query.byZone = function(user, zone) {
    return this.findOne({ user: user, zone: zone });
};

subscriptionSchema.virtual('zone_info', {
  ref: 'Zone',
  localField: 'zone',
  foreignField: 'name'
});

var Subscription = connections[dbs.db1.name].model("Subscription", subscriptionSchema);

//OPERACIONES

exports.all = function(cb) {
	Subscription.find({}, cb);
};

exports.get = function(id, cb) {
	Subscription.findById(id, cb);
};

exports.getByZone = function(user, zone, cb) {
  Subscription.find().byZone(user, zone).exec(cb);
};

exports.add = function(newSubscription, cb) {
	var subscription = new Subscription({
    user: newSubscription.user,
  	zone: newSubscription.zone,
    expiration_date: newSubscription.expiration_date,
    type: newSubscription.type
  });

	subscription.save(cb);
};

exports.update = function(id, newSubscription, cb) {
	Subscription.findById(id, function(err, subscription) {
		subscription.user = newSubscription.user || subscription.user;
		subscription.zone = newSubscription.zone || subscription.zone;
    subscription.expiration_date = newSubscription.expiration_date || subscription.expiration_date;
    subscription.type = newSubscription.type || subscription.type;

		subscription.save(cb);
	});
};

exports.remove = function(id, cb) {
	Subscription.findByIdAndRemove(id, cb);
};

exports.removeByZone = function(user, zone, cb) {
  Subscription.findOneAndRemove({ user: user, zone: zone }, cb);
};

// OPERACIONES ADICIONALES
