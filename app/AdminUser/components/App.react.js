/** @jsx React.DOM */

var React = require('react');
var HidogsConstants = require('../../Common/constants/HidogsConstants');
var AppDispatcher = require('../../Common/dispatcher/AppDispatcher');

var Actions = require('../actions/Actions');
var SideBar = require('../../Admin/components/SideBar.react');
var NavBar = require('../components/NavBar.react');
var ContentUserProfile = require('../components/ContentUserProfile.react');

var app = React.createClass({

    render: function() {

        return (
            <div>
                <NavBar/>

                <div className="container-fluid">
                    <div className="row">
                        <SideBar active="user"/>
                        <ContentUserProfile/>
                    </div>
                </div>
            </div>
        );
    },

});

module.exports = app;

