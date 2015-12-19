/** @jsx React.DOM */

var React = require('react');
var HidogsConstants = require('../../Common/constants/HidogsConstants');
var AppDispatcher = require('../../Common/dispatcher/AppDispatcher');

var Store = require('../stores/Store');
var Actions = require('../actions/Actions');
var Main = require('../components/Main.react');



function getAppState() {
    return {
        vendor: Store.getVendor(),
        productList: Store.getProductList(),
        status: Store.getStatus(),
    };
}

var app = React.createClass({

    getInitialState: function() {
        return getAppState();
    },

    componentDidMount: function() {
        Store.addChangeListener(this._onChange);

        Actions.init($("#react-main-mount").attr("vendorid"));
    },

    componentWillUnmount: function() {
        Store.removeChangeListener(this._onChange);
    },

    render: function() {

        return (
            <div>
                <Main vendor={this.state.vendor} productList={this.state.productList}></Main>
            </div>
        );
    },

    _onChange: function() {
        this.setState(getAppState());
    }

});

module.exports = app;

