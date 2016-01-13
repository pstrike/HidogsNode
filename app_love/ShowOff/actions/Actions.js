var AppDispatcher = require('../../../app/Common/dispatcher/AppDispatcher');
var HGSessionRC = require('../../../app/Common/remotecall/session');
var HidogsConstants = require('../../../app/Common/constants/HidogsConstants');
var Constants = require('../constants/Constants');
var RC = require('../remotecall/RC');

var Actions = {

    getSession: function() {
        HGSessionRC.getSession().then(function (payload) {
            AppDispatcher.dispatch({
                actionType: HidogsConstants.HIDOGS_SESSION_LOAD_SUCCESSFUL,
                payload: payload,
            });

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