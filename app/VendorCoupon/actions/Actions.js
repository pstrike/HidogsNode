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

            return RC.getCouponList(vendorId);
        }).then(function (payload) {
            AppDispatcher.dispatch({
                actionType: Constants.ACTION_INIT_LOAD_COUPON_LIST_SUCCESSFUL,
                payload: payload,
            });

        }, function (err) {
            AppDispatcher.dispatch({
                actionType: Constants.ACTION_INIT_FAIL,
            });
        });
    },
};

module.exports = Actions;
