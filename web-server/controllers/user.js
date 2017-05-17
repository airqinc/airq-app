var express = require('express');
var router = express.Router();
var User = require('../models/user')

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
      "password": req.body.password,
      "name": {
        "first": "Pepe",
        "last": "Test"
      },
      "contact": {
        "email": "pepe@test.com",
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
    User.add(newUser, function(user){
      if(user != 'error'){
        req.session.user = user;
        res.redirect('/dashboard');
      }
      else{
        res.render('signup', {
          message: 'sign up error'
        });
      }
    })
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
  user = {
    "nickname": req.body.nickname,
    "password": hash(req.body.password)
  }
  User.authenticate(user, function(isOk){
    if(isOk){
      req.session.user = user;
      res.redirect('/dashboard');
    }
    else{
      res.render('login', {
        message: 'login error'
      });
    }
  })
});

//=====================================
// LOGOUT ==============================
// =====================================
router.get('/logout', function(req, res) {
  req.session.destroy();
  res.redirect('/');
});

module.exports = router;
