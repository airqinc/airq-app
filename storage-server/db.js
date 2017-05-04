var mongoose = require('mongoose'),
    settings = require('./config'),
    connections = {};

mongoose.Promise = global.Promise;

for (var db_id in settings.dbs){
	var db = settings.dbs[db_id];
	var mongoURI = db.domain + db.name;

	connections[db.name] = mongoose.createConnection(mongoURI);

	connections[db.name].on("error", console.error.bind(console, db.name+': Connection error:'));
	connections[db.name].on('connected', function() {
		console.log('Connection to '+db.name+' successful');
	});
}

module.exports = connections