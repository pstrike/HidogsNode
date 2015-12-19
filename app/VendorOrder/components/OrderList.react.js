/** @jsx React.DOM */

var React = require('react');
var HidogsConstants = require('../../Common/constants/HidogsConstants');
var AppDispatcher = require('../../Common/dispatcher/AppDispatcher');

var Store = require('../stores/Store');
var Actions = require('../actions/Actions');
var OrderListItem = require('./OrderListItem.react');
var Header = require('./../../Common/components/Header.react.js');


var app = React.createClass({


    render: function() {

        var orderListContent = "";
        if(this.props.orderList.length > 0) {
            var orderListItemContent = [];
            this.props.orderList.forEach(function(item) {
                orderListItemContent.push(<OrderListItem order={item}></OrderListItem>);
            })

            orderListContent = <ul className="list-unstyled">
                {orderListItemContent}
            </ul>
        }
        else {
            orderListContent = "暂无订单";
        }

        return (
            <div id="react_body">
                <Header subtitle="服务伙伴 - 订单管理"></Header>

                <div className="container">
                    {orderListContent}
                </div>

            </div>
        );
    },

});

module.exports = app;

