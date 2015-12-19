/** @jsx React.DOM */

var React = require('react');
var HidogsConstants = require('../../Common/constants/HidogsConstants');
var AppDispatcher = require('../../Common/dispatcher/AppDispatcher');

var Store = require('../stores/Store');
var Actions = require('../actions/Actions');


var app = React.createClass({

    getInitialState: function() {
        return {
            comment: {
                author: {
                    user_id: "",
                    nick_name: "",
                    head_image_url: "",
                },
                content: {
                    text: "",
                    rate: "",
                },
                created_time: "",
            },
        };
    },

    componentDidMount: function() {
        // init star btn
        var tabs = $('.star-comment');

        tabs.click(function() {
            tabs.removeClass('glyphicon-star');
            tabs.removeClass('glyphicon-star-empty');
            var el = $(this);


            var starNo = parseInt(el.attr('id').substring(4,5));

            for(var i=0; i<5; i++) {
                var starId = "#star" + (i+1);

                if(i > starNo-1) {
                    $(starId).addClass('glyphicon-star-empty');
                }
                else {
                    $(starId).addClass('glyphicon-star');
                }

            }
        })
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
                        <h4>Comment</h4>
                        <h2 className="voffset10"><strong>评论服务</strong></h2>
                    </div>

                    <hr/>

                    <div className="form-group">
                        <label>您会给服务几颗星?(越多星代表越满意)</label>
                        <div className="row voffset15">
                            <div className="col-xs-offset-1 col-xs-2"><span id="star1" className="glyphicon glyphicon-star-empty star-yellow star-comment text-center" aria-hidden="true" onClick={this._handleChange}></span></div>
                            <div className="col-xs-2"><span id="star2" className="glyphicon glyphicon-star-empty star-yellow star-comment text-center" aria-hidden="true" onClick={this._handleChange}></span></div>
                            <div className="col-xs-2"><span id="star3" className="glyphicon glyphicon-star-empty star-yellow star-comment text-center" aria-hidden="true" onClick={this._handleChange}></span></div>
                            <div className="col-xs-2"><span id="star4" className="glyphicon glyphicon-star-empty star-yellow star-comment text-center" aria-hidden="true" onClick={this._handleChange}></span></div>
                            <div className="col-xs-2"><span id="star5" className="glyphicon glyphicon-star-empty star-yellow star-comment text-center" aria-hidden="true" onClick={this._handleChange}></span></div>
                        </div>
                    </div>

                    <div className="form-group voffset30">
                        <label>描述您的服务体验可以帮助其它用户更好的选择服务?</label>
                        <textarea className="form-control simple-input" rows="5" ref="commentContent"></textarea>
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

    _handleChange: function(event) {
        this.state.comment.content.rate = event.target.id.substring(4,5);
    },

    _submit: function() {
        var verifyMsg = this._verify();

        if(verifyMsg.length == 0) {
            this.state.comment.content.text = this.refs["commentContent"].getDOMNode().value;
            this.state.comment.author.user_id = this.props.session.user_id;
            this.state.comment.author.nick_name = this.props.session.nick_name;
            this.state.comment.author.head_image_url = this.props.session.head_image_url;
            this.state.comment.created_time = new Date();

            var newProduct = {};
            newProduct.product_id = this.props.product.product_id;
            newProduct.comment_list = (this.props.product.comment_list ? this.props.product.comment_list : []);
            newProduct.comment_list.push(this.state.comment);
            newProduct.comment_show = this.state.comment;
            newProduct.rate = {};
            if(this.props.product.rate) {
                newProduct.rate.sum = (this.props.product.rate.sum ? this.props.product.rate.sum : 0)+ parseInt(this.state.comment.content.rate);
                newProduct.rate.no = this.props.product.rate.no + 1;
            }
            else {
                newProduct.rate.sum = parseInt(this.state.comment.content.rate);
                newProduct.rate.no = 1;
            }

            var newOrder = {};
            newOrder.order_id = this.props.order.order_id;
            newOrder.status = "completed";
            newOrder.commented_time = new Date();
            newOrder.comment = this.state.comment;
            newOrder.created_time = this.props.order.created_time;
            newOrder.openid = this.props.order.openid;
            newOrder.price = this.props.order.price;
            newOrder.product = this.props.order.product;

            var newVendor = {};
            newVendor.vendor_id = this.props.vendor.vendor_id;
            newVendor.role = this.props.vendor.role;
            for(var i=0; i<newVendor.role.length; i++) {
                if(this.props.product.category.path_slug.indexOf(newVendor.role[i].slug) > 0) {
                    newVendor.role[i].comment = this.state.comment;

                    if(!newVendor.role[i].rate) {
                        newVendor.role[i].rate = {};
                    }

                    newVendor.role[i].rate.sum = parseInt(newVendor.role[i].rate.sum ? newVendor.role[i].rate.sum : 0) + parseInt(this.state.comment.content.rate);
                    newVendor.role[i].rate.no = parseInt(newVendor.role[i].rate.no ? newVendor.role[i].rate.no : 0) + 1;
                    break;
                }
            };

            Actions.submitCommentTriggerDetail(newProduct, newOrder, newVendor);
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
        Actions.cancelCommentTriggerDetail();
    },

    _verify: function() {
        var verifyMsg = [];

        if(!this.state.comment.content.rate) {
            verifyMsg.push("-请您为服务评分以帮助我们提高服务质量");
        }

        return verifyMsg;
    },

});

module.exports = app;

