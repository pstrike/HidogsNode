var React = require('react'),
    //VendorProduct = React.createFactory(require('../../app/VendorProduct/components/VendorProductApp.react')),
    //UserProductApp = React.createFactory(require('../../app/UserProduct/components/App.react')),
    //db = require('../../db/db'),
    operation = require('../../model/operation'),
    model = require('../../model/prototype');

exports.engine = 'ejs';

exports.show = function(req, res, next){
    /*
    db.get().collection('product').find({"_id":req.params.product_id}, req.projection).toArray(function(err, docs) {
        var availability = [
            {begin: "201010100900", end: "201010101000"},
            {begin: "201010101000", end: "201010101100"},
            {begin: "201010101100", end: "201010101200"},
        ];
        docs[0].availability = availability;
        res.send(docs[0]);
    });
    */
    operation.getObject(operation.getCollectionList().product, req.params.product_id, req.projection, function(object) {
        res.send(object);
    })
};

exports.list = function(req, res, next){
    /*
    db.get().collection('product').find(req.filter, req.projection).toArray(function(err, docs) {
        res.send(docs);
    });
    */

    operation.getObjectList(operation.getCollectionList().product, req.filter, req.projection, function(objectList) {
        res.send(objectList);
    })
};

exports.update = function(req, res, next){
    /*
    if(req.body) {
        db.get().collection('product').updateOne(
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
                    res.send({result: "success"});
                }
        });
    }
    */

    if(req.body) {
        operation.updateObject(operation.getCollectionList().product, req.body, function(result) {
            if(result.status == 'fail') {
                next(result.err);
            }
            res.send(result);
        });
    }
};

exports.insert = function (req, res, next) {
    /*
    if (req.body) {
        db.get().collection('product').insertOne(req.body, function (err, result) {
            if (err) {
                console.log("[DB Err]" + err);
                next(err);
            }
            else {
                console.log("Inserted a document " + req.body.name + " into the product collection.");
                res.send(result.ops[0]);
            }
        });
    }
    */

    if(req.body) {
        operation.insertObject(operation.getCollectionList().product, req.body, function(result) {
            if(result.status == 'fail') {
                next(result.err);
            }
            res.send(result);
        });
    }
};

exports.page = function(req, res, next){
    var page = req.params.product_id;

    switch (page) {
        case 'vendorproduct':
            //var reactHtml = React.renderToString(VendorProduct({}));
            // Output html rendered by react
            //res.render('vendorproduct.ejs', {reactOutput: reactHtml});
            res.render('vendorproduct.ejs');
            //res.render('index.ejs');
            break;
        case 'userproduct':
            //var reactHtml = React.renderToString(UserProductApp({}));
            // Output html rendered by react
            //res.render('userproduct.ejs', {reactOutput: reactHtml});
            res.render('userproduct.ejs');
            //res.render('index.ejs');
            break;
        default:
            next();
    }
};

exports.meta = function(req, res, next){
    var id = req.params.meta_id;
    var result = {};

    switch (id) {
        case "productformmeta":

            console.log("load meta");

            operation.getObjectList(operation.getCollectionList().product_meta_category, {}, {}, function(objectList) {
                result.category = objectList;

                operation.getObjectList(operation.getCollectionList().product_meta_exit_policy, {}, {}, function(objectList) {
                    result.exit_policy = objectList;

                    operation.getObject(operation.getCollectionList().product_meta_other, '1', {}, function(object) {
                        result.commision_rate = object;

                        res.send(result);
                    })
                })
            })

            break;
    }
};

exports.otherget = function(req, res, next){
    var type = req.query.type;
    var id = req.params.product_id;

    switch (type) {
        case 'availability':
            var availability = [
                {begin: "201010100900", end: "201010101000"},
                {begin: "201010101000", end: "201010101100"},
                {begin: "201010101100", end: "201010101200"},
            ];

            res.send(availability);
            break;

        default:
            next();
    }
};