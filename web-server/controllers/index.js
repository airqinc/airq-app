var express = require('express'),
  router = express.Router();

router.use('/login', require('./login'))
router.use('/dashboard', require('./dashboard'))
router.use('/signup', require('./signup'))
router.use('/logout', require('./logout'))


router.get('/', function(req, res) {
  if (req.session.user) {
    res.render('dashboard', {
      user: req.session.user
    })
  } else {
    res.redirect('/login');
  }
});

module.exports = router;
