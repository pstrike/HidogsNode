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

    var filter = {};
    if(req.filter) {
        filter = req.filter;
    }

    var vendorIdList = [];
    if(req.query.idlist) {
        if(req.query.idlist.indexOf(",") > -1) {
            vendorIdList = req.query.idlist.split(",");
        }
        else {
            vendorIdList.push(req.query.idlist);
        }

        var orList = vendorIdList.map(function(item) {
            return {vendor_id: item}
        })
        filter['$or'] = orList;
    }

    operation.getObjectList(operation.getCollectionList().vendor, filter, req.projection, function(objectList) {
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
    //req.session.current_user = {
    //    vendor_id: "d18c4e5c-6f49-7f82-7d49-db362c64cb03",
    //    openid: "oxN2Mt-BQvXep8Jb0vF3ilHbt9Vc",
    //    head_image_url: "http://wx.qlogo.cn/mmopen/ajNVdqHZLLAKwztbcTspbibFnCLP5D5eToEsia8SZXvjHu0swsd455HIcl5hxzK3jREKYhEqykVFYYhZZI7FZOgg/0",
    //    nick_name: "one_pan",
    //};

    switch (page) {
        case 'vendorprofile':
            res.render('vendorprofile.ejs');
            break;

        case 'vendorjoin':
            //var reactHtml = React.renderToString(App({}));
            //res.render('vendorprofile.ejs', {reactOutput: reactHtml});
            res.render('vendorjoin.ejs');
            break;

        //case 'vendorpage':
        //    var vendorId = req.query.vendor;
        //
        //    operation.getObject(operation.getCollectionList().vendor, vendorId, {setting:1}, function(object) {
        //        var hgstyle = "../../css/hg"+object.setting.page_style+".css";
        //
        //        res.render('vendorpage.ejs',{vendorId: vendorId, hgstyle: hgstyle});
        //    })
        //    break;

        case 'vendorpageprecheck':

            // for local testing
            //req.session.current_user = {
            //    user_id: "e79fe7aa-2dfe-1fd6-76e9-b62985b0aa7a",
            //    head_image_url: "http://wx.qlogo.cn/mmopen/ajNVdqHZLLAKwztbcTspbibFnCLP5D5eToEsia8SZXvjHu0swsd455HIcl5hxzK3jREKYhEqykVFYYhZZI7FZOgg/0",
            //    nick_name: "one_pan",
            //};

            var vendorId = req.query.vendor;

            var userAgent = req.headers['user-agent'];
            if(userAgent.indexOf('MicroMessenger') > -1) {
                if(req.session['current_user']) {
                    operation.getObject(operation.getCollectionList().vendor, vendorId, {setting:1}, function(object) {

                        if(object) {
                            var hgstyle = "../../css/hg"+object.setting.page_style+".css";

                            res.render('vendorpage.ejs',{vendorId: vendorId, hgstyle: hgstyle, isUser: "true"});
                        }
                        else {
                            next();
                        }
                    })
                }
                else {
                    var url = "http://www.hidogs.cn/wechat/auth?destination=001vendor1view1vendorpageprecheck?vendor="+vendorId+"_user";
                    res.redirect(url);
                }
            }
            else {
                operation.getObject(operation.getCollectionList().vendor, vendorId, {setting:1}, function(object) {

                    if(object) {
                        var hgstyle = "../../css/hg"+object.setting.page_style+".css";

                        res.render('vendorpage.ejs',{vendorId: vendorId, hgstyle: hgstyle, isUser: "false"});

                        // for testing
                        //res.render('vendorpage.ejs',{vendorId: vendorId, hgstyle: hgstyle, isUser: "true"});
                    }
                    else {
                        next();
                    }
                })
            }

            break;

        default:
            next();
    }
};

exports.otherget = function(req, res, next){
    var type = req.params.vendor_id;

    switch(type) {
        case "comment":
            var vendorId = req.query.vendorid;
            var filter = {
                'vendor.vendor_id': vendorId,
                'status': 'completed',
            }

            operation.getObjectList(operation.getCollectionList().order, filter, req.projection, function(objectList) {
                var commentList = objectList.map(function(item) {
                    return item.comment;
                });

                res.send(commentList);
            })

            break;

        default:
            next();
    }
};