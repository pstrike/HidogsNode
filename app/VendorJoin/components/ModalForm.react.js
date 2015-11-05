/** @jsx React.DOM */

var React = require('react');
var HidogsConstants = require('../../Common/constants/HidogsConstants');
var AppDispatcher = require('../../Common/dispatcher/AppDispatcher');

var Store = require('../stores/Store');
var Actions = require('../actions/Actions');
var Constants = require('../constants/Constants');
var Header = require('./../../Common/components/Header.react.js');
var PicUploader = require('./../../Common/components/PicUploader');
var IconUploader = require('./../../Common/components/IconUploader');
var APVTO = require('../../../util/assignpathvaluetoobject');

function getAppState() {
    return {
        editVendor: Store.getEditVendor(),
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
        if(this.state.editVendor.certificate_list) {
            for(var i=0; i<this.state.editVendor.certificate_list.length; i++) {
                var textName = "certificate_list.["+i+"].name";
                var imageName = "certificate_list.["+i+"].image_url";

                var addFlag = 'false';
                if(i == this.state.editVendor.certificate_list.length-1) {
                    addFlag = 'true';
                }

                var deleteFlag = 'false';
                if(i > 0) {
                    deleteFlag = 'true';
                }

                certificateInput.push(<PicUploader textName={textName}
                                                   imageName={imageName}
                                                   text={this.state.editVendor.certificate_list[i].name}
                                                   imageUrl={this.state.editVendor.certificate_list[i].image_url}
                                                   onChange={this.handleChange}
                                                   delete = {deleteFlag}
                                                   onDelete = {this._removeCertificate.bind(this, i)}
                                                   add = {addFlag}
                                                   onAdd = {this._addNewCertificate}
                                                   onUpload = {this.handlePicUpload}
                                                   disabled = 'false'
                    />);

                if(i != this.state.editVendor.certificate_list.length-1) {
                    certificateInput.push(<br/>);
                }
            }
        };

        var idCardImageInput = [];
        idCardImageInput.push(<PicUploader imageName='id_card.front_image_url'
                                           textName='id_card.front_image_name'
                                           text='身份证正面图片(您照片的那面)'
                                           imageUrl={this.state.editVendor.id_card ? this.state.editVendor.id_card.front_image_url : ""}
                                           onChange={this.handleChange}
                                           delete='false'
                                           //onDelete={this._removeCertificate.bind(this, i)}
                                           add='false'
                                           //onAdd={this._addNewCertificate}
                                           onUpload={this.handlePicUpload}
                                           disabled='true'
            />);
        idCardImageInput.push(<br/>);
        idCardImageInput.push(<PicUploader imageName='id_card.back_image_url'
                                           textName='id_card.back_image_name'
                                           text='身份证背面图片'
                                           imageUrl={this.state.editVendor.id_card ? this.state.editVendor.id_card.back_image_url : ""}
                                           onChange={this.handleChange}
                                           delete='false'
                                           //onDelete={this._removeCertificate.bind(this, i)}
                                           add='false'
                                           //onAdd={this._addNewCertificate}
                                           onUpload={this.handlePicUpload}
                                           disabled='true'
            />);

        var imageInput = [];
        if(this.state.editVendor.image_url_list) {
            for(var i=0; i<this.state.editVendor.image_url_list.length; i++) {
                var textName = "image_url_list.["+i+"].name";
                var imageName = "image_url_list.["+i+"].image_url";
                var addFlag = 'false';
                var disabledFlag = 'false';
                var deleteFlag = 'true';

                if(i == this.state.editVendor.image_url_list.length-1) {
                    addFlag = 'true';
                }

                if(i < 3) {
                    disabledFlag = 'true';
                    deleteFlag = 'false';
                }

                imageInput.push(<PicUploader textName={textName}
                                             imageName={imageName}
                                             text={this.state.editVendor.image_url_list[i].name}
                                             imageUrl={this.state.editVendor.image_url_list[i].image_url}
                                             onChange={this.handleChange}
                                             delete = {deleteFlag}
                                             onDelete = {this._removeImage.bind(this, i)}
                                             add = {addFlag}
                                             onAdd = {this._addNewImage}
                                             onUpload = {this.handlePicUpload}
                                             disabled = {disabledFlag}
                    />);

                if(i != this.state.editVendor.image_url_list.length-1) {
                    imageInput.push(<br/>);
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

        return <div className="modal modal-fullscreen fade" id="vendorProfileEdit" tabindex="-2" role="dialog"
                    aria-labelledby="ProductDetailModalLabel" data-backdrop="static">
            <div className="modal-dialog" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        {crossModalBtn}
                        <h4 className="modal-title text-center" id="ProductDetailModalTitle">加入欢宠服务伙伴</h4>
                    </div>

                    <div className="modal-body">

                        <div className="page-header">
                            <IconUploader imageUrl={this.state.editVendor.head_image_url} name="head_image_url" onUpload={this.handlePicUpload}/>
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

                        <div className="form-group">
                            {certificateInput}
                        </div>
                        <hr/>

                        <h3 className="hg-session">作品展示</h3>

                        <div className="form-group">
                            {imageInput}
                        </div>

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
        var vendor = this.state.editVendor;
        vendor["status"] = "reviewing";

        Actions.updateVendorProfile(vendor, "apply");
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
        if(!vendor.certificate_list) {
            vendor.certificate_list = [{}];
        }
        else {
            vendor.certificate_list.push({});
        }
        this.setState({editVendor: vendor});
    },

    _removeCertificate: function (index) {
        var vendor = this.state.editVendor;
        vendor.certificate_list.splice(index,1);
        this.setState({editVendor: vendor});
    },

    _addNewImage: function () {
        var vendor = this.state.editVendor;
        if(!vendor.image_url_list) {
            vendor.image_url_list = [{}];
        }
        else {
            vendor.image_url_list.push({});
        }
        this.setState({editVendor: vendor});
    },

    _removeImage: function (index) {
        var vendor = this.state.editVendor;
        vendor.image_url_list.splice(index,1);
        this.setState({editVendor: vendor});
    },


    handleChange: function(event) {
        //var updatedPath = this._processPath(event.target.name);
        //var newVendor = this._setValueToPath(updatedPath, event.target.value);
        var newVendor = APVTO.assign(this.state.editVendor, event.target.name, event.target.value);

        this.setState({editVendor: newVendor});
    },

    handlePicUpload: function(name, data) {
        //var updatedPath = this._processPath(name);
        var updatedPath = APVTO.path(name);
        if(data) {
            Actions.uploadPicture(data, "", updatedPath);
        }
        else {
            alert("请选择图片.");
        }

        //var newVendor = this._setValueToPath(updatedPath, 'loadingspinner')
        var newVendor = APVTO.assign(this.state.editVendor, name, 'loadingspinner');
        this.setState({editVendor: newVendor});
    },

    /*
    _processPath: function(rawPath) {
        var path = rawPath.split(".");

        var updatedPath = path.map(function(item, index) {
            if(item.indexOf("[")>-1) {
                return parseInt(item.substring(2, item.length-2));
            }
            else {
                return item;
            }
        });

        return updatedPath;
    },

    _setValueToPath: function(path, value) {
        var object = this.state.editVendor;
        var tmpObject = object;
        path.forEach(function(item, index){
            if(index == path.length-1) {
                tmpObject[item] = value;
            }
            else {
                if(!tmpObject[item]) {
                    tmpObject[item] = {}
                }
                tmpObject = tmpObject[item];
            }
        });

        return object;
    },
    */

    _onChange: function() {
        this.setState(getAppState());
    },

});

module.exports = app;

