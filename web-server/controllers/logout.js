var express = require('express'),
  router = express.Router();
//=====================================
// LOGOUT ==============================
// =====================================
router.get('/', function(req, res) {
  req.session.destroy();
  res.redirect('/');
});

module.exports = router
