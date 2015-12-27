/** @jsx React.DOM */

var React = require('react');
var HidogsConstants = require('../../Common/constants/HidogsConstants');
var AppDispatcher = require('../../Common/dispatcher/AppDispatcher');

var Store = require('../stores/Store');
var Actions = require('../actions/Actions');

var GenOrderNo = require('../../../util/genorderno');
var mapconvertor = require('../../../util/mapconverter');
var gettbpaidprice = require('../../../util/gettbpaidprice');
var formatdatetime = require('../../../util/formatdatetime');

var app = React.createClass({

    componentDidUpdate: function() {
        // if pay btn is disable, enable it when page re-render
        if ($('#paybtn').attr('disabled') == 'disabled') {

            $('#paybtn').text('支付');
            $('#paybtn').removeAttr('disabled');
        };

        // if pay btn is disable, reschedule btn is also disable, so enable it
        $('#rescheduleBtn').removeAttr('disabled');
    },

    render: function() {

        var tint = "";
        var status = "";
        var icon = "";
        var orderCodeContent = "";
        var footerBtnContent = [];
        var footerLeftBtnContent = [];
        var rejectReasonContent = "";
        var vendorMobileContent = <div>
            <span className="glyphicon glyphicon-earphone"></span>
            {this.props.vendor.mobile ? this.props.vendor.mobile : ""}
        </div>;

        switch (this.props.order.status) {
            case "tbpaid":
                status = "待支付";
                tint = "hg-yellow-section";
                icon = <span className="glyphicon glyphicon-jpy"></span>;
                vendorMobileContent = "";
                footerLeftBtnContent.push(<button className="btn btn-hd-blue text-muted roffset5" onClick={this._cancelOrder}>取消订单</button>);
                if(this.props.order.tmp_show_reschedule_btn) {
                    footerBtnContent.push(<button id='rescheduleBtn' className="btn btn-hd-blue text-muted" onClick={this._reschedule}>调整预订时间</button>);
                }
                else {
                    footerBtnContent.push(<button id="paybtn" className="btn btn-hd-blue text-muted" onClick={this._payOrder}>支付</button>);
                }
                break;

            case "tbconfirmed":
                status = "待使用";
                tint = "hg-green-section";
                icon = <span className="glyphicon glyphicon-ok"></span>;
                footerLeftBtnContent.push(<button className="btn btn-hd-blue text-muted roffset5" onClick={this._refundOrder}>申请退款</button>);
                orderCodeContent = <div>
                    <hr className="voffset30"/>

                    <div className="row text-center voffset30">
                        <span className="glyphicon glyphicon-tag hg-session-header-icon"></span>
                        <div className="hg-session-header-title">订单使用码</div>
                    </div>
                    <table className="hg-table voffset15">
                        <tbody>
                        <tr>
                            <td>
                                <strong>{this.props.order.order_id.substring(0,8)}</strong><br/>
                                <i><small>(使用服务时,请向达人出示该使用码.请勿在其它场合泄漏.)</small></i>
                            </td>
                        </tr>
                        <tr>
                            <td></td>
                        </tr>

                        </tbody>
                    </table>
                </div>;
                break;

            case "tbserviced":
                status = "待使用";
                tint = "hg-green-section";
                icon = <span className="glyphicon glyphicon-ok"></span>;
                footerLeftBtnContent.push(<button className="btn btn-hd-blue text-muted roffset5" onClick={this._refundOrder}>申请退款</button>);
                orderCodeContent = <div>
                    <hr className="voffset30"/>

                    <div className="row text-center voffset30">
                        <span className="glyphicon glyphicon-tag hg-session-header-icon"></span>
                        <div className="hg-session-header-title">订单使用码</div>
                    </div>
                    <table className="hg-table voffset15">
                        <tbody>
                        <tr>
                            <td>
                                <strong>{this.props.order.order_id.substring(0,8)}</strong><br/>
                                <i><small>(使用服务时,请向达人出示该使用码.请勿在其它场合泄漏.)</small></i>
                            </td>
                        </tr>
                        <tr>
                            <td></td>
                        </tr>

                        </tbody>
                    </table>
                </div>

                break;

            case "tbcommented":
                status = "待评价";
                tint = "hg-orange-section";
                icon = <span className="glyphicon glyphicon-comment"></span>;
                footerBtnContent.push(<button className="btn btn-hd-blue text-muted" onClick={this._comment}>评论</button>);
                break;

            case "completed":
                status = "完成";
                tint = "hg-blue-section";
                icon = <span className="glyphicon glyphicon-stop"></span>;
                break;

            case "cancelled":
                status = "取消";
                vendorMobileContent = "";
                icon = <span className="glyphicon glyphicon-remove"></span>;
                break;

            case "refund":
                status = "退款中";
                vendorMobileContent = "";
                tint = "hg-red-section";
                icon = <span className="glyphicon glyphicon-refresh"></span>;

                if(this.props.order.reject_reason) {
                    rejectReasonContent = <div>
                        <small><i>由于达人无法在预订时间内提供服务,该订单转入退款流程</i></small><br/>
                        <small><i>具体原因为: {this.props.order.reject_reason}</i></small>
                    </div>;
                }

                break;
        }
        var tintStyle = "text-center " + tint;
        var footerStyle = "footer "+ tint;

        // product category
        var categoryContent = "";
        var categoryList = this.props.order.product.product_category.path_name.split(",");
        categoryList.forEach(function(category, index) {
            if(index > 1) {
                categoryContent = categoryContent + category + ">";
            }
        })
        categoryContent = categoryContent.substring(0,categoryContent.length-1) + this.props.order.product.product_category.name;

        // order basic price
        var basicPriceContent = [];
        this.props.order.price.basic.forEach(function(item, index){
            if(index == 0) {
                basicPriceContent.push(<tr>
                    <td>{this.props.order.product.product_category.name}</td>
                    <td>{item.name}</td>
                    <td>{item.price}元</td>
                </tr>);
            }
            else {
                basicPriceContent.push(<tr>
                    <td></td>
                    <td>{item.name}</td>
                    <td>{item.price}元</td>
                </tr>);
            }
        }.bind(this))

        // order additional price
        var additionalPriceContent = [];
        this.props.order.price.additional.forEach(function(item, index){
            if(index == 0) {
                additionalPriceContent.push(<tr>
                    <td>附加项目</td>
                    <td>{item.name}</td>
                    <td>{item.price}元</td>
                </tr>);
            }
            else {
                additionalPriceContent.push(<tr>
                    <td></td>
                    <td>{item.name}</td>
                    <td>{item.price}元</td>
                </tr>);
            }
        }.bind(this))

        // Order Date
        var orderDate = new Date(this.props.order.booked_time.booked_date);
        var orderStartTime = new Date(this.props.order.booked_time.start_time);
        var orderEndTime = new Date(this.props.order.booked_time.end_time);
        var bookedTimeContent = formatdatetime.formatDate(orderDate) + " "
                                + formatdatetime.formatTime(orderStartTime)
                                + "-"
                                + formatdatetime.formatTime(orderEndTime);

        // product address
        var addressContent = "";
        var mapURL = "";
        if(this.props.order.address) {
            addressContent = (this.props.order.address.city ? this.props.order.address.city : "") +
                (this.props.order.address.district ? this.props.order.address.district : "") +
                (this.props.order.address.street ? this.props.order.address.street : "") +
                (this.props.order.address.business ? this.props.order.address.business : "") +
                (this.props.order.address.additional ? this.props.order.address.additional : "");

            var bdPoint = mapconvertor.gcj02tobd09(this.props.order.location.coordinates[0], this.props.order.location.coordinates[1])

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

        // Order Vendor
        var vendorRoleContent = [];
        var vendorRoleSummaryContent = [];
        if(this.props.vendor.role) {
            var roleCount = 0;
            var totalRate = 0;

            this.props.vendor.role.forEach(function(item) {
                roleCount++;
                totalRate += parseInt(item.rate ? item.rate : 0);

                var starContent = [];
                var starCount = parseInt(item.rate ? item.rate : 0);
                for(var i = 0; i<5; i++) {
                    if(i<starCount) {
                        starContent.push(<span className="glyphicon glyphicon-star star-yellow"></span>);
                    }
                    else {
                        starContent.push(<span className="glyphicon glyphicon-star-empty star-yellow"></span>);
                    }
                }

                vendorRoleContent.push(<tr>
                    <td className="text-center">{item.name}</td>
                    <td className="hg-td-60pt">
                        {starContent}
                    </td>
                </tr>);
            })

            var summaryStarContent = [];
            var summaryStarCount = parseInt(totalRate / roleCount);
            for(var i = 0; i<5; i++) {
                if(i<summaryStarCount) {
                    summaryStarContent.push(<span className="glyphicon glyphicon-star star-yellow"></span>);
                }
                else {
                    summaryStarContent.push(<span className="glyphicon glyphicon-star-empty star-yellow"></span>);
                }
            }
            vendorRoleSummaryContent.push(<tr>
                <td className="text-center">综合</td>
                <td className="hg-td-60pt">
                    {summaryStarContent}
                </td>
            </tr>);
        }

        // Product Comment
        var productCommentContent = "";
        if (this.props.order.comment) {
            var comment = this.props.order.comment;
            var comment_created_time = new Date(comment.created_time);

            var starContent = [];
            var starCount = parseInt(comment.content.rate);
            for (var i = 0; i < 5; i++) {
                if (i < starCount) {
                    starContent.push(<span className="glyphicon glyphicon-star star-yellow"></span>);
                }
                else {
                    starContent.push(<span className="glyphicon glyphicon-star-empty star-yellow"></span>);
                }
            }

            productCommentContent = <div>
                <div className="row text-center voffset30">
                    <i className="fa fa-commenting-o hg-session-header-icon"></i>

                    <div className="hg-session-header-title voffset5">我的评论</div>
                </div>

                <div className="row voffset15">
                    <div className="container">

                        <div className="row">
                            <div className="col-xs-3 text-center">
                                <img className="user-icon-small img-circle"
                                     src={comment.author.head_image_url}/>

                                <p>{comment.author.nick_name}</p>
                            </div>
                            <div className="col-xs-9">
                                <div className="row">
                                    <div className="col-xs-6 text-left">
                                        {starContent}
                                    </div>
                                    <div
                                        className="col-xs-6 text-right">{comment_created_time.toLocaleDateString()}</div>
                                </div>
                                <div className="row">
                                    <div className="col-xs-12 text-left">
                                        <p>{comment.content.text ? comment.content.text : "无评论"}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>;
        }

        // Coupon
        var couponContent = "";
        if(this.props.order.price.coupon && this.props.order.price.coupon.title) {
                couponContent = <tr>
                    <td>优惠码</td>
                    <td colSpan="2">{this.props.order.price.coupon.title}</td>
                </tr>;
        }

        // On Site Flag
        var onSiteFlag = "";
        if(this.props.order.isOnSite) {
            onSiteFlag = <span className="label hg-label">上门服务</span>;
        }

        return (
            <div className="container">
                <div className={tintStyle}>
                    <h4>订单详情</h4>

                    <h2 className="voffset10"><strong>{icon} {status}</strong></h2>

                    {rejectReasonContent}

                    <hr className="voffset30"/>

                    <span className="glyphicon glyphicon-certificate hg-session-header-icon"></span>

                    <div className="hg-session-header-title">服务项目</div>
                    <h3>{this.props.order.product.product_title}</h3>

                    <p>{categoryContent} {onSiteFlag}</p>
                    <table className="hg-table text-left voffset15">
                        <tbody>
                        <tr>
                            <td>服务范围</td>
                            <td className="hg-td-75pt">{this.props.product.category ? this.props.product.category.scope : ""}</td>
                        </tr>
                        <tr>
                            <td></td>
                            <td className="hg-td-75pt"></td>
                        </tr>
                        </tbody>
                    </table>

                    <button className="btn btn-hd-blue btn-long voffset15">查看</button>

                    <hr className="voffset30"/>

                    <div className="row text-center">
                        <img src={this.props.vendor.head_image_url ? this.props.vendor.head_image_url : ""}
                             className="center-block img-responsive img-circle user-icon-header voffset10"/>

                        <div
                            className="hg-session-header-title voffset5">{this.props.vendor.nick_name ? this.props.vendor.nick_name : ""}</div>
                        <div className="hg-session-header-title">
                            {vendorMobileContent}
                        </div>
                    </div>
                    <div className="row voffset30">
                        <div className="container">
                            <table className="hg-table">
                                <tbody>
                                {vendorRoleSummaryContent}
                                {vendorRoleContent}
                                <tr>
                                    <td className="text-center">专业认证</td>
                                    <td className="hg-td-60pt">CKU A级美容师</td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td></td>
                                </tr>
                                </tbody>
                            </table>
                            <div className="text-center voffset15">
                                <button className="btn btn-hd-blue btn-long">查看</button>
                            </div>
                        </div>
                    </div>

                    <hr className="voffset30"/>

                    <div className="row text-center voffset30">
                        <span className="glyphicon glyphicon-info-sign hg-session-header-icon"></span>

                        <div className="hg-session-header-title voffset5">订单信息</div>
                    </div>
                    <div className="row voffset15">
                        <div className="container">
                            <p>订单价格: {this.props.order.price.total - this.props.order.price.discount}元 {this.props.order.price.discount > 0 ? "(总价"+this.props.order.price.total+", 使用优惠码优惠"+this.props.order.price.discount+"元)" : ""}</p>
                            <table className="hg-table">
                                <tbody>
                                <tr>
                                    <td>订单号</td>
                                    <td colSpan="2">{GenOrderNo.orderno(this.props.order.order_id, this.props.order.created_time)}</td>
                                </tr>
                                {couponContent}
                                {basicPriceContent}
                                {additionalPriceContent}
                                <tr>
                                    <td>预订时间</td>
                                    <td colSpan="2">{bookedTimeContent}</td>
                                </tr>
                                <tr>
                                    <td>服务地点</td>
                                    <td colSpan="2" className="hg-td-75pt">{addressContent}</td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                </tr>

                                </tbody>
                            </table>

                            <img className="img-responsive center-block"
                                 src={mapURL}/>
                        </div>
                    </div>

                    {orderCodeContent}

                    {productCommentContent}

                </div>

                <footer className={footerStyle}>
                    <div className="container">
                        <div className="row">
                            <div className="col-xs-4 text-left">
                                {footerLeftBtnContent}
                            </div>
                            <div className="col-xs-8 text-right">
                                <button className="btn btn-hd-blue text-muted roffset5" onClick={this._detailTrigerOrderList}>返回</button>
                                {footerBtnContent}
                            </div>
                        </div>
                    </div>
                </footer>

            </div>
        );
    },

    _detailTrigerOrderList: function() {
        Actions.triggerOrderList();
    },

    _payOrder: function() {
        // disable pay btn after click once
        $('#paybtn').text('稍等');
        $('#paybtn').attr('disabled', 'true');

        Actions.payOrder(this.props.order, this.props.order.openid);
    },

    _reschedule: function() {
        Actions.rechedule();
    },

    _comment: function() {
        Actions.comment();
    },

    _cancelOrder: function() {
        if(confirm("您确定要取消该订单吗?")) {
            var newOrder = {};
            newOrder.order_id = this.props.order.order_id;
            newOrder.status = "cancelled";
            newOrder.created_time = this.props.order.created_time;
            newOrder.openid = this.props.order.openid;
            newOrder.price = this.props.order.price;
            newOrder.product = this.props.order.product;

            Actions.cancelOrder(newOrder);
        }

    },

    _refundOrder: function() {
        if(confirm("您确定要申请退款吗?")) {
            Actions.refundOrder();
        }

    },

});

module.exports = app;

