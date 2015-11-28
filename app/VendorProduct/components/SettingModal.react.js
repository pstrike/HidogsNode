/** @jsx React.DOM */

var React = require('react');
var Actions = require('../actions/Actions');
var Store = require('../stores/Store');

function getAppState() {
    return {
        vendorProfile: Store.getVendorProfile(),
    };
};

var app = React.createClass({

    getInitialState: function() {
        return getAppState();
    },

    componentDidMount: function() {
        Store.addChangeListener(this._onChange);

        // show modal
        //$('#productSetting').modal('show');
        showHgModal('productSetting')

        // set for android modal body height
        var pageHeight = $(window).height();
        var bodyHeight = pageHeight - 121;
        $('#settingBody').css({"max-height": bodyHeight + 'px' });

        // init bootstrap datepicker
        $('#hg-datepicker-readonly').datepicker({
            multidate: true,
            todayHighlight: true,
            language: "zh-CN",
            daysOfWeekDisabled: "0,1,2,3,4,5,6",
        })

        if(this.state.vendorProfile.setting) {
            $('#hg-datepicker-readonly').datepicker('setDates',this.state.vendorProfile.setting.timeoff_list);
        }

        // init bootstrap switch
        $("[name='my-checkbox']").bootstrapSwitch();

        // bind change handler to switch
        $('#rejectFlag').bootstrapSwitch('onSwitchChange', this._switchRejectFlag);

        // set value to switch
        if(this.state.vendorProfile.setting) {
            if(this.state.vendorProfile.setting.reject_today_flag) {
                $('#rejectFlag').bootstrapSwitch('state', true);
            }
        }

        window.history.pushState({title: "preventback", url: "#"}, "preventback", "#");
        window.onpopstate = this._triggerCancel;
    },

    componentWillUnmount: function() {
        //$('#productSetting').modal('hide');
        hideHgModal('productSetting')
        Store.removeChangeListener(this._onChange);
    },

    render: function () {

        var businessStartTimeContent = "";
        if(this.state.vendorProfile.setting) {
            if(this.state.vendorProfile.setting.business_time_list && this.state.vendorProfile.setting.business_time_list.length > 0) {
                businessStartTimeContent = this.state.vendorProfile.setting.business_time_list[0].start_time;
            }
        }

        var businessEndTimeContent = "";
        if(this.state.vendorProfile.setting) {
            if(this.state.vendorProfile.setting.business_time_list && this.state.vendorProfile.setting.business_time_list.length > 0) {
                businessEndTimeContent = this.state.vendorProfile.setting.business_time_list[0].end_time;
            }
        }



        //return (
        //    <div className="modal modal-fullscreen fade" id="productSetting" tabindex="-2" role="dialog"
        //         aria-labelledby="ProductDetailModalLabel" data-backdrop="static">
        //        <div className="modal-dialog" role="document">
        //            <div className="modal-content">
        //                <div className="modal-header">
        //                    <button type="button" className="close" onClick={this._triggerCancel}><span
        //                        aria-hidden="true">&times;</span></button>
        //                    <h4 className="modal-title text-center">服务设置</h4>
        //                </div>
        //
        //                <div className="modal-body" id="settingBody">
        //                    <div className="form-group">
        //                        <div className="row">
        //                            <div className="col-xs-8"><label className="vcenter34">今天不再接额外订单</label></div>
        //                            <div className="switch col-xs-4 text-right">
        //                                <input id="rejectFlag" type="checkbox" name="my-checkbox"></input>
        //                            </div>
        //                        </div>
        //                    </div>
        //
        //                    <div className="form-group voffset30">
        //                        <label>每天服务时间</label>
        //
        //                        <div className="row">
        //                            <div className="col-xs-3"><label className="vcenter34">开始时间</label></div>
        //                            <div className="col-xs-9"><input type="text" className="form-control no-border"
        //                                                             placeholder="还没设置开始时间"
        //                                                             value={businessStartTimeContent}
        //                                                             disabled/></div>
        //                        </div>
        //                        <div className="row">
        //                            <div className="col-xs-3"><label className="vcenter34">结束时间</label></div>
        //                            <div className="col-xs-9"><input type="text" className="form-control no-border"
        //                                                             placeholder="还没设置结束时间"
        //                                                             value={businessEndTimeContent}
        //                                                             disabled/></div>
        //                        </div>
        //                    </div>
        //
        //                    <div className="form-group voffset30">
        //                        <label>休息时间设置</label>
        //
        //                        <div className="row">
        //                            <div id="hg-datepicker-readonly" data-provide="datepicker-inline" className="center-block"></div>
        //                        </div>
        //                    </div>
        //
        //                </div>
        //
        //                <div className="modal-footer">
        //                    <button type="button" className="btn btn-default btn-hd-blue" onClick={this._triggerCancel}>
        //                        关闭
        //                    </button>
        //                    <button type="button" className="btn btn-default btn-hd-blue" onClick={this._triggerEdit}>
        //                        编辑
        //                    </button>
        //                </div>
        //            </div>
        //        </div>
        //    </div>
        //
        //);

        return <div id="productSetting" className="hg-modal container-fluid">
            <div className="hg-modal-header row">
                <div className="col-xs-2 text-left hg-modal-header-close">
                    <button type="button" className="close"><span
                        aria-hidden="true" onClick={this._triggerCancel}>&times;</span></button>
                </div>
                <div className="col-xs-8 text-center hg-modal-title"><h4>服务设置</h4></div>
                <div className="col-xs-2 text-center hg-modal-title"></div>
            </div>

            <div className="hg-modal-body text-left" id="settingBody">
                <div className="form-group">
                    <div className="row">
                        <div className="col-xs-7"><label className="vcenter34">今天不再接额外订单</label></div>
                        <div className="switch col-xs-5 text-right">
                            <input id="rejectFlag" type="checkbox" name="my-checkbox"></input>
                        </div>
                    </div>
                </div>

                <div className="form-group voffset30">
                    <label>每天服务时间</label>

                    <div className="row">
                        <div className="col-xs-3"><label className="vcenter34">开始时间</label></div>
                        <div className="col-xs-9"><input type="text" className="form-control no-border"
                                                         placeholder="还没设置开始时间"
                                                         value={businessStartTimeContent}
                                                         disabled/></div>
                    </div>
                    <div className="row">
                        <div className="col-xs-3"><label className="vcenter34">结束时间</label></div>
                        <div className="col-xs-9"><input type="text" className="form-control no-border"
                                                         placeholder="还没设置结束时间"
                                                         value={businessEndTimeContent}
                                                         disabled/></div>
                    </div>
                </div>

                <div className="form-group voffset30">
                    <label>休息时间设置</label>

                    <div className="row">
                        <div id="hg-datepicker-readonly" data-provide="datepicker-inline"
                             className="center-block"></div>
                    </div>
                </div>
            </div>

            <div className="hg-modal-footer text-right row">
                <div className="col-xs-12">
                    <button type="button" className="btn btn-default btn-hd-blue roffset5" onClick={this._triggerCancel}>
                        关闭
                    </button>
                    <button type="button" className="btn btn-default btn-hd-blue" onClick={this._triggerEdit}>
                        编辑
                    </button>
                </div>
            </div>
        </div>;

        //<div className="form-group voffset30">
        //    <label>您同时可以服务多少用户?</label>
        //    <input type="text" className="form-control no-border" placeholder="还没设置"
        //           value={this.state.vendorProfile.setting ? this.state.vendorProfile.setting.concurrent_no : ""} disabled/>
        //</div>
    },

    _triggerEdit: function() {
        Actions.triggerSettingToSettingEdit();
    },

    _triggerCancel: function() {
        Actions.triggerSettingToList();
    },

    _switchRejectFlag: function(event, state) {
        var newVendor = {};
        newVendor.setting = this.state.vendorProfile.setting;
        newVendor.vendor_id = this.state.vendorProfile.vendorId;
        newVendor.setting.reject_today_flag = state;

        Actions.triggerSettingSaveRejectFlag(newVendor);
    },

    _onChange: function() {
        this.setState(getAppState());
    },
});

module.exports = app;

