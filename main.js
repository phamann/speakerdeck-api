"use strict";

var express = require('express');
var app = express();
var cacheControl = require('express-cache-controlfreak');
var cors = require('cors');
var serveStatic = require('serve-static');

app.use(cacheControl(60));
app.use(cors());
app.use(serveStatic('public', {'index': ['index.html']}));

app.get('^/:user/:id', require('./controllers/talk'));
app.get('^/:user', require('./controllers/user'));

var port = process.env.PORT || 3000;
app.listen(port, function() {
    console.log('Listening on port: ' + port);
});
