var db = require('../../db/db');
var React = require('react'),
ReactApp = React.createFactory(require('../../app/components/Shop.react'));

exports.engine = 'ejs';

exports.before = function(req, res, next){
    var id = req.params.shop_id;
    if (!id) return next();
    // pretend to query a database...
    process.nextTick(function(){
        var shop = db.get().collection('shop').find({"_id":id}).toArray(function(err, docs) {
            req.shop = docs[0];

            // cant find that user
            if (!req.shop) return next('route');
            // found it, move on to the routes
            next();
        });
    });
};

exports.show = function(req, res, next){
    res.send(req.shop);
};

exports.page = function(req, res, next){

    db.get().collection('shop').find({"_id":"1"}).toArray(function(err, docs) {
        var shop = docs[0];

        var reactHtml = React.renderToString(ReactApp({"initData": shop}));
        // Output html rendered by react
        res.render('index.ejs', {reactOutput: reactHtml});

    });



};