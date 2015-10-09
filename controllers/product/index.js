var React = require('react'),
    ReactApp = React.createFactory(require('../../app/components/VendorProductApp.react.js')),
    db = require('../../db/db');

exports.engine = 'ejs';

exports.before = function(req, res, next){
    next();
};

exports.show = function(req, res, next){
    db.get().collection('product').find({"_id":req.params.product_id}, req.projection).toArray(function(err, docs) {
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
                    res.send("product update");
                }
        });
    }
};

exports.insert = function(req, res, next){
    if(req.body) {
        db.get().collection('product').insertOne(req.body, function (err, result) {
            if(err) {
                console.log("[DB Err]"+err);
                next(err);
            }
            else {
                console.log("Inserted a document " + req.body.name + " into the product collection.");
                res.send("product insert");
            }
        });
    }
};

exports.index = function(req, res, next){
    res.send("product index");
};

exports.page = function(req, res, next){
    var page = req.params.product_id;

    console.log(page);

    switch (page) {
        case 'list':
            var reactHtml = React.renderToString(ReactApp({}));
            // Output html rendered by react
            res.render('index.ejs', {reactOutput: reactHtml});
            //res.render('index.ejs');
            break;
        default:
            /* istanbul ignore next */
            throw new Error('unrecognized route: ' + name + '.' + key);
    }

};