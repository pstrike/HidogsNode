var React = require('react'),
    //App = React.createFactory(require('../../app/VendorProfile/components/App.react')),
    //db = require('../../db/db');
    operation = require('../../model/operation'),
    model = require('../../model/prototype');

exports.engine = 'ejs';

exports.show = function(req, res, next){
    /*
    db.get().collection('vendor').find({"openid":req.params.vendor_id}, req.projection).limit(1).toArray(function(err, docs) {
        res.send(docs[0]);
    });
    */
    operation.getObject(operation.getCollectionList().vendor, req.params.vendor_id, req.projection, function(object) {
        res.send(object);
    })
};

exports.list = function(req, res, next){
    /*
    db.get().collection('vendor').find(req.filter, req.projection).toArray(function(err, docs) {
        res.send(docs);
    });
    */
    operation.getObjectList(operation.getCollectionList().vendor, req.filter, req.projection, function(objectList) {
        res.send(objectList);
    })
};

exports.update = function(req, res, next){
    /*
    if(req.body) {
        db.get().collection('vendor').updateOne(
            {"openid": req.body.openid},
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
    */

    if(req.body) {
        operation.updateObject(operation.getCollectionList().vendor, req.body, function(result) {
            if(result.status == 'fail') {
                next(result.err);
            }
            res.send(result);
        });
    }
};

exports.insert = function(req, res, next){
    /*
    res.send("user insert");
    */
    if(req.body) {
        operation.insertObject(operation.getCollectionList().vendor, req.body, function(result) {
            if(result.status == 'fail') {
                next(result.err);
            }
            res.send(result);
        });
    }
};

exports.page = function(req, res, next){
    var page = req.params.vendor_id;

    // for local testing
    //req.session.current_user = {vendor_id: "29cf64e3-3aab-c3ec-c0c7-7307bc671419", role: "grooming"};

    switch (page) {
        case 'vendorprofile':
            //var reactHtml = React.renderToString(App({}));
            //res.render('vendorprofile.ejs', {reactOutput: reactHtml});
            res.render('vendorprofile.ejs');
            break;

        case 'vendorjoin':
            //var reactHtml = React.renderToString(App({}));
            //res.render('vendorprofile.ejs', {reactOutput: reactHtml});
            res.render('vendorjoin.ejs');
            break;

        default:
            next();
    }
};