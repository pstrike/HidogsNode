var AppDispatcher = require('../../Common/dispatcher/AppDispatcher');
var HidogsConstants = require('../../Common/constants/HidogsConstants');
var Constants = require('../constants/Constants');
var RC = require('../remotecall/RC');

var Actions = {

    // Init
    initGeoProductList: function(latitude, longitude, category, keyword) {

        //alert(latitude + "," + longitude + "," + category + "," + keyword);

        RC.getGeoProductList(longitude,latitude,category,keyword).then(function (payload) {
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

    initPopProductList: function(category, keyword) {

        RC.getPopProductList(category,keyword).then(function (payload) {
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

    initLocation: function (location) {
        AppDispatcher.dispatch({
            actionType: Constants.INIT_LOCATION,
            location: location,
        });
    },

    // Modify Location
    triggerModifyLocationFromList: function() {
        AppDispatcher.dispatch({
            actionType: Constants.TRIGGER_MODIFY_LOCATION,
        });
    },

    submitModifyLocation: function() {
        AppDispatcher.dispatch({
            actionType: Constants.SUBMIT_MODIFY_LOCATION,
        });
    },

    cancelModifyLocation: function() {
        AppDispatcher.dispatch({
            actionType: Constants.CANCEL_MODIFY_LOCATION,
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
