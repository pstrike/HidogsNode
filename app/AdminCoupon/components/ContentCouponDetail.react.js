/** @jsx React.DOM */

var React = require('react');
var HidogsConstants = require('../../Common/constants/HidogsConstants');
var AppDispatcher = require('../../Common/dispatcher/AppDispatcher');

var formatdatetime = require('../../../util/formatdatetime');

var Actions = require('../actions/Actions');

var app = React.createClass({

    render: function () {
        return (
            <div className="col-sm-9 col-sm-offset-3 col-md-10 col-md-offset-2 main">

                <h1 className="page-header">优惠码详情</h1>

                <div className="table-responsive">
                    <h3>优惠码</h3>
                    <div className="form-group">
                        <label>优惠码</label>
                        <input type="text" className="form-control no-border" placeholder="优惠码" value={this.props.coupon.code} name="code" disabled/>
                    </div>
                    <div className="form-group">
                        <label>状态</label>
                        <select className="form-control no-border" name="status" value={this.props.coupon.status} onChange={this.handleChange} disabled>
                            <option value='drafted'>草稿</option>
                            <option value='published'>发布</option>
                            <option value='deleted'>删除</option>
                        </select>
                    </div>

                    <h3>基本信息</h3>
                    <div className="form-group">
                        <label>标题</label>
                        <input type="text" className="form-control no-border" placeholder="标题" name="title" value={this.props.coupon.title} disabled/>
                    </div>
                    <div className="form-group">
                        <label>总量</label>
                        <input type="number" className="form-control no-border" placeholder="总量" name="number_total" value={this.props.coupon.number_total} disabled/>
                    </div>
                    <div className="form-group">
                        <label>未使用数量</label>
                        <input type="number" className="form-control no-border" placeholder="未使用数量" name="number_total" value={this.props.coupon.number_total - this.props.coupon.number_occupied} disabled/>
                    </div>
                    <div className="form-group">
                        <label>优惠幅度(%)</label>
                        <input type="number" className="form-control no-border" placeholder="优惠幅度"  value={this.props.coupon.off_percentage * 100} name="off_percentage" disabled/>
                    </div>
                    <div className="form-group">
                        <label>到期日期</label>
                        <input type="text" className="form-control no-border" placeholder="到期日期" value={formatdatetime.formatDate(new Date(this.props.coupon.due_date))} name="due_date" disabled/>
                    </div>

                    <h3>规则</h3>
                    <div className="form-group">
                        <label>指定特定用户</label>
                        <select className="form-control no-border" value={this.props.coupon.rule ? this.props.coupon.rule.user[0] : ""} disabled>
                            <option value=''>未设置</option>
                            <option value='null'>不限</option>
                            {this.props.userList.map(function(item){
                                return <option value={item.user_id}>{item.nick_name}</option>
                            })}
                        </select>
                    </div>
                    <div className="form-group">
                        <label>指定特定达人的所有服务</label>
                        <select id="vendorSelect" className="form-control no-border" value={this.props.coupon.rule ? this.props.coupon.rule.vendor[0] : ""} disabled>
                            <option value=''>未设置</option>
                            <option value='null'>不限</option>
                            {this.props.vendorList.map(function(item){
                                return <option value={item.vendor_id}>{item.nick_name}</option>
                            })}
                        </select>
                    </div>
                    <div className="form-group">
                        <label>指定特定服务</label>
                        <select id="productSelect" className="form-control no-border" value={this.props.coupon.rule ? this.props.coupon.rule.product[0] : ""} disabled>
                            <option value=''>未设置</option>
                            <option value='null'>不限</option>
                            {this.props.productList.map(function(item){
                                return <option value={item.product_id}>{item.title}</option>
                            })}
                        </select>
                    </div>

                    <h3>其它</h3>
                    <div className="form-group">
                        <label>让达人可以查看优惠码使用状态</label>
                        <select className="form-control no-border" value={this.props.coupon.vendor_owner} disabled>
                            <option value='' disabled>仅管理员可见</option>
                            {this.props.vendorList.map(function(item){
                                return <option value={item.vendor_id}>{item.nick_name}</option>
                            })}
                        </select>
                    </div>

                    <hr/>

                    <div className="text-right">
                        <div className="btn-group" role="group">
                            <button type="button" className="btn btn-default" onClick={this._cancel}>关闭</button>
                            <button type="button" className="btn btn-default" onClick={this._modify}>编辑</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    },

    _modify: function() {
        Actions.triggerEditFromDetail();
    },

    _cancel: function() {
        Actions.triggerListFromDetail();
    },

});

module.exports = app;

