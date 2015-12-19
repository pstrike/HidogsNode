var AppDispatcher = require('../../Common/dispatcher/AppDispatcher');
var HidogsConstants = require('../../Common/constants/HidogsConstants');
var Constants = require('../constants/Constants');
var RC = require('../remotecall/RC');

var Actions = {

    // Init
    initProductList: function(latitude, longitude) {
        RC.getProductList().then(function (payload) {
            AppDispatcher.dispatch({
                actionType: Constants.INIT_LOAD_PRODUCT_LIST,
                payload: payload,
            });
        }, function (err) {
            AppDispatcher.dispatch({
                actionType: Constants.INIT_FAIL,
            });
        });
    },

    initAddress: function (address) {
        AppDispatcher.dispatch({
            actionType: Constants.INIT_ADDRESS,
            address: address,
        });
    },

    // Sort
    sortByScore: function() {
        AppDispatcher.dispatch({
            actionType: Constants.SORT_SCORE,
        });
    },

    sortBySaleNo: function() {
        AppDispatcher.dispatch({
            actionType: Constants.SORT_SALE_NO,
        });
    },

    sortByDistance: function() {
        AppDispatcher.dispatch({
            actionType: Constants.SORT_DISTANCE,
        });
    },

    sortByPrice: function() {
        AppDispatcher.dispatch({
            actionType: Constants.SORT_PRICE,
        });
    },

    // Other
    getWXSignature: function(url) {
        RC.getWXSignaturePromise(url).then(function (payload) {
            AppDispatcher.dispatch({
                actionType: Constants.ACTION_GET_WX_SIGNATURE_SUCCESS,
                payload: payload,
            });
        }, function (err) {

            AppDispatcher.dispatch({
                actionType: Constants.ACTION_GET_WX_SIGNATURE_FAIL,
            });
        });
    },
};

module.exports = Actions;
