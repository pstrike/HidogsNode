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
    _vendor = vendor;
    _editVendor = vendor;

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
    _vendor = vendor;
    _editVendor = vendor;
    console.log(type)
    if(type == "apply") {
        _status = Constants.STATE_VENDOR_APPLICAITON_REVIEWING;
    }
    else {
        _status = Constants.STATE_VENDOR_APPLICAITON_DRAFT;
    }

    Store.emitChange();
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

        default:
        // no op
    }
});

module.exports = Store;