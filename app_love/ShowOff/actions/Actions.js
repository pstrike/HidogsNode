var AppDispatcher = require('../../../app/Common/dispatcher/AppDispatcher');
var HGSessionRC = require('../../../app/Common/remotecall/session');
var HidogsConstants = require('../../../app/Common/constants/HidogsConstants');
var Constants = require('../constants/Constants');
var RC = require('../remotecall/RC');

var Actions = {

    getSession: function() {
        var isValidSession = false;
        HGSessionRC.getSession().then(function (payload) {

            if(payload.response) {
                AppDispatcher.dispatch({
                    actionType: HidogsConstants.HIDOGS_SESSION_LOAD_SUCCESSFUL,
                    payload: payload,
                });

                var visitor = JSON.parse(payload.response);
                isValidSession = true;
                return RC.getUser(visitor.user_id);
            }
        }).then(function (payload) {
            if(isValidSession) {
                AppDispatcher.dispatch({
                    actionType: Constants.ACTION_INIT_LOAD_VISITOR,
                    payload: payload,
                });
            }
        }, function(err) {
            AppDispatcher.dispatch({
                actionType: Constants.ACTION_INIT_FAIL,
            });
        });
    },

    getUser: function(userId) {
        RC.getUser(userId).then(function (payload) {
            AppDispatcher.dispatch({
                actionType: Constants.ACTION_INIT_LOAD_USER,
                payload: payload,
            });

            return RC.getUserRanking(userId);
        }).then(function (payload) {
            AppDispatcher.dispatch({
                actionType: Constants.ACTION_INIT_USER_RANKING,
                payload: payload,
            });
        }, function(err) {
            AppDispatcher.dispatch({
                actionType: Constants.ACTION_INIT_FAIL,
            });
        });
    },

    initClientId: function(clientId) {
        AppDispatcher.dispatch({
            actionType: Constants.ACTION_INIT_CLIENT_ID,
            clientId: clientId,
        });
    },

    supportUser: function(userId, clientId) {
        AppDispatcher.dispatch({
            actionType: Constants.ACTION_SUPPORT_USER,
            clientId: clientId,
        });

        RC.supportUser(userId, clientId).then(function (payload) {
            AppDispatcher.dispatch({
                actionType: Constants.ACTION_SUPPORT_USER_OK,
                payload: payload,
            });
        }, function(err) {
            AppDispatcher.dispatch({
                actionType: Constants.ACTION_SUPPORT_USER_FAIL,
            });
        });
    },

    loveUser: function(visitorId, lovedUserId) {
        AppDispatcher.dispatch({
            actionType: Constants.ACTION_LOVE_USER,
            visitorId: visitorId,
        });

        RC.loveUser(visitorId, lovedUserId).then(function (payload) {
            AppDispatcher.dispatch({
                actionType: Constants.ACTION_LOVE_USER_OK,
                payload: payload,
            });
        }, function(err) {
            AppDispatcher.dispatch({
                actionType: Constants.ACTION_LOVE_USER_FAIL,
            });
        });
    },

    // Location & Address
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
