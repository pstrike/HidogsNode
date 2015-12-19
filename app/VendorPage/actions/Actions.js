var AppDispatcher = require('../../Common/dispatcher/AppDispatcher');
var HidogsConstants = require('../../Common/constants/HidogsConstants');
var Constants = require('../constants/Constants');
var RC = require('../remotecall/RC');

var Actions = {

    init: function(vendorId) {
        RC.getVendor(vendorId).then(function (payload) {
            AppDispatcher.dispatch({
                actionType: Constants.INIT_LOAD_VENDOR_SUCCESSFUL,
                payload: payload,
            });

            return RC.getProductList(vendorId);
        }).then(function (payload) {
            AppDispatcher.dispatch({
                actionType: Constants.INIT_LOAD_PRODUCT_LIST_SUCCESSFUL,
                payload: payload,
            });
        }, function (err) {
            AppDispatcher.dispatch({
                actionType: Constants.INIT_FAIL,
            });
        });
    },

};

module.exports = Actions;
