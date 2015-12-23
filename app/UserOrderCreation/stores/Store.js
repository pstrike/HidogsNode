var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var AppDispatcher = require('../../Common/dispatcher/AppDispatcher');
var Constants = require('../constants/Constants');
var Actions = require('../actions/Actions');
var HGConstants = require('../../Common/constants/HidogsConstants');
var Prototype = require('../../../model/prototype');
var Uudi = require('../../../util/genuuid');
var CHANGE_EVENT = 'change';

// Store State
var _session = {};
var _product = {};
var _availability = [];
var _order = Prototype.getOrderPrototype();
var _verifyMsg = "";
var _status = "";

// Store actions
function payOrderSuccessful(charge) {
    pingpp.createPayment(charge, function(result, error){
        if (result == "success") {
            // 只有微信公众账号 wx_pub 支付成功的结果会在这里返回，其他的 wap 支付结果都是在 extra 中对应的 URL 跳转。
            window.location = "http://www.hidogs.cn/order/view/userordercreationdone?productid="+_product.product_id+"&orderid="+_order.order_id;

        } else if (result == "fail") {
            // charge 不正确或者微信公众账号支付失败时会在此处返回
            alert("支付失败");

            cancelOrder();

        } else if (result == "cancel") {
            // 微信公众账号支付取消支付
            var notice = {
                type: "user",
                order: _order,
                template: HGConstants.USER_TBPAID,
            };
            Actions.sendWXNotice(notice, cancelOrder);

        }
    }.bind(this));
};

function loadProductSuccessful(product) {
    _product = product;

    _order.product.product_id = _product.product_id;
    _order.product.product_title = _product.title;
    _order.product.product_category.name = _product.category.name;
    _order.product.product_category.slug = _product.category.slug;
    _order.product.product_category.path_name = _product.category.path_name;
    _order.product.product_category.path_slug = _product.category.path_slug;

    _order.vendor.vendor_id = _product.vendor.vendor_id;
    _order.vendor.vendor_name = _product.vendor.vendor_name;
    _order.vendor.vendor_head_image_url = _product.vendor.head_image_url;

    _order.address = _product.address;
    _order.location = _product.location;

    //console.log("load product");
    //console.log(_product);

    Store.emitChange();
};

function loadSessionSuccessful(session) {
    _session = session;
    _status = ""; // if it is reload, reset status to blank

    _order.order_id = Uudi.uuid();
    _order.user.user_id = _session.user_id;
    _order.user.user_name = _session.nick_name;
    _order.user.user_head_image_url = _session.head_image_url;

    //console.log("load session");
    //console.log(_session);

    Store.emitChange();
};

function loadAvailabilitySuccessful(payload) {
    _availability = payload;

    //console.log("load availability");
    //console.log(_availability);

    Store.emitChange();
};

function showVerifyMsg(msg) {
    _verifyMsg = msg;

    Store.emitChange();
};

function cancelOrder() {
    window.location = "http://www.hidogs.cn/product/view/userproductprecheck?product="+_product.product_id;
};

function updateOrderSuccessful() {
    alert("update order done");
};

function createOrderSuccessful(order) {
    _order = order;
    _verifyMsg = "";

    Store.emitChange();
};

function timeslotUnavailable() {
    _status = Constants.STATE_RELOAD;
    _order.booked_time.start_time = "";
    _order.booked_time.end_time = "";
    alert("手一慢... 想订的时间没了. 请选择新的服务时间.");

    Store.emitChange();
};

// Err Handling
function err(msg) {
    console.log(msg);
    alert("好像出了点问题,请刷新页面重试一下.抱歉.");
};

// Store definition
var Store = assign({}, EventEmitter.prototype, {

    getProduct: function() {
        return _product;
    },

    getOrder: function() {
        return _order;
    },

    getSession: function() {
        return _session;
    },

    getAvailability: function() {
        return _availability;
    },

    getStatus: function() {
        return _status;
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
        case Constants.ACTION_PAYMENT_SUCCESSFUL:
            var payload = action.payload.response;
            payOrderSuccessful(payload);
            break;

        case Constants.ACTION_LOAD_PRODUCT_SUCCESSFUL:
            var payload = JSON.parse(action.payload.response);
            loadProductSuccessful(payload);
            break;

        case Constants.ACTION_LOAD_SESSION_SUCCESSFUL:
            var payload = JSON.parse(action.payload.response);
            loadSessionSuccessful(payload);
            break;

        case Constants.ACTION_LOAD_AVAILABILITY_SUCCESSFUL:
            var payload = JSON.parse(action.payload.response);
            loadAvailabilitySuccessful(payload);
            break;

        case Constants.ACTION_SHOW_VERIFY_MSG:
            var msg = action.msg;
            showVerifyMsg(msg);
            break;

        case Constants.ACTION_CANCEL:
            cancelOrder();
            break;

        case Constants.ACTION_CREATE_ORDER_SUCCESSFUL:

            var response = JSON.parse(action.payload.response);
            var order = action.order;
            order.created_time = new Date(response.created_time)
            createOrderSuccessful(order);
            break;

        case Constants.ACTION_SHOW_TIMESLOT_UNAVAILABLE:
            timeslotUnavailable();
            break;

        case Constants.ACTION_PAYMENT_FAIL:
        case Constants.ACTION_CREATE_ORDER_FAIL:
        case Constants.ACTION_LOAD_PRODUCT_FAIL:
        case Constants.ACTION_LOAD_SESSION_FAIL:
            err(action.actionType);

        default:
            err("no action catch");
    }
});

module.exports = Store;