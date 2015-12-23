var APIUtils = require('../../Common/webapiutils/APIUtils');
var HidogsConstants = require('../../Common/constants/HidogsConstants');
require('es6-shim');

var RemoteCall = {
    getProductList: function (idList) {
        var promise = new Promise(function(resolve, reject){
            var url = APIUtils.makeUrl("/products?filter=status,published&projection=product_id,title,category,price,sale_no,address,vendor,rate&idlist="+(idList.length > 0 ? idList.join(",") : "null"));
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

    getVendorList: function (idList) {

        var promise = new Promise(function(resolve, reject){
            var url = APIUtils.makeUrl("/vendors?projection=vendor_id,nick_name,head_image_url,role,address,setting&idlist="+(idList.length > 0 ? idList.join(",") : "null"));
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

    getUserPromise: function(id) {
        var promise = new Promise(function(resolve, reject){
            var url = APIUtils.makeUrl("/user/"+id+"?projection=user_id,fav_list");
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
};

module.exports = RemoteCall;