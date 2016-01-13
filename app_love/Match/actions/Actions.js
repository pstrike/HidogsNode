var AppDispatcher = require('../../../app/Common/dispatcher/AppDispatcher');
var HidogsConstants = require('../../../app/Common/constants/HidogsConstants');
var HGSessionRC = require('../../../app/Common/remotecall/session');
var HGWXRC = require('../../../app/Common/remotecall/wx');
var Constants = require('../constants/Constants');
var RC = require('../remotecall/RC');

var Actions = {

    // Init
    getSessionThenUser: function() {
        var userId;
        var user;

        HGSessionRC.getSession().then(function (payload) {
            var response = JSON.parse(payload.response);

            userId = response.user_id;

            AppDispatcher.dispatch({
                actionType: HidogsConstants.HIDOGS_SESSION_LOAD_SUCCESSFUL,
                payload: payload,
            });

            return RC.getUser(userId);
        }).then(function (payload) {
            user = JSON.parse(payload.response);
            return HGWXRC.checkSubscribe(user.openid, 'user');
        }).then(function (payload) {
            AppDispatcher.dispatch({
                actionType: Constants.ACTION_INIT_LOAD_USER_OK,
                user: user,
                payload: payload,
            });

            var userIdList = [];
            for(var i=0; i<user.love.i_love.length; i++) {
                for(var j=0; j<user.love.love_me.length; j++) {
                    if(user.love.i_love[i] == user.love.love_me[j]) {
                        userIdList.push(user.love.love_me[j]);
                        break;
                    }
                }
            }

            return RC.getUserList(userIdList);
        }).then(function (payload) {
            AppDispatcher.dispatch({
                actionType: Constants.ACTION_LOAD_USER_LIST_OK,
                payload: payload,
            });
        }, function(err) {
            AppDispatcher.dispatch({
                actionType: Constants.ACTION_INIT_FAIL,
            });
        });
    },

    // User
    updateUser: function(user) {

        AppDispatcher.dispatch({
            actionType: Constants.ACTION_UPDATE,
            user: user,
        });

        RC.updateUser(user).then(function (payload) {
            AppDispatcher.dispatch({
                actionType: Constants.ACTION_UPDATE_OK,
                payload: payload,
            });
        }, function(err) {
            AppDispatcher.dispatch({
                actionType: Constants.ACTION_UPDATE_FAIL,
                err:err,
            });
        });
    },

    initLocation: function(userId, location, address) {

        var newUser = {
            user_id: userId,
            location: location,
            address: address,
        };

        RC.updateUserLocation(newUser).then(function (payload) {
            AppDispatcher.dispatch({
                actionType: Constants.ACTION_UPDATE_LOCATION,
                payload: payload,
            });
        }, function(err) {
            AppDispatcher.dispatch({
                actionType: Constants.ACTION_UPDATE_FAIL,
                err:err,
            });
        });
    },
};

module.exports = Actions;
