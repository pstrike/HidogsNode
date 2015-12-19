var AppDispatcher = require('../../Common/dispatcher/AppDispatcher');
var HidogsConstants = require('../../Common/constants/HidogsConstants');
var Constants = require('../constants/Constants');
var RC = require('../remotecall/RC');

var Actions = {

    // Order
    payOrder: function(order, openid) {
        var isAvailable = false;

        RC.checkAvailability(order).then(function(payload) {

            var result = JSON.parse(payload.response);

            if(result.length == 0) {
                isAvailable = true;

                return RC.insertOrder(order);
            }
            else {
                AppDispatcher.dispatch({
                    actionType: Constants.ACTION_SHOW_TIMESLOT_UNAVAILABLE,
                });
            }
        }).then(function (payload) {
            if(isAvailable) {
                AppDispatcher.dispatch({
                    actionType: Constants.ACTION_CREATE_ORDER_SUCCESSFUL,
                    payload: payload,
                    order: order,
                });

                return RC.payOrder(order, openid);
            }

        }).then(function (payload) {
            if(isAvailable) {
                AppDispatcher.dispatch({
                    actionType: Constants.ACTION_PAYMENT_SUCCESSFUL,
                    payload: payload,
                });
            }
        }, function (err) {
            AppDispatcher.dispatch({
                actionType: Constants.ACTION_CREATE_ORDER_FAIL,
            });
        });
    },

    loadSessionThenProductThenAvailability: function(productId) {
        RC.getSession().then(function (payload) {
            AppDispatcher.dispatch({
                actionType: Constants.ACTION_LOAD_SESSION_SUCCESSFUL,
                payload: payload,
            });

            return RC.getProduct(productId);
        }).then(function (payload) {
            AppDispatcher.dispatch({
                actionType: Constants.ACTION_LOAD_PRODUCT_SUCCESSFUL,
                payload: payload,
            });

            return RC.getVendorAvailabilityByProduct(productId);
        }).then(function (payload) {
            AppDispatcher.dispatch({
                actionType: Constants.ACTION_LOAD_AVAILABILITY_SUCCESSFUL,
                payload: payload,
            });
        }, function (err) {
            AppDispatcher.dispatch({
                actionType: Constants.ACTION_LOAD_SESSION_FAIL,
            });
        });
    },

    verifyOrder: function(msg) {
        AppDispatcher.dispatch({
            actionType: Constants.ACTION_SHOW_VERIFY_MSG,
            msg: msg,
        });
    },

    cancel: function() {
        AppDispatcher.dispatch({
            actionType: Constants.ACTION_CANCEL,
        });
    },

    sendWXNotice: function(object, callback) {
        RC.sendWXNotice(object).then(function (payload) {
            //alert("send notice ok");
            callback();
        }, function (err) {
            //alert("send notice fail");
            callback();
        });
    }
};

module.exports = Actions;
