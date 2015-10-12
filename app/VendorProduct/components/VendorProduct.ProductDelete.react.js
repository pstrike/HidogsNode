/** @jsx React.DOM */

var React = require('react');
var HidogsActions = require('../actions/VendorProdutActions');

var ProductDelete = React.createClass({

    render: function() {

        return (
            <div className="modal fade" id="ProductDeleteModal" tabindex="-3" role="dialog"
                 aria-labelledby="ProductDetailModalLabel" data-backdrop="static">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button type="button" className="close" onClick={this._onCancel} aria-label="Close"><span
                                aria-hidden="true">&times;</span></button>
                            <h4 className="modal-title" id="ProductDetailModalTitle">删除服务</h4>
                        </div>

                        <div className="modal-body">
                            确定删除<strong>{this.props.product.name}</strong>?
                        </div>

                        <div className="modal-footer">
                            <button type="button" className="btn btn-danger"
                                    onClick={this._onSubmit}>确定
                            </button>
                            <button type="button" className="btn btn-default"
                                    onClick={this._onCancel}>关闭
                            </button>
                        </div>
                    </div>
                </div>
            </div>

        );
    },

    _onSubmit: function () {
        $('#ProductDeleteModal').modal('hide');
        HidogsActions.vendorProductDeleteProduct(this.props.product);

    },

    _onCancel: function () {
        $('#ProductDeleteModal').modal('hide');
        HidogsActions.vendorProductViewProductList();
    },
});

module.exports = ProductDelete;