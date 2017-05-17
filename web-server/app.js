// https://scotch.io/tutorials/easy-node-authentication-setup-and-local

var path = require('path')
var express = require('express');
var app = express();

var request = require('request');
var flash = require('connect-flash');
var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
app.use(express.static(path.join(__dirname, 'public')));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.set('settings', require('./config'));

app.use(session({
  secret: 'airQQ'
})); // session secret
app.use(flash()); // use connect-flash for flash messages stored in session

// Routes
app.use(require('./controllers'));

// Launch server
app.listen(app.get('settings').port, function() {
  console.log('Listening port: ' + app.get('settings').port);
});
