var express = require('express'),
  router = express.Router();

router.use('/dashboard', require('./dashboard'))
router.use('/user', require('./user'))
router.use('/myZones',require('./myZones'))


router.get('/', function(req, res) {
  if (req.session.user) {
    res.render('dashboard', {
      user: req.session.user
    })
  } else {
    res.redirect('/user/login');
  }
});

router.get('/myZones', function(req, res) {
  if (req.session.user) {
    res.render('myZones', {
      user: req.session.user
    })
  } else {
    res.redirect('/user/login');
  }
});

router.get('/otherZones', function(req, res) {
  if (req.session.user) {
    res.render('otherZones', {
      user: req.session.user
    })
  } else {
    res.redirect('/user/login');
  }
});

router.get('/contact', function(req, res) {
  if (req.session.user) {
    res.render('contact', {
      user: req.session.user
    })
  } else {
    res.redirect('/user/login');
  }
});

module.exports = router;
