/** @jsx React.DOM */

var React = require('react');

var ReactApp = React.createClass({

    componentDidMount: function () {
        console.log("mount");

    },
    render: function () {
        return (
            <div id="table-area">

                Hello World

            </div>
            )
    }
});

/* Module.exports instead of normal dom mounting */
module.exports = ReactApp;