var React = require('react'),
    VendorOrderReactApp = React.createFactory(require('../../app/VendorOrder/components/VendorOrderApp.react.js')),
    UserOrderReactApp = React.createFactory(require('../../app/UserOrder/components/App.react.js')),
    db = require('../../db/db');

exports.engine = 'ejs';

exports.before = function(req, res, next){
    next();
};

exports.show = function(req, res, next){
    db.get().collection('order').find({"_id":req.params.order_id}, req.projection).limit(1).toArray(function(err, docs) {
        res.send(docs[0]);
    });
};

exports.list = function(req, res, next){
    db.get().collection('order').find(req.filter, req.projection).toArray(function(err, docs) {
        res.send(docs);
    });
};

exports.update = function(req, res, next){
    if(req.body) {
        db.get().collection('order').updateOne(
            {"_id": req.body._id},
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
    if (req.body) {

        db.get().collection('counter').findAndModify(
            { "_id": "orderid" }, // query
            [], // represents a sort order if multiple matches
            { "$inc": { "seq": 1 } }, // update statement
            { new: true }, // options - new to return the modified document
            function(err,doc) {
                req.body._id = doc.value.seq.toString();

                db.get().collection('order').insertOne(req.body, function (err, result) {
                    if (err) {
                        console.log("[DB Err]" + err);
                        next(err);
                    }
                    else {
                        console.log("Inserted a document " + req.body.name + " into the order collection.");
                        res.send(result.ops[0]);
                    }
                });
            }
        );
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
            var reactHtml = React.renderToString(UserOrderReactApp({}));
            // Output html rendered by react
            res.render('userorder.ejs', {reactOutput: reactHtml});
            //res.render('index.ejs');
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
        case 'check':
            var code = req.query.code;
            db.get().collection('order').find({"_id":id}, req.projection).limit(1).toArray(function(err, docs) {
                if(code == docs[0]._id) {
                    res.send("success");
                }
                else {
                    res.send("fail");
                }
            });

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