var AppDispatcher = require('../../Common/dispatcher/AppDispatcher');
var Constants = require('../constants/Constants');
var RC = require('../remotecall/RC');

var Actions = {

    getSessionOpenid: function() {
        RC.getSessionOpenidPromise().then(function (payload) {
            AppDispatcher.dispatch({
                actionType: Constants.ACTION_GET_OPENID_SUCCESS,
                payload: payload
            });
        }, function (err) {
            AppDispatcher.dispatch({
                actionType: Constants.ACTION_GET_OPENID_FAIL
            });
        });
    },

    getVendorProfile: function(openid) {
        RC.getVendorProfilePromise(openid).then(function (payload) {
            AppDispatcher.dispatch({
                actionType: Constants.ACTION_GET_VENDOR_PROFILE_SUCCESS,
                payload: payload
            });
        }, function (err) {
            AppDispatcher.dispatch({
                actionType: Constants.ACTION_GET_VENDOR_PROFILE_FAIL
            });
        });
    },

    getSessionOpenidThenLoadVendorProfile: function() {
        RC.getSessionOpenidPromise().then(function (payload) {
            var openid = JSON.parse(payload.response).openid;
            return RC.getVendorProfilePromise(openid);
        }, function (err) {
            AppDispatcher.dispatch({
                actionType: Constants.ACTION_GET_OPENID_FAIL
            });
        }).then(function(payload) {
            AppDispatcher.dispatch({
                actionType: Constants.ACTION_GET_VENDOR_PROFILE_SUCCESS,
                payload: payload,
            });
        }, function(err) {
            AppDispatcher.dispatch({
                actionType: Constants.ACTION_GET_VENDOR_PROFILE_FAIL
            });
        });
    },

    updateVendorProfile: function(vendor, type) {
        AppDispatcher.dispatch({
            actionType: Constants.ACTION_UPDATE_VENDOR_PROFILE_FAKE,
            vendor: vendor,
            type: type,
        });

        RC.updateVendorProfilePromise(vendor).then(function (payload) {
            AppDispatcher.dispatch({
                actionType: Constants.ACTION_UPDATE_VENDOR_PROFILE_SUCCESS,
                payload: payload
            });
        }, function (err) {
            AppDispatcher.dispatch({
                actionType: Constants.ACTION_UPDATE_VENDOR_PROFILE_FAIL
            });
        });

    },

    cancelProfileEdit: function() {
        AppDispatcher.dispatch({
            actionType: Constants.ACTION_CANCEL_PROFILE_EDIT,
        });

    },

    triggerProfileEdit: function() {
        AppDispatcher.dispatch({
            actionType: Constants.ACTION_TRIGGER_PROFILE_EDIT,
        });

    },

    // Upload Picture - Begin
    uploadPicture: function (data, fileName, path) {

        RC.uploadPicturePromise(data).then(function (payload) {
            AppDispatcher.dispatch({
                actionType: Constants.ACTION_UPLOAD_PIC_SUCCESS,
                payload: payload,
                path: path
            });
        }, function (err) {
            AppDispatcher.dispatch({
                actionType: Constants.ACTION_UPLOAD_PIC_FAIL,
                payload: fileName
            });
        });
    },

    removePicture: function (fileName) {
        AppDispatcher.dispatch({
            actionType: Constants.ACTION_REMOVE_PIC,
            payload: fileName
        });
    },
    // Upload Picture - End

};

module.exports = Actions;
