var express = require('express'),
  router = express.Router();

//=====================================
// dashboard PAGE (with login links) ========
// =====================================
//
//
router.get('/', function(req, res) {
  var measures_path = 'http://localhost:3000/diagnostics/Madrid/lastest'
  var request = require('request');

  function sortByKey(array, key) {
    return array.sort(function(a, b) {
      var x = a[key];
      var y = b[key];
      return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
  }


  if (req.session.user) {
    request.post({
         url: measures_path,
         body:   {"isForecast": false,"number": 24}
         }, function(error, response, body){
            console.log(body);
    },), function(error, response, body) {
      console.log('error:', error); // Print the error if one occurred
      console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
      diagnostics = sortByKey(JSON.parse(body), 'datetime').reverse() //sort by date, most recent first
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

      request.post({
           url: measures_path,
           body:   {"isForecast": true,"number": 24}
           }, function(error, response, body){
              console.log(body);
      },), function(error, response, body) {
        console.log('error:', error); // Print the error if one occurred
        console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
        forecasts = sortByKey(JSON.parse(body), 'datetime').reverse() //sort by date, most recent first
        chart_data_forecasts = []
        last_diagnostics.forEach(function(item, index) {
          dominentpol = item['dominentpol']
          temp = {
            date: item['datetime'],
            aqi: item['iaqi'][dominentpol],
          }
          chart_data_forecasts[index] = temp
        });
        console.log(chart_data)

      res.render('dashboard', {
        user: req.session.user,
        measures: JSON.stringify(chart_data),
        measuresForecast:  JSON.stringify(chart_data_forecasts)
      })
    });
  } else {
    res.redirect('/user/login');
  }

});
module.exports = router;
