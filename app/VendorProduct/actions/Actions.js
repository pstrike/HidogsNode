var AppDispatcher = require('../../Common/dispatcher/AppDispatcher');
var HidogsConstants = require('../../Common/constants/HidogsConstants');
var Constants = require('../constants/Constants');
var RC = require('../remotecall/RC');

var Actions = {

    // Init
    getSessionOpenidThenProductListThenProductMetaThenProfile: function() {
        var vendorId;
        var role;

        RC.getSession().then(function (payload) { // load session
            if(payload.response) {
                var response = JSON.parse(payload.response);

                vendorId = response.vendor_id;
                role = response.role;

                AppDispatcher.dispatch({
                    actionType: Constants.ACTION_VENDOR_PRODUCT_LIST_LOAD_SESSION_SUCCESSFUL,
                    response: response,
                });

                return RC.getProductList(vendorId);
            }

        }).then(function(payload) { // load product list
            AppDispatcher.dispatch({
                actionType: Constants.ACTION_VENDOR_PRODUCT_LIST_LOAD_LIST_SUCCESSFUL,
                payload: payload,
            });

            return RC.getProductFormMeta(role);
        }).then(function(payload) { // load product meta
            AppDispatcher.dispatch({
                actionType: Constants.ACTION_VENDOR_PRODUCT_LIST_LOAD_META_SUCCESSFUL,
                payload: payload,
            });

            return RC.getVendorProfile(vendorId);
        }).then(function(payload) { // load vendor profile
            AppDispatcher.dispatch({
                actionType: Constants.ACTION_VENDOR_PRODUCT_LIST_LOAD_VENDOR_SUCCESSFUL,
                payload: payload,
            });

            return RC.getProductList('hg1');
        }).then(function(payload) { // load example product
                AppDispatcher.dispatch({
                    actionType: Constants.ACTION_VENDOR_PRODUCT_LIST_LOAD_EXAMPLE_SUCCESSFUL,
                    payload: payload,
                });

        }, function(err) {
            AppDispatcher.dispatch({
                actionType: Constants.ACTION_VENDOR_PRODUCT_LIST_LOAD_SESSION_FAIL,
            });
        });
    },

    loadProductList: function() {

    },

    loadProductMeta: function() {

    },

    // List Actions
    triggerListToDetail: function(productId) {
        AppDispatcher.dispatch({
            actionType: Constants.ACTION_VENDOR_PRODUCT_LIST_TRIGGER_DETAIL,
            productId: productId,
        });

        RC.getProduct(productId).then(function (payload) {
            AppDispatcher.dispatch({
                actionType: Constants.ACTION_VENDOR_PRODUCT_DETAIL_LOAD_DETAIL_SUCCESSFUL,
                payload: payload,
            });

            return RC.getCommentListPromise(productId);
        }).then(function (payload) {
            AppDispatcher.dispatch({
                actionType: Constants.ACTION_VENDOR_PRODUCT_COMMENT_LOAD_DATA_SUCCESSFUL,
                payload: payload,
            });
        }, function (err) {
            AppDispatcher.dispatch({
                actionType: Constants.ACTION_VENDOR_PRODUCT_DETAIL_LOAD_DETAIL_FAIL,
            });
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

    triggerListToAgreement: function() {
        AppDispatcher.dispatch({
            actionType: Constants.ACTION_VENDOR_PRODUCT_LIST_TRIGGER_AGREEMENT
        });
    },

    triggerListToGuide: function() {
        AppDispatcher.dispatch({
            actionType: Constants.ACTION_VENDOR_PRODUCT_LIST_TRIGGER_GUIDE,
        });
    },

    // New Actions
    triggerNewSaveToDetail: function(newProduct) {
        AppDispatcher.dispatch({
            actionType: Constants.ACTION_VENDOR_PRODUCT_NEW_SAVE_TRIGGER_DETAIL,
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

    triggerSettingSaveRejectFlag: function(vendor) {
        RC.updateVendor(vendor).then(function (payload) {
            AppDispatcher.dispatch({
                actionType: Constants.ACTION_VENDOR_PRODUCT_SETTING_SAVE_DATA_SUCCESSFUL,
                payload: payload,
                vendor: vendor,
            });
        }, function (err) {
            AppDispatcher.dispatch({
                actionType: Constants.ACTION_VENDOR_PRODUCT_SETTING_SAVE_DATA_FAIL,
            });
        });
    },

    // Setting Edit Actions
    triggerSettingEditSaveToSetting: function(vendor) {
        AppDispatcher.dispatch({
            actionType: Constants.ACTION_VENDOR_PRODUCT_SETTING_EDIT_SAVE_TRIGGER_SETTING,
            vendor: vendor,
        });

        RC.updateVendor(vendor).then(function (payload) {
            AppDispatcher.dispatch({
                actionType: Constants.ACTION_VENDOR_PRODUCT_SETTING_EDIT_SAVE_DATA_SUCCESSFUL,
                payload: payload,
            });
        }, function (err) {
            AppDispatcher.dispatch({
                actionType: Constants.ACTION_VENDOR_PRODUCT_SETTING_EDIT_SAVE_DATA_FAIL,
            });
        });
    },

    triggerSettingEditCancelToSetting: function() {
        AppDispatcher.dispatch({
            actionType: Constants.ACTION_VENDOR_PRODUCT_SETTING_EDIT_CANCEL_TRIGGER_SETTING
        });
    },

    verifySetting: function(msg) {
        AppDispatcher.dispatch({
            actionType: Constants.ACTION_VENDOR_PRODUCT_SETTING_EDIT_SHOW_VERIFY_MSG,
            msg: msg,
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

    triggerDetailToEdit: function(product) {
        AppDispatcher.dispatch({
            actionType: Constants.ACTION_VENDOR_PRODUCT_DETAIL_TRIGGER_EDIT,
            product: product,
        });

        if(product.product_id) {
            RC.updateProduct(product).then(function (payload) {
                AppDispatcher.dispatch({
                    actionType: Constants.ACTION_VENDOR_PRODUCT_EDIT_SAVE_DATA_SUCCESSFUL,
                    payload: payload,
                });
            }, function (err) {
                AppDispatcher.dispatch({
                    actionType: Constants.ACTION_VENDOR_PRODUCT_EDIT_SAVE_DATA_FAIL,
                });
            });
        }
    },

    triggerDetailToPreview: function(productId) {
        RC.redirectUserProduct(productId).then(function (payload) {
            AppDispatcher.dispatch({
                actionType: Constants.ACTION_VENDOR_PRODUCT_DETAIL_TRIGGER_PREVIEW,
                payload: payload,
            });
        }, function (err) {
            AppDispatcher.dispatch({
                actionType: Constants.ACTION_VENDOR_PRODUCT_DETAIL_TRIGGER_PREVIEW_FAIL,
            });
        });
    },

    publishProduct: function(product) {
        AppDispatcher.dispatch({
            actionType: Constants.ACTION_VENDOR_PRODUCT_DETAIL_PUBLISH,
            product: product,
        });

        RC.updateProduct(product).then(function (payload) {
            AppDispatcher.dispatch({
                actionType: Constants.ACTION_VENDOR_PRODUCT_EDIT_SAVE_DATA_SUCCESSFUL,
                payload: payload,
            });
        }, function (err) {
            AppDispatcher.dispatch({
                actionType: Constants.ACTION_VENDOR_PRODUCT_EDIT_SAVE_DATA_FAIL,
            });
        });
    },

    withdrawProduct: function(product) {
        AppDispatcher.dispatch({
            actionType: Constants.ACTION_VENDOR_PRODUCT_DETAIL_WITHDRAW,
            product: product,
        });

        RC.updateProduct(product).then(function (payload) {
            AppDispatcher.dispatch({
                actionType: Constants.ACTION_VENDOR_PRODUCT_EDIT_SAVE_DATA_SUCCESSFUL,
                payload: payload,
            });
        }, function (err) {
            AppDispatcher.dispatch({
                actionType: Constants.ACTION_VENDOR_PRODUCT_EDIT_SAVE_DATA_FAIL,
            });
        });
    },

    // Comment Actions
    triggerCommentToDetail: function() {
        AppDispatcher.dispatch({
            actionType: Constants.ACTION_VENDOR_PRODUCT_COMMENT_TRIGGER_DETAIL
        });
    },

    // Edit Actions
    triggerEditSaveToDetail: function(product) {
        AppDispatcher.dispatch({
            actionType: Constants.ACTION_VENDOR_PRODUCT_EDIT_SAVE_TRIGGER_DETAIL,
            product: product,
        });

        RC.updateProduct(product).then(function (payload) {
            AppDispatcher.dispatch({
                actionType: Constants.ACTION_VENDOR_PRODUCT_EDIT_SAVE_DATA_SUCCESSFUL,
                payload: payload,
            });
        }, function (err) {
            AppDispatcher.dispatch({
                actionType: Constants.ACTION_VENDOR_PRODUCT_EDIT_SAVE_DATA_FAIL,
            });
        });
    },

    triggerEditDeleteToList: function(product) {
        AppDispatcher.dispatch({
            actionType: Constants.ACTION_VENDOR_PRODUCT_EDIT_DELETE_TRIGGER_LIST,
            product: product,
        });

        RC.updateProduct(product).then(function (payload) {
            AppDispatcher.dispatch({
                actionType: Constants.ACTION_VENDOR_PRODUCT_EDIT_DELETE_DATA_SUCCESSFUL,
                payload: payload,
            });
        }, function (err) {
            AppDispatcher.dispatch({
                actionType: Constants.ACTION_VENDOR_PRODUCT_EDIT_DELETE_DATA_FAIL,
            });
        });
    },

    triggerEditCancelToDetail: function() {
        AppDispatcher.dispatch({
            actionType: Constants.ACTION_VENDOR_PRODUCT_EDIT_CANCEL_TRIGGER_DETAIL
        });
    },

    verifyProduct: function(msg) {
        AppDispatcher.dispatch({
            actionType: Constants.ACTION_VENDOR_PRODUCT_EDIT_SHOW_VERIFY_MSG,
            msg: msg,
        });
    },

    // Agreement Action
    triggerAgreementCancelToList: function() {
        AppDispatcher.dispatch({
            actionType: Constants.ACTION_VENDOR_PRODUCT_AGREEMENT_CANCEL_TRIGGER_LIST,
        });
    },

    triggerAgreementAgreeToList: function(vendor) {
        AppDispatcher.dispatch({
            actionType: Constants.ACTION_VENDOR_PRODUCT_AGREEMENT_AGREE_TRIGGER_LIST,
        });

        RC.updateVendor(vendor).then(function (payload) {
            AppDispatcher.dispatch({
                actionType: Constants.ACTION_VENDOR_PRODUCT_AGREEMENT_AGREE_SUCCESSFUL,
                payload: payload,
            });
        }, function (err) {
            AppDispatcher.dispatch({
                actionType: Constants.ACTION_VENDOR_PRODUCT_AGREEMENT_AGREE_FAIL,
            });
        });
    },

    // Guide
    triggerGuideToList: function() {
        AppDispatcher.dispatch({
            actionType: Constants.ACTION_VENDOR_PRODUCT_GUIDE_TRIGGER_LIST,
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

    uploadWXPicture: function (mediaId, path, type) {

        RC.getWXMedia(mediaId, type).then(function (payload) {
            AppDispatcher.dispatch({
                actionType: Constants.ACTION_GET_WX_MEDIA_SUCCESS,
                payload: payload,
                path: path,
            });
        }, function (err) {
            AppDispatcher.dispatch({
                actionType: Constants.ACTION_GET_WX_MEDIA_FAIL
            });
        });
    },

};

module.exports = Actions;
