/** @jsx React.DOM */

var React = require('react');
var HidogsConstants = require('../../Common/constants/HidogsConstants');
var AppDispatcher = require('../../Common/dispatcher/AppDispatcher');

var Store = require('../stores/Store');
var Actions = require('../actions/Actions');
var Header = require('./../../Common/components/Header.react.js');

var formatdatetime = require('../../../util/formatdatetime');
var gettbpaidprice = require('../../../util/gettbpaidprice');


var app = React.createClass({

    render: function() {

        var couponListContent = "";
        var today = new Date();
        var dueDate;
        var statusStyle;
        var status;
        if(this.props.couponList.length > 0) {
            var couponListItemContent = [];
            this.props.couponList.forEach(function(item) {
                dueDate = new Date(item.due_date);

                if(dueDate > today) {
                    statusStyle = "label label-success";
                    status = "有效"
                }
                else {
                    statusStyle = "label label-default";
                    status = "已失效"
                }

                couponListItemContent.push(
                    <li>
                        <div className="row text-left voffset15">
                            <div className="grey_text">
                                <div className="col-xs-8 text-left">截止日期: {formatdatetime.formatDate(dueDate)}</div>
                                <div className="col-xs-4 text-right"><span className={statusStyle}>{status}</span></div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-xs-12"><h3 className="voffset10">{item.title}</h3></div>
                        </div>
                        <div className="row">
                            <div className="col-xs-4">优惠码:{item.code}</div>
                            <div className="col-xs-4">类型:{item.type=='once' ? "单次" : "多次"}</div>
                            <div className="col-xs-4">优惠:{gettbpaidprice.cal(1.0,item.off_percentage)*10}折</div>
                        </div>
                        <div className="row">
                            <div className="col-xs-4">总数:{item.number_total}</div>
                            <div className="col-xs-4">领取数:{item.occupied.length}</div>
                            <div className="col-xs-4">使用数:{item.used.length}</div>
                        </div>
                        <hr/>
                    </li>
                );
            })

            couponListContent = <ul className="list-unstyled">
                {couponListItemContent}
            </ul>
        }
        else {
            couponListContent = "暂无优惠码";
        }

        return (
            <div id="react_body">
                <Header subtitle="服务伙伴 - 优惠码管理"></Header>

                <div className="container">
                    {couponListContent}
                </div>

            </div>
        );
    },

});

module.exports = app;

