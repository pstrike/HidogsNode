var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var AppDispatcher = require('../../Common/dispatcher/AppDispatcher');
var Constants = require('../constants/Constants');
var CHANGE_EVENT = 'change';

// Store State
var _session = {};
var _user = {};
var _verifyMsg = "";
var _status = "";

// Store actions
function loadSessionSuccessful(session) {
    _session = session;

    //console.log("load session");
    //console.log(_session);

    Store.emitChange();
};

function loadUserSuccessful(user) {
    _user = user;

    //console.log("load user");
    //console.log(_user);

    Store.emitChange();
};

function updateUserSuccessful() {
    //console.log("update user successful")
};

function updateOrderSuccessful() {
    //console.log("update order successful")

    window.location = "http://www.hidogs.cn/wechat/auth?destination=001order1view1userorder_user";
};

function showVerifyMsg(msg) {
    _verifyMsg = msg;

    Store.emitChange();
};

// Err Handling
function err(msg) {
    console.log(msg);
    alert("好像出了点问题,请刷新页面重试一下.抱歉.");
};

// Store definition
var Store = assign({}, EventEmitter.prototype, {

    getSession: function() {
        return _session;
    },

    getUser: function() {
        return _user;
    },

    getStatus: function() {
        return _status;
    },

    getVerifyMsg: function() {
        return _verifyMsg;
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
        case Constants.ACTION_LOAD_SESSION_SUCCESSFUL:
            loadSessionSuccessful(action.session);
            break;

        case Constants.ACTION_UPDATE_USER_SUCCESSFUL:
            updateUserSuccessful();
            break;

        case Constants.ACTION_UPDATE_ORDER_SUCCESSFUL:
            updateOrderSuccessful();
            break;

        case Constants.ACTION_LOAD_USER_SUCCESSFUL:
            var user = JSON.parse(action.payload.response);

            loadUserSuccessful(user);
            break;

        case Constants.ACTION_SHOW_VERIFY_MSG:
            var msg = action.msg;
            showVerifyMsg(msg);
            break;

        case Constants.ACTION_LOAD_SESSION_FAIL:
        case Constants.ACTION_LOAD_USER_FAIL:
        case Constants.ACTION_UPDATE_ORDER_FAIL:
        case Constants.ACTION_UPDATE_USER_FAIL:
            err(action.actionType);

        default:
            err("no action catch");
    }
});

module.exports = Store;