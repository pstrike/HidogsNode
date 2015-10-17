/** @jsx React.DOM */

var React = require('react');
var VendorProductConstants = require('../constants/VendorProductConstants');
var HidogsActions = require('../actions/VendorProdutActions');

var ProductForm = require('./VendorProduct.ProductForm.react.js');
var ProductDetail = require('./VendorProduct.ProductDetail.react.js');
var ProductDelete = require('./VendorProduct.ProductDelete.react.js');

var ProductModal = React.createClass({

    componentDidUpdate: function () {
        var status = this.props.status;

        switch (status) {
            case VendorProductConstants.VENDOR_PRODUCT_STORE_STATE_NEW:
                this.applyModalFullScreen();
                $('#productFormModal').modal('show');
                break;

            case VendorProductConstants.VENDOR_PRODUCT_STORE_STATE_PRODUCT:
                this.applyModalFullScreen();
                $('#ProductDetailModal').modal('show');
                $('#ProductDetailModalTitle').focus();
                break;

            case VendorProductConstants.VENDOR_PRODUCT_STORE_STATE_EDIT:
                this.applyModalFullScreen();
                $('#productFormModal').modal('show');
                break;

            case VendorProductConstants.VENDOR_PRODUCT_STORE_STATE_DELETE:
                this.applyModalFullScreen();
                $('#ProductDeleteModal').modal('show');
                break;

            default:

        }
    },

    render: function () {

        var status = this.props.status;
        var meta = this.props.meta;

        switch (status) {
            case VendorProductConstants.VENDOR_PRODUCT_STORE_STATE_PRODUCT:
                return (
                    <ProductDetail product={this.props.product}/>
                )
                break;

            case VendorProductConstants.VENDOR_PRODUCT_STORE_STATE_EDIT:
                return (
                    <ProductForm product={this.props.product} status={this.props.status} meta={meta}/>
                )
                break;

            case VendorProductConstants.VENDOR_PRODUCT_STORE_STATE_NEW:
                return (
                    <ProductForm status={this.props.status} meta={meta}/>
                )
                break;

            case VendorProductConstants.VENDOR_PRODUCT_STORE_STATE_DELETE:
                return (
                    <ProductDelete product={this.props.product} status={this.props.status}/>
                )
                break;

            default :
                return (
                    <ProductForm status={this.props.status}/>
                )
        }

    },

    applyModalFullScreen: function() {
        $(".modal-fullscreen").on('show.bs.modal', function () {
            setTimeout( function() {
                $(".modal-backdrop").addClass("modal-backdrop-fullscreen");
            }, 0);
        });
        $(".modal-fullscreen").on('hidden.bs.modal', function () {
            $(".modal-backdrop").addClass("modal-backdrop-fullscreen");
        });
    },


});

module.exports = ProductModal;

