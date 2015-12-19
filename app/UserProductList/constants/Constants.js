var keyMirror = require('keymirror');

module.exports = keyMirror({
    // actions
    INIT_LOAD_PRODUCT_LIST: null,
    INIT_ADDRESS: null,
    INIT_FAIL: null,

    // sort
    SORT_SCORE: null,
    SORT_SALE_NO: null,
    SORT_DISTANCE: null,
    SORT_PRICE: null,

    // WX
    ACTION_GET_WX_SIGNATURE_SUCCESS: null,
    ACTION_GET_WX_SIGNATURE_FAIL: null,

    // states
    STATE_INIT_LOCATION: null,
    STATE_INIT_PRODUCT_LIST: null,
    STATE_PRODUCT_LIST: null,

});
