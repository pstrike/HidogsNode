var AppDispatcher = require('../../Common/dispatcher/AppDispatcher');
var HidogsConstants = require('../../Common/constants/HidogsConstants');
var Constants = require('../constants/Constants');
var HGRC = require('../../Common/remotecall/session');
var RC = require('../remotecall/RC');

var Actions = {

    init: function() {
        var userId;
        var user;
        var productList = [];
        var vendorList = [];

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
                actionType: Constants.ACTION_LOAD_USER_SUCCESSFUL,
                payload: payload,
            });

            user = JSON.parse(payload.response);
            if(user.fav_list) {
                productList = user.fav_list.product;
            }

            return RC.getProductList(productList);
        }).then(function (payload) {
            AppDispatcher.dispatch({
                actionType: Constants.ACTION_LOAD_PRODUCT_LIST_SUCCESSFUL,
                payload: payload,
            });

            if(user.fav_list) {
                vendorList = user.fav_list.vendor;
            }

            return RC.getVendorList(vendorList);
        }).then(function (payload) {
                AppDispatcher.dispatch({
                    actionType: Constants.ACTION_LOAD_VENDOR_LIST_SUCCESSFUL,
                    payload: payload,
                });
            }, function (err) {
            AppDispatcher.dispatch({
                actionType: Constants.ACTION_INIT_FAIL,
            });
        });
    },

    viewProductList: function() {
        AppDispatcher.dispatch({
            actionType: Constants.ACTION_VIEW_PRODUCT_LIST,
        });
    },

    viewVendorList: function() {
        AppDispatcher.dispatch({
            actionType: Constants.ACTION_VIEW_VENDOR_LIST,
        });
    },

};

module.exports = Actions;
