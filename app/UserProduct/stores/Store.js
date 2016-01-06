var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var AppDispatcher = require('../../Common/dispatcher/AppDispatcher');
var HidogsConstants = require('../../Common/constants/HidogsConstants');
var Constants = require('../constants/Constants');
var CHANGE_EVENT = 'change';

// Store State
var _product = {};
var _vendor = {};
var _productMeta = [];
var _status = "";
var _user = {};
var _commentList = [];
var _availabilityList = [];

// Product
function getProductSuccess(product) {
    _product = product;

    //console.log("get product");
    //console.log(_product);

    Store.emitChange();
};

function getVendorSuccess(vendor) {
    _vendor = vendor;

    //console.log("get vendor");
    //console.log(_vendor);

    Store.emitChange();
};

function getMetaSuccess(meta) {
    _productMeta = meta;

    //console.log("get meta");
    //console.log(_productMeta);

    Store.emitChange();
};

function triggerProductToExitPolicy() {
    _status = Constants.STATE_EXIT_POLICY;

    Store.emitChange();
};

function triggerCommentFromProduct() {
    _commentList = [];
    _commentList.push(_product.comment_show);
    _status = Constants.STATE_COMMENT;

    Store.emitChange();
};

function triggerAvailabilityFromProduct() {
    _status = Constants.STATE_AVAILABILITY;

    Store.emitChange();
};

function updateUserFav(user) {
    _user = user;
    Store.emitChange();
};

function updateUserFavSuccessful() {
    // do nothing
};

function loadUserSuccessful(user) {
    _user = user;
    Store.emitChange();
};

// Comment
function triggerProductFromComment() {
    _status = Constants.STATE_PRODUCT;
    Store.emitChange();
};

function loadCommentSuccessful(commentList) {
    _commentList = commentList;
    Store.emitChange();
};

// Availability
function triggerProductFromAvailability() {
    _status = Constants.STATE_PRODUCT;
    Store.emitChange();
};

function loadAvailabilitySuccessful(availabilityList) {
    _availabilityList = availabilityList;
    Store.emitChange();
};

// Order
function redirectToOrderCreation(productId) {
    window.location = "http://www.hidogs.cn/wechat/auth?destination=001order1view1userordercreation?productid="+productId+"_user";
};

// Exit Policy
function triggerExitPolicyToProduct() {
    _status = Constants.STATE_PRODUCT;

    Store.emitChange();
};


// Err Handling
function err(msg) {
    console.log(msg);
    alert("好像出了点问题,请刷新页面重试一下.抱歉.");
};

// Store definition
var Store = assign({}, EventEmitter.prototype, {

    getProduct: function() {
        return _product;
    },

    getStatus: function() {
        return _status;
    },

    getVendor: function() {
        return _vendor;
    },

    getProductMeta: function() {
        return _productMeta;
    },

    getUser: function() {
        return _user;
    },

    getCommentList: function() {
        return _commentList;
    },

    getAvailabilityList: function() {
        return _availabilityList;
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

// Handle dispatcher actions
AppDispatcher.register(function(action) {

    switch (action.actionType) {
        case Constants.ACTION_ORDER_CREATION_PAY_SUCCESSFUL:
            var payload = action.payload.response;
            payOrderSuccess(payload);
            break;

        // Product
        case Constants.ACTION_PRODUCT_LOAD_PRODUCT_SUCCESSFUL:
            var product = action.product;
            getProductSuccess(product);
            break;
        case Constants.ACTION_PRODUCT_LOAD_VENDOR_SUCCESSFUL:
            var vendor = JSON.parse(action.payload.response);
            getVendorSuccess(vendor);
            break;
        case Constants.ACTION_PRODUCT_LOAD_META_SUCCESSFUL:
            var meta = JSON.parse(action.payload.response);
            getMetaSuccess(meta);
            break;
        case Constants.ACTION_PRODUCT_TO_COMMENT:
            triggerCommentFromProduct();
            break;
        case Constants.ACTION_PRODUCT_TO_AVAILABILITY:
            triggerAvailabilityFromProduct();
            break;
        case Constants.ACTION_PRODUCT_TO_ORDER_CREATION:

            break;
        case Constants.ACTION_PRODUCT_TO_VENDOR:

            break;
        case Constants.ACTION_PRODUCT_TO_EXIT_POLICY:
            triggerProductToExitPolicy();
            break;

        case Constants.ACTION_PRODUCT_FAV_FAKE:
            updateUserFav(action.user);
            break;

        case Constants.ACTION_PRODUCT_FAV_SUCCESSFUL:
            updateUserFavSuccessful();
            break;

        case Constants.ACTION_PRODUCT_LOAD_USER_SUCCESSFUL:
            loadUserSuccessful(JSON.parse(action.payload.response));
            break;

        // Comment
        case Constants.ACTION_COMMENT_TO_PRODUCT:
            triggerProductFromComment();
            break;

        case Constants.ACTION_COMMENT_LOAD_COMMENT_SUCCSSFUL:
            loadCommentSuccessful(JSON.parse(action.payload.response));
            break;

        // Availability
        case Constants.ACTION_PRODUCT_LOAD_AVAILABILITY_SUCCESSFUL:
            loadAvailabilitySuccessful(JSON.parse(action.payload.response));
            break;

        case Constants.ACTION_AVAILABILITY_TO_PRODUCT:
            triggerProductFromAvailability();
            break;

        // Order Creation
        case Constants.ACTION_ORDER_REDIRECT_TO_ORDER_CREATION:
            redirectToOrderCreation(action.productId);
            break;

        // Exit Policy
        case Constants.ACTION_EXIT_POLICY_TO_PRODUCT:
            triggerExitPolicyToProduct();
            break;

        // HG Actions
        case HidogsConstants.HIDOGS_SESSION_LOAD_SUCCESSFUL:
            // do nothing
            break;

        // Err Handlig
        case Constants.ACTION_PRODUCT_LOAD_PRODUCT_FAIL:
        case Constants.ACTION_PRODUCT_LOAD_VENDOR_FAIL:
        case Constants.ACTION_PRODUCT_LOAD_META_FAIL:
        case Constants.ACTION_COMMENT_LOAD_COMMENT_FAIL:
        case Constants.ACTION_AVAILABILITY_LOAD_FAIL:
        case Constants.ACTION_PRODUCT_FAV_FAIL:
        case Constants.ACTION_PRODUCT_LOAD_USER_FAIL:
            err(action.actionType);
            break;

        default:
            err("no action catch");
    }
});

module.exports = Store;