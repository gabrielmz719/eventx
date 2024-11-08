var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const connectDB = require("./config");
var userController = require("./controller/userController");
const upload = require('./multerConfig');
const sessionMiddleware = require('./middlewares/sessionMiddleware');


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var eventRouter = require('./routes/events');
var loginRouter = require('./routes/login');
var profileRouter = require('./routes/profile');

connectDB();
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(sessionMiddleware);

app.use('/events', upload.single('coverImage'), eventRouter);

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/events', eventRouter);
app.use('/login', loginRouter);
app.use('/profile', profileRouter);



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

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
