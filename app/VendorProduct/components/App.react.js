/** @jsx React.DOM */

var React = require('react');
var HidogsConstants = require('../../Common/constants/HidogsConstants');
var AppDispatcher = require('../../Common/dispatcher/AppDispatcher');

var Store = require('../stores/Store');
var Actions = require('../actions/Actions');
var Constants = require('../constants/Constants');
var Header = require('./../../Common/components/Header.react.js');
var ProductListItem = require('../components/ProductListItem.react');
var DetailModal = require('../components/DetailModal.react');
var EditModal = require('../components/EditModal.react');
var SettingModal = require('../components/SettingModal.react');
var SettingEditModal = require('../components/SettingEditModal.react');
var AgreementModal = require('../components/AgreementModal.react');
var GuideModal = require('../components/GuideModal.react');
var WXSign = require('./../../Common/components/WXSign');


function getAppState() {
    return {
        productList: Store.getProductList(),
        status: Store.getStatus(),
        vendorProfile: Store.getVendorProfile(),
        wxSign: Store.getWXSign(),
    };
}

var app = React.createClass({

    getInitialState: function() {
        return getAppState();
    },

    componentDidMount: function() {
        Store.addChangeListener(this._onChange);
        Actions.getSessionOpenidThenProductListThenProductMetaThenProfile();

        // handle browser back event
        window.onbeforeunload = function() { return "确定要关闭服务管理页面吗?"; };
    },

    componentWillUnmount: function() {
        Store.removeChangeListener(this._onChange);
    },

    componentDidUpdate: function() {

        // handle back event
        switch (this.state.status) {
            case Constants.STATE_VENDOR_PRODUCT_LIST:
                window.onpopstate = function() {
                    if(wx) {
                        wx.closeWindow();
                    }
                };
                break;
        }
    },


    render: function() {

        var editType = 'edit';
        if(this.state.status == Constants.STATE_VENDOR_PRODUCT_NEW) {
            editType = 'new';
        }

        var productListContent = [];

        //if(this.state.productList.length == 0) {
        //    productListContent = <div>
        //        <h2>欢迎来到服务管理</h2>
        //        <h5>您可以通过 新建 按钮来创建您的服务</h5>
        //    </div>;
        //}
        //else {

        if(this.state.productList.length > 0) {
            this.state.productList.forEach(function(item) {

                var categoryContent = "";
                if(item.category.path_name) {
                    var categoryList = item.category.path_name.split(",");
                    categoryList.forEach(function(category, index) {
                        if(index > 1) {
                            categoryContent = categoryContent + category + ">";
                        }
                    })
                    categoryContent = categoryContent.substring(0,categoryContent.length-1) + item.category.name;
                }
                else {
                    categoryContent = "未设置服务类别";
                }

                var priceContent = "";
                var smallPrice = 999999999;
                var bigPrice = 0
                item.price.basic.forEach(function(priceItem) {
                    var price = parseInt(priceItem.price);

                    if(price > bigPrice) {
                        bigPrice = price
                    }

                    if(price < smallPrice) {
                        smallPrice = price
                    }
                });
                if(smallPrice == bigPrice) {
                    priceContent = smallPrice;
                }
                else if((smallPrice - bigPrice) == 999999999) {
                    priceContent = "未设置"
                }
                else {
                    priceContent = smallPrice + '-' + bigPrice;
                }

                var saleNoContent = "";
                saleNoContent = item.sale_no
                if(!item.sale_no) {
                    saleNoContent = 0;
                }

                var isExample = false;
                if(this.state.vendorProfile.vendorId) {
                    if(this.state.vendorProfile.vendorId != item.vendor.vendor_id) {
                        isExample = true;
                    }
                }

                var isOnSite = false;
                for(var i=0; i<item.tag_list.length; i++) {
                    console.log(item);
                    if(item.tag_list[i] == "上门服务") {
                        isOnSite = true;
                        break;
                    }
                }

                productListContent.push(<li>
                    <ProductListItem
                        category={categoryContent}
                        status={item.status}
                        title={item.title}
                        price={priceContent}
                        usedNo={saleNoContent}
                        productId={item.product_id}
                        isOnSite={isOnSite}
                        isExample={isExample}></ProductListItem>
                </li>);
            }.bind(this));
        }

        var mainContent = "";
        var footerContent = "";

        //if(this.state.vendorProfile.agreement == false) {
        //    mainContent = <div className="container voffset60">
        //        <h2>请您阅读服务协议.</h2>
        //        <h5>当您同意服务协议后,即可开始服务管理.</h5>
        //    </div>;
        //
        //    footerContent = <footer className="footer">
        //        <div className="container">
        //            <div className="row text-right">
        //                <div className="col-xs-12">
        //                    <button className="btn btn-hd-blue text-muted roffset5" onClick={this._triggerAgreement}>服务协议</button>
        //                </div>
        //            </div>
        //        </div>
        //    </footer>;
        //}
        //if(!this.state.vendorProfile.vendorNickname) {
        //    mainContent = <div className="container voffset60">
        //        <h2>似乎您的登录信息过期了,请关闭页面并重新打开</h2>
        //    </div>;
        //}
        //else {
        //    mainContent = <div className="container voffset60">
        //        <ul className="list-unstyled">
        //            {productListContent}
        //        </ul>
        //    </div>;
        //    footerContent = <footer className="footer">
        //        <div className="container">
        //            <div className="row text-right">
        //                <div className="col-xs-12">
        //                    <button className="btn btn-hd-blue text-muted roffset5" onClick={this._triggerAgreement}>服务协议</button>
        //                    <button className="btn btn-hd-blue text-muted roffset5" onClick={this._triggerSetting}>设置</button>
        //                    <button className="btn btn-hd-blue text-muted" onClick={this._triggerNew}>新建</button>
        //                </div>
        //            </div>
        //        </div>
        //    </footer>;
        //}

        //if(this.state.vendorProfile.status) {
        //    if(this.state.vendorProfile.status != "approved") {
        //        mainContent = <div className="container voffset60">
        //            <h2>您还没完成服务伙伴申请</h2>
        //            <h5>请您回到欢宠服务伙伴微信服务号中,选择"加入服务伙伴"完成申请流程</h5>
        //        </div>
        //
        //        footerContent = "";
        //    }
        //}

        var modalContent = [];
        switch (this.state.status) {
            case Constants.STATE_VENDOR_PRODUCT_LIST:
                //no modal

                mainContent = <div className="container voffset60">
                    <ul className="list-unstyled">
                        {productListContent}
                    </ul>
                </div>;
                footerContent = <footer className="footer">
                    <div className="container">
                        <div className="row text-right">
                            <div className="col-xs-12">
                                <button className="btn btn-hd-blue text-muted roffset5" onClick={this._triggerAgreement}>服务协议</button>
                                <button className="btn btn-hd-blue text-muted roffset5" onClick={this._triggerGuide}>教程</button>
                                <button className="btn btn-hd-blue text-muted roffset5" onClick={this._triggerSetting}>设置</button>
                                <button className="btn btn-hd-blue text-muted" onClick={this._triggerNew}>新建</button>
                            </div>
                        </div>
                    </div>
                </footer>;

                break;

            case Constants.STATE_VENDOR_PRODUCT_LIST_JOIN:
                //no modal

                mainContent = <div className="container voffset60">
                    <h2>您还没完成服务伙伴申请</h2>
                    <h5>请您回到欢宠服务伙伴微信服务号中,选择"加入服务伙伴"完成申请流程</h5>
                </div>

                break;

            case Constants.STATE_VENDOR_PRODUCT_LIST_AGREEMENT:
                //no modal

                mainContent = <div className="container voffset60">
                    <h2>请您先阅读服务协议.</h2>
                    <h5>当您同意服务协议后,即可开始管理、设置您的服务.</h5>
                </div>;

                footerContent = <footer className="footer">
                    <div className="container">
                        <div className="row text-right">
                            <div className="col-xs-12">
                                <button className="btn btn-hd-blue text-muted roffset5" onClick={this._triggerAgreement}>服务协议</button>
                            </div>
                        </div>
                    </div>
                </footer>;

                break;

            case Constants.STATE_VENDOR_PRODUCT_LIST_WELCOME:
                //no modal

                mainContent = <div className="container voffset60">
                    <h2>欢迎来到服务管理</h2>
                    <h5>您可以通过 新建 按钮来创建您的服务</h5>
                </div>

                footerContent = <footer className="footer">
                    <div className="container">
                        <div className="row text-right">
                            <div className="col-xs-12">
                                <button className="btn btn-hd-blue text-muted roffset5" onClick={this._triggerAgreement}>服务协议</button>
                                <button className="btn btn-hd-blue text-muted roffset5" onClick={this._triggerGuide}>教程</button>
                                <button className="btn btn-hd-blue text-muted roffset5" onClick={this._triggerSetting}>设置</button>
                                <button className="btn btn-hd-blue text-muted" onClick={this._triggerNew}>新建</button>
                            </div>
                        </div>
                    </div>
                </footer>;

                break;

            case Constants.STATE_VENDOR_PRODUCT_LIST_ERR:
                //no modal

                mainContent = <div className="container voffset60">
                    <h2>似乎您的登录信息过期了,请关闭页面并重新打开</h2>
                </div>;

                break;

            case Constants.STATE_VENDOR_PRODUCT_DETAIL:
                modalContent.push(<DetailModal></DetailModal>);
                break;

            case Constants.STATE_VENDOR_PRODUCT_EDIT:
            case Constants.STATE_VENDOR_PRODUCT_NEW:
                modalContent.push(<EditModal type={editType}></EditModal>);
                break;

            case Constants.STATE_VENDOR_PRODUCT_SETTING:
                modalContent.push(<SettingModal></SettingModal>);
                break;

            case Constants.STATE_VENDOR_PRODUCT_SETTING_EDIT:
                modalContent.push(<SettingEditModal></SettingEditModal>);
                break;

            case Constants.STATE_VENDOR_PRODUCT_COMMENT:

                break;

            case Constants.STATE_VENDOR_PRODUCT_AGREEMENT:
                modalContent.push(<AgreementModal></AgreementModal>);
                break;

            case Constants.STATE_VENDOR_PRODUCT_GUIDE:
                modalContent.push(<GuideModal></GuideModal>);
                break;

            default:

        }

        return (
            <div>
                <Header subtitle="服务伙伴 - 服务管理"/>

                <WXSign signature = {this.state.wxSign}
                        getSign = {this._getWXSign}
                        apilist = 'chooseImage,uploadImage'>
                </WXSign>

                {modalContent}

                {mainContent}

                {footerContent}

            </div>
        );
    },

    _onChange: function() {
        this.setState(getAppState());
    },

    _triggerSetting: function() {
        Actions.triggerListToSetting();
    },

    _triggerNew: function() {
        Actions.triggerListToNew();
    },

    _triggerAgreement: function() {
        Actions.triggerListToAgreement();
    },

    _triggerGuide: function() {
        Actions.triggerListToGuide();
    },


    _getWXSign: function() {
        Actions.getWXSignature(document.location.href);
    },

});

module.exports = app;

