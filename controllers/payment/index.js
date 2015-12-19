//var pingpp = require('pingpp')('sk_test_0qDqTOWzvzjDDuzf9KPaDqvL');
var pingpp = require('pingpp')('sk_live_LeTSqLernfnTTGyHa9zr9CqP');
var operation = require('../../model/operation');
var uuid = require('../../util/genuuid');
var genorderid = require('../../util/genorderno');
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
        var body = timestamp.toLocaleString() + "/" + order.user.user_name + "/" + order.product.product_title + "/" +order.price.total+"/"+genorderid.orderno(order.order_id, order.created_time)+"/"+order.vendor.vendor_id;
        var subject = "预订服务:" + order.product.product_title;

        pingpp.charges.create({
            order_no: orderNo,
            app: {id: pingppConfig.id},
            channel: pingppConfig.channel,
            amount: order.price.total,
            client_ip: clientIp,
            currency: pingppConfig.currency,
            subject: subject,
            body: body,
            extra: {open_id: order.openid},
            description: order.order_id,

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

                var order = {};
                order.order_id = payload.data.object.description;
                order.status = "tbconfirmed";
                order.paid_time = new Date();

                operation.updateObject(operation.getCollectionList().order, order, function(result) {
                    if(result.status == 'fail') {
                        next(result.err);
                    }

                    // send wechat notice to user
                    var openid = payload.data.object.extra.open_id;
                    var product = payload.data.object.body.split("/")[2];
                    var price = payload.data.object.body.split("/")[3];
                    var orderNo = payload.data.object.body.split("/")[4];
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
                            "value": price + "元",
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
                    var vendorId= payload.data.object.body.split("/")[5];
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
                            "value": price + "元",
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

                    operation.getObject(operation.getCollectionList().vendor, vendorId, {}, function(object) {
                        wechatVendorApi.sendTemplate(object.openid, templateId, url, '', data, function() {
                            console.log("[sent template msg]")
                        });

                        res.send("received");
                    })

                });

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