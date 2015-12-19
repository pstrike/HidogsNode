var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var AppDispatcher = require('../../Common/dispatcher/AppDispatcher');
var Constants = require('../constants/HidogsConstants');
var CHANGE_EVENT = 'change';

// Store State
var _session = {};

// Store actions
function sessionLoadSuccessful(session) {
    _session = session;

    Store.emitChange();
};

// Err Handling
function err(msg) {
    console.log("[Err] "+msg);
    alert("好像出了点问题,请刷新页面重试一下.抱歉.");
};

// Store definition
var Store = assign({}, EventEmitter.prototype, {

    getSession: function() {
        return _session;
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
        case Constants.HIDOGS_SESSION_LOAD_SUCCESSFUL:
            var session = JSON.parse(action.payload.response);

            sessionLoadSuccessful(session);
            break;

        case Constants.HIDOGS_SESSION_LOAD_FAIL:
            err(action.actionType);
            break;

        // no default handling to skip non related actions
    }
});

module.exports = Store;