require('dotenv').config();

var path = require('path');
var { dirname } = require('path');

var express = require('express');

var router = express.Router();
var Auth = require(path.join(dirname(require.main.path), process.env.MIDDLEWARE));
var Session = require(path.join(dirname(require.main.path), process.env.SESSION));
var scoreRepository = require(path.join(dirname(require.main.path), process.env.REPOSITORY) + 'scoreRepository');

router.get('/', Session.user_check, function(req, res, next) {
  res.render('game', {
    user: Session
  });
});

router.post('/save', function(req, res, next) {
  var save = scoreRepository.stored(req, res);

  if(save.code == 201){
    return res.status(201).json(save);
  }
});

module.exports = router;
