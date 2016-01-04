var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var AppDispatcher = require('../../Common/dispatcher/AppDispatcher');
var Constants = require('../constants/Constants');
var ModelPrototype = require('../../../model/prototype');
var CHANGE_EVENT = 'change';

// Store State
var _couponList = [];
var _userList = [];
var _vendorList = [];
var _productList = [];
var _coupon = {};
var _editCoupon = {};
var _verifyMsg = [];
var _status = Constants.STATE_LIST;

// Store actions
function getCouponListSuccess(couponList) {
    _couponList = couponList;
    Store.emitChange();
};

function getUserListSuccess(userList) {
    _userList = userList;
    Store.emitChange();
};

function getVendorListSuccess(vendorList) {
    _vendorList = vendorList;
    Store.emitChange();
};

function getProductListSuccess(productList) {
    _productList = productList;
    Store.emitChange();
};

// List
function triggerNewFromList() {
    _status = Constants.STATE_NEW;
    _editCoupon = ModelPrototype.getCouponPrototype();
    _verifyMsg = [];
    Store.emitChange();
};

function triggerDetailFromList(couponId) {
    for(var i=0; i<_couponList.length; i++) {
        if(_couponList[i].coupon_id == couponId) {
            _coupon = _couponList[i];

            break;
        }
    }

    _status = Constants.STATE_DETAIL;
    Store.emitChange();
};

// New
function triggerListFromNew() {
    _status = Constants.STATE_LIST;
    Store.emitChange();
};

function triggerDetailFromNew(coupon) {
    _status = Constants.STATE_DETAIL;
    _couponList.push(coupon);
    _coupon = coupon;
    Store.emitChange();
};

function submitNewCouponSuccessful(coupon) {
    for(var i=0; i<_couponList.length; i++) {
        if(_couponList[i].coupon_id == coupon.coupon_id) {
            _couponList[i].code = coupon.code;
            break;
        }
    }
    Store.emitChange();
}

// Detail
function triggerListFromDetail() {
    _status = Constants.STATE_LIST;
    Store.emitChange();
};

function triggerEditFromDetail() {
    _editCoupon = JSON.parse(JSON.stringify(_coupon));
    _status = Constants.STATE_EDIT;
    _verifyMsg = [];
    Store.emitChange();
};

// Edit
function triggerDetailSubmitFromEdit(coupon) {

    if(coupon.status == "deleted") {
        for(var i=0; i<_couponList.length; i++) {
            if(_couponList[i].coupon_id == coupon.coupon_id) {
                _couponList.splice(i,1);
                break;
            }

            _coupon = {};
            _status = Constants.STATE_LIST;
        }
    }
    else {
        for(var i=0; i<_couponList.length; i++) {
            if(_couponList[i].coupon_id == coupon.coupon_id) {
                _couponList[i].code = coupon.code;
                break;
            }
        }
        _coupon = coupon;
        _status = Constants.STATE_DETAIL;
    }

    Store.emitChange();
};

function triggerDetailCancelFromEdit() {
    _status = Constants.STATE_DETAIL;
    Store.emitChange();
};

function submitUpdateCouponSuccessful() {
    // do nothing
};

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

    getCouponList: function() {
        return _couponList;
    },

    getUserList: function() {
        return _userList;
    },

    getVendorList: function() {
        return _vendorList;
    },

    getProductList: function() {
        return _productList;
    },

    getCoupon: function() {
        return _coupon;
    },

    getEditCoupon: function() {
        return _editCoupon;
    },

    getStatus: function() {
        return _status;
    },

    getVerifyMsg: function() {
        return _verifyMsg;
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
        case Constants.ACTION_GET_COUPON_LIST_SUCCESS:
            getCouponListSuccess(JSON.parse(action.payload.response));
            break;

        case Constants.ACTION_LOAD_USER_SUCCESSFUL:
            getUserListSuccess(JSON.parse(action.payload.response));
            break;

        case Constants.ACTION_LOAD_VENDOR_SUCCESSFUL:
            getVendorListSuccess(JSON.parse(action.payload.response));
            break;

        case Constants.ACTION_LOAD_PRODUCT_SUCCESSFUL:
            getProductListSuccess(JSON.parse(action.payload.response));
            break;

        // List
        case Constants.ACITON_TRIGGER_NEW_FROM_LIST:
            triggerNewFromList();
            break;

        case Constants.ACITON_TRIGGER_DETAIL_FROM_LIST:
            triggerDetailFromList(action.couponId);
            break;

        // New
        case Constants.ACITON_TRIGGER_LIST_FROM_NEW:
            triggerListFromNew();
            break;

        case Constants.ACITON_TRIGGER_DETAIL_FROM_NEW:
            triggerDetailFromNew(action.coupon);
            break;

        case Constants.ACTION_SUBMIT_NEW_SUCCESSFUL:
            submitNewCouponSuccessful(JSON.parse(action.payload.response));
            break;

        // Detail
        case Constants.ACITON_TRIGGER_EDIT_FROM_DETAIL:
            triggerEditFromDetail();
            break;

        case Constants.ACITON_TRIGGER_LIST_FROM_DETAIL:
            triggerListFromDetail();
            break;

        // Edit
        case Constants.ACITON_TRIGGER_DETAIL_CANCEL_FROM_EDIT:
            triggerDetailCancelFromEdit();
            break;

        case Constants.ACITON_TRIGGER_DETAIL_SUBMIT_FROM_EDIT:
            triggerDetailSubmitFromEdit(action.coupon);
            break;

        case Constants.ACTION_SUBMIT_UPDATE_SUCCESSFUL:
            submitUpdateCouponSuccessful();
            break;

        // Verify Msg
        case Constants.ACTION_VERIFY:
            showVerifyMsg(action.msg);
            break;

        // Err Handling
        case Constants.ACTION_GET_COUPON_LIST_FAIL:
        case Constants.ACTION_LOAD_USER_VENDOR_PRODUCT_FAIL:
        case Constants.ACTION_SUBMIT_NEW_FAIL:
        case Constants.ACTION_SUBMIT_UPDATE_FAIL:
            err(action.actionType);
            break;

        default:
            err("no action catach");
    }
});

module.exports = Store;