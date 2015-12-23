var AppDispatcher = require('../../Common/dispatcher/AppDispatcher');
var HidogsConstants = require('../../Common/constants/HidogsConstants');
var HGRC = require('../../Common/remotecall/session');
var Constants = require('../constants/Constants');
var RC = require('../remotecall/RC');

var Actions = {

    init: function(vendorId) {
        RC.getVendor(vendorId).then(function (payload) {
            AppDispatcher.dispatch({
                actionType: Constants.INIT_LOAD_VENDOR_SUCCESSFUL,
                payload: payload,
            });

            return RC.getProductList(vendorId);
        }).then(function (payload) {
            AppDispatcher.dispatch({
                actionType: Constants.INIT_LOAD_PRODUCT_LIST_SUCCESSFUL,
                payload: payload,
            });
        }, function (err) {
            AppDispatcher.dispatch({
                actionType: Constants.INIT_FAIL,
            });
        });
    },

    getSessionThenUser: function() {
        var userId;

        HGRC.getSession().then(function (payload) {
            var response = JSON.parse(payload.response);

            userId = response.user_id;

            AppDispatcher.dispatch({
                actionType: HidogsConstants.HIDOGS_SESSION_LOAD_SUCCESSFUL,
                payload: payload,
            });

            return RC.getUserPromise(userId);
        }).then(function (payload) {
            AppDispatcher.dispatch({
                actionType: Constants.ACTION_PRODUCT_LOAD_USER_SUCCESSFUL,
                payload: payload,
            });
        }, function(err) {
            AppDispatcher.dispatch({
                actionType: Constants.ACTION_PRODUCT_LOAD_USER_FAIL,
            });
        });
    },

    // Fav
    updateUserFav: function(user) {
        AppDispatcher.dispatch({
            actionType: Constants.ACTION_PRODUCT_FAV_FAKE,
            user: user,
        });

        RC.updateUser(user).then(function (payload) {
            AppDispatcher.dispatch({
                actionType: Constants.ACTION_PRODUCT_FAV_SUCCESSFUL,
                payload: payload,
            });
        }, function (err) {
            AppDispatcher.dispatch({
                actionType: Constants.ACTION_PRODUCT_FAV_FAIL,
            });
        });
    },



};

module.exports = Actions;
