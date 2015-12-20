var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var AppDispatcher = require('../../Common/dispatcher/AppDispatcher');
var Constants = require('../constants/Constants');
var CHANGE_EVENT = 'change';

// Store State
var _vendor = {};
var _productList = [];
var _status = "";

// Store actions
function initLoadVendor(vendor) {
    _vendor = vendor;
    console.log(_vendor);
    Store.emitChange();
};

function initLoadProductList(productList) {
    _productList = productList;
    console.log(_productList);
    Store.emitChange();
};

// Err Handling
function err(msg) {
    console.log(msg);
    alert("好像出了点问题,请刷新页面重试一下.抱歉.");
};

// Store definition
var Store = assign({}, EventEmitter.prototype, {

    getVendor: function() {
        return _vendor;
    },

    getProductList: function() {
        return _productList;
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
        case Constants.INIT_LOAD_VENDOR_SUCCESSFUL:
            var vendor = JSON.parse(action.payload.response);
            initLoadVendor(vendor);
            break;

        case Constants.INIT_LOAD_PRODUCT_LIST_SUCCESSFUL:
            var productList = JSON.parse(action.payload.response);
            initLoadProductList(productList);
            break;

        case Constants.INIT_FAIL:
            err(action.actionType);
            break;

        default:
            err("no action catch");
    }
});

module.exports = Store;