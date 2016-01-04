var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var AppDispatcher = require('../../Common/dispatcher/AppDispatcher');
var HidogsConstants = require('../../Common/constants/HidogsConstants');
var Constants = require('../constants/Constants');
var CHANGE_EVENT = 'change';

// Store State
var _vendor = {};
var _user = {};
var _productList = [];
var _commentList = [];
var _status = Constants.STATE_VENDOR_PAGE;

// Store actions
// Init
function initLoadVendor(vendor) {
    _vendor = vendor;
    //console.log(_vendor);
    Store.emitChange();
};

function initLoadProductList(productList) {
    _productList = productList;
    //console.log(_productList);
    Store.emitChange();
};

function loadUserSuccessful(user) {
    _user = user;
    Store.emitChange();
};

// Main
function triggerCommentFromMain() {
    _commentList = [];

    if(_vendor.role) {
        _vendor.role.forEach(function(roleItem) {
            // vendor comment
            if(roleItem.comment && roleItem.comment.created_time) {
                _commentList.push(roleItem.comment);
            }
        })
    }

    _status = Constants.STATE_COMMENT;
    Store.emitChange();
};

// Comment
function triggerMainFromComment() {
    _status = Constants.STATE_VENDOR_PAGE;
    Store.emitChange();
};

function loadCommentListSuccessful(commentList){
    _commentList = commentList;
    Store.emitChange();
};

// Fav
function updateUserFav(user) {
    _user = user;
    Store.emitChange();
};

function updateUserFavSuccessful() {
    // do nothing
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

    getCommentList: function() {
        return _commentList;
    },

    getStatus: function() {
        return _status;
    },

    getUser: function() {
        return _user;
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
        case Constants.INIT_LOAD_VENDOR_SUCCESSFUL:
            var vendor = JSON.parse(action.payload.response);
            initLoadVendor(vendor);
            break;

        case Constants.INIT_LOAD_PRODUCT_LIST_SUCCESSFUL:
            var productList = JSON.parse(action.payload.response);
            initLoadProductList(productList);
            break;

        case Constants.ACTION_PRODUCT_LOAD_USER_SUCCESSFUL:
            loadUserSuccessful(JSON.parse(action.payload.response));
            break;

        // Fav
        case Constants.ACTION_PRODUCT_FAV_FAKE:
            updateUserFav(action.user);
            break;

        case Constants.ACTION_PRODUCT_FAV_SUCCESSFUL:
            updateUserFavSuccessful();
            break;

        // Main
        case Constants.ACTION_TRIGGER_COMMENT_FROM_MAIN:
            triggerCommentFromMain();
            break;

        //Comment
        case Constants.ACTION_TRIGGER_MAIN_FROM_COMMENT:
            triggerMainFromComment();
            break;

        case Constants.ACTION_LOAD_COMMENT_SUCCESSFUL:
            loadCommentListSuccessful(JSON.parse(action.payload.response));
            break;

        // HG Actions
        case HidogsConstants.HIDOGS_SESSION_LOAD_SUCCESSFUL:
            // do nothing
            break;

        // Err Handling
        case Constants.INIT_FAIL:
        case Constants.ACTION_PRODUCT_LOAD_USER_FAIL:
        case Constants.ACTION_LOAD_COMMENT_FAIL:
            err(action.actionType);
            break;

        default:
            err("no action catch");
    }
});

module.exports = Store;