/** @jsx React.DOM */

var React = require('react');
var HidogsConstants = require('../constants/HidogsConstants');
var ShopStore = require('../stores/ShopStore');
var AppDispatcher = require('../dispatcher/AppDispatcher');
var HidogsActions = require('../actions/VendorProdutActions');
var VendorProductStore = require('../stores/VendorProductStore');

var Header = require('./Header.react');
var ProductModal = require('./VendorProduct.ProductModal.react.js');
var ProductList = require('./VendorProduct.ProductList.react');

/**
 * Retrieve the current TODO data from the TodoStore
 */
function getVendorProductState() {
    return {
        allProducts: VendorProductStore.getAll(),
        product: VendorProductStore.getProduct(),
        status: VendorProductStore.getStatus()
    };
}

var HidogsApp = React.createClass({

    getInitialState: function() {
        return getVendorProductState();
    },

    componentDidMount: function() {
        VendorProductStore.addChangeListener(this._onChange);
        HidogsActions.vendorProductGetProductList();
    },

    componentWillUnmount: function() {
        VendorProductStore.removeChangeListener(this._onChange);
    },

    render: function() {

        var content;
        if(this.state.status == VendorProductStore.getStatusList().ERROR) {
            content = <div>
                <Header/>
                <div className="container-fluid"><h4><small>似乎除了点问题,</small> 请重新刷新页面</h4></div>
            </div>;
        }
        else {
            content = <div>
                <Header/>
                <ProductModal product={this.state.product} status={this.state.status}/>
                <ProductList allProducts={this.state.allProducts} status={this.state.status}/>
            </div>;
        }


        return (
            <div>{content}</div>
        );
    },

    _onChange: function() {
        this.setState(getVendorProductState());
    }

});

module.exports = HidogsApp;

