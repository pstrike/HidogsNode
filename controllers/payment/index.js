//var pingpp = require('pingpp')('sk_test_0qDqTOWzvzjDDuzf9KPaDqvL');
var pingpp = require('pingpp')('sk_live_LeTSqLernfnTTGyHa9zr9CqP');
var operation = require('../../model/operation');
var uuid = require('../../util/genuuid');
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
        var body = "["+timestamp.toLocaleString() + "] " + order.user.user_name + " 预订 " + order.product.product_title;
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
                    res.send("received");
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