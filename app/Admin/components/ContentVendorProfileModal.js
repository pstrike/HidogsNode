/** @jsx React.DOM */

var React = require('react');
var HidogsConstants = require('../../Common/constants/HidogsConstants');
var AppDispatcher = require('../../Common/dispatcher/AppDispatcher');

var Actions = require('../actions/Actions');

var app = React.createClass({

    render: function() {

        var approveBtn = "";
        var rejectBtnGroup = "";
        if(this.props.vendor.status == "reviewing") {
            approveBtn = <button type="button" className="btn btn-default" onClick={this._approveVendor} data-dismiss="modal">审批通过</button>;
            rejectBtnGroup = <div>
                <button type="button" className="btn btn-default" onClick={this._rejectVendor} data-dismiss="modal">拒绝</button>
                <input type="text" className="form-control" ref="rejectReason"/>
            </div>;
        }

        return (
            <div className="modal-fullscreen modal fade" id="profileModal" tabindex="-1" role="dialog"
                 aria-labelledby="myModalLabel" data-backdrop="static">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">

                        <div className="modal-header">
                            <button type="button" className="close" data-dismiss="modal"><span
                                aria-hidden="true">&times;</span></button>
                            <h4 className="modal-title">服务伙伴详情</h4>
                        </div>

                        <div className="modal-body">
                            <img src={this.props.vendor.head_image_url} className="img-responsive img-circle"/>
                            <h1>{this.props.vendor.nick_name}</h1>
                            <h3>评级</h3>

                            <ul>
                                {this.props.vendor.rate_list ? this.props.vendor.rate_list.map(function(item, index) {
                                    return <li>{item.name}: {item.rate}</li>
                                }) : ""}
                            </ul>

                            <h3>状态</h3>
                            <p>{this.props.vendor.status}</p>

                            <h3>真实姓名</h3>
                            <p>{this.props.vendor.name}</p>

                            <h3>性别</h3>
                            <p>{this.props.vendor.gender}</p>

                            <h3>电子邮箱</h3>
                            <p>{this.props.vendor.email}</p>

                            <h3>手机</h3>
                            <p>{this.props.vendor.mobile}</p>

                            <h3>地址</h3>
                            <ul>
                                <li>国家: {this.props.vendor.address ? this.props.vendor.address.country : ""}</li>
                                <li>省份: {this.props.vendor.address ? this.props.vendor.address.province : ""}</li>
                                <li>城市: {this.props.vendor.address ? this.props.vendor.address.city : ""}</li>
                                <li>区域: {this.props.vendor.address ? this.props.vendor.address.region : ""}</li>
                                <li>具体地址: {this.props.vendor.address ? this.props.vendor.address.address : ""}</li>
                            </ul>

                            <h3>身份证信息</h3>
                            <p>{this.props.vendor.id_card ? this.props.vendor.id_card.no : ""}</p>
                            <img src={this.props.vendor.id_card ? this.props.vendor.id_card.front_image_url : ""} className="img-responsive"/>
                            <img src={this.props.vendor.id_card ? this.props.vendor.id_card.back_image_url : ""} className="img-responsive"/>

                            <h3>专业认证</h3>
                            {this.props.vendor.certificate_list ? this.props.vendor.certificate_list.map(function(item, index){
                                return <p>{item.name}<img src={item.image_url} className="img-responsive"/></p>;
                            }) : ""}


                            <h3>达人介绍</h3>
                            <p>{this.props.vendor.description}</p>

                            <h3>营业时间</h3>
                            {this.props.vendor.business_time_list ? this.props.vendor.business_time_list.map(function(item, index){
                                return <p>{item.start_time}-{item.end_time}</p>
                            }) : ""}

                            <h3>休息时间</h3>
                            {this.props.vendor.timeoff_list ? this.props.vendor.timeoff_list.map(function(item, index){
                                return <p>{item.start_time}-{item.end_time}</p>
                            }) : ""}

                            <h3>同一时间可提供服务数</h3>
                            <p>{this.props.vendor.concurrent_no}</p>

                            <h3>支付账号</h3>
                            <p>{this.props.vendor.payment_account}</p>

                            <h3>图片</h3>
                            {this.props.vendor.image_url_list ? this.props.vendor.image_url_list.map(function(item, index){
                                return <img src={item.image_url} className="img-responsive"/>;
                            }) : ""}

                        </div>

                        <div className="modal-footer">
                            <button type="button" className="btn btn-default"
                                    data-dismiss="modal">关闭
                            </button>

                            {approveBtn}
                            {rejectBtnGroup}

                        </div>

                    </div>
                </div>
            </div>
        );
    },

    _approveVendor: function() {
        var vendor = this.props.vendor;
        vendor.status = "approved";
        Actions.vendorApproveVendor(vendor);
    },

    _rejectVendor: function() {
        var vendor = this.props.vendor;
        vendor.reject_reason = this.refs.rejectReason.getDOMNode().value;
        vendor.status = "rejected";
        Actions.vendorApproveVendor(vendor);
    },


});

module.exports = app;

