/** @jsx React.DOM */

var React = require('react');
var HidogsConstants = require('../../Common/constants/HidogsConstants');
var AppDispatcher = require('../../Common/dispatcher/AppDispatcher');

var VendorOrderStore = require('../stores/VendorOrderStore');
var VendorOrderActions = require('../actions/VendorOrderActions');
var Header = require('./../../Common/components/Header.react.js');
var OrderList = require('../components/VendorOrder.OrderList.react');
var ModalForm = require('../components/VendorOrder.ModalForm.react');


function getAppState() {
    return {
        orderList: VendorOrderStore.getOrderList(),
        order: VendorOrderStore.getOrder(),
        status: VendorOrderStore.getStatus(),
    };
}

var app = React.createClass({

    getInitialState: function() {
        return getAppState();
    },

    componentDidMount: function() {
        VendorOrderStore.addChangeListener(this._onChange);
        VendorOrderActions.vendorOrderGetOrderList();
    },

    componentWillUnmount: function() {
        VendorOrderStore.removeChangeListener(this._onChange);
    },

    render: function() {

        return (
            <div>
                <Header/>
                <OrderList orderList={this.state.orderList} status={this.state.status}/>
                <ModalForm order={this.state.order} status={this.state.status}/>
            </div>
        );
    },

    _onChange: function() {
        this.setState(getAppState());
    }

});

module.exports = app;

