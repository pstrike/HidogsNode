var keyMirror = require('keymirror');

module.exports = keyMirror({
    // actions
    ACTION_INIT_FAIL: null,

    ACTION_LOAD_USER_SUCCESSFUL: null,
    ACTION_LOAD_USER_FAIL: null,

    ACTION_LOAD_PRODUCT_LIST_SUCCESSFUL: null,
    ACTION_LOAD_PRODUCT_LIST_FAIL: null,

    ACTION_LOAD_VENDOR_LIST_SUCCESSFUL: null,
    ACTION_LOAD_VENDOR_LIST_FAIL: null,

    ACTION_VIEW_PRODUCT_LIST: null,
    ACTION_VIEW_VENDOR_LIST: null,

    // states
    STATE_PRODUCT: null,
    STATE_VENDOR: null,


});
