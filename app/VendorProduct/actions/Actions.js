var AppDispatcher = require('../../Common/dispatcher/AppDispatcher');
var HidogsConstants = require('../../Common/constants/HidogsConstants');
var Constants = require('../constants/Constants');
var RC = require('../remotecall/RC');

var Actions = {

    // List Actions
    triggerListToDetail: function() {
        AppDispatcher.dispatch({
            actionType: Constants.ACTION_VENDOR_PRODUCT_LIST_TRIGGER_DETAIL
        });
    },

    triggerListToSetting: function() {
        AppDispatcher.dispatch({
            actionType: Constants.ACTION_VENDOR_PRODUCT_LIST_TRIGGER_SETTING
        });
    },

    triggerListToNew: function() {
        AppDispatcher.dispatch({
            actionType: Constants.ACTION_VENDOR_PRODUCT_LIST_TRIGGER_NEW
        });
    },

    // New Actions
    triggerNewSaveToList: function(newProduct) {
        AppDispatcher.dispatch({
            actionType: Constants.ACTION_VENDOR_PRODUCT_NEW_SAVE_TRIGGER_LIST,
            tmpProduct: newProduct,
        });

        RC.insertProduct(newProduct).then(function (payload) {
            AppDispatcher.dispatch({
                actionType: Constants.ACTION_VENDOR_PRODUCT_NEW_SAVE_DATA_SUCCESS,
                payload: payload,
            });
        }, function (err) {
            AppDispatcher.dispatch({
                actionType: Constants.ACTION_VENDOR_PRODUCT_NEW_SAVE_DATA_FAIL,
            });
        });
    },

    triggerNewCancelToList: function() {
        AppDispatcher.dispatch({
            actionType: Constants.ACTION_VENDOR_PRODUCT_NEW_CANCEL_TRIGGER_LIST
        });
    },

    // Setting Actions
    triggerSettingToSettingEdit: function() {
        AppDispatcher.dispatch({
            actionType: Constants.ACTION_VENDOR_PRODUCT_SETTING_TRIGGER_SETTING_EDIT
        });
    },

    triggerSettingToList: function() {
        AppDispatcher.dispatch({
            actionType: Constants.ACTION_VENDOR_PRODUCT_SETTING_TRIGGER_LIST
        });
    },

    // Setting Edit Actions
    triggerSettingEditSaveToSetting: function() {
        AppDispatcher.dispatch({
            actionType: Constants.ACTION_VENDOR_PRODUCT_SETTING_EDIT_SAVE_TRIGGER_SETTING
        });
    },

    triggerSettingEditCancelToSetting: function() {
        AppDispatcher.dispatch({
            actionType: Constants.ACTION_VENDOR_PRODUCT_SETTING_EDIT_CANCEL_TRIGGER_SETTING
        });
    },

    // Detail Actions
    triggerDetailToList: function() {
        AppDispatcher.dispatch({
            actionType: Constants.ACTION_VENDOR_PRODUCT_DETAIL_TRIGGER_LIST
        });
    },

    triggerDetailToComment: function() {
        AppDispatcher.dispatch({
            actionType: Constants.ACTION_VENDOR_PRODUCT_DETAIL_TRIGGER_COMMENT
        });
    },

    triggerDetailToEdit: function() {
        AppDispatcher.dispatch({
            actionType: Constants.ACTION_VENDOR_PRODUCT_DETAIL_TRIGGER_EDIT
        });
    },

    triggerDetailToPreview: function() {
        AppDispatcher.dispatch({
            actionType: Constants.ACTION_VENDOR_PRODUCT_DETAIL_TRIGGER_PREVIEW
        });
    },

    // Comment Actions
    triggerCommentToDetail: function() {
        AppDispatcher.dispatch({
            actionType: Constants.ACTION_VENDOR_PRODUCT_COMMENT_TRIGGER_DETAIL
        });
    },

    // Edit Actions
    triggerEditSaveToDetail: function() {
        AppDispatcher.dispatch({
            actionType: Constants.ACTION_VENDOR_PRODUCT_EDIT_SAVE_TRIGGER_DETAIL
        });
    },

    triggerEditCancelToDetail: function() {
        AppDispatcher.dispatch({
            actionType: Constants.ACTION_VENDOR_PRODUCT_EDIT_CANCEL_TRIGGER_DETAIL
        });
    },

};

module.exports = Actions;
