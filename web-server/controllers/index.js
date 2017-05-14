const path = require('path');
var dataModel = require('../models/data');

module.exports = function(app) {
  app.get("/", function(req, res) {
    res.render('home', {
      user: {
        name: "airq user",
        age: "20"
      }
    });
    // res.render('home'); // no user test
  });

  app.get("/login", function(req, res) {
    res.render('login');
  });

  app.get("/parametros/:nombre", function(req, res) {
    dataModel.parametros(req.params.nombre);
    res.end();
  });

  app.get("/objeto", function(req, res) {
    var objeto = dataModel.objeto;
    console.log(objeto.nombre + " tiene " + objeto.edad + " años y una web que se llama " + objeto.web);
    res.end();
  });

  app.get("/mvc", function(req, res) {
    res.render('index', {
      title: 'MVC con node y express',
      msg: dataModel.msg
    });
  });
}
