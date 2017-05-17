var express = require('express'),
  router = express.Router();

//=====================================
// SIGNUP ==============================
// =====================================
// show the signup form
router.get('/', function(req, res) {
  // render the page and pass in any flash data if it exists
  res.render('signup', {
    message: req.flash('signupMessage')
  });
});
var Users = [];

router.post('/', function(req, res) {
  if (!req.body.nickname || !req.body.password) {
    res.status("400");
    res.send("Invalid details!");
  } else {
    //TODO: check if user exists
    var newUser = {
      "nickname": req.body.nickname,
      "password": hash(req.body.password),
      "name": {
        "first": "Pepe",
        "last": "Test"
      },
      "contact": {
        "nickname": "nickname",
        "phone": "+34123456789",
        "address": {
          "address": "Test st. 1",
          "city": {
            "name": "Albacete",
            "zip": "02002"
          },
          "country": "Spain"
        }
      }
    }
    var request = require('request');
    request.post(
      'http://localhost:3000/users', {
        json: newUser
      },
      function(error, response, body) {
        if (!error && response.statusCode == 200) {
          console.log(body)
        }
      }
    );
    req.session.user = newUser;
    res.redirect('/dashboard');
  }
});

module.exports = router
