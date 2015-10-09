/** @jsx React.DOM */

var React = require('react');

var Header = React.createClass({

    render: function() {

        return (
            <nav className="navbar navbar-default">
                <div className="container-fluid">
                    <div className="navbar-header">
                        <a className="navbar-brand" href="#">欢宠</a>
                    </div>
                </div>
            </nav>
        );


    },

});

module.exports = Header;

