/** @jsx React.DOM */

var React = require('react');

var Header = React.createClass({

    render: function() {
        var total = parseInt(this.props.total);
        var rate = parseFloat(this.props.rate);
        var starCount = parseInt(rate);
        var halfStarCount = (rate - starCount) > 0.5 ? 1 : 0;
        var starContent = [];

        for(var i = 0; i<total; i++) {
            if(i<starCount) {
                starContent.push(<i className="fa fa-star star-yellow"></i>);
            }
            else if(i == starCount) {
                if(halfStarCount == 1) {
                    starContent.push(<i className="fa fa-star-half-o star-yellow"></i>);
                }
                else {
                    starContent.push(<i className="fa fa-star-o star-yellow"></i>);
                }
            }
            else {
                starContent.push(<i className="fa fa-star-o star-yellow"></i>);
            }
        }

        return <div>{starContent}</div>;
    },

});

module.exports = Header;

