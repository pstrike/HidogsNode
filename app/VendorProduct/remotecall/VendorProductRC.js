var APIUtils = require('../../Common/webapiutils/APIUtils');

var VendorProductRC = {
    getProductList: function (callback) {
        var url = APIUtils.makeUrl("/products?projection=name,price_list,category&filter=owner_id,1");
        APIUtils.get(url, callback);
    },

    getProductById: function (id, callback) {
        var url = APIUtils.makeUrl("/product/"+id);
        APIUtils.get(url, callback);
    },

    insertProduct: function (product, callback) {
        var url = APIUtils.makeUrl("/product");
        APIUtils.post(url, product, callback);
    },

    updateProduct: function (product, callback) {
        var url = APIUtils.makeUrl("/product/"+product._id);
        APIUtils.put(url, product, callback);
    },

    deleteProduct: function (product, callback) {
        var url = APIUtils.makeUrl("/product/"+product._id);
        var deletedProduct = {
            "_id":product._id,
            "status":"deleted"
        };

        APIUtils.put(url, deletedProduct, callback);
    }
};

module.exports = VendorProductRC;