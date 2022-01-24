require('dotenv').config();
const swal = require('sweetalert');

const path = require('path');
const { dirname } = require('path');

const express = require('express');
const auth = require(path.join(dirname(require.main.path) + process.env.REPOSITORY, 'authRepository'));
const bcrypt = require('bcrypt');
const salt = bcrypt.genSaltSync(10);

const router = express.Router();
const Auth = require(path.join(dirname(require.main.path), process.env.MIDDLEWARE));
const Session = require(path.join(dirname(require.main.path), process.env.SESSION));

router.get('/login', function(req, res, next) {
    res.render('login');
});

router.get('/register', function(req, res, next) {
    res.render('register');
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

        res.render('/login', {
            message : check.message
        });

    }
});

router.post('/register', function(req, res, next) {
    var check = auth.register(req, res, next);

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

        res.redirect('/register');

    }
});

module.exports = router;
