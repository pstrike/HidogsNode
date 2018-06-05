var APIUtils = require('../../Common/webapiutils/APIUtils');
var HidogsConstants = require('../../Common/constants/HidogsConstants');
require('es6-shim');

var RemoteCall = {
    getUserListPromise: function () {
        var promise = new Promise(function(resolve, reject){
            var url = APIUtils.makeUrl("/users?projection=user_id,nick_name,gender,address,pet,love,modified_time,created_time,last_visited_time,openid,visit_count,head_image_url,wx_id");
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

    getUserDetailPromise: function (userId) {
        var promise = new Promise(function(resolve, reject){
            var url = APIUtils.makeUrl("/user/"+userId);
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

    getWXUserBatchPromise: function (userList) {
        var promise = new Promise(function(resolve, reject){
            var url = APIUtils.makeUrl("/wechat/other/getuserbatch");
            APIUtils.post(url, userList, function(result) {
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