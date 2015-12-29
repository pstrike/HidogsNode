var keyMirror = require('keymirror');

module.exports = keyMirror({
    /* actions */
    // init
    INIT_LOAD_ORDER_LIST: null,
    INIT_LOAD_FAIL: null,

    // List
    LIST_TRIGGER_DETAIL: null,

    // Detail
    DETAIL_TRIGGER_LIST: null,
    DETAIL_TRIGGER_CODE: null,
    DETAIL_TRIGGER_REJECT: null,
    DETAIL_ACCEPT_ORDER_FAKE: null,
    DETAIL_ACCEPT_ORDER_SUCCESSFUL: null,
    DETAIL_ACCEPT_ORDER_FAIL: null,
    DETAIL_LOAD_ORDER: null,
    DETAIL_LOAD_PRODUCT: null,
    DETAIL_LOAD_USER: null,

    // Code
    CODE_TRIGGER_DETAIL: null,
    CODE_SUBMIT_SUCCESSFUL: null,
    CODE_PRODUCT_UPDATE_SUCCESSFUL: null,
    CODE_SUBMIT_FAIL: null,

    // Reject
    REJECT_TRIGGER_DETAIL: null,
    REJECT_ORDER: null,
    REJECT_ORDER_SUCCESSFUL: null,
    REJECT_ORDER_FAIL: null,

    // Verify Msg
    VERIFY_ACTION: null,

    /* states */
    VENDOR_ORDER_LIST: null,
    VENDOR_ORDER_DETAIL: null,
    VENDOR_ORDER_CODE: null,
    VENDOR_ORDER_REJECT: null,


});
