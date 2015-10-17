var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var AppDispatcher = require('../../Common/dispatcher/AppDispatcher');
var Constants = require('../constants/Constants');
var CHANGE_EVENT = 'change';

// Store State
var _product = {};
var _availability = {};
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

function payOrderFail() {
    alert("payment fail");
};

function getProductSuccess(payload) {
    _product = payload;

    Store.emitChange();
};

function getProductFail() {
    alert("get product fail");
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
        case Constants.PAY_ORDER_SUCCESS:
            var payload = action.payload.response;
            payOrderSuccess(payload);
            break;

        case Constants.PAY_ORDER_FAIL:
            payOrderFail();
            break;

        case Constants.GET_PRODUCT_SUCCESS:
            var payload = JSON.parse(action.payload.response);
            getProductSuccess(payload);
            break;

        case Constants.GET_PRODUCT_FAIL:
            getProductFail();
            break;

        default:
        // no op
    }
});

module.exports = Store;