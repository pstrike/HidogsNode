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
            case Constants.STATE_VENDOR_APPLICAITON_EDITING:
                $('#vendorProfileEdit').modal('show');
                break;

            case Constants.STATE_VENDOR_APPLICAITON_DRAFT:
            case Constants.STATE_VENDOR_APPLICAITON_REVIEWING:
            case Constants.STATE_VENDOR_APPLICAITON_REJECT:
            case Constants.STATE_VENDOR_APPLICAITON_APPROVED:
                $('#vendorProfileEdit').modal('hide');
                break;

            default :
                $('#vendorProfileEdit').modal('hide');
        };

    },

    render: function() {

        var editBtn = "";
        var statusMsg = "";

        switch (this.state.status) {
            case Constants.STATE_VENDOR_APPLICAITON_CREATED:

                break;

            case Constants.STATE_VENDOR_APPLICAITON_DRAFT:

                statusMsg = <div className="row text-right"><div className="col-xs-12">
                    <span className="label label-default">草稿</span>
                </div></div>;

                editBtn = <footer className="footer">
                    <div className="container">
                        <div className="row text-right">
                            <div className="col-xs-12">
                                <button className="btn btn-hd-blue text-muted" onClick={this._onEdit}>编辑</button>
                            </div>
                        </div>
                    </div>
                </footer>;

                break;

            case Constants.STATE_VENDOR_APPLICAITON_REVIEWING:

                statusMsg = <div className="row text-right"><div className="col-xs-12">
                    <span className="label label-primary">申请审核中</span>
                </div></div>;
                break;

            case Constants.STATE_VENDOR_APPLICAITON_REJECT:
                statusMsg = <div className="row text-right"><div className="col-xs-12">
                        <span className="label label-danger">申请失败</span>
                        <p className="text-danger voffset5">{this.state.vendor.reject_reason}</p>
                    </div></div>;

                editBtn = <footer className="footer">
                    <div className="container">
                        <div className="row text-right">
                            <div className="col-xs-12">
                                <button className="btn btn-hd-blue text-muted" onClick={this._onEdit}>编辑</button>
                            </div>
                        </div>
                    </div>
                </footer>;

                break;

            case Constants.STATE_VENDOR_APPLICAITON_APPROVED:
                statusMsg = <div className="row text-right"><div className="col-xs-12">
                    <span className="label label-success">申请成功</span>
                </div></div>;
                break;

            default :
                // nothing
        };

        var workExperienceContent = "";
        switch (this.state.vendor.work_experience) {
            case '0':
                workExperienceContent = '1年以下';
                break;
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
            case '7':
            case '8':
            case '9':
                var i = parseInt(this.state.vendor.work_experience);
                var j = parseInt(this.state.vendor.work_experience)+1;
                workExperienceContent = i+'-'+j+'年';
                break;
            case '10':
                workExperienceContent = '10年以上';
                break;
            default:
                // keep blank word
        }

        return <div>
            <Header subtitle="服务伙伴 - 申请加入"/>

            <ModalForm vendor={this.state.vendor} status={this.state.status}></ModalForm>

            <div className="container voffset60">
                <div className="page-header">

                    <img src={this.state.vendor.head_image_url}
                         className="center-block img-responsive img-circle user-icon-header"/>

                    <h3 className="text-center">{this.state.vendor.nick_name}</h3>
                    {statusMsg}
                </div>

                <h3>基本信息</h3>

                <div className="form-group">
                    <label>姓名</label>
                    <input type="text" className="form-control no-border" placeholder="姓名" value={this.state.vendor.name} disabled/>
                </div>
                <div className="form-group">
                    <label>性别</label>
                    <input type="text" className="form-control no-border" placeholder="性别" value={this.state.vendor.gender==1 ? "男" : "女"} disabled/>
                </div>
                <div className="form-group">
                    <label>电子邮箱</label>
                    <input type="text" className="form-control no-border" placeholder="电子邮箱" value={this.state.vendor.email}
                           disabled/>
                </div>
                <div className="form-group">
                    <label>手机号码</label>
                    <input type="text" className="form-control no-border" placeholder="手机号码" value={this.state.vendor.mobile}
                           disabled/>
                </div>
                <div className="form-group">
                    <label>从业年限</label>
                    <input type="text" className="form-control no-border" placeholder="从业年限" value={workExperienceContent} disabled/>
                </div>
                <div className="form-group">
                    <label>服务地址</label>

                    <div className="row">
                        <div className="col-xs-2"><label className="vcenter34">省份</label></div>
                        <div className="col-xs-10"><input type="text" className="form-control no-border"
                                                          placeholder="省份" value={this.state.vendor.address ? this.state.vendor.address.province : ""} disabled/>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-xs-2"><label className="vcenter34">城市</label></div>
                        <div className="col-xs-10"><input type="text" className="form-control no-border"
                                                          placeholder="城市" value={this.state.vendor.address ? this.state.vendor.address.city : ""} disabled/>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-xs-2"><label className="vcenter34">区域</label></div>
                        <div className="col-xs-10"><input type="text" className="form-control no-border"
                                                          placeholder="区域" value={this.state.vendor.address ? this.state.vendor.address.region : ""} disabled/>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-xs-2"><label className="vcenter34">地址</label></div>
                        <div className="col-xs-10"><input type="text" className="form-control no-border"
                                                          placeholder="具体地址" value={this.state.vendor.address ? this.state.vendor.address.address : ""} disabled/>
                        </div>
                    </div>
                </div>
                <div className="form-group">
                    <label>个人描述</label>
                    <textarea className="form-control no-border" rows="5" value={this.state.vendor.description} disabled></textarea>
                </div>

                <h3 className="hg-session">身份证信息</h3>

                <div className="form-group">
                    <label>身份证号码</label>
                    <input type="text" className="form-control no-border" placeholder="身份证号码" value={this.state.vendor.id_card ? this.state.vendor.id_card.no : ""}
                           disabled/>
                    <br/>

                    <div className="row">
                        <div className="col-xs-2"><label className="vcenter34">名称</label></div>
                        <div className="col-xs-10"><input type="text" className="form-control no-border"
                                                          placeholder="身份证正面照片" value="身份证正面照片" disabled/></div>
                    </div>
                    <div className="row">
                        <div className="col-xs-2"><label className="vcenter34">图片</label></div>
                        <div className="col-xs-10">
                            <img className="img-responsive" src={this.state.vendor.id_card ? (this.state.vendor.id_card.front_image_url ? this.state.vendor.id_card.front_image_url : "../../../img/image_placeholer.png") : "../../../img/image_placeholer.png"}/>
                        </div>
                    </div>
                    <br/>

                    <div className="row">
                        <div className="col-xs-2"><label className="vcenter34">名称</label></div>
                        <div className="col-xs-10"><input type="text" className="form-control no-border"
                                                          placeholder="身份证背面照片" value="身份证背面照片" disabled/></div>
                    </div>
                    <div className="row">
                        <div className="col-xs-2"><label className="vcenter34">图片</label></div>
                        <div className="col-xs-10">
                            <img className="img-responsive" src={this.state.vendor.id_card ? (this.state.vendor.id_card.back_image_url ? this.state.vendor.id_card.back_image_url : "../../../img/image_placeholer.png"): "../../../img/image_placeholer.png"}/>
                        </div>
                    </div>
                </div>

                <h3 className="hg-session">专业认证</h3>

                <div className="form-group">

                    {this.state.vendor.role ? this.state.vendor.role[0].certificate_list.map(function(item){
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

                <h3 className="hg-session">作品展示</h3>

                <div className="form-group">
                    {this.state.vendor.role ? this.state.vendor.role[0].work_list.map(function(item){
                        if(item.name == "" && item.image_url == "") {
                            return "无内容";
                        }
                        else {
                            return <div>
                                <div className="row">
                                    <div className="col-xs-2"><label className="vcenter34">名称</label></div>
                                    <div className="col-xs-10"><input type="text" className="form-control no-border"
                                                                      placeholder="名称" value={item.name} disabled/>
                                    </div>
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

            {editBtn}

        </div>;
    },

    _onEdit: function() {
        Actions.triggerProfileEdit();
    },

    _onChange: function() {
        this.setState(getAppState());
    },

});

module.exports = app;

