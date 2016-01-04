/** @jsx React.DOM */

var React = require('react');
var HidogsConstants = require('../../Common/constants/HidogsConstants');
var AppDispatcher = require('../../Common/dispatcher/AppDispatcher');

var Store = require('../stores/Store');
var Actions = require('../actions/Actions');
var ComemntItem = require('./CommentItem.react');
var Header = require('./../../Common/components/Header.react.js');

var formatdatetime = require('../../../util/formatdatetime');


var app = React.createClass({

    render: function() {

        var commentContent = [];
        this.props.commentList.forEach(function(item) {
            var commentCreatedTime = new Date(item.created_time);

            commentContent.push(<ComemntItem
                author={item.author.nick_name}
                createdTime={formatdatetime.formatDate(commentCreatedTime)}
                star={item.content.rate}
                authorImage={item.author.head_image_url}
                content={item.content.text}></ComemntItem>);

            commentContent.push(<hr/>);
        })

        return (
            <div id="react_body">
                <Header subtitle="评论" hgstyle="hg-navbar" modal="true"></Header>

                <div className="container">
                    {commentContent}
                </div>

                <footer className="footer bg-white">
                    <div className="container">
                        <div className="row text-right">
                            <div className="col-xs-12">
                                <button className="btn btn-hd-blue text-muted" onClick={this._cancel}>关闭</button>
                            </div>
                        </div>
                    </div>
                </footer>

            </div>
        );
    },

    _cancel: function() {
        Actions.triggerMainFromComment();
    },


});

module.exports = app;

