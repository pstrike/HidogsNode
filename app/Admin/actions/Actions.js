var AppDispatcher = require('../../Common/dispatcher/AppDispatcher');
var HidogsConstants = require('../../Common/constants/HidogsConstants');
var Constants = require('../constants/Constants');
var RC = require('../remotecall/RC');

var Actions = {

    vendorGetVendor: function(id) {
        AppDispatcher.dispatch({
            actionType: Constants.ACTION_GET_VENDOR_SUCCESS_FAKE,
            id:id
        });

        RC.getVendorPromise(id).then(function (payload) {
            AppDispatcher.dispatch({
                actionType: Constants.ACTION_GET_VENDOR_SUCCESS,
                payload: payload
            });
        }, function (err) {
            AppDispatcher.dispatch({
                actionType: Constants.ACTION_GET_VENDOR_FAIL
            });
        });
    },

    getVendorList: function() {
        RC.getVendorListPromise().then(function (payload) {
            AppDispatcher.dispatch({
                actionType: Constants.ACTION_GET_VENDOR_LIST_SUCCESS,
                payload: payload
            });
        }, function (err) {
            AppDispatcher.dispatch({
                actionType: Constants.ACTION_GET_VENDOR_LIST_FAIL
            });
        });
    },

    vendorApproveVendor: function(vendor) {
        AppDispatcher.dispatch({
            actionType: Constants.ACTION_UPDATE_VENDOR_SUCCESS_FAKE,
            vendor:vendor
        });

        RC.updateVendor(vendor).then(function (payload) {
            AppDispatcher.dispatch({
                actionType: Constants.ACTION_UPDATE_VENDOR_SUCCESS,
                payload: payload,
            });

            if(vendor.status == 'approved') {
                var notice = {
                    type: "vendor",
                    vendor: vendor,
                    template: HidogsConstants.VENDOR_JOIN_SUCCESSFUL,
                };
            }
            else {
                var notice = {
                    type: "vendor",
                    vendor: vendor,
                    template: HidogsConstants.VENDOR_JOIN_REJECT,
                };
            }

            return RC.sendWXNotice(notice);
        }).then(function (payload) {
            // nothing
        }, function (err) {
            AppDispatcher.dispatch({
                actionType: Constants.ACTION_UPDATE_VENDOR_FAIL
            });
        });
    },
};

module.exports = Actions;
