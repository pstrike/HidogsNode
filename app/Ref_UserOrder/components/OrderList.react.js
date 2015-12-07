/** @jsx React.DOM */
var React = require('react');

var ProductItem = require('./OrderItem.react.js');
var VendorOrderConstants = require('../constants/Constants');
var OrderItem = require('../components/OrderItem.react');

var ProductList = React.createClass({

    render: function() {
        var orderList = this.props.orderList;
        var status = this.props.status;
        var content = [];

        console.log(orderList);

        if(status == VendorOrderConstants.VENDOR_ORDER_STORE_STATE_LIST_LOADING) {
            content = <tr><td className='text-center' colSpan="5">加载中...</td></tr>;
        }
        else {
            for (var i in orderList) {
                content.push(<OrderItem order={orderList[i]} />);
            }
        }

        return (
            <div className="container-fluid">
                <div className="page-header">
                    <h1>欢宠用户<small>我的订单列表</small></h1>
                </div>

                <div>
                    <table className="table table-striped table-condensed">
                        <thead>
                        <tr>
                            <th>ID</th>
                            <th>服务</th>
                            <th>用户</th>
                            <th>价格</th>
                            <th>状态</th>
                            <th>时间</th>
                            <th>操作</th>
                        </tr>
                        </thead>
                        <tbody>
                        {content}
                        </tbody>
                    </table>
                </div>
            </div>

        );
    }
});

module.exports = ProductList;

