const mongoose = require('mongoose');
const Schema  = mongoose.Schema;

var Measure = new Schema({  
  timestamp:    { type: Date, required: true},
  idx:          { type: Number, required: true},
  dominentpol:  String
  iaqui: {
      co:       { type: Number, min: 0, max: 500},
      no2:      { type: Number, min: 0, max: 500},
      o3:       { type: Number, min: 0, max: 500},
      pm10:     { type: Number, min: 0, max: 500},
      pm25:     { type: Number, min: 0, max: 500},
      so2:      { type: Number, min: 0, max: 500},
  }
});

module.exports.User = mongoose.model("measure", Measure);