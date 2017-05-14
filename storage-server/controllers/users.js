var express = require('express'),
	router = express.Router(),
	User = require('../models/user'),
	Subscription = require('../models/subscription');

//GET - Devuelve todas los usuarios
router.get('/', function(req, res) {
	User.all(function(err, data) {
	  if(err) return res.status(500).send(err.message);
		res.status(200).jsonp(data);
	})
})

//GET - Devuelve un usuario por nickname
router.get('/:nickname', function(req, res) {
	User.get(req.params.nickname, function(err, data) {
	  if(err) return res.status(500).send(err.message);
		res.status(200).jsonp(data);
	})
})

//POST - Crear un usuario medida
router.post('/', function(req, res) {
	var user = {
    nickname: req.body.nickname,
  	password: req.body.password,
  	name: {
      first: req.body.name.first,
      last: req.body.name.last
    },
    contact: {
      email: 	req.body.contact.email,
      phone:  req.body.contact.phone,
      address: {
        address: req.body.contact.address.address,
        city: {
          name: req.body.contact.address.city.name,
          zip: req.body.contact.address.city.zip
        },
        country: req.body.contact.address.country
      }
    }
  };

	User.add(user, function(err, newUser) {
	  if(err) return res.status(500).send(err.message);
		console.log('POST new user ' + newUser.nickname)
		res.status(200).jsonp(newUser);
	})
})

//UPDATE - Actualiza un usuario
router.put('/:nickname', function(req, res) {
	var user = {
    nickname: req.body.nickname,
  	password: req.body.password,
  	name: {
      first: req.body.name.first,
      last: req.body.name.last
    },
    contact: {
      email: 	req.body.contact.email,
      phone:  req.body.contact.phone,
      address: {
        address: req.body.contact.address.address,
        city: {
          name: req.body.contact.address.city.name,
          zip: req.body.contact.address.city.zip
        },
        country: req.body.contact.address.country
      }
    }
  };

	User.update(req.params.nickname, user, function(err, data) {
	  if(err) return res.status(500).send(err.message);
		res.status(200).jsonp(data);
	})
})

//DELETE - Borra un usuario
router.delete('/:nickname', function(req, res) {
	User.remove(req.params.nickname, function(err, user) {
		if(err) return res.status(500).send(err.message);
  	res.status(200).send(user._id);
	})
})

router.get('/:nickname/prueba', function(req, res) {
	User.getSubcriptionsZones(req.params.nickname, function(err, data) {
	  if(err) return res.status(500).send(err.message);
		res.status(200).jsonp(data);
	})
})

module.exports = router;
