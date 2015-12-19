var AppDispatcher = require('../../Common/dispatcher/AppDispatcher');
var HidogsConstants = require('../../Common/constants/HidogsConstants');
var VendorProductConstants = require('../constants/VendorProductConstants');
var VendorProductRC = require('../remotecall/VendorProductRC');

var HidogsActions = {

    /**
     * @param  {string} text
     */
    getLocation: function (id) {
        AppDispatcher.dispatch({
            actionType: VendorProductConstants.HIDOGS_GET_LOCATION,
            id: id
        });
    },

    getInitLocation: function (id) {
        AppDispatcher.dispatch({
            actionType: VendorProductConstants.HIDOGS_GET_INIT_LOCATION,
            id: id
        });
    },

    createOrder: function (userId, coupon) {
        AppDispatcher.dispatch({
            actionType: VendorProductConstants.HIDOGS_CREATE_ORDER,
            userId: userId,
            coupon: coupon
        });
    },

    getShopById: function (id) {
        AppDispatcher.dispatch({
            actionType: VendorProductConstants.HIDOGS_GET_SHOP,
            id: id
        });
    },


    // Product List - Start
    vendorProductViewProductList: function () {
        AppDispatcher.dispatch({
            actionType: VendorProductConstants.HIDOGS_VENDOR_PRODUCT_VIEW_PRODUCT_LIST
        });
    },

    vendorProductGetProductList: function () {
        AppDispatcher.dispatch({
            actionType: VendorProductConstants.HIDOGS_VENDOR_PRODUCT_GET_PRODUCT_LIST
        });

        VendorProductRC.getOrderListPromise().then(function (payload) {
            AppDispatcher.dispatch({
                actionType: VendorProductConstants.HIDOGS_VENDOR_PRODUCT_GET_PRODUCT_LIST_SUCCESS,
                payload: payload
            });
        }, function (err) {
            AppDispatcher.dispatch({
                actionType: VendorProductConstants.HIDOGS_VENDOR_PRODUCT_GET_PRODUCT_LIST_FAIL
            });
        });
    },
    // Product List - End


    // Product - Start
    vendorProductViewProduct: function (id) {
        AppDispatcher.dispatch({
            actionType: VendorProductConstants.HIDOGS_VENDOR_PRODUCT_VIEW_PRODUCT,
            id: id
        });

        VendorProductRC.getProductByIdPromise(id).then(function (payload) {
            AppDispatcher.dispatch({
                actionType: VendorProductConstants.HIDOGS_VENDOR_PRODUCT_GET_PRODUCT_SUCCESS,
                payload: payload
            });
        }, function (err) {
            AppDispatcher.dispatch({
                actionType: VendorProductConstants.HIDOGS_VENDOR_PRODUCT_GET_PRODUCT_FAIL,
                payload: fileName
            });
        });
    },
    // Product - End


    // New Product - Start
    vendorProductViewNewProduct: function () {
        AppDispatcher.dispatch({
            actionType: VendorProductConstants.HIDOGS_VENDOR_PRODUCT_VIEW_PRODUCT_NEW
        });

        VendorProductRC.getProductMetaPromise().then(function (payload) {
            AppDispatcher.dispatch({
                actionType: VendorProductConstants.HIDOGS_VENDOR_PRODUCT_META_PRODUCT_SUCCESS,
                payload: payload
            });
        }, function (err) {
            AppDispatcher.dispatch({
                actionType: VendorProductConstants.HIDOGS_VENDOR_PRODUCT_META_PRODUCT_FAIL
            });
        });
    },

    vendorProductNewProduct: function (product) {
        AppDispatcher.dispatch({
            actionType: VendorProductConstants.HIDOGS_VENDOR_PRODUCT_NEW_PRODUCT,
            product: product
        });

        VendorProductRC.insertProductPromise(product).then(function (payload) {
            AppDispatcher.dispatch({
                actionType: VendorProductConstants.HIDOGS_VENDOR_PRODUCT_NEW_PRODUCT_SUCCESS,
                payload: payload
            });
        }, function (err) {
            AppDispatcher.dispatch({
                actionType: VendorProductConstants.HIDOGS_VENDOR_PRODUCT_NEW_PRODUCT_FAIL
            });
        });
    },
    // New Product - End


    // Edit Product - Start
    vendorProductViewProductEdit: function (product) {
        AppDispatcher.dispatch({
            actionType: VendorProductConstants.HIDOGS_VENDOR_PRODUCT_VIEW_PRODUCT_EDIT,
            product: product
        });

        VendorProductRC.getProductByIdPromise(product._id).then(function (payload) {
            AppDispatcher.dispatch({
                actionType: VendorProductConstants.HIDOGS_VENDOR_PRODUCT_GET_PRODUCT_SUCCESS,
                payload: payload
            });
        }, function (err) {
            AppDispatcher.dispatch({
                actionType: VendorProductConstants.HIDOGS_VENDOR_PRODUCT_GET_PRODUCT_FAIL,
                payload: fileName
            });
        });
    },

    vendorProductEditProduct: function (product) {
        AppDispatcher.dispatch({
            actionType: VendorProductConstants.HIDOGS_VENDOR_PRODUCT_EDIT_PRODUCT,
            product: product
        });

        VendorProductRC.updateProduct(product, function (payload) {
            if (payload.response == HidogsConstants.WEB_UTILS_REQUEST_TIMEOUT
                || payload.response == HidogsConstants.WEB_UTILS_REQUEST_NOT_FOUND
                || payload.response == HidogsConstants.WEB_UTILS_REQUEST_ERROR) {

                AppDispatcher.dispatch({
                    actionType: VendorProductConstants.HIDOGS_VENDOR_PRODUCT_EDIT_PRODUCT_FAIL
                });
            }
            else {
                AppDispatcher.dispatch({
                    actionType: VendorProductConstants.HIDOGS_VENDOR_PRODUCT_EDIT_PRODUCT_SUCCESS,
                    payload: payload
                });
            }
        });
    },
    // Edit Product - End


    // Delete Product - Start
    vendorProductViewProductDelete: function (product) {
        AppDispatcher.dispatch({
            actionType: VendorProductConstants.HIDOGS_VENDOR_PRODUCT_VIEW_PRODUCT_DELETE,
            product: product
        });
    },

    vendorProductDeleteProduct: function (product) {
        AppDispatcher.dispatch({
            actionType: VendorProductConstants.HIDOGS_VENDOR_PRODUCT_DELETE_PRODUCT,
            product: product
        });

        VendorProductRC.deleteProduct(product, function (payload) {
            if (payload.response == HidogsConstants.WEB_UTILS_REQUEST_TIMEOUT
                || payload.response == HidogsConstants.WEB_UTILS_REQUEST_NOT_FOUND
                || payload.response == HidogsConstants.WEB_UTILS_REQUEST_ERROR) {

                AppDispatcher.dispatch({
                    actionType: VendorProductConstants.HIDOGS_VENDOR_PRODUCT_DELETE_PRODUCT_FAIL
                });
            }
            else {
                AppDispatcher.dispatch({
                    actionType: VendorProductConstants.HIDOGS_VENDOR_PRODUCT_DELETE_PRODUCT_SUCCESS,
                    payload: payload
                });
            }
        });
    },
    // Delete Product - End


    // Upload Picture - Begin
    uploadPicture: function (data, fileName) {

        VendorProductRC.uploadPicturePromise(data).then(function (payload) {
            AppDispatcher.dispatch({
                actionType: VendorProductConstants.UPLOAD_FILE_SUCCESS,
                payload: payload
            });
        }, function (err) {
            AppDispatcher.dispatch({
                actionType: VendorProductConstants.UPLOAD_FILE_FAIL,
                payload: fileName
            });
        });
    },

    removePicture: function (fileName) {
        AppDispatcher.dispatch({
            actionType: VendorProductConstants.REMOVE_FILE,
            payload: fileName
        });
    },
    // Upload Picture - End
};

module.exports = HidogsActions;
