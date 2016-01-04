/** @jsx React.DOM */

var React = require('react');
var HidogsConstants = require('../../Common/constants/HidogsConstants');
var AppDispatcher = require('../../Common/dispatcher/AppDispatcher');
var RatingStar = require('../../Common/components/RatingStar.react');

var Store = require('../stores/Store');
var Actions = require('../actions/Actions');

var Header = require('./../../Common/components/Header.react');

var app = React.createClass({

    render: function () {

        // handle price
        var priceContent = "";
        var smallPrice = 999999999;
        var bigPrice = 0
        this.props.product.price.basic.forEach(function(priceItem) {
            var price = parseInt(priceItem.price);

            if(price > bigPrice) {
                bigPrice = price
            }

            if(price < smallPrice) {
                smallPrice = price
            }
        });
        if(smallPrice == bigPrice) {
            priceContent = '¥ ' + smallPrice + '元';
        }
        else if((smallPrice - bigPrice) == 999999999) {
            priceContent = "未设置"
        }
        else {
            priceContent = '¥ ' + smallPrice + '-' + bigPrice + '元';
        }

        // address
        var addressContent = "";
        if(this.props.product.address.district) {
            addressContent = this.props.product.address.city +
                this.props.product.address.district +
                this.props.product.address.business;
        }

        // product rating
        var rate = 0;
        if(this.props.product.rate && this.props.product.rate.no) {
            rate = parseFloat(this.props.product.rate.sum) / parseFloat(this.props.product.rate.no);
        }

        var distanceContent = "";
        if(this.props.product.distance) {
            if(this.props.product.distance < 1000) {
                distanceContent = parseInt(this.props.product.distance) + "米";
            }
            else {
                distanceContent = parseInt(this.props.product.distance / 1000) + "公里";

            }
        }

        var addressSectionContent = <div>
            <div>{addressContent}</div>
            <div><i>(距离我{distanceContent})</i></div>
        </div>;

        if(this.props.product.tag_list) {
            for(var i=0; i<this.props.product.tag_list.length; i++) {
                if(this.props.product.tag_list[i] == "上门服务") {
                    addressSectionContent = <span className="label btn-hd-blue btn-hd-active">上门服务</span>;
                    break;
                }
            }
        }

        return (
                <div className="text-center">
                    <img src={this.props.product.vendor.head_image_url} className="center-block img-responsive img-circle user-icon-header voffset10"/>
                    <div className="text-center voffset2">{this.props.product.vendor.vendor_name}</div>
                    <div className="text-center">
                        <h3>{this.props.product.title}</h3>
                        <div className="row text-center voffset0">
                            <RatingStar rate={rate} total="5"></RatingStar>
                        </div>
                    </div>
                    <div className="voffset10">
                        <table className="hg-table table-condensed">
                            <tbody>
                            <tr><td>{priceContent}</td></tr>
                            <tr><td>
                                {addressSectionContent}
                            </td></tr>
                            <tr><td>{this.props.product.sale_no ? this.props.product.sale_no : 0}个用户使用过</td></tr>
                            <tr><td></td></tr>
                            </tbody>
                        </table>
                    </div>

                    <div className="text-center">
                        <button className="btn btn-hd-blue" onClick={this._navToProductPage.bind(this, this.props.product.product_id)}>查看详情</button>
                    </div>

                    <hr/>

                </div>
        );
    },

    _navToProductPage: function(productId) {
        window.location = "http://www.hidogs.cn/product/view/userproductprecheck?product="+productId;
    },

});

module.exports = app;

