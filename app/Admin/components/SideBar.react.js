/** @jsx React.DOM */

var React = require('react');
var HidogsConstants = require('../../Common/constants/HidogsConstants');
var AppDispatcher = require('../../Common/dispatcher/AppDispatcher');

var Actions = require('../actions/Actions');
var Header = require('./../../Common/components/Header.react.js');



var app = React.createClass({

    render: function() {

        return (
            <div className="col-sm-3 col-md-2 sidebar">
                <ul className="nav nav-sidebar">
                    <li className="active"><a href="#">服务伙伴 <span className="sr-only">(current)</span></a></li>
                    <li><a href="#">用户</a></li>
                    <li><a href="#">服务</a></li>
                    <li><a href="#">订单</a></li>
                    <li><a href="#">销售</a></li>
                </ul>
            </div>
        );
    },


});

module.exports = app;

