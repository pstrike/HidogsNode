var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var AppDispatcher = require('../../../app/Common/dispatcher/AppDispatcher');
var HGConstants = require('../../../app/Common/constants/HidogsConstants');
var Constants = require('../constants/Constants');
var APVTO = require('../../../util/assignpathvaluetoobject');
var CHANGE_EVENT = 'change';

// Store State
var _user = {};
var _editUser = {};
var _status = Constants.STATE_FORM;

// Store actions
function initLoadUser(user, subscribe) {
    _user = user;
    _editUser = user;

    if(subscribe.subscribe == 1) {
        _user.isSubscribe = true;
    }
    else {
        _user.isSubscribe = false;
    }

    Store.emitChange();
};

function updateProfile(user) {
    _editUser = user;
    _user = user;
    _status = Constants.STATE_SAVE_IN_PROGRESS;
    Store.emitChange();
};

function updateProfileOk() {

    if(_user.isSubscribe) {
        window.location = "http://www.hidogs.cn/love/view/tinder";
    }
    else {
        _status = Constants.STATE_DONE;
    }

    Store.emitChange();
};

// Location & Address
function loadLocation(location, address) {
    _user.location = location;
    _editUser.location = location;

    _user.address = address;
    _editUser.address = address;

    Store.emitChange();
};

function loadAddress(address) {
    _user.address = address;
    _editUser.address = address;
    Store.emitChange();
};

// WX Image
function getWXMediaSuccess(fileName, path) {
    APVTO.assign(_editUser, path, fileName);

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

    getUser: function() {
        return _user;
    },

    getEditUser: function() {
        return _editUser;
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
            initLoadUser(action.user, JSON.parse(action.payload.response));
            break;

        case Constants.ACTION_UPDATE:
            updateProfile(action.user);
            break;

        case Constants.ACTION_UPDATE_OK:
            updateProfileOk();
            break;

        // Location & Address
        case Constants.ACTION_GET_LOCATION:
            loadLocation(action.location, action.address);
            break;

        case Constants.ACTION_UPDATE_LOCATION:
            // do nothing
            break;

        // WX Image
        case Constants.ACTION_GET_WX_MEDIA_SUCCESS:
            var fileName = action.payload.response;
            var path = action.path;
            getWXMediaSuccess(fileName, path);
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
        case Constants.ACTION_GET_WX_MEDIA_FAIL:
            err(action.actionType, action.err);
            break;

        default:
            err("no action catach", "");
    }
});

module.exports = Store;