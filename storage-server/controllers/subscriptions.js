var express = require('express'),
	router = express.Router(),
	Subscription = require('../models/subscription');

//GET - Devuelve todas las suscripciones
router.get('/', function(req, res) {
	Subscription.all(function(err, data) {
	    if(err) return res.status(500).send(err.message);
		res.status(200).jsonp(data);
	})
})

//GET - Devuelve una suscripcion por id
router.get('/:id', function(req, res) {
	Subscription.get(req.params.id, function(err, data) {
	    if(err) return res.status(500).send(err.message);
		res.status(200).jsonp(data);
	})
})

//POST - Crear una nueva suscripcion
router.post('/', function(req, res) {
	var subscription = {
    user: req.body.user,
  	zone: req.body.zone,
    expiration_date: req.body.expiration_date,
    type: req.body.type
  };

	Subscription.add(subscription, function(err, newSubscription) {
	  if(err) return res.status(500).send(err.message);
		res.status(200).jsonp(newSubscription);
	})
})

//UPDATE - Actualiza una suscripcion (no se puede cambiar de zona)
router.put('/:id', function(req, res) {
  var subscription = {
    user: req.body.user,
  	zone: req.body.zone,
    expiration_date: req.body.expiration_date,
    type: req.body.type
  };

	Subscription.update(req.params.id, subscription, function(err, data) {
	  if(err) return res.status(500).send(err.message);
		res.status(200).jsonp(data);
	})
})

//DELETE - Borra una suscripcion
router.delete('/:id', function(req, res) {
	Subscription.remove(req.params.id, function(err, subscription) {
		if(err) return res.status(500).send(err.message);
  	res.status(200).send(subscription.id);
	})
})

module.exports = router;
