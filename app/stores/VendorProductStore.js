var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var HidogsConstants = require('../constants/HidogsConstants');
var assign = require('object-assign');
var keyMirror = require('keymirror');

var CHANGE_EVENT = 'change';
var STATUS_LIST = keyMirror({
    LIST: null,
    LIST_LOADING: null,
    PRODUCT: null,
    EDIT: null,
    NEW: null,
    DELETE: null,
    ERROR: null
});
/*
var _products = {
    1:{id:'1',name:'5星剪毛服务',price:'159',category:'美容'},
    2:{id:'2',name:'普通剪毛服务',price:'80',category:'美容'}
};
*/

// Store State
var _products = {};
var _product = {};
var _status = STATUS_LIST.LIST;



// Get Product List - Start
function viewProductList(callback) {
    _status = STATUS_LIST.LIST;

    VendorProductStore.emitChange();
}

function onLoadProductList() {
    _status = STATUS_LIST.LIST_LOADING;

    VendorProductStore.emitChange();
};

function onLoadProductListSuccess(productList) {
    _products = productList;
    _status = STATUS_LIST.LIST;

    VendorProductStore.emitChange();
};

function onLoadProductListFail() {
    _products = {};
    _product = {};
    _status = STATUS_LIST.ERROR;

    VendorProductStore.emitChange();
};
// Get Product List - End



// Get Product - Start
function onGetProduct(id) {
    for(i in _products) {
        if(id == _products[i]._id) {
            _product = _products[i];
        }
    }
    _status = STATUS_LIST.PRODUCT;

    VendorProductStore.emitChange();
};

function onGetProductSuccess(product) {
    _product = product;

    VendorProductStore.emitChange();
}

function onGetProductFail() {
    _products = {};
    _product = {};
    _status = STATUS_LIST.ERROR;

    VendorProductStore.emitChange();
}
// Get Product - End



// Delete Product - Start
function viewProductDelete(product) {
    _product = product;
    _status = STATUS_LIST.DELETE;

    VendorProductStore.emitChange();
};

function onDeleteProduct(product) {
    for(i in _products) {
        if(_products[i]._id == product._id) {
            delete _products[i];
            break;
        }
    }

    _product = {};
    _status = STATUS_LIST.LIST;

    VendorProductStore.emitChange();
}

function onDeleteProductSuccess(product) {
    _product = {};
    _status = STATUS_LIST.LIST;

    VendorProductStore.emitChange();
}

function onDeleteProductFail() {
    _products = {};
    _product = {};
    _status = STATUS_LIST.ERROR;

    VendorProductStore.emitChange();
}
// Delete Product - End



// New Product - Start
function viewNewProduct() {
    _product = {};
    _status = STATUS_LIST.NEW;

    VendorProductStore.emitChange();
};

function onNewProduct(product) {
    _products.push(product);
    _product = {};
    _status = STATUS_LIST.LIST;

    VendorProductStore.emitChange();
}

function onNewProductSuccess(product) {
    _product = {};
    _status = STATUS_LIST.LIST;

    VendorProductStore.emitChange();
}

function onNewProductFail(product) {
    _product = {};
    _status = STATUS_LIST.ERROR;

    VendorProductStore.emitChange();
}
// New Product - End



// Edit Product - Start
function viewProductEdit(product) {
    _product = product;
    _status = STATUS_LIST.EDIT;

    VendorProductStore.emitChange();
}

function onEditProduct(product) {
    for(i in _products) {
        if(_products[i]._id == product._id) {
            var productKeys = Object.keys(product);

            for(j in productKeys) {
                _products[i][productKeys[j]] = product[productKeys[j]];
            }

            break;
        }
    }

    _product = {};
    _status = STATUS_LIST.LIST;

    VendorProductStore.emitChange();
}

function onEditProductSuccess(product) {
    _product = {};
    _status = STATUS_LIST.LIST;

    VendorProductStore.emitChange();
}

function onEditProductFail(product) {
    _products = {};
    _product = {};
    _status = STATUS_LIST.ERROR;

    VendorProductStore.emitChange();
}
// Edit Product - End



var VendorProductStore = assign({}, EventEmitter.prototype, {
    getStatusList: function() {
        return STATUS_LIST;
    },

    getAll: function() {
        return _products;
    },

    getProduct: function() {
        return _product;
    },

    getStatus: function() {
        return _status;
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



AppDispatcher.register(function(action) {

    switch (action.actionType) {
        // New Product - Start
        case HidogsConstants.HIDOGS_VENDOR_PRODUCT_VIEW_PRODUCT_NEW:

            viewNewProduct();
            break;

        case HidogsConstants.HIDOGS_VENDOR_PRODUCT_NEW_PRODUCT:
            var product = action.product;
            onNewProduct(product);
            break;

        case HidogsConstants.HIDOGS_VENDOR_PRODUCT_NEW_PRODUCT_SUCCESS:
            var product = action.product;
            onNewProductSuccess(product);
            break;

        case HidogsConstants.HIDOGS_VENDOR_PRODUCT_NEW_PRODUCT_FAIL:
            onNewProductFail(product);
            break;
        // New Product - End



        // Edit Product - Start
        case HidogsConstants.HIDOGS_VENDOR_PRODUCT_VIEW_PRODUCT_EDIT:
            var product = action.product;

            viewProductEdit(product);
            break;

        case HidogsConstants.HIDOGS_VENDOR_PRODUCT_EDIT_PRODUCT:
            var product = action.product;
            onEditProduct(product);
            break;

        case HidogsConstants.HIDOGS_VENDOR_PRODUCT_EDIT_PRODUCT_SUCCESS:
            onEditProductSuccess();
            break;

        case HidogsConstants.HIDOGS_VENDOR_PRODUCT_EDIT_PRODUCT_FAIL:
            onEditProductFail();
            break;
        // Edit Product - End



        // Delete Product - Start
        case HidogsConstants.HIDOGS_VENDOR_PRODUCT_VIEW_PRODUCT_DELETE:
            var product = action.product;

            viewProductDelete(product);
            break;

        case HidogsConstants.HIDOGS_VENDOR_PRODUCT_DELETE_PRODUCT:
            var product = action.product;

            onDeleteProduct(product);
            break;

        case HidogsConstants.HIDOGS_VENDOR_PRODUCT_DELETE_PRODUCT_SUCCESS:
            var product = action.product;

            onDeleteProductSuccess(product);
            break;

        case HidogsConstants.HIDOGS_VENDOR_PRODUCT_DELETE_PRODUCT_FAIL:
            onDeleteProductFail();
            break;
        // Delete Product - End



        // Get Product List - Start
        case HidogsConstants.HIDOGS_VENDOR_PRODUCT_VIEW_PRODUCT_LIST:

            viewProductList();
            break;

        case HidogsConstants.HIDOGS_VENDOR_PRODUCT_GET_PRODUCT_LIST:

            onLoadProductList();
            break;

        case HidogsConstants.HIDOGS_VENDOR_PRODUCT_GET_PRODUCT_LIST_SUCCESS:
            var productList = JSON.parse(action.payload.response);
            onLoadProductListSuccess(productList);
            break;

        case HidogsConstants.HIDOGS_VENDOR_PRODUCT_GET_PRODUCT_LIST_FAIL:
            onLoadProductListFail();
            break;
        // Get Product List - End



        // Get Product - Start
        case HidogsConstants.HIDOGS_VENDOR_PRODUCT_VIEW_PRODUCT:
            var id = action.id;
            onGetProduct(id);
            break;

        case HidogsConstants.HIDOGS_VENDOR_PRODUCT_GET_PRODUCT_SUCCESS:
            var product = JSON.parse(action.payload.response);
            onGetProductSuccess(product);
            break;

        case HidogsConstants.HIDOGS_VENDOR_PRODUCT_GET_PRODUCT_FAIL:
            onGetProductFail();
            break;
        // Get Product - End

        default:
        // no op
    }
});

module.exports = VendorProductStore;