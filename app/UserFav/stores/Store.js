var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var AppDispatcher = require('../../Common/dispatcher/AppDispatcher');
var HidogsConstants = require('../../Common/constants/HidogsConstants');
var Constants = require('../constants/Constants');
var CHANGE_EVENT = 'change';

// Store State
var _user = {};
var _productList = [];
var _vendorList = [];
var _status = Constants.STATE_PRODUCT;

// Store actions
function loadUserSuccessful(user) {
    _user = user;
    Store.emitChange();
};

function loadProductListSuccessful(productList) {
    _productList = productList;
    Store.emitChange();
};

function loadVendorListSuccessful(vendorList) {
    _vendorList = vendorList;
    Store.emitChange();
};

function viewProductList() {
    _status = Constants.STATE_PRODUCT;
    Store.emitChange();
};

function viewVendorList() {
    _status = Constants.STATE_VENDOR;
    Store.emitChange();
};

// Err Handling
function err(msg) {
    console.log(msg);
    alert("好像出了点问题,请刷新页面重试一下.抱歉.");
};

// Store definition
var Store = assign({}, EventEmitter.prototype, {

    getUser: function() {
        return _status;
    },

    getProductList: function() {
        return _productList;
    },

    getVendorList: function() {
        return _vendorList;
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
        case Constants.ACTION_LOAD_USER_SUCCESSFUL:
            loadUserSuccessful(JSON.parse(action.payload.response));
            break;

        case Constants.ACTION_LOAD_PRODUCT_LIST_SUCCESSFUL:
            loadProductListSuccessful(JSON.parse(action.payload.response));
            break;

        case Constants.ACTION_LOAD_VENDOR_LIST_SUCCESSFUL:
            loadVendorListSuccessful(JSON.parse(action.payload.response));
            break;

        case Constants.ACTION_VIEW_PRODUCT_LIST:
            viewProductList();
            break;

        case Constants.ACTION_VIEW_VENDOR_LIST:
            viewVendorList();
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