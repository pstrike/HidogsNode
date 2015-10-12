/** @jsx React.DOM */

var React = require('react');
var HidogsActions = require('../actions/VendorProdutActions');
var VendorProductConstants = require('../constants/VendorProductConstants');

var ProductForm = React.createClass({

    componentDidUpdate: function () {
            this.refs.name.getDOMNode().value = this.props.product ? this.props.product.name : "";
            this.refs.category.getDOMNode().value = this.props.product ? this.props.product.category : "";
            this.refs.price.getDOMNode().value = this.props.product ? this.props.product.price : "";
            this.refs.description.getDOMNode().value = this.props.product ? this.props.product.description : "";
    },

    render: function () {
        var title;

        var status = this.props.status;

        if(status == VendorProductConstants.VENDOR_PRODUCT_STORE_STATE_NEW)
            title = "创建新的服务";
        else
            title = "修改服务";

        return (
            <div className="modal fade" id="productFormModal" tabindex="-1" role="dialog"
                 aria-labelledby="myModalLabel" data-backdrop="static">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button type="button" className="close" onClick={this._onCancel}
                                    aria-label="Close"><span
                                aria-hidden="true">&times;</span></button>
                            <h4 className="modal-title" id="myModalLabel">{title}</h4>
                        </div>
                        <div className="modal-body">
                            <form>
                                <div className="form-group">
                                    <label for="productInputName">服务名称</label>
                                    <input type="text" className="form-control" id="productInputName"
                                           placeholder="服务名称" ref="name"/>
                                </div>
                                <div className="form-group">
                                    <label for="productInputCategory">类别</label>
                                    <input type="text" className="form-control" id="productInputCategory"
                                           placeholder="服务类别" ref="category"/>
                                </div>
                                <div className="form-group">
                                    <label for="productInputPrice">价格</label>
                                    <input type="text" className="form-control" id="productInputPrice"
                                           placeholder="服务价格" ref="price"/>
                                </div>
                                <div className="form-group">
                                    <label for="productInputDescription">描述</label>
                                    <textarea className="form-control" rows="5" id="productInputDescription"
                                              placeholder="服务描述" ref="description"></textarea>
                                </div>
                            </form>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-primary"
                                    onClick={this._onSubmit}>提交
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

    _onCancel: function () {
        $('#productFormModal').modal('hide');
        HidogsActions.vendorProductViewProductList();
    },

    _onSubmit: function () {
        $('#productFormModal').modal('hide');

        var status = this.props.status;
        var product = this._getProductFromForm();

        switch (status) {
            case VendorProductConstants.VENDOR_PRODUCT_STORE_STATE_NEW:
                HidogsActions.vendorProductNewProduct(product);
                break;

            case VendorProductConstants.VENDOR_PRODUCT_STORE_STATE_EDIT:
                HidogsActions.vendorProductEditProduct(product);
                break;

            default :
        }
    },

    _getProductFromForm: function () {
        var product = {
            name: this.refs.name.getDOMNode().value,
            category: this.refs.category.getDOMNode().value,
            price: this.refs.price.getDOMNode().value,
            description: this.refs.description.getDOMNode().value
        };

        if(this.props.status != VendorProductConstants.VENDOR_PRODUCT_STORE_STATE_NEW) {
            product["_id"] = this.props.product ? this.props.product._id: "";
        }

        return product;
    }

});

module.exports = ProductForm;
