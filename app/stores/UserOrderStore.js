var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var HidogsConstants = require('../constants/HidogsConstants');
var assign = require('object-assign');

var CHANGE_EVENT = 'change';

function createOrder(userId, coupon)
{
    $.ajax({
        url: "http://localhost:3000/" + "order",
        type: 'post',
        data: {userId: userId, coupon: coupon},
        datatype: "json",
        cache: false,
        success: function(data) {
            console.log('create order done')
            pingpp.createPayment(data, function(result, err) {
                console.log(result);
                console.log(err);
            });
        }.bind(this),
        error: function(xhr, status, err) {
            console.error(this.props.url, status, err.toString());
        }.bind(this)
    });
}

var UserOrderStore = assign({}, EventEmitter.prototype, {

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
        case HidogsConstants.HIDOGS_CREATE_ORDER:

            createOrder(action.userId, action.coupon);
            UserOrderStore.emitChange();
            break;

        default:
        // no op
    }
});

module.exports = UserOrderStore;