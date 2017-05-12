var express = require('express'),
	router = express.Router(),
	Diagnostic = require('../models/diagnostic');

//GET - Devuelve todas los diagnosticos
router.get('/', function(req, res) {
	Diagnostic.all(function(err, data) {
	    if(err) return res.status(500).send(err.message);
		res.status(200).jsonp(data);
	})
})

//GET - Devuelve un diagnostico por ID
router.get('/:id', function(req, res) {
	Diagnostic.get(req.params.id, function(err, data) {
	    if(err) return res.status(500).send(err.message);
		res.status(200).jsonp(data);
	})
})

//POST - Crear un nuevo diagnostico
router.post('/', function(req, res) {
	var diagnostic = {
        zone:           req.body.zone,
        datetime:       req.body.datetime,
        dayName:        req.body.dayName,
        dominentpol:    req.body.dominentpol,
        iaqi: {
            o3:         req.body.iaqi.o3,
            pm25:       req.body.iaqi.pm25,
            pm10:       req.body.iaqi.pm10,
            co:         req.body.iaqi.co,
            so2:        req.body.iaqi.so2,
            no2:        req.body.iaqi.no2,
            t:          req.body.iaqi.t,
            h:          req.body.iaqi.h,
            p:          req.body.iaqi.p
        },
        aemet: {
            temperature:    req.body.aemet.temperature, 
            windSpeed:      req.body.aemet.windSpeed, 
            rainfall:       req.body.aemet.rainfall, 
            windChill:      req.body.aemet.windChill, 
            windDirection:  req.body.aemet.windDirection,
            humidity:       req.body.aemet.humidity
        },
        isForecast:     req.body.isForecast
    };

	Diagnostic.add(diagnostic, function(err, newDiagnostic) {
	    if(err) return res.status(500).send(err.message);

        var cb = function(newDiagnostic){
            if (newDiagnostic.alerts.length == req.body.alerts.length)
                res.status(200).jsonp(newDiagnostic);
        }

        req.body.alerts.forEach(function(value,i,array) {
            Diagnostic.addAlert(newDiagnostic.zone, newDiagnostic.datetime, value, cb)
        });
	})
})

//UPDATE - Actualiza una medida
router.put('/:id', function(req, res) {
	var diagnostic = {
        zone:           req.body.zone,
        datetime:       req.body.datetime,
        dayName:        req.body.dayName,
        dominentpol:    req.body.dominentpol,
        iaqi: {
            o3:         req.body.iaqi.o3,
            pm25:       req.body.iaqi.pm25,
            pm10:       req.body.iaqi.pm10,
            co:         req.body.iaqi.co,
            so2:        req.body.iaqi.so2,
            no2:        req.body.iaqi.no2,
            t:          req.body.iaqi.t,
            h:          req.body.iaqi.h,
            p:          req.body.iaqi.p
        },
        aemet: {
            temperature:    req.body.temperature, 
            windSpeed:      req.body.windSpeed, 
            rainfall:       req.body.rainfall, 
            windChill:      req.body.windChill, 
            windDirection:  req.body.windDirection,
            humidity:       req.body.humidity
        }
    };

	Diagnostic.update(req.params.id, diagnostic, function(err, data) {
	    if(err) return res.status(500).send(err.message);
		res.status(200).jsonp(data);
	})
})

//DELETE - Borra una medida
router.delete('/:id', function(req, res) {
	Diagnostic.remove(req.params.id, function(err, diagnostic) {
		if(err) return res.status(500).send(err.message);
  		res.status(200).send(diagnostic._id);
	})
})

module.exports = router;