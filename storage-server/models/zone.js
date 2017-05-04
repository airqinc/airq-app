var mongoose = require('mongoose'),
	dbs = require('../config').dbs,
	connections = require('../db'),
	ObjectId = mongoose.Schema.Types.ObjectId;

var zoneSchema = new mongoose.Schema({
	name: 			{ type: String, required: true, index: true, unique: true },
	description: 	{ type: String, required: true },
	city: {
		name: 		String,
		zip: 		String,
	},
	area: 			Number,
	time_zone: 		Number,
	stations: 		[String],
	suscriptions: 	[ObjectId]	
});

var Zone = connections[dbs.db2.name].model('Zone', zoneSchema);

//OPERACIONES

exports.all = function(cb) {
	Zone.find({}, cb);
};

exports.get = function(name, cb) {
	Zone.findOne({"name": name}, cb);
};

exports.add = function(newZone, cb) {
	var zone = new Zone({
		name: 			newZone.name,
		description:   	newZone.description,
		city: {
			name: 		newZone.city_name,
			zip: 		newZone.city_zip,
		},
		area: 			newZone.area,
		time_zone: 		newZone.time_zone
	});

	zone.save(cb);
};

exports.update = function(name, newZone, cb) {
	Zone.findOne({"name": name}, function(err, zone) {
		zone.description 	= newZone.description || zone.description;
		zone.city.name 		= newZone.city.name || zone.city.name;
		zone.city.zip		= newZone.city.zip || zone.city.zip;
		zone.area			= newZone.area || zone.area;
		zone.time_zone 		= newZone.time_zone || zone.time_zone;

		zone.save(cb);
	});
};

exports.delete = function(name, cb) {
	Zone.findOneAndRemove({"name": name}, cb);
};


//OPERACIONES ADICIONALES

exports.addStation = function(zone, station) {
	Zone.findOne({"name": zone}, function(err, zone) {
		if (zone.stations.indexOf(station) == -1){
			zone.stations.push(station);
			zone.save(function(err, data) {
			    if(err) return res.status(500).send(err.message);
			});
		}		
	});
};

exports.deleteStation = function(zone, station) {
	Zone.findOne({"name": zone}, function(err, zone) {
		var index = zone.stations.indexOf(station)

		if (index != -1){
			zone.stations.splice(index, 1);

			zone.save(function(err, data) {
			    if(err) return res.status(500).send(err.message);
			});
		}
	});
};