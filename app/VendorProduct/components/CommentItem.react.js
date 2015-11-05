/** @jsx React.DOM */

var React = require('react');
var Actions = require('../actions/Actions');

var app = React.createClass({

    render: function () {

        return (
            <div>
                <div className="row">
                    <div className="col-xs-3 text-center">
                        <img src="../../img/ppl_icon.png"/>

                        <p>大白</p>
                    </div>
                    <div className="col-xs-9">
                        <div className="row">
                            <div className="col-xs-6 text-left">
                                                    <span className="glyphicon glyphicon-star star-yellow"></span>
                                                    <span className="glyphicon glyphicon-star star-yellow"></span>
                                                    <span className="glyphicon glyphicon-star star-yellow"></span>
                                                    <span className="glyphicon glyphicon-star-empty star-yellow"></span>
                                                    <span className="glyphicon glyphicon-star-empty star-yellow"></span>
                            </div>
                            <div className="col-xs-6 text-right grey_text">2015/10/31</div>
                        </div>
                        <div className="row">
                            <div className="col-xs-12 text-left">
                                <p>我家波波有幸被抽中免费体验洗白白y∩__∩y
                                    当然要回敬一个点评以表感激。其实我是住在这附近，这店开了很久了，就在马路边，很容易找到。</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    },

    _onCancel: function () {
        Actions.triggerCommentToDetail()
    },
});

module.exports = app;

