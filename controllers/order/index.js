var db = require('../../db/db');
var pingpp = require('pingpp')('sk_test_vPOqv9jrvjHS1mznrHnTmbf5');

exports.before = function(req, res, next){
    var id = req.params.order_id;
    if (!id) return next();
    // pretend to query a database...
    process.nextTick(function(){
        req.order = db.orders[id];
        // cant find that user
        if (!req.order) return next('route');
        // found it, move on to the routes
        next();
    });
};

exports.list = function(req, res, next){
    if(req.query.userid){
        var coupons = [];

        for(var i=0; i<db.orders.length; i++){
            var order = db.orders[i];

            if(req.query.userid == order.user.id){
                coupons.push(order.coupons);
            }
        }

        res.send(coupons);
    }
    else{
        res.send(db.orders);
    }
};

exports.show = function(req, res, next){
    res.send(req.order);

};

exports.create = function(req, res, next){
    var userId = req.body.userId;
    var coupon = req.body.coupon;
    var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

    pingpp.charges.create({
        subject: userId + ' buy ' + coupon.name,
        body: coupon.name,
        amount: coupon.price * 100,
        order_no: "123456789",
        channel: "alipay_wap",
        currency: "cny",
        client_ip: ip,
        extra: {success_url: 'http://120.25.105.129:3000/orders'},
        app: {id: "app_r5y9iT5qbb184eLe"}
    }, function(err, charge) {
        console.log(err);
        console.log(charge);

        for(var key in db.orders)
        {
            var order = db.orders[key];

            if(order.user.id == userId)
            {
                db.orders[key].coupons.push(coupon);
            }
        }

        res.send(charge);
    });

};

exports.update = function(req, res, next){
    res.send('update order');

};

