var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var AppDispatcher = require('../../Common/dispatcher/AppDispatcher');
var Constants = require('../constants/Constants');
var CHANGE_EVENT = 'change';

// Store State
var _vendorList = [];
var _vendor = {};
var _status = "";

// Store actions
function getVendorListSuccess(vendorList) {
    _vendorList = vendorList;

    Store.emitChange();
};

function getVendorSuccess(vendor) {
    _vendor = vendor;

    Store.emitChange();
};

function getVendorSuccessFake(id) {
    for(var i=0; i<_vendorList.length; i++) {
        if(_vendorList[i].vendor_id == id) {
            _vendor = _vendorList[i];
            break;
        }
    }

    Store.emitChange();
};

function updateVendorSuccessFake(vendor) {
    _vendor = vendor;

    for(var i=0; i<_vendorList.length; i++) {
        if(_vendorList[i]._id == vendor._id) {
            _vendorList[i].status = vendor.status;
            break;
        }
    }

    Store.emitChange();
}

function updateVendorSuccess(vendor) {
    _vendor = vendor;

    for(var i=0; i<_vendorList.length; i++) {
        if(_vendorList[i]._id == vendor._id) {
            _vendorList[i] = vendor;
            break;
        }
    }

    Store.emitChange();
}

// Store definition
var Store = assign({}, EventEmitter.prototype, {

    getVendorList: function() {
        return _vendorList;
    },

    getVendor: function() {
        return _vendor;
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
        case Constants.ACTION_GET_VENDOR_LIST_SUCCESS:
            var vendorList = JSON.parse(action.payload.response);
            getVendorListSuccess(vendorList);
            break;

        case Constants.ACTION_GET_VENDOR_SUCCESS:
            var vendor = JSON.parse(action.payload.response);
            getVendorSuccess(vendor);
            break;

        case Constants.ACTION_GET_VENDOR_SUCCESS_FAKE:
            var id = action.id;
            getVendorSuccessFake(id);
            break;

        case Constants.ACTION_UPDATE_VENDOR_SUCCESS_FAKE:
            var vendor = action.vendor;
            updateVendorSuccessFake(vendor);
            break;

        case Constants.ACTION_UPDATE_VENDOR_SUCCESS:
            var vendor = JSON.parse(action.payload.response);
            updateVendorSuccess(vendor);
            break;

        default:
        // no op
    }
});

module.exports = Store;