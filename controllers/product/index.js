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
    var productId = req.query.product;

    switch (page) {
        case 'vendorproduct':
            //var reactHtml = React.renderToString(VendorProduct({}));
            // Output html rendered by react
            //res.render('vendorproduct.ejs', {reactOutput: reactHtml});

            // for local testing
            //req.session.current_user = {
            //    vendor_id: "bf98f593-071e-48d7-3c73-e0e2f47c45af",
            //    role: "grooming",
            //    head_image_url: "http://wx.qlogo.cn/mmopen/ajNVdqHZLLAKwztbcTspbibFnCLP5D5eToEsia8SZXvjHu0swsd455HIcl5hxzK3jREKYhEqykVFYYhZZI7FZOgg/0",
            //    nick_name: "one_pan",
            //    status: "approved"
            //};

            res.render('vendorproduct.ejs');
            //res.render('index.ejs');
            break;
        case 'vendorproducthg1':
            //var reactHtml = React.renderToString(VendorProduct({}));
            // Output html rendered by react
            //res.render('vendorproduct.ejs', {reactOutput: reactHtml});

            // for local testing
            req.session.current_user = {
                vendor_id: "hg1",
                role: "grooming",
                head_image_url: "/upload/head_image_url_0210590b-cabe-9cd1-9ab8-d3719ff48268.jpg",
                nick_name: "欢宠小Q",
                status: "approved"
            };

            res.render('vendorproduct.ejs');
            //res.render('index.ejs');
            break;
        case 'userproduct':
            //var reactHtml = React.renderToString(UserProductApp({}));
            // Output html rendered by react
            //res.render('userproduct.ejs', {reactOutput: reactHtml});

            operation.getObject(operation.getCollectionList().product, productId, {category:1}, function(object) {

                if(object) {
                    var hgstyle = "";

                    switch (object.category.product_meta_category_id) {
                        case "1-1-1":
                            hgstyle = "../../css/hggreen.css";
                            break;

                        case "1-1-2":
                            hgstyle = "../../css/hgred.css";
                            break;

                        case "1-1-3":
                            hgstyle = "../../css/hgblue.css";
                            break;

                        case "1-1-4":
                            hgstyle = "../../css/hgyellow.css";
                            break;

                    }

                    res.render('userproduct.ejs',{productId: productId, hgstyle: hgstyle});
                }
                else {
                    next();
                }
            })
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

            var role = req.query.role;
            var filter = {};
            filter.path_slug = new RegExp(","+role+",");
            filter.leaf = true;

            operation.getObjectList(operation.getCollectionList().product_meta_category, filter, {}, function(objectList) {
                result.category = objectList;

                operation.getObjectList(operation.getCollectionList().product_meta_exit_policy, {}, {}, function(objectList) {
                    result.exit_policy = objectList;

                    operation.getObjectList(operation.getCollectionList().product_meta_other, {}, {}, function(object) {
                        result.other = object;

                        res.send(result);
                    })
                })
            })

            break;

        case "productothermeta":
            operation.getObjectList(operation.getCollectionList().product_meta_other, {}, {}, function(objectList) {

                res.send(objectList);
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