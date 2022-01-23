require('dotenv').config();

var path = require('path');
var { dirname } = require('path');

var express = require('express');
var auth = require(path.join(dirname(require.main.path) + process.env.REPOSITORY, 'authRepository'));
var bcrypt = require('bcrypt');
var salt = bcrypt.genSaltSync(10);

var router = express.Router();
var Auth = require(path.join(dirname(require.main.path), process.env.MIDDLEWARE));
var Session = require(path.join(dirname(require.main.path), process.env.SESSION));

router.get('/login', function(req, res, next) {
    res.render('login');
});

router.get('/logout', function(req, res, next) {
    Session.remove();

    res.redirect('/');
});

router.post('/login', function(req, res, next) {
    var check = auth.login(req, res, next);

    if(check.code == '200'){
        req.session.user = check.result;
        req.session.isLoggedIn = true;

        var data = {
            "id" : bcrypt.hashSync("password", salt),
            "user_id" : check.result.id,
            "username" : check.result.username,
            "gender" : check.result.gender
        };
        
        Session.stored(data);

        res.redirect('/');

    } else {
        req.session.isLoggedIn = false;

        res.redirect('/login');

    }
});

module.exports = router;
