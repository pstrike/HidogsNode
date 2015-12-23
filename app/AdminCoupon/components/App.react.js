/** @jsx React.DOM */

var React = require('react');
var HidogsConstants = require('../../Common/constants/HidogsConstants');
var AppDispatcher = require('../../Common/dispatcher/AppDispatcher');

var Actions = require('../actions/Actions');
var Store = require('../stores/Stores');
var SideBar = require('../../Admin/components/SideBar.react');
var NavBar = require('../components/NavBar.react');
var Constants = require('../constants/Constants');

var ContentCouponProfile = require('../components/ContentCouponProfile.react');
var ContentCouponEdit = require('../components/ContentCouponEdit.react');
var ContentCouponDetail = require('../components/ContentCouponDetail.react');

function getAppState() {
    return {
        status: Store.getStatus(),
        couponList: Store.getCouponList(),
        userList: Store.getUserList(),
        vendorList: Store.getVendorList(),
        productList: Store.getProductList(),
        coupon: Store.getCoupon(),
        verifyMsg: Store.getVerifyMsg(),
    };
}

var app = React.createClass({

    getInitialState: function() {
        return getAppState();
    },

    componentWillMount: function(){
        React.initializeTouchEvents(true);
    },

    componentDidMount: function() {
        Store.addChangeListener(this._onChange);

        Actions.getCouponList();
        Actions.loadUserVendorProduct();
    },

    componentWillUnmount: function() {
        Store.removeChangeListener(this._onChange);
    },

    render: function() {
        var content = "";

        switch (this.state.status) {
            case Constants.STATE_LIST:
                content = <ContentCouponProfile couponList={this.state.couponList}/>;
                break;
            case Constants.STATE_DETAIL:
                content = <ContentCouponDetail coupon={this.state.coupon} userList={this.state.userList} vendorList={this.state.vendorList} productList={this.state.productList}/>;
                break;
            case Constants.STATE_NEW:
                content = <ContentCouponEdit status={this.state.status} userList={this.state.userList} vendorList={this.state.vendorList} productList={this.state.productList} verifyMsg={this.state.verifyMsg}/>;
                break;
            case Constants.STATE_EDIT:
                content = <ContentCouponEdit status={this.state.status} userList={this.state.userList} vendorList={this.state.vendorList} productList={this.state.productList} verifyMsg={this.state.verifyMsg}/>;
                break;
        }

        return (
            <div>
                <NavBar/>

                <div className="container-fluid">
                    <div className="row">
                        <SideBar active="coupon"/>
                        {content}
                    </div>
                </div>
            </div>
        );
    },

    _onChange: function() {
        this.setState(getAppState());
    }

});

module.exports = app;

