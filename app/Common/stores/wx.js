var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var AppDispatcher = require('../../Common/dispatcher/AppDispatcher');
var Constants = require('../constants/HidogsConstants');
var CHANGE_EVENT = 'change';

// Store State
var _wxSign = {};

// Store actions
function loadSuccessful(wxSign) {
    _wxSign = wxSign;
    Store.emitChange();
};

// Err Handling
function err(msg, err) {
    console.log("[Err] "+msg);
    console.log(err);
    alert("好像出了点问题,请刷新页面重试一下.抱歉.");
};

// Store definition
var Store = assign({}, EventEmitter.prototype, {

    getWxSign: function() {
        return _wxSign;
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
        case Constants.HIDOGS_WX_SIGN_LOAD_SUCCEFFUL:
            var object = JSON.parse(action.payload.response);

            loadSuccessful(object);
            break;

        case Constants.HIDOGS_WX_SIGN_LOAD_FAIL:
            err(action.actionType, err);
            break;

        // no default handling to skip non related actions
    }
});

module.exports = Store;