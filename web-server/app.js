// https://scotch.io/tutorials/easy-node-authentication-setup-and-local

var path = require('path')
var express = require('express');
var app = express();
var port = process.env.PORT || 8080;
var mongoose = require('mongoose');
var passport = require('passport');
var flash = require('connect-flash');

var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var request = require('request');
var router = express.Router();

// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser()); // get information from html forms

app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

//Exporto mi instancia de app para utilizarlo en otros archivos
module.exports = app;

app.use(session({
  secret: 'airQQ'
})); // session secret
// app.use(request())
// app.use(passport.initialize());
// app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

// routes ======================================================================
require('./controllers')(app);

// launch ======================================================================
app.listen(port);
console.log('The magic happens on port ' + port);
