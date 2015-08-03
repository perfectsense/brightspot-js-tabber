var express = require('express');
var app = express();
var path = require('path');
app.use(express.static(__dirname));
app.use('/assets', express.static(path.resolve(__dirname, '../src')));
app.use('/assets/bower', express.static(path.resolve(__dirname, '../bower_components')));
app.use('/assets/node', express.static(path.resolve(__dirname, '../node_modules')));
app.listen(3000, function() {
	console.log('Demo server listening on http://localhost:3000');
});