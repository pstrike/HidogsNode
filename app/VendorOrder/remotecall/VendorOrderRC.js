var APIUtils = require('../../Common/webapiutils/APIUtils');

var RemoteCall = {
    getOrderList: function (callback) {
        var url = APIUtils.makeUrl("/orders?projection=product_id,user_id,price,status,time");
        APIUtils.get(url, callback);
    },

    checkOrder: function (order, callback) {
        var url = APIUtils.makeUrl("/order/check/"+order._id+"?code="+order.code);
        APIUtils.get(url, callback);
    },

    updateOrder: function (order, callback) {
        var url = APIUtils.makeUrl("/order/"+order._id);
        APIUtils.put(url, order, callback);
    }
};

module.exports = RemoteCall;