var request = require('request');

var User = {
  "nickname": String,
  "password": String,
  "name": {
    "first": String,
    "last": String
  },
  "contact": {
    "nickname": String,
    "phone": String,
    "address": {
      "address": String,
      "city": {
        "name": String,
        "zip": String
      },
      "country": String
    }
  }
}

// User.new = function(){
//   return User;
// }

User.add = function(newUser, cb) {
  var request = require('request');

  request.post(
    'http://localhost:3000/users', {
      json: newUser
    },
    function(error, response, body) {
      if (!error && response.statusCode == 200) {
        console.log(body);
        cb(newUser);
      } else {
        console.log(body);
        console.log(newUser)
        cb('error')
      }
    }
  );
}

User.authenticate = function(user, cb) {
  json_payload = {
    "nickname": user.nickname,
    "password": user.password
  }
  request.post(
    'http://localhost:3000/users/authenticate', {
      json: json_payload
    },
    function(error, response, body) {
      if (!error && response.statusCode == 200) {
        console.log(body, body.isOk)
        cb(body.isOk)
      }
      else{
        cb('error')
      }
    }
  );
}

module.exports = User
