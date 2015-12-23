var AppDispatcher = require('../../Common/dispatcher/AppDispatcher');
var HidogsConstants = require('../../Common/constants/HidogsConstants');
var Constants = require('../constants/Constants');
var RC = require('../remotecall/RC');

var Actions = {

    getCouponList: function() {
        RC.getCouponListPromise().then(function (payload) {
            AppDispatcher.dispatch({
                actionType: Constants.ACTION_GET_COUPON_LIST_SUCCESS,
                payload: payload
            });
        }, function (err) {
            AppDispatcher.dispatch({
                actionType: Constants.ACTION_GET_COUPON_LIST_FAIL
            });
        });
    },

    loadUserVendorProduct: function() {
        RC.getUserListPromise().then(function (payload) {
            AppDispatcher.dispatch({
                actionType: Constants.ACTION_LOAD_USER_SUCCESSFUL,
                payload: payload,
            });

            return RC.getVendorListPromise();
        }).then(function (payload) {
            AppDispatcher.dispatch({
                actionType: Constants.ACTION_LOAD_VENDOR_SUCCESSFUL,
                payload: payload,
            });

            return RC.getProductListPromise();
        }).then(function (payload) {
            AppDispatcher.dispatch({
                actionType: Constants.ACTION_LOAD_PRODUCT_SUCCESSFUL,
                payload: payload,
            });
        }, function (err) {
            AppDispatcher.dispatch({
                actionType: Constants.ACTION_LOAD_USER_VENDOR_PRODUCT_FAIL
            });
        });
    },

    // List
    triggerNewFromList: function() {
        AppDispatcher.dispatch({
            actionType: Constants.ACITON_TRIGGER_NEW_FROM_LIST,
        });
    },

    triggerDetailFromList: function(id) {
        AppDispatcher.dispatch({
            actionType: Constants.ACITON_TRIGGER_DETAIL_FROM_LIST,
            couponId: id,
        });
    },

    // New
    triggerListFromNew: function() {
        AppDispatcher.dispatch({
            actionType: Constants.ACITON_TRIGGER_LIST_FROM_NEW,
        });
    },

    triggerDetailFromNew: function(coupon) {
        AppDispatcher.dispatch({
            actionType: Constants.ACITON_TRIGGER_DETAIL_FROM_NEW,
            coupon: coupon,
        });

        RC.insertCoupon(coupon).then(function (payload) {
            AppDispatcher.dispatch({
                actionType: Constants.ACTION_SUBMIT_NEW_SUCCESSFUL,
                payload: payload,
            });
        }, function (err) {
            AppDispatcher.dispatch({
                actionType: Constants.ACTION_SUBMIT_NEW_FAIL
            });
        });
    },

    // Detail
    triggerListFromDetail: function() {
        AppDispatcher.dispatch({
            actionType: Constants.ACITON_TRIGGER_LIST_FROM_DETAIL,
        });
    },

    triggerEditFromDetail: function() {
        AppDispatcher.dispatch({
            actionType: Constants.ACITON_TRIGGER_EDIT_FROM_DETAIL,
        });
    },

    // Edit
    triggerDetaiSubmitFromEdit: function(coupon) {
        AppDispatcher.dispatch({
            actionType: Constants.ACITON_TRIGGER_DETAIL_SUBMIT_FROM_EDIT,
            coupon: coupon,
        });

        RC.updateCoupon(coupon).then(function (payload) {
            AppDispatcher.dispatch({
                actionType: Constants.ACTION_SUBMIT_UPDATE_SUCCESSFUL,
                payload: payload,
            });
        }, function (err) {
            AppDispatcher.dispatch({
                actionType: Constants.ACTION_SUBMIT_UPDATE_FAIL
            });
        });
    },

    triggerDetailCancelFromEdit: function() {
        AppDispatcher.dispatch({
            actionType: Constants.ACITON_TRIGGER_DETAIL_CANCEL_FROM_EDIT,
        });
    },

    // Verify Msg
    verify: function(msg) {
        AppDispatcher.dispatch({
            actionType: Constants.ACTION_VERIFY,
            msg: msg,
        });
    },

};

module.exports = Actions;
