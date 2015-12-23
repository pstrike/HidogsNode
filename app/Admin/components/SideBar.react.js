/** @jsx React.DOM */

var React = require('react');
var HidogsConstants = require('../../Common/constants/HidogsConstants');
var AppDispatcher = require('../../Common/dispatcher/AppDispatcher');

var Actions = require('../actions/Actions');
var Header = require('./../../Common/components/Header.react.js');



var app = React.createClass({

    render: function() {

        var vendorActive = "";
        var potentialVendorActive = "";
        var userActive = "";
        var productActive = "";
        var orderActive = "";
        var saleActive = "";
        var couponActive = "";

        switch (this.props.active) {
            case "vendor":
                vendorActive = "active";
                break;

            case "potentialvendor":
                potentialVendorActive = "active";
                break;

            case "user":
                userActive = "active";
                break;

            case "product":
                productActive = "active";
                break;

            case "order":
                orderActive = "active";
                break;

            case "sale":
                saleActive = "active";
                break;

            case "coupon":
                couponActive = "active";
                break;
        }

        return (
            <div className="col-sm-3 col-md-2 sidebar">
                <ul className="nav nav-sidebar">
                    <li className={vendorActive}><a href="/admin/view/vendor">服务伙伴</a></li>
                    <li className={potentialVendorActive}><a href="/admin/view/potentialvendor">潜在达人</a></li>
                    <li className={userActive}><a href="/admin/view/user">用户</a></li>
                    <li className={productActive}><a href="/admin/view/product">服务</a></li>
                    <li className={orderActive}><a href="/admin/view/order">订单</a></li>
                    <li className={saleActive}><a href="/admin/view/sale">销售</a></li>
                    <li className={couponActive}><a href="/admin/view/coupon">优惠码</a></li>
                </ul>
            </div>
        );
    },


});

module.exports = app;

