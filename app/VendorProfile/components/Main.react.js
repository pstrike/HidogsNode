/** @jsx React.DOM */

var React = require('react');
var HidogsConstants = require('../../Common/constants/HidogsConstants');
var AppDispatcher = require('../../Common/dispatcher/AppDispatcher');

var Store = require('../stores/Store');
var Actions = require('../actions/Actions');
var Header = require('./../../Common/components/Header.react.js');


var app = React.createClass({

    render: function() {

        // address
        var addressContent = "";
        if(this.props.vendor.address && this.props.vendor.address.district) {
            addressContent = (this.props.vendor.address.city ? this.props.vendor.address.city : "") +
                (this.props.vendor.address.district ? this.props.vendor.address.district : "") +
                (this.props.vendor.address.street ? this.props.vendor.address.street : "") +
                (this.props.vendor.address.business ? this.props.vendor.address.business : "");
        }

        // Page Style
        var pageStyleContent = "";
        if(this.props.vendor.setting) {
            switch(this.props.vendor.setting.page_style) {
                case "blue":
                    pageStyleContent = "蓝色";
                    break;
                case "yellow":
                    pageStyleContent = "黄色";
                    break;
                case "red":
                    pageStyleContent = "红色";
                    break;
                case "orange":
                    pageStyleContent = "橙色";
                    break;
                case "green":
                    pageStyleContent = "绿色";
                    break;
            }
        }


        return (
            <div id="react_body">
                <Header subtitle="服务伙伴 - 个人主页/信息管理"></Header>

                <div className="container">

                    <div className="page-header">
                        <img src={this.props.vendor.head_image_url}
                             className="center-block img-responsive img-circle user-icon-header"/>
                        <h3 className="text-center voffset10">{this.props.vendor.nick_name}</h3>
                    </div>

                    <div className="form-group">
                        <label>姓名</label>
                        <input type="text" className="form-control no-border" placeholder="暂未设置姓名" value={this.props.vendor.name} disabled/>
                    </div>
                    <div className="form-group">
                        <label>性别</label>
                        <input type="text" className="form-control no-border" placeholder="暂未设置性别" value={this.props.vendor.gender==1 ? "男" : "女"} disabled/>
                    </div>
                    <div className="form-group">
                        <label>电子邮箱</label>
                        <input type="text" className="form-control no-border" placeholder="暂未设置电子邮箱" value={this.props.vendor.email} disabled/>
                    </div>
                    <div className="form-group">
                        <label>手机号码</label>
                        <input type="text" className="form-control no-border" placeholder="暂未设置手机号码" value={this.props.vendor.mobile} disabled/>
                    </div>
                    <div className="form-group">
                        <label>服务地址</label>
                        <textarea className="form-control no-border" rows="2" placeholder="暂未设置服务地址" value={addressContent} disabled></textarea>
                    </div>
                    <div className="form-group">
                        <label>个人描述</label>
                        <textarea className="form-control no-border" rows="5" placeholder="暂未设置个人描述" value={this.props.vendor.description} disabled></textarea>
                    </div>
                    <div className="form-group">
                        <label>个人主页配色</label>
                        <input type="text" className="form-control no-border" placeholder="暂未设置主页配色" value={pageStyleContent} disabled/>
                    </div>

                    <div className="form-group">
                        <label for="vendorMobile">个人主页图片</label>
                        {this.props.vendor.image_url_list ? this.props.vendor.image_url_list.map(function(item){
                            if(item.name == "" && item.image_url == "") {
                                return "无内容";
                            }
                            else {
                                return <div>
                                    <div className="row">
                                        <div className="col-xs-2"><label className="vcenter34">名称</label></div>
                                        <div className="col-xs-10"><input type="text" className="form-control no-border"
                                                                          placeholder="名称" value={item.name} disabled/></div>
                                    </div>
                                    <div className="row">
                                        <div className="col-xs-2"><label className="vcenter34">图片</label></div>
                                        <div className="col-xs-10">
                                            <img className="img-responsive" src={item.image_url ? item.image_url : '../../../img/image_placeholer.png'}/>
                                        </div>
                                    </div>
                                    <br/>
                                </div>;
                            }

                        }) : ""}
                    </div>

                </div>

                <footer className="footer bg-white">
                    <div className="container">
                        <div className="row text-right">
                            <div className="col-xs-12">
                                <button className="btn btn-hd-blue text-muted" onClick={this._navToVendorPage}>个人主页</button>
                                <button className="btn btn-hd-blue text-muted" onClick={this._triggerEdit}>编辑</button>
                            </div>
                        </div>
                    </div>
                </footer>

            </div>
        );
    },

    _navToVendorPage: function() {
        window.location = "http://www.hidogs.cn/vendor/view/vendorpageprecheck?vendor="+this.props.vendor.vendor_id;
    },

    _triggerEdit: function() {
        Actions.triggerEditFromView();
    },

});

module.exports = app;

