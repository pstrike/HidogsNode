var pingpp = require('pingpp')('sk_test_0qDqTOWzvzjDDuzf9KPaDqvL');

exports.before = function(req, res, next){
    next();
};

exports.insert = function (req, res, next) {
    if (req.body) {
        var order = req.body;
        pingpp.charges.create({
            subject: "user "+order.user_id+" buy "+order.product_id,
            body: "body",
            amount: order.price.total,
            order_no: order._id,
            channel: "alipay_wap",
            currency: "cny",
            client_ip: "127.0.0.1",
            app: {id:"app_uLG0O8y1Oyn9Tm9u"},
            extra: {success_url:"http://www.hidogs.cn:3000/payment_success.html"},
        }, function(err, charge) {
            if (err) {
                console.log("[Payment Err]");
                console.log(err);
                next(err);
            }
            else {
                res.send(charge);
            }
        });
    }
};
