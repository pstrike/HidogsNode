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

        }
    });
}
