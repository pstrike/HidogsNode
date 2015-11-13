var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var AppDispatcher = require('../../Common/dispatcher/AppDispatcher');
var Constants = require('../constants/Constants');
var CHANGE_EVENT = 'change';

// Store State
var _productList = [];
var _product = {};
var _editProduct = {};
var _status = Constants.STATE_VENDOR_PRODUCT_LIST;

// Store actions
// List Actions
function triggerListToDetail() {
    _status = Constants.STATE_VENDOR_PRODUCT_DETAIL;

    Store.emitChange();
};

function triggerListToSetting() {
    _status = Constants.STATE_VENDOR_PRODUCT_SETTING;

    Store.emitChange();
};

function triggerListToNew() {
    _status = Constants.STATE_VENDOR_PRODUCT_NEW;

    Store.emitChange();
};

// New Actions
function triggerNewSaveToList(tmpProduct) {
    _productList.push(tmpProduct);
    _status = Constants.STATE_VENDOR_PRODUCT_LIST;

    Store.emitChange();
};

function triggerNewCancelToList() {
    _status = Constants.STATE_VENDOR_PRODUCT_LIST;

    Store.emitChange();
};

function triggerNewSaveDataSuccess(product) {
    // do nothing
}

// Setting Actions
function triggerSettingToList() {
    _status = Constants.STATE_VENDOR_PRODUCT_LIST;

    Store.emitChange();
};

function triggerSettingToSettingEdit() {
    _status = Constants.STATE_VENDOR_PRODUCT_SETTING_EDIT;

    Store.emitChange();
};

// Setting Edit Actions
function triggerSettingEditSaveToSetting() {
    _status = Constants.STATE_VENDOR_PRODUCT_SETTING;

    Store.emitChange();
};

function triggerSettingEditCancelToSetting() {
    _status = Constants.STATE_VENDOR_PRODUCT_SETTING;

    Store.emitChange();
};

// Detail Actions
function triggerDetailToEdit() {
    _status = Constants.STATE_VENDOR_PRODUCT_EDIT;

    Store.emitChange();
};

function triggerDetailToList() {
    _status = Constants.STATE_VENDOR_PRODUCT_LIST;

    Store.emitChange();
};

function triggerDetailToComment() {
    _status = Constants.STATE_VENDOR_PRODUCT_COMMENT;

    Store.emitChange();
};

function triggerDetailToPreview() {
    alert("trigger preview");
};

// Comment Actions
function triggerCommentToDetail() {
    _status = Constants.STATE_VENDOR_PRODUCT_DETAIL;

    Store.emitChange();
};

// Edit Actions
function triggerEditSaveToDetail() {
    _status = Constants.STATE_VENDOR_PRODUCT_DETAIL;

    Store.emitChange();
};

function triggerEditCancelToDetail() {
    _status = Constants.STATE_VENDOR_PRODUCT_DETAIL;

    Store.emitChange();
};

// Err Handling
function err() {
    alert("好像出了点问题,请刷新页面重试一下.抱歉.");
};

// Store definition
var Store = assign({}, EventEmitter.prototype, {

    getProductList: function() {
        return _productList;
    },

    getProduct: function() {
        return _product;
    },

    getEditProduct: function() {
        return _editProduct;
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
        // List Actions
        case Constants.ACTION_VENDOR_PRODUCT_LIST_TRIGGER_DETAIL:
            triggerListToDetail();
            break;

        case Constants.ACTION_VENDOR_PRODUCT_LIST_TRIGGER_SETTING:
            triggerListToSetting();
            break;

        case Constants.ACTION_VENDOR_PRODUCT_LIST_TRIGGER_NEW:
            triggerListToNew();
            break;

        // New Actions
        case Constants.ACTION_VENDOR_PRODUCT_NEW_SAVE_TRIGGER_LIST:
            var tmpProduct = action.tmpProduct;
            triggerNewSaveToList(tmpProduct);
            break;

        case Constants.ACTION_VENDOR_PRODUCT_NEW_SAVE_DATA_SUCCESS:
            var product = action.payload.response;
            triggerNewSaveDataSuccess(product);
            break;

        case Constants.ACTION_VENDOR_PRODUCT_NEW_CANCEL_TRIGGER_LIST:
            triggerNewCancelToList();
            break;

        // Setting Actions
        case Constants.ACTION_VENDOR_PRODUCT_SETTING_TRIGGER_LIST:
            triggerSettingToList();
            break;

        case Constants.ACTION_VENDOR_PRODUCT_SETTING_TRIGGER_SETTING_EDIT:
            triggerSettingToSettingEdit();
            break;

        // Setting Edit Actions
        case Constants.ACTION_VENDOR_PRODUCT_SETTING_EDIT_SAVE_TRIGGER_SETTING:
            triggerSettingEditSaveToSetting();
            break;

        case Constants.ACTION_VENDOR_PRODUCT_SETTING_EDIT_CANCEL_TRIGGER_SETTING:
            triggerSettingEditCancelToSetting();
            break;

        // Detail Actions
        case Constants.ACTION_VENDOR_PRODUCT_DETAIL_TRIGGER_COMMENT:
            triggerDetailToComment();
            break;

        case Constants.ACTION_VENDOR_PRODUCT_DETAIL_TRIGGER_EDIT:
            triggerDetailToEdit();
            break;

        case Constants.ACTION_VENDOR_PRODUCT_DETAIL_TRIGGER_LIST:
            triggerDetailToList();
            break;

        case Constants.ACTION_VENDOR_PRODUCT_DETAIL_TRIGGER_PREVIEW:
            triggerDetailToPreview();
            break;

        // Edit Actions
        case Constants.ACTION_VENDOR_PRODUCT_EDIT_SAVE_TRIGGER_DETAIL:
            triggerEditSaveToDetail();
            break;

        case Constants.ACTION_VENDOR_PRODUCT_EDIT_CANCEL_TRIGGER_DETAIL:
            triggerEditCancelToDetail();
            break;

        // Comment Actions
        case Constants.ACTION_VENDOR_PRODUCT_COMMENT_TRIGGER_DETAIL:
            triggerCommentToDetail();
            break;

        // Handle Err
        case Constants.ACTION_VENDOR_PRODUCT_NEW_SAVE_DATA_FAIL:
            err();
            break;

        default:
            err();
    }
});

module.exports = Store;