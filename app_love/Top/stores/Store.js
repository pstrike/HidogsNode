var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var AppDispatcher = require('../../../app/Common/dispatcher/AppDispatcher');
var HGConstants = require('../../../app/Common/constants/HidogsConstants');
var Constants = require('../constants/Constants');
var CHANGE_EVENT = 'change';

// Store State
var _topList = [];
var _randomList = [];
var _status = "";

// Store actions
function loadTopList(topList) {
    _topList = topList;
    Store.emitChange();
};

function loadRandomUserList(randomList) {
    _randomList = randomList;
    Store.emitChange();
}

// Err Handling
function err(msg, err) {
    console.log("[Err] "+msg);
    console.log(err);
    alert("好像出了点问题,请刷新页面重试一下.抱歉.");
};

// Store definition
var Store = assign({}, EventEmitter.prototype, {

    getTopList: function() {
        return _topList;
    },

    getRandomList: function() {
        return _randomList;
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
        case Constants.ACTION_UPDATE_LOCATION:
            // do nothing
            break;

        case Constants.ACTION_LOAD_TOP_LIST_OK:
            loadTopList(JSON.parse(action.payload.response));
            break;

        case Constants.ACTION_LOAD_RANDOM_USER_OK:
            loadRandomUserList((JSON.parse(action.payload.response)));
            break;

        // HG Actions
        case HGConstants.HIDOGS_SESSION_LOAD_SUCCESSFUL:
        case HGConstants.HIDOGS_SESSION_LOAD_FAIL:
        case HGConstants.HIDOGS_WX_SIGN_LOAD_SUCCEFFUL:
        case HGConstants.HIDOGS_WX_SIGN_LOAD_FAIL:
            // do nothing
            break;

        // Err Handling
        case Constants.ACTION_UPDATE_FAIL:
        case Constants.ACTION_INIT_FAIL:
            err(action.actionType, action.err);
            break;

        default:
            err("no action catach", "");
    }
});

module.exports = Store;