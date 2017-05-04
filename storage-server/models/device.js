var mongoose = require('mongoose'),
	dbs = require('../config').dbs,
	connections = require('../db');

var deviceSchema = new mongoose.Schema({
	station:  		{ type: String, required: true},
	last_update: 	String,
	sw_version:   	String
});

var Device = connections[dbs.db2.name].model("Device", deviceSchema);

//OPERACIONES

exports.all = function(cb) {
	Device.find({}, cb);
};

exports.get = function(id, cb) {
	Device.findById(id, cb);
};

exports.add = function(newDevice, cb) {
	var device = new Device({
		station: 		newDevice.station,
		last_update:   	newDevice.last_update,
		sw_version: 	newDevice.sw_version
	});

	device.save(cb);
};

exports.update = function(id, newDevice, cb) {
	Device.findById(id, function(err, device) {
		device.station 		= newDevice.station || device.station;
		device.last_update 	= newDevice.last_update || device.last_update;
		device.sw_version 	= newDevice.sw_version || device.sw_version;

		device.save(cb);
	});
};

exports.delete = function(id, cb) {
	Device.findByIdAndRemove(id, cb);
};