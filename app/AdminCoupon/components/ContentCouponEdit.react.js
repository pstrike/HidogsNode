/** @jsx React.DOM */

var React = require('react');
var HidogsConstants = require('../../Common/constants/HidogsConstants');
var AppDispatcher = require('../../Common/dispatcher/AppDispatcher');
var APVTO = require('../../../util/assignpathvaluetoobject');
var Uudi = require('../../../util/genuuid');

var formatdatetime = require('../../../util/formatdatetime');

var Actions = require('../actions/Actions');
var Store = require('../stores/Stores');
var Constants = require('../constants/Constants');

function getAppState() {
    return {
        editCoupon: Store.getEditCoupon(),
    };
}

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

    componentDidUpdate: function() {
        if(this.state.editCoupon.rule.product.length == 0 ||
            (this.state.editCoupon.rule.product.length==1 && this.state.editCoupon.rule.product[0] == 'null')) {
            $('#vendorSelect').removeAttr('disabled');
            $('#vendorSelect').removeClass('no-border');

        }
        else {
            $('#vendorSelect').attr('disabled', 'true');
            $('#vendorSelect').addClass('no-border');
        }

        if(this.state.editCoupon.rule.vendor.length == 0 ||
            (this.state.editCoupon.rule.vendor.length==1 && this.state.editCoupon.rule.vendor[0] == 'null')) {
            $('#productSelect').removeAttr('disabled');
            $('#productSelect').removeClass('no-border');
        }
        else {

            $('#productSelect').attr('disabled', 'true');
            $('#productSelect').addClass('no-border');
        }

        // err msg
        if (this.props.verifyMsg.length > 0 && this.state.isScrollToErrMsg) {
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

    render: function () {
        // off percentage
        var offPercentageContent = "";
        if(this.state.editCoupon.off_percentage) {
            offPercentageContent = parseFloat(this.state.editCoupon.off_percentage) * 100;
        }

        // title
        var titleContent = "编辑优惠码";
        if(this.props.status == Constants.STATE_NEW) {
            titleContent = "新建优惠码";
        }

        // verify msg
        var verifyMsgContent = "";
        if(this.props.verifyMsg.length > 0) {
            verifyMsgContent = <div className="text-right">
                <p className="bg-danger text-danger verification-msg voffset30">
                    <strong>请根据以下提示, 修改优惠码内容:</strong><br/>
                    {this.props.verifyMsg.map(function(item) {
                        return <span>{item}<br/></span>;
                    })}
                </p>
                <div id="errMsgAnchor"></div>
            </div>;
        }

        return (
            <div className="col-sm-9 col-sm-offset-3 col-md-10 col-md-offset-2 main">

                <h1 className="page-header">{titleContent}</h1>

                <div className="table-responsive">
                    <h3>基本信息</h3>
                    <div className="form-group">
                        <label>标题</label>
                        <input type="text" className="form-control simple-input" placeholder="标题" name="title" value={this.state.editCoupon.title} onChange={this.handleChange}/>
                    </div>
                    <div className="form-group">
                        <label>数量</label>
                        <input type="number" className="form-control simple-input" placeholder="总量" name="number_total" value={this.state.editCoupon.number_total} onChange={this.handleChange}/>
                    </div>
                    <div className="form-group">
                        <label>优惠幅度(%)</label>
                        <input type="number" className="form-control simple-input" placeholder="优惠幅度"  value={offPercentageContent} name="off_percentage" onChange={this.handleChange}/>
                    </div>
                    <div className="form-group">
                        <label>到期日期</label>
                        <input type="date" className="form-control simple-input" placeholder="到期日期" value={formatdatetime.formatDate(new Date(this.state.editCoupon.due_date), "-")} name="due_date" onChange={this.handleChange}/>
                    </div>

                    <h3>规则</h3>
                    <div className="form-group">
                        <label>指定特定用户</label>
                        <select className="form-control simple-input" name="rule.user.[0]" value={this.state.editCoupon.rule.user[0]} onChange={this.handleChange}>
                            <option value='' disabled>未设置</option>
                            <option value='null'>不限</option>
                            {this.props.userList.map(function(item){
                                return <option value={item.user_id}>{item.nick_name}</option>
                            })}
                        </select>
                    </div>
                    <div className="form-group">
                        <label>指定特定达人的所有服务</label>
                        <select id="vendorSelect" className="form-control simple-input" name="rule.vendor.[0]" value={this.state.editCoupon.rule.vendor[0]} onChange={this.handleChange}>
                            <option value='' disabled>未设置</option>
                            <option value='null'>不限</option>
                            {this.props.vendorList.map(function(item){
                                return <option value={item.vendor_id}>{item.nick_name}</option>
                            })}
                        </select>
                    </div>
                    <div className="form-group">
                        <label>指定特定服务</label>
                        <select id="productSelect" className="form-control simple-input" name="rule.product.[0]" value={this.state.editCoupon.rule.product[0]} onChange={this.handleChange}>
                            <option value='' disabled>未设置</option>
                            <option value='null'>不限</option>
                            {this.props.productList.map(function(item){
                                return <option value={item.product_id}>{item.title}</option>
                            })}
                        </select>
                    </div>

                    <h3>优惠码状态</h3>
                    <div className="form-group">
                        <label>状态</label>
                        <select className="form-control simple-input" name="status" value={this.state.editCoupon.status} onChange={this.handleChange}>
                            <option value='drafted'>草稿</option>
                            <option value='published'>发布</option>
                            <option value='deleted'>删除</option>
                        </select>
                    </div>

                    <hr/>

                    {verifyMsgContent}

                    <div className="text-right">
                        <div className="btn-group" role="group">
                            <button type="button" className="btn btn-default" onClick={this._cancel}>取消</button>
                            <button type="button" className="btn btn-default" onClick={this._submit}>提交</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    },

    _submit: function() {
        var verifyMsg = this._verify();

        if(verifyMsg.length == 0) {
            this.state.editCoupon.due_date = new Date(this.state.editCoupon.due_date);

            if(this.props.status == Constants.STATE_NEW) {
                this.state.editCoupon.coupon_id = Uudi.uuid();

                Actions.triggerDetailFromNew(this.state.editCoupon);
            }
            else {
                Actions.triggerDetaiSubmitFromEdit(this.state.editCoupon);
            }
        }
        else {
            //scroll to err msg
            this.setState(
                {isScrollToErrMsg: true}
            );

            Actions.verify(verifyMsg);
        }
    },

    _cancel: function() {
        if(this.props.status == Constants.STATE_NEW) {
            Actions.triggerListFromNew();
        }
        else {
            Actions.triggerDetailCancelFromEdit();
        }

    },

    handleChange: function(event) {
        var value = event.target.value;
        if(event.target.name == "off_percentage") {
            value = parseFloat(value) / 100;
        }

        if(event.target.name == "due_date") {
            value = new Date(value);
            value = value.toString();
        }

        var newVendor = APVTO.assign(this.state.editCoupon, event.target.name, value);

        this.setState({editVendor: newVendor});
    },

    _onChange: function() {
        this.setState(getAppState());
    },

    _verify: function() {
        var verifyMsg = [];

        if(!this.state.editCoupon.title) {
            verifyMsg.push("-请填写优惠码标题");
        }

        if(!this.state.editCoupon.number_total || this.state.editCoupon.number_total == 0) {
            verifyMsg.push("-请填写优惠码数量");
        }

        if(!this.state.editCoupon.off_percentage) {
            verifyMsg.push("-请填写优惠幅度");
        }

        if(!this.state.editCoupon.due_date) {
            verifyMsg.push("-请填写优惠到期日期");
        }

        if(!this.state.editCoupon.rule.user[0] && !this.state.editCoupon.rule.vendor[0] && !this.state.editCoupon.rule.product[0]) {
            verifyMsg.push("-请填写优惠码规则");
        }

        if(this.state.editCoupon.number_occupied > this.state.editCoupon.number_total) {
            verifyMsg.push("-优惠码总数少于已经被输入的优惠码");
        }

        return verifyMsg;
    },
});

module.exports = app;

