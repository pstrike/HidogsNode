var db = require('../../db/db');

exports.engine = 'ejs';

exports.show = function(req, res, next){
    db.get().collection('user').find({"openid":req.params.user_id}, req.projection).limit(1).toArray(function(err, docs) {
        res.send(docs[0]);
    });
};

exports.list = function(req, res, next){
    db.get().collection('user').find(req.filter, req.projection).toArray(function(err, docs) {
        res.send(docs);
    });
};

exports.update = function(req, res, next){
    if(req.body) {
        db.get().collection('user').updateOne(
            {"openid": req.body.openid},
            {
                $set: req.body,
                $currentDate: { "modified_time": true }
            }, function (err, result) {
                if(err) {
                    console.log("[DB Err]"+err);
                    next(err);
                }
                else {
                    res.send(req.body);
                }
            });
    }
};

exports.insert = function(req, res, next){
    res.send("user insert");
};

exports.page = function(req, res, next){
    res.send("user page");
};