require('dotenv').config();

const express = require("express");
const fs = require('fs');
const path = require('path');
const { dirname } = require('path');
const { transformer } = require('express-transformer');

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

var topScore = function(req, res){
    const scores = fs.readFileSync(scoreRepository, 'utf-8');
    const users = fs.readFileSync(userRepository, 'utf-8');
    const data = JSON.parse(scores);
    const dataUser = JSON.parse(users);

    for (var key in dataUser){

        var win = data.filter((item) => item.user_id == dataUser[key].id && item.status == 1);
        var lose = data.filter((item) => item.user_id == dataUser[key].id && item.status == 0);
        var draw = data.filter((item) => item.user_id == dataUser[key].id && item.status == 2);
        var total = data.filter((item) => item.user_id == dataUser[key].id);
        var win_percent = win.length * 100 / total.length;
        var lose_percent = lose.length * 100 / total.length;
        var draw_percent = draw.length * 100 / total.length;

        dataUser[key] = {
            'user_id' : dataUser[key].user_id,
            'username' : dataUser[key].username,
            'gender' : dataUser[key].gender ? dataUser[key].gender : "-",
            'win' : win.length,
            'win_percent' : win_percent,
            'lose' : lose.length,
            'lose_percent' : lose_percent,
            'draw' : draw.length,
            'draw_percent' : draw_percent,
            'total' : total.length,
        };

    }

    dataUser.sort((a, b) => {
        if(a.win === b.win) {
          return b.win_percent - a.win_percent;
        } else {
          return b.win - a.win;
        }
    });

    var ret = {
        code: 200,
        message: "Data showed!",
        result: dataUser
    };

    return ret;
}

module.exports = score;
module.exports.stored = stored;
module.exports.topScore = topScore;