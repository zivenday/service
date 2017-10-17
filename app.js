'use strict';

const express = require('express');
const session = require('express-session');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport'); // 用户认证模块passport
const Strategy = require('passport-http-bearer').Strategy; // token验证模块
const routes = require('./routes');
const config = require('./public/config');
const authToken = require('./utils/apiToken')

// var index = require('./routes/index');
// // let login = require('./routes/login');
// var user = require('./routes/user');
// var feedback = require('./routes/feedback');

var app = express();
//allow custom header and CORS

app.all('*', function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
  res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');

  if (req.method == 'OPTIONS') {
    res.send(200);
    /让options请求快速返回/;
  } else {
    next();
  }
});
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(passport.initialize()); // 初始化passport模块
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(cookieParser('sessiontest'));
app.use('/api', authToken.check_auth);
app.use(session({
  secret: 'sessiontest',//与cookieParser中的一致
  cookie: {
    maxAge: 3600000
  }
}));
app.use(express.static(path.join(__dirname, 'public')));
routes(app); // 路由引入
mongoose.Promise = global.Promise;
mongoose.connect(config.database); // 连接数据库
// app.use('/', index);
// // app.use('/login', login);
// app.use('/api/user', user);
// app.use('/feedback', feedback);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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
app.get('/', function (req, res) {
  res.sendfile(path.join(__dirname, '/index.html'));
});
module.exports = app;