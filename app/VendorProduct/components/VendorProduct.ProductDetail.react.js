/** @jsx React.DOM */

var React = require('react');
var HidogsActions = require('../actions/VendorProdutActions');

var ProductDetail = React.createClass({

    render: function() {

        return (
            <div className="modal fade" id="ProductDetailModal" tabindex="-2" role="dialog"
                 aria-labelledby="ProductDetailModalLabel" data-backdrop="static">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button type="button" className="close" onClick={this._onCancel} aria-label="Close"><span
                                aria-hidden="true">&times;</span></button>
                            <h4 className="modal-title" id="ProductDetailModalTitle">服务详情</h4>
                        </div>

                        <div className="modal-body">
                            <dl>
                                <h4>服务名称</h4>

                                <p>{this.props.product.name}</p>
                                <h4>服务类别</h4>

                                <p>{this.props.product.category}</p>
                                <h4>服务价格</h4>

                                <p>{this.props.product.price}</p>
                                <h4>服务描述</h4>

                                <p>{this.props.product.description}</p>
                            </dl>
                        </div>

                        <div className="modal-footer">
                            <button type="button" className="btn btn-default"
                                    onClick={this._onCancel}>关闭
                            </button>
                        </div>
                    </div>
                </div>
            </div>

        );
    },

    _onCancel: function () {
        $('#ProductDetailModal').modal('hide');
        HidogsActions.vendorProductViewProductList();
    },
});

module.exports = ProductDetail;