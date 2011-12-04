// Modules
var express = require('express');


// Configuration

// static files directory needs to be set here or it 404's when fetching assets for some reason
var app = module.exports = express.createServer(express.static(__dirname + '/public'));
require('./config/environment.js')(app, express);

app.listen(process.env.PORT || 3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
