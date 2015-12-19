/** @jsx React.DOM */

var React = require('react');
var HidogsConstants = require('../../Common/constants/HidogsConstants');
var AppDispatcher = require('../../Common/dispatcher/AppDispatcher');

var Actions = require('../actions/Actions');
var SideBar = require('../../Admin/components/SideBar.react.js');
var NavBar = require('./NavBar.react');
var OrderList = require('./OrderList.react');

var app = React.createClass({

    render: function() {

        return (
            <div>
                <NavBar/>

                <div className="container-fluid">
                    <div className="row">
                        <SideBar active="order"/>
                        <OrderList/>
                    </div>
                </div>
            </div>
        );
    },

});

module.exports = app;

