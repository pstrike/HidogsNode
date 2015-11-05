var React = require('react'),
    //VendorProduct = React.createFactory(require('../../app/VendorProduct/components/VendorProductApp.react')),
    UserProductApp = React.createFactory(require('../../app/UserProduct/components/App.react')),
    db = require('../../db/db'),
    error = require('../../util/errorhandler');

exports.engine = 'ejs';

var COUNTER_PRODUCT_ID = "product_id";

exports.show = function(req, res, next){
    db.get().collection('product').find({"_id":req.params.product_id}, req.projection).toArray(function(err, docs) {
        var availability = [
            {begin: "201010100900", end: "201010101000"},
            {begin: "201010101000", end: "201010101100"},
            {begin: "201010101100", end: "201010101200"},
        ];
        docs[0].availability = availability;
        res.send(docs[0]);
    });
};

exports.list = function(req, res, next){
    db.get().collection('product').find(req.filter, req.projection).toArray(function(err, docs) {
        res.send(docs);
    });
};

exports.update = function(req, res, next){
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
};

exports.insert = function (req, res, next) {
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
};

exports.index = function(req, res, next){
    res.send("product index");
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
            var reactHtml = React.renderToString(UserProductApp({}));
            // Output html rendered by react
            res.render('userproduct.ejs', {reactOutput: reactHtml});
            //res.render('index.ejs');
            break;
        default:
            next();
    }
};

exports.meta = function(req, res, next){
    var id = req.params.meta_id;

    var filter = {};
    if(id == "list") {
        filter = {};
    }
    else {
        filter = {field: id};
    }

    db.get().collection('productmeta').find(filter).toArray(function(err, docs) {
        var result={};

        if(docs) {
            for(var i=0; i<docs.length; i++) {
                result[docs[i].field] = docs[i].meta_value;
            }
        }

        res.send(result);
    });
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