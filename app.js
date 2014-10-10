var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var crypto = require('crypto');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('ejs').renderFile);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req, res, next) {
  next();
});

app.get('/', function(req, res) {
  res.render('main.html');
});

app.get('/redirect', function(req, res) {
  res.render('redirect_main.html');
});

app.get('/state', function(req, res) {
  res.status(200).send(generateState());

  function generateState() {
    return crypto.randomBytes(16).toString('hex')
  }
});


module.exports = app;
