/** @jsx React.DOM */

var React = require('react');
var HidogsConstants = require('../../Common/constants/HidogsConstants');
var AppDispatcher = require('../../Common/dispatcher/AppDispatcher');

var Store = require('../stores/Store');
var Actions = require('../actions/Actions');
var OrderListItem = require('./OrderListItem.react');


var app = React.createClass({

    componentDidMount: function() {

        // init tab
        var tabs = $('#hgTab div');
        tabs.click(function() {
            tabs.removeClass('hg-tab-item-active')
            var el = $(this);
            el.addClass('hg-tab-item-active');
        })
    },


    render: function() {

        var orderListItemContent = [];
        this.props.orderList.forEach(function(item) {
            orderListItemContent.push(<OrderListItem order={item}></OrderListItem>);
        })
        if(orderListItemContent.length == 0) {
            orderListItemContent.push(
                <div className="text-center voffset50">
                    <h4><i className="fa fa-exclamation-circle roffset5"></i>暂无订单</h4>
                </div>
            );
        }

        return (
            <div className="container">
                <div className="page-header text-center hg-pageheader">
                    <h4>My Orders</h4>
                    <h2 className="voffset10"><strong>我的订单</strong></h2>
                </div>

                <div id="hgTab" className="text-center">
                    <div className="col-xs-3 hg-tab-item hg-tab-item-active" onClick={this._filter.bind(this, ["all"])}><a href="#">全部</a></div>
                    <div className="col-xs-3 hg-tab-item" onClick={this._filter.bind(this, ["tbserviced","tbconfirmed"])}><a href="#">待使用</a></div>
                    <div className="col-xs-3 hg-tab-item" onClick={this._filter.bind(this, ["tbpaid"])}><a href="#">待支付</a></div>
                    <div className="col-xs-3 hg-tab-item" onClick={this._filter.bind(this, ["tbcommented"])}><a href="#">待评价</a></div>
                </div>

                <hr/>

                {orderListItemContent}

            </div>
        );
    },

    _filter: function(filter) {
        Actions.filterList(filter);
    },

});

module.exports = app;

