/** @jsx React.DOM */

var React = require('react');
var HidogsConstants = require('../../Common/constants/HidogsConstants');
var AppDispatcher = require('../../Common/dispatcher/AppDispatcher');

var Store = require('../stores/Store');
var Actions = require('../actions/Actions');
var Header = require('./../../Common/components/Header.react.js');


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

    render: function() {

        // Order Date and Time
        var orderDate = new Date(this.props.order.booked_time.booked_date);
        var orderDateContent = this._formatDate(orderDate);

        var orderStartTime = new Date(this.props.order.booked_time.start_time);
        var orderEndTime = new Date(this.props.order.booked_time.end_time);
        var orderTimeContent = this._formatTime(orderStartTime) + "-" + this._formatTime(orderEndTime);

        // Err Msg
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
                <Header subtitle="使用订单" modal="true"></Header>

                <div className="container">

                    <div>
                        <div className="text-center">
                            <img src={this.props.order.user.head_image_url} className="center-block img-responsive img-circle user-icon-header voffset10"/>

                            <div className="hg-session-header-title voffset5"><small>用户:</small>{this.props.order.user.nick_name}</div>
                        </div>
                    </div>

                    <div className="form-group">
                        <label>服务标题</label>
                        <input type="text" className="form-control no-border" placeholder="标题" value={this.props.order.product.title} disabled/>
                    </div>

                    <div className="form-group">
                        <label>预订时间</label>

                        <div className="row">
                            <div className="col-xs-2"><label className="vcenter34">日期</label></div>
                            <div className="col-xs-10"><input type="text" className="form-control no-border" placeholder="预订日期"
                                                          value={orderDateContent} disabled/></div>
                        </div>
                        <div className="row">
                            <div className="col-xs-2"><label className="vcenter34">时间</label></div>
                            <div className="col-xs-10"><input type="text" className="form-control no-border" placeholder="预定时间"
                                                          value={orderTimeContent} disabled/></div>
                        </div>
                    </div>

                    <div className="form-group">
                        <label>使用码</label>
                        <input type="text" className="form-control simple-input" placeholder="请输入用户提供的订单使用码" ref="code"/>
                    </div>

                    {verifyMsgContent}


                </div>

                <footer className="footer bg-white">
                    <div className="container">
                        <div className="row text-right">
                            <div className="col-xs-12">
                                <button className="btn btn-hd-blue text-muted" onClick={this._codeTriggerDetail}>取消</button>
                                <button className="btn btn-hd-blue text-muted" onClick={this._codeSubmit}>提交</button>
                            </div>
                        </div>
                    </div>
                </footer>

            </div>
        );
    },

    _formatTime: function(date) {
        return date.getHours() + ":" + date.getMinutes();
    },

    _formatDate: function(date) {
        return date.getFullYear() + "/" + (date.getMonth()+1) + "/" + date.getDate();
    },

    _codeTriggerDetail: function() {
        Actions.codeTriggerDetail();
    },

    _codeSubmit: function() {
        var verifyMsg = this._verify();

        if(verifyMsg.length == 0) {
            var newOrder = {};
            newOrder.order_id = this.props.order.order_id;
            newOrder.status = 'tbcommented';
            newOrder.created_time = this.props.order.created_time;
            newOrder.openid = this.props.order.openid;
            newOrder.price = this.props.order.price;
            newOrder.product = this.props.order.product;
            newOrder.code = this.refs["code"].getDOMNode().value;

            this.refs["code"].getDOMNode().value = ""; // reset after submit

            var saleNo = this.props.order.product.sale_no ? this.props.order.product.sale_no : 0;
            var newProduct = {
                product_id: this.props.order.product.product_id,
                sale_no: saleNo + 1,
            };

            // let err msg could show
            this.setState(
                {isScrollToErrMsg: true}
            );

            Actions.codeSubmit(newOrder, newProduct);
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
            verifyMsg.push("-请输入订单使用码");
        }

        return verifyMsg;
    },

});

module.exports = app;

