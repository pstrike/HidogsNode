var keyMirror = require('keymirror');

module.exports = keyMirror({
    // actions
    ACTION_INIT_LOAD_USER: null,
    ACTION_INIT_FAIL: null,

    ACTION_UPDATE: null,
    ACTION_UPDATE_OK: null,
    ACTION_UPDATE_FAIL: null,

    ACTION_GET_WX_MEDIA_SUCCESS: null,
    ACTION_GET_WX_MEDIA_FAIL: null,

    ACTION_GET_LOCATION: null,
    ACTION_UPDATE_LOCATION: null,

    // states
    STATE_FORM: null,
    STATE_SAVE_IN_PROGRESS: null,
    STATE_DONE: null,


});
