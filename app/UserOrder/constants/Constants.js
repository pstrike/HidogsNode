var keyMirror = require('keymirror');

module.exports = keyMirror({
    // actions

    // Init
    INIT_LOAD_SESSION: null,
    INIT_LOAD_ORDER_LIST: null,
    INIT_FAIL: null,

    // List
    LIST_FILTER: null,
    LIST_TRIGGER_ORDER_DETAIL: null,

    // Detail
    DETAIL_TRIGGER_ORDER_LIST: null,
    DETAIL_TRIGGER_ORDER_RESCHEDULE: null,
    DETAIL_TRIGGER_ORDER_COMMENT: null,
    DETAIL_LOAD_ORDER_DETAIL_SUCCESSFUL: null,
    DETAIL_LOAD_ORDER_DETAIL_FAIL: null,
    DETAIL_LOAD_PRODUCT_SUCCESSFUL: null,
    DETAIL_LOAD_PRODUCT_FAIL: null,
    DETAIL_LOAD_VENDOR_SUCCESFUL: null,
    DETAIL_LOAD_VENDOR_FAIL: null,
    DETAIL_NO_AVAILABLE_TIMESLOT: null,
    DETAIL_PAY_SUCCESSFUL: null,
    DETAIL_PAY_FAIL: null,
    DETAIL_CANCEL_ORDER: null,
    DETAIL_CANCEL_ORDER_SUBMIT_SUCCSSFUL: null,
    DETAIL_CANCEL_ORDER_SUBMIT_FAIL: null,
    DETAIL_REFUND_ORDER: null,

    // Reschedule
    RESCHEDULE_LOAD_AVAILABILITY_SUCCESSFUL: null,
    RESCHEDULE_LOAD_AVAILABILITY_FAIL: null,
    RESCHEDULE_SUBMIT_TRIGGER_DETAIL: null,
    RESCHEDULE_CANCEL_TRIGGER_DETAIL: null,
    RESCHEDULE_SUBMIT_SUCCESSFUL: null,
    RESCHEDULE_SUBMIT_FAIL: null,

    // Comment
    COMMENT_SUBMIT_TRIGGER_DETAIL: null,
    COMMENT_CANCEL_TRIGGER_DETAIL: null,
    COMMENT_SUBMIT_PRODUCT_SUCCESSFUL: null,
    COMMENT_SUBMIT_ORDER_SUCCESSFUL: null,
    COMMENT_SUBMIT_VENDOR_SUCCESSFUL: null,
    COMMENT_SUBMIT_FAIL: null,

    // Refund
    REFUND_CANCEL_TRIGGER_DETAIL: null,
    REFUND_SUBMIT_TRIGGER_DETAIL: null,
    REFUND_SUBMIT_SUCCESSFUL: null,
    REFUND_SUBMIT_FAIL: null,
    REFUND_LOAD_USER_SUCCESSFUL: null,
    REFUND_LOAD_USER_FAIL: null,

    // Verify Msg
    VERIFY_ACTION: null,

    // states
    ORDER_LIST: null,
    ORDER_DETAIL: null,
    ORDER_RESCHEDULE: null,
    ORDER_COMMENT: null,
    ORDER_REFUND: null,

});
