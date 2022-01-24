require('dotenv').config();

const path = require('path');
const { dirname } = require('path');

const express = require('express');

const router = express.Router();
const Auth = require(path.join(dirname(require.main.path), process.env.MIDDLEWARE));
const Session = require(path.join(dirname(require.main.path), process.env.SESSION));
const scoreRepository = require(path.join(dirname(require.main.path), process.env.REPOSITORY) + 'scoreRepository');

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

router.get('/top-score', function(req, res, next) {
  var dataScore = scoreRepository.topScore(req, res);

  if(dataScore.code == 200){
    res.render('game-score', {
      data: dataScore,
      user: Session
    });
  }
});

module.exports = router;
