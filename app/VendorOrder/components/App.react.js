/** @jsx React.DOM */

var React = require('react');
var HidogsConstants = require('../../Common/constants/HidogsConstants');
var AppDispatcher = require('../../Common/dispatcher/AppDispatcher');

var Store = require('../stores/Store');
var HGStore = require('../../Common/stores/session');
var Actions = require('../actions/Actions');
var Constants = require('../constants/Constants');
var OrderList = require('./OrderList.react');
var OrderDetail = require('./OrderDetail.react');
var OrderCode = require('./OrderCode.react');
var OrderReject = require('./OrderReject.react');



function getAppState() {
    return {
        session: HGStore.getSession(),
        orderList: Store.getOrderList(),
        order: Store.getOrder(),
        status: Store.getStatus(),
        verifyMsg: Store.getVerifyMsg(),
    };
}

var app = React.createClass({

    getInitialState: function() {
        return getAppState();
    },

    componentDidMount: function() {
        Store.addChangeListener(this._onChange);
        HGStore.addChangeListener(this._onChange);

        Actions.getSessionThenOrderList();
    },

    componentWillUnmount: function() {
        Store.removeChangeListener(this._onChange);
        HGStore.removeChangeListener(this._onChange);
    },

    render: function() {
        var content = "";

        switch (this.state.status) {
            case Constants.VENDOR_ORDER_LIST:
                content = <OrderList orderList={this.state.orderList}></OrderList>;
                break;

            case Constants.VENDOR_ORDER_DETAIL:
                content = <OrderDetail order={this.state.order}></OrderDetail>;
                break;

            case Constants.VENDOR_ORDER_CODE:
                content = <OrderCode order={this.state.order} verifyMsg={this.state.verifyMsg}></OrderCode>;
                break;

            case Constants.VENDOR_ORDER_REJECT:
                content = <OrderReject order={this.state.order} verifyMsg={this.state.verifyMsg}></OrderReject>;
                break;

        }

        return (
            <div id="react_body">
                {content}
            </div>
        );
    },

    _onChange: function() {
        this.setState(getAppState());
    }

});

module.exports = app;

