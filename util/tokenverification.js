var error = require("./errorhandler");
var ObjectID = require('mongodb').ObjectID;

exports.verify = function (req, res, next) {

    /*
    var key = req.query['token'];

    // key isn't present
    if (!key) return next(error.new(400, 'api key required'));

    // key is invalid
    if (!~apiKeys.indexOf(key)) return next(error.new(401, 'invalid api key'));

    // all good, store req.key for route access
    req.key = key;
    next();
    */

    if(req.path.indexOf("view")>0 || req.path.indexOf("wechat")>0) {
        next();
    }
    else {

        var token = req.query['token'];
        var ref = req.query['ref'];

        if(!token) return next(error.new(400, 'token is required'));

        if(!ref) return next(error.new(400, 'ref is required'));

        var kitty = new Date(parseInt(token)+1111111111111);

        var k = kitty.getTime().toString();
        var bean=1;
        for(var i=0; i<k.length; i=i+2) {
            bean *= parseInt(k[i]);
        }

        if(ref != bean) return next(error.new(401, 'invalid token'));

        var currentDate = new Date();
        var difference = currentDate.getTime() - kitty.getTime();
        if(difference > 60000) return next(error.new(401, 'invalid token'));

        req.token = token;
        next();

    }

}

var apiKeys = ['foo', 'bar', 'baz'];