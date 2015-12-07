var React = require('react'),
    VendorOrderReactApp = React.createFactory(require('../../app/VendorOrder/components/VendorOrderApp.react.js')),
    UserOrderReactApp = React.createFactory(require('../../app/UserOrder/components/App.react.js')),
    operation = require('../../model/operation');

exports.engine = 'ejs';

exports.show = function(req, res, next){
    operation.getObject(operation.getCollectionList().order, req.params.order_id, req.projection, function(object) {
        res.send(object);
    })
};

exports.list = function(req, res, next){
    operation.getObjectList(operation.getCollectionList().order, req.filter, req.projection, function(objectList) {
        objectList.sort(function(a,b){return a.created_time<b.created_time?1:-1}); //sort from latest to oldest

        res.send(objectList);
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
            var reactHtml = React.renderToString(VendorOrderReactApp({}));
            // Output html rendered by react
            res.render('vendororder.ejs', {reactOutput: reactHtml});
            //res.render('index.ejs');
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
            //var reactHtml = React.renderToString(UserOrderReactApp({}));
            // Output html rendered by react
            //res.render('userorder.ejs', {reactOutput: reactHtml});
            //res.render('index.ejs');

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

                    res.render('userordercreationdone.ejs', {orderid: orderId, hgstyle: hgstyle});
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
                            { status: "completed" }
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
    var type = req.query.type;
    var id = req.params.order_id;

    switch (type) {

        case 'webhook':
            var payload = req.body;
            var orderId = payload.data.object.order_no;

            db.get().collection('order').updateOne(
                {"_id": orderId},
                {
                    $set: {status: "paid"},
                    $currentDate: { "modified_time": true }
                }, function (err, result) {
                    if(err) {
                        console.log("[DB Err]"+err);
                        next(err);
                    }
                    else {
                        console.log("order "+orderId+" paid");
                        res.send("received");
                    }
                });
            break;

        default:
            next();
    }


};