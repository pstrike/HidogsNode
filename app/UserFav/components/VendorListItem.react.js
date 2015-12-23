/** @jsx React.DOM */

var React = require('react');
var HidogsConstants = require('../../Common/constants/HidogsConstants');
var AppDispatcher = require('../../Common/dispatcher/AppDispatcher');

var Store = require('../stores/Store');
var Actions = require('../actions/Actions');

var app = React.createClass({


    render: function() {

        var ratingContent = [];
        var certificateItemContent = [];
        if(this.props.vendor.role) {
            this.props.vendor.role.forEach(function(roleItem) {
                // vendor rating
                var starContent = [];
                var starCount = 0;
                if(roleItem.rate && roleItem.rate.no && roleItem.rate.no > 0) {
                    starCount = parseInt(roleItem.rate.sum) / parseInt(roleItem.rate.no);
                }
                for(var i = 0; i<5; i++) {
                    if(i<starCount) {
                        starContent.push(<span className="glyphicon glyphicon-star star-yellow"></span>);
                    }
                    else {
                        starContent.push(<span className="glyphicon glyphicon-star-empty star-yellow"></span>);
                    }
                }

                ratingContent.push(<tr>
                    <td className="text-center">{roleItem.name}</td>
                    <td className="hg-td-60pt">
                        {starContent}
                    </td>
                </tr>);

                // vendor certificate
                roleItem.certificate_list.forEach(function(certificateItem, index) {
                    if(certificateItem.name) {
                        if(certificateItemContent.length == 0) {
                            certificateItemContent.push(
                                <tr>
                                    <td className="text-center">专业认证</td>
                                    <td className="hg-td-60pt">
                                        {certificateItem.name}
                                    </td>
                                </tr>
                            );
                        }
                        else {
                            certificateItemContent.push(
                                <tr>
                                    <td className="text-center"></td>
                                    <td className="hg-td-60pt">
                                        {certificateItem.name}
                                    </td>
                                </tr>
                            );
                        }

                    }
                })

            })
        }

        // Address
        var addressContent = "";
        if(this.props.vendor.address) {
            addressContent = (this.props.vendor.address.city ? this.props.vendor.address.city : "") +
                (this.props.vendor.address.district ? this.props.vendor.address.district : "") +
                (this.props.vendor.address.street ? this.props.vendor.address.street : "") +
                (this.props.vendor.address.business ? this.props.vendor.address.business : "");
        }

        // style
        var tint = "";
        switch (this.props.vendor.setting.page_style) {
            case "blue":
                tint = "hg-blue-section";
                break;

            case "yellow":
                tint = "hg-yellow-section";
                break;

            case "red":
                tint = "hg-red-section";
                break;

            case "green":
                tint = "hg-green-section";
                break;

            case "orange":
                tint = "hg-orange-section";
                break;

        }

        return (
            <div className={tint}>
                <div className="row text-center voffset60">
                    <img src={this.props.vendor.head_image_url} className="center-block img-responsive img-circle user-icon-header voffset10"/>

                    <div className="hg-session-header-title voffset5">{this.props.vendor.nick_name}</div>
                </div>
                <div className="row voffset10">
                    <div className="container">
                        <table className="hg-table">
                            <tbody>
                            {ratingContent}
                            {certificateItemContent}
                            <tr>
                                <td className="text-center">工作室地址</td>
                                <td className="hg-td-60pt">{addressContent}</td>
                            </tr>
                            <tr>
                                <td></td>
                                <td></td>
                            </tr>
                            </tbody>
                        </table>
                        <div className="text-center">
                            <button className="btn btn-hd-blue" onClick={this._checkDetail}>查看详情</button>
                        </div>
                    </div>
                </div>

                <hr/>

            </div>
        );
    },

    _checkDetail: function() {
        window.location = "http://www.hidogs.cn/vendor/view/vendorpageprecheck?vendor="+this.props.vendor.vendor_id;
    },

});

module.exports = app;

