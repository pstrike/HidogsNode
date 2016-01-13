var AppDispatcher = require('../../../app/Common/dispatcher/AppDispatcher');
var HidogsConstants = require('../../../app/Common/constants/HidogsConstants');
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

        RC.getObject().then(function (payload) {
            AppDispatcher.dispatch({
                actionType: Constants.ACTION_VENDOR_PRODUCT_DETAIL_LOAD_DETAIL_SUCCESSFUL,
                payload: payload,
            });
        }, function (err) {
            AppDispatcher.dispatch({
                actionType: Constants.ACTION_VENDOR_PRODUCT_DETAIL_LOAD_DETAIL_FAIL,
            });
        });
    },
    // Order List - End
};

module.exports = Actions;
