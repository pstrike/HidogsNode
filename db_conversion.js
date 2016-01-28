var db = require("./db/db");
var operation = require("./model/operation");

var config = require('./config')('staging');

if (!module.parent) {

    var filter = {
        //'vendor.vendor_id': "bac86261-61d5-4023-1d8a-892c35e8eb27",
    };

    // init db
    db.connect('mongodb://' + config.mongo.host + ':' + config.mongo.port + '/hidogs', function(err) {
        if (err) {
            console.log('Sorry, there is no mongo db server running.');
        }
        else
        {
            console.log("working...");

            console.log("done")
        }
    });
}

function convertProductVendor() {
    operation.getObjectList(operation.getCollectionList().product, filter, {}, function(objectList) {

        objectList.forEach(function(item) {

            var newProduct = {
                product_id: item.product_id,
                vendor: {
                    vendor_id: item.vendor.vendor_id,
                    nick_name: "",
                    head_image_url: "",
                },
            }

            //console.log(newProduct);

            operation.updateObject(operation.getCollectionList().product, newProduct, function(result) {
                if(result.status == 'fail') {
                    console.log(result.err);
                }
                console.log(result);
            });
        })

    })
};

function loveFavUserTop() {
    operation.getObject(operation.getCollectionList().user, "93d2819d-d0b4-2457-2028-514a5c013a0b", {}, function(user) {

        // remove 0 support
        var newLoveList = [];
        for(var k=0; k<user.love.love_me.length; k++) {
            if(user.love.love_me[k] != "0") {
                newLoveList.push(user.love.love_me[k]);
            }
        }

        for(var i=0; i<48; i++) {
            newLoveList.push("0");
        }

        user.love.love_me = newLoveList;

        //console.log(user);

        operation.updateObject(operation.getCollectionList().user, user, function(result) {
            if(result.status == 'fail') {
                console.log(result.err);
            }
            console.log(result);
        });

    })
};

function loveFavUser() {
    operation.getObjectList(operation.getCollectionList().user, {}, {}, function(objectList) {
        var userList = [];

        objectList.forEach(function (user) {
            if (user.user_id.indexOf("robot") < 0 && user.pet && user.pet.name) {
                userList.push(user);
            }
        })

        var rand;

        for(var j=0; j<userList.length; j++) {
            var user = userList[j];

            //console.log(user.love.support);

            // remove 0 support
            var newLoveList = [];
            for(var k=0; k<user.love.love_me.length; k++) {
                if(user.love.love_me[k] != "0") {
                    newLoveList.push(user.love.love_me[k]);
                }
            }

            // add 0 support
            rand = parseInt(Math.random()*5,10);

            for(var i=0; i<rand; i++) {
                newLoveList.push("0");
            }

            user.love.love_me = newLoveList;

            //console.log(newLoveList);

            //console.log(user.love.love_me);

            operation.updateObject(operation.getCollectionList().user, user, function(result) {
                if(result.status == 'fail') {
                    console.log(result.err);
                }
                console.log(result);
            });
        }

    })
};

function loveSupportUser() {
    operation.getObjectList(operation.getCollectionList().user, {}, {}, function(objectList) {
        var userList = [];

        objectList.forEach(function (user) {
            if (user.user_id.indexOf("robot") < 0 && user.pet && user.pet.name) {
                userList.push(user);
            }
        })

        var rand;

        for(var j=0; j<userList.length; j++) {
            var user = userList[j];

            //console.log(user.love.support);

            // remove 0 support
            var newSupportList = [];
            for(var k=0; k<user.love.support.length; k++) {
                if(user.love.support[k] != "0") {
                    newSupportList.push(user.love.support[k]);
                }
            }

            // add 0 support
            rand = parseInt(Math.random()*10,10);

            for(var i=0; i<rand; i++) {
                newSupportList.push("0");
            }

            user.love.support = newSupportList;

            //console.log(newSupportList);

            //console.log(user.love.support);

            operation.updateObject(operation.getCollectionList().user, user, function(result) {
                if(result.status == 'fail') {
                    console.log(result.err);
                }
                console.log(result);
            });
        }

    })
};