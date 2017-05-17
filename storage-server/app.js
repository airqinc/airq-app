// Launch: npm run dev

var express = require('express');
var bodyParser = require('body-parser');
var app = express();

var morgan = require('morgan');

// Middlewares
app.use(morgan('dev')); // log every request to the console
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

// Launch dbs
var db = require('./db');

// Load settings
app.set('settings', require('./config'));

// Routes
app.use(require('./controllers'));

// Launch server
app.listen(app.get('settings').port, function() {
  console.log('Listening port: ' + app.get('settings').port);
});
