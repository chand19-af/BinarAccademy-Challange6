require('dotenv').config();

const express = require("express");
const fs = require('fs');
const path = require('path');
const { dirname } = require('path');
const { transformer } = require('express-transformer');
const bcrypt = require('bcrypt');
const salt = bcrypt.genSaltSync(10);

const userRepository = process.env.DATABASE + '/users.json';
const auth = express.Router();

JSON.filter = require('node-json-filter');

auth.post('/login', (req, res) => {
    var ret = login(req, res);

    return res.status(200).json({
        code: 200,
        message: "Login Success!",
        result: ret
    });
});

auth.post('/register', (req, res) => {
    var ret = register(req, res);

    return res.status(200).json({
        code: 200,
        message: "Register Success!",
        result: ret
    });
});

var login = function login(req, res, next = null){
    const { username, password } = req.body;
    var users = fs.readFileSync(userRepository, 'utf-8');
    var data = JSON.parse(users).find((item) => item.username == username);
    var check;

    if(!username){
        req.session.isLoggedIn = false;
        return {
            code: 400,
            message: "attribute username not found!",
            result: []
        };
    }

    if(!password){
        req.session.isLoggedIn = false;
        return {
            code: 400,
            message: "attribute password not found!",
            result: []
        };
    }

    if(!data){
        req.session.isLoggedIn = false;
        return {
            code: 400,
            message: "username doesnt exist!",
            result: []
        };
    } else {
        check = bcrypt.compareSync(password, data.password);
    }

    if(!check){
        return {
            code: 400,
            message: "wrong password!",
            result: []
        };
    }

    req.session.user = data;
    req.session.isLoggedIn = true;

    var ret = {
        code: 200,
        message: "Success Login!",
        result: data
    };

    return ret;
}

var register = function register(req, res, next = null){
    const { username, password, gender } = req.body;
    var users = fs.readFileSync(userRepository, 'utf-8');
    var data = JSON.parse(users);
    var check_username = data.find((item) => item.username == username);

    if(!username){
        return res.status(400).json({
            code: 400,
            message: "attribute username not found!",
            result: []
        });
    }

    if(!password){
        return res.status(400).json({
            code: 400,
            message: "attribute password not found!",
            result: []
        });
    }

    if(check_username){
        return res.status(400).json({
            code: 400,
            message: "username exist!",
            result: []
        });
    }

    var newUser = {
        "id" : data[data.length-1].id + 1,
        "username" : username,
        "password" : bcrypt.hashSync(password, salt),
        "gender" : gender,
        "created_at" : new Date(Date.now())
    };

    data.push(newUser),
    fs.writeFileSync(userRepository, JSON.stringify(data, null, 2));

    req.session.user = newUser;
    req.session.isLoggedIn = true;

    var ret = {
        code: 200,
        message: "Register Success!",
        result: newUser
    }

    return ret;
}

module.exports = auth;
module.exports.login = login;
module.exports.register = register;