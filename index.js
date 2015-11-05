var express = require('express');
var logger = require('morgan');
var bodyParser = require('body-parser');
var db = require("./db/db");
var error = require("./util/errorhandler");
var filterprojectionparser = require("./util/filterprojectionparser");
var tokenverifiction = require("./util/tokenverification");
var writablestreamintodb = require('./util/writablestreamintodb');
var session = require('express-session')
//var wechatvalidation = require('./util/wechatvalidation');

var app = module.exports = express();
var config = require('./config')('staging');

// Make sure to include the JSX transpiler
require("node-jsx").install();

// if we wanted to supply more than JSON, we could
// use something similar to the content-negotiation
// example.

// log
if (!module.parent) app.use(logger(':date[clf]!:method!:url!:status!:response-time ms!:remote-addr!:referrer!:user-agent', {stream: writablestreamintodb}));
if (!module.parent) app.use(logger('dev'));

// setup session
app.use(session({ secret: 'keyboard cat', cookie: { maxAge: 60000 }}))

// serve static files
app.use(express.static(__dirname + '/public'));

// parse request bodies (req.body)
//app.use(tokenverifiction.verify);
app.use(filterprojectionparser.parse);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.query());

// load controllers
require('./router/boot')(app, { verbose: !module.parent });


// validate wechat
//app.use('/wechat', wechatvalidation.validateToken);


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
