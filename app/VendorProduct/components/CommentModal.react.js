/** @jsx React.DOM */

var React = require('react');
var Actions = require('../actions/Actions');
var CommentItem = require('../components/CommentItem.react');

var app = React.createClass({

    render: function () {

        return (
            <div className="modal modal-fullscreen fade" id="productComment" tabindex="-2" role="dialog"
                 aria-labelledby="ProductDetailModalLabel" data-backdrop="static">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button type="button" className="close" onClick={this._onCancel}><span
                                aria-hidden="true">&times;</span></button>
                            <h4 className="modal-title text-center">服务评论</h4>
                        </div>

                        <div className="modal-body">
                            <ul className="list-unstyled">
                                <li>
                                    <CommentItem></CommentItem>
                                    <hr/>
                                </li>
                                <li>
                                    <CommentItem></CommentItem>
                                </li>

                            </ul>

                        </div>

                        <div className="modal-footer">
                            <button type="button" className="btn btn-default btn-hd-blue" onClick={this._onCancel}>关闭</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    },

    _onCancel: function() {
        Actions.triggerCommentToDetail()
    },
});

module.exports = app;

