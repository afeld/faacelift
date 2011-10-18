var mongoose = require('mongoose');

var PhotoSchema = new mongoose.Schema({
  url: String,
  pid: String,
  width: Number,
  height: Number,
  tags: []
});

exports.PhotoSchema = PhotoSchema;
