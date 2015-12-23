/** @jsx React.DOM */

var React = require('react');
var HidogsConstants = require('../../Common/constants/HidogsConstants');
var AppDispatcher = require('../../Common/dispatcher/AppDispatcher');

var Store = require('../stores/Store');
var Actions = require('../actions/Actions');

var app = React.createClass({


    render: function() {

        // product category
        var categoryContent = "";
        if(this.props.product.category && this.props.product.category.path_name) {
            var categoryList = this.props.product.category.path_name.split(",");
            categoryList.forEach(function(category, index) {
                if(index > 1) {
                    categoryContent = categoryContent + category + ">";
                }
            })
            categoryContent = categoryContent.substring(0,categoryContent.length-1) + this.props.product.category.name;
        }
        else {
            categoryContent = "未设置服务类别";
        }

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
        var starContent = [];
        var starCount = 0;
        if(this.props.product.rate && this.props.product.rate.no) {
            starCount = parseInt(this.props.product.rate.sum) / parseInt(this.props.product.rate.no);
        }
        for(var i = 0; i<5; i++) {
            if(i<starCount) {
                starContent.push(<span className="glyphicon glyphicon-star star-yellow"></span>);
            }
            else {
                starContent.push(<span className="glyphicon glyphicon-star-empty star-yellow"></span>);
            }
        }

        // style
        var tint = "";
        var icon = "";
        switch (this.props.product.category.slug) {
            case "beautifying":
                tint = "hg-green-section";
                icon = <span className="glyphicon glyphicon-jpy hg-session-header-icon"></span>;
                break;

            case "model":
                tint = "hg-red-section";
                icon = <span className="glyphicon glyphicon-ok hg-session-header-icon"></span>;
                break;

            case "bald":
                tint = "hg-blue-section";
                icon = <span className="glyphicon glyphicon-ok hg-session-header-icon"></span>;
                break;

            case "SPA":
                tint = "hg-yellow-section";
                icon = <span className="glyphicon glyphicon-comment hg-session-header-icon"></span>;
                break;

        }
        var hgStyle = "text-center voffset50 " + tint;

        return (
            <div className={hgStyle}>
                <div className="voffset10">
                    <i className="fa fa-certificate roffset5"></i>
                    <span>{categoryContent}</span>
                </div>
                <div className="text-center">
                    <h3 className="voffset10">{this.props.product.title}</h3>
                    <div className="row text-center voffset0">
                        {starContent}
                    </div>
                </div>
                <div className="voffset10">
                    <table className="hg-table table-condensed">
                        <tbody>
                        <tr>
                            <td>
                                <img src={this.props.product.vendor.head_image_url} className="img-circle user-icon-small roffset5"/>
                                <span>{this.props.product.vendor.vendor_name}</span>
                            </td>
                        </tr>
                        <tr><td>{priceContent}</td></tr>
                        <tr><td>{addressContent}</td></tr>
                        <tr><td>{this.props.product.sale_no}个用户使用过</td></tr>
                        <tr><td></td></tr>
                        </tbody>
                    </table>
                </div>

                <div className="text-center">
                    <button className="btn btn-hd-blue" onClick={this._checkDetail}>查看详情</button>
                </div>

                <hr/>

            </div>
        );
    },

    _checkDetail: function() {
        window.location = "http://www.hidogs.cn/product/view/userproductprecheck?product="+this.props.product.product_id;
    },

});

module.exports = app;

