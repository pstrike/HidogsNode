var keyMirror = require('keymirror');

module.exports = keyMirror({

    // actions
    ACTION_GET_OPENID_SUCCESS: null,
    ACTION_GET_OPENID_FAIL: null,

    ACTION_GET_VENDOR_PROFILE_SUCCESS: null,
    ACTION_GET_VENDOR_PROFILE_FAIL: null,

    ACTION_UPDATE_VENDOR_PROFILE_FAKE: null,
    ACTION_UPDATE_VENDOR_PROFILE_SUCCESS: null,
    ACTION_UPDATE_VENDOR_PROFILE_FAIL: null,
    ACTION_UPDATE_VENDOR_PROFILE_SHOW: null,



    // states
    STATE_VENDOR_APPLICAITON_LOADING : null,
    STATE_VENDOR_APPLICAITON_DRAFT : null,
    STATE_VENDOR_APPLICAITON_CREATED : null,
    STATE_VENDOR_APPLICAITON_REVIEWING : null,
    STATE_VENDOR_APPLICAITON_REJECT : null,
    STATE_VENDOR_APPLICAITON_APPROVED : null,

    STATE_FAIL : null,

});