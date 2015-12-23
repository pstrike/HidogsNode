var AppDispatcher = require('../../Common/dispatcher/AppDispatcher');
var HidogsConstants = require('../../Common/constants/HidogsConstants');
var HGRC = require('../../Common/remotecall/session');

var Constants = require('../constants/Constants');
var RC = require('../remotecall/RC');

var Actions = {

    init: function() {
        var vendorId;

        HGRC.getSession().then(function (payload) {
            var response = JSON.parse(payload.response);

            vendorId = response.vendor_id;

            AppDispatcher.dispatch({
                actionType: HidogsConstants.HIDOGS_SESSION_LOAD_SUCCESSFUL,
                payload: payload,
            });

            return RC.getVendor(vendorId);
        }).then(function (payload) {
            AppDispatcher.dispatch({
                actionType: Constants.INIT_VENDOR_SUCCESSFUL,
                payload: payload,
            });
        }, function(err) {
            AppDispatcher.dispatch({
                actionType: Constants.INIT_FAIL,
            });
        });
    },

    triggerEditFromView: function() {
        AppDispatcher.dispatch({
            actionType: Constants.ACTION_TRIGGER_EDIT_FROM_VIEW
        });
    },

    triggerViewFromEdit: function() {
        AppDispatcher.dispatch({
            actionType: Constants.ACTION_TRIGGER_VIEW_FROM_EDIT
        });
    },

    updateProfile: function(vendor) {
        AppDispatcher.dispatch({
            actionType: Constants.ACTION_SAVE_FAKE,
            vendor: vendor,
        });

        RC.updateVendorProfilePromise(vendor).then(function (payload) {
            AppDispatcher.dispatch({
                actionType: Constants.ACTION_SAVE_SUCCESSFUL,
                payload: payload,
            });
        }, function (err) {
            AppDispatcher.dispatch({
                actionType: Constants.ACTION_SAVE_FAKE,
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

    // Verify Msg
    verify: function(msg) {
        AppDispatcher.dispatch({
            actionType: Constants.VERIFY_ACTION,
            msg: msg,
        });
    },
};

module.exports = Actions;
