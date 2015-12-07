/** @jsx React.DOM */

var React = require('react');
var HidogsConstants = require('../../Common/constants/HidogsConstants');
var AppDispatcher = require('../../Common/dispatcher/AppDispatcher');

var Store = require('../stores/Store');
var Actions = require('../actions/Actions');


var app = React.createClass({

    componentDidMount: function() {
        Actions.refundLoadUser(this.props.session.user_id);
    },

    componentDidUpdate: function() {
        // init data
        this.refs["name"].getDOMNode().value = this.props.user.name;
        this.refs["mobile"].getDOMNode().value = this.props.user.mobile;

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
            <div className="container">
                <div>
                    <div className="page-header text-center hg-pageheader">
                        <h4>Refund</h4>
                        <h2 className="voffset10"><strong>申请退款</strong></h2>
                    </div>

                    <hr/>

                    <div className="form-group">
                        <label>怎么称呼您?</label>
                        <input type="text" className="form-control simple-input" placeholder="称呼" ref="name"/>
                    </div>
                    <div className="form-group">
                        <label>您的手机号码?</label>
                        <input type="number" pattern="[0-9]*" className="form-control simple-input" placeholder="手机号码" ref="mobile"/>
                    </div>

                    <div className="form-group voffset30">
                        <label>为了更快的安排退款,请您告诉我们退款原因?</label>
                        <textarea className="form-control simple-input" rows="5" ref="reason"></textarea>
                    </div>

                    {verifyMsgContent}
                </div>

                <footer className="footer">
                    <div className="container">
                        <div className="row text-right">
                            <div className="col-xs-12">
                                <button className="btn btn-hd-blue text-muted roffset5" onClick={this._cancel}>取消</button>
                                <button className="btn btn-hd-blue text-muted" onClick={this._submit}>提交</button>
                            </div>
                        </div>
                    </div>
                </footer>

            </div>
        );
    },

    _submit: function() {

        var verifyMsg = this._verify();

        if(verifyMsg.length == 0) {
            if(confirm("当您提交退款申请,您的订单将被取消并转入退款流程,请确认是否继续.")) {
                var newOrder = {refund: {}};
                newOrder.order_id = this.props.order.order_id;
                newOrder.status = "refund";
                newOrder.refund.name = this.refs["name"].getDOMNode().value;
                newOrder.refund.mobile = this.refs["mobile"].getDOMNode().value;
                newOrder.refund.reason = this.refs["reason"].getDOMNode().value;
                newOrder.refund.time = new Date();

                console.log(newOrder);

                Actions.submitRefundOrder(newOrder);
            }
        }
        else {
            //scroll to err msg
            this.setState(
                {isScrollToErrMsg: true}
            );

            Actions.verify(verifyMsg);
        }

    },

    _cancel: function() {
        Actions.cancelRefundOrder();
    },

    _verify: function() {
        var verifyMsg = [];

        if(!this.refs["name"].getDOMNode().value) {
            verifyMsg.push("-请填写您的称呼以方便我们联系您");
        }

        if(!this.refs["mobile"].getDOMNode().value) {
            verifyMsg.push("-请填写您的手机号码以方便我们联系您");
        }

        if(!this.refs["reason"].getDOMNode().value) {
            verifyMsg.push("-请填写申请退款的原因以帮助我们安排退款");
        }

        return verifyMsg;
    },

});

module.exports = app;

