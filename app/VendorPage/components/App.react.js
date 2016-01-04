/** @jsx React.DOM */

var React = require('react');
var HidogsConstants = require('../../Common/constants/HidogsConstants');
var AppDispatcher = require('../../Common/dispatcher/AppDispatcher');
var HGStore = require('../../Common/stores/session');

var Store = require('../stores/Store');
var Constants = require('../constants/Constants');
var Actions = require('../actions/Actions');
var Main = require('../components/Main.react');
var CommentList = require('../components/CommentList.react');



function getAppState() {
    return {
        session: HGStore.getSession(),
        vendor: Store.getVendor(),
        productList: Store.getProductList(),
        commentList: Store.getCommentList(),
        status: Store.getStatus(),
        user: Store.getUser(),
    };
}

var app = React.createClass({

    getInitialState: function() {
        return getAppState();
    },

    componentDidMount: function() {
        Store.addChangeListener(this._onChange);
        HGStore.addChangeListener(this._onChange);

        Actions.init($("#react-main-mount").attr("vendorid"));

        if($("#react-main-mount").attr("isUser") == "true") {
            Actions.getSessionThenUser();
        }
    },

    componentWillUnmount: function() {
        Store.removeChangeListener(this._onChange);
        HGStore.removeChangeListener(this._onChange);
    },

    render: function() {

        var content = "";
        switch(this.state.status) {
            case Constants.STATE_VENDOR_PAGE:
                content = <Main vendor={this.state.vendor} productList={this.state.productList} user={this.state.user} isUser={$("#react-main-mount").attr("isUser") == "true" ? true : false}></Main>;
                break;

            case Constants.STATE_COMMENT:
                content = <CommentList commentList={this.state.commentList}></CommentList>;
                break;
        }

        return (
            <div>
                {content}
            </div>
        );
    },

    _onChange: function() {
        this.setState(getAppState());
    }

});

module.exports = app;

