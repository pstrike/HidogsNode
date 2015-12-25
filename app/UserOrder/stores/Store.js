var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var AppDispatcher = require('../../Common/dispatcher/AppDispatcher');
var Constants = require('../constants/Constants');
var CHANGE_EVENT = 'change';

// Store State
var _session = {};
var _orderList = [];
var _orderListData = [];
var _order = {};
var _product = {};
var _vendor = {};
var _user = {};
var _availability = [];
var _couponList = [];
var _verifyMsg = [];
var _status = Constants.ORDER_LIST;

// Store actions

// init
function initSession(session) {
    _session = session;

    //console.log(_session);

    Store.emitChange();
};

function initOrderList(orderList) {
    _orderListData = orderList;
    _orderList = orderList;

    //console.log(_orderList);

    Store.emitChange();
};

// List
function filterOrderList(filter) {
    _orderList = [];

    if(filter.length == 1 && filter[0] == "all") {
        _orderList = _orderListData;
    }
    else {
        _orderListData.forEach(function(orderItem) {
            filter.forEach(function(filterItem) {
                if(orderItem.status == filterItem) {
                    _orderList.push(orderItem);
                }
            }.bind(orderItem))
        })
    }

    Store.emitChange();
};

function listTriggerOrderDetail(order) {
    _status = Constants.ORDER_DETAIL;
    _order = order;

    Store.emitChange();
};

// Detail
function detailTrigerOrderList() {
    _status = Constants.ORDER_LIST;
    _order = {};
    _orderList = _orderListData;

    Store.emitChange();
};

function loadOrderDetailSuccessful(order) {
    _order = order;

    console.log(_order);

    Store.emitChange();
};

function loadProductSuccessful(product) {
    _product = product;

    //console.log(_product);

    Store.emitChange();
};

function loadVendorSuccessful(vendor) {
    _vendor = vendor;

    //console.log(_vendor);

    Store.emitChange();
};

function loadCouponSuccessful(couponList) {
    _couponList = couponList;

    // if the order is tbpaid, to check whether the coupon is already used or not
    if(_order.status == 'tbpaid') {
        var isCouponValid = false;
        for(var i=0; i<_couponList.length; i++) {
            if(_couponList[i].coupon_id == _order.price.coupon.coupon_id) {
                isCouponValid = true;
                break;
            }
        }

        if(!isCouponValid) {
            _order.price.coupon = {
                title: "优惠码已失效",
                off_percentage: 0.0,
            }
            _order.price.discount = 0.0;
        }
    }

    Store.emitChange();
}

function showNoAvailableTimeSlot() {
    _order.tmp_show_reschedule_btn = true;

    alert('下手慢了,想预约的时间被订了.请您通过"调整预订时间"按钮调整服务时间');

    Store.emitChange();
};

function paySuccessful(charge) {
    pingpp.createPayment(charge, function(result, error){
        if (result == "success") {
            // 只有微信公众账号 wx_pub 支付成功的结果会在这里返回，其他的 wap 支付结果都是在 extra 中对应的 URL 跳转。
            //alert("支付成功");

            _order.status = "tbconfirmed";

            for(var i=0; i<_orderList.length; i++) {
                if(_order.order_id == _orderList[i].order_id) {
                    _orderList[i].status = _order.status;

                    break;
                }
            }

            for(var i=0; i<_orderListData.length; i++) {
                if(_order.order_id == _orderListData[i].order_id) {
                    _orderListData[i].status = _order.status;

                    break;
                }
            }

            _status = Constants.ORDER_DETAIL;

            Store.emitChange();

        } else if (result == "fail") {
            // charge 不正确或者微信公众账号支付失败时会在此处返回
            //alert("支付失败");
        } else if (result == "cancel") {
            // 微信公众账号支付取消支付
            //alert("支付取消");

            Store.emitChange();
        }
    }.bind(this));
};

function reschedule() {
    _status = Constants.ORDER_RESCHEDULE;

    Store.emitChange();
};

function comment() {
    _status = Constants.ORDER_COMMENT;

    Store.emitChange();
};

function cancelOrder(order) {
    _order.status = order.status;

    for(var i=0; i<_orderList.length; i++) {
        if(order.order_id == _orderList[i].order_id) {
            _orderList[i].status = order.status;

            break;
        }
    }

    for(var i=0; i<_orderListData.length; i++) {
        if(order.order_id == _orderListData[i].order_id) {
            _orderListData[i].status = order.status;

            break;
        }
    }

    _status = Constants.ORDER_DETAIL;

    Store.emitChange();
};

function cancelOrderSuccessful() {
    // do nothing
};

function refundOrder() {
    _status = Constants.ORDER_REFUND;

    Store.emitChange();
};


// Reschedule
function loadAvailabilitySuccessful(availability) {
    _availability = availability;

    Store.emitChange();
};

function triggerRescheduleToDetail(order) {
    _order.booked_time = order.booked_time;
    _order.tmp_show_reschedule_btn = false;

    _status = Constants.ORDER_DETAIL;

    _verifyMsg = [];

    Store.emitChange();
};

function submitRescheduleSuccessful() {
    // do nothing
};

function cancelRescheduleToDetail() {
    _status = Constants.ORDER_DETAIL;

    Store.emitChange();
};

// Comment
function triggerCommentToDetail(product, order) {
    _product.comment_list = product.comment_list;
    _order.status = order.status;
    _order.comment = order.comment;
    _verifyMsg = [];

    for(var i=0; i<_orderList.length; i++) {
        if(order.order_id == _orderList[i].order_id) {
            _orderList[i].status = order.status;

            break;
        }
    }

    for(var i=0; i<_orderListData.length; i++) {
        if(order.order_id == _orderListData[i].order_id) {
            _orderListData[i].status = order.status;

            break;
        }
    }

    _status = Constants.ORDER_DETAIL;

    Store.emitChange();
};

function submitCommentProductSuccessful() {
    // do nothing
};

function submitCommentOrderSuccessful() {
    // do nothing
};

function submitCommentVendorSuccessful() {
    // do nothing
};

function cancelCommentToDetail() {
    _status = Constants.ORDER_DETAIL;

    Store.emitChange();
};

// Refund
function cancelRefundOrder() {
    _status = Constants.ORDER_DETAIL;

    Store.emitChange();
};

function refundTriggerDetail(order) {
    _order.status = order.status;
    _order.refund = order.refund;
    _verifyMsg = [];

    for(var i=0; i<_orderList.length; i++) {
        if(order.order_id == _orderList[i].order_id) {
            _orderList[i].status = order.status;

            break;
        }
    }

    for(var i=0; i<_orderListData.length; i++) {
        if(order.order_id == _orderListData[i].order_id) {
            _orderListData[i].status = order.status;

            break;
        }
    }

    _status = Constants.ORDER_DETAIL;

    Store.emitChange();
};

function refundSubmitSuccessful() {
    // do nothing
};

function loadUserSuccessful(user) {
    _user = user;

    Store.emitChange();
}

// Verify Msg
function showVerifyMsg(msg) {
    _verifyMsg = msg;

    Store.emitChange();
};

// Err Handling
function err(msg) {
    console.log("[Err] "+msg);
    alert("好像出了点问题,请刷新页面重试一下.抱歉.");
};

// Store definition
var Store = assign({}, EventEmitter.prototype, {

    getSession: function() {
        return _session;
    },

    getOrderList: function() {
        return _orderList;
    },

    getOrder: function() {
        return _order;
    },

    getProduct: function() {
        return _product;
    },

    getVendor: function() {
        return _vendor;
    },

    getUser: function() {
        return _user;
    },

    getStatus: function() {
        return _status;
    },

    getAvailability: function() {
        return _availability;
    },

    getCouponList: function() {
        return _couponList;
    },

    getVerifyMsg: function() {
        return _verifyMsg;
    },

    emitChange: function() {
        this.emit(CHANGE_EVENT);
    },

    /**
     * @param {function} callback
     */
    addChangeListener: function(callback) {
        this.on(CHANGE_EVENT, callback);
    },

    /**
     * @param {function} callback
     */
    removeChangeListener: function(callback) {
        this.removeListener(CHANGE_EVENT, callback);
    }
});

// Handle dispatcher
AppDispatcher.register(function(action) {

    switch (action.actionType) {
        // Init
        case Constants.INIT_LOAD_SESSION:
            var session = action.response;

            initSession(session);
            break;

        case Constants.INIT_LOAD_ORDER_LIST:
            var orderList = JSON.parse(action.payload.response);

            initOrderList(orderList);
            break;

        // List
        case Constants.LIST_FILTER:
            filterOrderList(action.filter);
            break;

        case Constants.LIST_TRIGGER_ORDER_DETAIL:
            listTriggerOrderDetail(action.order);
            break;

        // Detail
        case Constants.DETAIL_TRIGGER_ORDER_LIST:
            detailTrigerOrderList();
            break;

        case Constants.DETAIL_LOAD_ORDER_DETAIL_SUCCESSFUL:
            var order = JSON.parse(action.payload.response);

            loadOrderDetailSuccessful(order);
            break;

        case Constants.DETAIL_LOAD_PRODUCT_SUCCESSFUL:
            var product = JSON.parse(action.payload.response);

            loadProductSuccessful(product);
            break;

        case Constants.DETAIL_LOAD_VENDOR_SUCCESFUL:
            var vendor = JSON.parse(action.payload.response);

            loadVendorSuccessful(vendor);
            break;

        case Constants.DETAIL_LOAD_COUPON_SUCCESFUL:
            loadCouponSuccessful(JSON.parse(action.payload.response));
            break;

        case Constants.DETAIL_NO_AVAILABLE_TIMESLOT:
            showNoAvailableTimeSlot();
            break;

        case Constants.DETAIL_PAY_SUCCESSFUL:
            var payload = action.payload.response;
            paySuccessful(payload);
            break;

        case Constants.DETAIL_TRIGGER_ORDER_RESCHEDULE:
            reschedule();
            break;

        case Constants.DETAIL_TRIGGER_ORDER_COMMENT:
            comment();
            break;

        case Constants.DETAIL_CANCEL_ORDER:
            cancelOrder(action.order);
            break;

        case Constants.DETAIL_CANCEL_ORDER_SUBMIT_SUCCSSFUL:
            cancelOrderSuccessful();
            break;

        case Constants.DETAIL_REFUND_ORDER:
            refundOrder();
            break;

        // Reschedule
        case Constants.RESCHEDULE_LOAD_AVAILABILITY_SUCCESSFUL:
            var availability = JSON.parse(action.payload.response)
            loadAvailabilitySuccessful(availability);
            break;

        case Constants.RESCHEDULE_SUBMIT_TRIGGER_DETAIL:
            triggerRescheduleToDetail(action.order);
            break;

        case Constants.RESCHEDULE_SUBMIT_SUCCESSFUL:
            submitRescheduleSuccessful();
            break;

        case Constants.RESCHEDULE_CANCEL_TRIGGER_DETAIL:
            cancelRescheduleToDetail();
            break;

        // Comment
        case Constants.COMMENT_SUBMIT_TRIGGER_DETAIL:
            triggerCommentToDetail(action.product, action.order);
            break;

        case Constants.COMMENT_SUBMIT_PRODUCT_SUCCESSFUL:
            submitCommentProductSuccessful();
            break;

        case Constants.COMMENT_SUBMIT_ORDER_SUCCESSFUL:
            submitCommentOrderSuccessful();
            break;

        case Constants.COMMENT_SUBMIT_VENDOR_SUCCESSFUL:
            submitCommentVendorSuccessful();
            break;

        case Constants.COMMENT_CANCEL_TRIGGER_DETAIL:
            cancelCommentToDetail();
            break;

        // Refund
        case Constants.REFUND_CANCEL_TRIGGER_DETAIL:
            cancelRefundOrder();
            break

        case Constants.REFUND_SUBMIT_TRIGGER_DETAIL:
            refundTriggerDetail(action.order);
            break

        case Constants.REFUND_SUBMIT_SUCCESSFUL:
            refundSubmitSuccessful();
            break

        case Constants.REFUND_LOAD_USER_SUCCESSFUL:
            var user = JSON.parse(action.payload.response);
            loadUserSuccessful(user);
            break;

        // Verify Msg
        case Constants.VERIFY_ACTION:
            var msg = action.msg;
            showVerifyMsg(msg);
            break;

        // Err
        case Constants.INIT_FAIL:
        case Constants.DETAIL_PAY_FAIL:
        case Constants.RESCHEDULE_SUBMIT_FAIL:
        case Constants.COMMENT_SUBMIT_FAIL:
        case Constants.DETAIL_CANCEL_ORDER_SUBMIT_FAIL:
        case Constants.REFUND_SUBMIT_FAIL:
        case Constants.DETAIL_LOAD_ORDER_DETAIL_FAIL:
            err(action.actionType);
            break;

        default:
            err("no action catach");
    }
});

module.exports = Store;