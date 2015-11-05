var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var AppDispatcher = require('../../Common/dispatcher/AppDispatcher');
var Constants = require('../constants/VendorProductConstants');
var CHANGE_EVENT = 'change';

// Store State
var _pic = [];

// Store actions
function uploadFileSuccess(payload) {
    _pic.push({status:"success", url: payload});
    Store.emitChange();
};

function uploadFileFail(fileName) {
    _pic.push({status:"fail", url: fileName});
    Store.emitChange();
};

function removeFile(fileName) {
    for(i in _pic) {
        if(_pic[i].url == fileName) {
            _pic.splice(i,1);
            break;
        }
    }

    Store.emitChange();
};

// Store definition
var Store = assign({}, EventEmitter.prototype, {

    getPicList: function() {
        return _pic;
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

// Handle dispat
AppDispatcher.register(function(action) {

    switch (action.actionType) {
        case Constants.UPLOAD_FILE_SUCCESS:
            var payload = action.payload.response;
            uploadFileSuccess(payload);
            break;

        case Constants.UPLOAD_FILE_FAIL:
            var fileName = action.payload;
            uploadFileFail(fileName);
            break;

        case Constants.REMOVE_FILE:
            var fileName = action.payload;
            removeFile(fileName);
            break;

        default:
        // no op
    }
});

module.exports = Store;