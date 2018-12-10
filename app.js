var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
//var http = require('http').Server(app);
//var io = require('socket.io')(http);

//var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

// DataBase 
// var mysql = require("mysql");
var mysql = require('promise-mysql');
const config = require('./config/development_config');

var con = mysql.createPool({
  host: config.mysql.host,
  user: config.mysql.user,
  password: config.mysql.password,
  database: config.mysql.database,
  connectionLimit: 10,
  port: 3306
});

// con.connect(function (err) {
//   if (err) {
//     console.log('connecting error');
//     return;
//   }
//   console.log('connecting success');
// });

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/apidoc', express.static('apidoc'));



// db state
app.use(function (req, res, next) {
  req.con = con;
  next();
});

app.use('/', usersRouter);
// app.get('/', function (req, res) {
//   res.sendFile(__dirname);
//   res.render('index');
// });
//app.use('/api/users', usersRouter);
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
