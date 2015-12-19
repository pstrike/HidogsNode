var AppDispatcher = require('../../Common/dispatcher/AppDispatcher');

var HidogsConstants = require('../../Common/constants/HidogsConstants');
var HGRC = require('../../Common/remotecall/session');

var Constants = require('../constants/Constants');
var RC = require('../remotecall/RC');

var Actions = {

    // Init
    getSessionThenOrderList: function() {
        var vendorId;

        HGRC.getSession().then(function (payload) {
            var response = JSON.parse(payload.response);

            vendorId = response.vendor_id;

            AppDispatcher.dispatch({
                actionType: HidogsConstants.HIDOGS_SESSION_LOAD_SUCCESSFUL,
                payload: payload,
            });

            return RC.getOrderList(vendorId);
        }).then(function (payload) {
            AppDispatcher.dispatch({
                actionType: Constants.INIT_LOAD_ORDER_LIST,
                payload: payload,
            });
        }, function(err) {
            AppDispatcher.dispatch({
                actionType: Constants.INIT_LOAD_FAIL,
            });
        });
    },

    // List
    listTriggerOrderDetail: function(order) {
        AppDispatcher.dispatch({
            actionType: Constants.LIST_TRIGGER_DETAIL,
            order: order,
        });

        RC.getOrder(order.order_id).then(function (payload) {
            AppDispatcher.dispatch({
                actionType: Constants.DETAIL_LOAD_ORDER,
                payload: payload,
            });

            return RC.getProduct(order.product.product_id);
        }).then(function (payload) {
            AppDispatcher.dispatch({
                actionType: Constants.DETAIL_LOAD_PRODUCT,
                payload: payload,
            });

            return RC.getUser(order.user.user_id);
        }).then(function (payload) {
            AppDispatcher.dispatch({
                actionType: Constants.DETAIL_LOAD_USER,
                payload: payload,
            });
        }, function(err) {
            AppDispatcher.dispatch({
                actionType: Constants.DETAIL_LOAD_ORDER_DETAIL_FAIL,
            });
        });

    },

    // Detail
    detailTriggerOrderList: function() {
        AppDispatcher.dispatch({
            actionType: Constants.DETAIL_TRIGGER_LIST,
        });

    },

    detailTriggerCode: function() {
        AppDispatcher.dispatch({
            actionType: Constants.DETAIL_TRIGGER_CODE,
        });

    },

    detailTriggerReject: function() {
        AppDispatcher.dispatch({
            actionType: Constants.DETAIL_TRIGGER_REJECT,
        });

    },

    //detailRejectOrder: function(order) {
    //    AppDispatcher.dispatch({
    //        actionType: Constants.DETAIL_REJECT_ORDER,
    //        order: order,
    //    });
    //
    //    RC.updateOrder(order).then(function () {
    //        AppDispatcher.dispatch({
    //            actionType: Constants.DETAIL_REJECT_ORDER_SUCCESSFUL,
    //        });
    //
    //        var notice = {
    //            type: "user",
    //            order: order,
    //            template: HidogsConstants.USER_REJECTED_REFUND,
    //        };
    //
    //        return RC.sendWXNotice(notice);
    //    }).then(function () {
    //        // nothing
    //    }, function(err) {
    //        AppDispatcher.dispatch({
    //            actionType: Constants.DETAIL_REJECT_ORDER_FAIL,
    //        });
    //    });
    //},

    // Code
    codeTriggerDetail: function() {
        AppDispatcher.dispatch({
            actionType: Constants.CODE_TRIGGER_DETAIL,
        });

    },

    codeSubmit: function(order, product) {
        var plainOrder = {
            order_id: order.order_id,
            status: order.status,
        };

        RC.updateOrder(plainOrder).then(function (payload) {
            AppDispatcher.dispatch({
                actionType: Constants.CODE_SUBMIT_SUCCESSFUL,
                order: plainOrder,
            });

            RC.updateProduct(product);
        }).then(function (payload) {
            AppDispatcher.dispatch({
                actionType: Constants.CODE_PRODUCT_UPDATE_SUCCESSFUL,
                order: plainOrder,
                product: product,
            });

            var notice = {
                type: "user",
                order: order,
                template: HidogsConstants.USER_TBCOMMENTED,
            };
            return RC.sendWXNotice(notice);
        }).then(function (payload) {
            // do nothing
        }, function(err) {
            AppDispatcher.dispatch({
                actionType: Constants.CODE_SUBMIT_FAIL,
            });
        });

    },

    // Reject
    rejectTriggerDetail: function() {
        AppDispatcher.dispatch({
            actionType: Constants.REJECT_TRIGGER_DETAIL,
        });

    },

    rejectSubmit: function(order) {
        var plainOrder = {
            order_id: order.order_id,
            status: order.status,
            reject_reason: order.reject_reason,
        };

        AppDispatcher.dispatch({
            actionType: Constants.REJECT_ORDER,
            order: plainOrder,
        });

        RC.updateOrder(plainOrder).then(function () {
            AppDispatcher.dispatch({
                actionType: Constants.REJECT_ORDER_SUCCESSFUL,
                order: plainOrder,
            });

            var notice = {
                type: "user",
                order: order,
                template: HidogsConstants.USER_REJECTED_REFUND,
            };

            return RC.sendWXNotice(notice);
        }).then(function () {
            // nothing
        }, function(err) {
            AppDispatcher.dispatch({
                actionType: Constants.REJECT_ORDER_FAIL,
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
