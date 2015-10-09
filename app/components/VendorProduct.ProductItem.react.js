/** @jsx React.DOM */

var React = require('react');
var HidogsActions = require('../actions/VendorProdutActions');

var ProductItem = React.createClass({
    componentWillMount: function(){
        React.initializeTouchEvents(true);
    },

    handleTouchStart: function() {
        console.log('handleTouchStart');
    },

    render: function() {
        var product = this.props.product;

        var price;
        var lowPrice = 999999999;
        var highPrice = 0;
        if(product.price_list) {
            if(product.price_list.length == 1) {
                price = product.price_list[0].price;
            }
            else {
                for(var i=0; i<product.price_list.length; i++) {
                    if(product.price_list[i].price > highPrice)
                        highPrice = product.price_list[i].price;

                    if(product.price_list[i].price < lowPrice)
                        lowPrice = product.price_list[i].price;
                }
                price = lowPrice + "-" + highPrice
            }
        }

        return (
            <tr onClick={this._viewProductDetail} onTouchStart={this.handleTouchStart}>
                <td>{product._id}</td>
                <td>{product.name}</td>
                <td>{product.category}</td>
                <td>{price}</td>
                <td>
                    <div className="btn-group" role="group">
                        <button type="button" className="btn btn-default" onClick={this._modifyProductDetail}><span className="glyphicon glyphicon-pencil" aria-hidden="true"></span></button>
                        <button type="button" className="btn btn-default" onClick={this._deleteProduct}><span className="glyphicon glyphicon-remove" aria-hidden="true"></span></button>
                    </div>
                </td>
            </tr>

        );
    },

    _modifyProductDetail: function(event) {
        event.preventDefault();
        event.stopPropagation();
        HidogsActions.vendorProductViewProductEdit(this.props.product);
    },

    _deleteProduct: function(event) {
        event.preventDefault();
        event.stopPropagation();
        HidogsActions.vendorProductViewProductDelete(this.props.product);
    },

    _viewProductDetail: function(event) {
        HidogsActions.vendorProductViewProduct(this.props.product._id);
    }

});

module.exports = ProductItem;

