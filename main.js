"use strict";

var express = require('express');
var app = express();
var cacheControl = require('express-cache-controlfreak');
var cors = require('cors');

app.use(cacheControl(60));
app.use(cors());

app.get('^/:user/:id', require('./controllers/talk'));
app.get('^/:user', require('./controllers/user'));

var port = process.env.PORT || 3000;
app.listen(port, function() {
    console.log('Listening on port: ' + port);
});
