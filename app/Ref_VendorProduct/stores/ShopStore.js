var AppDispatcher = require('../../Common/dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var HidogsConstants = require('../../Common/constants/HidogsConstants');
var assign = require('object-assign');

var CHANGE_EVENT = 'change';

var _shop = {};

function getShopById(id, callback){
    $.ajax({
        //url: "http://localhost:3000/" + "shop/" + id,
        //url: window.location.host + "/shop/" + id,
        url: "http://120.25.105.129:3000/shop/" + id,
        cache: false,
        success: function(data) {
            _shop = data;
            callback();
        }.bind(this),
        error: function(xhr, status, err) {
            console.error(this.props.url, status, err.toString());
        }.bind(this)
    });
}

var ShopStore = assign({}, EventEmitter.prototype, {
    getShop: function() {
        return _shop;
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
        case HidogsConstants.HIDOGS_GET_SHOP:

            getShopById(action.id, function() {ShopStore.emitChange();});
            break;

        default:
        // no op
    }
});

module.exports = ShopStore;