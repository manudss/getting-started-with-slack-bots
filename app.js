var express = require('express');
var bodyParser = require('body-parser');
var hellobot = require('./hellobot');
var dicebot = require('./dicebot');
var redmine = require('./redmine');

var app = express();
var port = process.env.PORT || 3000;

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";



// body parser middleware
app.use(bodyParser.urlencoded({ extended: true }));


// test route
app.get('/', function (req, res) { res.status(200).send('Hello world!') });

// hellobot
app.get('/hello', hellobot);

// dicebot
app.post('/roll', dicebot);

// dicebot
app.post('/redmine', redmine);


// basic error handler
app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(400).send(err.message);
});


app.listen(port, process.env.IP || "0.0.0.0", function () {
  console.log('Slack bot listening on port ' + port);
});
