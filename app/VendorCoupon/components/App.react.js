/** @jsx React.DOM */

var React = require('react');
var HidogsConstants = require('../../Common/constants/HidogsConstants');
var AppDispatcher = require('../../Common/dispatcher/AppDispatcher');
var HGStore = require('../../Common/stores/session');
var Loading = require('../../Common/components/Loading.react');
var BecomeVendorInfo = require('../../Common/components/BecomeVendorInfo.react');

var Store = require('../stores/Store');
var Actions = require('../actions/Actions');
var Constants = require('../constants/Constants');
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

        var content = "";

        switch (this.state.status) {
            case Constants.STATE_COUPON_LIST:
                content = <CouponList couponList={this.state.couponList}></CouponList>
                break;

            default:
                content = <Loading></Loading>

        }

        if(this.state.session.status && this.state.session.status != "approved") {
            content = <BecomeVendorInfo></BecomeVendorInfo>
        }

        return (
            <div id="react_body">
                {content}
            </div>
        );
    },

    _onChange: function() {
        this.setState(getAppState());
    }

});

module.exports = app;

