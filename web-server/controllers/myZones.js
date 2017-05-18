var express = require('express'),
  router = express.Router();
var days_es = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

//=====================================
// myZones PAGE (with login links) ========
// =====================================
//
//
router.get('/', function(req, res) {
  var diagnostics_path = 'http://storage-server:3000/diagnostics/Madrid/latest'
  var request = require('request');
  if (req.session.user) {
    // line chart
    request.post({
      url: diagnostics_path,
      json: {
        "isForecast": false,
        "number": 1, //48
        "both": false
      }
    }, function(error, response, body) {
      console.log('error:', error); // Print the error if one occurred
      console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
      // console.log(body);
      diagnostics = (body);
      diagnostics_chart_data = [];
      diagnostics.forEach(function(item, index) {
        dominentpol = item['dominentpol']
        temp = {
          date: item['datetime'],
          aqi: item['iaqi'][dominentpol],
          isForecast: item['isForecast'],
        }
        if(index == 0){
          description = item.alerts[0].category.description;
          msg = item.alerts[0].category.msg;
          aqi_color = item.alerts[0].category.color;
        }
        diagnostics_chart_data[index] = temp
      });

      date_obj = new Date(diagnostics_chart_data[0]['date']);
      res.render('myZones', {
        user: req.session.user,
        current_aqi: Math.round(diagnostics_chart_data[0]['aqi']), // current status
        aqi_color: aqi_color,
        day_updated_at: days_es[date_obj.getUTCDay()-1],
        hour_updated_at: date_obj.getHours() + ":" + date_obj.getMinutes() + "0",
      })
    });

  } else {
    res.redirect('/user/login');
  }

});
module.exports = router;
