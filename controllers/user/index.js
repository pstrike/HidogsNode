var db = require('../../db/db'),
    operation = require('../../model/operation'),
    prototype = require('../../model/prototype');

exports.engine = 'ejs';

exports.show = function(req, res, next){
    operation.getObject(operation.getCollectionList().user, req.params.user_id, req.projection, function(object) {
        res.send(object);
    })
};

exports.list = function(req, res, next){

    var filter = {};
    if(req.filter) {
        filter = req.filter;
    }

    var userIdList = [];
    if(req.query.idlist) {
        if(req.query.idlist.indexOf(",") > -1) {
            userIdList = req.query.idlist.split(",");
        }
        else {
            userIdList.push(req.query.idlist);
        }

        var orList = userIdList.map(function(item) {
            return {user_id: item}
        })
        filter['$or'] = orList;
    }

    operation.getObjectList(operation.getCollectionList().user, filter, req.projection, function(objectList) {
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
    else {
        next();
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
    else {
        next();
    }
};

exports.page = function(req, res, next){
    var page = req.params.user_id;

    switch (page) {
        case 'userfav':
            // for local testing
            //req.session.current_user = {
            //    user_id: "e79fe7aa-2dfe-1fd6-76e9-b62985b0aa7a",
            //    head_image_url: "http://wx.qlogo.cn/mmopen/ajNVdqHZLLAKwztbcTspbibFnCLP5D5eToEsia8SZXvjHu0swsd455HIcl5hxzK3jREKYhEqykVFYYhZZI7FZOgg/0",
            //    nick_name: "one_pan",
            //};

            res.render('userfav.ejs');
            break;

        default:
            next();
    }
};

exports.otherpost = function(req, res, next){
    var type = req.params.user_id;

    switch (type) {
        case 'location':
            /*
            {
                user_id: user_id,
                address: address,
                location: location,
            }
             */

            if(req.body) {
                var inputUser = req.body;

                operation.getObject(operation.getCollectionList().user, inputUser.user_id, {user_id:1, address:1, location:1, history_locations:1}, function(user) {
                    if(user) {

                        var newUser = {
                            user_id: user.user_id,
                            address: inputUser.address,
                            location: inputUser.location,
                        }

                        if(user.history_locations) {
                            newUser.history_locations = [
                                {
                                    address: user.address,
                                    location: user.location,
                                },
                                user.history_locations[0],
                                user.history_locations[1],
                            ];
                        }
                        else {
                            newUser.history_locations = prototype.getUserPrototype().history_locations;
                            newUser.history_locations[0] = {
                                address: inputUser.address,
                                location: inputUser.location
                            };
                        }

                        operation.updateObject(operation.getCollectionList().user, newUser, function(result) {
                            if(result.status == 'fail') {
                                next(result.err);
                            }
                            res.send(result);
                        });
                    }
                    else {
                        next();
                    }
                })
            }
            else {
                next();
            }

            break;

        default:
            next();
    }
};