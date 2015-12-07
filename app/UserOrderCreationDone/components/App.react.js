/** @jsx React.DOM */

var React = require('react');
var HidogsConstants = require('../../Common/constants/HidogsConstants');
var AppDispatcher = require('../../Common/dispatcher/AppDispatcher');

var Store = require('../stores/Store');
var Actions = require('../actions/Actions');
var Header = require('./../../Common/components/Header.react.js');
var APVTO = require('../../../util/assignpathvaluetoobject');


function getAppState() {
    return {
        session: Store.getSession(),
        user: Store.getUser(),
        verifyMsg: Store.getVerifyMsg(),
        status: Store.getStatus(),
    };
}

var app = React.createClass({

    getInitialState: function() {
        return getAppState();
    },

    componentDidMount: function() {
        Store.addChangeListener(this._onChange);

        // handle back event
        window.history.pushState({title: "preventback", url: "#"}, "preventback", "#");
        window.onpopstate = function () {
            window.history.pushState({title: "preventback", url: "#"}, "preventback", "#");
        };

        Actions.loadSessionThenUser();
    },

    componentWillUnmount: function() {
        Store.removeChangeListener(this._onChange);
    },

    componentDidUpdate: function() {
        if (this.state.verifyMsg.length > 0 && this.state.isScrollToErrMsg) {
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
        if(this.state.verifyMsg.length > 0) {
            verifyMsgContent = <div className="text-right">
                <p className="bg-danger text-danger verification-msg voffset30">
                    <strong>请根据以下提示, 补充订单内容:</strong><br/>
                    {this.state.verifyMsg.map(function(item) {
                        return <span>{item}<br/></span>;
                    })}
                </p>
                <div id="errMsgAnchor"></div>
            </div>;
        }

        return (
            <div id="react_body">
                <Header/>

                <div className="container blue-background">

                    <div className="page-header text-center hg-pageheader">
                        <i className="fa fa-check hg-session-header-icon tint_text"></i>
                        <h2 className="tint_text voffset10"><strong>成功预约</strong></h2>
                    </div>

                    <hr/>

                    <div className="text-left voffset40">
                        <blockquote className="instruction">为了更好的提供服务,请您花1分钟提供以下信息</blockquote>
                    </div>
                    <div>
                        <div className="form-group">
                            <label>怎么称呼您?</label>
                            <input type="text" className="form-control simple-input" placeholder="称呼" value={this.state.user.name} name="name" onChange={this._handleChange}/>
                        </div>
                        <div className="form-group">
                            <label>您的手机号码</label>
                            <input type="number" pattern="[0-9]*" className="form-control simple-input" placeholder="联系人手机" value={this.state.user.mobile} name="mobile" onChange={this._handleChange}/>
                        </div>
                        <div className="form-group">
                            <label>宠物的名字</label>
                            <input type="text" className="form-control simple-input" placeholder="宠物名字" value={this.state.user.pet_name} name="pet_name" onChange={this._handleChange}/>
                        </div>
                        <div className="form-group">
                            <label>宠物的品种</label>
                            <input type="text" className="form-control simple-input" placeholder="宠物品种" value={this.state.user.pet_type} name="pet_type" onChange={this._handleChange}/>
                        </div>
                        <div className="form-group">
                            <label>宠物的年龄</label>
                            <input type="number" pattern="[0-9]*" className="form-control simple-input" placeholder="宠物年龄" value={this.state.user.pet_age} name="pet_age" onChange={this._handleChange}/>
                        </div>
                        <div className="form-group">
                            <label>您对服务是否有特别事项需要备注?</label>
                            <input type="text" className="form-control simple-input" placeholder="特殊备注" ref="orderRemark"/>
                        </div>
                    </div>

                    {verifyMsgContent}

                </div>

                <footer className="footer">
                    <div className="container">
                        <div className="row">
                            <div className="col-xs-12 text-right">
                                <button className="btn btn-hd-tint text-muted" onClick={this._onSubmit}>完成</button>
                            </div>
                        </div>
                    </div>
                </footer>
            </div>
        );
    },

    _onChange: function() {
        this.setState(getAppState());
    },

    _onSubmit: function() {
        var verifyMsg = this._verify();

        if(verifyMsg.length == 0) {
            var order = {};
            order.order_id = $("#react-main-mount").attr("orderId");
            order.remark = this.refs.orderRemark.getDOMNode().value;

            Actions.submit(this.state.user, order);
        }
        else {
            //scroll to err msg
            this.setState(
                {isScrollToErrMsg: true}
            );

            Actions.verify(verifyMsg);
        }

    },

    _handleChange: function(event) {
        var value = event.target.value;

        var newUser = APVTO.assign(this.state.user ,event.target.name, value)
        this.setState({user: newUser});
    },

    _verify: function() {
        var verifyMsg = [];

        if(!this.state.user.name) {
            verifyMsg.push("-您的称呼还没填写");
        }

        if(!this.state.user.mobile) {
            verifyMsg.push("-您的手机号码还没填写");
        }

        return verifyMsg;
    },

});

module.exports = app;

