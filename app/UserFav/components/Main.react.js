/** @jsx React.DOM */

var React = require('react');
var HidogsConstants = require('../../Common/constants/HidogsConstants');
var AppDispatcher = require('../../Common/dispatcher/AppDispatcher');

var Store = require('../stores/Store');
var Actions = require('../actions/Actions');
var Constants = require('../constants/Constants');
var ProductListItem = require('../components/ProductListItem.react');
var VendorListItem = require('../components/VendorListItem.react');

var Header = require('./../../Common/components/Header.react');

var app = React.createClass({

    componentDidMount: function() {

        // init tab
        var tabs = $('#hgTab div');
        tabs.click(function() {
            tabs.removeClass('hg-tab-item-active')
            var el = $(this);
            el.addClass('hg-tab-item-active');
        })
    },

    render: function () {

        var listContent = [];

        switch (this.props.status) {
            case Constants.STATE_PRODUCT:
                listContent = this.props.productList.map(function(item) {
                    return <ProductListItem product={item}></ProductListItem>;
                })
                break;

            case Constants.STATE_VENDOR:
                listContent = this.props.vendorList.map(function(item) {
                    return <VendorListItem vendor={item}></VendorListItem>;
                })
                break;
        }

        return (
            <div id="react_body">

                <Header hgstyle="hg-navbar"></Header>

                <div className="container">
                    <div className="page-header text-center hg-pageheader">
                        <div className="">My Favorites</div>
                        <h2 className="voffset2 "><strong>我的收藏</strong></h2>
                    </div>

                    <div id="hgTab" className="text-center">
                        <div className="col-xs-6 hg-tab-item hg-tab-item-active" onClick={this._viewProductList}><a href="#">服务</a></div>
                        <div className="col-xs-6 hg-tab-item" onClick={this._viewVendorList}><a href="#">达人</a></div>
                    </div>

                    <hr/>

                    {listContent}

                </div>

            </div>
        );
    },

    _viewProductList: function() {
        Actions.viewProductList();
    },

    _viewVendorList: function() {
        Actions.viewVendorList();
    },


});

module.exports = app;

