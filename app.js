// Modules
var express = require('express');


// Configuration
var app = module.exports = express.createServer();
require('./config/environment.js')(app, express);

app.listen(process.env.PORT || 3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
