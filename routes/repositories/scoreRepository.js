require('dotenv').config();

const express = require("express");
const fs = require('fs');
var path = require('path');
var { dirname } = require('path');
var { transformer } = require('express-transformer');

const scoreRepository = process.env.DATABASE + 'scores.json';
const userRepository = process.env.DATABASE + 'users.json';
const score = express.Router();

JSON.filter = require('node-json-filter');

score.get('/', (req, res) => {
    const scores = fs.readFileSync(scoreRepository, 'utf-8');
    const data = JSON.parse(scores);

    var result = data;

    if(req.query.user_id){
        var user_id = req.query.user_id;
        result = data.filter((item) => item.user_id == user_id);
    }

    if(req.query.id){
        var id = req.query.id;
        result = data.filter((item) => item.id == id);
    }

    if(req.query.status){
        var status = req.query.status;
        result = data.filter((item) => item.status == status);
    }

    return res.status(200).json({
        code: 201,
        message: "Data showed!",
        result: result
    });

});

score.get('/leaderboard', (req, res) => {
    const scores = fs.readFileSync(scoreRepository, 'utf-8');
    const users = fs.readFileSync(userRepository, 'utf-8');
    const data = JSON.parse(scores);

    var result = data;

    if(req.query.user_id){
        var user_id = req.query.user_id;
        result = data.filter((item) => item.user_id == user_id);
    }

    if(req.query.id){
        var id = req.query.id;
        result = data.filter((item) => item.id == id);
    }

    if(req.query.status){
        var status = req.query.status;
        result = data.filter((item) => item.status == status);
    }

    return res.status(200).json({
        code: 201,
        message: "Data showed!",
        result: result
    });
});

score.post('/', (req, res) => {
    return save(req, res);
});

score.post('/save', (req, res) => {
    return save(req, res);
});

score.put('/', (req, res) => {
    const { id, user_id, status, created_at } = req.body;
    var scores = fs.readFileSync(scoreRepository, 'utf-8');
    var data = JSON.parse(scores);

    if(!id){
        return res.status(400).json({
            code: 400,
            message: "attribute id not found!",
            result: null
        });
    }

    var score = data.find((item) => item.id == id);

    if(!score){
        return res.status(400).json({
            code: 400,
            message: "data not found!",
            result: score
        });
    }

    var updateScore = {
        "id" : score.id,
        "user_id" : user_id ?? score.user_id,
        "status" : status ?? score.status,
        "created_at" : created_at ?? score.created_at
    };

    const scoreIndex = data.findIndex((item) => item.id == id);
    data[scoreIndex] = updateScore
    fs.writeFileSync(scoreRepository, JSON.stringify(data, null, 2));

    return res.status(201).json({
        code: 200,
        message: "Score Successfully Updated!",
        result: updateScore
    });

});

score.delete('/', (req, res) => {
    const { id } = req.body;
    var scores = fs.readFileSync(scoreRepository, 'utf-8');
    var data = JSON.parse(scores);

    if(!id){
        return res.status(400).json({
            code: 400,
            message: "attribute id not found!",
            result: null
        });
    }

    var score = data.find((item) => item.id == id);

    if(score.length == 0){
        return res.status(400).json({
            code: 400,
            message: "data score not found!",
            result: score
        });
    }

    const scoresAfterDelete = data.filter((item) => item.id != id);
    fs.writeFileSync(scoreRepository, JSON.stringify(scoresAfterDelete, null, 2));

    return res.status(201).json({
        code: 200,
        message: "Score Successfully deleted!",
        result: score
    });

});

var stored = function(req, res){
    const { user_id, status, created_at } = req.body;
    var scores = fs.readFileSync(scoreRepository, 'utf-8');
    var data = JSON.parse(scores);

    if(!user_id){
        return res.status(400).json({
            code: 400,
            message: "attribute user_id not found!",
            result: []
        });
    }

    if(!status && status != '0'){
        return res.status(400).json({
            code: 400,
            message: "attribute status not found!",
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

    var newScore = {
        "id" : data.length + 1,
        "user_id" : user_id,
        "status" : status,
        "created_at" : created_at
    };

    data.push(newScore),
    fs.writeFileSync(scoreRepository, JSON.stringify(data, null, 2));

    var ret = {
        code: 201,
        message: "Score Successfully Stored!",
        result: newScore
    };

    return ret;
}

module.exports = score;
module.exports.stored = stored;