require('dotenv').config();

var express = require('express');
const session = require('express-session');
const fs = require('fs');

var app = express();
var bcrypt = require('bcrypt');
var salt = bcrypt.genSaltSync(10);
var sessionUrl = process.env.SESSION_DATA;
var sessionRepository = fs.readFileSync(sessionUrl, 'utf-8');
var sessionData = JSON.parse(sessionRepository);

if(!sessionData){
    var newSession = {
        "id" : bcrypt.hashSync("user", salt),
        "user_id" : 0,
        "username" : 0,
        "gender" : null
    };

    sessionData.push(newSession),
    fs.writeFileSync(sessionUrl, JSON.stringify(sessionData, null, 2));
}

var Session = {
    session : sessionData,
    user_check : function (req, res, next){

        if (sessionData[0].user_id == 0) {
            return res.redirect('/login');
        }

        next();
    },
    stored : function (data){
        var newSession = data;

        if (sessionData.user_id == 0 || !sessionData) {

            sessionData.push(newSession),
            fs.writeFileSync(sessionUrl, JSON.stringify(sessionData, null, 2));

        } else {

            console.log(sessionUrl);
            sessionData[0] = newSession;
            fs.writeFileSync(sessionUrl, JSON.stringify(sessionData, null, 2));

        }
    },
    remove : function (data = null){
        var newSession = {
            "id" : bcrypt.hashSync("logout", salt),
            "user_id" : 0,
            "username" : 0,
            "gender" : null,
        };

        sessionData[0] = newSession;
        fs.writeFileSync(sessionUrl, JSON.stringify(sessionData, null, 2));

    }
};

module.exports = Session;