/** @jsx React.DOM */

var React = require('react');
var Actions = require('../actions/Actions');

var app = React.createClass({

    render: function() {

        var statusLabelClass = 'label label-danger';
        var statusContent = '未发布'
        if(this.props.status == "published") {
            statusLabelClass = 'label label-success';
            statusContent = '已发布';
        }

        return (
            <div>
                <div className="row grey_text">
                    <div className="col-xs-6 text-left">{this.props.category}</div>
                    <div className="col-xs-6 text-right"><span className={statusLabelClass}>{statusContent}</span></div>
                </div>
                <div className="row text-left">
                    <div className="col-xs-12"><h3>{this.props.title}</h3></div>
                </div>
                <div className="row grey_text">
                    <div className="col-xs-4 text-left vcenter30">¥{this.props.price}</div>
                    <div className="col-xs-4 text-center vcenter30">{this.props.usedNo}个用户使用</div>
                    <div className="col-xs-4 text-right"><button className="btn btn-hd-blue btn-sm" onClick={this._triggerDetail}>查看</button></div>
                </div>
                <hr/>
            </div>
        );
    },

    _triggerDetail: function() {
        Actions.triggerListToDetail();
    },
});

module.exports = app;

