const mongoose = require('mongoose');
const Schema  = mongoose.Schema;

var Zone = new Schema({  
  id:      	{ type: Number, required: true, index: { unique: true } },
  name: 	{ type: Number, required: true },
  city: {
      name: String,
      zip: 	String,
  },
  area: 	Number,
  tz:       String // time zone
});

module.exports.User = mongoose.model("zone", Zone);