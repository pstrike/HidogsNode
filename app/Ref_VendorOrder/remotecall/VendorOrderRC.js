var APIUtils = require('../../Common/webapiutils/APIUtils');

var RemoteCall = {
    getOrderList: function (callback) {
        var url = APIUtils.makeUrl("/orders?projection=product_id,user_id,price,status,booktime");
        APIUtils.get(url, callback);
    },

    checkOrder: function (order, callback) {
        var url = APIUtils.makeUrl("/order/other/"+order._id+"?type=check&code="+order.code);
        APIUtils.get(url, callback);
    },

    updateOrder: function (order, callback) {
        var url = APIUtils.makeUrl("/order/"+order._id);
        APIUtils.put(url, order, callback);
    }
};

module.exports = RemoteCall;