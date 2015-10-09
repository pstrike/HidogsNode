var express = require('express');
var logger = require('morgan');
var bodyParser = require('body-parser');
var db = require("./db/db");

var app = module.exports = express();
var path = require('path');
var config = require('./config')();


// Make sure to include the JSX transpiler
require("node-jsx").install();

// create an error with .status. we
// can then use the property in our
// custom error handler (Connect repects this prop as well)
function error(status, msg) {
    var err = new Error(msg);
    err.status = status;
    return err;
}

// parse request query into filter and projection
function queryParser(req, res, next) {
    if(req.query.filter) {
        var rawFilter = req.query.filter.split(",");

        var filter = {};
        for(var i=0; i<rawFilter.length; i=i+2) {
                filter[rawFilter[i]] = rawFilter[i+1];
        }
        req.filter = filter;
    }


    if(req.query.projection) {
        var rawProjection = req.query.projection.split(",");

        var projection = {};
        for(i in rawProjection)
        {
            projection[rawProjection[i]] = "1";
        }
        req.projection = projection;
    }


    next();
}

// if we wanted to supply more than JSON, we could
// use something similar to the content-negotiation
// example.

// here we validate the API key,
// by mounting this middleware to /api
// meaning only paths prefixed with "/api"
// will cause this middleware to be invoked

/*
app.use('/api', function(req, res, next){
    var key = req.query['api-key'];

    // key isn't present
    if (!key) return next(error(400, 'api key required'));

    // key is invalid
    if (!~apiKeys.indexOf(key)) return next(error(401, 'invalid api key'));

    // all good, store req.key for route access
    req.key = key;
    next();
});

// map of valid api keys, typically mapped to
// account info with some sort of database like redis.
// api keys do _not_ serve as authentication, merely to
// track API usage or help prevent malicious behavior etc.

var apiKeys = ['foo', 'bar', 'baz'];
*/

// log
if (!module.parent) app.use(logger('dev'));

// serve static files
app.use(express.static(__dirname + '/public'));

// parse request bodies (req.body)
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(queryParser);

// load controllers
require('./router/boot')(app, { verbose: !module.parent });

// middleware with an arity of 4 are considered
// error handling middleware. When you next(err)
// it will be passed through the defined middleware
// in order, but ONLY those with an arity of 4, ignoring
// regular middleware.
app.use(function(err, req, res, next){
    // whatever you want here, feel free to populate
    // properties on `err` to treat it differently in here.
    res.status(err.status || 500);
    res.send({ error: err.message });
});

// our custom JSON 404 middleware. Since it's placed last
// it will be the last middleware called, if all others
// invoke next() and do not respond.
app.use(function(req, res){
    res.status(404);
    res.send({ error: "Lame, can't find that" });
});

/* istanbul ignore next */
if (!module.parent) {

    db.connect('mongodb://' + config.mongo.host + ':' + config.mongo.port + '/hidogs', function(err) {
        if (err) {
            console.log('Sorry, there is no mongo db server running.');
        }
        else
        {
            app.listen(config.port);
            console.log(
                    'Successfully connected to mongodb://' + config.mongo.host + ':' + config.mongo.port,
                    '\nExpress server listening on port ' + config.port
            );
        }
    });
}
