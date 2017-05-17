var express = require('express'),
  router = express.Router();

//=====================================
// dashboard PAGE (with login links) ========
// =====================================
//
//
router.get('/', function(req, res) {
  var measures_path = 'http://localhost:3000/diagnostics'
  var request = require('request');

  function sortByKey(array, key) {
    return array.sort(function(a, b) {
      var x = a[key];
      var y = b[key];
      return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
  }

  if (req.session.user) {
    request(measures_path, function(error, response, body) {
      console.log('error:', error); // Print the error if one occurred
      console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
      // console.log('body:', body); // Print the HTML for the Google homepage.
      // TODO: parse body
      diagnostics = sortByKey(JSON.parse(body), 'datetime').reverse() //sort by date, most recent first

      diagnostics = sortByKey((diagnostics), 'isForecast') // sory by diagnostic type, get only diagnostics
      last_diagnostics = diagnostics.slice(0, 24) // get last 24 diagnostics
      console.log(last_diagnostics)

      chart_data = []
      last_diagnostics.forEach(function(item, index) {
        dominentpol = item['dominentpol']
        temp = {
          date: item['datetime'],
          aqi: item['iaqi'][dominentpol],
        }
        chart_data[index] = temp
      });
      console.log(chart_data)
      res.render('dashboard', {
        user: req.session.user,
        measures: JSON.stringify(chart_data),
      })
    });
  } else {
    res.redirect('/login');
  }

});
module.exports = router;
