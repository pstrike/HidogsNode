var stream = require('stream');
var db = require('../db/db');

var dbStream = new stream.Writable();
dbStream._write = function (chunk, encoding, done) {
    var result = chunk.toString().split("!");

    var log = {
        date: result[0],
        method: result[1],
        url: result[2],
        status: result[3],
        response_time: result[4],
        request_ip: result[5],
        referrer: result[6],
        user_agent: result[7],
    };

    db.get().collection('log').insertOne(log,{writeConcern: { w: 0, wtimeout: 5000 }}, function (err, result) {
        if (err) {
            console.log("[db err] insert log into db err");
            console.log(err);
            done();
        }
        else {
            done();
        }
    });

};

module.exports = dbStream;