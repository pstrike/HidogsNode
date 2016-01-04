/** @jsx React.DOM */

var React = require('react');
var RatingStar = require('./RatingStar.react');

var app = React.createClass({

    render: function () {

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
                                <RatingStar rate={this.props.star} total="5"></RatingStar>
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

