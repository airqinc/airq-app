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
    // line chart
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
      // console.log(body);
      diagnostics = (body);
      diagnostics_chart_data = [];
      diagnostics.false.forEach(function(item, index) {
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
          pollutants = item.iaqi;
        }
        diagnostics_chart_data[index] = temp
      });
      forecasts_chart_data = [];
      diagnostics.true.forEach(function(item, index) {
        dominentpol = item['dominentpol']
        temp = {
          date: item['datetime'],
          aqi: item['iaqi'][dominentpol],
          isForecast: item['isForecast'],
        }
        forecasts_chart_data[index] = temp
      });
      for(k in pollutants){
        // pollutants[k] = pollutants[k] * 500 / 100
        if(k == 'h' | k == 't' | k == 'p'){
          delete pollutants[k]
        }
        console.log(k, pollutants[k])
      }
      // console.log(pollutants);
      date_obj = new Date(diagnostics_chart_data[0]['date']);
      res.render('dashboard', {
        user: req.session.user,
        diagnostics_chart_data: JSON.stringify(diagnostics_chart_data),
        current_aqi: diagnostics_chart_data[0]['aqi'], // current status
        aqi_color: aqi_color,
        day_updated_at: days_es[date_obj.getUTCDay()-1],
        hour_updated_at: date_obj.getHours() + ":" + date_obj.getMinutes() + "0",
        current_aqi_message: description,
        extended_aqi_message: msg,
        pollutants: pollutants,
        forecasts_chart_data: JSON.stringify(forecasts_chart_data),
      })
    });

    /*request.post({ url: measures_path  , form: {"isForecast": true,"number": 24}},function(error, response, body) {
        console.log('error:', error); // Print the error if one occurred
        console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
        forecasts = sortByKey(JSON.parse(body), 'datetime').reverse() //sort by date, most recent first
        chart_data_forecasts = []
        forecasts.forEach(function(item, index) {
          dominentpol = item['dominentpol']
          temp = {
            date: item['datetime'],
            aqi: item['iaqi'][dominentpol],
          }
          chart_data_forecasts[index] = temp
        });
        console.log(chart_data_forecasts)
        res.render('dashboard', {
          user: req.session.user,
          measuresForecast:  JSON.stringify(chart_data_forecasts)
      })
    });*/
  } else {
    res.redirect('/user/login');
  }

});
module.exports = router;
