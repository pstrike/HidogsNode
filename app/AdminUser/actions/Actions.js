var AppDispatcher = require('../../Common/dispatcher/AppDispatcher');
var HidogsConstants = require('../../Common/constants/HidogsConstants');
var Constants = require('../constants/Constants');
var RC = require('../remotecall/RC');

var Actions = {

    getUserList: function() {

        RC.getUserListPromise().then(function (payload) {
            var rawUserList = JSON.parse(payload.response);

            var openidList = [];
            rawUserList.forEach(function(user) {
                if(user.user_id.indexOf('robot') < 0) {
                    openidList.push(user.openid)
                }
            })

            AppDispatcher.dispatch({
                actionType: Constants.ACTION_GET_USER_LIST_SUCCESS,
                userList: rawUserList,
            });

            return RC.getWXUserBatchPromise({account: 'user', user_list: openidList});
        }).then(function (payload) {
            AppDispatcher.dispatch({
                actionType: Constants.ACTION_GET_WX_USER_BATCH_SUCCESS,
                payload: payload,
            });
        }, function (err) {
            AppDispatcher.dispatch({
                actionType: Constants.ACTION_GET_USER_LIST_FAIL
            });
        });
    },

    sortUserList: function(key) {
        AppDispatcher.dispatch({
            actionType: Constants.ACTION_SORT_USER_LIST,
            key: key,
        });
    },

    getUserDetail: function(userId) {
        AppDispatcher.dispatch({
            actionType: Constants.ACTION_GET_USER_DETAIL,
            userId: userId,
        });

        RC.getUserDetailPromise(userId).then(function (payload) {
            AppDispatcher.dispatch({
                actionType: Constants.ACTION_GET_USER_DETAIL_OK,
                payload: payload,
            });
        }, function (err) {
            AppDispatcher.dispatch({
                actionType: Constants.ACTION_GET_USER_DETAIL_FAIL,
            });
        });
    },

};

module.exports = Actions;
