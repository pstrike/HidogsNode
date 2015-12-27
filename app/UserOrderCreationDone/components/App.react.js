/** @jsx React.DOM */

var React = require('react');
var HidogsConstants = require('../../Common/constants/HidogsConstants');
var AppDispatcher = require('../../Common/dispatcher/AppDispatcher');

var Store = require('../stores/Store');
var Actions = require('../actions/Actions');
var Header = require('./../../Common/components/Header.react.js');
var APVTO = require('../../../util/assignpathvaluetoobject');
var mapconvertor = require('../../../util/mapconverter');


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

        // get is on site flag
        this.props.isOnSite = $("#react-main-mount").attr("isonsite") == "true" ? true : false;
        this.props.isInitBMap = false;

        Actions.loadSessionThenUser();
    },

    componentWillUnmount: function() {
        Store.removeChangeListener(this._onChange);
    },

    componentDidUpdate: function() {
        // Verify Msg
        if (this.state.verifyMsg.length > 0 && this.state.isScrollToErrMsg) {
            var position = $('body').scrollTop() + $('#errMsgAnchor').offset().top;

            $('body').animate({
                scrollTop: position
            }, 500);

            this.setState(
                {isScrollToErrMsg: false}
            );
        };

        // BD Map Auto Complete
        if(this.props.isOnSite && !this.props.isInitBMap && this.state.user.address) {
            this.props.isInitBMap = true;

            var ac = new BMap.Autocomplete(    //建立一个自动完成的对象
                {
                    "input" : "suggestId",
                    "location" : this.state.user.address ? this.state.user.address.city : "",
                });

            ac.addEventListener("onconfirm", function(e) {
                var myValue;
                var _value = e.item.value;
                myValue = _value.province +  _value.city +  _value.district +  _value.street +  _value.business;

                var local = new BMap.LocalSearch(this.state.user.address ? this.state.user.address.city : "", { //智能搜索
                    onSearchComplete: function () {
                        var pp = local.getResults().getPoi(0).point;    //获取第一个智能搜索的结果

                        //console.log(pp);
                        var newPoint = mapconvertor.bd09togcj02(pp.lng, pp.lat);
                        this._handleAddressChange(_value, newPoint);
                    }.bind(this)
                });
                local.search(myValue);
            }.bind(this));
        }
    },

    render: function() {

        // Verify Msg
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

        // address
        var addressContent = "";
        if(this.state.user.address && this.state.user.address.district) {
            addressContent = (this.state.user.address.city ? this.state.user.address.city : "") +
                (this.state.user.address.district ? this.state.user.address.district : "") +
                (this.state.user.address.street ? this.state.user.address.street : "") +
                (this.state.user.address.business ? this.state.user.address.business : "");
        }

        // Is On Site User Address
        var userAddressContent = "";
        if(this.props.isOnSite) {
            userAddressContent = <div className="form-group">
                <label>上门服务地址</label>
                <div className="row">
                    <div className="col-xs-12">
                        <div className="input-group">
                                <span className="input-group-addon" id="sizing-addon2">
                                    <span className="glyphicon glyphicon-search" aria-hidden="true"></span>
                                </span>
                            <input id="suggestId" type="text" className="form-control simple-input" placeholder="请输入小区、写字楼、学校、街道"/>
                        </div>
                    </div>
                </div>

                <div className="row voffset5">
                    <div className="col-xs-12">
                        <input type="text" className="form-control simple-input no-border" placeholder="请通过搜索结果来选择地址" value={addressContent} disabled/>
                    </div>
                </div>

                <div className="row voffset5">
                    <div className="col-xs-12">
                        <input type="text" className="form-control simple-input" placeholder="补充楼号、门牌号等详细信息" name="address.additional" value={this.state.user.address ? this.state.user.address.additional : ""} onChange={this._handleChange}/>
                    </div>
                </div>
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
                            <input type="text" className="form-control simple-input" placeholder="称呼" value={this.state.user.name ? this.state.user.name : ""} name="name" onChange={this._handleChange}/>
                        </div>
                        <div className="form-group">
                            <label>您的手机号码</label>
                            <input type="number" pattern="[0-9]*" className="form-control simple-input" placeholder="联系人手机" value={this.state.user.mobile ? this.state.user.mobile : ""} name="mobile" onChange={this._handleChange}/>
                        </div>

                        {userAddressContent}

                        <div className="form-group">
                            <label>宠物的名字</label>
                            <input type="text" className="form-control simple-input" placeholder="宠物名字" value={this.state.user.pet_name ? this.state.user.pet_name : ""} name="pet_name" onChange={this._handleChange}/>
                        </div>
                        <div className="form-group">
                            <label>宠物的品种</label>
                            <input type="text" className="form-control simple-input" placeholder="宠物品种" value={this.state.user.pet_type ? this.state.user.pet_type : ""} name="pet_type" onChange={this._handleChange}/>
                        </div>
                        <div className="form-group">
                            <label>宠物的年龄</label>
                            <input type="number" pattern="[0-9]*" className="form-control simple-input" placeholder="宠物年龄" value={this.state.user.pet_age ? this.state.user.pet_age : ""} name="pet_age" onChange={this._handleChange}/>
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
            order.order_id = $("#react-main-mount").attr("orderid");
            order.remark = this.refs.orderRemark.getDOMNode().value;

            if(this.props.isOnSite) {
                order.address = this.state.user.address;
                order.location = this.state.user.location;
            }

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

    _handleAddressChange: function(address, point) {

        var newUser = this.state.user;
        newUser.address.city = address.city;
        newUser.address.district = address.district;
        newUser.address.street = address.street;
        newUser.address.street_number = address.streetNumber;
        newUser.address.business = address.business;
        newUser.address.additional = "";

        newUser.location.type = "Point";
        newUser.location.coordinates = point;

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

