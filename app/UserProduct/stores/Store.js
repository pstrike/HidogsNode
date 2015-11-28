var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var AppDispatcher = require('../../Common/dispatcher/AppDispatcher');
var Constants = require('../constants/Constants');
var CHANGE_EVENT = 'change';

// Store State
var _product = {};
var _availability = {};
var _vendor = {};
var _productMeta = [];
var _status = "";

// Store actions
function payOrderSuccess(charge) {
    pingpp.createPayment(charge, function(result, error){
        if (result == "success") {
            // 只有微信公众账号 wx_pub 支付成功的结果会在这里返回，其他的 wap 支付结果都是在 extra 中对应的 URL 跳转。
        } else if (result == "fail") {
            // charge 不正确或者微信公众账号支付失败时会在此处返回
        } else if (result == "cancel") {
            // 微信公众账号支付取消支付
        }
    });
};



// Product
function getProductSuccess(product) {
    _product = product;

    //console.log("get product");
    //console.log(_product);

    Store.emitChange();
};

function getVendorSuccess(vendor) {
    _vendor = vendor;

    //console.log("get vendor");
    //console.log(_vendor);

    Store.emitChange();
};

function getMetaSuccess(meta) {
    _productMeta = meta;

    //console.log("get meta");
    //console.log(_productMeta);

    Store.emitChange();
};

function triggerProductToExitPolicy() {
    _status = Constants.STATE_EXIT_POLICY;

    Store.emitChange();
};


// Exit Policy
function triggerExitPolicyToProduct() {
    _status = Constants.STATE_PRODUCT;

    Store.emitChange();
};


// Err Handling
function err(msg) {
    console.log(msg);
    alert("好像出了点问题,请刷新页面重试一下.抱歉.");
};

// Store definition
var Store = assign({}, EventEmitter.prototype, {

    getProduct: function() {
        return _product;
    },

    getStatus: function() {
        return _status;
    },

    getAvailability: function() {
        return _availability;
    },

    getVendor: function() {
        return _vendor;
    },

    getProductMeta: function() {
        return _productMeta;
    },

    emitChange: function() {
        this.emit(CHANGE_EVENT);
    },

    /**
     * @param {function} callback
     */
    addChangeListener: function(callback) {
        this.on(CHANGE_EVENT, callback);
    },

    /**
     * @param {function} callback
     */
    removeChangeListener: function(callback) {
        this.removeListener(CHANGE_EVENT, callback);
    }
});

// Handle dispatcher actions
AppDispatcher.register(function(action) {

    switch (action.actionType) {
        case Constants.ACTION_ORDER_CREATION_PAY_SUCCESSFUL:
            var payload = action.payload.response;
            payOrderSuccess(payload);
            break;

        // Product
        case Constants.ACTION_PRODUCT_LOAD_PRODUCT_SUCCESSFUL:
            var product = action.product;
            getProductSuccess(product);
            break;
        case Constants.ACTION_PRODUCT_LOAD_VENDOR_SUCCESSFUL:
            var vendor = JSON.parse(action.payload.response);
            getVendorSuccess(vendor);
            break;
        case Constants.ACTION_PRODUCT_LOAD_META_SUCCESSFUL:
            var meta = JSON.parse(action.payload.response);
            getMetaSuccess(meta);
            break;
        case Constants.ACTION_PRODUCT_TO_COMMENT:

            break;
        case Constants.ACTION_PRODUCT_TO_AVAILABILITY:

            break;
        case Constants.ACTION_PRODUCT_TO_ORDER_CREATION:

            break;
        case Constants.ACTION_PRODUCT_TO_VENDOR:

            break;
        case Constants.ACTION_PRODUCT_TO_EXIT_POLICY:
            triggerProductToExitPolicy();
            break;

        // Comment
        case Constants.ACTION_COMMENT_TO_PRODUCT:

            break;

        // Availability
        case Constants.ACTION_AVAILABILITY_TO_PRODUCT:

            break;

        // Order Creation
        case Constants.ACTION_ORDER_CREATION_TO_ORDER_CONFIRMATION:

            break;
        case Constants.ACTION_ORDER_CREATION_TO_PRODUCT:

            break;

        // Order Confirmation
        case Constants.ACTION_ORDER_CONFIRMATION_TO_PRODUCT:

            break;

        // Exit Policy
        case Constants.ACTION_EXIT_POLICY_TO_PRODUCT:
            triggerExitPolicyToProduct();
            break;

        // Err Handlig
        case Constants.ACTION_PRODUCT_LOAD_PRODUCT_FAIL:
        case Constants.ACTION_PRODUCT_LOAD_VENDOR_FAIL:
        case Constants.ACTION_PRODUCT_LOAD_META_FAIL:
        case Constants.ACTION_COMMENT_LOAD_COMMENT_FAIL:
        case Constants.ACTION_AVAILABILITY_LOAD_FAIL:
        case Constants.ACTION_ORDER_CREATION_LOAD_USER_FAIL:
        case Constants.ACTION_ORDER_CREATION_PAY_FAIL:
        case Constants.ACTION_ORDER_CREATION_CREATE_FAIL:
            err(action.actionType);
            break;

        default:
            err("no action catch");
    }
});

module.exports = Store;