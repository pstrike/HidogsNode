var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var HidogsConstants = require('../constants/HidogsConstants');
var assign = require('object-assign');
var db = require('../../db/db');

var CHANGE_EVENT = 'change';

var _location = {};

function getLocationById(id, callback){
    $.ajax({
        url: "http://localhost:3000/" + "location/" + id,
        cache: false,
        success: function(data) {
            _location = data;
            callback();
        }.bind(this),
        error: function(xhr, status, err) {
            console.error(this.props.url, status, err.toString());
        }.bind(this)
    });
}

var LocationStore = assign({}, EventEmitter.prototype, {
    getLocation: function() {
        return _location;
    },

    getInitLocation: function(id) {
        _location = db.locations[id];
        return _location;
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

AppDispatcher.register(function(action) {
    var text;

    switch(action.actionType) {
        case HidogsConstants.HIDOGS_GET_LOCATION:

            getLocationById(action.id, function() {LocationStore.emitChange();});
            break;

        case HidogsConstants.HIDOGS_GET_INIT_LOCATION:

            getLocationState()(action.id, function() {LocationStore.emitChange();});
            break;

        default:
        // no op
    }
});

module.exports = LocationStore;