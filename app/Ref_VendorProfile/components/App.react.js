/** @jsx React.DOM */

var React = require('react');
var HidogsConstants = require('../../Common/constants/HidogsConstants');
var AppDispatcher = require('../../Common/dispatcher/AppDispatcher');

var Store = require('../stores/Store');
var Actions = require('../actions/Actions');
var Constants = require('../constants/Constants');
var ModalForm = require('../components/ModalForm.react');
var Header = require('./../../Common/components/Header.react.js');

function getAppState() {
    return {
        vendor: Store.getVendor(),
        status: Store.getStatus(),
    };
};

var app = React.createClass({

    getInitialState: function() {
        return getAppState();
    },

    componentDidMount: function() {
        Store.addChangeListener(this._onChange);
        Actions.getSessionOpenidThenLoadVendorProfile();
    },

    componentWillUnmount: function() {
        Store.removeChangeListener(this._onChange);
    },

    componentDidUpdate: function() {
        switch (this.state.status) {
            case Constants.STATE_VENDOR_APPLICAITON_CREATED:
                $('#profileFormModal').modal('show');
                break;

            case Constants.STATE_VENDOR_APPLICAITON_DRAFT:
                $('#profileFormModal').modal('hide');
                break;

            case Constants.STATE_VENDOR_APPLICAITON_REVIEWING:
                $('#profileFormModal').modal('hide');
                break;

            case Constants.STATE_VENDOR_APPLICAITON_REJECT:
                $('#profileFormModal').modal('hide');
                break;

            case Constants.STATE_VENDOR_APPLICAITON_APPROVED:
                $('#profileFormModal').modal('hide');
                break;

            default :
                $('#profileFormModal').modal('hide');
        };


    },

    render: function() {

        var editBtn = "";
        var statusMsg = "";

        switch (this.state.status) {
            case Constants.STATE_VENDOR_APPLICAITON_CREATED:

                break;

            case Constants.STATE_VENDOR_APPLICAITON_DRAFT:

                statusMsg = <div>
                    <p>状态: 草稿</p>
                </div>;

                editBtn = <div id="footer" className="container-fluid">
                    <nav className="navbar navbar-default navbar-fixed-bottom">
                        <div className="navbar-inner navbar-content-center">
                            <button type="submit" className="btn btn-default" data-toggle="modal"
                                    data-target="#profileFormModal">修改
                            </button>
                        </div>
                    </nav>
                </div>;

                break;

            case Constants.STATE_VENDOR_APPLICAITON_REVIEWING:

                statusMsg = <div><p>正在审核,请耐心等待</p></div>;
                break;

            case Constants.STATE_VENDOR_APPLICAITON_REJECT:
                statusMsg = <div>
                    <p>申请被拒绝,请参考以下原因</p>
                    <p>{this.state.vendor.reject_reason}</p>
                </div>;

                editBtn = <div id="footer" className="container-fluid">
                    <nav className="navbar navbar-default navbar-fixed-bottom">
                        <div className="navbar-inner navbar-content-center">
                            <button type="submit" className="btn btn-default" data-toggle="modal"
                                    data-target="#profileFormModal">修改
                            </button>
                        </div>
                    </nav>
                </div>;

                break;

            case Constants.STATE_VENDOR_APPLICAITON_APPROVED:
                statusMsg = <div>
                    <p>审批已经完成.感谢您加入欢宠成为服务伙伴:)</p>
                </div>;
                break;

            default :
                // nothing
        };

        return <div>
            <Header/>

            <ModalForm vendor={this.state.vendor} status={this.state.status}/>

            <div className="container-fluid">
                <div className="page-header">
                    <img src={this.state.vendor.head_image_url} className="img-responsive img-circle"/>

                    <h1>{this.state.vendor.nick_name}</h1>

                    {statusMsg}
                </div>

                <h3>评级</h3>

                <ul>
                    {this.state.vendor.rate_list ? this.state.vendor.rate_list.map(function(item, index) {
                        return <li>{item.name}: {item.rate}</li>
                    }) : ""}
                </ul>

                <h3>真实姓名</h3>
                <p>{this.state.vendor.name}</p>

                <h3>性别</h3>
                <p>{this.state.vendor.gender}</p>

                <h3>电子邮箱</h3>
                <p>{this.state.vendor.email}</p>

                <h3>手机</h3>
                <p>{this.state.vendor.mobile}</p>

                <h3>地址</h3>
                <ul>
                    <li>国家: {this.state.vendor.address ? this.state.vendor.address.country : ""}</li>
                    <li>省份: {this.state.vendor.address ? this.state.vendor.address.province : ""}</li>
                    <li>城市: {this.state.vendor.address ? this.state.vendor.address.city : ""}</li>
                    <li>区域: {this.state.vendor.address ? this.state.vendor.address.region : ""}</li>
                    <li>具体地址: {this.state.vendor.address ? this.state.vendor.address.address : ""}</li>
                </ul>

                <h3>身份证信息</h3>
                <p>{this.state.vendor.id_card ? this.state.vendor.id_card.no : ""}</p>
                <img src={this.state.vendor.id_card ? this.state.vendor.id_card.front_image_url : ""} className="img-responsive"/>
                <img src={this.state.vendor.id_card ? this.state.vendor.id_card.back_image_url : ""} className="img-responsive"/>

                <h3>专业认证</h3>
                {this.state.vendor.certificate_list ? this.state.vendor.certificate_list.map(function(item, index){
                    return <p>{item.name}<img src={item.image_url} className="img-responsive"/></p>;
                }) : ""}


                <h3>达人介绍</h3>
                <p>{this.state.vendor.description}</p>

                <h3>营业时间</h3>
                {this.state.vendor.business_time_list ? this.state.vendor.business_time_list.map(function(item, index){
                    return <p>{item.start_time}-{item.end_time}</p>
                }) : ""}

                <h3>休息时间</h3>
                {this.state.vendor.timeoff_list ? this.state.vendor.timeoff_list.map(function(item, index){
                    return <p>{item.start_time}-{item.end_time}</p>
                }) : ""}

                <h3>同一时间可提供服务数</h3>
                <p>{this.state.vendor.concurrent_no}</p>

                <h3>支付账号</h3>
                <p>{this.state.vendor.payment_account}</p>

                <h3>图片</h3>
                {this.state.vendor.image_url_list ? this.state.vendor.image_url_list.map(function(item, index){
                    return <img src={item.image_url} className="img-responsive"/>;
                }) : ""}

            </div>

            {editBtn}

        </div>;
    },

    _onChange: function() {
        this.setState(getAppState());
    }

});

module.exports = app;

