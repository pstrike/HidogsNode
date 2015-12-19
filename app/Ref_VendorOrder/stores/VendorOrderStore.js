var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');

var AppDispatcher = require('../../Common/dispatcher/AppDispatcher');

var VendorOrderConstants = require('../constants/VendorOrderConstants');

var CHANGE_EVENT = 'change';

// Store State
var _orderList = {};
var _order = {};
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



// Check Order - Start
function viewCheckOrder(order) {
    _order = order;
    _status = VendorOrderConstants.VENDOR_ORDER_STORE_STATE_CHECK;

    VendorOrderStore.emitChange();
}

function onCheckOrder() {
    _status = VendorOrderConstants.VENDOR_ORDER_STORE_STATE_CHECK_IN_PROGRESS;

    VendorOrderStore.emitChange();
}

function onCheckOrderSuccess(result) {
    if(result == "success") {
        _status = VendorOrderConstants.VENDOR_ORDER_STORE_STATE_CHECK_SUCCESS;
    }
    else if (result == "fail") {
        _status = VendorOrderConstants.VENDOR_ORDER_STORE_STATE_CHECK_FAIL;
    }

    VendorOrderStore.emitChange();
}

function onCheckOrderFail() {
    _status = VendorOrderConstants.VENDOR_ORDER_STORE_STATE_ERROR;

    VendorOrderStore.emitChange();
}

function onCheckUpdateOrderSuccess(order) {
    for(i in _orderList) {
        if(_orderList[i]._id == order._id) {
            var orderKeys = Object.keys(order);

            for(j in orderKeys) {
                _orderList[i][orderKeys[j]] = order[orderKeys[j]];
            }

            break;
        }
    }
    _status = VendorOrderConstants.VENDOR_ORDER_STORE_STATE_CHECK_UPDATE_SUCCESS;
    VendorOrderStore.emitChange();
}

function onCheckUpdateOrderFail() {
    _status = VendorOrderConstants.VENDOR_ORDER_STORE_STATE_ERROR;

    VendorOrderStore.emitChange();
}
// Check Order - End


var VendorOrderStore = assign({}, EventEmitter.prototype, {
    getOrderList: function() {
        return _orderList;
    },

    getOrder: function() {
        return _order;
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


        // Check Order - Start
        case VendorOrderConstants.HIDOGS_VENDOR_ORDER_VIEW_CHECK_ORDER:
            var order = action.order;
            viewCheckOrder(order);
            break;

        case VendorOrderConstants.HIDOGS_VENDOR_ORDER_CHECK_ORDER:
            onCheckOrder();
            break;

        case VendorOrderConstants.HIDOGS_VENDOR_ORDER_CHECK_ORDER_SUCCESS:
            var result = action.payload.response;
            onCheckOrderSuccess(result);
            break;

        case VendorOrderConstants.HIDOGS_VENDOR_ORDER_CHECK_ORDER_FAIL:
            onCheckOrderFail();
            break;

        case VendorOrderConstants.HIDOGS_VENDOR_ORDER_CHECK_UPDATE_ORDER_SUCCESSFUL:
            var order = JSON.parse(action.payload.response);
            onCheckUpdateOrderSuccess(order);
            break;

        case VendorOrderConstants.HIDOGS_VENDOR_ORDER_CHECK_UPDATE_ORDER_FAIL:
            onCheckUpdateOrderFail();
            break;
        // Check Order - End

        default:
        // no op
    }
});

module.exports = VendorOrderStore;