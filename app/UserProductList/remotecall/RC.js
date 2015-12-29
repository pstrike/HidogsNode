var APIUtils = require('../../Common/webapiutils/APIUtils');
var HidogsConstants = require('../../Common/constants/HidogsConstants');
require('es6-shim');

var RemoteCall = {
    getGeoProductList: function (longitude,latitude,category,keyword) {
        var promise = new Promise(function(resolve, reject){
            var url = APIUtils.makeUrl("/product/other/h1?type=geoproductlist&lat="+latitude+"&lng="+longitude+"&category="+category+"&keyword="+keyword+"&projection=vendor,title,rate,price,address,location,sale_no,product_id,tag_list");
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

    getPopProductList: function (category,keyword) {
        var promise = new Promise(function(resolve, reject){
            var url = APIUtils.makeUrl("/product/other/h1?type=popularproductlist&category="+category+"&keyword="+keyword+"&projection=vendor,title,rate,price,address,location,sale_no,product_id,tag_list");
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

    getWXSignaturePromise: function (pageUrl) {
        var promise = new Promise(function(resolve, reject){
            var url = APIUtils.makeUrl("/wechat/wxjssignature?url="+pageUrl);
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