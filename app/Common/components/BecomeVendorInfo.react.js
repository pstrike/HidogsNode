/** @jsx React.DOM */

var React = require('react');
var Header = require('./Header.react');

var app = React.createClass({

    render: function () {

        return (
            <div id="react_body">
                <Header></Header>

                <div className="container text-center">
                    <h3>您还没成为欢宠服务伙伴</h3>
                    <span>请您回到欢宠服务伙伴微信服务号中,选择"加入服务伙伴"完成申请流程</span>
                </div>
            </div>
        );
    },

});

module.exports = app;

