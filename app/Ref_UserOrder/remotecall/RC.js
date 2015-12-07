var APIUtils = require('../../Common/webapiutils/APIUtils');
var HidogsConstants = require('../../Common/constants/HidogsConstants');

var RemoteCall = {
    getOrderListPromise: function (callback) {
        var promise = new Promise(function(resolve, reject){
            var url = APIUtils.makeUrl("/orders?projection=product_id,user_id,price,status,booktime");
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

    payOrderPromise: function (object) {
        var promise = new Promise(function(resolve, reject){
            var url = APIUtils.makeUrl("/payment");
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

module.exports = RemoteCall;