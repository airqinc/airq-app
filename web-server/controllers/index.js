var express = require('express'),
  router = express.Router();

router.use('/dashboard', require('./dashboard'))
router.use('/user', require('./user'))


router.get('/', function(req, res) {
  if (req.session.user) {
    res.render('dashboard', {
      user: req.session.user
    })
  } else {
    res.redirect('/user/login');
  }
});

module.exports = router;
