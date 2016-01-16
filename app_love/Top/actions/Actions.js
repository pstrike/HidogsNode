var AppDispatcher = require('../../../app/Common/dispatcher/AppDispatcher');
var HidogsConstants = require('../../../app/Common/constants/HidogsConstants');
var HGSessionRC = require('../../../app/Common/remotecall/session');
var Constants = require('../constants/Constants');
var RC = require('../remotecall/RC');

var Actions = {

    // Init
    getSessionThenUser: function() {
        HGSessionRC.getSession().then(function (payload) {
            AppDispatcher.dispatch({
                actionType: HidogsConstants.HIDOGS_SESSION_LOAD_SUCCESSFUL,
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
