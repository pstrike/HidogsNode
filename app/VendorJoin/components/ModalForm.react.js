/** @jsx React.DOM */

var React = require('react');
var HidogsConstants = require('../../Common/constants/HidogsConstants');
var AppDispatcher = require('../../Common/dispatcher/AppDispatcher');

var Store = require('../stores/Store');
var Actions = require('../actions/Actions');
var Constants = require('../constants/Constants');
var Header = require('./../../Common/components/Header.react.js');
var WXIconUploader = require('./../../Common/components/WXIconUploader');
var WXPicUploader = require('./../../Common/components/WXPicUploader');
var WXSign = require('./../../Common/components/WXSign');
var APVTO = require('../../../util/assignpathvaluetoobject');

function getAppState() {
    return {
        editVendor: Store.getEditVendor(),
        verifyMsg: Store.getVerifyMsg(),
        wxSign: Store.getWXSign(),
    };
};

var app = React.createClass({

    getInitialState: function() {
        return getAppState();
    },

    componentDidMount: function() {
        Store.addChangeListener(this._onChange);
    },

    componentWillUnmount: function() {
        Store.removeChangeListener(this._onChange);
    },

    render: function() {

        var certificateInput = [];
        if(this.state.editVendor.role) {
            for(var i=0; i<this.state.editVendor.role[0].certificate_list.length; i++) {
                var textName = "role.[0].certificate_list.["+i+"].name";
                var imageName = "role.[0].certificate_list.["+i+"].image_url";

                var addFlag = 'false';
                if(i == this.state.editVendor.role[0].certificate_list.length-1) {
                    addFlag = 'true';
                }

                var deleteFlag = 'true';
                if(this.state.editVendor.role[0].certificate_list.length == 1) {
                    deleteFlag = 'false';
                }

                certificateInput.push(<WXPicUploader textName={textName}
                                                     imageName={imageName}
                                                     text={this.state.editVendor.role[0].certificate_list[i].name}
                                                     imageUrl={this.state.editVendor.role[0].certificate_list[i].image_url}
                                                     onChange={this.handleChange}
                                                     delete={deleteFlag}
                                                     onDelete={this._removeCertificate.bind(this, i)}
                                                     add={addFlag}
                                                     onAdd={this._addNewCertificate}
                                                     disabled='false'
                                                     getMedia={this.getWXPicMedia}
                    />);

                if(i != this.state.editVendor.role[0].certificate_list.length-1) {
                    certificateInput.push(<br/>);
                }
            }
        };

        var idCardImageInput = [];
        //idCardImageInput.push(<PicUploader imageName='id_card.front_image_url'
        //                                   textName='id_card.front_image_name'
        //                                   text='身份证正面图片(您照片的那面)'
        //                                   imageUrl={this.state.editVendor.id_card ? this.state.editVendor.id_card.front_image_url : ""}
        //                                   onChange={this.handleChange}
        //                                   delete='false'
        //                                   //onDelete={this._removeCertificate.bind(this, i)}
        //                                   add='false'
        //                                   //onAdd={this._addNewCertificate}
        //                                   onUpload={this.handlePicUpload}
        //                                   disabled='true'
        //    />);
        idCardImageInput.push(<WXPicUploader textName='id_card.front_image_name'
                                             imageName='id_card.front_image_url'
                                             text='身份证正面图片(您照片的那面)'
                                             imageUrl={this.state.editVendor.id_card ? this.state.editVendor.id_card.front_image_url : ""}
                                             onChange={this.handleChange}
                                             delete='false'
                                             //onDelete={this._removeCertificate.bind(this, i)}
                                             add='false'
                                             //onAdd={this._addNewCertificate}
                                             disabled='true'
                                             getMedia={this.getWXPicMedia}
            />);
        idCardImageInput.push(<br/>);
        //idCardImageInput.push(<PicUploader imageName='id_card.back_image_url'
        //                                   textName='id_card.back_image_name'
        //                                   text='身份证背面图片'
        //                                   imageUrl={this.state.editVendor.id_card ? this.state.editVendor.id_card.back_image_url : ""}
        //                                   onChange={this.handleChange}
        //                                   delete='false'
        //                                   //onDelete={this._removeCertificate.bind(this, i)}
        //                                   add='false'
        //                                   //onAdd={this._addNewCertificate}
        //                                   onUpload={this.handlePicUpload}
        //                                   disabled='true'
        //    />);
        idCardImageInput.push(<WXPicUploader textName='id_card.back_image_name'
                                             imageName='id_card.back_image_url'
                                             text='身份证背面图片'
                                             imageUrl={this.state.editVendor.id_card ? this.state.editVendor.id_card.back_image_url : ""}
                                             onChange={this.handleChange}
                                             delete='false'
                                             //onDelete={this._removeCertificate.bind(this, i)}
                                             add='false'
                                             //onAdd={this._addNewCertificate}
                                             disabled='true'
                                             getMedia={this.getWXPicMedia}
            />);

        var workInput = [];
        if(this.state.editVendor.role) {
            for(var i=0; i<this.state.editVendor.role[0].work_list.length; i++) {
                var textName = "role.[0].work_list.["+i+"].name";
                var imageName = "role.[0].work_list.["+i+"].image_url";
                var addFlag = 'false';
                var disabledFlag = 'false';
                var deleteFlag = 'true';

                if(i == this.state.editVendor.role[0].work_list.length-1) {
                    addFlag = 'true';
                }

                if(i < 3) {
                    disabledFlag = 'true';
                    deleteFlag = 'false';
                }

                //workInput.push(<PicUploader textName={textName}
                //                             imageName={imageName}
                //                             text={this.state.editVendor.role[0].work_list[i].name}
                //                             imageUrl={this.state.editVendor.role[0].work_list[i].image_url}
                //                             onChange={this.handleChange}
                //                             delete = {deleteFlag}
                //                             onDelete = {this._removeWork.bind(this, i)}
                //                             add = {addFlag}
                //                             onAdd = {this._addNewWork}
                //                             onUpload = {this.handlePicUpload}
                //                             disabled = {disabledFlag}
                //    />);

                workInput.push(<WXPicUploader textName={textName}
                                              imageName={imageName}
                                              text={this.state.editVendor.role[0].work_list[i].name}
                                              imageUrl={this.state.editVendor.role[0].work_list[i].image_url}
                                              onChange={this.handleChange}
                                              delete={deleteFlag}
                                              onDelete={this._removeWork.bind(this, i)}
                                              add={addFlag}
                                              onAdd={this._addNewWork}
                                              disabled={disabledFlag}
                                              getMedia={this.getWXPicMedia}
                    />);

                if(i != this.state.editVendor.role[0].work_list.length-1) {
                    workInput.push(<br/>);
                }
            }
        };

        var crossModalBtn = "";
        var cancelModalBtn = "";

        switch (this.props.status) {
            case Constants.STATE_VENDOR_APPLICAITON_CREATED:
            case Constants.STATE_VENDOR_APPLICAITON_REVIEWING:
            case Constants.STATE_VENDOR_APPLICAITON_APPROVED:
                // nothing
                break;

            case Constants.STATE_VENDOR_APPLICAITON_DRAFT:
            case Constants.STATE_VENDOR_APPLICAITON_REJECT:
            case Constants.STATE_VENDOR_APPLICAITON_EDITING:

                crossModalBtn = <button type="button" className="close" onClick={this._onCancel}><span
                    aria-hidden="true">&times;</span></button>;

                cancelModalBtn = <button type="button" className="btn btn-default btn-hd-blue" onClick={this._onCancel}>取消</button>;

                break;

            default :
            // nothing
        };

        var verifyMsgContent = "";
        if(this.state.verifyMsg.length > 0) {
            verifyMsgContent = <div className="text-right">
                <p className="bg-danger text-danger verification-msg voffset30">
                    <strong>请根据以下提示, 补充、修改您的资料:</strong><br/>
                    {this.state.verifyMsg.map(function(item) {
                        return <span>{item}<br/></span>;
                    })}
                </p>
            </div>;
        }

        return <div className="modal modal-fullscreen fade" id="vendorProfileEdit" tabindex="-2" role="dialog"
                    aria-labelledby="ProductDetailModalLabel" data-backdrop="static">
            <div className="modal-dialog" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        {crossModalBtn}
                        <h4 className="modal-title text-center" id="ProductDetailModalTitle">加入欢宠服务伙伴</h4>
                    </div>

                    <div className="modal-body">

                        <WXSign signature = {this.state.wxSign}
                                getSign = {this.getWXSign}
                                apilist = 'chooseImage,uploadImage'>
                        </WXSign>

                        <div className="page-header">
                            <WXIconUploader
                                imageUrl={this.state.editVendor.head_image_url}
                                imageName="head_image_url"
                                getMedia={this.getWXPicMedia}/>
                            <br/>
                            <blockquote>
                                <p className="instruction">通过加入成为服务伙伴, 欢宠的宠友用户可以随时发现、预订您所提供的服务. 您只需填写以下的信息即可完成申请, 我们将对您的资料进行基本审核以保证服务质量.</p>
                            </blockquote>
                        </div>

                        <h3>基本信息</h3>

                        <div className="form-group">
                            <label for="vendorNickName">昵称</label>
                            <input type="text" className="form-control simple-input" id="vendorNickName" placeholder="昵称"
                                   name="nick_name" value={this.state.editVendor.nick_name}
                                   onChange={this.handleChange}/>
                        </div>
                        <div className="form-group">
                            <label for="vendorName">姓名</label>
                            <input type="text" className="form-control simple-input" id="vendorName" placeholder="姓名" name="name"
                                   value={this.state.editVendor.name} onChange={this.handleChange}/>
                        </div>
                        <div className="form-group">
                            <label for="vendorGender">性别</label>
                            <select className="form-control simple-input" id="vendorGender" value={this.state.editVendor.gender} name="gender" onChange={this.handleChange}>
                                <option value='1'>男</option>
                                <option value='2'>女</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label for="vendorEmail">电子邮箱</label>
                            <input type="text" className="form-control simple-input" id="vendorEmail" placeholder="电子邮箱"
                                   name="email" value={this.state.editVendor.email} onChange={this.handleChange}/>
                        </div>
                        <div className="form-group">
                            <label for="vendorMobile">手机号码</label>
                            <input type="text" className="form-control simple-input" id="vendorMobile" placeholder="手机号码"
                                   name="mobile" value={this.state.editVendor.mobile} onChange={this.handleChange}/>
                        </div>
                        <div className="form-group">
                            <label for="vendorExperience">从业年限</label>
                            <blockquote>
                                <p className="instruction">请填写您从事宠物美容行业的年数.</p>
                            </blockquote>
                            <select className="form-control simple-input" id="vendorExperience" value={this.state.editVendor.work_experience} name="work_experience" onChange={this.handleChange}>
                                <option value='0'>1年以下</option>
                                <option value='1'>1-2年</option>
                                <option value='2'>2-3年</option>
                                <option value='3'>3-4年</option>
                                <option value='4'>4-5年</option>
                                <option value='5'>5-6年</option>
                                <option value='6'>6-7年</option>
                                <option value='7'>7-8年</option>
                                <option value='8'>8-9年</option>
                                <option value='9'>9-10年</option>
                                <option value='10'>10年以上</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>服务地址</label>
                            <blockquote>
                                <p className="instruction">请填写您提供服务所在地的具体地址. 该地址将作为默认服务地址展现给用户.</p>
                            </blockquote>
                            <div className="row">
                                <div className="col-xs-2"><label className="vcenter34"
                                                                 for="vendorAddressProvince">省份</label></div>
                                <div className="col-xs-10"><input type="text" className="form-control simple-input"
                                                                  id="vendorAddressProvince" placeholder="省份"
                                                                  name="address.province"
                                                                  value={this.state.editVendor.address ? this.state.editVendor.address.province : ""}
                                                                  onChange={this.handleChange}/></div>
                            </div>
                            <div className="row">
                                <div className="col-xs-2"><label className="vcenter34" for="vendorAddressCity">城市</label>
                                </div>
                                <div className="col-xs-10"><input type="text" className="form-control simple-input"
                                                                  id="vendorAddressCity" placeholder="城市"
                                                                  name="address.city"
                                                                  value={this.state.editVendor.address ? this.state.editVendor.address.city : ""}
                                                                  onChange={this.handleChange}/></div>
                            </div>
                            <div className="row">
                                <div className="col-xs-2"><label className="vcenter34"
                                                                 for="vendorAddressRegion">区域</label></div>
                                <div className="col-xs-10"><input type="text" className="form-control simple-input"
                                                                  id="vendorAddressRegion" placeholder="区域"
                                                                  name="address.region"
                                                                  value={this.state.editVendor.address ? this.state.editVendor.address.region : ""}
                                                                  onChange={this.handleChange}/></div>
                            </div>
                            <div className="row">
                                <div className="col-xs-2"><label className="vcenter34"
                                                                 for="vendorAddressDetail">地址</label></div>
                                <div className="col-xs-10"><input type="text" className="form-control simple-input"
                                                                  id="vendorAddressDetail" placeholder="具体地址"
                                                                  name="address.address"
                                                                  value={this.state.editVendor.address ? this.state.editVendor.address.address : ""}
                                                                  onChange={this.handleChange}/></div>
                            </div>
                        </div>
                        <div className="form-group">
                            <label for="vendorDescription">个人描述</label>
                            <textarea id="vendorDescription" className="form-control simple-input" rows="5" name="description"
                                      value={this.state.editVendor.description} onChange={this.handleChange}></textarea>
                        </div>
                        <hr/>

                        <h3 className="hg-session">身份证信息</h3>

                        <div className="form-group">
                            <label for="vendorIdNo">身份证号码</label>
                            <input type="text" className="form-control simple-input" id="vendorIdNo" placeholder="身份证号码"
                                   name="id_card.no"
                                   value={this.state.editVendor.id_card ? this.state.editVendor.id_card.no : ""}
                                   onChange={this.handleChange}/>
                            <br/>
                            {idCardImageInput}
                        </div>
                        <hr/>

                        <h3 className="hg-session">专业认证</h3>
                        <blockquote>
                            <p className="instruction">如果您有相关的专业认证, 请务必填写. 专业认证可以让用户更好的了解您的专业水品.</p>
                        </blockquote>
                        <div className="form-group">
                            {certificateInput}
                        </div>
                        <hr/>

                        <h3 className="hg-session">作品展示</h3>
                        <blockquote>
                            <p className="instruction">请将您最近的美容作品照片按照以下要求上传. 如果您有更多作品照片, 请精选一些您的代表作并添加到您的资料中.</p>
                        </blockquote>
                        <div className="form-group">
                            {workInput}
                        </div>

                        <h3 className="hg-session">服务伙伴协议</h3>
                        <div className="checkbox">
                            <label>
                                <input type="checkbox" name="agreement" checked={this.state.editVendor.agreement} onChange={this.handleChange}/>
                                我已阅读并同意欢宠服务伙伴协议内容
                            </label>
                        </div>
                        <div className="row">
                            <div className="col-xs-12 text-right">
                                <button className="btn btn-hd-blue btn-sm" onClick={this.showAgreement}>查看协议详情</button>
                            </div>
                        </div>

                        {verifyMsgContent}

                    </div>

                    <div className="modal-footer">
                        {cancelModalBtn}
                        <button type="button" className="btn btn-default btn-hd-blue" onClick={this._onSave}>保存</button>
                        <button type="button" className="btn btn-default btn-hd-blue" onClick={this._onSubmit}>提交审核</button>
                    </div>
                </div>
            </div>
        </div>;
    },

    _onSubmit: function() {
        var verifyMsg = this.verify();

        if(verifyMsg.length == 0) {
            var vendor = this.state.editVendor;
            vendor["status"] = "reviewing";

            Actions.updateVendorProfile(vendor, "apply");
        }
        else {
            Actions.verifyProfileForm(verifyMsg);
        }

    },

    _onSave: function() {
        var vendor = this.state.editVendor;
        vendor["status"] = "drafted";

        Actions.updateVendorProfile(vendor, "save");
    },

    _onCancel: function() {
        Actions.cancelProfileEdit();
    },

    _addNewCertificate: function () {
        var vendor = this.state.editVendor;
        if(!vendor.role[0].certificate_list) {
            vendor.role[0].certificate_list = [{}];
        }
        else {
            vendor.role[0].certificate_list.push({});
        }
        this.setState({editVendor: vendor});
    },

    _removeCertificate: function (index) {
        var vendor = this.state.editVendor;
        vendor.role[0].certificate_list.splice(index,1);
        this.setState({editVendor: vendor});
    },

    _addNewWork: function () {
        var vendor = this.state.editVendor;
        if(!vendor.role[0].work_list) {
            vendor.role[0].work_list = [{}];
        }
        else {
            vendor.role[0].work_list.push({});
        }
        this.setState({editVendor: vendor});
    },

    _removeWork: function (index) {
        var vendor = this.state.editVendor;
        vendor.role[0].work_list.splice(index,1);
        this.setState({editVendor: vendor});
    },

    handleChange: function(event) {
        var value = event.target.value;

        if(event.target.name == "agreement") {
            value = event.target.checked;
        }

        var newVendor = APVTO.assign(this.state.editVendor, event.target.name, value);

        this.setState({editVendor: newVendor});
    },

    //handlePicUpload: function(name, data) {
    //    if(data) {
    //        Actions.uploadPicture(data, "", name);
    //    }
    //    else {
    //        alert("请选择图片.");
    //    }
    //
    //    var newVendor = APVTO.assign(this.state.editVendor, name, 'loadingspinner');
    //    this.setState({editVendor: newVendor});
    //},

    getWXPicMedia: function(pic, mediaId, name, type) {
        Actions.uploadWXPicture(mediaId, name, type);

        var newVendor = APVTO.assign(this.state.editVendor, name, pic);
        this.setState({editVendor: newVendor});
    },

    verify: function() {
        var verifyMsg = [];

        if(this.state.editVendor.nick_name == "") {
            verifyMsg.push("-请填写昵称");
        }

        if(this.state.editVendor.name == "") {
            verifyMsg.push("-请填写姓名");
        }

        if(this.state.editVendor.gender == "") {
            verifyMsg.push("-请填写性别");
        }

        if(this.state.editVendor.mobile == "") {
            verifyMsg.push("-请填写手机号码");
        }

        if(this.state.editVendor.address.address == "") {
            verifyMsg.push("-请填写具体地址");
        }

        if(this.state.editVendor.id_card.no == "") {
            verifyMsg.push("-请填写身份证号码");
        }

        if(this.state.editVendor.id_card.front_image_name == "") {
            verifyMsg.push("-请上传身份证正面照片");
        }

        if(this.state.editVendor.id_card.back_image_name == "") {
            verifyMsg.push("-请上传身份证背面照片");
        }

        if(this.state.editVendor.role[0].work_list[0].image_url == "") {
            verifyMsg.push("-请上传您美容作品站立正面图");
        }

        if(this.state.editVendor.role[0].work_list[1].image_url == "") {
            verifyMsg.push("-请上传您美容作品站立侧身图");
        }

        if(this.state.editVendor.role[0].work_list[2].image_url == "") {
            verifyMsg.push("-请上传您美容作品站立背面图");
        }

        if(this.state.editVendor.agreement == false) {
            verifyMsg.push("-只有当您阅读并同意服务协议才可以继续申请流程");
        }

        return verifyMsg;
    },

    showAgreement: function() {
        Actions.showAgreement();
    },

    getWXSign: function() {
        Actions.getWXSignature(document.location.href);
    },

    _onChange: function() {
        this.setState(getAppState());
    },

});

module.exports = app;
