/** @jsx React.DOM */

var React = require('react');
var HidogsConstants = require('../../Common/constants/HidogsConstants');
var AppDispatcher = require('../../Common/dispatcher/AppDispatcher');

var Store = require('../stores/Store');
var Actions = require('../actions/Actions');

var Header = require('./../../Common/components/Header.react');
var CommentItem = require('./../components/CommentItem.react');

var app = React.createClass({

    componentDidUpdate: function () {
        var wrapperHeight = parseInt($(".hg-carousel-img").css("height"));
        var wrapperWidth = parseInt($(".hg-carousel-img").css("width"));
        var top = 0;

        $(".carousel-inner .item img").each(function() {
            var imageHeight = this.height * (wrapperWidth/this.width);

            if(imageHeight > wrapperHeight) {
                top = ((imageHeight - wrapperHeight) / 2) * -1;
            }
            else {
                top = ((wrapperHeight - imageHeight) / 2) * 1;
            }

            $(this).css({"top": top + 'px' })

        });
    },

    render: function () {

        // product list item
        var productListItemContent = [];
        this.props.productList.forEach(function (item) {

            // handle category
            var categoryContent = "";
            if(item.category && item.category.path_name) {
                var categoryList = item.category.path_name.split(",");
                categoryList.forEach(function(category, index) {
                    if(index > 1) {
                        categoryContent = categoryContent + category + ">";
                    }
                })
                categoryContent = categoryContent.substring(0,categoryContent.length-1) + item.category.name;
            }
            else {
                categoryContent = "未设置服务类别";
            }

            // handle price
            var priceContent = "";
            var smallPrice = 999999999;
            var bigPrice = 0
            item.price.basic.forEach(function(priceItem) {
                var price = parseInt(priceItem.price);

                if(price > bigPrice) {
                    bigPrice = price
                }

                if(price < smallPrice) {
                    smallPrice = price
                }
            });
            if(smallPrice == bigPrice) {
                priceContent = smallPrice;
            }
            else if((smallPrice - bigPrice) == 999999999) {
                priceContent = "未设置"
            }
            else {
                priceContent = smallPrice + '-' + bigPrice;
            }

            productListItemContent.push(
                <li>
                    <div className="row">
                        <div className="col-xs-6 text-left">{categoryContent}</div>
                    </div>
                    <div className="row text-left">
                        <div className="col-xs-9">
                            <h3>{item.title}</h3>
                        </div>
                        <div className="col-xs-3 vcenter56 text-right">
                            <button className="btn btn-hd-blue btn-sm" data-toggle="modal"
                                    data-target="#productDetail" onClick={this._navToProductPage.bind(this, item.product_id)}>查看
                            </button>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-xs-4 text-left vcenter30">¥{priceContent}</div>
                        <div className="col-xs-4 text-center vcenter30">{item.sale_no ? item.sale_no : 0}个用户使用</div>
                        <div className="col-xs-4 text-right">
                        </div>
                    </div>
                    <hr/>
                </li>
            );
        }.bind(this))
        var productListContent = "";
        if(productListItemContent.length > 0) {
            productListContent = <div>
                <div className="row text-center voffset60">
                    <span className="glyphicon glyphicon-briefcase hg-session-header-icon"></span>

                    <div className="hg-session-header-title voffset5">达人服务</div>
                </div>

                <div className="voffset30">
                    <ul className="list-unstyled">
                        {productListItemContent}
                    </ul>
                </div>
            </div>
        }

        var ratingContent = [];
        var certificateItemContent = [];
        var commentItemContent = [];
        if(this.props.vendor.role) {
            this.props.vendor.role.forEach(function(roleItem) {

                // vendor rating
                var starContent = [];
                var starCount = 0;
                if(roleItem.rate && roleItem.rate.no) {
                    starCount = parseInt(roleItem.rate.sum) / parseInt(roleItem.rate.no);
                }
                for(var i = 0; i<5; i++) {
                    if(i<starCount) {
                        starContent.push(<span className="glyphicon glyphicon-star star-yellow"></span>);
                    }
                    else {
                        starContent.push(<span className="glyphicon glyphicon-star-empty star-yellow"></span>);
                    }
                }

                ratingContent.push(<tr>
                    <td className="text-center">{roleItem.name}</td>
                    <td className="hg-td-60pt">
                        {starContent}
                    </td>
                </tr>);

                // vendor certificate
                roleItem.certificate_list.forEach(function(certificateItem) {
                    if(certificateItem.name) {
                        certificateItemContent.push(
                            <tr>
                                <td className="text-center">{certificateItem.name}</td>
                            </tr>
                        );
                    }
                })

                // vendor comment
                if(roleItem.comment) {
                    var commentCreatedTime = new Date(roleItem.comment.created_time);
                    commentItemContent.push(<li>
                        <CommentItem
                            author={roleItem.comment.author.nick_name}
                            createdTime={commentCreatedTime.toLocaleDateString()}
                            star={roleItem.comment.content.rate}
                            authorImage={roleItem.comment.author.head_image_url}
                            content={roleItem.comment.content.text}></CommentItem>
                    </li>);
                }

            })
        }

        var certificateContent = "";
        if(certificateItemContent.length > 0) {
            certificateContent = <div>
                <div className="row text-center voffset60">
                    <span className="glyphicon glyphicon-thumbs-up hg-session-header-icon"></span>

                    <div className="hg-session-header-title voffset5">专业认证</div>
                </div>
                <div className="voffset30">
                    <table className="hg-table">
                        <tbody>
                        {certificateItemContent}
                        <tr>
                            <td></td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>;
        }

        var commentContent = {};
        if(commentItemContent.length > 0) {
            commentContent =
                <div>
                    <div className="row text-center voffset40">
                        <i className="fa fa-commenting-o hg-session-header-icon"></i>

                        <div className="hg-session-header-title voffset5">评论</div>
                    </div>
                    <div className="row voffset15">
                        <div className="container">
                            <ul className="list-unstyled">
                                {commentItemContent}
                            </ul>
                            <div className="text-center">
                                <button className="btn btn-hd-blue btn-sm">更多</button>
                            </div>
                        </div>
                    </div>
                    <hr/>
                </div>;
        }

        // description
        var descriptionContent = "";
        if(this.props.vendor.description) {
            descriptionContent = <div>
                <div className="row text-center voffset60">
                    <span className="glyphicon glyphicon-tag hg-session-header-icon"></span>

                    <div className="hg-session-header-title voffset5">个人简介</div>
                </div>
                <div className="row voffset15">
                    <div className="container">
                        <p>{this.props.vendor.description}</p>
                    </div>
                </div>
                <hr/>
            </div>;
        }

        // vendor image
        var imageContent = "";
        var imageItemContent = [];
        var imageItemPointContent = [];
        if(this.props.vendor.image_url_list) {
            this.props.vendor.image_url_list.forEach(function(item, index){
                if(item.image_url) {
                    if(imageItemContent.length == 0) {
                        imageItemContent.push(<div className="item active hg-carousel-img">
                            <img className="center-block" src={item.image_url}/>
                        </div>);
                        imageItemPointContent.push(<li data-target="#carousel-example-generic" data-slide-to="0" className="active"></li>);
                    }
                    else {
                        imageItemContent.push(<div className="item hg-carousel-img">
                            <img className="center-block" src={item.image_url}/>
                        </div>);
                        imageItemPointContent.push(<li data-target="#carousel-example-generic" data-slide-to={index}></li>);
                    }
                }
            })
        }
        if(imageItemContent.length > 0) {
            imageContent = <div>
                <div className="row text-center voffset60">
                    <i className="fa fa-th-large hg-session-header-icon"></i>

                    <div className="hg-session-header-title voffset5">图片</div>
                </div>
                <div className="row voffset15">
                    <div id="carousel-example-generic" className="carousel slide" data-ride="carousel">
                        <ol className="carousel-indicators">
                            {imageItemPointContent}
                        </ol>

                        <div className="carousel-inner" role="listbox">
                            {imageItemContent}
                        </div>

                        <a className="left carousel-control hg-carousel-btn" href="#carousel-example-generic" role="button"
                           data-slide="prev">
                            <span className="glyphicon glyphicon-chevron-left" aria-hidden="true"></span>
                            <span className="sr-only">Previous</span>
                        </a>
                        <a className="right carousel-control hg-carousel-btn" href="#carousel-example-generic" role="button"
                           data-slide="next">
                            <span className="glyphicon glyphicon-chevron-right" aria-hidden="true"></span>
                            <span className="sr-only">Next</span>
                        </a>
                    </div>
                </div>
            </div>;
        }

        return (
            <div id="react_body">

                <div className="container vendor-bg">
                    <div className="text-center white_text">
                        <h5>Talent</h5>
                        <h2 className="voffset10"><strong>欢宠达人</strong></h2>
                    </div>

                    <div className="voffset25">
                        <img src={this.props.vendor.head_image_url} className="center-block img-responsive img-circle user-icon-header voffset10 white-border"/>
                        <h4 className="text-center">{this.props.vendor.nick_name}</h4>
                    </div>
                </div>

                <Header hgstyle="hg-navbar"></Header>

                <div className="container">
                    <div className="voffset30">
                        <table className="hg-table">
                            <tbody>
                            {ratingContent}
                            <tr>
                                <td></td>
                                <td></td>
                            </tr>
                            </tbody>
                        </table>
                    </div>

                    {commentContent}

                    {certificateContent}

                    {descriptionContent}

                    {imageContent}

                    {productListContent}

                    <footer className="footer">
                        <div className="container">
                            <div className="row">
                                <div className="col-xs-12 text-right">
                                    <button className="btn btn-hd-blue text-muted roffset5">收藏</button>
                                </div>
                            </div>
                        </div>
                    </footer>

                </div>
            </div>
        );
    },

    _navToProductPage: function(productId) {
        window.location = "http://www.hidogs.cn/product/view/userproduct?product="+productId;
    },

});

module.exports = app;

