var express = require('express'),
	router = express.Router(),
	Category = require('../models/category');

//GET - Devuelve todas las categorias
router.get('/', function(req, res) {
	Category.all(function(err, data) {
	  if(err) return res.status(500).send(err.message);
    res.status(200).jsonp(data);
	})
})

//GET - Devuelve una categoria por id (good, moderate, etc)
router.get('/:id', function(req, res) {
	Category.get(req.params.id, function(err, data) {
    if(err) return res.status(500).send(err.message);
    res.status(200).jsonp(data);
	})
})

//POST - Crear una nueva categoria
router.post('/', function(req, res) {
  var category = {
		_id:          req.body._id,
		description:  req.body.description,
		min_value:   	req.body.min_value,
		max_value:    req.body.max_value,
		color:        req.body.color
	};

	Category.add(category, function(err, newCategory) {
    if(err) return res.status(500).send(err.message);
		res.status(200).jsonp(newCategory);
	})
})

//UPDATE - Actualiza una categoria
router.put('/:id', function(req, res) {
  var category = {
		description:  req.body.description,
		min_value:   	req.body.min_value,
		max_value:    req.body.max_value,
		color:        req.body.color
	};

	Category.update(req.params.id, category, function(err, data) {
	  if(err) return res.status(500).send(err.message);
		res.status(200).jsonp(data);
	})
})

//DELETE - Borra una categoria
router.delete('/:id', function(req, res) {
	Category.remove(req.params.id, function(err, category) {
		if(err) return res.status(500).send(err.message);
    res.status(200).send(category.id);
	})
})

module.exports = router;
