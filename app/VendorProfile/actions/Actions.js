var AppDispatcher = require('../../Common/dispatcher/AppDispatcher');
var HidogsConstants = require('../../Common/constants/HidogsConstants');
var Constants = require('../constants/Constants');
var RC = require('../remotecall/RC');

var Actions = {

    // Order List - Start
    vendorOrderViewOrderList: function() {
        AppDispatcher.dispatch({
            actionType: Constants.HIDOGS_VENDOR_ORDER_VIEW_ORDER_LIST
        });
    },

    vendorOrderGetOrderList: function() {
        AppDispatcher.dispatch({
            actionType: Constants.HIDOGS_VENDOR_ORDER_GET_ORDER_LIST
        });

        RC.getOrderList(function(payload){
            if(payload.response == HidogsConstants.WEB_UTILS_REQUEST_TIMEOUT
                || payload.response == HidogsConstants.WEB_UTILS_REQUEST_NOT_FOUND
                || payload.response == HidogsConstants.WEB_UTILS_REQUEST_ERROR) {

                AppDispatcher.dispatch({
                    actionType: Constants.HIDOGS_VENDOR_ORDER_GET_ORDER_LIST_FAIL
                });
            }
            else {
                AppDispatcher.dispatch({
                    actionType: Constants.HIDOGS_VENDOR_ORDER_GET_ORDER_LIST_SUCCESS,
                    payload: payload
                });
            }
        });
    },
    // Order List - End
};

module.exports = Actions;
