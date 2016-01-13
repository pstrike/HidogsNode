var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var AppDispatcher = require('../../../app/Common/dispatcher/AppDispatcher');
var HGConstants = require('../../../app/Common/constants/HidogsConstants');
var Constants = require('../constants/Constants');
var CHANGE_EVENT = 'change';

// Store State
var _user = {};
var _userList = [];
var _status = "";

// Store actions
function loadUserListOk(userList) {

    var originalNo = _userList.length;

    userList.forEach(function(item) {
        if(item.pet.name) {

            var isIncluded = false;
            for(var i=0; i<_userList.length; i++) {
                if(item.user_id == _userList[i].user_id) {
                    isIncluded = true;
                }
            }

            if(!isIncluded) {
                _userList.push(item);
            }

        }
    });

    if(originalNo == _userList.length) {
        _userList.push({user_id:"tmp",pet:{name:'nomoredata'}});
    }

    Store.emitChange();
};

function loadUserOk(user, subscribe) {

    _user = user;
    if(subscribe.subscribe == 1) {
        _user.isSubscribe = true;
    }
    else {
        _user.isSubscribe = false;
    }

    Store.emitChange();
}

function voteOk() {

};


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

    getUserList: function() {
        return _userList;
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
        case Constants.ACTION_LOAD_USER_LIST_OK:
            loadUserListOk(JSON.parse(action.payload.response));
            break;

        case Constants.ACTION_LOAD_USER_OK:
            loadUserOk(action.user, JSON.parse(action.payload.response));
            break;

        case Constants.ACTION_VOTE_OK:
            voteOk();
            break;

        case Constants.ACTION_UPDATE_LOCATION:
            // do nothing
            break;

        // HG Actions
        case HGConstants.HIDOGS_SESSION_LOAD_SUCCESSFUL:
        case HGConstants.HIDOGS_SESSION_LOAD_FAIL:
        case HGConstants.HIDOGS_WX_SIGN_LOAD_SUCCEFFUL:
        case HGConstants.HIDOGS_WX_SIGN_LOAD_FAIL:
            // do nothing
            break;

        // Err Handling
        case Constants.ACTION_INIT_FAIL:
        case Constants.ACTION_UPDATE_FAIL:
        case Constants.ACTION_VOTE_FAIL:
            err(action.actionType, action.err);
            break;

        default:
            err("no action catach", "");
    }
});

module.exports = Store;