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

            return RC.getUser(userId)
        }).then(function (payload) {
            user = JSON.parse(payload.response);
            return HGWXRC.checkSubscribe(user.openid, 'user');
        }).then(function (payload) {
            AppDispatcher.dispatch({
                actionType: Constants.ACTION_LOAD_USER_OK,
                user: user,
                payload: payload,
            });

            return RC.getTopList();
        }).then(function (payload) {
            AppDispatcher.dispatch({
                actionType: Constants.ACTION_LOAD_TOP_LIST_OK,
                payload: payload,
            });

            return RC.getRandomUserList();
        }).then(function (payload) {
            AppDispatcher.dispatch({
                actionType: Constants.ACTION_LOAD_RANDOM_USER_OK,
                payload: payload,
            });
        }, function(err) {
            AppDispatcher.dispatch({
                actionType: Constants.ACTION_INIT_FAIL,
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
