var express = require('express'),
  router = express.Router();
var days_es = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

//=====================================
// myZones PAGE (with login links) ========
// =====================================
//
//
router.get('/', function(req, res) {
  if (req.session.user) {
    res.render('myZones', {
      user: req.session.user
    })
  } else {
    res.redirect('/user/login');
  }
});
module.exports = router;
