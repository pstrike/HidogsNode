var db = require('../db/db');
var objectName = 'vendor';
var successMsg = {status: 'success'};
var failMsg = {status: 'fail', err: ''};
var deletedStatus = 'deleted';

var Model = {
    getPrototype: function () {
        return {
            vendor_id: "",
            pwd: "",
            name: "",
            nick_name: "",
            openid: "",
            gender: "",
            birthday: "",
            email: "",
            mobile: "",
            work_experience: "",
            address: {
                country: "",
                province: "",
                city: "",
                region: "",
                address: "",
            },
            location: {
                longitude: "",
                latitude: "",
            },
            head_image_url: "",
            id_card: {
                no: "",
                front_image_url: "",
                back_image_url: "",
            },
            honor_list: [],
            image_url_list: [],
            status: "created",
            setting: {
                concurrent_no: "",
                business_time_list: [],
                timeoff_list: [],
                reject_today_flag: "",
            },
            is_active: true,
            payment_account: "",
            description: "",
            role: [
                {
                    role_id: "1",
                    name: "美容达人",
                    slug: "grooming",
                    status: "drafted",
                    certificate_list: [],
                    work_list: [],
                    reject_reason: "",
                    rate: "",
                },
            ],
            created_time: "",
            modified_time: "",
        };
    },

    getObject: function (object_id, projection, callback) {
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

    getObjectList: function (filter, projection, callback) {
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

    updateObject: function (object, callback) {
        var idName = objectName + '_id';
        object.modified_time = new Date();

        db.get().collection(objectName).updateOne(
            {idName: object[idName]},
            {
                $set: object,
            }, function (err, result) {
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

    insertObject: function (object, callback) {
        object.created_time = new Date();

        db.get().collection(objectName).insertOne(object, function (err, result) {
            if (err) {
                console.log("[Insert DB " + objectName + " Err]" + err);
                failMsg.err = err;
                callback(failMsg);
            }
            else {
                callback(successMsg);
            }
        });
    },

    removeObject: function (objectId, callback) {
        var idName = objectName + '_id';
        db.get().collection(objectName).updateOne(
            {idName: objectId},
            {
                $set: {status: deletedStatus},
                $currentDate: {"modified_time": true}
            }, function (err, result) {
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

module.exports = Model;