var mongoose = require('mongoose'),
	dbs = require('../config').dbs,
	connections = require('../db'),
  crypto = require('crypto');

var hash = function(password) {
  return crypto.createHash('sha1').update(password).digest('base64')
}

var userSchema = new mongoose.Schema({
	_id:       String,
	password:  { type: String, required: true },
	name: {
    first:  { type: String, required: true },
    last:   { type: String, required: true }
  },
  contact: {
    email: 	{ type: String, required: true },
    phone:  String,
    address: {
      address: String,
      city: {
        name: String,
        zip: String
      },
      country: String
    }
  }
}, {toObject: { virtuals: true }, toJSON: { virtuals: true }});

userSchema.virtual('nickname')
.get(function() {return this._id;})
.set(function(value) {this.set('_id', value)});

userSchema.virtual('name.full').get(function() {return this.name.first+' '+this.name.last;});

userSchema.virtual('subscriptions', {
  ref: 'Subscription',
  localField: '_id',
  foreignField: 'user'
});

var User = connections[dbs.db1.name].model("User", userSchema);

//OPERACIONES

exports.all = function(cb) {
	User.find({}, cb);
};

exports.get = function(nickname, cb) {
	User.findById(nickname, cb);
};

exports.add = function(newUser, cb) {
	var user = new User({
    nickname: newUser.nickname,
  	password: hash(newUser.password),
  	name: {
      first: newUser.name.first,
      last: newUser.name.last
    },
    contact: {
      email: 	newUser.contact.email,
      phone:  newUser.contact.phone,
      address: {
        address: newUser.contact.address.address,
        city: {
          name: newUser.contact.address.city.name,
          zip: newUser.contact.address.city.zip
        },
        country: newUser.contact.address.country
      }
    }
  });

	user.save(cb);
};

exports.update = function(nickname, newUser, cb) {
	User.findById(nickname, function(err, user) {
		user.nickname = newUser.nickname || user.nickname;
		user.password = hash(newUser.password) || user.password;

    user.name.first = newUser.name.first || user.name.first;
    user.name.last = newUser.name.last || user.name.last;

    user.contact.email = newUser.contact.email || user.contact.email;
    user.contact.phone = newUser.contact.phone || user.contact.phone;
    user.contact.address.address = newUser.contact.address.address || user.contact.address.address;
    user.contact.address.city.name = newUser.contact.address.city.name || user.contact.address.city.name;
    user.contact.address.city.zip = newUser.contact.address.city.zip || user.contact.address.city.zip;
    user.contact.address.country = newUser.contact.address.country || user.contact.address.country;

		user.save(cb);
	});
};

exports.remove = function(nickname, cb) {
	User.findByIdAndRemove(nickname, cb);
};

// OPERACIONES ADICIONALES

exports.authenticate = function(nickname, password, cb) {
  User.findById(nickname, function(err, user) {
    if (err) return cb(err);
    if (user.password === hash(password)) {
      cb(true, user);
    } else {
      cb(false, null);
    }
  })
}

exports.getSubcriptions = function(nickname, cb) {
  User.findById(nickname)
	.populate({
		path: 'subscriptions',
		select: 'zone expiration_date type -_id'
	})
	.exec(cb);
}

exports.getSubcriptionsZones = function(nickname, cb) {
  User.findById(nickname)
  .populate({
    path: 'subscriptions',
		select: 'zone expiration_date type -_id',
    populate: {
      path: 'zone_info',
			select: 'description -_id',
			model: connections[dbs.db2.name].model('Zone')
    }
  })
  .exec(cb)
}
