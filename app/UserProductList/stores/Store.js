var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var AppDispatcher = require('../../Common/dispatcher/AppDispatcher');
var Constants = require('../constants/Constants');
var CHANGE_EVENT = 'change';

var gju = require('geojson-utils')

// Store State
var _address = "";
var _location = {};
var _productList = [];
var _status = "";
var _wxSign = {};

// Store actions
function initLoadProductList(productList) {
    _productList = productList.map(function(item) {

        // calculate rate
        if(item.rate && parseInt(item.rate.no) > 0) {
            item.rate.score = parseInt(item.rate.sum) / parseInt(item.rate.no);
        }
        else {
            item.rate = {
                sum: 0,
                no: 0,
                score: 0,
            }
        }

        // calculate avg price

        if(item.price.basic.length > 0) {
            var smallPrice = 999999999;
            var bigPrice = 0
            item.price.basic.forEach(function(priceItem) {
                var price = priceItem.price ? parseInt(priceItem.price) : 0;

                if(price > bigPrice) {
                    bigPrice = price;
                }

                if(price < smallPrice) {
                    smallPrice = price;
                }
            });
            item.price.avgPrice = (smallPrice + bigPrice) / 2;
        }
        else {
            item.price.avgPrice = 0;
        }

        // calculate distance
        if(_location) {
            item.distance = gju.pointDistance(_location, item.location);
        }

        return item
    })

    _productList.sort(function(a,b){return a.rate.score<b.rate.score?1:-1});

    Store.emitChange();
};

function initAddress(address) {
    _address = address;
    Store.emitChange();
};

function initLocation(location) {
    _location = location;
    Store.emitChange();
}

// Sort
function sortByScore() {
    _productList.sort(function(a,b){return a.rate.score<b.rate.score?1:-1});

    Store.emitChange();
};

function sortBySaleNo() {
    _productList.sort(function(a,b){return a.sale_no<b.sale_no?1:-1});

    Store.emitChange();
};

function sortByDistance() {
    _productList.sort(function(a,b){return a.distance>b.distance?1:-1});

    Store.emitChange();
};

function sortByPrice() {
    _productList.sort(function(a,b){return a.price.avgPrice<b.price.avgPrice?1:-1});

    Store.emitChange();
};

// Other
function getWXSignatureSuccess(signature) {
    _wxSign = signature;

    Store.emitChange();
};

// Err Handling
function err(msg) {
    console.log(msg);
    alert("好像出了点问题,请刷新页面重试一下.抱歉.");
};

// Store definition
var Store = assign({}, EventEmitter.prototype, {

    getAddress: function() {
        return _address;
    },

    getLocation: function() {
        return _location;
    },

    getProductList: function() {
        return _productList;
    },

    getStatus: function() {
        return _status;
    },

    getWXSign: function() {
        return _wxSign;
    },

    emitChange: function() {
        this.emit(CHANGE_EVENT);
    },

    /**
     * @param {function} callback
     */
    addChangeListener: function(callback) {
        this.on(CHANGE_EVENT, callback);
    },

    /**
     * @param {function} callback
     */
    removeChangeListener: function(callback) {
        this.removeListener(CHANGE_EVENT, callback);
    }
});

// Handle dispatcher
AppDispatcher.register(function(action) {

    switch (action.actionType) {

        // init
        case Constants.INIT_LOAD_PRODUCT_LIST:
            var result = JSON.parse(action.payload.response)
            initLoadProductList(result.productList);
            break;

        case Constants.INIT_ADDRESS:
            initAddress(action.address);
            break;

        case Constants.INIT_LOCATION:
            initLocation(action.location);
            break;

        // sort
        case Constants.SORT_SCORE:
            sortByScore();
            break;

        case Constants.SORT_SALE_NO:
            sortBySaleNo();
            break;

        case Constants.SORT_DISTANCE:
            sortByDistance();
            break;

        case Constants.SORT_PRICE:
            sortByPrice();
            break;

        // Other
        case Constants.ACTION_GET_WX_SIGNATURE_SUCCESS:
            var signature = JSON.parse(action.payload.response);

            getWXSignatureSuccess(signature);
            break;

        // Err Handling
        case Constants.INIT_FAIL:
        case Constants.ACTION_GET_WX_SIGNATURE_FAIL:
            err(action.actionType);
            break;

        default:
            err("no action catch");
    }
});

module.exports = Store;