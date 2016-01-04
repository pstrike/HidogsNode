/** @jsx React.DOM */

var React = require('react');
var HidogsConstants = require('../../Common/constants/HidogsConstants');
var AppDispatcher = require('../../Common/dispatcher/AppDispatcher');

var Store = require('../stores/Store');
var Actions = require('../actions/Actions');
var OrderListItem = require('./OrderListItem.react');
var Header = require('./../../Common/components/Header.react.js');

var GenOrderNo = require('../../../util/genorderno');
var gettbpaidprice = require('../../../util/gettbpaidprice');
var formatdatetime = require('../../../util/formatdatetime');

var app = React.createClass({

    render: function() {

        var status = "";
        var labelStyle = "vcenter56 label ";
        var foorterBtn = [];
        switch (this.props.order.status) {

            case "tbconfirmed":

                var today = new Date();
                var orderCreatedTime = new Date(this.props.order.created_time);
                var minDistance = parseInt(Math.abs(today-orderCreatedTime)/1000/60);

                // if the order is onsite order, then need vendor to confirm

                status = "待确认";
                labelStyle += "label-warning"
                foorterBtn.push(<button className="btn btn-hd-blue text-muted" onClick={this._detailTriggerReject}>拒绝订单</button>);
                foorterBtn.push(<button className="btn btn-hd-blue text-muted" onClick={this._acceptOrder}>接受订单</button>);

                if(!this.props.order.isOnSite && minDistance > 15) {
                    status = "待使用";
                    labelStyle += "label-success"
                    foorterBtn = [];
                    foorterBtn.push(<button className="btn btn-hd-blue text-muted" onClick={this._detailTriggerCode}>使用码</button>);
                }

                break;

            case "tbserviced":
                status = "待使用";
                labelStyle += "label-success"
                foorterBtn.push(<button className="btn btn-hd-blue text-muted" onClick={this._detailTriggerCode}>使用码</button>);
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

        // product category
        var categoryContent = "";
        var categoryList = this.props.order.product.category ? this.props.order.product.category.path_name.split(",") : this.props.order.product.product_category.path_name.split(",");
        categoryList.forEach(function(category, index) {
            if(index > 1) {
                categoryContent = categoryContent + category + ">";
            }
        })
        categoryContent = categoryContent.substring(0,categoryContent.length-1) + (this.props.order.product.category ? this.props.order.product.category.name : this.props.order.product.product_category.name);

        // Additional Price Content
        var additionalPriceItemContent = [];
        if(this.props.order.price) {
            this.props.order.price.additional.forEach(function(item, index) {
                var style = "row voffset5";
                if(index == 0) {
                    style = "row";
                }

                additionalPriceItemContent.push(<div className={style}>
                    <div className="col-xs-7"><input type="text" className="form-control no-border"
                                                     placeholder="价格名称" value={item.name} disabled/>
                    </div>
                    <div className="col-xs-5"><input type="text" className="form-control no-border"
                                                     placeholder="价格" value={item.price} disabled/></div>
                </div>);
            })
        }
        var additionalPriceContent = "";
        if(additionalPriceItemContent.length > 0) {
            additionalPriceContent = <div className="form-group">
                <label>额外服务价格</label>
                {additionalPriceItemContent}
            </div>;
        }

        // Basic Price Content
        var basicPriceItemContent = [];
        if(this.props.order.price) {
            this.props.order.price.basic.forEach(function(item, index) {
                if(item.price) {
                    var style = "row voffset5";
                    if(index == 0) {
                        style = "row";
                    }

                    basicPriceItemContent.push(<div className={style}>
                        <div className="col-xs-7"><input type="text" className="form-control no-border"
                                                         placeholder="价格名称" value={item.name} disabled/>
                        </div>
                        <div className="col-xs-5"><input type="text" className="form-control no-border"
                                                         placeholder="价格" value={item.price} disabled/></div>
                    </div>);
                }
            })
        }
        var basicPriceContent = "";
        if(basicPriceItemContent.length > 0) {
            basicPriceContent = <div className="form-group">
                <label>美容护理</label>
            {basicPriceItemContent}
            </div>;
        }

        // Date Content
        var orderDate = new Date(this.props.order.booked_time.booked_date);
        var orderDateContent = formatdatetime.formatDate(orderDate);

        var orderStartTime = new Date(this.props.order.booked_time.start_time);
        var orderEndTime = new Date(this.props.order.booked_time.end_time);
        var orderTimeContent = formatdatetime.formatTime(orderStartTime) + "-" + formatdatetime.formatTime(orderEndTime);

        // User Profile Content
        var userProfileContent = [];
        if(this.props.order.user.name) {
            userProfileContent.push(
                <div className="form-group">
                    <label>用户称呼</label>
                    <input type="text" className="form-control no-border" placeholder="用户称呼" value={this.props.order.user.name} disabled/>
                </div>
            );
        }
        if(this.props.order.user.mobile) {
            userProfileContent.push(
                <div className="form-group">
                    <label>用户手机</label>
                    <input type="text" className="form-control no-border" placeholder="用户手机" value={this.props.order.user.mobile} disabled/>
                </div>
            );
        }
        if(this.props.order.user.pet_name) {
            userProfileContent.push(
                <div className="form-group">
                    <label>宠物名称</label>
                    <input type="text" className="form-control no-border" placeholder="宠物名称" value={this.props.order.user.pet_name} disabled/>
                </div>
            );
        }
        if(this.props.order.user.pet_name) {
            userProfileContent.push(
                <div className="form-group">
                    <label>宠物品种</label>
                    <input type="text" className="form-control no-border" placeholder="宠物品种" value={this.props.order.user.pet_type} disabled/>
                </div>
            );
        }
        if(this.props.order.user.pet_name) {
            userProfileContent.push(
                <div className="form-group">
                    <label>宠物年龄</label>
                    <input type="text" className="form-control no-border" placeholder="宠物年龄" value={this.props.order.user.pet_age} disabled/>
                </div>
            );
        }

        // Order Remark Content
        var remarkContent = [];
        if(this.props.order.remark) {
            remarkContent.push(
                <div className="form-group">
                    <label>备注信息</label>
                    <textarea className="form-control no-border" rows="3" value={this.props.order.remark} disabled></textarea>
                </div>
            );
        }

        // Address
        var addressContent = "";
        if(this.props.order.address) {
            addressContent = (this.props.order.address.city ? this.props.order.address.city : "") +
                (this.props.order.address.district ? this.props.order.address.district : "") +
                (this.props.order.address.street ? this.props.order.address.street : "") +
                (this.props.order.address.business ? this.props.order.address.business : "") +
                (this.props.order.address.additional ? this.props.order.address.additional : "");
        }

        // Price and Coupon Content
        var priceContent = this.props.order.price.total;
        var couponContent = "";
        if(this.props.order.price.coupon && this.props.order.price.coupon.title) {
            priceContent = this.props.order.price.total + " (使用优惠码优惠"+this.props.order.price.discount+", 实付"+gettbpaidprice.cal(this.props.order.price.total,this.props.order.price.discount)+")"
            couponContent = <div className="form-group">
                <label>优惠码</label>
                <input type="text" className="form-control no-border" placeholder="订单总价" value={this.props.order.price.coupon.title} disabled/>
            </div>;
        }

        // is on site
        var onSiteFlag = "";
        if(this.props.order.isOnSite) {
            onSiteFlag = <span className="label label-default roffset5">上门服务</span>;
        }

        return (
            <div id="react_body">
                <Header subtitle="订单详情" modal="true"></Header>

                <div className="container">
                    <div className="row">
                        <div className="col-xs-6 text-left">
                            <h3>服务项目</h3>
                        </div>
                        <div className="col-xs-6 text-right">
                            {onSiteFlag}
                            <span className={labelStyle}>{status}</span>
                        </div>
                    </div>


                    <div className="form-group">
                        <label>标题</label>
                        <input type="text" className="form-control no-border" placeholder="标题" value={this.props.order.product.title ? this.props.order.product.title : this.props.order.product.product_title} disabled/>
                    </div>
                    <div className="form-group">
                        <label>订单号</label>
                        <input type="text" className="form-control no-border" placeholder="订单号" value={GenOrderNo.orderno(this.props.order.order_id, this.props.order.created_time)} disabled/>
                    </div>
                    <div className="form-group">
                        <label>类别</label>
                        <input type="text" className="form-control no-border" placeholder="类别" value={categoryContent} disabled/>
                    </div>
                    <div className="form-group">
                        <label>服务范围</label>
                        <textarea className="form-control no-border" rows="5" value={this.props.order.product.category ? this.props.order.product.category.scope : ""} disabled></textarea>
                    </div>

                    <h3 className="voffset60">用户信息</h3>
                    <div className="text-center">
                        <img className="center-block img-responsive img-circle user-icon-header voffset10" src={this.props.order.user.head_image_url ? this.props.order.user.head_image_url : this.props.order.user.user_head_image_url}/>

                        <div className="hg-session-header-title voffset5">{this.props.order.user.nick_name ? this.props.order.user.nick_name : this.props.order.user.user_name}</div>
                    </div>
                    {userProfileContent}

                    <h3 className="voffset60">订单信息</h3>
                    <div className="form-group">
                        <label>订单总价(元)</label>
                        <input type="text" className="form-control no-border" placeholder="订单总价" value={priceContent} disabled/>
                    </div>

                    {couponContent}
                    {basicPriceContent}
                    {additionalPriceContent}

                    <div className="form-group">
                        <label>服务地址</label>
                        <textarea className="form-control no-border" rows="2" value={addressContent} disabled></textarea>
                    </div>

                    <div className="form-group">
                        <label>预订时间</label>

                        <div className="row">
                            <div className="col-xs-2"><label className="vcenter34">日期</label></div>
                            <div className="col-xs-10"><input type="text" className="form-control no-border" placeholder="预订日期"
                                                          value={orderDateContent} disabled/></div>
                        </div>
                        <div className="row">
                            <div className="col-xs-2"><label className="vcenter34">时间</label></div>
                            <div className="col-xs-10"><input type="text" className="form-control no-border" placeholder="预定时间"
                                                          value={orderTimeContent} disabled/></div>
                        </div>
                    </div>

                    {remarkContent}

                </div>

                <footer className="footer bg-white">
                    <div className="container">
                        <div className="row text-right">
                            <div className="col-xs-12">
                                <button className="btn btn-hd-blue text-muted" onClick={this._detailTriggerList}>返回</button>
                                {foorterBtn}
                            </div>
                        </div>
                    </div>
                </footer>

            </div>
        );
    },

    _detailTriggerList: function() {
        Actions.detailTriggerOrderList();
    },

    _detailTriggerCode: function() {
        Actions.detailTriggerCode();
    },

    _detailTriggerReject: function() {
        Actions.detailTriggerReject();
    },

    _acceptOrder: function() {
        var newOrder = {
            order_id: this.props.order.order_id,
            status: 'tbserviced',
        }

        Actions.detailAcceptOrder(newOrder);
    }

    //_rejectOrder: function() {
    //    if(confirm('您确定要拒接该订单吗?')) {
    //        var newOrder = {};
    //        newOrder.order_id = this.props.order.order_id;
    //        newOrder.status = 'refund';
    //        newOrder.created_time = this.props.order.created_time;
    //        newOrder.openid = this.props.order.openid;
    //        newOrder.price = this.props.order.price;
    //        newOrder.product = this.props.order.product;
    //
    //        Actions.detailRejectOrder(newOrder)
    //    }
    //
    //},
});

module.exports = app;

