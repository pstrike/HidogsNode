var AppDispatcher = require('../dispatcher/AppDispatcher');
var HidogsConstants = require('../constants/HidogsConstants');

var HidogsActions = {

    /**
     * @param  {string} text
     */
    getLocation: function(id) {
        AppDispatcher.dispatch({
            actionType: HidogsConstants.HIDOGS_GET_LOCATION,
            id: id
        });
    },

    getInitLocation: function(id) {
        AppDispatcher.dispatch({
            actionType: HidogsConstants.HIDOGS_GET_INIT_LOCATION,
            id: id
        });
    },

    createOrder: function(userId, coupon) {
        AppDispatcher.dispatch({
            actionType: HidogsConstants.HIDOGS_CREATE_ORDER,
            userId: userId,
            coupon: coupon
        });
    },

    getShopById: function(id) {
        AppDispatcher.dispatch({
            actionType: HidogsConstants.HIDOGS_GET_SHOP,
            id: id
        });
    }

};

module.exports = HidogsActions;
