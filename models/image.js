var mongoose = require('mongoose');

//MONGOOSE MODEL CONFIG
var imageSchema = new mongoose.Schema({
  term: String,
  when: {type: Date, default: Date.now}
});

module.exports = mongoose.model('Image', imageSchema);