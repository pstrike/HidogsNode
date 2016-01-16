var APIUtils = require('../../../app/Common/webapiutils/APIUtils');
var HidogsConstants = require('../../../app/Common/constants/HidogsConstants');
require('es6-shim');

var RemoteCall = {
    getTopList: function () {
        var promise = new Promise(function(resolve, reject){
            var url = APIUtils.makeUrl("/love/other/top");
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

    getRandomUserList: function () {
        var promise = new Promise(function(resolve, reject){
            var url = APIUtils.makeUrl("/love/other/random?no=9");
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