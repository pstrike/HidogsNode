var AppDispatcher = require('../dispatcher/AppDispatcher');
var HidogsConstants = require('../constants/HidogsConstants');
var request = require('superagent');

//var API_URL = 'http://www.hidogs.cn:3000';
var API_URL = 'http://localhost:3000';
var TIMEOUT = 10000;

var _pendingRequests = {};

/*
function abortPendingRequests(key) {
    if (_pendingRequests[key]) {
        _pendingRequests[key]._callback = function(){};
        _pendingRequests[key].abort();
        _pendingRequests[key] = null;
    }
}
*/

function token() {
    return "token123";
}

function makeUrl(part) {
    return API_URL + part;
}

function dispatch(key, response, params) {
    var payload = {response: response};
    if (params) {
        payload.queryParams = params;
    }

    AppDispatcher.dispatch({
        actionType: key,
        payload: payload
    });
}

// return successful response, else return request Constants
function makeDigestFun(callback) {
    return function (err, res) {
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
    };
}

// a get request with an authtoken param
function get(url, callback) {
    return request
        .get(url)
        .timeout(TIMEOUT)
        .query({authtoken: token()})
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
}

function post(url, payload, callback) {
    return request
        .post(url)
        .send(payload)
        .timeout(TIMEOUT)
        .query({authtoken: token()})
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
}

function put(url, payload, callback) {
    return request
        .put(url)
        .send(payload)
        .timeout(TIMEOUT)
        .query({authtoken: token()})
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
}

var Api = {

    /*
     getEntityData: function(entityId, callback) {
     var url = makeUrl("/entities/" + entityId);
     var key = HidogsConstants.HIDOGS_VENDOR_PRODUCT_GET_PRODUCT_LIST;
     var params = {entityId: entityId};
     abortPendingRequests(key);
     dispatch(key, Constants.request.PENDING, params);
     _pendingRequests[key] = get(url).end(
     makeDigestFun(key, params)
     );
     }*/

    getProductList: function (callback) {
        var url = makeUrl("/products?projection=name,price_list,category&filter=owner_id,1");
        get(url, callback);
    },

    getProductById: function (id, callback) {
        var url = makeUrl("/product/"+id);
        get(url, callback);
    },

    insertProduct: function (product, callback) {
        var url = makeUrl("/product");
        post(url, product, callback);
    },

    updateProduct: function (product, callback) {
        var url = makeUrl("/product/"+product._id);
        put(url, product, callback);
    },

    deleteProduct: function (product, callback) {
        var url = makeUrl("/product/"+product._id);
        var deletedProduct = {
            "_id":product._id,
            "status":"deleted"
        };

        put(url, deletedProduct, callback);
    }
}

module.exports = Api;