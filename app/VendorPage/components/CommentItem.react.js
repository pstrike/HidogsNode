/** @jsx React.DOM */

var React = require('react');
var Actions = require('../actions/Actions');

var app = React.createClass({

    render: function () {

        var starContent = [];
        var starCount = parseInt(this.props.star);
        for(var i = 0; i<5; i++) {
            if(i<starCount) {
                starContent.push(<span className="glyphicon glyphicon-star star-yellow"></span>);
            }
            else {
                starContent.push(<span className="glyphicon glyphicon-star-empty star-yellow"></span>);
            }
        }

        return (
            <div>
                <div className="row">
                    <div className="col-xs-3 text-center">
                        <img className="user-icon-small img-circle" src={this.props.authorImage}/>

                        <p>{this.props.author}</p>
                    </div>
                    <div className="col-xs-9">
                        <div className="row">
                            <div className="col-xs-6 text-left">
                                {starContent}
                            </div>
                            <div className="col-xs-6 text-right">{this.props.createdTime}</div>
                        </div>
                        <div className="row">
                            <div className="col-xs-12 text-left">
                                <p>{this.props.content ? this.props.content : "无内容"}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    },

});

module.exports = app;
