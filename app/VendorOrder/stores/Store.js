var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var AppDispatcher = require('../../Common/dispatcher/AppDispatcher');
var HGConstants = require('../../Common/constants/HidogsConstants');

var Constants = require('../constants/Constants');
var CHANGE_EVENT = 'change';

// Store State
var _orderList = [];
var _orderListData = [];
var _order = {};
var _verifyMsg = [];
var _status = Constants.VENDOR_ORDER_LIST;

// Store actions

// Init
function loadOrderListSuccessful(orderList) {
    _orderListData = orderList;

    _orderListData.forEach(function(item) {
        if(item.status != 'tbpaid' && item.status != 'cancelled' && item.status != 'refund') {
            _orderList.push(item);
        }
    })

    Store.emitChange();
};

// List

function listTriggerDetail(order) {
    _order = order;
    _status = Constants.VENDOR_ORDER_DETAIL;

    Store.emitChange();
}

// Detail

function detailTriggerList() {
    _order = {};
    _status = Constants.VENDOR_ORDER_LIST;

    Store.emitChange();
}

function detailLoadOrder(order) {
    _order = order;

    Store.emitChange();
}

function detailLoadProduct(product) {
    _order.product = product;

    Store.emitChange();
}

function detailLoadUser(user) {
    _order.user = user;

    Store.emitChange();
}

function detailTriggerCode() {
    _status = Constants.VENDOR_ORDER_CODE;

    Store.emitChange();
}

function detailTriggerReject() {
    _status = Constants.VENDOR_ORDER_REJECT;

    Store.emitChange();
}

//function detailRejectOrder(order) {
//    _order.status = order.status;
//    for(var i=0; i< _orderList.length; i++) {
//        if(_orderList[i].order_id == _order.order_id) {
//            _orderList.splice(i,1);
//            break;
//        }
//    }
//
//    for(var i=0; i< _orderListData.length; i++) {
//        if(_orderListData[i].order_id == _order.order_id) {
//            _orderListData.splice(i,1);
//            break;
//        }
//    }
//    _status = Constants.VENDOR_ORDER_LIST;
//
//    Store.emitChange();
//}

function detailRejectOrderSuccessful() {
    // do nothing
}

// Code
function codeTriggerDetail() {
    _status = Constants.VENDOR_ORDER_DETAIL;

    Store.emitChange();
}

function codeSubmitSuccessful(order) {
    _order.status = order.status;
    for(var i=0; i< _orderList.length; i++) {
        if(_orderList[i].order_id == _order.order_id) {
            _orderList[i].status = order.status;
            break;
        }
    }

    for(var i=0; i< _orderListData.length; i++) {
        if(_orderListData[i].order_id == _order.order_id) {
            _orderListData[i].status = order.status;
            break;
        }
    }

    _status = Constants.VENDOR_ORDER_DETAIL;

    Store.emitChange();
}

function codeProductUpdateSuccessful(order, product) {
    //do nothing
}

// Reject
function rejectTriggerDetail() {
    _status = Constants.VENDOR_ORDER_DETAIL;

    Store.emitChange();
}

function rejectOrder(order) {
    _order.status = order.status;
    for(var i=0; i< _orderList.length; i++) {
        if(_orderList[i].order_id == _order.order_id) {
            _orderList.splice(i,1);
            break;
        }
    }

    for(var i=0; i< _orderListData.length; i++) {
        if(_orderListData[i].order_id == _order.order_id) {
            _orderListData.splice(i,1);
            break;
        }
    }
    _status = Constants.VENDOR_ORDER_LIST;

    Store.emitChange();
}

function rejectSuccessful(order) {
    // do nothing
}

// Verify Msg
function showVerifyMsg(msg) {
    _verifyMsg = msg;

    Store.emitChange();
};

// Err Handling
function err(msg) {
    console.log("[Err] "+msg);
    alert("好像出了点问题,请刷新页面重试一下.抱歉.");
};

// Store definition
var Store = assign({}, EventEmitter.prototype, {

    getOrderList: function() {
        return _orderList;
    },

    getOrder: function() {
        return _order;
    },

    getVerifyMsg: function() {
        return _verifyMsg;
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

// Handle dispatcher
AppDispatcher.register(function(action) {

    switch (action.actionType) {
        // Init
        case Constants.INIT_LOAD_ORDER_LIST:
            var orderList = JSON.parse(action.payload.response);

            loadOrderListSuccessful(orderList);
            break;

        // List
        case Constants.LIST_TRIGGER_DETAIL:
            listTriggerDetail(action.order);
            break;

        // Detail
        case Constants.DETAIL_LOAD_ORDER:
            detailLoadOrder(JSON.parse(action.payload.response));
            break;

        case Constants.DETAIL_LOAD_PRODUCT:
            detailLoadProduct(JSON.parse(action.payload.response));
            break;

        case Constants.DETAIL_LOAD_USER:
            detailLoadUser(JSON.parse(action.payload.response));
            break;

        case Constants.DETAIL_TRIGGER_LIST:
            detailTriggerList();
            break;

        case Constants.DETAIL_TRIGGER_CODE:
            detailTriggerCode();
            break;

        case Constants.DETAIL_TRIGGER_REJECT:
            detailTriggerReject();
            break;

        //case Constants.DETAIL_REJECT_ORDER:
        //    detailRejectOrder(action.order);
        //    break;
        //
        //case Constants.DETAIL_REJECT_ORDER_SUCCESSFUL:
        //    detailRejectOrderSuccessful();
        //    break;

        // Code
        case Constants.CODE_TRIGGER_DETAIL:
            codeTriggerDetail();
            break;

        case Constants.CODE_SUBMIT_SUCCESSFUL:
            codeSubmitSuccessful(action.order);
            break;

        case Constants.CODE_PRODUCT_UPDATE_SUCCESSFUL:
            codeProductUpdateSuccessful(action.order, action.product);
            break;

        // Reject
        case Constants.REJECT_TRIGGER_DETAIL:
            rejectTriggerDetail();
            break;

        case Constants.REJECT_ORDER:
            rejectOrder(action.order);
            break;

        case Constants.REJECT_ORDER_SUCCESSFUL:
            rejectSuccessful(action.order);
            break;

        // HG Actions
        case HGConstants.HIDOGS_SESSION_LOAD_SUCCESSFUL:
            // do nothing
            break;

        // Verify Msg
        case Constants.VERIFY_ACTION:
            var msg = action.msg;
            showVerifyMsg(msg);
            break;

        // Err
        case Constants.INIT_LOAD_FAIL:
        case Constants.CODE_SUBMIT_FAIL:
        //case Constants.DETAIL_REJECT_ORDER_FAIL:
        case Constants.REJECT_ORDER_FAIL:
            err(action.actionType);
            break;

        default:
            err("no action catch");
    }
});

module.exports = Store;