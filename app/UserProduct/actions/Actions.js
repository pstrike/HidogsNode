var AppDispatcher = require('../../Common/dispatcher/AppDispatcher');
var HidogsConstants = require('../../Common/constants/HidogsConstants');
var Constants = require('../constants/Constants');
var RC = require('../remotecall/RC');

var Actions = {

    // Product
    triggerProductToComment: function() {
        AppDispatcher.dispatch({
            actionType: Constants.ACTION_PRODUCT_TO_COMMENT,
        });
    },

    triggerProductToAvailability: function() {
        AppDispatcher.dispatch({
            actionType: Constants.ACTION_PRODUCT_TO_AVAILABILITY,
        });
    },

    triggerProductToOrderCreation: function() {
        AppDispatcher.dispatch({
            actionType: Constants.ACTION_PRODUCT_TO_ORDER_CREATION,
        });
    },

    triggerProductToVendor: function() {
        AppDispatcher.dispatch({
            actionType: Constants.ACTION_PRODUCT_TO_VENDOR,
        });
    },

    triggerProductToExitPolicy: function() {
        AppDispatcher.dispatch({
            actionType: Constants.ACTION_PRODUCT_TO_EXIT_POLICY,
        });
    },

    getProductThenVendorThenMeta: function(productId) {
        RC.getProductPromise(productId).then(function (payload) { // load product
            var product = JSON.parse(payload.response);

            AppDispatcher.dispatch({
                actionType: Constants.ACTION_PRODUCT_LOAD_PRODUCT_SUCCESSFUL,
                product: product,
            });

            return RC.getVendorPromise(product.vendor.vendor_id);
        }).then(function (payload) { // load vendor
            AppDispatcher.dispatch({
                actionType: Constants.ACTION_PRODUCT_LOAD_VENDOR_SUCCESSFUL,
                payload: payload,
            });

            return RC.getProductMeta();
        }).then(function (payload) { // load product meta
            AppDispatcher.dispatch({
                actionType: Constants.ACTION_PRODUCT_LOAD_META_SUCCESSFUL,
                payload: payload,
            });
        }, function (err) {
            AppDispatcher.dispatch({
                actionType: Constants.ACTION_PRODUCT_LOAD_PRODUCT_FAIL,
            });
        });
    },

    // Comment
    triggerCommentToProduct: function() {
        AppDispatcher.dispatch({
            actionType: Constants.ACTION_COMMENT_TO_PRODUCT,
        });
    },

    // Availability
    triggerAvailabilityToProduct: function() {
        AppDispatcher.dispatch({
            actionType: Constants.ACTION_AVAILABILITY_TO_PRODUCT
        });
    },

    // Order Creation
    triggerOrderCreationToOrderConfirmation: function() {
        AppDispatcher.dispatch({
            actionType: Constants.ACTION_ORDER_CREATION_TO_ORDER_CONFIRMATION
        });
    },

    getUserDetail: function() {

    },

    triggerOrderCreationToProduct: function() {
        AppDispatcher.dispatch({
            actionType: Constants.ACTION_ORDER_CREATION_TO_PRODUCT,
        });
    },

    createOrder: function(order) {
        RC.insertOrderPromise(order).then(function(response) {
            order["_id"]=JSON.parse(response.response)._id;
            return RC.payOrderPromise(order);
        }, function(err) {
            AppDispatcher.dispatch({
                actionType: Constants.ACTION_ORDER_CREATION_PAY_FAIL
            });
        }).then(function(payload) {
            AppDispatcher.dispatch({
                actionType: Constants.ACTION_ORDER_CREATION_PAY_SUCCESSFUL,
                payload: payload
            });
        }, function(err) {
            AppDispatcher.dispatch({
                actionType: Constants.ACTION_ORDER_CREATION_PAY_FAIL
            });
        });
    },

    // Order Confirmation
    triggerOrderConfirmationToProduct: function() {
        AppDispatcher.dispatch({
            actionType: Constants.ACTION_ORDER_CONFIRMATION_TO_PRODUCT,
        });
    },

    // Exit Policy
    triggerExitPolicyToProduct: function() {
        AppDispatcher.dispatch({
            actionType: Constants.ACTION_EXIT_POLICY_TO_PRODUCT,
        });
    },
};

module.exports = Actions;
