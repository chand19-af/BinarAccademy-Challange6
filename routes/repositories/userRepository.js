require('dotenv').config();

const express = require("express");
const fs = require('fs');
const path = require('path');
const { dirname } = require('path');
const { transformer } = require('express-transformer');
const bcrypt = require('bcrypt');
const salt = bcrypt.genSaltSync(10);

const userRepository = process.env.DATABASE + '/users.json';
const user = express.Router();

JSON.filter = require('node-json-filter');

user.get('/', (req, res) => {
    const users = fs.readFileSync(userRepository, 'utf-8');
    const data = JSON.parse(users);

    var result = data;

    if(req.query.id){
        var id = req.query.id;
        result = data.filter((item) => item.id == id);
    }

    if(req.query.username){
        var username = req.query.username;
        result = data.filter((item) => item.username == username);
    }

    if(req.query.gender){
        var gender = req.query.gender;
        result = data.filter((item) => item.gender == gender);
    }

    return res.status(200).json({
        code: 200,
        message: "Data showed!",
        result: result
    });

});

user.post('/', (req, res) => {
    const { username, password, gender, created_at } = req.body;
    var users = fs.readFileSync(userRepository, 'utf-8');
    var data = JSON.parse(users);

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

    if(!gender){
        return res.status(400).json({
            code: 400,
            message: "attribute gender not found!",
            result: []
        });
    }

    if(!created_at){
        return res.status(400).json({
            code: 400,
            message: "attribute created_at not found!",
            result: []
        });
    }

    var newUser = {
        "id" : data.length + 1,
        "username" : username,
        "password" : bcrypt.hashSync(password, salt),
        "gender" : gender,
        "created_at" : created_at
    };

    data.push(newUser),
    fs.writeFileSync(userRepository, JSON.stringify(data, null, 2));

    return res.status(201).json({
        code: 201,
        message: "User Successfully Stored!",
        result: newUser
    });

});

user.put('/', (req, res) => {
    const { id, username, password, gender, created_at } = req.body;
    var users = fs.readFileSync(userRepository, 'utf-8');
    var data = JSON.parse(users);
    var user = data.find((item) => item.id == id);

    if(!id){
        return res.status(400).json({
            code: 400,
            message: "attribute id not found!",
            result: null
        });
    }

    if(!user){
        return res.status(400).json({
            code: 400,
            message: "data not found!",
            result: user
        });
    }

    if(password){
        newPassword = bcrypt.hashSync(password, salt);
    }

    var updateUser = {
        "id" : user.id,
        "username" : username ?? user.username,
        "password" : password ? newPassword : user.password,
        "gender" : gender ?? user.gender,
        "created_at" : created_at ?? user.created_at
    };

    const scoreIndex = data.findIndex((item) => item.id == id);
    data[scoreIndex] = updateUser
    fs.writeFileSync(userRepository, JSON.stringify(data, null, 2));

    return res.status(201).json({
        code: 200,
        message: "user Successfully Updated!",
        result: updateUser
    });

});

user.delete('/', (req, res) => {
    const { id } = req.body;
    var user = fs.readFileSync(userRepository, 'utf-8');
    var data = JSON.parse(user);

    if(!id){
        return res.status(400).json({
            code: 400,
            message: "attribute id not found!",
            result: null
        });
    }

    var user = data.find((item) => item.id == id);

    if(user.length == 0){
        return res.status(400).json({
            code: 400,
            message: "data user not found!",
            result: user
        });
    }

    const userAfterDelete = data.filter((item) => item.id != id);
    fs.writeFileSync(userRepository, JSON.stringify(userAfterDelete, null, 2));

    return res.status(201).json({
        code: 200,
        message: "User Successfully Deleted!",
        result: []
    });

});

module.exports = user;