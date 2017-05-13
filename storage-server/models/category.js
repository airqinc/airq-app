var mongoose = require('mongoose'),
	dbs = require('../config').dbs,
	connections = require('../db');

var categorySchema = new mongoose.Schema({
	_id: 		       { type: Number, min: 0, max: 5, required: true, unique: true},
	description:   { type: String, required: true},
	min_value:     { type: Number, min: 0, max: 500, required: true},
	max_value:     { type: Number, min: 0, max: 500, required: true},
	color:         { type: String, required: true}
});

var Category = connections[dbs.db2.name].model("Category", categorySchema);

//OPERACIONES

exports.all = function(cb) {
	Category.find({}, cb);
};

exports.get = function(id, cb) {
	Category.findById(id, cb);
};

exports.add = function(newCategory, cb) {
	var category = new Category({
		_id:          newCategory._id,
		description:  newCategory.description,
		min_value:   	newCategory.min_value,
		max_value:    newCategory.max_value,
		color:        newCategory.color
	});

	category.save(cb);
};

exports.update = function(id, newCategory, cb) {
	Category.findById(id, function(err, category) {
		category.description 	= newCategory.description || category.description;
		category.min_value    = newCategory.min_value || category.min_value;
    category.max_value    = newCategory.max_value || category.max_value;
    category.color        = newCategory.color || category.color;

		category.save(cb);
	});
};

exports.remove = function(id, cb) {
	Category.findByIdAndRemove(id, cb);
};
