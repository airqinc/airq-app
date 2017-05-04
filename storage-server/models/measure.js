var mongoose = require('mongoose'),
    dbs = require('../config').dbs,
    connections = require('../db'),
    ObjectId = mongoose.Schema.Types.ObjectId;

var measureSchema = new mongoose.Schema({
    station:        { type: String, required: true},
    datetime:       { type: String, required: true},  // "2017-05-03T14:00:00Z"  
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
        windDirection:  { type: String, required: true}, // Falta añadir una enum con las direcciones
        humidity:       { type: Number, required: true},
    }, 
});

measureSchema.index({ zone: 1, station: 1, datetime: 1}, { unique: true });

/*measureSchema.query.byTime = function(id_station, datetime) {
  return this.findOne({ id_station: id_station, datetime: datetime });
};*/

var Measure = connections[dbs.db3.name].model('Measure', measureSchema);

//OPERACIONES

exports.all = function(cb) {
    Measure.find({}, cb);
};

exports.get = function(id, cb) {
    Measure.findById(id, cb);
};

exports.add = function(newMeasure, cb) {
    var measure = new Measure({
        station:        newMeasure.station,
        datetime:       newMeasure.datetime,
        dayName:        newMeasure.dayName,
        dominentpol:    newMeasure.dominentpol,
        iaqi: {
            o3:         newMeasure.iaqi.o3,
            pm25:       newMeasure.iaqi.pm25,
            pm10:       newMeasure.iaqi.pm10,
            co:         newMeasure.iaqi.co,
            so2:        newMeasure.iaqi.so2,
            no2:        newMeasure.iaqi.no2,
            t:          newMeasure.iaqi.t,
            h:          newMeasure.iaqi.h,
            p:          newMeasure.iaqi.p
        },
        aemet: {
            temperature:    newMeasure.aemet.temperature, 
            windSpeed:      newMeasure.aemet.windSpeed, 
            rainfall:       newMeasure.aemet.rainfall, 
            windChill:      newMeasure.aemet.windChill, 
            windDirection:  newMeasure.aemet.windDirection,
            humidity:       newMeasure.aemet.humidity
        }
    });

    measure.save(cb);
};

exports.update = function(name, newMeasure, cb) {
    Measure.findById(id, function(err, measure) {
        measure.station     = newMeasure.station || measure.station;
        measure.datetime    = newMeasure.datetime || measure.datetime;
        measure.dayName     = newMeasure.dayName || measure.dayName;
        measure.dominentpol = newMeasure.dominentpol || measure.dominentpol;

        measure.iaqi.o3     = newMeasure.iaqi.o3 || measure.iaqi.o3;
        measure.iaqi.pm25   = newMeasure.iaqi.pm25 || measure.iaqi.pm25;
        measure.iaqi.pm10   = newMeasure.iaqi.pm10 || measure.iaqi.pm10;
        measure.iaqi.co     = newMeasure.iaqi.co || measure.iaqi.co;
        measure.iaqi.so2    = newMeasure.iaqi.so2 || measure.iaqi.so2;
        measure.iaqi.no2    = newMeasure.iaqi.no2 || measure.iaqi.no2;
        measure.iaqi.t      = newMeasure.iaqi.t || measure.iaqi.t;
        measure.iaqi.h      = newMeasure.iaqi.h || measure.iaqi.h;
        measure.iaqi.p      = newMeasure.iaqi.p || measure.iaqi.npo2;

        measure.aemet.temperature   = newMeasure.aemet.temperature || measure.aemet.temperature;
        measure.aemet.windSpeed     = newMeasure.aemet.windSpeed || measure.aemet.windSpeed;
        measure.aemet.rainfall      = newMeasure.aemet.rainfall || measure.aemet.rainfall;
        measure.aemet.windChill     = newMeasure.aemet.windChill || measure.aemet.windChill;
        measure.aemet.windDirection = newMeasure.aemet.windDirection || measure.aemet.windDirection;
        measure.aemet.humidity      = newMeasure.aemet.humidity || measure.aemet.humidity;
        
        measure.save(cb);
    });
};

exports.delete = function(id, cb) {
    Measure.findByIdAndRemove(id, cb);
};


// OPERACIONES ADICIONALES

exports.allFromZone = function(zone, cb) {
    Measure.find({ "zone": zone }, cb);
};

exports.allFromStation = function(zone, station, cb) {
    Measure.find({ "zone": zone, "station": station }, cb);
};