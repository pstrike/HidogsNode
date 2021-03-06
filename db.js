var MongoClient = require('mongodb').MongoClient;
var assert = require('assert')
var ObjectId = require('mongodb').ObjectID;
var url = 'mongodb://localhost:27017/hidogs';
var shopData = require('./db/db_shop');

var insertDocument = function(db, data, callback) {
    db.collection('shop').insert(data, function(err, result) {
        assert.equal(err, null);
        console.log("Inserted a document into the shop collection.");
        callback(result);
    });
};

var findDocument = function(db, callback) {
    var cursor =db.collection('shop').find().limit(1);

    cursor.each(function(err, doc) {
        if (doc != null) {
            console.dir(doc);
        } else {
            callback(err);
        }
    });

};

MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    /*
    insertDocument(db, shopData, function() {
        db.close();
    });
    */
    findDocument(db, function(err){console.log(err)});
});