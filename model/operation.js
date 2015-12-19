var db = require('../db/db');
var Uuid = require('../util/genuuid');
var successMsg = {status: 'success'};
var failMsg = {status: 'fail', err: ''};
var deletedStatus = 'deleted';

var DAO = {

    getCollectionList: function () {
        return {
            vendor: "vendor",
            user: "user",
            product: "product",
            product_meta_category: "product_meta_category",
            product_meta_exit_policy: "product_meta_exit_policy",
            product_meta_other: "product_meta_other",
            order: "order",

            vendor_potential: "vendor_potential",
        };
    },

    getObject: function (objectName, object_id, projection, callback) {
        var idName = objectName + '_id';

        var filter = {};
        filter[idName] = object_id;
        filter.status = {$ne: deletedStatus}; // exclude object whose status is "deleted"

        if(!projection) {
            projection = {};
        }
        projection['_id'] = 0; // exclude projection of "_id"

        db.get().collection(objectName).find(filter, projection).limit(1).toArray(function (err, docs) {
            if (err) {
                console.log("[Get DB " + objectName + " Err]" + err);
                failMsg.err = err;
                callback(failMsg);
            }
            else {
                callback(docs[0]);
            }
        });
    },

    getObjectList: function (objectName, filter, projection, callback) {
        if(!filter) {
            filter = {};
        }
        filter.status = {$ne: deletedStatus}; // exclude object whose status is "deleted"

        if(!projection) {
            projection = {};
        }
        projection['_id'] = 0; // exclude projection of "_id"

        db.get().collection(objectName).find(filter, projection).toArray(function (err, docs) {
            if (err) {
                console.log("[Get DB " + objectName + " List Err]" + err);
                failMsg.err = err;
                callback(failMsg);
            }
            else {
                callback(docs);
            }
        });
    },

    updateObject: function (objectName, object, callback) {
        var idName = objectName + '_id';
        object.modified_time = new Date();

        var filter = {};
        filter[idName] = object[idName];

        db.get().collection(objectName).updateOne(
            filter,
            {
                $set: object,
            },
            function (err, result) {
                if (err) {
                    console.log("[Update DB " + objectName + " Err]" + err);
                    failMsg.err = err;
                    callback(failMsg);
                }
                else {
                    callback(successMsg);
                }
            });
    },

    insertObject: function (objectName, object, callback) {
        object.created_time = new Date();

        // assign UUID to new object
        var idName = objectName + '_id';
        if(!object[idName]) {
            object[idName] = Uuid.uuid();
        }

        db.get().collection(objectName).insertOne(object, function (err, result) {
            if (err) {
                console.log("[Insert DB " + objectName + " Err]" + err);
                failMsg.err = err;
                callback(failMsg);
            }
            else {
                successMsg[idName] = result.ops[0][idName]
                successMsg['created_time'] = result.ops[0]['created_time'];
                callback(successMsg);
            }
        });
    },

    removeObject: function (objectName, objectId, callback) {
        var idName = objectName + '_id';

        var filter = {};
        filter[idName] = objectId;

        db.get().collection(objectName).updateOne(
            filter,
            {
                $set: {status: deletedStatus},
                $currentDate: {"modified_time": true}
            },
            function (err, result) {
                if (err) {
                    console.log("[Remove DB " + objectName + " Err]" + err);
                    failMsg.err = err;
                    callback(failMsg);
                }
                else {
                    callback(successMsg);
                }
            });
    }
};

module.exports = DAO;