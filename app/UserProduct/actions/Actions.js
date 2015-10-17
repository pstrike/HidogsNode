var AppDispatcher = require('../../Common/dispatcher/AppDispatcher');
var HidogsConstants = require('../../Common/constants/HidogsConstants');
var Constants = require('../constants/Constants');
var RC = require('../remotecall/RC');

var Actions = {

    createOrder: function(order) {

        RC.insertOrderPromise(order).then(function(response) {
            order["_id"]=JSON.parse(response.response)._id;
            return RC.payOrderPromise(order);
        }, function(err) {
            AppDispatcher.dispatch({
                actionType: Constants.PAY_ORDER_FAIL
            });
        }).then(function(payload) {
            AppDispatcher.dispatch({
                actionType: Constants.PAY_ORDER_SUCCESS,
                payload: payload
            });
        }, function(err) {
            AppDispatcher.dispatch({
                actionType: Constants.PAY_ORDER_FAIL
            });
        });
    },

    getProduct: function(id) {
        RC.getProductPromise(id).then(function (payload) {
            AppDispatcher.dispatch({
                actionType: Constants.GET_PRODUCT_SUCCESS,
                payload: payload
            });
        }, function (err) {
            AppDispatcher.dispatch({
                actionType: Constants.GET_PRODUCT_FAIL
            });
        });
    },

};

module.exports = Actions;
