/** @jsx React.DOM */

var React = require('react');
var HidogsConstants = require('../../Common/constants/HidogsConstants');
var AppDispatcher = require('../../Common/dispatcher/AppDispatcher');

var Store = require('../stores/VendorStore');
var Actions = require('../actions/Actions');
var Header = require('./../../Common/components/Header.react.js');

var GenOrderNo = require('../../../util/genorderno');


function getAppState() {
    return {
        orderList: Store.getOrderList(),
    };
}

var app = React.createClass({

    getInitialState: function() {
        return getAppState();
    },

    componentDidMount: function() {
        Store.addChangeListener(this._onChange);
        Actions.getOrderList();
    },

    componentWillUnmount: function() {
        Store.removeChangeListener(this._onChange);
    },

    render: function () {

        return (
            <div className="col-sm-9 col-sm-offset-3 col-md-10 col-md-offset-2 main">

                <h1 className="page-header">订单列表</h1>

                <div className="table-responsive">
                    <table className="table table-striped">
                        <thead>
                        <tr>
                            <th>订单号</th>
                            <th>时间</th>
                            <th>服务标题</th>
                            <th>服务达人</th>
                            <th>用户名称</th>
                            <th>订单价格</th>
                            <th>状态</th>
                        </tr>
                        </thead>
                        <tbody>
                        {this.state.orderList.map(function(item){

                            var orderDate = new Date(item.booked_time.booked_date);
                            var orderDateContent = this._formatDate(orderDate);

                            var orderStartTime = new Date(item.booked_time.start_time);
                            var orderEndTime = new Date(item.booked_time.end_time);
                            orderDateContent += " " + this._formatTime(orderStartTime) + "-" + this._formatTime(orderEndTime);

                            return <tr>
                                <td>{GenOrderNo.orderno(item.order_id, item.created_time)}</td>
                                <td>{orderDateContent}</td>
                                <td>{item.product.title}</td>
                                <td>{item.vendor.nick_name}</td>
                                <td>{item.user.nick_name}</td>
                                <td>{item.price.total}</td>
                                <td>{item.status}</td>
                            </tr>;
                        },this)}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    },

    _formatTime: function(date) {
        return date.getHours() + ":" + date.getMinutes();
    },

    _formatDate: function(date) {
        return date.getFullYear() + "/" + (date.getMonth()+1) + "/" + date.getDate();
    },

    _onChange: function() {
        this.setState(getAppState());
    }
});

module.exports = app;

