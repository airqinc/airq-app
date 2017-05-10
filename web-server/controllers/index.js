const path = require('path');
var dataModel = require('../models/data');

module.exports = function(app)
{
    app.get("/", function(req, res)
    {
        console.log(dataModel.msg);
        res.end();
    });
 
    app.get("/parametros/:nombre", function(req, res)
    {
        dataModel.parametros(req.params.nombre);
        res.end();
    });
 
    app.get("/objeto", function(req,res)
    {
    	var objeto = dataModel.objeto;
    	console.log(objeto.nombre + " tiene " + objeto.edad + " años y una web que se llama " + objeto.web);
    	res.end();
    });
 
    app.get("/mvc", function(req, res)
    {
        res.render('index', { 
            title: 'MVC con node y express',
            msg: dataModel.msg
        });
    });
}