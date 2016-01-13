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
                actionType: Constants.ACTION_INIT_LOAD_USER,
                user: user,
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

    // Image
    uploadWXPicture: function (mediaId, path, type) {
        HGWXRC.getWXMedia(mediaId, type).then(function (payload) {
            AppDispatcher.dispatch({
                actionType: Constants.ACTION_GET_WX_MEDIA_SUCCESS,
                payload: payload,
                path: path,
            });
        }, function (err) {
            AppDispatcher.dispatch({
                actionType: Constants.ACTION_GET_WX_MEDIA_FAIL
            });
        });
    },

    // Location & Address
    initLocation: function(user, location, address) {
        AppDispatcher.dispatch({
            actionType: Constants.ACTION_GET_LOCATION,
            location: location,
            address: address,
        });

        var newUser = {
            user_id: user.user_id,
            location: location,
            address: address,
        };
        //if(!user.history_locations) {
        //    newUser.history_locations = [
        //        {
        //            location: location,
        //            address: address,
        //        },
        //        {},
        //        {},
        //    ];
        //}
        //else {
        //    newUser.history_locations = [
        //        {
        //            location: location,
        //            address: address,
        //        },
        //        user.history_locations[0],
        //        user.history_locations[1],
        //    ];
        //}

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
