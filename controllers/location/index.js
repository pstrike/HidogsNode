var db = require('../../db/db_dump');
var React = require('react'),
ReactApp = React.createFactory(require('../../app/components/HidogsApp.react'));
//ReactApp = React.createFactory(require('../../app/components/Shop.react'));

exports.engine = 'ejs';

exports.before = function(req, res, next){
    var id = req.params.location_id;
    if (!id) return next();
    // pretend to query a database...
    process.nextTick(function(){
        req.location = db.locations[id];
        // cant find that user
        if (!req.location) return next('route');
        // found it, move on to the routes
        next();
    });
};

exports.list = function(req, res, next){
    res.send(db.locations);
};

exports.show = function(req, res, next){
    res.send(req.location);
};

exports.page  =function(req, res, next){
    var reactHtml = React.renderToString(ReactApp({initData: db.locations[0]}));
    // Output html rendered by react
    console.log(reactHtml);
    res.render('index.ejs', {reactOutput: reactHtml});
};