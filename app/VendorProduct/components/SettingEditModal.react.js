/** @jsx React.DOM */

var React = require('react');
var Actions = require('../actions/Actions');
var Store = require('../stores/Store');
var APVTO = require('../../../util/assignpathvaluetoobject');

function getAppState() {
    return {
        editSetting: Store.getEditSetting(),
        vendorProfile: Store.getVendorProfile(),
        verifyMsg: Store.getSettingVerifyMsg(),
    };
};

var app = React.createClass({

    getInitialState: function() {
        return getAppState();
    },

    componentDidMount: function() {
        Store.addChangeListener(this._onChange);

        // show modal
        //$('#productSettingEdit').modal('show');
        showHgModal('productSettingEdit')

        // set for android modal body height
        var pageHeight = $(window).height();
        var bodyHeight = pageHeight - 121;
        $('#settingEditBody').css({"max-height": bodyHeight + 'px' });

        // init bootstrap datepicker
        $('#hg-datepicker').datepicker({
            multidate: true,
            todayHighlight: true,
            language: "zh-CN",
        })

        // set dates to date picker
        $('#hg-datepicker').datepicker('setDates',this.state.editSetting.timeoff_list);

        window.history.pushState({title: "preventback", url: "#"}, "preventback", "#");
        window.onpopstate = this._triggerCancel;
    },

    componentWillUnmount: function() {
        //$('#productSettingEdit').modal('hide');
        hideHgModal('productSettingEdit')
        Store.removeChangeListener(this._onChange);
    },

    componentDidUpdate: function() {
        if (this.state.verifyMsg.length > 0 && this.state.isScrollToErrMsg) {
            var position = $('#settingEditBody').scrollTop() + $('#settingErrMsgAnchor').offset().top;

            $('#settingEditBody').animate({
                scrollTop: position
            }, 500);

            // ensure verify msg scroll only response once
            this.setState(
                {isScrollToErrMsg: false}
            );
        };
    },

    render: function () {

        var businessStartTimeContent = "";
        if(this.state.editSetting.business_time_list && this.state.editSetting.business_time_list.length > 0) {
            businessStartTimeContent = this.state.editSetting.business_time_list[0].start_time;
        }

        var businessEndTimeContent = "";
        if(this.state.editSetting.business_time_list && this.state.editSetting.business_time_list.length > 0) {
            businessEndTimeContent = this.state.editSetting.business_time_list[0].end_time;
        }

        var verifyMsgContent = "";
        if(this.state.verifyMsg.length > 0) {
            verifyMsgContent = <div className="text-right">
                <p className="bg-danger text-danger verification-msg voffset30">
                    <strong>请根据以下提示, 补充、修改服务内容:</strong><br/>
                    {this.state.verifyMsg.map(function(item) {
                        return <span>{item}<br/></span>;
                    })}
                </p>
                <div id="settingErrMsgAnchor"></div>
            </div>;
        }

        //return (
        //    <div className="modal modal-fullscreen fade" id="productSettingEdit" tabindex="-2" role="dialog"
        //         aria-labelledby="ProductDetailModalLabel" data-backdrop="static">
        //        <div className="modal-dialog" role="document">
        //            <div className="modal-content">
        //                <div className="modal-header">
        //                    <button type="button" className="close" onClick={this._triggerCancel}><span
        //                        aria-hidden="true">&times;</span></button>
        //                    <h4 className="modal-title text-center">服务设置编辑</h4>
        //                </div>
        //
        //                <div className="modal-body" id="settingEditBody">
        //                    <div className="form-group">
        //                        <label>每天服务时间</label>
        //                        <blockquote>
        //                            <p className="instruction">请按照格式hhmm填写. 例如: 1030 为上午10点30分</p>
        //                        </blockquote>
        //                        <div className="row">
        //                            <div className="col-xs-3"><label className="vcenter34">开始时间</label></div>
        //                            <div className="col-xs-9"><input type="text" className="form-control simple-input" placeholder="输入服务开始时间" name="business_time_list.[0].start_time" value={businessStartTimeContent} onChange={this._handleChange}/></div>
        //                        </div>
        //                        <div className="row">
        //                            <div className="col-xs-3"><label className="vcenter34">结束时间</label></div>
        //                            <div className="col-xs-9"><input type="text" className="form-control simple-input" placeholder="输入服务结束时间" name="business_time_list.[0].end_time" value={businessEndTimeContent} onChange={this._handleChange}/></div>
        //                        </div>
        //                    </div>
        //
        //                    <div className="form-group voffset30">
        //                        <label>休息时间设置</label>
        //                        <div className="row">
        //                            <div id="hg-datepicker" data-provide="datepicker-inline" className="center-block"></div>
        //                        </div>
        //                    </div>
        //
        //
        //
        //                    {verifyMsgContent}
        //                </div>
        //
        //                <div className="modal-footer">
        //                    <button type="button" className="btn btn-default btn-hd-blue" onClick={this._triggerCancel}>关闭</button>
        //                    <button type="button" className="btn btn-default btn-hd-blue" onClick={this._triggerSave}>保存</button>
        //                </div>
        //            </div>
        //        </div>
        //    </div>
        //);

        return <div id="productSettingEdit" className="hg-modal container-fluid">
            <div className="hg-modal-header row">
                <div className="col-xs-2 text-left hg-modal-header-close">
                    <button type="button" className="close"><span
                        aria-hidden="true" onClick={this._cancelAgreement}>&times;</span></button>
                </div>
                <div className="col-xs-8 text-center hg-modal-title"><h4>服务设置编辑</h4></div>
                <div className="col-xs-2 text-center hg-modal-title"></div>
            </div>

            <div className="hg-modal-body text-left" id="settingEditBody">
                <div className="form-group">
                <label>每天服务时间</label>
                <blockquote>
                    <p className="instruction">请按照格式hhmm填写. 例如: 1030 为上午10点30分</p>
                </blockquote>
                <div className="row">
                    <div className="col-xs-3"><label className="vcenter34">开始时间</label></div>
                    <div className="col-xs-9"><input type="time" className="form-control simple-input" placeholder="输入服务开始时间" name="business_time_list.[0].start_time" value={businessStartTimeContent} onChange={this._handleChange}/></div>
                </div>
                <div className="row">
                    <div className="col-xs-3"><label className="vcenter34">结束时间</label></div>
                    <div className="col-xs-9"><input type="time" className="form-control simple-input" placeholder="输入服务结束时间" name="business_time_list.[0].end_time" value={businessEndTimeContent} onChange={this._handleChange}/></div>
                </div>
            </div>

            <div className="form-group voffset30">
                <label>休息时间设置</label>
                <div className="row">
                    <div id="hg-datepicker" data-provide="datepicker-inline" className="center-block"></div>
                </div>
            </div>

            {verifyMsgContent}

            </div>

            <div className="hg-modal-footer text-right row">
                <div className="col-xs-12">
                    <button type="button" className="btn btn-default btn-hd-blue roffset5" onClick={this._triggerCancel}>关闭</button>
                    <button type="button" className="btn btn-default btn-hd-blue" onClick={this._triggerSave}>保存</button>
                </div>
            </div>
        </div>;

        //<div className="form-group voffset30">
        //    <label>您同时可以服务多少位用户?</label>
        //    <input type="text" className="form-control simple-input" placeholder="服务用户数目" name="concurrent_no" value={this.state.editSetting.concurrent_no} onChange={this._handleChange}/>
        //</div>
    },

    _handleChange: function(event) {
        var value = event.target.value;

        var newSetting = APVTO.assign(this.state.editSetting ,event.target.name, value)


        this.setState({editSetting: newSetting});
    },

    _triggerSave: function() {
        var verifyMsg = this.verify();

        if(verifyMsg.length == 0) {
            var newVendor = {};
            newVendor.vendor_id = this.state.vendorProfile.vendorId;
            newVendor.setting = this.state.editSetting;
            newVendor.setting.timeoff_list = $('#hg-datepicker').datepicker('getFormattedDate').split(",");

            Actions.triggerSettingEditSaveToSetting(newVendor);
        }
        else {

            // scroll to err msg
            this.setState(
                {isScrollToErrMsg: true}
            );

            Actions.verifySetting(verifyMsg);
        }
    },

    _triggerCancel: function() {
        Actions.triggerSettingEditCancelToSetting();
    },

    verify: function() {
        var verifyMsg = [];

        if (this.state.editSetting.business_time_list.length == 0) {
            verifyMsg.push("-请设置服务服务开始/结束时间");
        }
        else {
            var timeReg = new RegExp("^\\d{4}$");

            if (!this.state.editSetting.business_time_list[0].start_time) {
                verifyMsg.push("-请设置服务服务开始时间");
            }

            if (!this.state.editSetting.business_time_list[0].end_time) {
                verifyMsg.push("-请设置服务服务结束时间");
            }

            if(this.state.editSetting.business_time_list[0].start_time && this.state.editSetting.business_time_list[0].end_time) {
                if(parseInt(this.state.editSetting.business_time_list[0].end_time) < parseInt(this.state.editSetting.business_time_list[0].start_time)) {
                    verifyMsg.push("-您的服务开始时间大于您的服务结束时间");
                }
            }
        }

        //if(!this.state.editSetting.concurrent_no) {
        //    verifyMsg.push("-请设置同时可服务的用户数目");
        //}
        //else {
        //    var numberReg = new RegExp("^[0-9]*$");
        //
        //    if(!numberReg.test(this.state.editSetting.concurrent_no)) {
        //        verifyMsg.push("-在设置同时可服务的用户数目时,请确保只输入数字");
        //    }
        //}

        return verifyMsg;
    },

    _onChange: function() {
        this.setState(getAppState());
    },
});

module.exports = app;

