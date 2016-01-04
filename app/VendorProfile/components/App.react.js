/** @jsx React.DOM */

var React = require('react');
var HidogsConstants = require('../../Common/constants/HidogsConstants');
var AppDispatcher = require('../../Common/dispatcher/AppDispatcher');
var HGStore = require('../../Common/stores/session');
var WXSign = require('./../../Common/components/WXSign');
var Loading = require('../../Common/components/Loading.react');
var BecomeVendorInfo = require('../../Common/components/BecomeVendorInfo.react');

var Store = require('../stores/Store');
var Actions = require('../actions/Actions');
var Constants = require('../constants/Constants');
var Main = require('../components/Main.react');
var Edit = require('../components/Edit.react');


function getAppState() {
    return {
        session: HGStore.getSession(),
        vendor: Store.getVendor(),
        status: Store.getStatus(),
        wxSign: Store.getWXSign(),
    };
}

var app = React.createClass({

    getInitialState: function() {
        return getAppState();
    },

    componentDidMount: function() {
        Store.addChangeListener(this._onChange);

        Actions.init();
    },

    componentWillUnmount: function() {
        Store.removeChangeListener(this._onChange);
    },

    render: function() {

        var content = "";

        switch (this.state.status) {
            case Constants.STATE_VIEW:
                content = <Main vendor={this.state.vendor}></Main>
                break;

            case Constants.STATE_EDIT:
                content = <Edit></Edit>
                break;

            default:
                content = <Loading></Loading>

        }

        if(this.state.session.status && this.state.session.status != "approved") {
            content = <BecomeVendorInfo></BecomeVendorInfo>
        }

        return (
            <div>
                <WXSign signature = {this.state.wxSign}
                        getSign = {this.getWXSign}
                        apilist = 'chooseImage,uploadImage'>
                </WXSign>

                {content}
            </div>
        );
    },

    _onChange: function() {
        this.setState(getAppState());
    },

    getWXSign: function() {
        Actions.getWXSignature(document.location.href);
    },

});

module.exports = app;

