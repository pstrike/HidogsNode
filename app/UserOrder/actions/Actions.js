var AppDispatcher = require('../../Common/dispatcher/AppDispatcher');
var HidogsConstants = require('../../Common/constants/HidogsConstants');
var Constants = require('../constants/Constants');
var RC = require('../remotecall/RC');

var Actions = {

    // Init
    getSessionThenOrderList: function() {
        var userId;

        RC.getSession().then(function (payload) { // load session
            var response = JSON.parse(payload.response);

            userId = response.user_id;

            AppDispatcher.dispatch({
                actionType: Constants.INIT_LOAD_SESSION,
                response: response,
            });

            return RC.getOrderList(userId);
        }).then(function(payload) { // load product list
            AppDispatcher.dispatch({
                actionType: Constants.INIT_LOAD_ORDER_LIST,
                payload: payload,
            });
        }, function(err) {
            AppDispatcher.dispatch({
                actionType: Constants.INIT_FAIL,
            });
        });
    },

    // List
    filterList: function(filter) {
        AppDispatcher.dispatch({
            actionType: Constants.LIST_FILTER,
            filter: filter,
        });
    },

    triggerOrderDetail: function(order) {
        AppDispatcher.dispatch({
            actionType: Constants.LIST_TRIGGER_ORDER_DETAIL,
            order: order,
        });

        RC.getOrder(order.order_id).then(function (payload) { // load session
            AppDispatcher.dispatch({
                actionType: Constants.DETAIL_LOAD_ORDER_DETAIL_SUCCESSFUL,
                payload: payload,
            });

            return RC.getProduct(order.product.product_id);
        }).then(function (payload) { // load session
            AppDispatcher.dispatch({
                actionType: Constants.DETAIL_LOAD_PRODUCT_SUCCESSFUL,
                payload: payload,
            });

            return RC.getVendor(order.vendor.vendor_id);
        }).then(function (payload) { // load session
            AppDispatcher.dispatch({
                actionType: Constants.DETAIL_LOAD_VENDOR_SUCCESFUL,
                payload: payload,
            });
        }, function(err) {
            AppDispatcher.dispatch({
                actionType: Constants.DETAIL_LOAD_ORDER_DETAIL_FAIL,
            });
        });
    },

    // Detail
    triggerOrderList: function() {
        AppDispatcher.dispatch({
            actionType: Constants.DETAIL_TRIGGER_ORDER_LIST,
        });
    },

    payOrder: function(order, openid) {
        var isAvailable = false;

        RC.checkAvailability(order).then(function(payload) {

            var result = JSON.parse(payload.response);

            if(result.length == 0) {
                isAvailable = true;

                return RC.payOrder(order, openid);
            }
            else {
                AppDispatcher.dispatch({
                    actionType: Constants.DETAIL_NO_AVAILABLE_TIMESLOT,
                });
            }
        }).then(function (payload) {
            if(isAvailable) {
                AppDispatcher.dispatch({
                    actionType: Constants.DETAIL_PAY_SUCCESSFUL,
                    payload: payload,
                });
            }
        }, function (err) {
            AppDispatcher.dispatch({
                actionType: Constants.DETAIL_PAY_FAIL,
            });
        });
    },

    rechedule: function() {
        AppDispatcher.dispatch({
            actionType: Constants.DETAIL_TRIGGER_ORDER_RESCHEDULE,
        });
    },

    comment: function() {
        AppDispatcher.dispatch({
            actionType: Constants.DETAIL_TRIGGER_ORDER_COMMENT,
        });
    },

    cancelOrder: function(order) {
        AppDispatcher.dispatch({
            actionType: Constants.DETAIL_CANCEL_ORDER,
            order: order,
        });

        RC.updateOrder(order).then(function (payload) {
            AppDispatcher.dispatch({
                actionType: Constants.DETAIL_CANCEL_ORDER_SUBMIT_SUCCSSFUL,
                payload: payload,
            });
        }, function(err) {
            AppDispatcher.dispatch({
                actionType: Constants.DETAIL_CANCEL_ORDER_SUBMIT_FAIL,
            });
        });
    },

    refundOrder: function() {
        AppDispatcher.dispatch({
            actionType: Constants.DETAIL_REFUND_ORDER,
        });
    },

    // Reschedule
    getProductAvailability: function(productId) {
        RC.getVendorAvailabilityByProduct(productId).then(function (payload) { // load session
            AppDispatcher.dispatch({
                actionType: Constants.RESCHEDULE_LOAD_AVAILABILITY_SUCCESSFUL,
                payload: payload,
            });
        }, function(err) {
            AppDispatcher.dispatch({
                actionType: Constants.RESCHEDULE_LOAD_AVAILABILITY_FAIL,
            });
        });
    },

    submitRescheduleTriggerDetail: function(order) {
        AppDispatcher.dispatch({
            actionType: Constants.RESCHEDULE_SUBMIT_TRIGGER_DETAIL,
            order: order,
        });

        RC.updateOrder(order).then(function (payload) {
            AppDispatcher.dispatch({
                actionType: Constants.RESCHEDULE_SUBMIT_SUCCESSFUL,
                payload: payload,
            });
        }, function(err) {
            AppDispatcher.dispatch({
                actionType: Constants.RESCHEDULE_SUBMIT_FAIL,
            });
        });
    },

    cancelRescheduleTriggerDetail: function() {
        AppDispatcher.dispatch({
            actionType: Constants.RESCHEDULE_CANCEL_TRIGGER_DETAIL,
        });
    },

    // Comment
    submitCommentTriggerDetail: function(product, order) {
        AppDispatcher.dispatch({
            actionType: Constants.COMMENT_SUBMIT_TRIGGER_DETAIL,
            product: product,
            order: order,
        });

        RC.updateProduct(product).then(function (payload) {
            AppDispatcher.dispatch({
                actionType: Constants.COMMENT_SUBMIT_PRODUCT_SUCCESSFUL,
                payload: payload,
            });

            RC.updateOrder(order);
        }).then(function (payload) {
            AppDispatcher.dispatch({
                actionType: Constants.COMMENT_SUBMIT_ORDER_SUCCESSFUL,
                payload: payload,
            });
        }, function(err) {
            AppDispatcher.dispatch({
                actionType: Constants.COMMENT_SUBMIT_FAIL,
            });
        });
    },

    cancelCommentTriggerDetail: function() {
        AppDispatcher.dispatch({
            actionType: Constants.COMMENT_CANCEL_TRIGGER_DETAIL,
        });
    },

    // Refund
    submitRefundOrder: function(order) {
        AppDispatcher.dispatch({
            actionType: Constants.REFUND_SUBMIT_TRIGGER_DETAIL,
            order: order,
        });

        RC.updateOrder(order).then(function (payload) {
            AppDispatcher.dispatch({
                actionType: Constants.REFUND_SUBMIT_SUCCESSFUL,
                payload: payload,
            });
        }, function(err) {
            AppDispatcher.dispatch({
                actionType: Constants.REFUND_SUBMIT_FAIL,
            });
        });
    },

    cancelRefundOrder: function() {
        AppDispatcher.dispatch({
            actionType: Constants.REFUND_CANCEL_TRIGGER_DETAIL,
        });
    },

    refundLoadUser: function(userId) {
        RC.getUser(userId).then(function (payload) {
            AppDispatcher.dispatch({
                actionType: Constants.REFUND_LOAD_USER_SUCCESSFUL,
                payload: payload,
            });
        }, function(err) {
            AppDispatcher.dispatch({
                actionType: Constants.REFUND_LOAD_USER_FAIL,
            });
        });
    },

    // Verify Msg
    verify: function(msg) {
        AppDispatcher.dispatch({
            actionType: Constants.VERIFY_ACTION,
            msg: msg,
        });
    },

};

module.exports = Actions;
