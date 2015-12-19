var APIUtils = require('../../Common/webapiutils/APIUtils');
var HidogsConstants = require('../../Common/constants/HidogsConstants');
require('es6-shim');

var RemoteCall = {
    getVendorListPromise: function () {
        var promise = new Promise(function(resolve, reject){
            var url = APIUtils.makeUrl("/vendors?projection=role,nick_name,mobile,status,name,vendor_id");
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

    getVendorPromise: function (id) {
        var promise = new Promise(function(resolve, reject){
            var url = APIUtils.makeUrl("/vendor/"+id);
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

    updateVendor: function (object, callback) {
        delete object._id;
        delete object.modified_time;

        var promise = new Promise(function(resolve, reject){
            var url = APIUtils.makeUrl("/vendor/"+object.openid);
            APIUtils.put(url, object, function(result) {
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

    sendWXNotice: function(object) {
        var promise = new Promise(function(resolve, reject){
            var url = APIUtils.makeUrl("/wechat/other/template");
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