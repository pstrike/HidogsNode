var APIUtils = require('../../../app/Common/webapiutils/APIUtils');
var HidogsConstants = require('../../../app/Common/constants/HidogsConstants');
require('es6-shim');

var RemoteCall = {
    getUser: function (userId) {
        var promise = new Promise(function(resolve, reject){
            var url = APIUtils.makeUrl("/user/"+userId+"?projection=user_id,pet,history_locations,nick_name,head_image_url,openid");
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

    updateUser: function (user, callback) {
        var promise = new Promise(function(resolve, reject){
            var url = APIUtils.makeUrl("/user/"+user.user_id);
            APIUtils.put(url, user, function(result) {
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

    updateUserLocation: function (user, callback) {
        var promise = new Promise(function(resolve, reject){
            var url = APIUtils.makeUrl("/user/other/location");
            APIUtils.post(url, user, function(result) {
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