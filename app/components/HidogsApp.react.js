/** @jsx React.DOM */

var React = require('react');
var CouponItem = require('./CouponItem.react');
var LocationStore = require('../stores/LocationStore');
var HidogsConstants = require('../constants/HidogsConstants');
var AppDispatcher = require('../dispatcher/AppDispatcher');
var HidogsActions = require('../actions/HidogsActions');

function getLocationState() {
    return LocationStore.getLocation();
}

var HidogsApp = React.createClass({

    getInitialState: function() {
        if(this.props.initData)
            return this.props.initData;
        else
            return {};

    },

    componentDidMount: function() {
        console.log("mount hidogs react")
        LocationStore.addChangeListener(this._onChange);
        HidogsActions.getLocation(0);
    },

    componentWillUnmount: function() {
        LocationStore.removeChangeListener(this._onChange);
    },

    render: function() {
        var coupons = this.state.coupons;
        var couponLis = [];

        for (var key in coupons) {
            couponLis.push(<CouponItem coupon={coupons[key]}/>);
        }

        return (
            <div>
                <h1>{this.state.name}</h1>
                <h2>{this.state.address}</h2>
                <ul>{couponLis}</ul>
            </div>
            );


    },

    _onChange: function() {
        console.log('callback');
        console.log(LocationStore.getLocation());
        this.setState(getLocationState());
    }

});

module.exports = HidogsApp;

