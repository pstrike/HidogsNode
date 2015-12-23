/** @jsx React.DOM */

var React = require('react');
var HidogsConstants = require('../../Common/constants/HidogsConstants');
var AppDispatcher = require('../../Common/dispatcher/AppDispatcher');

var Store = require('../stores/Store');
var Actions = require('../actions/Actions');
var Header = require('./../../Common/components/Header.react.js');
var WXIconUploader = require('./../../Common/components/WXIconUploader');
var WXPicUploader = require('./../../Common/components/WXPicUploader');

var APVTO = require('../../../util/assignpathvaluetoobject');
var mapconvertor = require('../../../util/mapconverter');

function getAppState() {
    return {
        editVendor: Store.getEditVendor(),
        verifyMsg: Store.getVerifyMsg(),
    };
}

var app = React.createClass({

    getInitialState: function() {
        return getAppState();
    },

    componentDidMount: function() {
        Store.addChangeListener(this._onChange);

        // handle bd auto complete
        var ac = new BMap.Autocomplete(    //建立一个自动完成的对象
            {
                "input" : "suggestId",
                "location" : this.state.editVendor.address ? this.state.editVendor.address.city : "",
            });

        ac.addEventListener("onconfirm", function(e) {
            var myValue;
            var _value = e.item.value;
            myValue = _value.province +  _value.city +  _value.district +  _value.street +  _value.business;

            var local = new BMap.LocalSearch(this.state.editVendor.address ? this.state.editVendor.address.city : "", { //智能搜索
                onSearchComplete: function () {
                    var pp = local.getResults().getPoi(0).point;    //获取第一个智能搜索的结果

                    //console.log(pp);
                    var newPoint = mapconvertor.bd09togcj02(pp.lng, pp.lat);
                    this.handleAddressChange(_value, newPoint);
                }.bind(this)
            });
            local.search(myValue);
        }.bind(this));

    },

    componentWillUnmount: function() {
        Store.removeChangeListener(this._onChange);
    },

    componentDidUpdate: function() {
        // err msg
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

        // Err Msg
        var verifyMsgContent = "";
        if(this.state.verifyMsg.length > 0) {
            verifyMsgContent = <div className="text-right">
                <p className="bg-danger text-danger verification-msg voffset30">
                    <strong>请根据以下提示, 编辑/补充个人信息:</strong><br/>
                    {this.state.verifyMsg.map(function(item) {
                        return <span>{item}<br/></span>;
                    })}
                </p>
                <div id="errMsgAnchor"></div>
            </div>;
        }

        // address
        var addressContent = "";
        if(this.state.editVendor.address.district) {
            addressContent = (this.state.editVendor.address.city ? this.state.editVendor.address.city : "") +
                (this.state.editVendor.address.district ? this.state.editVendor.address.district : "") +
                (this.state.editVendor.address.street ? this.state.editVendor.address.street : "") +
                (this.state.editVendor.address.business ? this.state.editVendor.address.business : "");
        }

        // vendor image
        var imageContent = [];
        if(this.state.editVendor.image_url_list) {
            for(var i=0; i<this.state.editVendor.image_url_list.length; i++) {
                var textName = "image_url_list.["+i+"].name";
                var imageName = "image_url_list.["+i+"].image_url";

                var addFlag = 'false';
                if(i == this.state.editVendor.image_url_list.length-1) {
                    addFlag = 'true';
                }

                var deleteFlag = 'true';
                if(this.state.editVendor.image_url_list.length == 1) {
                    deleteFlag = 'false';
                }

                imageContent.push(<WXPicUploader textName={textName}
                                                     imageName={imageName}
                                                     text={this.state.editVendor.image_url_list[i].name}
                                                     imageUrl={this.state.editVendor.image_url_list[i].image_url}
                                                     onChange={this.handleChange}
                                                     delete={deleteFlag}
                                                     onDelete={this._removeImage.bind(this, i)}
                                                     add={addFlag}
                                                     onAdd={this._addNewImage}
                                                     disabled='false'
                                                     getMedia={this.getWXPicMedia}
                    />);

                if(i != this.state.editVendor.image_url_list.length-1) {
                    imageContent.push(<br/>);
                }
            }
        };

        return (
            <div id="react_body">
                <Header subtitle="编辑个人信息" modal="true"></Header>

                <div className="container">

                    <div className="page-header">
                        <WXIconUploader
                            imageUrl={this.state.editVendor.head_image_url}
                            imageName="head_image_url"
                            getMedia={this.getWXPicMedia}/>
                    </div>

                    <div className="form-group">
                        <label for="vendorNickName">昵称</label>
                        <input type="text" className="form-control simple-input" placeholder="昵称"
                               name="nick_name" value={this.state.editVendor.nick_name}
                               onChange={this.handleChange}/>
                    </div>
                    <div className="form-group">
                        <label for="vendorName">姓名</label>
                        <input type="text" className="form-control simple-input" placeholder="姓名" name="name"
                               value={this.state.editVendor.name} onChange={this.handleChange}/>
                    </div>
                    <div className="form-group">
                        <label for="vendorGender">性别</label>
                        <select className="form-control simple-input" value={this.state.editVendor.gender} name="gender" onChange={this.handleChange}>
                            <option value='1'>男</option>
                            <option value='2'>女</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label for="vendorEmail">电子邮箱</label>
                        <input type="email" className="form-control simple-input" id="vendorEmail" placeholder="电子邮箱"
                               name="email" value={this.state.editVendor.email} onChange={this.handleChange}/>
                    </div>
                    <div className="form-group">
                        <label for="vendorMobile">手机号码</label>
                        <input type="number" pattern="[0-9]*" className="form-control simple-input" id="vendorMobile" placeholder="手机号码"
                               name="mobile" value={this.state.editVendor.mobile} onChange={this.handleChange}/>
                    </div>
                    <div className="form-group">
                        <label>服务地址</label>
                        <div className="row">
                            <div className="col-xs-2"><label className="vcenter34">搜索</label></div>
                            <div className="col-xs-10">
                                <div className="input-group">
                                <span className="input-group-addon" id="sizing-addon2">
                                    <span className="glyphicon glyphicon-search" aria-hidden="true"></span>
                                </span>
                                    <input id="suggestId" type="text" className="form-control simple-input" placeholder="输入写字楼、小区、学校、街道"/>
                                </div>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-xs-2"><label className="vcenter34">地址</label></div>
                            <div className="col-xs-10">
                                <input type="text" className="form-control simple-input no-border" placeholder="请通过搜索结果来选择地址" value={addressContent} disabled/>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-xs-2"><label className="vcenter34"></label></div>
                            <div className="col-xs-10">
                                <input type="text" className="form-control simple-input" placeholder="补充楼号、门牌号等详细信息" name="address.additional" value={this.state.editVendor.address ? this.state.editVendor.address.additional : ""} onChange={this.handleChange}/>
                            </div>
                        </div>
                    </div>

                    <div className="form-group">
                        <label for="vendorDescription">个人描述</label>
                    <textarea id="vendorDescription" className="form-control simple-input" rows="5" name="description"
                              value={this.state.editVendor.description} onChange={this.handleChange}></textarea>
                    </div>

                    <div className="form-group">
                        <label for="vendorMobile">个人主页配色</label>
                        <select className="form-control simple-input" value={this.state.editVendor.setting.page_style} name="setting.page_style" onChange={this.handleChange}>
                            <option value='' disabled>请选择主页配色</option>
                            <option value='green'>绿色</option>
                            <option value='blue'>蓝色</option>
                            <option value='red'>红色</option>
                            <option value='orange'>橙色</option>
                            <option value='yellow'>黄色</option>
                            <option value='white'>白色</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label for="vendorMobile">个人主页图片</label>
                        {imageContent}
                    </div>

                    {verifyMsgContent}

                </div>

                <footer className="footer bg-white">
                    <div className="container">
                        <div className="row text-right">
                            <div className="col-xs-12">
                                <button className="btn btn-hd-blue text-muted" onClick={this._triggerView}>取消</button>
                                <button className="btn btn-hd-blue text-muted" onClick={this._submit}>确定</button>
                            </div>
                        </div>
                    </div>
                </footer>

            </div>
        );
    },

    _triggerView: function() {
        Actions.triggerViewFromEdit();
    },

    _submit: function() {
        var verifyMsg = this._verify();

        if(verifyMsg.length == 0) {
            Actions.updateProfile(this.state.editVendor);
        }
        else {
            //scroll to err msg
            this.setState(
                {isScrollToErrMsg: true}
            );

            Actions.verify(verifyMsg);
        }
    },

    _verify: function() {
        var verifyMsg = [];

        if(!this.state.editVendor.nick_name) {
            verifyMsg.push("-请填写您的昵称");
        }

        if(!this.state.editVendor.name) {
            verifyMsg.push("-请填写您的姓名");
        }

        if(!this.state.editVendor.gender) {
            verifyMsg.push("-请填写您的性别");
        }

        if(!this.state.editVendor.mobile) {
            verifyMsg.push("-请填写您的手机");
        }

        if(!this.state.editVendor.address.district) {
            verifyMsg.push("-请填写您的服务地址");
        }

        return verifyMsg;
    },

    handleChange: function(event) {
        var value = event.target.value;

        var newVendor = APVTO.assign(this.state.editVendor, event.target.name, value);

        this.setState({editVendor: newVendor});
    },

    handleAddressChange: function(address, point) {
        var newVendor = this.state.editVendor;
        newVendor.address.city = address.city;
        newVendor.address.district = address.district;
        newVendor.address.street = address.street;
        newVendor.address.street_number = address.streetNumber;
        newVendor.address.business = address.business;

        newVendor.location.type = "Point";
        newVendor.location.coordinates = point;

        this.setState({editVendor: newVendor});
    },

    getWXPicMedia: function(pic, mediaId, name, type) {
        Actions.uploadWXPicture(mediaId, name, type);

        var newVendor = APVTO.assign(this.state.editVendor, name, pic);
        this.setState({editVendor: newVendor});
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

    _onChange: function() {
        this.setState(getAppState());
    },

});

module.exports = app;

