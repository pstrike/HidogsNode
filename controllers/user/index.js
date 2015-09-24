var db = require('../../db/db');

exports.before = function(req, res, next){
    var id = req.params.user_id;
    if (!id) return next();
    // pretend to query a database...
    process.nextTick(function(){
        req.user = db.users[id];
        // cant find that user
        if (!req.user) return next('route');
        // found it, move on to the routes
        next();
    });
};

exports.list = function(req, res, next){
    res.send(db.users);
};

exports.show = function(req, res, next){
    res.send(req.user);

};