/** @jsx React.DOM */

var React = require('react');

var Header = React.createClass({

    render: function() {

        var headerContent = "";
        if(this.props.modal == "true") {
            headerContent = <nav className="navbar navbar-default navbar-fixed-top bg-white">
                <div className="container-fluid">
                    <div className="navbar-header text-center">
                        <p className="navbar-text"><strong>{this.props.subtitle}</strong></p>
                    </div>
                </div>
            </nav>;
        }
        else {
            var style = "navbar navbar-default navbar-fixed-top " + this.props.hgstyle;
            headerContent = <nav className={style}>
                <div className="container-fluid">
                    <div className="navbar-header">
                        <a className="navbar-brand" href="#">欢宠</a>
                        <p className="navbar-text">{this.props.subtitle}</p>
                    </div>
                </div>
            </nav>;
        }



        return headerContent;


    },

});

module.exports = Header;

