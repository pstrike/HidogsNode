var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var AppDispatcher = require('../../Common/dispatcher/AppDispatcher');
var Constants = require('../constants/Constants');
var APVTO = require('../../../util/assignpathvaluetoobject');
var CHANGE_EVENT = 'change';

// Store State
var _vendor = {};
var _editVendor = {};
var _status = "";
var _verifyMsg = [];
var _wxSign = {};

// Store actions
function getVendorProfileSuccess(vendor) {
    _vendor = JSON.parse(JSON.stringify(vendor));
    _editVendor = JSON.parse(JSON.stringify(vendor));

    if (vendor.status == "approved") {
        _status = Constants.STATE_VENDOR_APPLICAITON_APPROVED;
    }
    else if (vendor.status == "reviewing") {
        _status = Constants.STATE_VENDOR_APPLICAITON_REVIEWING;
    }
    else if (vendor.status == "rejected") {
        _status = Constants.STATE_VENDOR_APPLICAITON_REJECT;
    }
    else if (vendor.status == "drafted") {
        _status = Constants.STATE_VENDOR_APPLICAITON_DRAFT;
    }
    else {
        _status = Constants.STATE_VENDOR_APPLICAITON_CREATED;
    }

    Store.emitChange();
};

function updateVendorProfileFake(vendor, type) {
    _vendor = JSON.parse(JSON.stringify(vendor));
    _editVendor = JSON.parse(JSON.stringify(vendor));
    _verifyMsg = "";

    if(type == "apply") {
        _status = Constants.STATE_VENDOR_APPLICAITON_REVIEWING;
    }
    else {
        _status = Constants.STATE_VENDOR_APPLICAITON_DRAFT;
    }

    Store.emitChange();
};

function uploadPicSuccess(payload, path) {
    APVTO.assign(_editVendor, path, payload);

    Store.emitChange();
};

function cancelProfileEdit() {
    _editVendor = JSON.parse(JSON.stringify(_vendor));
    _verifyMsg = "";

    if (_vendor.status == "approved") {
        _status = Constants.STATE_VENDOR_APPLICAITON_APPROVED;
    }
    else if (_vendor.status == "reviewing") {
        _status = Constants.STATE_VENDOR_APPLICAITON_REVIEWING;
    }
    else if (_vendor.status == "rejected") {
        _status = Constants.STATE_VENDOR_APPLICAITON_REJECT;
    }
    else if (_vendor.status == "drafted") {
        _status = Constants.STATE_VENDOR_APPLICAITON_DRAFT;
    }
    else {
        _status = Constants.STATE_VENDOR_APPLICAITON_CREATED;
    }

    Store.emitChange();
};

function triggerProfileEdit() {
    _status = Constants.STATE_VENDOR_APPLICAITON_EDITING;

    Store.emitChange();
};

function showProfileVerifyMsg(msg) {
    _verifyMsg = msg;

    Store.emitChange();
};

function showAgreement() {
    if(_status == Constants.STATE_VENDOR_APPLICAITON_EDITING) {
        _status = Constants.STATE_VENDOR_APPLICAITON_EDIT_AGREEMENT;
    }
    else {
        _status = Constants.STATE_VENDOR_APPLICAITON_PROFILE_AGREEMENT;
    }

    Store.emitChange();
};

function closeAgreement() {
    if(_status == Constants.STATE_VENDOR_APPLICAITON_EDIT_AGREEMENT) {
        _status = Constants.STATE_VENDOR_APPLICAITON_EDITING;
    }
    else {
        if (_vendor.status == "approved") {
            _status = Constants.STATE_VENDOR_APPLICAITON_APPROVED;
        }
        else if (_vendor.status == "reviewing") {
            _status = Constants.STATE_VENDOR_APPLICAITON_REVIEWING;
        }
        else if (_vendor.status == "rejected") {
            _status = Constants.STATE_VENDOR_APPLICAITON_REJECT;
        }
        else if (_vendor.status == "drafted") {
            _status = Constants.STATE_VENDOR_APPLICAITON_DRAFT;
        }
        else {
            _status = Constants.STATE_VENDOR_APPLICAITON_CREATED;
        }
    }

    Store.emitChange();
};

function getWXSignatureSuccess(signature) {
    _wxSign = signature;

    Store.emitChange();
};

function getWXMediaSuccess(fileName, path) {
    APVTO.assign(_editVendor, path, fileName);

    Store.emitChange();
};

// Err Handling
function err() {
    alert("好像出了点问题,请刷新页面重试一下.抱歉.");
};

// Store definition
var Store = assign({}, EventEmitter.prototype, {

    getVendor: function() {
        return _vendor;
    },

    getStatus: function() {
        return _status;
    },

    getEditVendor: function() {
        return _editVendor;
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
        case Constants.ACTION_GET_VENDOR_PROFILE_SUCCESS:
            var vendor = JSON.parse(action.payload.response);
            getVendorProfileSuccess(vendor);
            break;

        case Constants.ACTION_UPDATE_VENDOR_PROFILE_FAKE:
            var vendor = action.vendor;
            var type = action.type;
            updateVendorProfileFake(vendor, type);
            break;

        case Constants.ACTION_UPLOAD_PIC_SUCCESS:
            var payload = action.payload.response;
            var path = action.path;
            uploadPicSuccess(payload, path);
            break;

        case Constants.ACTION_CANCEL_PROFILE_EDIT:
            cancelProfileEdit();
            break;

        case Constants.ACTION_TRIGGER_PROFILE_EDIT:
            triggerProfileEdit();
            break;

        case Constants.ACTION_UPDATE_VENDOR_PROFILE_SUCCESS:
            // do nothing
            break;

        case Constants.ACTION_SHOW_PROFILE_VERIFY_MSG:
            var msg = action.msg;

            showProfileVerifyMsg(msg);
            break;

        case Constants.ACTION_SHOW_AGREEMENT:
            showAgreement();
            break;

        case Constants.ACTION_CLOSE_AGREEMENT:
            closeAgreement();
            break;

        case Constants.ACTION_GET_WX_SIGNATURE_SUCCESS:
            var signature = JSON.parse(action.payload.response);

            getWXSignatureSuccess(signature);
            break;

        case Constants.ACTION_GET_WX_MEDIA_SUCCESS:
            var fileName = action.payload.response;
            var path = action.path;
            getWXMediaSuccess(fileName, path);

            break;

        case Constants.ACTION_UPDATE_VENDOR_PROFILE_FAIL:
        case Constants.ACTION_GET_WX_SIGNATURE_FAIL:
        case Constants.ACTION_GET_WX_MEDIA_FAIL:
        default:
            err();
    }
});

module.exports = Store;