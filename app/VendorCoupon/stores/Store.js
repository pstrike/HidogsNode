var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var AppDispatcher = require('../../Common/dispatcher/AppDispatcher');
var HidogsConstants = require('../../Common/constants/HidogsConstants');
var Constants = require('../constants/Constants');
var CHANGE_EVENT = 'change';

// Store State
var _couponList = [];
var _status = "";

// Store actions
function initLoadCouponListSuccessful(couponList) {
    _couponList = couponList;
    Store.emitChange();
};

// Err Handling
function err(msg) {
    console.log(msg);
    alert("好像出了点问题,请刷新页面重试一下.抱歉.");
};

// Store definition
var Store = assign({}, EventEmitter.prototype, {

    getCouponList: function() {
        return _couponList;
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
        case Constants.ACTION_INIT_LOAD_COUPON_LIST_SUCCESSFUL:
            initLoadCouponListSuccessful(JSON.parse(action.payload.response));
            break;

        // HG Actions
        case HidogsConstants.HIDOGS_SESSION_LOAD_SUCCESSFUL:
            // do nothing
            break;

        // Err Handling
        case Constants.ACTION_INIT_FAIL:
            err(action.actionType);
            break;

        default:
            err("no action catch");
    }
});

module.exports = Store;