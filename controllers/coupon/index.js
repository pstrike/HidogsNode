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

    var filter = {};
    if(req.filter) {
        filter = req.filter;
    }

    var idList = [];
    if(req.query.idlist) {
        if(req.query.idlist.indexOf(",") > -1) {
            idList = req.query.idlist.split(",");
        }
        else {
            idList.push(req.query.idlist);
        }

        var orList = idList.map(function(item) {
            return {coupon_id: item}
        })
        filter['$or'] = orList;
    }

    operation.getObjectList(operation.getCollectionList().coupon, filter, req.projection, function(objectList) {
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
            // for local testing
            //req.session.current_user = {
            //    vendor_id: "d18c4e5c-6f49-7f82-7d49-db362c64cb03",
            //    openid: "oxN2Mt-BQvXep8Jb0vF3ilHbt9Vc",
            //    head_image_url: "http://wx.qlogo.cn/mmopen/ajNVdqHZLLAKwztbcTspbibFnCLP5D5eToEsia8SZXvjHu0swsd455HIcl5hxzK3jREKYhEqykVFYYhZZI7FZOgg/0",
            //    nick_name: "one_pan",
            //};

            res.render('vendorcoupon.ejs');
            break;

        default:
            next();
    }
};

exports.otherget = function(req, res, next) {
    var type = req.params.coupon_id;

    switch (type) {
        case 'getcoupon':
            var userId = req.query.userid;
            var vendorId = req.query.vendorid;
            var productId = req.query.productid;
            var couponList = [];
            var today = new Date();
            var dueDate;

            var filter = {
                status: "published",
                is_active: true,
                occupied: userId,
                //used: {$ne: userId},
                //due_date: {$gt: new Date()},
                $or: [
                    {'rule.product': productId},
                    {'rule.vendor': vendorId},
                    {'rule.user': userId},
                ],
            }

            operation.getObjectList(operation.getCollectionList().coupon, filter, req.projection, function(objectList) {
                objectList.forEach(function(item) {

                    dueDate = new Date(item.due_date);

                    if(item.type == 'once'){
                        var isUsed = false;
                        for(var i=0; i<item.used.length; i++) {
                            if(item.used[i] == userId) {
                                isUsed = true;
                            }
                        }

                        if(today < dueDate && !isUsed) {
                            couponList.push(item);
                        }
                    }
                    else {
                        if(today < dueDate) {
                            couponList.push(item);
                        }
                    }

                })
                res.send(couponList);
            })

            break;

        default:
            next();
    }
};

exports.otherpost = function(req, res, next){
    var type = req.params.coupon_id;

    switch (type) {
        case 'checkthenadd':
            /*
            expect input is
            {
                code: xxx,
                user_id: xxx,
            }

            return is
            successful: {result: "ok"}
            fail: {result: "invalid"}
             */
            var code = req.body.code;
            var userId = req.body.user_id;
            var newCoupon;

            var filter = {
                code: code
            };

            operation.getObjectList(operation.getCollectionList().coupon, filter, {}, function(objectList) {
                if(objectList.length > 0) {
                    newCoupon = objectList[0];

                    var isReOccupiedCode = false;
                    for(var i=0; i<newCoupon.occupied.length; i++) {
                        if(newCoupon.occupied[i] == userId) {
                            isReOccupiedCode = true;
                        }
                    }

                    if(isReOccupiedCode) {
                        res.send({result: "invalid"});
                    }
                    else {
                        newCoupon.occupied.push(userId);

                        operation.updateObject(operation.getCollectionList().coupon, newCoupon, function(result) {
                            if(result.status == 'fail') {
                                next(result.err);
                            }

                            operation.getObject(operation.getCollectionList().user, userId, {}, function(object) {

                                var newUser = object;
                                if(!newUser.coupon_list) {
                                    newUser.coupon_list = [];
                                }
                                newUser.coupon_list.push(newCoupon.coupon_id)

                                operation.updateObject(operation.getCollectionList().user, newUser, function(result) {
                                    if(result.status == 'fail') {
                                        next(result.err);
                                    }
                                    res.send({result: "ok", coupon: newCoupon});
                                })
                            })
                        });
                    }
                }
                else {
                    res.send({result: "invalid"});
                }
            })

            break;

        case 'checkthenuse':
            /*
             expect input is
             {
             coupon_id: xxx,
             user_id: xxx,
             }

             return is
             successful: {result: "ok"}
             fail: {result: "invalid"}
             */
            var couponId = req.body.coupon_id;
            var userId = req.body.user_id;
            var newCoupon;

            var filter = {
                coupon_id: couponId
            };

            operation.getObjectList(operation.getCollectionList().coupon, filter, {}, function(objectList) {
                if(objectList.length > 0) {
                    newCoupon = objectList[0];

                    var isReUsedCode = false;
                    for(var i=0; i<newCoupon.used.length; i++) {
                        if(newCoupon.used[i] == userId) {
                            isReUsedCode = true;
                        }
                    }

                    if(isReUsedCode) {
                        res.send({result: "invalid"});
                    }
                    else {
                        newCoupon.used.push(userId);

                        operation.updateObject(operation.getCollectionList().coupon, newCoupon, function(result) {
                            if(result.status == 'fail') {
                                next(result.err);
                            }
                            res.send({result: "ok", coupon: newCoupon});
                        });
                    }
                }
                else {
                    res.send({result: "invalid"});
                }
            })


            break;

        default:
            next();
    }


};