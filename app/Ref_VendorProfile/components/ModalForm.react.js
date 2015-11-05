/** @jsx React.DOM */

var React = require('react');
var HidogsConstants = require('../../Common/constants/HidogsConstants');
var AppDispatcher = require('../../Common/dispatcher/AppDispatcher');

var Store = require('../stores/Store');
var Actions = require('../actions/Actions');
var Constants = require('../constants/Constants');
var Header = require('./../../Common/components/Header.react.js');

function getAppState() {
    return {
        editVendor: Store.getEditVendor(),
    };
};

var app = React.createClass({

    getInitialState: function() {
        return getAppState();
    },

    componentDidUpdate: function() {
        //this.setVendorForm();
    },

    componentDidMount: function() {
        Store.addChangeListener(this._onChange);
    },

    componentWillUnmount: function() {
        Store.removeChangeListener(this._onChange);
    },

    render: function() {

        var crossModalBtn = "";
        var cancelModalBtn = "";

        var certificateInput = [];
        if(this.state.editVendor.certificate_list) {
            for(var i=0; i<this.state.editVendor.certificate_list.length; i++) {
                var name = "certificate_list.["+i+"].name";
                certificateInput.push(<div className="input-group">
                        <input type="text" className="form-control" name={name}
                               value={this.state.editVendor.certificate_list[i].name} onChange={this.handleChange}/>
      <span className="input-group-btn">
        <button className="btn btn-default" type="button"onClick={this._removeCertificate.bind(this, i)}><span className="glyphicon glyphicon-minus" aria-hidden="true"></span>
        </button>
      </span>
                    </div>
                    );
            }
        };

        var businessTimeInput = [];
        if(this.state.editVendor.business_time_list) {
            for(var i=0; i<this.state.editVendor.business_time_list.length; i++) {
                var startName = "business_time_list.["+i+"].start_time";
                var endName = "business_time_list.["+i+"].end_time";

                businessTimeInput.push(
                    <div className="input-group">
                        <input type="text" className="form-control" name={startName} value={this.state.editVendor.business_time_list[i].start_time} onChange={this.handleChange}/>
                        <input type="text" className="form-control" name={endName} value={this.state.editVendor.business_time_list[i].end_time} onChange={this.handleChange}/>
      <span className="input-group-btn">
        <button className="btn btn-default" type="button" onClick={this._removeBusinessTime.bind(this, i)}><span className="glyphicon glyphicon-minus" aria-hidden="true"></span>
        </button>
      </span>
                    </div>);

            }
        };

        var timeoffInput = [];
        if(this.state.editVendor.timeoff_list) {
            for(var i=0; i<this.state.editVendor.timeoff_list.length; i++) {
                var startName = "timeoff_list.["+i+"].start_time";
                var endName = "timeoff_list.["+i+"].end_time";

                timeoffInput.push(
                    <div className="input-group">
                        <input type="text" className="form-control" name={startName} value={this.state.editVendor.timeoff_list[i].start_time} onChange={this.handleChange}/>
                        <input type="text" className="form-control" name={endName} value={this.state.editVendor.timeoff_list[i].end_time} onChange={this.handleChange}/>
      <span className="input-group-btn">
        <button className="btn btn-default" type="button" onClick={this._removeTimeoff.bind(this, i)}><span className="glyphicon glyphicon-minus" aria-hidden="true"></span>
        </button>
      </span>
                    </div>);

            }
        };

        switch (this.props.status) {
            case Constants.STATE_VENDOR_APPLICAITON_CREATED:

                break;

            case Constants.STATE_VENDOR_APPLICAITON_DRAFT:

                crossModalBtn = <button type="button" className="close" data-dismiss="modal"><span
                    aria-hidden="true">&times;</span></button>;

                cancelModalBtn = <button type="button" className="btn btn-default"
                                         data-dismiss="modal">关闭
                </button>;

                break;

            case Constants.STATE_VENDOR_APPLICAITON_REVIEWING:

                break;

            case Constants.STATE_VENDOR_APPLICAITON_REJECT:

                crossModalBtn = <button type="button" className="close" data-dismiss="modal"><span
                    aria-hidden="true">&times;</span></button>;

                cancelModalBtn = <button type="button" className="btn btn-default"
                                         data-dismiss="modal">关闭
                </button>;

                break;

            case Constants.STATE_VENDOR_APPLICAITON_APPROVED:

                break;

            default :
            // nothing
        };

        return <div className="modal-fullscreen modal fade" id="profileFormModal" tabindex="-1" role="dialog"
                    aria-labelledby="myModalLabel" data-backdrop="static">
            <div className="modal-dialog" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        {crossModalBtn}
                        <h4 className="modal-title">申请成为欢宠服务伙伴</h4>
                    </div>

                    <div className="modal-body">
                        <div className="form-group">
                            <label for="productInputName">昵称</label>
                            <input type="text" className="form-control" name="nick_name" value={this.state.editVendor.nick_name} onChange={this.handleChange}/>
                        </div>

                        <div className="form-group">
                            <label for="productInputName">真实姓名</label>
                            <input type="text" className="form-control" name="name" value={this.state.editVendor.name} onChange={this.handleChange}/>
                        </div>

                        <div className="form-group">
                            <label for="productInputName">性别</label>
                            <input type="text" className="form-control" name="gender" value={this.state.editVendor.gender} onChange={this.handleChange}/>
                        </div>

                        <div className="form-group">
                            <label for="productInputName">E-mail</label>
                            <input type="text" className="form-control" name="email" value={this.state.editVendor.email} onChange={this.handleChange}/>
                        </div>

                        <div className="form-group">
                            <label for="productInputName">手机号码</label>
                            <input type="text" className="form-control" name="mobile" value={this.state.editVendor.mobile} onChange={this.handleChange}/>
                        </div>

                        <div className="form-group">
                            <label for="productInputName">地址</label>
                            <input type="text" className="form-control" placeholder="国家" name="address.country" value={this.state.editVendor.address ? this.state.editVendor.address.country : ""} onChange={this.handleChange}/>
                            <input type="text" className="form-control" placeholder="省份" name="address.province" value={this.state.editVendor.address ? this.state.editVendor.address.province : ""} onChange={this.handleChange}/>
                            <input type="text" className="form-control" placeholder="城市" name="address.city" value={this.state.editVendor.address ? this.state.editVendor.address.city : ""} onChange={this.handleChange}/>
                            <input type="text" className="form-control" placeholder="区域" name="address.region" value={this.state.editVendor.address ? this.state.editVendor.address.region : ""} onChange={this.handleChange}/>
                            <input type="text" className="form-control" placeholder="具体地址" name="address.address" value={this.state.editVendor.address ? this.state.editVendor.address.address : ""} onChange={this.handleChange}/>
                        </div>

                        <div className="form-group">
                            <label for="productInputName">身份证信息</label>
                            <input type="text" className="form-control" placeholder="身份证号码" name="id_card.no" value={this.state.editVendor.id_card ? this.state.editVendor.id_card.no : ""} onChange={this.handleChange}/>
                        </div>

                        <div className="form-group">
                            <label for="productInputName">证书信息</label>
                            {certificateInput}
                            <button type="button" className="btn btn-default" onClick={this._addNewCertificate}>
                                <span className="glyphicon glyphicon-plus" aria-hidden="true"></span></button>
                        </div>

                        <div className="form-group">
                            <label for="productInputName">营业时间</label>
                            {businessTimeInput}
                            <button type="button" className="btn btn-default" onClick={this._addNewBusinessTime}>
                                <span className="glyphicon glyphicon-plus" aria-hidden="true"></span></button>
                        </div>

                        <div className="form-group">
                            <label for="productInputName">休息时间</label>
                            {timeoffInput}
                            <button type="button" className="btn btn-default" onClick={this._addNewTimeoff}>
                                <span className="glyphicon glyphicon-plus" aria-hidden="true"></span></button>
                        </div>

                        <div className="form-group">
                            <label for="productInputName">同时可服务的顾客数</label>
                            <input type="text" className="form-control" placeholder="1/2/3" name="concurrent_no" value={this.state.editVendor.concurrent_no} onChange={this.handleChange}/>
                        </div>

                        <div className="form-group">
                            <label for="productInputName">支付账号</label>
                            <input type="text" className="form-control" placeholder="支付账号" name="payment_account" value={this.state.editVendor.payment_account} onChange={this.handleChange}/>
                        </div>

                        <div className="form-group">
                            <label for="productInputName">个人介绍</label>
                            <textarea className="form-control" rows="5" name="description" value={this.state.editVendor.description} onChange={this.handleChange}></textarea>
                        </div>
                    </div>

                    <div className="modal-footer">
                        <button type="button" className="btn btn-primary"
                                onClick={this._onSubmit}>提交
                        </button>

                        <button type="button" className="btn btn-primary"
                                onClick={this._onSave}>保存
                        </button>

                        {cancelModalBtn}

                    </div>

                </div>
            </div>
        </div>;
    },

    /*
    wrapVendorForm: function() {

        var vendor = this.props.vendor;
        vendor.openid = this.props.vendor.openid;
        vendor.nick_name = this.refs.nick_name.getDOMNode().value;
        vendor.name = this.refs.name.getDOMNode().value;
        vendor.gender = this.refs.gender.getDOMNode().value;
        vendor.email = this.refs.email.getDOMNode().value;
        vendor.mobile = this.refs.mobile.getDOMNode().value;
        vendor.address = {
            country: this.refs.country.getDOMNode().value,
            province: this.refs.province.getDOMNode().value,
            city: this.refs.city.getDOMNode().value,
            region: this.refs.region.getDOMNode().value,
            address: this.refs.addressDetails.getDOMNode().value,
        };
        vendor.id_card = {
            no: this.refs.id_card_no.getDOMNode().value,
        };
        vendor.concurrent_no = this.refs.concurrent_no.getDOMNode().value;
        vendor.payment_account = this.refs.payment_account.getDOMNode().value;
        vendor.description = this.refs.description.getDOMNode().value;

        var certificate_list = [];
        var totoalCertificateNo = this.state.newCertificateNo;
        if(this.props.vendor.certificate_list) {
            totoalCertificateNo += this.props.vendor.certificate_list.length;
        }
        for (var i = 0; i < totoalCertificateNo; i++) {
            certificate_list.push({name:this.refs["certificate_list_"+i+"_name"].getDOMNode().value});
        }
        vendor["certificate_list"] = certificate_list;


        return vendor;
    },
    */

    /*
    setVendorForm: function() {
        this.refs.nick_name.getDOMNode().value = (this.props.vendor.nick_name ? this.props.vendor.nick_name : "");
        this.refs.name.getDOMNode().value = (this.props.vendor.name ? this.props.vendor.name : "");
        this.refs.gender.getDOMNode().value = (this.props.vendor.gender ? this.props.vendor.gender : "");
        this.refs.email.getDOMNode().value = (this.props.vendor.email ? this.props.vendor.email : "");
        this.refs.mobile.getDOMNode().value = (this.props.vendor.mobile ? this.props.vendor.mobile : "");
        this.refs.country.getDOMNode().value = (this.props.vendor.address ? (this.props.vendor.address.country ? this.props.vendor.address.country : "") : "");
        this.refs.province.getDOMNode().value = (this.props.vendor.address ? (this.props.vendor.address.province ? this.props.vendor.address.province : "") : "");
        this.refs.city.getDOMNode().value = (this.props.vendor.address ? (this.props.vendor.address.city ? this.props.vendor.address.city : "") : "");
        this.refs.region.getDOMNode().value = (this.props.vendor.address ? (this.props.vendor.address.region ? this.props.vendor.address.region : "") : "");
        this.refs.addressDetails.getDOMNode().value = (this.props.vendor.address ? (this.props.vendor.address.address ? this.props.vendor.address.address : "") : "");
        this.refs.id_card_no.getDOMNode().value = (this.props.vendor.id_card ? (this.props.vendor.id_card.no ? this.props.vendor.id_card.no : "") : "");
        this.refs.concurrent_no.getDOMNode().value = (this.props.vendor.concurrent_no ? this.props.vendor.concurrent_no : "");
        this.refs.payment_account.getDOMNode().value = (this.props.vendor.payment_account ? this.props.vendor.payment_account : "");

        if(this.props.vendor.certificate_list) {
            for(var i=0; i<this.props.vendor.certificate_list.length; i++) {
                var ref = "certificate_list_"+i+"_name";
                this.refs[ref].getDOMNode().value = this.props.vendor.certificate_list[i].name;
            }
        };

    },
    */

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

    _addNewBusinessTime: function () {
        var vendor = this.state.editVendor;
        if(!vendor.business_time_list) {
            vendor.business_time_list = [{}];
        }
        else {
            vendor.business_time_list.push({});
        }
        this.setState({editVendor: vendor});
    },

    _removeBusinessTime: function (index) {
        var vendor = this.state.editVendor;
        vendor.business_time_list.splice(index,1);
        this.setState({editVendor: vendor});
    },

    _addNewTimeoff: function () {
        var vendor = this.state.editVendor;
        if(!vendor.timeoff_list) {
            vendor.timeoff_list = [{}];
        }
        else {
            vendor.timeoff_list.push({});
        }
        this.setState({editVendor: vendor});
    },

    _removeTimeoff: function (index) {
        var vendor = this.state.editVendor;
        vendor.timeoff_list.splice(index,1);
        this.setState({editVendor: vendor});
    },

    handleChange: function(event) {
        var path = event.target.name.split(".");

        var updatedPath = path.map(function(item, index) {
            if(item.indexOf("[")>-1) {
                return parseInt(item.substring(2, item.length-2));
            }
            else {
                return item;
            }
        });

        var object = this.state.editVendor;
        var tmpObject = object;
        updatedPath.forEach(function(item, index){
            if(index == updatedPath.length-1) {
                tmpObject[item] = this.target.value;
            }
            else {
                if(!tmpObject[item]) {
                    tmpObject[item] = {}
                }
                tmpObject = tmpObject[item];
            }
        },event);

        this.setState({editVendor: object});
    },

    _onChange: function() {
        this.setState(getAppState());
    },

});

module.exports = app;

