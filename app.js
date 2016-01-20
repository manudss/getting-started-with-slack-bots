var express = require('express');
var bodyParser = require('body-parser');
var hellobot = require('./hellobot');
var redbot = require('./redbot');
var dicebot = require('./dicebot');
var redmine = require('./redmine');
var red_command = require('./red_command');

var app = express();
var port = process.env.PORT || 3000;

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";



// body parser middleware
app.use(bodyParser.urlencoded({ extended: true }));



// test route
app.get('/', function (req, res) { res.status(200).send('Hello world!');
   // run slack message that will read all message. 
    require("./slack-message");
});

// hellobot
app.get('/hello', hellobot);

// outcomming with a # 
app.post('/redbot', redbot);

// dicebot
app.post('/roll', dicebot);

// redmine ticket
app.post('/redmine', redmine);

// red_command
app.post('/red', red_command);
//app.get('/red', red_command);


// basic error handler
app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(400).send(err.message);
});


app.listen(port, process.env.IP || "0.0.0.0", function () {
  console.log('Slack bot listening on port ' + port);
  // run slack message that will read all message. 
  require("./slack-message");
});
