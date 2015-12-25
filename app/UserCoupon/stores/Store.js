var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var AppDispatcher = require('../../Common/dispatcher/AppDispatcher');
var HidogsConstants = require('../../Common/constants/HidogsConstants');
var Constants = require('../constants/Constants');
var CHANGE_EVENT = 'change';

// Store State
var _user = {};
var _couponList = [];
var _verifyMsg = [];
var _status = "";

// Store actions
function initLoadUserSuccessful(user) {
    _user = user;
    Store.emitChange();
};

function initLoadCouponListSuccessful(couponList) {
    _couponList = couponList;
    Store.emitChange();
};

function addCoupon(coupon) {
    _verifyMsg = [];
    _couponList.push(coupon);
    Store.emitChange();
};

function addInvalidCoupon() {
    _verifyMsg = [];
    _verifyMsg.push("-抱歉, 您输入的优惠码有误.");

    Store.emitChange();
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

    getUser: function() {
        return _user;
    },

    getCouponList: function() {
        return _couponList;
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
        case Constants.ACTION_INIT_LOAD_USER_SUCCESSFUL:
            initLoadUserSuccessful(JSON.parse(action.payload.response));
            break;

        case Constants.ACTION_INIT_LOAD_COUPON_LIST_SUCCESSFUL:
            initLoadCouponListSuccessful(JSON.parse(action.payload.response));
            break;

        case Constants.ACTION_ADD_COUPON:
            addCoupon(action.coupon);
            break;

        case Constants.ACTION_ADD_INVALID_COUPON:
            addInvalidCoupon();
            break;

        // HG Actions
        case HidogsConstants.HIDOGS_SESSION_LOAD_SUCCESSFUL:
            // do nothing
            break;

        // Verify Msg
        case Constants.VERIFY_ACTION:
            var msg = action.msg;
            showVerifyMsg(msg);
            break;

        // Err Handling
        case Constants.ACTION_INIT_FAIL:
        case Constants.ACTION_ADD_COUPON_FAIL:
            err(action.actionType);
            break;

        default:
            err("no action catach");
    }
});

module.exports = Store;