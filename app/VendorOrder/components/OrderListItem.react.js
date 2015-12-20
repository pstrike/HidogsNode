/** @jsx React.DOM */

var React = require('react');
var HidogsConstants = require('../../Common/constants/HidogsConstants');
var AppDispatcher = require('../../Common/dispatcher/AppDispatcher');

var Store = require('../stores/Store');
var Actions = require('../actions/Actions');

var GenOrderNo = require('../../../util/genorderno');


var app = React.createClass({


    render: function() {
        var status = "";
        var labelStyle = "label ";
        switch (this.props.order.status) {

            case "tbconfirmed":

                var today = new Date();
                var orderCreatedTime = new Date(this.props.order.created_time);
                var minDistance = parseInt(Math.abs(today-orderCreatedTime)/1000/60);

                if(minDistance <= 15) {
                    status = "待确认";
                    labelStyle += "label-warning"
                }
                else {
                    status = "待使用";
                    labelStyle += "label-success"
                }

                break;

            case "tbserviced":
                status = "待使用";
                labelStyle += "label-success"
                break;

            case "tbcommented":
                status = "完成";
                labelStyle += "label-primary"
                break;

            case "completed":
                status = "完成";
                labelStyle += "label-primary"
                break;

        }

        var orderDate = new Date(this.props.order.booked_time.booked_date);
        var orderDateContent = this._formatDate(orderDate);

        var orderStartTime = new Date(this.props.order.booked_time.start_time);
        var orderEndTime = new Date(this.props.order.booked_time.end_time);
        orderDateContent += " " + this._formatTime(orderStartTime) + "-" + this._formatTime(orderEndTime);

        return (
            <li>
                <div className="row grey_text">
                    <div className="col-xs-6 text-left">{orderDateContent}</div>
                    <div className="col-xs-6 text-right"><span className={labelStyle}>{status}</span></div>
                </div>
                <div className="row text-left voffset15">
                    <div className="col-xs-12 small grey_text">订单号: {GenOrderNo.orderno(this.props.order.order_id, this.props.order.created_time)}</div>
                    <div className="col-xs-12 hg-header-24">{this.props.order.product.product_title}</div>
                </div>
                <div className="row grey_text voffset15">
                    <div className="col-xs-4 text-left">
                        <img className="user-icon-small30 img-circle roffset5" src={this.props.order.user.user_head_image_url}/>
                        <span>{this.props.order.user.user_name}</span>
                    </div>

                    <div className="col-xs-4 text-center vcenter30">¥{this.props.order.price.total}</div>
                    <div className="col-xs-4 text-right ">
                        <button className="btn btn-hd-blue btn-sm" data-toggle="modal" data-target="#productDetail" onClick={this._triggerOrderDetail.bind(this, this.props.order)}>
                            查看
                        </button>
                    </div>
                </div>
                <hr/>
            </li>
        );
    },

    _formatTime: function(date) {
        return date.getHours() + ":" + date.getMinutes();
    },

    _formatDate: function(date) {
        return date.getFullYear() + "/" + (date.getMonth()+1) + "/" + date.getDate();
    },

    _triggerOrderDetail: function(order) {
        Actions.listTriggerOrderDetail(order);
    },

});

module.exports = app;
