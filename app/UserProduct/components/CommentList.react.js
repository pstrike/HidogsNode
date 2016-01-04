/** @jsx React.DOM */

var React = require('react');
var Actions = require('../actions/Actions');

var ComemntItem = require('../../Common/components/CommentItem.react');

var formatdatetime = require('../../../util/formatdatetime');

var app = React.createClass({

    componentDidMount: function() {
        showHgModal('commentListModal');

        var pageHeight = $(window).height();
        var bodyHeight = pageHeight - 121;
        $('#commentListBody').css({"height": bodyHeight + 'px' });
        $('#commentListModal').css({"height": pageHeight + 'px' });

    },

    componentWillUnmount: function() {
        hideHgModal('commentListModal');
    },

    render: function () {

        var commentContent = [];
        this.props.commentList.forEach(function(item) {
            var commentCreatedTime = new Date(item.created_time);

            commentContent.push(<ComemntItem
                    author={item.author.nick_name}
                    createdTime={formatdatetime.formatDate(commentCreatedTime)}
                    star={item.content.rate}
                    authorImage={item.author.head_image_url}
                    content={item.content.text}></ComemntItem>);

            commentContent.push(<hr className="grey-border"/>);
        })

        return (
            <div id="commentListModal" className="hg-modal container-fluid">
                <div className="hg-modal-header row">
                    <div className="col-xs-2 text-left hg-modal-header-close">
                        <button type="button" className="close"><span
                            aria-hidden="true" onClick={this._onCancel}>&times;</span></button>
                    </div>
                    <div className="col-xs-8 text-center hg-modal-title modal_grey_font"><h4>评论</h4></div>
                    <div className="col-xs-2 text-center hg-modal-title"></div>
                </div>

                <div className="hg-modal-body text-left modal_grey_font" id="commentListBody">
                    {commentContent}
                </div>

                <div className="hg-modal-footer text-right row">
                    <div className="col-xs-12">
                        <button className="btn btn-hd-blue text-muted" onClick={this._onCancel}>关闭</button>
                    </div>
                </div>
            </div>
        );
    },

    _onCancel: function () {
        Actions.triggerCommentToProduct();
    },
});

module.exports = app;

