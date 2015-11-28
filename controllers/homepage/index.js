var operation = require('../../model/operation');

exports.show = function(req, res, next){
    operation.getObject(operation.getCollectionList().vendor_potential, req.params.homepage_id, req.projection, function(object) {
        res.send(object);
    })
};

exports.list = function(req, res, next){
    operation.getObjectList(operation.getCollectionList().vendor_potential, req.filter, req.projection, function(objectList) {
        res.send(objectList);
    })
};

exports.update = function(req, res, next){

    if(req.body) {
        operation.updateObject(operation.getCollectionList().vendor_potential, req.body, function(result) {
            if(result.status == 'fail') {
                next(result.err);
            }
            res.send(result);
        });
    }
};

exports.insert = function (req, res, next) {

    if(req.body) {
        operation.insertObject(operation.getCollectionList().vendor_potential, req.body, function(result) {
            if(result.status == 'fail') {
                next(result.err);
            }
            res.send(result);
        });
    }
};
