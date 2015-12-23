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

                <h1 className="page-header">优惠码列表</h1>

                <div className="btn-group" role="group">
                    <button type="button" className="btn btn-default" onClick={this._triggerNewFromList}>新建</button>
                </div>

                <div className="table-responsive voffset10">
                    <table className="table table-striped">
                        <thead>
                        <tr>
                            <th>优惠码标题</th>
                            <th>优惠幅度</th>
                            <th>可用数量/总量</th>
                            <th>状态</th>
                            <th>截止日期</th>
                        </tr>
                        </thead>
                        <tbody>
                        {this.props.couponList.map(function(item) {
                            return <tr onClick={this._viewCouponDetail.bind(this, item.coupon_id)} onTouchStart={this._handleTouchStart}>
                                <td>{item.title}</td>
                                <td>{item.off_percentage*100}%</td>
                                <td>{item.number_total - item.number_occupied}/{item.number_total}</td>
                                <td>{item.status}</td>
                                <td>{formatdatetime.formatDate(new Date(item.due_date))}</td>
                            </tr>;
                        }.bind(this))}

                        </tbody>
                    </table>
                </div>
            </div>
        );
    },

    _triggerNewFromList: function() {
        Actions.triggerNewFromList();
    },

    _viewCouponDetail: function(id) {
        Actions.triggerDetailFromList(id);
    },

    _handleTouchStart: function() {

    },
});

module.exports = app;

