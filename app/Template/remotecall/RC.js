var APIUtils = require('../../Common/webapiutils/APIUtils');

var RemoteCall = {
    getObject: function (callback) {
        var url = APIUtils.makeUrl("url");
        APIUtils.get(url, callback);
    },

    updateObject: function (object, callback) {
        var url = APIUtils.makeUrl("url"+object._id);
        APIUtils.put(url, object, callback);
    }
};

module.exports = RemoteCall;