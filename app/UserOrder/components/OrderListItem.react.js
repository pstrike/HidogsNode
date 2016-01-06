/** @jsx React.DOM */

var React = require('react');
var HidogsConstants = require('../../Common/constants/HidogsConstants');
var AppDispatcher = require('../../Common/dispatcher/AppDispatcher');

var Store = require('../stores/Store');
var Actions = require('../actions/Actions');

var GenOrderNo = require('../../../util/genorderno');
var gettbpaidprice = require('../../../util/gettbpaidprice');
var formatdatetime = require('../../../util/formatdatetime');

var app = React.createClass({


    render: function() {

        var orderDate = new Date(this.props.order.booked_time.booked_date);
        var orderDateContent = formatdatetime.formatDate(orderDate);

        var orderStartTime = new Date(this.props.order.booked_time.start_time);
        var orderEndTime = new Date(this.props.order.booked_time.end_time);
        var orderTimeContent = formatdatetime.formatTime(orderStartTime) + "-" + formatdatetime.formatTime(orderEndTime);

        var tint = "";
        var status = "";
        var icon = "";
        switch (this.props.order.status) {
            case "tbpaid":
                status = "待支付";
                tint = "hg-yellow-section";
                icon = <span className="glyphicon glyphicon-jpy hg-session-header-icon"></span>;
                break;

            case "tbpaidconfirmed":
                status = "支付进行中";
                tint = "hg-yellow-section";
                icon = <span className="glyphicon glyphicon-share-alt hg-session-header-icon"></span>;
                break;

            case "payfail":
                status = "支付失败";
                tint = "hg-yellow-section";
                icon = <span className="glyphicon glyphicon-warning-sign hg-session-header-icon"></span>;
                break;

            case "tbconfirmed":
            case "tbserviced":
                status = "待使用";
                tint = "hg-green-section";
                icon = <span className="glyphicon glyphicon-ok hg-session-header-icon"></span>;
                break;

            case "overdue":
                status = "已过期"
                tint = "hg-red-section";
                icon = <span className="glyphicon glyphicon-time hg-session-header-icon"></span>;
                break;

            case "tbcommented":
                status = "待评价";
                tint = "hg-orange-section";
                icon = <span className="glyphicon glyphicon-comment hg-session-header-icon"></span>;
                break;

            case "completed":
                status = "完成";
                tint = "hg-blue-section";
                icon = <span className="glyphicon glyphicon-stop hg-session-header-icon"></span>;
                break;

            case "cancelled":
                status = "取消";
                icon = <span className="glyphicon glyphicon-remove hg-session-header-icon"></span>;
                break;

            case "refund":
                status = "退款中";
                tint = "hg-red-section";
                icon = <span className="glyphicon glyphicon-refresh hg-session-header-icon"></span>;
                break;

        }
        var hgStyle = "text-center voffset50 " + tint;

        var onSiteFlag = "";
        if(this.props.order.isOnSite) {
            onSiteFlag = <span className="label hg-label">上门服务</span>;
        }

        return (
            <div className={hgStyle}>
                {icon}
                <p>{status}</p>
                <div className="hg-header-24">{this.props.order.product.title}</div>
                <span className="small roffset5">订单号: {GenOrderNo.orderno(this.props.order.order_id, this.props.order.created_time)}</span>
                {onSiteFlag}
                <div className="container voffset15">
                    <div className="row">
                        <div className="col-xs-4">
                            <small>{orderDateContent}</small><br/>
                            <span>{orderTimeContent}</span>
                        </div>
                        <div className="col-xs-5">
                            <img src={this.props.order.vendor.head_image_url} className="img-circle user-icon-normal roffset2"/>
                            <span>{this.props.order.vendor.nick_name}</span>
                        </div>
                        <div className="col-xs-3 vcenter45">
                            <span>¥{gettbpaidprice.cal(this.props.order.price.total, this.props.order.price.discount)}</span>
                        </div>
                    </div>
                </div>
                <div className="voffset15">
                    <button className="btn btn-hd-blue text-muted btn-long" onClick={this._triggerOrderDetail.bind(this, this.props.order)}>查看</button>
                </div>
                <hr className="voffset30"/>
            </div>
        );
    },

    _triggerOrderDetail: function(order) {
        Actions.listTriggerOrderDetail(order);
    },

});

module.exports = app;

