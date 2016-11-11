var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('./join/passport'); /* passport 모듈을을 불러옴 */
var session = require('express-session');
var routes = require('./routes/index');
var users = require('./routes/user/users');
var home = require('./routes/home/home');
var guide = require('./routes/guide/guide');
var main = require('./routes/main/main');
var admin =require('./routes/admin/admin');
var flash = require('connect-flash');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
/* session을 유지 하기위해 express-session 설정 */
app.use(session({
    secret: 'keyborad cat',
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: false, // 기본적으로 https보안을 위해 cookie이용을 못하게 함 이부분을 false로 해줘야 session 유지
         maxAge : 3600000
    }}));
app.use(passport.initialize()); // Express 연결
app.use(passport.session()); // 로그인 세션 유지
app.use(flash());//로그인 실패시 에러메시지를 session의 flash에 저장

app.use('/',routes);
app.use('/home', home);
app.use('/users', users);
app.use('/guide',guide);
app.use('/main',main);
app.use('/admin',admin);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
