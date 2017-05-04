var express = require('express'),
    router = express.Router()

router.use('/zones', require('./zones'))
router.use('/stations', require('./stations'))
router.use('/devices', require('./devices'))
router.use('/measures', require('./measures'))

router.get("/", function(req, res)
{
    console.log('Connection from ' + req.ip);
    res.end();
});

module.exports = router