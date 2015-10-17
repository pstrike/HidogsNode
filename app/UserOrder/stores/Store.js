var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');

var AppDispatcher = require('../../Common/dispatcher/AppDispatcher');

var VendorOrderConstants = require('../constants/Constants');

var CHANGE_EVENT = 'change';

// Store State
var _orderList = {};
var _status = VendorOrderConstants.VENDOR_PRODUCT_STORE_STATE_LIST;

// Order List - Start
function viewOrderList() {
    _status = VendorOrderConstants.VENDOR_PRODUCT_STORE_STATE_LIST;

    VendorOrderStore.emitChange();
}

function onOrderLoad() {
    _status = VendorOrderConstants.VENDOR_PRODUCT_STORE_STATE_LIST_LOADING;

    VendorOrderStore.emitChange();
}

function onOrderLoadSuccess(orderList) {
    _orderList = orderList;
    _status = VendorOrderConstants.VENDOR_PRODUCT_STORE_STATE_LIST;

    VendorOrderStore.emitChange();
}

function onOrderLoadFail() {
    _orderList = {};
    _order = {};
    _status = VendorOrderConstants.VENDOR_ORDER_STORE_STATE_ERROR;

    VendorOrderStore.emitChange();
}
// Order List - End

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
}

function payOrderFail() {
    alert("payment fail");
}



var VendorOrderStore = assign({}, EventEmitter.prototype, {
    getOrderList: function() {
        return _orderList;
    },

    getStatus: function() {
        return _status;
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



AppDispatcher.register(function(action) {

    switch (action.actionType) {
        // Order List - Start
        case VendorOrderConstants.HIDOGS_VENDOR_ORDER_GET_ORDER_LIST:
            onOrderLoad();
            break;

        case VendorOrderConstants.HIDOGS_VENDOR_ORDER_GET_ORDER_LIST_SUCCESS:
            var orderList = JSON.parse(action.payload.response);
            onOrderLoadSuccess(orderList);
            break;

        case VendorOrderConstants.HIDOGS_VENDOR_ORDER_GET_ORDER_LIST_FAIL:
            onOrderLoadFail();
            break;

        case VendorOrderConstants.HIDOGS_VENDOR_ORDER_VIEW_ORDER_LIST:
            viewOrderList();
            break;
        // Order List - End

        // Pay Order - Begin
        case VendorOrderConstants.PAY_ORDER_SUCCESS:
            var payload = action.payload.response;
            payOrderSuccess(payload);
            break;

        case VendorOrderConstants.PAY_ORDER_FAIL:
            payOrderFail();
            break;

        // Pay Order - End

        default:
        // no op
    }
});

module.exports = VendorOrderStore;