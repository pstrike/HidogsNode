//var pingpp = require('pingpp')('sk_test_0qDqTOWzvzjDDuzf9KPaDqvL');
var pingpp = require('pingpp')('sk_live_LeTSqLernfnTTGyHa9zr9CqP');
var operation = require('../../model/operation');
var uuid = require('../../util/genuuid');
var genorderid = require('../../util/genorderno');
var gettbpaidprice = require('../../util/gettbpaidprice');
var wechat = require('../../controllers/wechat');
var pingppConfig = {
    id : "app_uLG0O8y1Oyn9Tm9u",
    currency: "cny",
    channel: "wx_pub",
}

exports.insert = function (req, res, next) {
    if (req.body) {
        var order = req.body;

        //console.log(order);

        var timestamp = new Date();
        var orderNo = uuid.uuid().replace(/-/g, "");
        var clientIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        var couponId = order.price.coupon.coupon_id ? order.price.coupon.coupon_id : "null";
        var body = order.order_id;
        var description = timestamp.toLocaleString() + "/" + order.user.user_id + "/" + order.product.product_title + "/" +order.price.total + "," + order.price.discount + "," + order.price.coupon.off_percentage +"/"+genorderid.orderno(order.order_id, order.created_time)+"/"+order.vendor.vendor_id+"/"+couponId;
        var subject = "预订服务:" + order.product.product_title;

        pingpp.charges.create({
            order_no: orderNo,
            app: {id: pingppConfig.id},
            channel: pingppConfig.channel,
            amount: gettbpaidprice.cal(order.price.total, order.price.discount),
            client_ip: clientIp,
            currency: pingppConfig.currency,
            subject: subject,
            body: body,
            extra: {open_id: order.openid},
            description: description,

        }, function(err, charge) {
            if (err) {
                console.log("[Payment Err]");
                console.log(err);
                next(err);
            }
            else {
                console.log("[Payment Trigger OK]");
                res.send(charge);
            }
        });
    }
};

exports.otherpost = function(req, res, next){
    var type = req.params.payment_id;

    switch (type) {

        case 'webhook':
            var payload = req.body;

            //console.log(payload);

            if(payload.type == "charge.succeeded") {
                //var orderId = payload.data.object.order_no;
                //orderId = insert_flg(orderId, "-", 8);
                //orderId = insert_flg(orderId, "-", 13);
                //orderId = insert_flg(orderId, "-", 18);
                //orderId = insert_flg(orderId, "-", 23);

                var price = payload.data.object.description.split("/")[3];
                var total = price.split(",")[0];
                var discount = price.split(",")[1];
                var offPercentage = price.split(",")[2];
                var orderId = payload.data.object.body;

                operation.getObject(operation.getCollectionList().order, orderId, {order_id:1, price:1}, function(object) {
                    var order = object;

                    console.log(order);

                    order.status = "tbconfirmed";
                    order.paid_time = new Date();
                    if(parseFloat(offPercentage) == 0.0) {
                        order.price.coupon = {
                            off_percentage: 0.0,
                        };
                        order.price.discount = 0.0;
                    }

                    console.log(order);

                    operation.updateObject(operation.getCollectionList().order, order, function(result) {
                        if(result.status == 'fail') {
                            next(result.err);
                        }

                        // send wechat notice to user
                        var openid = payload.data.object.extra.open_id;
                        var product = payload.data.object.description.split("/")[2];
                        var orderNo = payload.data.object.description.split("/")[4];
                        var wechatUserApi = wechat.getWXUserAPI();
                        var templateId= '6qOcduQN72WBcj6bQmUKnY_hn-yEw-wNjNp6hAD82bk';
                        var url = 'http://www.hidogs.cn/wechat/auth?destination=001order1view1userorder_user';
                        var data = {
                            "first": {
                                "value":"您的订单已经支付成功！",
                                "color":"#173177"
                            },
                            "keyword1":{
                                "value":orderNo,
                                "color":"#173177"
                            },
                            "keyword2": {
                                "value": parseFloat(discount) > 0 ? gettbpaidprice.cal(total,discount) + "元 (总价" +total+"元, 使用优惠码优惠"+discount+"元)" : total + "元",
                                "color":"#173177"
                            },
                            "keyword3": {
                                "value": product,
                                "color":"#173177"
                            },
                            "remark":{
                                "value":"感谢您对欢宠的支持！",
                                "color":"#173177"
                            }
                        };
                        wechatUserApi.sendTemplate(openid, templateId, url, '', data, function() {
                            console.log("[sent template msg]")
                        });

                        // send wechat notice to vendor
                        url = 'http://www.hidogs.cn/wechat/auth?destination=001order1view1vendororder_vendor';
                        templateId = 'G4ks3STIqTSTjlpAE-lz0TeVU4cXiFTzbQi1hzqmINo';
                        var vendorId= payload.data.object.description.split("/")[5];
                        var wechatVendorApi = wechat.getWXVendorAPI();
                        data = {
                            "first": {
                                "value":"您有新的订单!",
                                "color":"#173177"
                            },
                            "keyword1":{
                                "value":orderNo,
                                "color":"#173177"
                            },
                            "keyword2": {
                                "value": parseFloat(discount) > 0 ? total + "元 (使用优惠码优惠"+discount+"元, 实付"+gettbpaidprice.cal(total,discount)+"元)" : total + "元",
                                "color":"#173177"
                            },
                            "keyword3": {
                                "value": product,
                                "color":"#173177"
                            },
                            "remark":{
                                "value":"感谢您对欢宠的支持！",
                                "color":"#173177"
                            }
                        };

                        var userId = payload.data.object.description.split("/")[1];
                        var couponId = payload.data.object.description.split("/")[6];

                        operation.getObject(operation.getCollectionList().vendor, vendorId, {}, function(object) {
                            // send WX notice
                            wechatVendorApi.sendTemplate(object.openid, templateId, url, '', data, function() {
                                console.log("[sent template msg]")
                            });

                            // update coupon if use coupon
                            if(couponId != "null") {
                                operation.getObjectList(operation.getCollectionList().coupon, {coupon_id: couponId}, {}, function(objectList) {
                                    var newCoupon = objectList[0];

                                    var isUsed = false;

                                    for(var i=0; i<newCoupon.used.length; i++) {
                                        if(newCoupon.used[i] == userId) {
                                            isUsed = true;
                                            break;
                                        }
                                    }

                                    if(isUsed) {
                                        res.send("received");
                                    }
                                    else {
                                        newCoupon.used.push(userId);

                                        operation.updateObject(operation.getCollectionList().coupon, newCoupon, function(result) {
                                            if(result.status == 'fail') {
                                                next(result.err);
                                            }

                                            res.send("received");

                                        });
                                    }
                                })
                            }
                            else {
                                res.send("received");
                            }
                        })

                    });
                })
            }
            else {
                res.send("received");
            }
            break;

        default:
            next();
    }


};

function insert_flg(str,flg,sn){
    var begin=str.substring(0, sn);
    var end=str.substring(sn, str.length);

    return begin + flg + end;
}