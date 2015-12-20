var AppDispatcher = require('../../Common/dispatcher/AppDispatcher');
var HidogsConstants = require('../../Common/constants/HidogsConstants');
var Constants = require('../constants/Constants');
var RC = require('../remotecall/RC');

var Actions = {

    getOrderList: function() {
        RC.getOrderListPromise().then(function (payload) {
            AppDispatcher.dispatch({
                actionType: Constants.ACTION_GET_ORDER_LIST_SUCCESS,
                payload: payload
            });
        }, function (err) {
            AppDispatcher.dispatch({
                actionType: Constants.ACTION_GET_ORDER_LIST_FAIL
            });
        });
    },

};

module.exports = Actions;