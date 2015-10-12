var AppDispatcher = require('../../Common/dispatcher/AppDispatcher');
var HidogsConstants = require('../../Common/constants/HidogsConstants');
var VendorOrderConstants = require('../constants/VendorOrderConstants');
var VendorOrderRC = require('../remotecall/VendorOrderRC');

var Actions = {

    // Order List - Start
    vendorOrderViewOrderList: function() {
        AppDispatcher.dispatch({
            actionType: VendorOrderConstants.HIDOGS_VENDOR_ORDER_VIEW_ORDER_LIST
        });
    },

    vendorOrderGetOrderList: function() {
        AppDispatcher.dispatch({
            actionType: VendorOrderConstants.HIDOGS_VENDOR_ORDER_GET_ORDER_LIST
        });

        VendorOrderRC.getOrderList(function(payload){
            if(payload.response == HidogsConstants.WEB_UTILS_REQUEST_TIMEOUT
                || payload.response == HidogsConstants.WEB_UTILS_REQUEST_NOT_FOUND
                || payload.response == HidogsConstants.WEB_UTILS_REQUEST_ERROR) {

                AppDispatcher.dispatch({
                    actionType: VendorOrderConstants.HIDOGS_VENDOR_ORDER_GET_ORDER_LIST_FAIL
                });
            }
            else {
                AppDispatcher.dispatch({
                    actionType: VendorOrderConstants.HIDOGS_VENDOR_ORDER_GET_ORDER_LIST_SUCCESS,
                    payload: payload
                });
            }
        });
    },
    // Order List - End



    // Check Order - Start
    vendorOrderViewCheckOrder: function(order) {
        AppDispatcher.dispatch({
            actionType: VendorOrderConstants.HIDOGS_VENDOR_ORDER_VIEW_CHECK_ORDER,
            order: order
        });
    },

    vendorOrderCheckOrder: function(order) {
        AppDispatcher.dispatch({
            actionType: VendorOrderConstants.HIDOGS_VENDOR_ORDER_CHECK_ORDER
        });

        VendorOrderRC.checkOrder(order, function(payload){
            if(payload.response == HidogsConstants.WEB_UTILS_REQUEST_TIMEOUT
                || payload.response == HidogsConstants.WEB_UTILS_REQUEST_NOT_FOUND
                || payload.response == HidogsConstants.WEB_UTILS_REQUEST_ERROR) {

                AppDispatcher.dispatch({
                    actionType: VendorOrderConstants.HIDOGS_VENDOR_ORDER_CHECK_ORDER_FAIL
                });
            }
            else {
                AppDispatcher.dispatch({
                    actionType: VendorOrderConstants.HIDOGS_VENDOR_ORDER_CHECK_ORDER_SUCCESS,
                    payload: payload
                });
            }
        });
    },
    // Check Order - End



    // Update Order - Start
    vendorOrderUpdateOrder: function(order) {
        VendorOrderRC.updateOrder(order, function(payload){
            if(payload.response == HidogsConstants.WEB_UTILS_REQUEST_TIMEOUT
                || payload.response == HidogsConstants.WEB_UTILS_REQUEST_NOT_FOUND
                || payload.response == HidogsConstants.WEB_UTILS_REQUEST_ERROR) {

                AppDispatcher.dispatch({
                    actionType: VendorOrderConstants.HIDOGS_VENDOR_ORDER_CHECK_UPDATE_ORDER_FAIL
                });
            }
            else {
                AppDispatcher.dispatch({
                    actionType: VendorOrderConstants.HIDOGS_VENDOR_ORDER_CHECK_UPDATE_ORDER_SUCCESSFUL,
                    payload: payload
                });

            }
        });
    },
    // Update Order - End
};

module.exports = Actions;
