/** @jsx React.DOM */

var React = require('react');
var Actions = require('../actions/Actions');

var app = React.createClass({

    componentDidMount: function() {
        // init bootstrap switch
        $("[name='my-checkbox']").bootstrapSwitch();
    },

    render: function () {

        return (
            <div className="modal modal-fullscreen fade" id="productSetting" tabindex="-2" role="dialog"
                 aria-labelledby="ProductDetailModalLabel" data-backdrop="static">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button type="button" className="close" onClick={this._triggerCancel}><span
                                aria-hidden="true">&times;</span></button>
                            <h4 className="modal-title text-center">服务设置</h4>
                        </div>

                        <div className="modal-body">
                            <div className="form-group">
                                <div className="row">
                                    <div className="col-xs-8"><label className="vcenter34">今天不再接额外订单</label></div>
                                    <div className="switch col-xs-4 text-right">
                                        <input type="checkbox" name="my-checkbox" checked></input>
                                        </div>
                                    </div>
                                </div>

                                <div className="form-group voffset30">
                                    <label>每天服务时间</label>
                                    <div className="row">
                                        <div className="col-xs-3"><label className="vcenter34">开始时间</label></div>
                                        <div className="col-xs-9"><input type="text" className="form-control no-border" placeholder="开始时间" value="10:00" disabled/></div>
                                    </div>
                                    <div className="row">
                                        <div className="col-xs-3"><label className="vcenter34">结束时间</label></div>
                                        <div className="col-xs-9"><input type="text" className="form-control no-border" placeholder="结束时间" value="19:00" disabled/></div>
                                    </div>
                                </div>

                                <div className="form-group voffset30">
                                    <label>休息时间设置</label>
                                    <div className="row">
                                        <div className="col-xs-12"><input type="text" className="form-control no-border" placeholder="开始时间" value="20150902" disabled/></div>
                                    </div>
                                </div>

                                <div className="form-group voffset30">
                                    <label>您同时可以服务多少用户?</label>
                                    <input type="text" className="form-control no-border" placeholder="服务用户数目" value="3" disabled/>
                                </div>
                            </div>

                            <div className="modal-footer">
                                <button type="button" className="btn btn-default btn-hd-blue" onClick={this._triggerCancel}>关闭</button>
                                <button type="button" className="btn btn-default btn-hd-blue" onClick={this._triggerEdit}>编辑</button>
                            </div>
                        </div>
                    </div>
                </div>

        );
    },

    _triggerEdit: function() {
        Actions.triggerSettingToSettingEdit();
    },

    _triggerCancel: function() {
        Actions.triggerSettingToList();
    },
});

module.exports = app;

