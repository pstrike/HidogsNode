var AppDispatcher = require('../../Common/dispatcher/AppDispatcher');
var HidogsConstants = require('../../Common/constants/HidogsConstants');
var HGRC = require('../../Common/remotecall/session');
var Constants = require('../constants/Constants');
var RC = require('../remotecall/RC');

var Actions = {

    init: function() {
        var userId;
        var user;
        var couponIdList = [];

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
                actionType: Constants.ACTION_INIT_LOAD_USER_SUCCESSFUL,
                payload: payload,
            });

            user = JSON.parse(payload.response);
            if(user.coupon_list) {
                couponIdList = user.coupon_list;
            }

            return RC.getCouponList(couponIdList);
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

    submitCouponCode: function(codeObject) {
        RC.checkAndAddCode(codeObject).then(function (payload) {
            var response = JSON.parse(payload.response);

            if(response.result == "ok") {
                AppDispatcher.dispatch({
                    actionType: Constants.ACTION_ADD_COUPON,
                    coupon: response.coupon,
                });
            }
            else {
                AppDispatcher.dispatch({
                    actionType: Constants.ACTION_ADD_INVALID_COUPON,
                    payload: payload,
                });
            }

        }, function (err) {
            AppDispatcher.dispatch({
                actionType: Constants.ACTION_ADD_COUPON_FAIL,
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
