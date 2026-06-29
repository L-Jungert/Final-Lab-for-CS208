const express = require('express');
const path = require('path');
const createError = require('http-errors');
const { dbMiddleware } = require('./bin/db');

const indexRouter = require('./routes/index');
const menuRouter = require('./routes/menu');
const aboutRouter = require('./routes/about');
const commentsRouter = require('./routes/comments');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// Expose the current path + year to every template (active nav links, footer)
app.use(function (req, res, next) {
  res.locals.currentPath = req.path;
  res.locals.year = new Date().getFullYear();
  next();
});

app.use(dbMiddleware);

app.use('/', indexRouter);
app.use('/menu', menuRouter);
app.use('/about', aboutRouter);
app.use('/comments', commentsRouter);

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
  res.render('error', { title: 'Error' });
});

module.exports = app;
