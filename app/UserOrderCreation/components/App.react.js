/** @jsx React.DOM */

var React = require('react');
var HidogsConstants = require('../../Common/constants/HidogsConstants');
var AppDispatcher = require('../../Common/dispatcher/AppDispatcher');

var Store = require('../stores/Store');
var Actions = require('../actions/Actions');
var Constants = require('../constants/Constants');
var Header = require('./../../Common/components/Header.react.js');
var Uudi = require('../../../util/genuuid');
var mapconvertor = require('../../../util/mapconverter');
var gettbpaidprice = require('../../../util/gettbpaidprice');


function getAppState() {
    return {
        order: Store.getOrder(),
        product: Store.getProduct(),
        session: Store.getSession(),
        availability: Store.getAvailability(),
        couponList: Store.getCouponList(),
        verifyMsg: Store.getVerifyMsg(),
        status: Store.getStatus(),
    };
}

var app = React.createClass({

    getInitialState: function () {
        return getAppState();
    },

    componentDidMount: function () {
        Store.addChangeListener(this._onChange);

        var productId = $("#react-main-mount").attr("productid");
        Actions.loadSessionThenProductThenAvailability(productId);

    },

    componentWillUnmount: function () {
        Store.removeChangeListener(this._onChange);
    },

    componentDidUpdate: function() {
        if (this.state.verifyMsg.length > 0 && this.state.isScrollToErrMsg) {
            var position = $('body').scrollTop() + $('#errMsgAnchor').offset().top;

            $('body').animate({
                scrollTop: position
            }, 500);

            // ensure verify msg scroll only response once
            this.setState(
                {isScrollToErrMsg: false}
            );
        };

        if(this.state.status == Constants.STATE_RELOAD) {
            var productId = $("#react-main-mount").attr("productid");
            Actions.loadSessionThenProductThenAvailability(productId);
            $("#bookedTimeDefaultOption").prop("selected", true)
        }
    },

    render: function () {

        var basicPriceContent = [];
        var additionalPriceContent = [];
        var additionalPriceOptionContent = [];
        if (this.state.product.price) {
            this.state.product.price.basic.forEach(function (item, index) {
                if(item.price) {
                    var price = item.price + "元";

                    if (this.state.order.price.basic.length > 0 && item.name == this.state.order.price.basic[0].name) {
                        basicPriceContent.push(<div className="radio">
                            <label>
                                <input type="radio" value={index} onChange={this._handleChange}
                                       checked/>

                                <div className="col-xs-7"><input type="text" className="form-control no-border"
                                                                 placeholder="价格名称"
                                                                 value={item.name} disabled/></div>
                                <div className="col-xs-5"><input type="text" className="form-control no-border"
                                                                 placeholder="价格" value={price}
                                                                 disabled/></div>
                            </label>
                        </div>);
                    }
                    else {
                        basicPriceContent.push(<div className="radio">
                            <label>
                                <input type="radio" value={index} onChange={this._handleChange}/>

                                <div className="col-xs-7"><input type="text" className="form-control no-border"
                                                                 placeholder="价格名称"
                                                                 value={item.name} disabled/></div>
                                <div className="col-xs-5"><input type="text" className="form-control no-border"
                                                                 placeholder="价格" value={price}
                                                                 disabled/></div>
                            </label>
                        </div>);
                    }
                }

            }.bind(this))

            this.state.product.price.additional.forEach(function (item, index) {

                if(item.price) {
                    var price = item.price + "元";

                    if (this.state.order.price.additional.length > 0) {
                        var i;

                        // iterate to checked selected item
                        for (i = 0; i < this.state.order.price.additional.length; i++) {
                            if (item.name == this.state.order.price.additional[i].name) {
                                additionalPriceOptionContent.push(<div className="checkbox">
                                    <label>
                                        <input type="checkbox" value={index} onChange={this._handleChange}
                                               checked/>

                                        <div className="col-xs-7"><input type="text" className="form-control no-border"
                                                                         placeholder="价格名称"
                                                                         value={item.name} disabled/></div>
                                        <div className="col-xs-5"><input type="text" className="form-control no-border"
                                                                         placeholder="价格" value={price}
                                                                         disabled/></div>
                                    </label>
                                </div>);

                                break;
                            }
                        }

                        // if iterate cannot find just add additional price in
                        if (i == this.state.order.price.additional.length) {
                            additionalPriceOptionContent.push(<div className="checkbox">
                                <label>
                                    <input type="checkbox" value={index} onChange={this._handleChange}/>

                                    <div className="col-xs-7"><input type="text" className="form-control no-border"
                                                                     placeholder="价格名称"
                                                                     value={item.name} disabled/></div>
                                    <div className="col-xs-5"><input type="text" className="form-control no-border"
                                                                     placeholder="价格" value={price}
                                                                     disabled/></div>
                                </label>
                            </div>);
                        }
                    }
                    else {
                        additionalPriceOptionContent.push(<div className="checkbox">
                            <label>
                                <input type="checkbox" value={index} onChange={this._handleChange}/>

                                <div className="col-xs-7"><input type="text" className="form-control no-border"
                                                                 placeholder="价格名称"
                                                                 value={item.name} disabled/></div>
                                <div className="col-xs-5"><input type="text" className="form-control no-border"
                                                                 placeholder="价格" value={price}
                                                                 disabled/></div>
                            </label>
                        </div>);
                    }
                }

            }.bind(this))

            if(additionalPriceOptionContent.length > 0) {
                additionalPriceContent = <div className="form-group">
                    <label>请选择附加服务项目</label>
                    {additionalPriceOptionContent}
                </div>
            }
        }

        var availableDateContent = [];
        var availableTimeslotContent = [];
        this.state.availability.forEach(function(item, index) {
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

        // verify msg
        var verifyMsgContent = "";
        if(this.state.verifyMsg.length > 0) {
            verifyMsgContent = <div className="text-right">
                <p className="bg-danger text-danger verification-msg voffset30">
                    <strong>请根据以下提示, 补充订单内容:</strong><br/>
                    {this.state.verifyMsg.map(function(item) {
                        return <span>{item}<br/></span>;
                    })}
                </p>
                <div id="errMsgAnchor"></div>
            </div>;
        }

        // product address
        var addressContent = "";
        var mapURL = "";
        if(this.state.product.address) {
            addressContent = (this.state.product.address.city ? this.state.product.address.city : "") +
                (this.state.product.address.district ? this.state.product.address.district : "") +
                (this.state.product.address.street ? this.state.product.address.street : "") +
                (this.state.product.address.business ? this.state.product.address.business : "") +
                (this.state.product.address.additional ? this.state.product.address.additional : "");

            var bdPoint = mapconvertor.gcj02tobd09(this.state.product.location.coordinates[0], this.state.product.location.coordinates[1])

            mapURL = "http://api.map.baidu.com/staticimage?center="+
                bdPoint[0]+
                ","+
                bdPoint[1]+
                "&width="+
                document.body.clientWidth +
                "&height=350&zoom=15&ak=uWWhwl3ycRCG6EAB3rpGlncT&markers="+
                bdPoint[0]+
                ","+
                bdPoint[1]+
                "&markerStyles=l,A";

        }

        var addressSectionContent = <div>
            <div className="text-center voffset40">
                <h4>服务地点</h4>
            </div>
            <div className="form-group">
                <label>详细地址</label>
                <textarea className="form-control no-border" rows="2" value={addressContent} disabled></textarea>
            </div>
            <img className="img-responsive center-block"
                 src={mapURL}/>
        </div>;

        // is on site
        var isOnSiteStatus = "";
        if(this.state.product.tag_list) {
            for(var i=0; i<this.state.product.tag_list.length; i++) {
                if(this.state.product.tag_list[i] == "上门服务") {
                    isOnSiteStatus = <span className="label label-default">上门服务</span>;
                    addressSectionContent = "";
                    break;
                }
            }
        }

        // Coupon
        var couponContent = "";
        var couponItemContent = [];
        this.state.couponList.forEach(function(item) {
            couponItemContent.push(<option value={item.coupon_id}>{item.title}</option>)
        })
        if(couponItemContent.length > 0 ) {
            couponContent = <div className="form-group">
                <label>优惠码</label>
                <select className="form-control simple-input" value={this.state.order.price.coupon ? this.state.order.price.coupon.coupon_id : ""} name="price.coupon.coupon_id" onChange={this._handleChange}>
                    {couponItemContent}
                    <option value="">不使用</option>
                </select>
            </div>;
        }

        // price summay
        var priceSummaryContent = "价格合计"
        var totalPriceContent = this.state.order.price.total;
        if(this.state.order.price.coupon && this.state.order.price.coupon.title) {
            priceSummaryContent = "(使用优惠码) 价格合计";
            totalPriceContent = gettbpaidprice.cal(this.state.order.price.total, this.state.order.price.discount) + " (总价"+this.state.order.price.total+"元,使用优惠码后优惠"+this.state.order.price.discount+"元)"
        }

        return (
            <div id="react_body">
                <Header/>

                <div className="container blue-background">
                    <div className="page-header text-center hg-pageheader">
                        <h4 className="tint_text">Confirmation</h4>

                        <h2 className="tint_text voffset10"><strong>订单确认</strong></h2>
                    </div>

                    <hr/>

                    <div className="text-center voffset40">
                        <h4>服务信息</h4>
                    </div>
                    <div>
                        <div className="form-group">
                            <label className="roffset5">服务项目</label>{isOnSiteStatus}
                            <input type="text" className="form-control no-border" placeholder="标题"
                                   value={this.state.product.title}
                                   disabled/>
                        </div>
                        <div className="form-group">
                            <label>服务范围</label>
                            <textarea className="form-control no-border" rows="5"
                                      value={this.state.product.category ? this.state.product.category.scope : ""}
                                      disabled></textarea>
                        </div>
                        <div className="form-group">
                            <label>服务达人</label><br/>
                            <img src={this.state.product.vendor ? this.state.product.vendor.head_image_url : ""}
                                 className="img-circle user-icon-normal roffset5"/>
                            <span>{this.state.product.vendor ? this.state.product.vendor.vendor_name : ""}</span>
                        </div>
                    </div>

                    <div className="text-center voffset40">
                        <h4>服务价格</h4>
                    </div>
                    <div>
                        <div className="form-group">
                            <label>订单总价(元)</label>
                            <input type="text" className="form-control no-border" placeholder="标题" value={totalPriceContent}
                                   disabled/>
                        </div>
                        <div className="form-group">
                            <label>请选择服务项目</label>

                            {basicPriceContent}
                        </div>

                        {additionalPriceContent}

                    </div>

                    {couponContent}

                    <div className="text-center voffset40">
                        <h4>服务时间</h4>
                    </div>

                    <div className="form-group">
                        <label>您想预约哪天的服务?</label>
                        <select className="form-control simple-input" name="booked_date" onChange={this._handleChange} value={this.state.order.booked_time.booked_date}>
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

                    {addressSectionContent}

                    {verifyMsgContent}

                </div>

                <footer className="footer">
                    <div className="container">
                        <div className="row">
                            <div className="col-xs-3 text-left">
                                <button className="btn btn-hd-blue text-muted" onClick={this._cancel}>取消</button>
                            </div>
                            <div className="col-xs-6 voffset5 text-right">
                                <small className="grey_text">{priceSummaryContent}</small>
                                <h4 className="voffset0 tint_text">¥{gettbpaidprice.cal(this.state.order.price.total, this.state.order.price.discount)}元</h4>
                            </div>
                            <div className="col-xs-3 text-right">
                                <button id="paybtn" className="btn btn-hd-tint text-muted" onClick={this._onPay}>支付</button>
                            </div>
                        </div>
                    </div>
                </footer>

            </div>
        );
    },

    _onChange: function () {
        this.setState(getAppState());
    },

    _onPay: function () {
        var verifyMsg = this._validateOrder();

        if(verifyMsg.length == 0) {
            this.state.order.order_id = Uudi.uuid();
            this.state.order.openid = this.state.session.openid;

            for(var i=0; i<this.state.product.tag_list.length; i++) {
                if(this.state.product.tag_list[i] == "上门服务") {
                    this.state.order.isOnSite = true;
                    break;
                }
            }

            // disable pay btn after click once
            $('#paybtn').text('稍等');
            $('#paybtn').attr('disabled', 'true');

            Actions.payOrder(this.state.order);
        }
        else {
            //scroll to err msg
            this.setState(
                {isScrollToErrMsg: true}
            );

            Actions.verifyOrder(verifyMsg);
        }

    },

    _handleChange: function (event) {
        var type = event.target.type;
        var newOrder = this.state.order;

        // handle price
        switch (type) {
            case "radio":
                newOrder.price.basic = [];
                newOrder.price.basic.push(this.state.product.price.basic[event.target.value]);
                break;

            case "checkbox":
                if (event.target.checked) {
                    this.state.order.price.additional.push(this.state.product.price.additional[event.target.value]);
                }
                else {
                    for (var i = 0; i < this.state.order.price.additional.length; i++) {
                        if (this.state.product.price.additional[event.target.value].name == this.state.order.price.additional[i].name) {
                            this.state.order.price.additional.splice(i, 1);

                            break;
                        }
                    }
                }

                break;
        }

        switch (event.target.name) {
            case "booked_date": // handle available timeslot date
                newOrder.booked_time.booked_date = new Date(event.target.value);
                newOrder.booked_time.start_time = "";
                newOrder.booked_time.end_time = "";

                $("#bookedTimeDefaultOption").prop("selected", true)
                break;

            case "booked_time": // handle available timeslot date
                var startTime = new Date(event.target.value.split("-")[0]);
                var endTime = new Date(event.target.value.split("-")[1]);
                newOrder.booked_time.start_time = startTime;
                newOrder.booked_time.end_time = endTime;

                break;

            case "price.coupon.coupon_id":
                var i;
                for(i=0; i<this.state.couponList.length; i++) {
                    if(this.state.couponList[i].coupon_id == event.target.value) {
                        newOrder.price.coupon = {
                            coupon_id: event.target.value,
                            title: this.state.couponList[i].title,
                            off_percentage: this.state.couponList[i].off_percentage,
                        }

                        break;
                    }
                }
                if(event.target.value == "") {
                    newOrder.price.coupon = {
                        off_percentage: 0,
                    }
                }

                break;
        }

        var totalPrice = 0.0;
        newOrder.price.basic.forEach(function(item) {
            totalPrice += parseFloat(item.price);
        })

        newOrder.price.additional.forEach(function(item) {
            totalPrice += parseFloat(item.price);
        })
        newOrder.price.total = totalPrice;

        var discount = 0.0;
        if(newOrder.price.coupon && newOrder.price.coupon.title) {
            discount = parseFloat((totalPrice * parseFloat(newOrder.price.coupon.off_percentage)).toFixed(0));
        }
        newOrder.price.discount = discount;

        this.setState({order: newOrder});
    },

    _validateOrder: function() {
        var verifyMsg = [];

        if(this.state.order.price.basic.length == 0) {
            verifyMsg.push("-您还没选择服务项目");
        }

        if(!this.state.order.booked_time.start_time) {
            verifyMsg.push("-您还没选择服务时间");
        }

        return verifyMsg;
    },

    _cancel: function() {
        Actions.cancel();
    },

});

module.exports = app;

