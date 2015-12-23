var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var AppDispatcher = require('../../Common/dispatcher/AppDispatcher');
var HGConstants = require('../../Common/constants/HidogsConstants');
var Constants = require('../constants/Constants');
var CHANGE_EVENT = 'change';
var APVTO = require('../../../util/assignpathvaluetoobject');

// Store State
var _vendor = {};
var _editVendor = {};
var _verifyMsg = [];
var _status = Constants.STATE_VIEW;
var _wxSign = {};

// Store actions
function initVendor(vendor) {
    _vendor = vendor;

    Store.emitChange();
};

function triggerEditFromView() {
    _editVendor = JSON.parse(JSON.stringify(_vendor));
    _status = Constants.STATE_EDIT;
    Store.emitChange();
};

function triggerViewFromEdit() {
    _editVendor = {};
    _status = Constants.STATE_VIEW;
    Store.emitChange();
};

function saveFake(vendor) {
    _vendor = vendor;
    _editVendor = {};
    _status = Constants.STATE_VIEW;
    Store.emitChange();
}

function saveSuccessful() {
    // do nothing
}

// WX
function getWXSignatureSuccess(signature) {
    _wxSign = signature;

    Store.emitChange();
};

function getWXMediaSuccess(fileName, path) {
    APVTO.assign(_editVendor, path, fileName);

    Store.emitChange();
};

// Verify Msg
function showVerifyMsg(msg) {
    _verifyMsg = msg;

    Store.emitChange();
};

// Err Handling
function err(msg) {
    console.log("[Err] "+msg);
    alert("好像出了点问题,请刷新页面重试一下.抱歉.");
};

// Store definition
var Store = assign({}, EventEmitter.prototype, {

    getVendor: function() {
        return _vendor;
    },

    getEditVendor: function() {
        return _editVendor;
    },

    getStatus: function() {
        return _status;
    },

    getVerifyMsg: function() {
        return _verifyMsg;
    },

    getWXSign: function() {
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
        case Constants.INIT_VENDOR_SUCCESSFUL:
            initVendor(JSON.parse(action.payload.response));
            break;

        case Constants.ACTION_TRIGGER_EDIT_FROM_VIEW:
            triggerEditFromView();
            break;

        case Constants.ACTION_TRIGGER_VIEW_FROM_EDIT:
            triggerViewFromEdit();
            break;

        case Constants.ACTION_SAVE_FAKE:
            saveFake(action.vendor);
            break;

        case Constants.ACTION_SAVE_SUCCESSFUL:
            saveSuccessful();
            break;

        // WX
        case Constants.ACTION_GET_WX_SIGNATURE_SUCCESS:
            var signature = JSON.parse(action.payload.response);

            getWXSignatureSuccess(signature);
            break;

        case Constants.ACTION_GET_WX_MEDIA_SUCCESS:
            var fileName = action.payload.response;
            var path = action.path;
            getWXMediaSuccess(fileName, path);

            break;

        // Verify Msg
        case Constants.VERIFY_ACTION:
            var msg = action.msg;
            showVerifyMsg(msg);
            break;

        // HG Actions
        case HGConstants.HIDOGS_SESSION_LOAD_SUCCESSFUL:
            // do nothing
            break;

        // Err Handling
        case Constants.INIT_FAIL:
        case Constants.ACTION_GET_WX_SIGNATURE_FAIL:
        case Constants.ACTION_SAVE_FAIL:
            err(action.actionType);
            break;

        default:
            err("no action catch");
    }
});

module.exports = Store;