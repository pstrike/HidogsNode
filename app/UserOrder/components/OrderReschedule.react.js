/** @jsx React.DOM */

var React = require('react');
var HidogsConstants = require('../../Common/constants/HidogsConstants');
var AppDispatcher = require('../../Common/dispatcher/AppDispatcher');

var Store = require('../stores/Store');
var Actions = require('../actions/Actions');


var app = React.createClass({

    getInitialState: function() {
        return {
            order: {
                booked_time: {
                    booked_date: "",
                    start_time: "",
                    end_time: "",
                }
            },
        };
    },

    componentDidMount: function() {
        Actions.getProductAvailability(this.props.order.product.product_id);
    },

    componentDidUpdate: function() {
        if (this.props.verifyMsg.length > 0 && this.state.isScrollToErrMsg) {
            var position = $('body').scrollTop() + $('#errMsgAnchor').offset().top;

            $('body').animate({
                scrollTop: position
            }, 500);

            // ensure verify msg scroll only response once
            this.setState(
                {isScrollToErrMsg: false}
            );
        };
    },

    render: function() {

        var availableDateContent = [];
        var availableTimeslotContent = [];
        this.props.availability.forEach(function(item, index) {
            var date = new Date(item.date);
            var dateString = date.toLocaleDateString();

            switch (index) {
                case 0:
                    dateString = "今天";
                    break;
                case 1:
                    dateString = "明天";
                    break;
                case 2:
                    dateString = "后天";
                    break;
            }

            availableDateContent.push(<option value={date}>{dateString}</option>);

            if(this.state.order.booked_time.booked_date) {
                if(this.state.order.booked_time.booked_date.toDateString() == date.toDateString()) {
                    item.timeslot.forEach(function(item) {
                        var startTime = new Date(item.start_time);
                        var endTime = new Date(item.end_time);

                        var timeValue = startTime + "-" + endTime;

                        var startTimeString = startTime.toTimeString().split(":")[0] + ":" + startTime.toTimeString().split(":")[1]
                        var endTimeString = endTime.toTimeString().split(":")[0] + ":" + endTime.toTimeString().split(":")[1]

                        if(item.isAvailable) {
                            availableTimeslotContent.push(<option value={timeValue}>{startTimeString}-{endTimeString}</option>);
                        }
                        else {
                            availableTimeslotContent.push(<option value={timeValue} disabled>{startTimeString}-{endTimeString} (已预订)</option>);
                        }

                    })
                }
            }
        }.bind(this))

        var verifyMsgContent = "";
        if(this.props.verifyMsg.length > 0) {
            verifyMsgContent = <div className="text-right">
                <p className="bg-danger text-danger verification-msg voffset30">
                    <strong>请根据以下提示, 补充订单内容:</strong><br/>
                    {this.props.verifyMsg.map(function(item) {
                        return <span>{item}<br/></span>;
                    })}
                </p>
                <div id="errMsgAnchor"></div>
            </div>;
        }


        return (
            <div className="container">
                <div>
                    <div className="page-header text-center hg-pageheader">
                        <h4>Reschedule</h4>

                        <h2 className="voffset10"><strong>调整服务时间</strong></h2>
                    </div>

                    <hr/>

                    <div className="form-group">
                        <label>您想预约哪天的服务?</label>
                        <select className="form-control simple-input" name="booked_date" onChange={this._handleChange}
                                value={this.state.order.booked_time.booked_date}>
                            <option id="bookedDateDefaultOption" value="" disabled>请选择服务日期</option>
                            {availableDateContent}
                        </select>
                    </div>

                    <div className="form-group">
                        <label>您想预约哪一个时间段?</label>
                        <select className="form-control simple-input" name="booked_time" onChange={this._handleChange}>
                            <option id="bookedTimeDefaultOption" value="" disabled>请选择时间段</option>
                            {availableTimeslotContent}
                        </select>
                    </div>

                    {verifyMsgContent}

                </div>

                <footer className="footer">
                    <div className="container">
                        <div className="row text-right">
                            <div className="col-xs-12">
                                <button className="btn btn-hd-blue text-muted roffset5" onClick={this._cancel}>取消</button>
                                <button className="btn btn-hd-blue text-muted" onClick={this._submit}>完成</button>
                            </div>
                        </div>
                    </div>
                </footer>

            </div>
        );
    },

    _handleChange: function (event) {
        var newOrder = this.state.order;

        // handle available timeslot
        switch (event.target.name) {
            case "booked_date":
                newOrder.booked_time.booked_date = new Date(event.target.value);
                newOrder.booked_time.start_time = "";
                newOrder.booked_time.end_time = "";

                $("#bookedTimeDefaultOption").prop("selected", true)
                break;

            case "booked_time":
                var startTime = new Date(event.target.value.split("-")[0]);
                var endTime = new Date(event.target.value.split("-")[1]);
                newOrder.booked_time.start_time = startTime;
                newOrder.booked_time.end_time = endTime;

                break;
        }

        console.log(newOrder);

        this.setState({order: newOrder});
    },

    _submit: function() {
        var verifyMsg = this._verify();

        if(verifyMsg.length == 0) {
            var newOrder = {};
            newOrder.order_id = this.props.order.order_id;
            newOrder.booked_time = this.state.order.booked_time;

            console.log(newOrder);

            Actions.submitRescheduleTriggerDetail(newOrder);
        }
        else {
            //scroll to err msg
            this.setState(
                {isScrollToErrMsg: true}
            );

            Actions.verify(verifyMsg);
        }

    },

    _cancel: function() {
        Actions.cancelRescheduleTriggerDetail();
    },

    _verify: function() {
        var verifyMsg = [];

        if(!this.state.order.booked_time.start_time) {
            verifyMsg.push("-请选择您要预订的服务时间");
        }

        return verifyMsg;
    },

});

module.exports = app;

