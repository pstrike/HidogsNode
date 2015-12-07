var db = require('../../db/db'),
    operation = require('../../model/operation');

exports.engine = 'ejs';

exports.show = function(req, res, next){
    operation.getObject(operation.getCollectionList().user, req.params.user_id, req.projection, function(object) {
        res.send(object);
    })
};

exports.list = function(req, res, next){
    operation.getObjectList(operation.getCollectionList().user, req.filter, req.projection, function(objectList) {
        res.send(objectList);
    })
};

exports.update = function(req, res, next){
    if(req.body) {
        operation.updateObject(operation.getCollectionList().user, req.body, function(result) {
            if(result.status == 'fail') {
                next(result.err);
            }
            res.send(result);
        });
    }
};

exports.insert = function(req, res, next){
    if(req.body) {
        operation.insertObject(operation.getCollectionList().user, req.body, function(result) {
            if(result.status == 'fail') {
                next(result.err);
            }
            res.send(result);
        });
    }
};

exports.page = function(req, res, next){

};