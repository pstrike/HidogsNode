/** @jsx React.DOM */

var React = require('react');
var HidogsConstants = require('../../Common/constants/HidogsConstants');
var AppDispatcher = require('../../Common/dispatcher/AppDispatcher');

var Store = require('../stores/Store');
var Actions = require('../actions/Actions');
var Constants = require('../constants/Constants');
var Header = require('./../../Common/components/Header.react.js');
var OrderList = require('./OrderList.react');
var OrderDetail = require('./OrderDetail.react');
var OrderReschedule = require('./OrderReschedule.react');
var OrderComment = require('./OrderComment.react');
var OrderRefund = require('./OrderRefund.react');


function getAppState() {
    return {
        session: Store.getSession(),
        orderList: Store.getOrderList(),
        order: Store.getOrder(),
        product: Store.getProduct(),
        vendor: Store.getVendor(),
        user: Store.getUser(),
        availability: Store.getAvailability(),
        verifyMsg: Store.getVerifyMsg(),
        status: Store.getStatus(),
    };
}

var app = React.createClass({

    getInitialState: function() {
        return getAppState();
    },

    componentDidMount: function() {
        Store.addChangeListener(this._onChange);

        Actions.getSessionThenOrderList();
    },

    componentWillUnmount: function() {
        Store.removeChangeListener(this._onChange);
    },

    render: function() {
        var orderContent = "";
        var tint = "";

        switch (this.state.status) {
            case Constants.ORDER_LIST:
                orderContent = <OrderList orderList={this.state.orderList}></OrderList>
                break;

            case Constants.ORDER_DETAIL:
                orderContent = <OrderDetail order={this.state.order} product={this.state.product} vendor={this.state.vendor} session={this.state.session}></OrderDetail>;

                if(this.state.order.status) {
                    switch (this.state.order.status) {
                        case "tbpaid":
                            tint = "hg-yellow-section";
                            break;

                        case "tbconfirmed":
                            tint = "hg-green-section";
                            break;

                        case "tbserviced":
                            tint = "hg-green-section";
                            break;

                        case "tbcommented":
                            tint = "hg-orange-section";
                            break;

                        case "completed":
                            tint = "hg-blue-section";
                            break;

                        case "refund":
                            tint = "hg-red-section";
                            break;

                        case "cancelled":

                            break;
                    }
                }
                break;

            case Constants.ORDER_RESCHEDULE:
                orderContent = <OrderReschedule order={this.state.order} availability={this.state.availability} verifyMsg={this.state.verifyMsg}></OrderReschedule>
                break;

            case Constants.ORDER_COMMENT:
                orderContent = <OrderComment session={this.state.session} product={this.state.product} order={this.state.order} vendor={this.state.vendor} verifyMsg={this.state.verifyMsg}></OrderComment>
                break;

            case Constants.ORDER_REFUND:
                orderContent = <OrderRefund order={this.state.order} session={this.state.session} user={this.state.user} verifyMsg={this.state.verifyMsg}></OrderRefund>
                break;
        }

        return (
            <div id="react_body">
                <Header hgstyle={tint}/>

                {orderContent}

            </div>
        );
    },

    _onChange: function() {
        this.setState(getAppState());
    },



});

module.exports = app;

