/** @jsx React.DOM */

var React = require('react');
var HidogsConstants = require('../constants/HidogsConstants');
var AppDispatcher = require('../dispatcher/AppDispatcher');
var HidogsActions = require('../actions/HidogsActions');
var UserOrderStore = require('../stores/UserOrderStore');

var CouponItem = React.createClass({

    getInitialState: function() {
        return {};
    },

    componentDidMount: function() {
        UserOrderStore.addChangeListener(this._onChange);
    },

    componentWillUnmount: function() {
        UserOrderStore.removeChangeListener(this._onChange);
    },

    render: function() {
        var coupon = this.props.coupon;

        return (
            <li>
                <label>{coupon.name}</label>
                <label>{coupon.price}</label>
                <button onClick={this._onClickBuy}>buy</button>
            </li>
            );
    },

    _onClickBuy: function() {
        var coupon = this.props.coupon;
        HidogsActions.createOrder(0,coupon);
    },

    _onChange: function() {
        console.log('callback');
    }

});

module.exports = CouponItem;