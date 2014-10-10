var express = require('express');
var session = require('express-session');
var path = require('path');
var bodyParser = require('body-parser');
var crypto = require('crypto');

var app = express();

app.use(session({
  secret: 'secr3t',
  cookie: {maxAge: 60000},
  resave: true,
  saveUninitialized: true
}));

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
  var session = req.session;

  // if user already logged in
  if (session.code)
    return res.render('login_main.html', {code: session.code});

  // if loggin success
  if (session.state == req.query.state) {
    session.code = req.query.code;
    return res.render('login_main.html', {code: session.code});
  }
  else
    res.render('main.html', {code: session.code});
});

app.get('/state', function(req, res) {
  var state = generateState();
  req.session.state = state;
  res.status(200).send(state);

  function generateState() {
    return crypto.randomBytes(16).toString('hex')
  }
});


module.exports = app;
