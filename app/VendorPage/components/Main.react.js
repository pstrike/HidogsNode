/** @jsx React.DOM */

var React = require('react');
var HidogsConstants = require('../../Common/constants/HidogsConstants');
var AppDispatcher = require('../../Common/dispatcher/AppDispatcher');

var Store = require('../stores/Store');
var Actions = require('../actions/Actions');

var Header = require('./../../Common/components/Header.react');
var CommentItem = require('./../components/CommentItem.react');

var mapconvertor = require('../../../util/mapconverter');

var app = React.createClass({

    getInitialState: function() {
        return {
            genQcode: true,
        };
    },

    componentDidUpdate: function () {

        // carousel image position
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

         // qr code

        if(this.state.genQcode) {
            $('#qrcode').qrcode({width: 150,height: 150,text: "http://www.hidogs.cn/wechat/auth?destination=001vendor1view1vendorpageprecheck?vendor="+this.props.vendor.vendor_id+"_user"});
            this.state.genQcode = false;
        }
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
                if(roleItem.rate && roleItem.rate.no && roleItem.rate.no > 0) {
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
                if(roleItem.comment && roleItem.comment.created_time) {
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

        // Address
        var addressContent = "";
        var mapURL = "";
        if(this.props.vendor.address) {
            addressContent = (this.props.vendor.address.city ? this.props.vendor.address.city : "") +
                (this.props.vendor.address.district ? this.props.vendor.address.district : "") +
                (this.props.vendor.address.street ? this.props.vendor.address.street : "") +
                (this.props.vendor.address.business ? this.props.vendor.address.business : "");

            var bdPoint = mapconvertor.gcj02tobd09(this.props.vendor.location.coordinates[0], this.props.vendor.location.coordinates[1])

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

        // vendor bg image
        var vendorBG = "container vendor-bg-1";
        if(this.props.vendor.gender == 1) {
            var vendorBG = "container vendor-bg-2";
        }

        // qr code
        var qCodeContent = "";
        if(!this.props.isUser) {
            qCodeContent = <div className="text-center">
                <div className="voffset60" id="qrcode"></div>
                <h2 className="voffset10">欢宠</h2>
                <span className="text-center voffset10">通过微信扫描以上二维码即可预约服务</span>
            </div>;
        }

        // footer
        var footerContent = "";
        var favBtnContent = <button className="btn btn-hd-blue text-muted roffset5" onClick={this._favProduct.bind(this,this.props.vendor.vendor_id)}>收藏</button>;
        if(this.props.user.fav_list) {
            for(var i=0; i<this.props.user.fav_list.vendor.length; i++) {
                if(this.props.user.fav_list.vendor[i] == this.props.vendor.vendor_id) {
                    favBtnContent = <button className="btn btn-hd-blue text-muted roffset5" onClick={this._unFavProduct}>取消收藏</button>;
                    break;
                }
            }
        }
        if(this.props.isUser) {
            footerContent = <footer className="footer">
                <div className="container">
                    <div className="row">
                        <div className="col-xs-12 text-right">
                            {favBtnContent}
                        </div>
                    </div>
                </div>
            </footer>;
        }

        return (
            <div id="react_body">

                <div className={vendorBG}>
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

                    <div className="row text-center voffset60">
                        <i className="fa fa-map-o hg-session-header-icon"></i>
                        <div className="hg-session-header-title voffset5">服务地址</div>
                    </div>
                    <div className="row voffset15 text-center">
                        <p>{addressContent}</p>
                        <img className="img-responsive center-block"
                             src={mapURL}/>
                    </div>

                    {productListContent}

                    {qCodeContent}

                    {footerContent}

                </div>
            </div>
        );
    },

    _navToProductPage: function(productId) {
        window.location = "http://www.hidogs.cn/product/view/userproductprecheck?product="+productId;
    },

    _favProduct: function(vendorId) {
        var newUser = this.props.user;
        if(!newUser.fav_list) {
            newUser.fav_list = {
                product: [],
                vendor: [],
            }
        }
        newUser.fav_list.vendor.push(vendorId);

        Actions.updateUserFav(newUser);
    },

    _unFavProduct: function() {
        var newUser = this.props.user;

        for(var i=0; i<this.props.user.fav_list.vendor.length; i++) {
            if(this.props.user.fav_list.vendor[i] == this.props.vendor.vendor_id) {
                newUser.fav_list.vendor.splice(i, 1);
                break;
            }
        }
        Actions.updateUserFav(newUser);
    },

});

module.exports = app;

