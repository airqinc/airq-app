var mongoose = require('mongoose'),
    dbs = require('../config').dbs,
    connections = require('../db');

var alertSchema = new mongoose.Schema({
    pollutant:  { type: String, required: true, enum: ['o3', 'pm25', 'pm10', 'co', 'so2', 'no2']},
    category:   { type: String, required: true},
});

var diagnosticSchema = new mongoose.Schema({
    zone:           { type: String, required: true},
    datetime:       { type: String, required: true},
    dayName:        { type: String, required: true, enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', "Sunday"]},
    dominentpol:    { type: String, required: true, enum: ['o3', 'pm25', 'pm10', 'co', 'so2', 'no2']},
    iaqi: {
        o3:         { type: Number, min: 0, max: 500, required: true},
        pm25:       { type: Number, min: 0, max: 500, required: true},
        pm10:       { type: Number, min: 0, max: 500, required: true},
        co:         { type: Number, min: 0, max: 500, required: true},
        so2:        { type: Number, min: 0, max: 500, required: true},
        no2:        { type: Number, min: 0, max: 500, required: true},
        t:          { type: Number, required: true},
        h:          { type: Number, required: true},
        p:          { type: Number, required: true}
    },
    aemet: {
        temperature:    { type: Number, required: true}, 
        windSpeed:      { type: Number, required: true}, 
        rainfall:       { type: Number, required: true}, 
        windChill:      { type: Number, required: true}, 
        windDirection:  { type: String, required: true},
        humidity:       { type: Number, required: true},
    },
    isForecast:     { type: Boolean, default: false, required: true},
    alerts:         [alertSchema]
});

diagnosticSchema.index({ zone: 1, datetime: -1}, { unique: true }); //Por lo general se querrán los últimos diagnóstivos

diagnosticSchema.query.byTime = function(zone, datetime) {
    return this.findOne({ zone: zone, datetime: datetime });
};

var Diagnostic = connections[dbs.db3.name].model('Diagnostic', diagnosticSchema);

//OPERACIONES

exports.all = function(cb) {
    Diagnostic.find({}, cb);
};

exports.get = function(id, cb) {
    Diagnostic.findById(id, cb);
};

exports.add = function(newDiagnostic, cb) {
    var diagnostic = new Diagnostic({
        zone:           newDiagnostic.zone,
        datetime:       newDiagnostic.datetime,
        dayName:        newDiagnostic.dayName,
        dominentpol:    newDiagnostic.dominentpol,
        iaqi: {
            o3:         newDiagnostic.iaqi.o3,
            pm25:       newDiagnostic.iaqi.pm25,
            pm10:       newDiagnostic.iaqi.pm10,
            co:         newDiagnostic.iaqi.co,
            so2:        newDiagnostic.iaqi.so2,
            no2:        newDiagnostic.iaqi.no2,
            t:          newDiagnostic.iaqi.t,
            h:          newDiagnostic.iaqi.h,
            p:          newDiagnostic.iaqi.p
        },
        aemet: {
            temperature:    newDiagnostic.aemet.temperature, 
            windSpeed:      newDiagnostic.aemet.windSpeed, 
            rainfall:       newDiagnostic.aemet.rainfall, 
            windChill:      newDiagnostic.aemet.windChill, 
            windDirection:  newDiagnostic.aemet.windDirection,
            humidity:       newDiagnostic.aemet.humidity
        },
        isForecast:     newDiagnostic.isForecast
    });

    console.log('POST new diagnostic to zone ' + diagnostic.zone + " at " + diagnostic.datetime)

    diagnostic.save(cb);
};

exports.update = function(id, newDiagnostic, cb) {
    Diagnostic.findById(id, function(err, diagnostic) {
        diagnostic.zone        = newDiagnostic.zone || diagnostic.zone;
        diagnostic.datetime    = newDiagnostic.datetime || diagnostic.datetime;
        diagnostic.dayName     = newDiagnostic.dayName || diagnostic.dayName;
        diagnostic.dominentpol = newDiagnostic.dominentpol || diagnostic.dominentpol;

        diagnostic.iaqi.o3     = newDiagnostic.iaqi.o3 || diagnostic.iaqi.o3;
        diagnostic.iaqi.pm25   = newDiagnostic.iaqi.pm25 || diagnostic.iaqi.pm25;
        diagnostic.iaqi.pm10   = newDiagnostic.iaqi.pm10 || diagnostic.iaqi.pm10;
        diagnostic.iaqi.co     = newDiagnostic.iaqi.co || diagnostic.iaqi.co;
        diagnostic.iaqi.so2    = newDiagnostic.iaqi.so2 || diagnostic.iaqi.so2;
        diagnostic.iaqi.no2    = newDiagnostic.iaqi.no2 || diagnostic.iaqi.no2;
        diagnostic.iaqi.t      = newDiagnostic.iaqi.t || diagnostic.iaqi.t;
        diagnostic.iaqi.h      = newDiagnostic.iaqi.h || diagnostic.iaqi.h;
        diagnostic.iaqi.p      = newDiagnostic.iaqi.p || diagnostic.iaqi.npo2;

        diagnostic.aemet.temperature   = newDiagnostic.aemet.temperature || diagnostic.aemet.temperature;
        diagnostic.aemet.windSpeed     = newDiagnostic.aemet.windSpeed || diagnostic.aemet.windSpeed;
        diagnostic.aemet.rainfall      = newDiagnostic.aemet.rainfall || diagnostic.aemet.rainfall;
        diagnostic.aemet.windChill     = newDiagnostic.aemet.windChill || diagnostic.aemet.windChill;
        diagnostic.aemet.windDirection = newDiagnostic.aemet.windDirection || diagnostic.aemet.windDirection;
        diagnostic.aemet.humidity      = newDiagnostic.aemet.humidity || diagnostic.aemet.humidity;

        diagnostic.isForecast  = newDiagnostic.isForecast || diagnostic.isForecast;
        
        diagnostic.save(cb);
    });
};

exports.delete = function(id, cb) {
    Diagnostic.findByIdAndRemove(id, cb);
};


// OPERACIONES ADICIONALES

exports.addAlert = function(zone, datetime, alert, cb) {
    Diagnostic.find().byTime(zone, datetime).exec(function(err, diagnostic) {
        if (diagnostic.alerts.indexOf(alert) == -1){
            diagnostic.alerts.push(alert);
            diagnostic.save(function(err, data) {
                if(err) console.log('Unable to add new alert: '+err.message);
                else if(cb) cb(data)
            });
        }       
    });
};

exports.removeAlert = function(zone, datetime, alert, cb) {
    Diagnostic.find().byTime(zone, datetime).exec(function(err, diagnostic) {
        var index = diagnostic.alerts.indexOf(alert)

        if (index != -1){
            diagnostic.alerts.splice(index, 1);

            diagnostic.save(function(err, data) {
                if(err) console.log('Unable to remove alert: '+err.message);
                else if(cb) cb(data)
            });
        }
    });
};