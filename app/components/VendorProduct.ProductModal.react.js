/** @jsx React.DOM */

var React = require('react');
var HidogsActions = require('../actions/VendorProdutActions');

var ProductForm = require('./VendorProduct.ProductForm.react.js');
var ProductDetail = require('./VendorProduct.ProductDetail.react.js');
var ProductDelete = require('./VendorProduct.ProductDelete.react.js');
var VendorProductStore = require('../stores/VendorProductStore');

var ProductModal = React.createClass({

    componentDidUpdate: function () {
        var status = this.props.status;

        switch (status) {
            case VendorProductStore.getStatusList().NEW:
                $('#productFormModal').modal('show');
                break;

            case VendorProductStore.getStatusList().PRODUCT:
                $('#ProductDetailModal').modal('show');
                break;

            case VendorProductStore.getStatusList().EDIT:
                $('#productFormModal').modal('show');
                break;

            case VendorProductStore.getStatusList().DELETE:
                $('#ProductDeleteModal').modal('show');
                break;

            default:

        }
    },

    render: function () {

        var status = this.props.status;

        switch (status) {
            case VendorProductStore.getStatusList().PRODUCT:
                return (
                    <ProductDetail product={this.props.product}/>
                )
                break;

            case VendorProductStore.getStatusList().EDIT:
                return (
                    <ProductForm product={this.props.product} status={this.props.status}/>
                )
                break;

            case VendorProductStore.getStatusList().NEW:
                return (
                    <ProductForm status={this.props.status}/>
                )
                break;

            case VendorProductStore.getStatusList().DELETE:
                return (
                    <ProductDelete product={this.props.product} status={this.props.status}/>
                )
                break;

            default :
                return (
                    <ProductForm status={this.props.status}/>
                )
        }

    }


});

module.exports = ProductModal;

