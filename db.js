var MongoClient = require('mongodb').MongoClient;
var assert = require('assert')
var ObjectId = require('mongodb').ObjectID;
var url = 'mongodb://hidogs:Huanchong888888@120.25.105.129:27017/hidogs';
//var url = 'mongodb://localhost:27017/hidogs';
//var shopData = require('./db/db_shop');
//var vendorData = require('./db/db_vendor');
var type = "user"
var data = require('./db/db_'+type);

var insertDocument = function(db, data, callback) {
    db.collection(type).insert(data, function(err, result) {
        assert.equal(err, null);
        console.log("Inserted "+type+" into the "+type+" collection.");
        callback(result);
    });
};

MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    insertDocument(db, data, function() {
        db.close();
    });
});