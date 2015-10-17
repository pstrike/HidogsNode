var request = require('superagent');
var HidogsConstants = require('../constants/HidogsConstants');

var API_URL = 'http://www.hidogs.cn:3000';
//var API_URL = 'http://localhost:3000';
//var API_URL = 'http://192.168.0.107:3000';
var TIMEOUT = 10000;
var TOKEN = 'token123';

var APIUtils = {

    makeUrl: function(part) {
        return API_URL + part;
    },

    get: function(url, callback) {
        return request
            .get(url)
            .timeout(TIMEOUT)
            .query({authtoken: TOKEN})
            .end(
            function (err, res) {
                var payload;

                if (err && err.timeout === TIMEOUT) {
                    payload = {response: HidogsConstants.WEB_UTILS_REQUEST_TIMEOUT};
                } else if (res.status === 400) {
                    //UserActions.logout();
                    payload = {response: HidogsConstants.WEB_UTILS_REQUEST_NOT_FOUND};
                } else if (!res.ok) {
                    payload = {response: HidogsConstants.WEB_UTILS_REQUEST_ERROR};
                } else {
                    payload = {response: res.text};
                }

                callback(payload);
            }
        );
    },

    put: function(url, payload, callback) {
        return request
            .put(url)
            .send(payload)
            .timeout(TIMEOUT)
            .query({authtoken: TOKEN})
            .end(
            function (err, res) {
                var payload;

                if (err && err.timeout === TIMEOUT) {
                    payload = {response: HidogsConstants.WEB_UTILS_REQUEST_TIMEOUT};
                } else if (res.status === 400) {
                    //UserActions.logout();
                    payload = {response: HidogsConstants.WEB_UTILS_REQUEST_NOT_FOUND};
                } else if (!res.ok) {
                    payload = {response: HidogsConstants.WEB_UTILS_REQUEST_ERROR};
                } else {
                    payload = {response: res.text};
                }

                callback(payload);
            }
        );

    },

    post: function(url, payload, callback) {
        return request
            .post(url)
            .send(payload)
            .timeout(TIMEOUT)
            .query({authtoken: TOKEN})
            .end(
            function (err, res) {
                var payload;

                if (err && err.timeout === TIMEOUT) {
                    payload = {response: HidogsConstants.WEB_UTILS_REQUEST_TIMEOUT};
                } else if (res.status === 400) {
                    //UserActions.logout();
                    payload = {response: HidogsConstants.WEB_UTILS_REQUEST_NOT_FOUND};
                } else if (!res.ok) {
                    payload = {response: HidogsConstants.WEB_UTILS_REQUEST_ERROR};
                } else {
                    payload = {response: res.text};
                }

                callback(payload);
            }
        );
    },

};

module.exports = APIUtils;