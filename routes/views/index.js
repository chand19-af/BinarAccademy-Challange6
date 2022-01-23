require('dotenv').config();

var path = require('path');
var { dirname } = require('path');

var express = require('express');

var router = express.Router();
var Auth = require(path.join(dirname(require.main.path), process.env.MIDDLEWARE));
var Session = require(path.join(dirname(require.main.path), process.env.SESSION));
var session_store;

router.get('/', function(req, res, next) {
  res.render('index', {
    user: Session
  });
});

module.exports = router;
