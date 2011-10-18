var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var Photo = new Schema({
  url: String,
  pid: String,
  width: Number,
  height: Number,
  tags: [{}]
});

mongoose.model('Photo', Photo);
