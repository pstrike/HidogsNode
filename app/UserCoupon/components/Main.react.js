/** @jsx React.DOM */

var React = require('react');
var HidogsConstants = require('../../Common/constants/HidogsConstants');
var AppDispatcher = require('../../Common/dispatcher/AppDispatcher');

var Store = require('../stores/Store');
var Actions = require('../actions/Actions');
var Constants = require('../constants/Constants');

var Header = require('./../../Common/components/Header.react');
var formatdatetime = require('../../../util/formatdatetime');

var app = React.createClass({

    componentDidUpdate: function() {
        // err msg
        if (this.props.verifyMsg.length > 0 && this.state.isScrollToErrMsg) {
            var position = $('body').scrollTop() + $('#errMsgAnchor').offset().top;

            $('body').animate({
                scrollTop: position
            }, 500);

            // ensure verify msg scroll only response once
            this.setState(
                {isScrollToErrMsg: false}
            );
        };
    },

    render: function () {

        // verify msg
        var verifyMsgContent = "";
        if(this.props.verifyMsg.length > 0) {
            verifyMsgContent = <div className="text-right">
                <p className="bg-danger text-danger verification-msg voffset30">
                    <strong>请根据以下提示, 补充订单内容:</strong><br/>
                    {this.props.verifyMsg.map(function(item) {
                        return <span>{item}<br/></span>;
                    })}
                </p>
                <div id="errMsgAnchor"></div>
            </div>;
        }

        return (
            <div id="react_body">

                <Header hgstyle="hg-navbar"></Header>

                <div className="container">
                    <div className="page-header text-center hg-pageheader">
                        <div className="tint_text">Coupon</div>
                        <h2 className="voffset0 tint_text"><strong>优惠码</strong></h2>
                    </div>

                    <hr/>

                    <div className="input-group">
                        <input type="text" className="form-control simple-input" placeholder="请输入优惠码" ref="code"/>
                          <span className="input-group-btn">
                            <button className="btn btn-hd-tint" type="button" onClick={this._submitCode}>确定</button>
                          </span>
                    </div>

                    {verifyMsgContent}

                    <div className="voffset30">
                        <blockquote>
                            <p className="instruction">您的优惠码会在您下订单时自动被使用.</p>
                        </blockquote>
                        <table className="hg-table grey-border text-center">

                            <tbody>
                            {this.props.couponList.map(function(item) {

                                // facilitate user to use coupon
                                var btnContent="";
                                if(item.rule.product.length > 0) {
                                    btnContent = <button className="btn btn-hd-tint btn-sm" type="button" onClick={this._checkProduct.bind(this, item.rule.product[0])}>查看服务</button>
                                }
                                if(item.rule.vendor.length > 0) {
                                    btnContent = <button className="btn btn-hd-tint btn-sm" type="button" onClick={this._checkVendor.bind(this, item.rule.vendor[0])}>查看达人</button>
                                }

                                // handle invalid coupon
                                if(item.type == "once") {
                                    for(var i=0; i<item.used.length; i++) {
                                        if(item.used[i] == this.props.user.user_id) {
                                            btnContent = <button className="btn btn-default btn-sm" type="button" disabled>已使用</button>;
                                            break;
                                        }
                                    }
                                }
                                else {
                                    var dueDate = new Date(item.due_date);
                                    var today = new Date();
                                    if(today > dueDate) {
                                        btnContent = <button className="btn btn-default btn-sm" type="button" disabled>已失效</button>;
                                    }
                                }

                                return <tr>
                                    <td>{item.code}</td>
                                    <td>
                                        <span className="roffset5">{item.title} ({formatdatetime.formatDate(new Date(item.due_date))}到期)</span>
                                    </td>
                                    <td>
                                        {btnContent}
                                    </td>
                                </tr>;
                            }.bind(this))}
                            <tr>
                                <td></td>
                                <td></td>
                                <td></td>
                            </tr>
                            </tbody>
                        </table>
                    </div>

                </div>
            </div>
        );
    },

    _submitCode: function() {

        var verifyMsg = this._verify();

        if(verifyMsg.length == 0) {
            var code = this.refs["code"].getDOMNode().value;
            this.refs["code"].getDOMNode().value = "";

            this.setState(
                {isScrollToErrMsg: true}
            );

            Actions.submitCouponCode({code: code, user_id: this.props.user.user_id});
        }
        else {
            //scroll to err msg
            this.setState(
                {isScrollToErrMsg: true}
            );

            Actions.verify(verifyMsg);
        }
    },

    _verify: function() {
        var verifyMsg = [];

        if(!this.refs["code"].getDOMNode().value) {
            verifyMsg.push("-请输入验证码");
        }

        return verifyMsg;
    },

    _checkProduct: function(productId) {
        window.location = "http://www.hidogs.cn/product/view/userproductprecheck?product="+productId;
    },

    _checkVendor: function(vendorId) {
        window.location = "http://www.hidogs.cn/vendor/view/vendorpageprecheck?vendor="+vendorId;
    },

});

module.exports = app;

