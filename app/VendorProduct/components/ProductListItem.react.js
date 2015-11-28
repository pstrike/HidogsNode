/** @jsx React.DOM */

var React = require('react');
var Actions = require('../actions/Actions');

var app = React.createClass({

    render: function() {

        var statusLabelClass;
        var statusContent;

        if(this.props.isExample) {
            statusLabelClass = 'label label-default';
            statusContent = '样例';
        }
        else {
            if(this.props.status == "published") {
                statusLabelClass = 'label label-success';
                statusContent = '已发布';
            }
            else {
                statusLabelClass = 'label label-danger';
                statusContent = '未发布'
            }
        }

        return (
            <div>
                <div className="row grey_text">
                    <div className="col-xs-9 text-left">{this.props.category}</div>
                    <div className="col-xs-3 text-right"><span className={statusLabelClass}>{statusContent}</span></div>
                </div>
                <div className="row text-left">
                    <div className="col-xs-12"><h3>{this.props.title}</h3></div>
                </div>
                <div className="row grey_text">
                    <div className="col-xs-4 text-left vcenter30">¥{this.props.price}</div>
                    <div className="col-xs-4 text-center vcenter30">{this.props.usedNo}个用户使用</div>
                    <div className="col-xs-4 text-right"><button className="btn btn-hd-blue btn-sm" onClick={this._triggerDetail.bind(this, this.props.productId)}>查看</button></div>
                </div>
                <hr/>
            </div>
        );
    },

    _triggerDetail: function(productId) {
        Actions.triggerListToDetail(productId);
    },
});

module.exports = app;

