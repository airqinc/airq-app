// app/routes.js
crypto = require('crypto');

var hash = function(password) {
  return crypto.createHash('sha1').update(password).digest('base64')
}
module.exports = function(app) {
  // =====================================
  // LOGIN ===============================
  // =====================================
  // show the login form
  app.get('/login', function(req, res) {
    // render the page and pass in any flash data if it exists
    res.render('login', {
      message: req.flash('loginMessage')
    });
  });

  app.post('/login', function(req, res) {
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

  // =====================================
  // dashboard PAGE (with login links) ========
  // =====================================
  //
  //
  app.get('/dashboard', function(req, res) {
    if (req.session.user) {
      res.render('dashboard', {
        user: req.session.user
      })
    } else {
      res.redirect('/login');
    }
  });

  app.get('/', function(req, res) {
    if (req.session.user) {
      res.render('dashboard', {
        user: req.session.user
      })
    } else {
      res.redirect('/login');
    }
  });



  // =====================================
  // SIGNUP ==============================
  // =====================================
  // show the signup form
  app.get('/signup', function(req, res) {
    // render the page and pass in any flash data if it exists
    res.render('signup', {
      message: req.flash('signupMessage')
    });
  });
  var Users = [];

  app.post('/signup', function(req, res) {
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
  // LOGOUT ==============================
  // =====================================
  app.get('/logout', function(req, res) {
    req.session.destroy();
    res.redirect('/');
  });
}
