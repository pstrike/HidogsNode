exports.engine = 'ejs';

exports.before = function(req, res, next){
    next();
};

exports.show = function(req, res, next){
    res.send("user show");
};

exports.list = function(req, res, next){
    res.send("user list");
};

exports.update = function(req, res, next){
    res.send("user update");
};

exports.insert = function(req, res, next){
    res.send("user insert");
};

exports.index = function(req, res, next){
    res.send("user index");
};

exports.page = function(req, res, next){
    res.send("user page");
};