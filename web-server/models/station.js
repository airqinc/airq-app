const mongoose = require('mongoose');
const Schema  = mongoose.Schema;

var Station = new Schema({
  idx:      { type: Number, required: true, index: { unique: true } },
  id_zone:  { type: Number, required: true},
  name:     { type: String, required: true, index: { unique: true } },
  geo:      [Number]
});

module.exports.User = mongoose.model("station", Station);