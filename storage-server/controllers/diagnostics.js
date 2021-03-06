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

//GET - Devuelve un diagnostico/pronostico por tiempo
router.post('/:zone/datetime', function(req, res) {
	Diagnostic.getByTime(req.params.zone, req.body.datetime, req.body.isForecast, function(err, data) {
	  if(err) return res.status(500).send(err.message);
		res.status(200).jsonp(data);
	})
})

//POST - Devuelve los ultimos n diagnosticos y/o pronosticos de una zona en un periodo de tiempo
router.post('/:zone/latest', function(req, res) {
	Diagnostic.getLatest(req.params.zone, req.body.isForecast, req.body.number, req.body.both, function(err, data) {
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
        isForecast:     req.body.isForecast,
        alerts:         req.body.alerts
    };

	Diagnostic.add(diagnostic, function(err, newDiagnostic) {
	    if(err) return res.status(500).send(err.message);

			if (diagnostic.isForecast){
				console.log('POST new forecast to zone ' + diagnostic.zone + " at " + diagnostic.datetime);
				res.status(200).jsonp(newDiagnostic);
			}
			else{
				console.log('POST new diagnostic to zone ' + diagnostic.zone + " at " + diagnostic.datetime);
				res.status(200).jsonp(newDiagnostic);
			}
	})
})

//UPDATE - Actualiza una diagnóstico
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

//DELETE - Borra una diagnóstico por fecha y hora
router.delete('/:zone', function(req, res) {
    Diagnostic.removeByTime(req.params.zone, req.body.datetime, req.body.isForecast, function(err, diagnostic) {
        if(err) return res.status(500).send(err.message);
				if (diagnostic.isForecast){
					console.log('DELETE forecast of zone ' + diagnostic.zone + " at " + diagnostic.datetime);
					res.status(200).send("DELETE forecast "+diagnostic.zone+" "+diagnostic.datetime);
				}
				else{
        	console.log('DELETE diagnostic of zone ' + diagnostic.zone + " at " + diagnostic.datetime);
					res.status(200).send("DELETE diagnostic "+diagnostic.zone+" "+diagnostic.datetime);
				}
    })
})

module.exports = router;
