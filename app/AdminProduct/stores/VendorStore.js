var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var AppDispatcher = require('../../Common/dispatcher/AppDispatcher');
var Constants = require('../constants/Constants');
var CHANGE_EVENT = 'change';

// Store State
var _productList = [];

// Store actions
function getProductListSuccess(productList) {
    _productList = productList;

    Store.emitChange();
};

// Err Handling
function err(msg) {
    console.log("[Err] "+msg);
    alert("好像出了点问题,请刷新页面重试一下.抱歉.");
};

// Store definition
var Store = assign({}, EventEmitter.prototype, {

    getProductList: function() {
        return _productList;
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
        case Constants.ACTION_GET_PRODUCT_LIST_SUCCESS:
            var productList = JSON.parse(action.payload.response);
            getProductListSuccess(productList);
            break;

        case Constants.ACTION_GET_PRODUCT_LIST_FAIL:
            err(action.actionType);
            break;

        default:
            err("no action catach");
    }
});

module.exports = Store;