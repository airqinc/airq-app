var express = require('express');
var router = express.Router();

crypto = require('crypto');
var hash = function(password) {
  return crypto.createHash('sha1').update(password).digest('base64')
}

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

//=====================================
// SIGNUP ==============================
// =====================================
// show the signup form
router.get('/signup', function(req, res) {
  // render the page and pass in any flash data if it exists
  res.render('signup', {
    message: req.flash('signupMessage')
  });
});

router.post('/signup', function(req, res) {
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

// =====================================
// LOGIN ===============================
// =====================================
// show the login form
router.get('/login', function(req, res) {
  // render the page and pass in any flash data if it exists
  res.render('login', {
    message: req.flash('loginMessage')
  });
});

router.post('/login', function(req, res) {
  var request = require('request');
  user = {
    "nickname": req.body.nickname,
    "password": hash(req.body.password)
  }
  request.post(
    'http://localhost:3000/users/authenticate', {
      json: user
    },
    function(error, response, body) {
      if (!error && response.statusCode == 200) {
        console.log(body, body.isOk)
        req.session.user = user;
        res.redirect('/dashboard');
      }
    }
  );
});

//=====================================
// LOGOUT ==============================
// =====================================
router.get('/logout', function(req, res) {
  req.session.destroy();
  res.redirect('/');
});

module.exports = router;
