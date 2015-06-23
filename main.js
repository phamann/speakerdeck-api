"use strict";

var express = require('express');
var app = express();

app.get('^/:user', require('./controllers/user'));
// app.get('^/:user/:id', require('./controllers/talk'));

var port = process.env.PORT || 3000;
app.listen(port, function() {
    console.log('Listening on port: ' + port);
});
