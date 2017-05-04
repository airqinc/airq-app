// Launch: npm run dev

var express = require('express'),
	bodyParser = require('body-parser'),
	app = express();

//Middlewares
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

//Levanta bases de datos
var db = require('./db');

//Configuración de la aplicación express
app.set('settings', require('./config'));

//Rutas de mi aplicación
app.use(require('./controllers'));
//app.use('/users', require('./routes/user'));

// Ejecutar servidor
app.listen(app.get('settings').port, function() {
  console.log('Listening port: ' + app.get('settings').port);
});