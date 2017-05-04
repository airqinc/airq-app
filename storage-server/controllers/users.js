//var mongoose = require('mongoose');
var Users  = require("../models/user");

/*mongoose.connect("mongodb://localhost:27017/users");
var db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection error:"));
db.once("open", function(callback){
	console.log("Connection to database succeeded.");
});*/


var User = Users.User; //This creates the TvShow model.

exports.findAllUsers = function(req, res) {
	User.find(function(err, users) {
	    if(err) res.send(500, err.message);
		res.status(200).jsonp(users);
	});
};

exports.findByUsername = function(req, res) {
	User.find({ username: req.params.username }, function(err, users) {
    	if(err) return res.send(500, err.message);
    	if (users.length == 1)
			res.status(200).jsonp(users[0]);
		else
			res.status(404).jsonp("User not found");
	});
};

exports.checkUser = function(username, password, callback) {
	User.find({ username: username }, function(err, users) {
		if (users.length == 1){
			var user = users[0]
			if (user.password == password)
				callback(true)
			else
				callback(false)
		}
	});
};

exports.addUser = function(req, res) {
	var user = new User({
		username:   req.body.username,
		password:   req.body.password,
		meta: {
			name:     req.body.name,
			surname:  req.body.surname,
			age:      req.body.age,
			country:  req.body.country
	  	}
	});

	user.save(function(err, user) {
		if(err) return res.send(500, err.message);
		res.redirect("/home/"+req.body.username)
	});
};

exports.markFilmWatched = function(req, res) {
	User.find({ username: req.params.username }, function(err, users) {
		if (users.length != 0){
			var user = users[0]

			checkItemArray(req.body.filmid, user.showsWatched)
			deleteItemArray(req.body.filmid, user.showsPending)

			user.save(function(err) {
				if(err) return res.send(500, err.message);
	      		res.status(200).jsonp(user);
			});
		}
		else
			res.status(404).send("User not found")
	});
};

exports.markFilmPending = function(req, res) {
	User.find({ username: req.params.username }, function(err, users) {
		if (users.length != 0){
			var user = users[0]

			checkItemArray(req.body.filmid, user.showsPending)
			deleteItemArray(req.body.filmid, user.showsWatched)

			user.save(function(err) {
				if(err) return res.send(500, err.message);
	      		res.status(200).jsonp(user);
			});
		}
		else
			res.status(404).send("User not found")
	});
};

function checkItemArray (item, array){
	var isInArray = false
	for (i = 0; i < array.length; i++){
		if (array[i] == item){
			array.splice(i, 1)
			isInArray = true
		}
	}

	if (!isInArray)
		array.push(item)
}

function deleteItemArray (item, array){
	for (i = 0; i < array.length; i++){
		if (array[i] == item)
			array.splice(i, 1)
	}
}

//PUT - Update a register already exists
/*exports.updateFilm = function(req, res) {
	Film.findById(req.params.id, function(err, film) {
		film.title   = req.body.title;
		film.year    = req.body.year;
		film.country = req.body.country;
		film.poster  = req.body.poster;
		film.seasons = req.body.seasons;
		film.genre   = req.body.genre;
		film.summary = req.body.summary;

		film.save(function(err) {
			if(err) return res.send(500, err.message);
      		res.status(200).jsonp(film);
		});
	});
};*/


exports.deleteFilm = function(req, res) {
	User.findById(req.params.id, function(err, user) {
		user.remove(function(err) {
			if(err) return res.send(500, err.message);
      		res.status(200);
		})
	});
};