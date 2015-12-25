/** @jsx React.DOM */

var React = require('react');
var HidogsConstants = require('../../Common/constants/HidogsConstants');
var AppDispatcher = require('../../Common/dispatcher/AppDispatcher');
var HGStore = require('../../Common/stores/session');

var Store = require('../stores/Store');
var Actions = require('../actions/Actions');
var CouponList = require('../components/CouponList.react');


function getAppState() {
    return {
        session: HGStore.getSession(),
        couponList: Store.getCouponList(),
        status: Store.getStatus(),
    };
}

var app = React.createClass({

    getInitialState: function() {
        return getAppState();
    },

    componentDidMount: function() {
        Store.addChangeListener(this._onChange);
        HGStore.addChangeListener(this._onChange);

        Actions.init();
    },

    componentWillUnmount: function() {
        Store.removeChangeListener(this._onChange);
        HGStore.removeChangeListener(this._onChange);
    },

    render: function() {

        return (
            <div id="react_body">
                <CouponList couponList={this.state.couponList}></CouponList>
            </div>
        );
    },

    _onChange: function() {
        this.setState(getAppState());
    }

});

module.exports = app;

