var keyMirror = require('keymirror');

module.exports = keyMirror({
    // actions
    INIT_VENDOR_SUCCESSFUL: null,
    INIT_FAIL: null,
    ACTION_TRIGGER_EDIT_FROM_VIEW: null,
    ACTION_TRIGGER_VIEW_FROM_EDIT: null,
    ACTION_SAVE_FAKE: null,
    ACTION_SAVE_SUCCESSFUL: null,
    ACTION_SAVE_FAIL: null,

    // WX
    ACTION_GET_WX_SIGNATURE_SUCCESS: null,
    ACTION_GET_WX_SIGNATURE_FAIL: null,

    // Verify Msg
    VERIFY_ACTION: null,

    // states
    STATE_VIEW: null,
    STATE_EDIT: null,


});
