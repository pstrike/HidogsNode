/** @jsx React.DOM */

var React = require('react');
var HidogsConstants = require('../../Common/constants/HidogsConstants');
var AppDispatcher = require('../../Common/dispatcher/AppDispatcher');

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
        if(this.props.product.address.region) {
            addressContent = this.props.product.address.city + ", " + this.props.product.address.region;
        }
        else {
            addressContent = this.props.product.address.city;
        }

        // vendor rating
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

        return (
                <div className="text-center">
                    <img src={this.props.product.vendor.head_image_url} className="center-block img-responsive img-circle user-icon-header voffset10"/>
                    <div className="text-center voffset2">{this.props.product.vendor.vendor_name}</div>
                    <div className="text-center">
                        <h3>{this.props.product.title}</h3>
                        <div className="row text-center voffset0">
                            {starContent}
                        </div>
                    </div>
                    <div className="voffset10">
                        <table className="hg-table table-condensed">
                            <tbody>
                            <tr><td>{priceContent}</td></tr>
                            <tr><td>{addressContent} - 距离我2公里</td></tr>
                            <tr><td>{this.props.product.sale_no ? this.props.product.sale_no : 0}个用户使用过</td></tr>
                            <tr><td></td></tr>
                            </tbody>
                        </table>
                    </div>

                    <div className="text-center">
                        <button className="btn btn-hd-blue">查看详情</button>
                    </div>

                    <hr/>

                </div>
        );
    },

});

module.exports = app;

