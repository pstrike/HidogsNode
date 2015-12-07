var AppDispatcher = require('../../Common/dispatcher/AppDispatcher');
var HidogsConstants = require('../../Common/constants/HidogsConstants');
var Constants = require('../constants/Constants');
var RC = require('../remotecall/RC');

var Actions = {

    loadSessionThenUser: function() {
        RC.getSession().then(function (payload) {
            var session = JSON.parse(payload.response);

            AppDispatcher.dispatch({
                actionType: Constants.ACTION_LOAD_SESSION_SUCCESSFUL,
                session: session,
            });

            return RC.getUser(session.user_id);
        }).then(function (payload) {
            AppDispatcher.dispatch({
                actionType: Constants.ACTION_LOAD_USER_SUCCESSFUL,
                payload: payload,
            });
        }, function (err) {
            AppDispatcher.dispatch({
                actionType: Constants.ACTION_LOAD_SESSION_FAIL,
            });
        });
    },

    submit: function(user, order) {
        RC.updateUser(user).then(function (payload) {
            AppDispatcher.dispatch({
                actionType: Constants.ACTION_UPDATE_USER_SUCCESSFUL,
                payload: payload,
            });

            return RC.updateOrder(order);
        }).then(function (payload) {
            AppDispatcher.dispatch({
                actionType: Constants.ACTION_UPDATE_ORDER_SUCCESSFUL,
                payload: payload,
            });
        }, function (err) {
            AppDispatcher.dispatch({
                actionType: Constants.ACTION_UPDATE_USER_FAIL,
            });
        });
    },

    verify: function(msg) {
        AppDispatcher.dispatch({
            actionType: Constants.ACTION_SHOW_VERIFY_MSG,
            msg: msg,
        });
    },
};

module.exports = Actions;
