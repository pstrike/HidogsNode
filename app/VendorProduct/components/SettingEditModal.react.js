/** @jsx React.DOM */

var React = require('react');
var Actions = require('../actions/Actions');

var app = React.createClass({

    componentDidMount: function() {
        // init bootstrap datepicker
        $('#hg-datepicker').datepicker({
            multidate: true,
            todayHighlight: true
        })
    },

    render: function () {

        return (
            <div className="modal modal-fullscreen fade" id="productSettingEdit" tabindex="-2" role="dialog"
                 aria-labelledby="ProductDetailModalLabel" data-backdrop="static">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button type="button" className="close" onClick={this._triggerCancel}><span
                                aria-hidden="true">&times;</span></button>
                            <h4 className="modal-title text-center">服务设置编辑</h4>
                        </div>

                        <div className="modal-body">
                            <div className="form-group">
                                <label>每天服务时间</label>
                                <div className="row">
                                    <div className="col-xs-3"><label className="vcenter34">开始时间</label></div>
                                    <div className="col-xs-9"><input type="text" className="form-control" placeholder="开始时间" value="10:00"/></div>
                                </div>
                                <div className="row">
                                    <div className="col-xs-3"><label className="vcenter34">结束时间</label></div>
                                    <div className="col-xs-9"><input type="text" className="form-control" placeholder="结束时间" value="19:00"/></div>
                                </div>
                            </div>

                            <div className="form-group voffset30">
                                <label>休息时间设置</label>
                                <div className="row">
                                    <div id="hg-datepicker" data-provide="datepicker-inline" className="center-block"></div>
                                </div>
                            </div>

                            <div className="form-group voffset30">
                                <label>您同时可以服务多少用户?</label>
                                <input type="text" className="form-control" placeholder="服务用户数目" value="3"/>
                            </div>
                        </div>

                        <div className="modal-footer">
                            <button type="button" className="btn btn-default btn-hd-blue" onClick={this._triggerSave}>关闭</button>
                            <button type="button" className="btn btn-default btn-hd-blue" onClick={this._triggerCancel}>保存</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    },

    _triggerSave: function() {
        Actions.triggerSettingEditSaveToSetting();
    },

    _triggerCancel: function() {
        Actions.triggerSettingEditCancelToSetting();
    },
});

module.exports = app;

