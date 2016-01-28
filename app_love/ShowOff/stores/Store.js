var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var AppDispatcher = require('../../../app/Common/dispatcher/AppDispatcher');
var HGConstants = require('../../../app/Common/constants/HidogsConstants');
var Constants = require('../constants/Constants');
var CHANGE_EVENT = 'change';

// Store State
var _user = {};
var _clientId = "";
var _status = "";

// Store actions
function initLoadUser(user) {
    _user = user;
    Store.emitChange();
};

function initUserRanking(ranking) {
    _user.ranking = ranking.rank;
    Store.emitChange();
}

function initClientId(clientId) {
    _clientId = clientId;
    Store.emitChange();
}

function supportUser(clientId) {
    _user.love.support.push(clientId);
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

    getUser: function() {
        return _user;
    },

    getClientId: function() {
        return _clientId;
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
        case Constants.ACTION_INIT_LOAD_USER:
            initLoadUser(JSON.parse(action.payload.response));
            break;

        case Constants.ACTION_INIT_CLIENT_ID:
            initClientId(action.clientId);
            break;

        case Constants.ACTION_INIT_USER_RANKING:
            initUserRanking(JSON.parse(action.payload.response));
            break;

        case Constants.ACTION_SUPPORT_USER:
            supportUser(action.clientId);
            break;

        case Constants.ACTION_SUPPORT_USER_OK:
            // do nothing
            break;

        case Constants.ACTION_UPDATE_LOCATION:
            // do nothing
            break;

        // HG Actions
        case HGConstants.HIDOGS_SESSION_LOAD_SUCCESSFUL:
            var session = JSON.parse(action.payload.response);
            if(session.user_id) {
                initClientId(session.user_id);
            }

            break;

        case HGConstants.HIDOGS_SESSION_LOAD_FAIL:
        case HGConstants.HIDOGS_WX_SIGN_LOAD_SUCCEFFUL:
        case HGConstants.HIDOGS_WX_SIGN_LOAD_FAIL:
            // do nothing
            break;


        // Err Handling
        case Constants.ACTION_INIT_FAIL:
        case Constants.ACTION_SUPPORT_USER_FAIL:
        case Constants.ACTION_UPDATE_FAIL:
            err(action.actionType, action.err);
            break;

        default:
            err("no action catach", "");
    }
});

module.exports = Store;