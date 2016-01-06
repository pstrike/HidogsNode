var React = require('react'),
    operation = require('../../model/operation'),
    asyncloop = require('../../util/asyncloop'),
    genordercode = require('../../util/genordercode');

exports.engine = 'ejs';

exports.show = function(req, res, next){
    operation.getObject(operation.getCollectionList().order, req.params.order_id, req.projection, function(order) {

        supplementOrderRefValue([order], function(updatedOrderList) {
            res.send(updatedOrderList[0]);
        });
    })
};

exports.list = function(req, res, next){

    operation.getObjectList(operation.getCollectionList().order, req.filter, req.projection, function(orderList) {

        supplementOrderRefValue(orderList, function(updatedOrderList) {
            updatedOrderList.sort(function(a,b){return a.created_time<b.created_time?1:-1}); //sort from latest to oldest

            res.send(updatedOrderList);
        });
    })
};

exports.update = function(req, res, next){
    if(req.body) {

        var order = req.body;

        if(order.booked_time && order.booked_time.start_time) {
            order.booked_time.start_time = new Date(order.booked_time.start_time);
        }

        if(order.booked_time && order.booked_time.end_time) {
            order.booked_time.end_time = new Date(order.booked_time.end_time);
        }

        operation.updateObject(operation.getCollectionList().order, order, function(result) {
            if(result.status == 'fail') {
                next(result.err);
            }
            res.send(result);
        });
    }
};

exports.insert = function(req, res, next){
    if(req.body) {

        var order = req.body;

        if(order.booked_time && order.booked_time.start_time) {
            order.booked_time.start_time = new Date(order.booked_time.start_time);
        }

        if(order.booked_time && order.booked_time.end_time) {
            order.booked_time.end_time = new Date(order.booked_time.end_time);
        }

        operation.insertObject(operation.getCollectionList().order, order, function(result) {
            if(result.status == 'fail') {
                next(result.err);
            }
            res.send(result);
        });
    }
};

exports.page = function(req, res, next){
    var page = req.params.order_id;

    switch (page) {
        case 'vendororder':
            // for local testing
            //req.session.current_user = {
            //    vendor_id: "bf98f593-071e-48d7-3c73-e0e2f47c45af",
            //    openid: "oxN2Mt-BQvXep8Jb0vF3ilHbt9Vc",
            //    head_image_url: "http://wx.qlogo.cn/mmopen/ajNVdqHZLLAKwztbcTspbibFnCLP5D5eToEsia8SZXvjHu0swsd455HIcl5hxzK3jREKYhEqykVFYYhZZI7FZOgg/0",
            //    nick_name: "one_pan",
            //};

            res.render('vendororder.ejs');
            break;

        case 'userorder':
            // for local testing
            //req.session.current_user = {
            //    user_id: "e79fe7aa-2dfe-1fd6-76e9-b62985b0aa7a",
            //    openid: "oiDjPvgsHMlb71D9t8hSgBVz4Gzg",
            //    head_image_url: "http://wx.qlogo.cn/mmopen/ajNVdqHZLLAKwztbcTspbibFnCLP5D5eToEsia8SZXvjHu0swsd455HIcl5hxzK3jREKYhEqykVFYYhZZI7FZOgg/0",
            //    nick_name: "one_pan",
            //};

            res.render('userorder.ejs');
            break;

        case 'userordercreation':
            var productId = req.query.productid;

            // for local testing
            //req.session.current_user = {
            //    user_id: "e79fe7aa-2dfe-1fd6-76e9-b62985b0aa7a",
            //    openid: "oiDjPvgsHMlb71D9t8hSgBVz4Gzg",
            //    head_image_url: "http://wx.qlogo.cn/mmopen/ajNVdqHZLLAKwztbcTspbibFnCLP5D5eToEsia8SZXvjHu0swsd455HIcl5hxzK3jREKYhEqykVFYYhZZI7FZOgg/0",
            //    nick_name: "one_pan",
            //};

            operation.getObject(operation.getCollectionList().product, productId, {category:1}, function(object) {

                if (object) {
                    var hgstyle = "";

                    switch (object.category.product_meta_category_id) {
                        case "1-1-1":
                            hgstyle = "../../css/hggreen_tint.css";
                            break;

                        case "1-1-2":
                            hgstyle = "../../css/hgred_tint.css";
                            break;

                        case "1-1-3":
                            hgstyle = "../../css/hgblue_tint.css";
                            break;

                        case "1-1-4":
                            hgstyle = "../../css/hgyellow_tint.css";
                            break;

                    }

                    res.render('userordercreation.ejs', {productId: productId, hgstyle: hgstyle});
                }
                else {
                    next();
                }
            })
            break;

        case 'userordercreationdone':
            var orderId = req.query.orderid;
            var productId = req.query.productid;
            var isOnSite = "false";
            // for local testing
            //req.session.current_user = {
            //    user_id: "e79fe7aa-2dfe-1fd6-76e9-b62985b0aa7a",
            //    openid: "oiDjPvgsHMlb71D9t8hSgBVz4Gzg",
            //    head_image_url: "http://wx.qlogo.cn/mmopen/ajNVdqHZLLAKwztbcTspbibFnCLP5D5eToEsia8SZXvjHu0swsd455HIcl5hxzK3jREKYhEqykVFYYhZZI7FZOgg/0",
            //    nick_name: "one_pan",
            //};

            operation.getObject(operation.getCollectionList().product, productId, {category: 1, tag_list: 1}, function (object) {

                if (object) {
                    for (var i = 0; i < object.tag_list.length; i++) {
                        if (object.tag_list[i] == "上门服务") {
                            isOnSite = "true";
                            break;
                        }
                    }
                    var hgstyle = "";

                    switch (object.category.product_meta_category_id) {
                        case "1-1-1":
                            hgstyle = "../../css/hggreen_tint.css";
                            break;

                        case "1-1-2":
                            hgstyle = "../../css/hgred_tint.css";
                            break;

                        case "1-1-3":
                            hgstyle = "../../css/hgblue_tint.css";
                            break;

                        case "1-1-4":
                            hgstyle = "../../css/hgyellow_tint.css";
                            break;

                    }

                    res.render('userordercreationdone.ejs', {orderid: orderId, hgstyle: hgstyle, isonsite: isOnSite});
                }
                else {
                    next();
                }
            })

            break;

        default:
            /* istanbul ignore next */
            throw new Error('unrecognized route: /order/' + page);
    }
};


exports.otherget = function(req, res, next){
    var type = req.query.type;
    var id = req.params.order_id;

    switch (type) {
        case 'checkavailability':
            var startTime = new Date(JSON.parse(req.query.starttime));
            var endTime = new Date(JSON.parse(req.query.endtime));

            var filter = {
                'vendor.vendor_id': id,
                $and: [
                    {$or: [ { status: "tbconfirmed" },
                            { status: "tbserviced" },
                            { status: "tbcommented" },
                            { status: "completed" },
                            { status: "tbpaidconfirmed" },
                    ]},
                    {$or: [
                            {$and: [{'booked_time.start_time': {$lt: startTime}}, {'booked_time.end_time': {$gt: endTime}}]},
                            {$and: [{'booked_time.end_time': {$gt: startTime}}, {'booked_time.end_time': {$lte: endTime}}]},
                            {$and: [{'booked_time.start_time': {$gte: startTime}}, {'booked_time.start_time': {$lt: endTime}}]},
                    ]},
                ],
            };

            operation.getObjectList(operation.getCollectionList().order, filter, {}, function(orderList) {
                res.send(orderList);
            })

            break;

        default:
            next();
    }


};

exports.otherpost = function(req, res, next){
    var type = req.params.order_id;

    switch (type) {

        case 'updatetbpaidconfirmed':
            if(req.body) {

                var order = req.body;

                operation.getObject(operation.getCollectionList().order, order.order_id, {}, function(existingOrder) {
                    if(existingOrder && existingOrder.status == "tbpaid") {
                        var newOrder = {
                            order_id: order.order_id,
                            status: 'tbpaidconfirmed'
                        }

                        operation.updateObject(operation.getCollectionList().order, newOrder, function(result) {
                            if(result.status == 'fail') {
                                next(result.err);
                            }

                            res.send(result);
                        })
                    }
                    else {
                        res.send('tbconfirmed');
                    }
                })
            }
            else {
                next();
            }
            break;

        case 'checkordercode':
            if(req.body) {
                var order = req.body;

                if(order.code == genordercode.ordercode(order.order_id)) {
                    res.send({result: "ok"})
                }
                else {
                    res.send({result: "invalid"})
                }
            }
            else {
                res.send({result: "invalid"})
            }

            break;

        case 'ordercode':
            if(req.body) {
                var order = req.body;
                res.send({
                    result: "ok",
                    code: genordercode.ordercode(order.order_id)
                });
            }
            else {
                res.send({result: "invalid"})
            }

            break;

        default:
            next();
    }

};

function supplementOrderRefValue(orderList, callback) {
    var index = 0;
    var isVendorReady;
    var isUserReady;
    var i;

    if(orderList.length > 0 && (orderList[0].vendor || orderList[0].user)) {
        asyncloop.asyncLoop(orderList.length, function(loop) {

                i = index++;

                // init flag
                orderList[i].vendor ? isVendorReady = false : isVendorReady = true;
                orderList[i].user ? isUserReady = false : isUserReady = true;

                // load vendor value
                if(!isVendorReady) {
                    operation.getObject(operation.getCollectionList().vendor, orderList[i].vendor.vendor_id, {}, function(vendor) {
                        for(var key in orderList[i].vendor) {
                            orderList[i].vendor[key] = vendor[key];
                        }

                        isVendorReady = true;

                        if(isVendorReady && isUserReady) {
                            loop.next()
                        }
                    })
                }

                // load user value
                if(!isUserReady) {
                    operation.getObject(operation.getCollectionList().user, orderList[i].user.user_id, {}, function(user) {
                        for(var key in orderList[i].user) {
                            orderList[i].user[key] = user[key];
                        }

                        isUserReady = true;

                        if(isVendorReady && isUserReady) {
                            loop.next()
                        }
                    })
                }

            },
            function() {
                callback(orderList);
            }
        );
    }
    else{
        callback(orderList);
    }
}