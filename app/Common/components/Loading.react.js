/** @jsx React.DOM */

var React = require('react');

var app = React.createClass({

    componentDidMount: function() {
        // set loading body height
        var bodyHeight = $(window).height();
        var lineHeight = bodyHeight - 50;
        $('#loadingCover').css({"height": bodyHeight + 'px' });
        $('#loadingCover').css({"line-height": lineHeight + 'px' });

    },

    render: function () {

        return (
            <div id="loadingCover" className="text-center">
                <i className="fa fa-spinner fa-2x fa-spin"></i>
            </div>
        );
    },

});

module.exports = app;

