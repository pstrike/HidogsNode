var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var AppDispatcher = require('../../Common/dispatcher/AppDispatcher');
var Constants = require('../constants/Constants');
var CHANGE_EVENT = 'change';

// Store State
var _vendor = {};
var _editVendor = {};
var _status = "";

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

    if(type == "apply") {
        _status = Constants.STATE_VENDOR_APPLICAITON_REVIEWING;
    }
    else {
        _status = Constants.STATE_VENDOR_APPLICAITON_DRAFT;
    }

    Store.emitChange();
};

function uploadPicSuccess(payload, path) {
    if(path[0] == 'id_card') {
        _editVendor[path[0]][path[1]] = payload;
    }
    else if(path[0] == 'head_image_url') {
        _editVendor[path[0]] = payload;
    }
    else {
        _editVendor[path[0]][path[1]][path[2]] = payload;
    }

    Store.emitChange();
};

function cancelProfileEdit() {
    _editVendor = JSON.parse(JSON.stringify(_vendor));

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


        default:
            err();
    }
});

module.exports = Store;