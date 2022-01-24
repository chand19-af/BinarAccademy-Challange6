require('dotenv').config();

const path = require('path');
const { dirname } = require('path');

const express = require('express');

const router = express.Router();
const Auth = require(path.join(dirname(require.main.path), process.env.MIDDLEWARE));
const Session = require(path.join(dirname(require.main.path), process.env.SESSION));

router.get('/', function(req, res, next) {
  res.render('index', {
    user: Session
  });
});

module.exports = router;
