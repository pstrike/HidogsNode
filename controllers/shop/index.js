exports.engine = 'ejs';

exports.before = function(req, res, next){
    next();
};

exports.show = function(req, res, next){
    res.send("shop show");
};

exports.list = function(req, res, next){
    res.send("shop list");
};

exports.update = function(req, res, next){
    res.send("shop update");
};

exports.insert = function(req, res, next){
    res.send("shop insert");
};

exports.index = function(req, res, next){
    res.send("shop index");
};

exports.page = function(req, res, next){
    res.send("shop page");
};