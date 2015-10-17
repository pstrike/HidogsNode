/** @jsx React.DOM */
var React = require('react');
var HidogsActions = require('../actions/VendorProdutActions');
var VendorProductConstants = require('../constants/VendorProductConstants');

var ProductItem = require('./VendorProduct.ProductItem.react.js');

var ProductList = React.createClass({

    render: function() {
        var allProducts = this.props.allProducts;
        var status = this.props.status;
        var content = [];

        if(status == VendorProductConstants.VENDOR_PRODUCT_STORE_STATE_LIST_LOADING) {
            content = <tr><td className='text-center' colSpan="5">加载中...</td></tr>;
        }
        else {
            for (var key in allProducts) {
                content.push(<ProductItem product={allProducts[key]} />);
            }
        }

        return (
            <div className="container-fluid">
                <div className="page-header">
                    <h1>欢宠达人<small>我的服务列表</small></h1>
                </div>

                <div>
                    <button type="button" className="btn btn-default" onClick={this._showNewProductModal}>创建新服务</button>
                    <hr/>
                </div>

                <div>
                    <table className="table table-striped table-condensed">
                        <thead>
                        <tr>
                            <th>ID</th>
                            <th>名称</th>
                            <th>类别</th>
                            <th>操作</th>
                        </tr>
                        </thead>
                        <tbody>
                            {content}
                        </tbody>
                    </table>
                </div>
            </div>

        );
    },

    _showNewProductModal: function() {
        HidogsActions.vendorProductViewNewProduct();
    }

});

module.exports = ProductList;

