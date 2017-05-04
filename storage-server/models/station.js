var mongoose = require('mongoose'),
	dbs = require('../config').dbs,
	connections = require('../db');

var stationSchema = new mongoose.Schema({
	_id: 		String,
	zone:  		{ type: String, required: true},
	name:     	{ type: String, required: true},
	latitude:   Number,
	longitude: 	Number
});

var Station = connections[dbs.db2.name].model("Station", stationSchema);

//OPERACIONES

exports.all = function(cb) {
	Station.find({}, cb);
};

exports.get = function(id, cb) {
	Station.findById(id, cb);
};

exports.add = function(newStation, cb) {
	var station = new Station({
		_id: 		newStation.zone+'-'+newStation.name,
		zone: 		newStation.zone,
		name:   	newStation.name,
		latitude: 	newStation.latitude,
		longitude: 	newStation.longitude
	});

	station.save(cb);
};

exports.update = function(name, newStation, cb) {
	Station.findById(id, function(err, station) {
		station.latitude 	= newStation.latitude || station.latitude;
		station.longitude 	= newStation.longitude || station.longitude;

		station.save(cb);
	});
};

exports.delete = function(id, cb) {
	Station.findByIdAndRemove(id, cb);
};