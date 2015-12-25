/** @jsx React.DOM */

var React = require('react');
var HidogsConstants = require('../../Common/constants/HidogsConstants');
var AppDispatcher = require('../../Common/dispatcher/AppDispatcher');
var HGStore = require('../../Common/stores/session');

var Store = require('../stores/Store');
var Actions = require('../actions/Actions');

var Main = require('../components/Main.react');


function getAppState() {
    return {
        session: HGStore.getSession(),
        user: Store.getUser(),
        couponList: Store.getCouponList(),
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
        HGStore.addChangeListener(this._onChange);

        Actions.init();
    },

    componentWillUnmount: function() {
        Store.removeChangeListener(this._onChange);
        HGStore.removeChangeListener(this._onChange);
    },

    render: function() {

        return (
            <div>
                <Main user={this.state.user} couponList={this.state.couponList} verifyMsg={this.state.verifyMsg}></Main>
            </div>
        );
    },

    _onChange: function() {
        this.setState(getAppState());
    }

});

module.exports = app;
