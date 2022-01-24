require('dotenv').config()

const createError = require('http-errors');
const path = require('path');

const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');
const flash = require('express-flash');
const transformer = require('express-transformer');

const indexViewRouter = require(path.join(__dirname + process.env.VIEWS, 'index'));
const usersViewRouter = require(path.join(__dirname + process.env.VIEWS, 'users'));
const gameViewRouter = require(path.join(__dirname + process.env.VIEWS, 'game'));
const authViewRouter = require(path.join(__dirname + process.env.VIEWS, 'auth'));

const scoreRepository = require(path.join(__dirname + process.env.REPOSITORY, 'scoreRepository'));
const userRepository = require(path.join(__dirname + process.env.REPOSITORY, 'userRepository'));
const authRepository = require(path.join(__dirname + process.env.REPOSITORY, 'authRepository'));

const app = express();
const api = express.Router();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: process.env.SECRET, 
  saveUninitialized: true,
  resave: true
}));
app.use(flash());

app.use('/', indexViewRouter);
app.use('/', authViewRouter);
app.use('/users', usersViewRouter);
app.use('/game', gameViewRouter);

app.use(process.env.API_VERSION, api);
api.use('', authRepository);
api.use('/score', scoreRepository);
api.use('/user', userRepository);

app.locals.baseUrl = process.env.BASE_URL;
app.locals.baseUrlApi = process.env.BASE_URL_API;

app.use(function(req, res, next) {
  res.locals.user = req.session.user;
  next();
});

app.use(function(req, res, next) {
  next(createError(404));
});

app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
