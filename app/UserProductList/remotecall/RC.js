var APIUtils = require('../../Common/webapiutils/APIUtils');
var HidogsConstants = require('../../Common/constants/HidogsConstants');
require('es6-shim');

var RemoteCall = {
    getProductList: function () {
        var promise = new Promise(function(resolve, reject){
            var url = APIUtils.makeUrl("/products?filter=status,published");
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