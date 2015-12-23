var db = require('../../db/db'),
    operation = require('../../model/operation'),
    uuid = require('../../util/genuuid'),
    asyncloop = require('../../util/asyncloop');

exports.engine = 'ejs';

exports.show = function(req, res, next){
    operation.getObject(operation.getCollectionList().coupon, req.params.coupon_id, req.projection, function(object) {
        res.send(object);
    })
};

exports.list = function(req, res, next){
    operation.getObjectList(operation.getCollectionList().coupon, req.filter, req.projection, function(objectList) {
        res.send(objectList);
    })
};

exports.update = function(req, res, next){
    if(req.body) {
        operation.updateObject(operation.getCollectionList().coupon, req.body, function(result) {
            if(result.status == 'fail') {
                next(result.err);
            }
            res.send(result);
        });
    }
};

exports.insert = function(req, res, next){
    if(req.body) {
        var couponCode;

        asyncloop.asyncLoop(99, function(loop) {
                couponCode = uuid.uuid().substring(0,4);

                operation.getObjectList(operation.getCollectionList().coupon, {code: couponCode}, {coupon_id: 1}, function(objectList) {
                    if(objectList.length == 0) {
                        loop.break();
                    }
                    else {
                        loop.next();
                    }
                })
            },
            function(){
                req.body.code = couponCode;

                operation.insertObject(operation.getCollectionList().coupon, req.body, function(result) {
                    if(result.status == 'fail') {
                        next(result.err);
                    }

                    result.code = couponCode;

                    res.send(result);
                });
            }
        );
    }
};

exports.page = function(req, res, next){
    var page = req.params.coupon_id;

    switch (page) {
        case 'usercoupon':
            // for local testing
            //req.session.current_user = {
            //    user_id: "e79fe7aa-2dfe-1fd6-76e9-b62985b0aa7a",
            //    head_image_url: "http://wx.qlogo.cn/mmopen/ajNVdqHZLLAKwztbcTspbibFnCLP5D5eToEsia8SZXvjHu0swsd455HIcl5hxzK3jREKYhEqykVFYYhZZI7FZOgg/0",
            //    nick_name: "one_pan",
            //};

            res.render('usercoupon.ejs');
            break;

        case 'vendorcoupon':
            res.render('vendorcoupon.ejs');
            break;

        default:
            next();
    }
};