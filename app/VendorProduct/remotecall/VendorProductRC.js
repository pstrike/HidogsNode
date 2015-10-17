var APIUtils = require('../../Common/webapiutils/APIUtils');
var HidogsConstants = require('../../Common/constants/HidogsConstants');

var VendorProductRC = {
    getProductList: function (callback) {
        var url = APIUtils.makeUrl("/products?projection=title");
        APIUtils.get(url, callback);
    },

    getProductListPromise: function () {
        var promise = new Promise(function(resolve, reject){
            var url = APIUtils.makeUrl("/products?projection=title,category");
            APIUtils.get(url, function(result) {
                if(result.response == HidogsConstants.WEB_UTILS_REQUEST_TIMEOUT
                    || result.response == HidogsConstants.WEB_UTILS_REQUEST_NOT_FOUND
                    || result.response == HidogsConstants.WEB_UTILS_REQUEST_ERROR) {
                    reject(Error(result));
                }
                else {
                    resolve(result);
                }
            });
        });

        return promise;
    },

    getProductById: function (id, callback) {
        var url = APIUtils.makeUrl("/product/"+id);
        APIUtils.get(url, callback);
    },

    getProductByIdPromise: function (id) {
        var promise = new Promise(function(resolve, reject){
            var url = APIUtils.makeUrl("/product/"+id);
            APIUtils.get(url, function(result) {
                if(result.response == HidogsConstants.WEB_UTILS_REQUEST_TIMEOUT
                    || result.response == HidogsConstants.WEB_UTILS_REQUEST_NOT_FOUND
                    || result.response == HidogsConstants.WEB_UTILS_REQUEST_ERROR) {
                    reject(Error(result));
                }
                else {
                    resolve(result);
                }
            });
        });

        return promise;
    },

    getProductMetaPromise: function () {
        var promise = new Promise(function(resolve, reject){
            var url = APIUtils.makeUrl("/product/meta/list");
            APIUtils.get(url, function(result) {
                if(result.response == HidogsConstants.WEB_UTILS_REQUEST_TIMEOUT
                    || result.response == HidogsConstants.WEB_UTILS_REQUEST_NOT_FOUND
                    || result.response == HidogsConstants.WEB_UTILS_REQUEST_ERROR) {
                    reject(Error(result));
                }
                else {
                    resolve(result);
                }
            });
        });

        return promise;
    },

    insertProduct: function (product, callback) {
        var url = APIUtils.makeUrl("/product");
        APIUtils.post(url, product, callback);
    },

    insertProductPromise: function(object) {
        var promise = new Promise(function(resolve, reject){
            var url = APIUtils.makeUrl("/product");
            APIUtils.post(url, object, function(result) {
                if(result.response == HidogsConstants.WEB_UTILS_REQUEST_TIMEOUT
                    || result.response == HidogsConstants.WEB_UTILS_REQUEST_NOT_FOUND
                    || result.response == HidogsConstants.WEB_UTILS_REQUEST_ERROR) {
                    reject(Error(result));
                }
                else {
                    resolve(result);
                }
            });
        });

        return promise;
    },

    updateProduct: function (product, callback) {
        var url = APIUtils.makeUrl("/product/"+product._id);
        APIUtils.put(url, product, callback);
    },

    deleteProduct: function (product, callback) {
        var url = APIUtils.makeUrl("/product/"+product._id);
        var deletedProduct = {
            "_id":product._id,
            "status":"deleted"
        };

        APIUtils.put(url, deletedProduct, callback);
    },

    uploadPicturePromise: function(object) {
        var promise = new Promise(function(resolve, reject){
            var url = APIUtils.makeUrl("/picture");

            APIUtils.post(url, object, function(result) {
                if(result.response == HidogsConstants.WEB_UTILS_REQUEST_TIMEOUT
                    || result.response == HidogsConstants.WEB_UTILS_REQUEST_NOT_FOUND
                    || result.response == HidogsConstants.WEB_UTILS_REQUEST_ERROR) {
                    reject(Error(result));
                }
                else {
                    resolve(result);
                }
            });
        });

        return promise;
    },
};

module.exports = VendorProductRC;