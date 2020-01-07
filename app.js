var createError = require('http-errors');
var express = require('express');
var path = require('path');
require('dotenv').config();
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
//var logger = require('morgan');
var logger = require('./middleware/logger');

const indexRouter = require('./routes');
const apiRouter = require('./routes/api');
const sequelize = require('./models').sequelize;

var app = express();
/*TODO : session 추가하기 !!!! */
sequelize.sync().then(() => {
	console.log("DB 연결 성공");
}).catch(err => {
	console.log("연결 실패");
	console.log(err);
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
//app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(logger.log);

app.use('/', indexRouter);
app.use('/api', apiRouter);


// catch 404 and forward to error handler
/*
app.use(function(req, res, next) {
  next(createError(404));
});
*/

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;