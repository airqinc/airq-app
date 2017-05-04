var express = require('express'),
	router = express.Router(),
	Device = require('../models/device');

//GET - Devuelve todas los dispositivos
router.get('/', function(req, res) {
	Device.all(function(err, data) {
	    if(err) return res.status(500).send(err.message);
		res.status(200).jsonp(data);
	})
})

//GET - Devuelve un dispositivo por ID
router.get('/:id', function(req, res) {
	Device.get(req.params.id, function(err, data) {
	    if(err) return res.status(500).send(err.message);
		res.status(200).jsonp(data);
	})
})

//POST - Crear un dispositivo medida
router.post('/', function(req, res) {
	var device = {
        station:        req.body.station,
        last_update:    req.body.last_update,
        sw_version:     req.body.sw_version
    };

	Device.add(device, function(err, newDevice) {
	    if(err) return res.status(500).send(err.message);
		res.status(200).jsonp(newDevice);
	})
})

//UPDATE - Actualiza un dispositivo
router.put('/:id', function(req, res) {
	var device = {
        station:        req.body.station,
        last_update:    req.body.last_update,
        sw_version:     req.body.sw_version
    };

	Device.update(req.params.id, device, function(err, data) {
	    if(err) return res.status(500).send(err.message);
		res.status(200).jsonp(data);
	})
})

//DELETE - Borra un dispositivo
router.delete('/:id', function(req, res) {
	Device.delete(req.params.id, function(err, device) {
		if(err) return res.status(500).send(err.message);
  		res.status(200).send(device._id);
	})
})

module.exports = router;