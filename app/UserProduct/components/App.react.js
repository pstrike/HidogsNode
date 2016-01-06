/** @jsx React.DOM */

var React = require('react');
var HidogsConstants = require('../../Common/constants/HidogsConstants');
var AppDispatcher = require('../../Common/dispatcher/AppDispatcher');
var HGStore = require('../../Common/stores/session');
var CommentItem = require('../../Common/components/CommentItem.react');
var RatingStar = require('../../Common/components/RatingStar.react');

var Store = require('../stores/Store');
var Actions = require('../actions/Actions');
var Constants = require('../constants/Constants');
var Header = require('./../../Common/components/Header.react.js');
var ExitPolicyModal = require('./../components/ExitPolicyModal.react');
var CommentList = require('./../components/CommentList.react');
var ProductAvailability = require('./../components/ProductAvailability.react');

var mapconvertor = require('../../../util/mapconverter');
var formatdatetime = require('../../../util/formatdatetime');


function getAppState() {
    return {
        session: HGStore.getSession(),
        product: Store.getProduct(),
        status: Store.getStatus(),
        vendor: Store.getVendor(),
        productMeta: Store.getProductMeta(),
        user: Store.getUser(),
        commentList: Store.getCommentList(),
        availabilityList: Store.getAvailabilityList(),
    };
}

var app = React.createClass({

    getInitialState: function () {
        return getAppState();
    },

    componentDidMount: function () {
        Store.addChangeListener(this._onChange);
        HGStore.addChangeListener(this._onChange);

        var productId = "";
        if (!this.props.productId) {
            productId = $("#react-main-mount").attr("productid");
        }
        else {
            productId = this.props.productId;
        }

        this.props.isUser = $("#react-main-mount").attr("isUser") == "true" ? true : false;
        this.props.genQcode = true; // gen Qcode when fist load

        Actions.getProductThenVendorThenMeta(productId);

        if(this.props.isUser) {
            Actions.getSessionThenUser();
        }
    },

    componentWillUnmount: function () {
        Store.removeChangeListener(this._onChange);
        HGStore.removeChangeListener(this._onChange);
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
        if(this.props.genQcode) {
            $('#qrcode').qrcode({width: 150,height: 150,text: "http://www.hidogs.cn/wechat/auth?destination=001product1view1userproductprecheck?product="+this.state.product.product_id+"_user"});
            this.props.genQcode = false;
        }

    },

    render: function () {

        // product category
        var categoryContent = "";
        if(this.state.product.category && this.state.product.category.path_name) {
            var categoryList = this.state.product.category.path_name.split(",");
            categoryList.forEach(function(category, index) {
                if(index > 1) {
                    categoryContent = categoryContent + category + ">";
                }
            })
            categoryContent = categoryContent.substring(0,categoryContent.length-1) + this.state.product.category.name;
        }
        else {
            categoryContent = "未设置服务类别";
        }

        // product basic price
        var basicPriceContent = [];
        if(this.state.product.price) {
            if(this.state.product.price.basic.length > 0) {
                this.state.product.price.basic.forEach(function(item, index){
                    if(item.price) {
                        if(basicPriceContent.length == 0) {
                            basicPriceContent.push(<tr>
                                <td>{this.state.product.category.name}</td>
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
                    }
                }.bind(this))
            }
            else {
                basicPriceContent.push(<tr>
                    <td>服务价格</td>
                    <td>未设置</td>
                    <td></td>
                </tr>);
            }

        }

        // product additional price
        var additionalPriceContent = [];
        if(this.state.product.price) {
            this.state.product.price.additional.forEach(function(item, index){
                if(item.price) {
                    if(additionalPriceContent.length == 0) {
                        additionalPriceContent.push(<tr>
                            <td>附加服务</td>
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
                }

            })
        }

        // product address
        var addressSectionContent = "";
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
        addressSectionContent = <div>
            <div className="row text-center voffset60">
                <i className="fa fa-map-o hg-session-header-icon"></i>

                <div className="hg-session-header-title voffset5">地点</div>
            </div>
            <div className="row voffset15 text-center">
                <p>{addressContent}</p>
                <img className="img-responsive center-block"
                     src={mapURL}/>
            </div>
        </div>;



        // product feature
        var featureContent = "";
        if(this.state.product.feature) {
            var featureText = this.state.product.feature.replace(/\n/g, "<br/>");

            featureContent = <div>
                <div className="row text-center voffset50">
                    <span className="glyphicon glyphicon-tag hg-session-header-icon"></span>

                    <div className="hg-session-header-title voffset5">特色</div>
                </div>
                <div className="row voffset15">
                    <div className="container" dangerouslySetInnerHTML={{__html: featureText}}></div>
                </div>

            </div>;
        }

        // Product Comment
        var commentContent = {};
        var commentItemContent = "";

        if(this.state.product.comment_show && this.state.product.comment_show.created_time) {
            var commentCreatedTime = new Date(this.state.product.comment_show.created_time);
            commentItemContent = <li>
                <CommentItem
                    author={this.state.product.comment_show.author.nick_name}
                    createdTime={formatdatetime.formatDate(commentCreatedTime)}
                    star={this.state.product.comment_show.content.rate}
                    authorImage={this.state.product.comment_show.author.head_image_url}
                    content={this.state.product.comment_show.content.text}></CommentItem>
            </li>;

            commentContent = <div>
                <div className="row text-center voffset50">
                    <i className="fa fa-commenting-o hg-session-header-icon"></i>

                    <div className="hg-session-header-title voffset5">{this.state.product.rate ? this.state.product.rate.no : 0}条评价</div>
                </div>

                <div className="row voffset15">
                    <div className="container">
                        <ul className="list-unstyled">
                            {commentItemContent}
                        </ul>
                        <div className="text-center">
                            <button className="btn btn-hd-blue" onClick={this._triggerComment}>更多</button>
                        </div>
                    </div>
                </div>

                <hr/>
            </div>;
        }

        // Product Image
        var imageContent = "";
        var imageItemContent = [];
        var imageItemPointContent = [];
        var showCaseImageA = "";
        var showCaseImageB = "";
        var showCaseImageC = "";
        if(this.state.product.image_url_list) {
            if(this.state.product.image_url_list.length > 0) {
                this.state.product.image_url_list.forEach(function(item, index){
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

                    switch (index) {
                        case 0:
                            if(item.image_url) {
                                showCaseImageA = <div className="row">
                                    <img className="img-responsive voffset50 center-block" src={item.image_url}/>
                                </div>;
                            }
                            break;
                        case 1:
                            showCaseImageB = <div className="row">
                                <img className="img-responsive voffset60 center-block" src={item.image_url}/>
                            </div>;
                            break;
                        case 2:
                            showCaseImageC = <div className="row">
                                <img className="img-responsive voffset60 center-block" src={item.image_url}/>
                            </div>;
                            break;
                    }
                })

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
            }
        }

        // hg notice
        var hgNoticeContent = [];
        if(this.state.productMeta.length > 0) {
            hgNoticeContent.push(<tr>
                <td className="text-center">预订须知</td>
                <td className="hg-td-75pt">
                    <div dangerouslySetInnerHTML={{__html: this.state.productMeta[2].value}}></div>
                </td>
            </tr>);
        }

        // product notice
        var vendorNoticeContent = [];
        if(this.state.product.notice) {
            var noticeText = this.state.product.notice.replace(/\n/g, "<br/>");

            vendorNoticeContent.push(<tr>
                <td className="text-center">注意事项</td>
                <td className="hg-td-75pt">
                    <div dangerouslySetInnerHTML={{__html: noticeText}}></div>
                </td>
            </tr>);
        }

        // exit policy
        //var exitPolicyContent = "";
        //if(this.state.productMeta.length > 0) {
        //    exitPolicyContent = this.state.productMeta[1].value;
        //}

        // vendor rating
        var ratingContent = [];
        var overallStarContent = [];
        if(this.state.vendor.role) {
            var overallRate = 0;

            this.state.vendor.role.forEach(function(item) {
                var rate = 0;
                if(item.rate && item.rate.no) {
                    rate = parseFloat(item.rate.sum) / parseFloat(item.rate.no);
                    overallRate += rate;
                }

                ratingContent.push(<tr>
                    <td className="text-center">{item.name}</td>
                    <td className="hg-td-60pt">
                        <RatingStar rate={rate} total="5"></RatingStar>
                    </td>
                </tr>);
            })

            // not use at this moment, as there is only one role
            overallStarContent = <RatingStar rate={overallRate} total="5"></RatingStar>;
        }

        // product rating
        var productRate = 0;
        if(this.state.product.rate && this.state.product.rate.no > 0) {
            productRate = parseFloat(this.state.product.rate.sum) / parseFloat(this.state.product.rate.no);
        }


        // vendor certificate
        var certificateContent = [];
        if(this.state.vendor.role) {
            this.state.vendor.role.forEach(function(roleItem) {
                roleItem.certificate_list.forEach(function(certificateItem) {
                    if(certificateItem.name) {
                        if(certificateContent.length == 0) {
                            certificateContent.push(<tr>
                                <td className="text-center">专业认证</td>
                                <td className="hg-td-60pt">{certificateItem.name}</td>
                            </tr>);
                        }
                        else {
                            certificateContent.push(<tr>
                                <td className="text-center"></td>
                                <td className="hg-td-60pt">{certificateItem.name}</td>
                            </tr>);
                        }
                    }
                })
            })
        }

        // footer
        var footerContent = "";
        var favBtnContent = "";

        if(this.state.product.vendor &&
            this.state.product.vendor.vendor_id &&
            this.state.product.vendor.vendor_id == "hg1") {
            footerContent == "";
        }
        else {
            favBtnContent = <button className="btn btn-hd-blue text-muted roffset5" onClick={this._favProduct.bind(this,this.state.product.product_id)}>收藏</button>;
            if(this.state.user.fav_list) {
                for(var i=0; i<this.state.user.fav_list.product.length; i++) {
                    if(this.state.user.fav_list.product[i] == this.state.product.product_id) {
                        favBtnContent = <button className="btn btn-hd-blue text-muted roffset5" onClick={this._unFavProduct.bind(this,this.state.product.product_id)}>取消收藏</button>;
                        break;
                    }
                }
            }
            if(this.props.isUser && this.state.product.status == 'published') {
                footerContent = <footer className="footer">
                    <div className="container">
                        <div className="row text-right">
                            <div className="col-xs-12">
                                {favBtnContent}
                                <button className="btn btn-hd-blue text-muted" onClick={this._redirectToOrderCreation.bind(this,this.state.product.product_id)}>预订</button>
                            </div>
                        </div>
                    </div>
                </footer>;
            }
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

        // is on site
        var isOnSiteStatus = "";
        if(this.state.product.tag_list) {
            for(var i=0; i<this.state.product.tag_list.length; i++) {
                if(this.state.product.tag_list[i] == "上门服务") {
                    isOnSiteStatus = <span className="label btn-hd-blue btn-hd-active">上门服务</span>;
                    addressSectionContent = "";
                    break;
                }
            }
        }

        // availability
        var availabilityItem = [];
        var isAvailable = false;
        var dateText = "";
        if(this.state.availabilityList.length > 0) {
            for(var i=0; i<3; i++) {
                switch (i) {
                    case 0:
                        dateText = "今天";
                        break;

                    case 1:
                        dateText = "明天";
                        break;

                    case 2:
                        dateText = "后天";
                        break;
                }

                this.state.availabilityList[i].timeslot.forEach(function(timeslot) {
                    if(timeslot.isAvailable) {
                        isAvailable = true;
                    }
                })

                if(isAvailable) {
                    availabilityItem.push(
                        <tr>
                            <td>{dateText}</td>
                            <td>可预订</td>
                        </tr>
                    );
                }
                else {
                    availabilityItem.push(
                        <tr>
                            <td>{dateText}</td>
                            <td>已订满</td>
                        </tr>
                    );
                }

                isAvailable = false; // reset
            }
        }
        var availabilityContent = "";
        if(availabilityItem.length > 0) {
            availabilityContent = <div>
                <div className="row text-center voffset60">
                    <span className="glyphicon glyphicon-time hg-session-header-icon"></span>

                    <div className="hg-session-header-title voffset5">可预订时间</div>
                </div>
                <div className="row voffset15">
                    <div className="container">
                        <table className="hg-table text-center">
                            <tbody>
                            {availabilityItem}
                            <tr>
                                <td></td>
                                <td></td>
                            </tr>
                            </tbody>
                        </table>
                        <div className="text-center">
                            <button className="btn btn-hd-blue" onClick={this._triggerAvailability}>更多</button>
                        </div>
                    </div>
                </div>
            </div>
        }

        var modalContent = [];
        switch (this.state.status) {
            case Constants.STATE_PRODUCT:
                //no modal
                break;

            case Constants.STATE_EXIT_POLICY:
                if(this.state.productMeta.length>0) {
                    modalContent.push(<ExitPolicyModal content={this.state.productMeta[1].value}></ExitPolicyModal>);
                }
                break;

            case Constants.STATE_COMMENT:
                modalContent.push(<CommentList commentList={this.state.commentList}></CommentList>);
                break;

            case Constants.STATE_AVAILABILITY:
                modalContent.push(<ProductAvailability availabilityList={this.state.availabilityList}></ProductAvailability>);
                break;

            default:

        }

        return <div id="react_body">
            <div className="container blue-background-decoration"></div>
            <Header hgstyle="hg-navbar"/>

            {modalContent}

            <div className="container blue-background">
                <div className="page-header text-center hg-pageheader">
                    {isOnSiteStatus}
                    <h4>{categoryContent}</h4>

                    <div className="row text-center">
                        <RatingStar rate={productRate} total="5"></RatingStar>
                    </div>

                    <h2 className="voffset0"><strong>{this.state.product.title}</strong></h2>

                    <img src={this.state.product.vendor ? this.state.product.vendor.head_image_url : ""}
                         className="center-block img-responsive img-circle user-icon-header voffset10"/>
                    <h4 className="text-center voffset5">{this.state.product.vendor ? this.state.product.vendor.nick_name : ""}</h4>
                </div>

                <hr/>

                {commentContent}

                {featureContent}

                {showCaseImageA}


                <div className="row text-center voffset60">
                    <i className="fa fa-jpy hg-session-header-icon"></i>

                    <div className="hg-session-header-title voffset5">价格</div>
                </div>
                <div className="row voffset15">
                    <div className="container">
                        <table className="hg-table text-left">
                            <tbody>
                            {basicPriceContent}
                            {additionalPriceContent}
                            <tr>
                                <td></td>
                                <td></td>
                                <td></td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                {showCaseImageB}

                {availabilityContent}

                {showCaseImageC}

                {addressSectionContent}

                <div className="row text-center voffset60">
                    <span className="glyphicon glyphicon-info-sign hg-session-header-icon"></span>

                    <div className="hg-session-header-title voffset5">服务详情</div>
                </div>
                <div className="row voffset15">
                    <div className="container">
                        <table className="hg-table">
                            <tbody>
                            <tr>
                                <td className="text-center">服务时长</td>
                                <td className="hg-td-75pt">{this.state.product.duration ? this.state.product.duration + "分钟" : ""}</td>
                            </tr>
                            <tr>
                                <td className="text-center">服务范围</td>
                                <td className="hg-td-75pt">{this.state.product.category ? this.state.product.category.scope : ""}</td>
                            </tr>
                            {vendorNoticeContent}
                            {hgNoticeContent}
                            <tr>
                                <td className="text-center">退订政策</td>
                                <td className="hg-td-75pt">
                                    <span className="roffset5">查看退订政策具体内容</span>
                                    <button className="btn btn-hd-blue" onClick={this._onCheckExitPolicy}>查看</button>
                                </td>
                            </tr>
                            <tr>
                                <td className="text-center"></td>
                                <td className="hg-td-75pt"></td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                {imageContent}

                <div className="row text-center voffset60">
                    <img src={this.state.product.vendor ? this.state.product.vendor.head_image_url : ""} className="center-block img-responsive img-circle user-icon-header voffset10"/>

                    <div className="hg-session-header-title voffset5">{this.state.product.vendor ? this.state.product.vendor.nick_name : ""}</div>
                </div>
                <div className="row voffset30">
                    <div className="container">
                        <table className="hg-table">
                            <tbody>
                            {ratingContent}
                            {certificateContent}
                            <tr>
                                <td className="text-center"></td>
                                <td className="hg-td-60pt"></td>
                            </tr>
                            </tbody>
                        </table>
                        <div className="text-center voffset15">
                            <button className="btn btn-hd-blue" onClick={this._navToVendorPage.bind(this,this.state.product.vendor ? this.state.product.vendor.vendor_id : "")}>查看详情</button>
                        </div>
                    </div>
                </div>

                {qCodeContent}

            </div>

            {footerContent}
        </div>;
    },

    _onChange: function () {
        this.setState(getAppState());
    },

    _redirectToOrderCreation: function (productId) {
        Actions.redirectToOrderCreation(productId);
    },

    _onCheckExitPolicy: function() {
        Actions.triggerProductToExitPolicy();
    },

    _navToVendorPage: function(vendorId) {
        window.location = "http://www.hidogs.cn/vendor/view/vendorpageprecheck?vendor="+vendorId;
    },

    _favProduct: function(productId) {
        var newUser = this.state.user;
        if(!newUser.fav_list) {
            newUser.fav_list = {
                product: [],
                vendor: [],
            }
        }
        newUser.fav_list.product.push(productId);
        console.log(newUser);
        Actions.updateUserFav(newUser);
    },

    _unFavProduct: function(productId) {
        var newUser = this.state.user;

        for(var i=0; i<this.state.user.fav_list.product.length; i++) {
            if(this.state.user.fav_list.product[i] == this.state.product.product_id) {
                newUser.fav_list.product.splice(i, 1);
                break;
            }
        }
        Actions.updateUserFav(newUser);
    },

    _triggerComment: function() {
        Actions.triggerProductToComment(this.state.product.product_id);
    },

    _triggerAvailability: function() {
        Actions.triggerProductToAvailability();
    },

});

module.exports = app;

