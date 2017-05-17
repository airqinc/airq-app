// load the things we need
// var mongoose = require('mongoose');
// var bcrypt = require('bcrypt-nodejs');

crypto = require('crypto');

var hash = function(password) {
  return crypto.createHash('sha1').update(password).digest('base64')
}

// define the schema for our user model
// var userSchema = mongoose.Schema({
//   local: {
//     email: String,
//     password: String,
//   }
// });
var userModel = {
  password:  String,
	name: {
    first:  String,
    last:   String,
  },
  contact: {
    email: 	String,
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
}

userModel.generateHash = hash

userModel.validPassword = function(password) {
  return 1;
};

// methods ======================
// generating a hash
// userSchema.methods.generateHash = function(password) {
//   return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
// };
//
// // checking if password is valid
// userSchema.methods.validPassword = function(password) {
//   return bcrypt.compareSync(password, this.local.password);
// };

// create the model for users and expose it to our app
// module.exports = mongoose.model('User', userSchema);
module.exports = userModel
