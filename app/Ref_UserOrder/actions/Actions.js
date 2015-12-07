var AppDispatcher = require('../../Common/dispatcher/AppDispatcher');
var HidogsConstants = require('../../Common/constants/HidogsConstants');
var Constants = require('../constants/Constants');
var VendorOrderRC = require('../remotecall/RC');

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

        VendorOrderRC.getOrderListPromise().then(function (payload) {
            AppDispatcher.dispatch({
                actionType: Constants.HIDOGS_VENDOR_ORDER_GET_ORDER_LIST_SUCCESS,
                payload: payload
            });
        }, function (err) {
            AppDispatcher.dispatch({
                actionType: Constants.HIDOGS_VENDOR_ORDER_GET_ORDER_LIST_FAIL
            });
        });
    },

    payOrder: function(order) {
        VendorOrderRC.payOrderPromise(order).then(function (payload) {
            AppDispatcher.dispatch({
                actionType: Constants.PAY_ORDER_SUCCESS,
                payload: payload
            });
        }, function (err) {
            AppDispatcher.dispatch({
                actionType: Constants.PAY_ORDER_FAIL
            });
        });
    },
    // Order List - End

};

module.exports = Actions;
