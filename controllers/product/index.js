var React = require('react'),
    //VendorProduct = React.createFactory(require('../../app/VendorProduct/components/VendorProductApp.react')),
    //UserProductApp = React.createFactory(require('../../app/UserProduct/components/App.react')),
    //db = require('../../db/db'),
    operation = require('../../model/operation'),
    model = require('../../model/prototype'),
    asyncloop = require('../../util/asyncloop');

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

    var filter = {};
    if(req.filter) {
        filter = req.filter;
    }

    var productIdList = [];
    if(req.query.idlist) {
        if(req.query.idlist.indexOf(",") > -1) {
            productIdList = req.query.idlist.split(",");
        }
        else {
            productIdList.push(req.query.idlist);
        }

        var orList = productIdList.map(function(item) {
            return {product_id: item}
        })
        filter['$or'] = orList;
    }

    operation.getObjectList(operation.getCollectionList().product, filter, req.projection, function(objectList) {
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
            //    vendor_id: "d18c4e5c-6f49-7f82-7d49-db362c64cb03",
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

            // for admin user login
            req.session.current_user = {
                vendor_id: "hg1",
                role: "grooming",
                head_image_url: "/upload/head_image_url_0210590b-cabe-9cd1-9ab8-d3719ff48268.jpg",
                nick_name: "欢宠小Q",
                status: "approved",
                openid: "123",
            };

            res.render('vendorproduct.ejs');
            //res.render('index.ejs');
            break;
        //case 'userproduct':
        //    //var reactHtml = React.renderToString(UserProductApp({}));
        //    // Output html rendered by react
        //    //res.render('userproduct.ejs', {reactOutput: reactHtml});
        //
        //    operation.getObject(operation.getCollectionList().product, productId, {category:1}, function(object) {
        //
        //        if(object) {
        //            var hgstyle = "";
        //
        //            switch (object.category.product_meta_category_id) {
        //                case "1-1-1":
        //                    hgstyle = "../../css/hggreen.css";
        //                    break;
        //
        //                case "1-1-2":
        //                    hgstyle = "../../css/hgred.css";
        //                    break;
        //
        //                case "1-1-3":
        //                    hgstyle = "../../css/hgblue.css";
        //                    break;
        //
        //                case "1-1-4":
        //                    hgstyle = "../../css/hgyellow.css";
        //                    break;
        //
        //            }
        //
        //            res.render('userproduct.ejs',{productId: productId, hgstyle: hgstyle, isUser: "false"});
        //        }
        //        else {
        //            next();
        //        }
        //    })
        //    //res.render('index.ejs');
        //    break;

        case 'userproductlist':
            var params = req.query.params.split(",");
            var category = params[0];
            var keyword = params[1];
            var hgstyle = "";

            operation.getObject(operation.getCollectionList().product_meta_category, category, {name:1}, function(object) {
                if (object) {
                    switch (category) {
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
                    res.render('userproductlist.ejs',{hgstyle: hgstyle, category: object.name, categoryId:category, keyword: keyword});
                }
                else {
                    next();
                }
            })

            break;

        case "userproductprecheck":

            // for local testing
            //req.session.current_user = {
            //    user_id: "e79fe7aa-2dfe-1fd6-76e9-b62985b0aa7a",
            //    head_image_url: "http://wx.qlogo.cn/mmopen/ajNVdqHZLLAKwztbcTspbibFnCLP5D5eToEsia8SZXvjHu0swsd455HIcl5hxzK3jREKYhEqykVFYYhZZI7FZOgg/0",
            //    nick_name: "one_pan",
            //};

            var userAgent = req.headers['user-agent'];
            if(userAgent.indexOf('MicroMessenger') > -1) {
                if(req.session['current_user']) {
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

                            res.render('userproduct.ejs',{productId: productId, hgstyle: hgstyle, isUser: "true"});
                        }
                        else {
                            next();
                        }
                    })
                }
                else {
                    var url = "http://www.hidogs.cn/wechat/auth?destination=001product1view1userproductprecheck?product="+productId+"_user";
                    res.redirect(url);
                }
            }
            else {
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

                        res.render('userproduct.ejs',{productId: productId, hgstyle: hgstyle, isUser: "false"});

                        // for testing
                        //res.render('userproduct.ejs',{productId: productId, hgstyle: hgstyle, isUser: "true"});
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
    var otherId = req.params.product_id;
    var type = req.query.type;

    switch (type) {
        case 'availability':
            var paramCheckDayNo = 6; // incluing today, check total 7 days' availability of vendor
            var paramTimeSlotDuration = 30; // product duration unit is 30 mins

            var inputCheckStartTime = new Date();
            var inputCheckEndTime = new Date();
            inputCheckEndTime.setDate(inputCheckEndTime.getDate() + paramCheckDayNo +1);
            inputCheckEndTime.setHours(0);
            inputCheckEndTime.setMinutes(0);
            inputCheckEndTime.setSeconds(0);
            inputCheckEndTime.setMilliseconds(0);

            var inputProductId = req.params.product_id;
            var inputVendorId;
            var inputDuration;
            var inputBusinessStartTime;
            var inputBusinessEndTime;
            var inputTimeoffList;
            var inputIsRejectToday = false;
            var inputOrderList;

            var resultAllTime = [];
            var resultProductTime = [];

            operation.getObject(operation.getCollectionList().product, inputProductId, {}, function(product) {
                if(product) {
                    operation.getObject(operation.getCollectionList().vendor, product.vendor.vendor_id, {}, function(vendor) {
                        if(vendor) {
                            inputDuration = product.duration;
                            inputVendorId = vendor.vendor_id;
                            inputBusinessStartTime = vendor.setting.business_time_list[0].start_time;
                            inputBusinessEndTime = vendor.setting.business_time_list[0].end_time;
                            inputTimeoffList = vendor.setting.timeoff_list;
                            inputIsRejectToday = vendor.setting.reject_today_flag;

                            operation.getObjectList(operation.getCollectionList().order, {
                                    'vendor.vendor_id': inputVendorId,
                                    'booked_time.start_time': {$gte: inputCheckStartTime, $lte: inputCheckEndTime},
                                    $or: [ { status: "tbconfirmed" }, { status: "tbserviced" }, { status: "tbcommented" }, { status: "completed" } ],
                                }, {}, function(orderList) {

                                inputOrderList = orderList;

                                var businessStartHour = parseInt(inputBusinessStartTime.split(":")[0]);
                                var businessStartMin = parseInt(inputBusinessStartTime.split(":")[1]);
                                var businessEndHour = parseInt(inputBusinessEndTime.split(":")[0]);
                                var businessEndMin = parseInt(inputBusinessEndTime.split(":")[1]);

                                // List all timeslot
                                for(var tempDate = new Date(inputCheckStartTime); tempDate <= inputCheckEndTime; tempDate.setDate(tempDate.getDate()+1)) {
                                    var businessStartTime = new Date(tempDate);
                                    businessStartTime.setHours(businessStartHour);
                                    businessStartTime.setMinutes(businessStartMin);
                                    businessStartTime.setSeconds(0);
                                    businessStartTime.setMilliseconds(0);

                                    var businessEndTime = new Date(tempDate);
                                    businessEndTime.setHours(businessEndHour);
                                    businessEndTime.setMinutes(businessEndMin);
                                    businessEndTime.setSeconds(0);
                                    businessEndTime.setMilliseconds(0);

                                    var tempDateItem = {}
                                    tempDateItem.date = new Date(tempDate);
                                    tempDateItem.timeslot = [];

                                    for(var tempTime = businessStartTime; tempTime<=businessEndTime; tempTime.setMinutes(tempTime.getMinutes() + paramTimeSlotDuration)) {
                                        var timeslotEndtime = new Date(tempTime);
                                        timeslotEndtime.setMinutes(timeslotEndtime.getMinutes() + paramTimeSlotDuration);
                                        tempDateItem.timeslot.push({start_time: new Date(tempTime), end_time: timeslotEndtime, isAvailable: true});
                                    }

                                    resultAllTime.push(tempDateItem);
                                }

                                // exclude timeoff timeslot
                                inputTimeoffList.forEach(function(timeoffItem) {
                                    var timeoffString = timeoffItem.replace(/月/g,"");
                                    timeoffString = timeoffString.replace(/年/g,"");
                                    timeoffString = timeoffString.replace(/日/g,"");

                                    inputCheckStartTimeString = _formatDateToString(inputCheckStartTime);
                                    inputCheckEndTimeString = _formatDateToString(inputCheckEndTime);

                                    if((timeoffString > inputCheckStartTimeString && timeoffString < inputCheckEndTimeString)
                                    || timeoffString == inputCheckStartTimeString
                                    || timeoffString == inputCheckEndTimeString) {
                                        resultAllTime.forEach(function(dateItem){

                                            var dateItemString = _formatDateToString(dateItem.date);

                                            if(timeoffString == dateItemString) {
                                                dateItem.timeslot.forEach(function(timeslotItem){
                                                    timeslotItem.isAvailable = false;
                                                })
                                            }
                                        })
                                    }
                                })

                                // exclude today timeslot if isRejectToday flag is ture
                                if(inputIsRejectToday) {
                                    resultAllTime[0].timeslot.forEach(function(timeslotItem){
                                        timeslotItem.isAvailable = false;
                                    })
                                }

                                // exlcude today past timeslot
                                resultAllTime[0].timeslot.forEach(function(timeslotItem){
                                    if(timeslotItem.end_time < inputCheckStartTime) {
                                        timeslotItem.isAvailable = false;
                                    }
                                })

                                // exclude existing order timeslot
                                inputOrderList.forEach(function(orderItem) {

                                    resultAllTime.forEach(function(dateItem) {
                                        dateItem.timeslot.forEach(function(timeslotItem){
                                            if(orderItem.booked_time.start_time == timeslotItem.start_time) {
                                                timeslotItem.isAvailable = false;
                                            }

                                            if(orderItem.booked_time.end_time == timeslotItem.end_time) {
                                                timeslotItem.isAvailable = false;
                                            }

                                            if(orderItem.booked_time.start_time < timeslotItem.end_time && orderItem.booked_time.end_time > timeslotItem.end_time) {
                                                timeslotItem.isAvailable = false;
                                            }

                                            if(orderItem.booked_time.start_time < timeslotItem.start_time && orderItem.booked_time.end_time > timeslotItem.start_time) {
                                                timeslotItem.isAvailable = false;
                                            }

                                            if(orderItem.booked_time.start_time < timeslotItem.end_time && orderItem.booked_time.end_time > timeslotItem.start_time) {
                                                timeslotItem.isAvailable = false;
                                            }
                                        })
                                    })

                                })

                                // summarize product available time base on all timeslot
                                var tempTimeSlotNo = inputDuration / paramTimeSlotDuration;
                                var tempTimeSlotCounter;
                                var tempTimeSlotAvailableCounter;
                                resultProductTime = JSON.parse(JSON.stringify(resultAllTime));

                                resultAllTime.forEach(function(dateItem, index) {
                                    resultProductTime[index].timeslot = [];
                                    tempTimeSlotCounter = 0;
                                    tempTimeSlotAvailableCounter = 0;
                                    var tempProductTimeslotStart;

                                    for(var i=0; i<dateItem.timeslot.length; i++) {
                                        if(tempTimeSlotCounter == 0) {
                                            tempProductTimeslotStart = dateItem.timeslot[i].start_time;
                                        }

                                        if(dateItem.timeslot[i].isAvailable) {
                                            tempTimeSlotAvailableCounter++;
                                        }

                                        tempTimeSlotCounter++;

                                        if(tempTimeSlotCounter == tempTimeSlotNo) {
                                            var isAvailableFlag = false;

                                            if(tempTimeSlotAvailableCounter == tempTimeSlotNo) {
                                                isAvailableFlag = true;
                                            }

                                            resultProductTime[index].timeslot.push({start_time:tempProductTimeslotStart, end_time:dateItem.timeslot[i].end_time, isAvailable: isAvailableFlag});

                                            tempTimeSlotCounter = 0;
                                            tempTimeSlotAvailableCounter = 0;
                                        }
                                    }
                                })

                                // return result
                                res.send(resultProductTime);

                            })
                        }

                    })
                }
            })

            break;

        case "geoproductlist":
            var lat = parseFloat(req.query.lat);
            var lng = parseFloat(req.query.lng);
            var category = req.query.category;
            var keyword = req.query.keyword;
            var productList = [];
            var filter = {};
            var distance = 0;

            asyncloop.asyncLoop(10, function(loop) {

                    if(loop.iteration() > 3) {
                        distance += 3;
                    }
                    else {
                        distance++;
                    }

                    filter = {
                        status: "published",
                        location: {
                            $near: {
                                $geometry: {
                                    type: "Point",
                                    coordinates: [lng, lat],
                                },
                                $maxDistance: distance * 1000,
                            }
                        },
                        'category.product_meta_category_id': category,
                    }

                    operation.getObjectList(operation.getCollectionList().product, filter, req.projection, function(objectList) {
                        productList = objectList;

                        if(objectList > 10) {
                            loop.break();
                        }
                        else {
                            loop.next();
                        }
                    })},
                function(){
                    var result = {
                        distance: distance,
                        productList: productList,
                    };

                    res.send(result);
                }
            );

            break;

        default:
            next();
    }
};

function _formatDateToString(date) {
    var dateItemString = date.getFullYear();
    if((date.getMonth()+1) < 10) {
        dateItemString = dateItemString + "0" + (date.getMonth()+1);
    }
    else {
        dateItemString = dateItemString + "" + (date.getMonth()+1);
    }

    if((date.getDate()) < 10) {
        dateItemString = dateItemString + "0" + (date.getDate());
    }
    else {
        dateItemString = dateItemString + "" + (date.getDate());
    }

    return dateItemString
};