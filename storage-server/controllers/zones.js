var express = require('express'),
	router = express.Router(),
	Zone = require('../models/zone'),
	Measure = require('../models/measure');
	//auth = require('../middlewares/auth');

//GET - Devuelve todas las zonas disponibles
router.get('/', function(req, res) {
	Zone.all(function(err, data) {
	    if(err) return res.status(500).send(err.message);
		res.status(200).jsonp(data);
	})
})

//GET - Devuelve una zona por nombre
router.get('/:name', function(req, res) {
	Zone.get(req.params.name, function(err, data) {
	    if(err) return res.status(500).send(err.message);
		res.status(200).jsonp(data);
	})
})

//POST - Crear una nueva zona
router.post('/', function(req, res) {
	var zone = {
		name: 			req.body.name,
		description:   	req.body.description,
		city: {
			name: 		req.body.city_name,
			zip: 		req.body.city_zip,
		},
		area: 			req.body.area,
		time_zone: 		req.body.time_zone,
	};


	Zone.add(zone, function(err, data) {
	    if(err) return res.status(500).send(err.message);
		res.status(200).jsonp(data);
	})
})

//UPDATE - Actualiza una zona
router.put('/:name', function(req, res) {
	var zone = {
		description:   	req.body.description,
		city: {
			name: 		req.body.city_name,
			zip: 		req.body.city_zip,
		},
		area: 			req.body.area,
		time_zone: 		req.body.time_zone,
	};

	Zone.update(req.params.name, zone, function(err, data) {
	    if(err) return res.status(500).send(err.message);
		res.status(200).jsonp(data);
	})
})

//DELETE - Borra una zona
router.delete('/:name', function(req, res) {
	Zone.remove(req.params.name, function(err, zone) {
		if(err) return res.status(500).send(err.message);
  		res.status(200).send(zone.name);
	})
})

//GET - Obtiene todas las medidas de una zona a la hora indicada
router.post('/:name/measures', function(req, res) {
	Zone.get(req.params.name, function(err, zone) {
	    if(err) return res.status(500).send(err.message);

	    var a = {"zone":zone.name, "datetime":req.body.datetime, "measures":[]}

	    var cb = function(err, measure){
        	a.measures.push(measure)

        	if (zone.stations.length == a.measures.length)
        		res.status(200).jsonp(a);
        }

	    zone.stations.forEach(function(value,i,array) {
            Measure.getByDatetime(value, req.body.datetime, cb);
        });
	})
})

module.exports = router;