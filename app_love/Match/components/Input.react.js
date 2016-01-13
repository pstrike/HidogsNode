/** @jsx React.DOM */

var React = require('react');

var Store = require('../stores/Store');
var Actions = require('../actions/Actions');
var Header = require('./../../../app/Common/components/Header.react.js');


var app = React.createClass({

    render: function() {

        return (
            <div className="hg-love" id="react_body">
                <div className="container blue-background-decoration"></div>

                <Header subtitle="解救单身狗" hgstyle="love-profile hg-navbar"/>

                <div className="container text-center">

                    <div className="page-header text-center hg-pageheader">
                        <h5>Match</h5>
                        <h2 className="voffset10"><strong>配对佳丽</strong></h2>
                    </div>

                    <hr/>

                    <div className="form-group text-left">

                        <input type="text" className="form-control simple-input no-border" placeholder="您的微信号" ref="wxId"/>
                        <br/><small><i>在查看成功配对的佳丽的联系方式前,请填写您的微信号以方便其他佳丽联系您</i></small>
                    </div>

                </div>

                <footer className="footer love-profile">
                    <div className="container">
                        <div className="row text-right">
                            <div className="col-xs-12">
                                <button className="btn btn-hd-blue text-muted text-center roffset5" onClick={this._cancel}>
                                    <span className="glyphicon glyphicon-remove" aria-hidden="true"></span>&nbsp;取消
                                </button>
                                <button className="btn btn-hd-blue text-muted text-center" onClick={this._submit}>
                                    <span className="glyphicon glyphicon-ok" aria-hidden="true"></span>&nbsp;确定
                                </button>
                            </div>
                        </div>
                    </div>
                </footer>

            </div>
        );
    },

    _submit: function() {
        var wxId = this.refs["wxId"].getDOMNode().value;

        var newUser = {
            user_id: this.props.user.user_id,
            wx_id: wxId
        };

        console.log(newUser);

        Actions.updateUser(newUser);
    },

    _cancel: function() {
        wx.closeWindow();
    },

});

module.exports = app;

