// Launch: npm run dev

const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const methodOverride  = require("method-override");

// Inicializar servidor
const app = express();

//Configuración de la aplicación express
app.set('settings', require('./config'));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(methodOverride());
app.use(express.static(path.join(__dirname, 'public')));

//Exporto mi instancia de app para utilizarlo en otros archivos
module.exports = app;

//Rutas de mi aplicación
var index = require('./controllers/index');
var user = require('./controllers/user');
require('./controllers')(app);

app.use('/', index);
app.use('/users', user);

// Llamada a la API de AQI
/*setTimeout(function(){
	station = 'madrid'
	token = 'ef6bc8b53769124c36402b20a91b104f6677a4c8'

	getJSON("http://api.waqi.info/feed/"+station+"/?token="+token, function(error, response){
	    if (error){
	    	console.log("Error AQI Madrid: "+error)
	    }
	    else if (response.ok){
	    	console.log("todo ok")
	    	//console.log(response.result.data.city.name)
	    }
	})
}, 1000);*/

// Ejecutar servidor
app.listen(app.get('settings').port, function() {
  console.log('Listening port: ' + app.get('settings').port);
});