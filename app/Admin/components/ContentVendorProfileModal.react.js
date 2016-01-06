/** @jsx React.DOM */

var React = require('react');
var HidogsConstants = require('../../Common/constants/HidogsConstants');
var AppDispatcher = require('../../Common/dispatcher/AppDispatcher');

var Actions = require('../actions/Actions');

var app = React.createClass({

    render: function() {

        var approveBtn = "";
        var rejectBtnGroup = [];
        if(this.props.vendor.status == "reviewing") {
            approveBtn = <button type="button" className="btn btn-default" onClick={this._approveVendor} data-dismiss="modal">审批通过</button>;

            rejectBtnGroup.push(<button type="button" className="btn btn-default roffset5" onClick={this._rejectVendor} data-dismiss="modal">拒绝</button>);
            rejectBtnGroup.push(<input type="text" className="form-control simple-input" ref="rejectReason" placeholder="拒绝原因"/>);
        }

        var workExperienceContent = "";
        switch (this.props.vendor.work_experience) {
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
                var i = parseInt(this.props.vendor.work_experience);
                var j = parseInt(this.props.vendor.work_experience)+1;
                workExperienceContent = i+'-'+j+'年';
                break;
            case '10':
                workExperienceContent = '10年以上';
                break;
            default:
            // keep blank word
        }

        // Address
        var addressContent = "";
        if(this.props.vendor.address) {
            addressContent = (this.props.vendor.address.city ? this.props.vendor.address.city : "") +
                (this.props.vendor.address.district ? this.props.vendor.address.district : "") +
                (this.props.vendor.address.street ? this.props.vendor.address.street : "") +
                (this.props.vendor.address.business ? this.props.vendor.address.business : "") +
                (this.props.vendor.address.additional ? this.props.vendor.address.additional : "");
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
                            <img src={this.props.vendor.head_image_url}
                                 className="center-block img-responsive img-circle user-icon-header"/>

                            <h3 className="text-center">{this.props.vendor.nick_name}</h3>

                            <h3>基本信息</h3>

                            <div className="form-group">
                                <label>姓名</label>
                                <input type="text" className="form-control no-border" placeholder="姓名" value={this.props.vendor.name} disabled/>
                            </div>
                            <div className="form-group">
                                <label>性别</label>
                                <input type="text" className="form-control no-border" placeholder="性别" value={this.props.vendor.gender==1 ? "男" : "女"} disabled/>
                            </div>
                            <div className="form-group">
                                <label>电子邮箱</label>
                                <input type="text" className="form-control no-border" placeholder="电子邮箱" value={this.props.vendor.email}
                                       disabled/>
                            </div>
                            <div className="form-group">
                                <label>手机号码</label>
                                <input type="text" className="form-control no-border" placeholder="手机号码" value={this.props.vendor.mobile}
                                       disabled/>
                            </div>
                            <div className="form-group">
                                <label>从业年限</label>
                                <input type="text" className="form-control no-border" placeholder="从业年限" value={workExperienceContent} disabled/>
                            </div>
                            <div className="form-group">
                                <label>服务地址</label>
                                <textarea className="form-control no-border" rows="2" value={addressContent} disabled></textarea>
                            </div>
                            <div className="form-group">
                                <label>个人描述</label>
                                <textarea className="form-control no-border" rows="5" value={this.props.vendor.description} disabled></textarea>
                            </div>

                            <h3 className="hg-session">身份证信息</h3>

                            <div className="form-group">
                                <label>身份证号码</label>
                                <input type="text" className="form-control no-border" placeholder="身份证号码" value={this.props.vendor.id_card ? this.props.vendor.id_card.no : ""}
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
                                        <img className="img-responsive" src={this.props.vendor.id_card ? (this.props.vendor.id_card.front_image_url ? this.props.vendor.id_card.front_image_url : "../../../img/image_placeholer.png") : "../../../img/image_placeholer.png"}/>
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
                                        <img className="img-responsive" src={this.props.vendor.id_card ? (this.props.vendor.id_card.back_image_url ? this.props.vendor.id_card.back_image_url : "../../../img/image_placeholer.png"): "../../../img/image_placeholer.png"}/>
                                    </div>
                                </div>
                            </div>

                            <h3 className="hg-session">专业认证</h3>

                            <div className="form-group">

                                {this.props.vendor.role ? this.props.vendor.role[0].certificate_list.map(function(item){
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
                                {this.props.vendor.role ? this.props.vendor.role[0].work_list.map(function(item){
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

                        <div className="modal-footer form-inline">
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
        vendor.role[0].status = "approved";
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

