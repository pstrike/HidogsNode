/** @jsx React.DOM */

var React = require('react');

var ShopCommentApp = React.createClass({

    getInitialState: function() {
        return {};
    },

    render: function() {
        var comment = this.props.comment;

        return (
            <div className="row component">
                <div className="col-xs-2 col-xs-offset-1 text-center">
                    <img src="../../img/ppl_icon.png"/>
                    <br/>
                    <span className="small">{comment.name}</span>
                </div>
                <div className="col-xs-8">
                    <em className="date small">{comment.date}</em>
                    <p>{comment.comment}</p>
                </div>
            </div>
            );
    }

});

module.exports = ShopCommentApp;