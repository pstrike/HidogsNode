var AppDispatcher = require('../dispatcher/AppDispatcher');

var HidogsConstants = require('../constants/HidogsConstants');
var HGWXRC = require('../remotecall/wx');

var Actions = {

    getWXSignature: function(url) {
        HGWXRC.getWXSignaturePromise(url).then(function (payload) {
            AppDispatcher.dispatch({
                actionType: HidogsConstants.HIDOGS_WX_SIGN_LOAD_SUCCEFFUL,
                payload: payload,
            });
        }, function (err) {
            AppDispatcher.dispatch({
                actionType: HidogsConstants.HIDOGS_WX_SIGN_LOAD_FAIL,
            });
        });
    },
};

module.exports = Actions;
