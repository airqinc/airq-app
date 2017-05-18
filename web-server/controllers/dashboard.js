var express = require('express'),
  router = express.Router();
var days_es = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

//=====================================
// dashboard PAGE (with login links) ========
// =====================================
//
//
router.get('/', function(req, res) {
  var diagnostics_path = 'http://storage-server:3000/diagnostics/Madrid/latest'
  var request = require('request');
  if (req.session.user) {
    // diagnostics chart
    request.post({
      url: diagnostics_path,
      json: {
        "isForecast": false,
        "number": 48, //48
        "both": true
      }
    }, function(error, response, body) {
      console.log('error:', error); // Print the error if one occurred
      console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
      diagnostics = (body);
      diagnostics_chart_data = [];
      diagnostics.false.forEach(function(item, index) {
        dominentpol = item['dominentpol']
        temp = {
          date: item['datetime'],
          aqi: item['iaqi'][dominentpol],
        }
        if (index == 0) {
          description = item.alerts[0].category.description;
          msg = item.alerts[0].category.msg;
          aqi_color = item.alerts[0].category.color;
          pollutants = item.iaqi;
          // remove temperature, pressure etc from pollutants
          for (k in pollutants) {
            if (k == 'h' | k == 't' | k == 'p') {
              delete pollutants[k]
            }
          }
        }
        diagnostics_chart_data[index] = temp;
      });

      //forecasts chart
      forecasts_chart_data = [];
      diagnostics.true.forEach(function(item, index) {
        dominentpol = item['dominentpol'];
        temp = {
          date: item['datetime'],
          aqi: item['iaqi'][dominentpol],
        }
        forecasts_chart_data[index] = temp
      });
      forecasts_chart_data = forecasts_chart_data.slice(0, 24); //get only 24 latest forecasts
      date_obj = new Date(diagnostics_chart_data[0]['date']);

      //render dashboard with all collected data
      res.render('dashboard', {
        user: req.session.user,
        diagnostics_chart_data: JSON.stringify(diagnostics_chart_data),
        current_aqi: Math.round(diagnostics_chart_data[0]['aqi']), // current status
        aqi_color: aqi_color,
        day_updated_at: days_es[date_obj.getUTCDay() - 1],
        hour_updated_at: date_obj.getHours() + ":" + date_obj.getMinutes() + "0",
        current_aqi_message: description,
        extended_aqi_message: msg,
        pollutants: pollutants,
        forecasts_chart_data: JSON.stringify(forecasts_chart_data),
      });
    });
  } else {
    res.redirect('/user/login');
  }
});
module.exports = router;
