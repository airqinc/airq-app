//creamos un objeto para ir almacenando todo lo que necesitemos
var dataModel = {};
 
//añadimos todo lo que necesitemos al objeto dataModel
dataModel.msg = "Enviando datos desde un modelo";
 
 
dataModel.parametros = function(nombre)
{
	console.log("Hola " + nombre);
}
 
dataModel.objeto = {
	nombre : "Israel",
	web : "https://www.uno-de-piera.com",
	edad : 32
}
 
//de esta forma exportamos el objeto
module.exports = dataModel;