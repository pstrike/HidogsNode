exports.engine = 'ejs';

exports.before = function(req, res, next){
    next();
};

exports.show = function(req, res, next){
    res.send("order show");
};

exports.list = function(req, res, next){
    res.send("order list");
};

exports.update = function(req, res, next){
    res.send("order update");
};

exports.insert = function(req, res, next){
    res.send("order insert");
};

exports.index = function(req, res, next){
    res.send("order index");
};

exports.page = function(req, res, next){
    res.send("order page");
};