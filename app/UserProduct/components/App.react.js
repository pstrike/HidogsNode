/** @jsx React.DOM */

var React = require('react');
var HidogsConstants = require('../../Common/constants/HidogsConstants');
var AppDispatcher = require('../../Common/dispatcher/AppDispatcher');

var Store = require('../stores/Store');
var Actions = require('../actions/Actions');
var Constants = require('../constants/Constants');
var Header = require('./../../Common/components/Header.react.js');
var CommentItem = require('./../components/CommentItem.react');
var ExitPolicyModal = require('./../components/ExitPolicyModal.react');

var mapconvertor = require('../../../util/mapconverter');


function getAppState() {
    return {
        product: Store.getProduct(),
        status: Store.getStatus(),
        vendor: Store.getVendor(),
        productMeta: Store.getProductMeta(),
    };
}

var app = React.createClass({

    getInitialState: function () {
        return getAppState();
    },

    componentDidMount: function () {
        Store.addChangeListener(this._onChange);

        var productId = "";
        if (!this.props.productId) {
            productId = $("#react-main-mount").attr("productid");
        }
        else {
            productId = this.props.productId;
        }

        Actions.getProductThenVendorThenMeta(productId);
    },

    componentWillUnmount: function () {
        Store.removeChangeListener(this._onChange);
    },

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
        var commentItemContent = [];
        if(this.state.product.comment_list) {
            if(this.state.product.comment_list.length > 0) {
                this.state.product.comment_list.forEach(function(item, index) {
                    var commentCreatedTime = new Date(item.created_time);

                    if(index == 0){
                        commentItemContent.push(<li>
                            <CommentItem
                                author={item.author.nick_name}
                                createdTime={commentCreatedTime.toLocaleDateString()}
                                star={item.content.rate}
                                authorImage={item.author.head_image_url}
                                content={item.content.text}></CommentItem>
                            <hr/>
                        </li>);
                    }

                })

                commentContent = <div>
                    <div className="row text-center voffset50">
                        <i className="fa fa-commenting-o hg-session-header-icon"></i>

                        <div className="hg-session-header-title voffset5">{this.state.product.comment_list.length}条评价</div>
                    </div>

                    <div className="row voffset15">
                        <div className="container">
                            <ul className="list-unstyled">
                                {commentItemContent}
                            </ul>
                            <div className="text-center">
                                <button className="btn btn-hd-blue">更多</button>
                            </div>
                        </div>
                    </div>

                    <hr/>
                </div>;
            }
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
            var overallSum = 0;
            var overallNo = 0;
            var overallStarCount = 0;

            this.state.vendor.role.forEach(function(item) {
                var starContent = []
                var starCount = 0;
                if(item.rate && item.rate.no) {
                    starCount = parseInt(item.rate.sum) / parseInt(item.rate.no);
                    overallSum += item.rate.sum;
                    overallNo += item.rate.no;
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
                    <td className="text-center">{item.name}</td>
                    <td className="hg-td-60pt">
                        {starContent}
                    </td>
                </tr>);
            })

            overallStarCount = overallSum / overallNo;
            for(var i = 0; i<5; i++) {
                if(i<overallStarCount) {
                    overallStarContent.push(<span className="glyphicon glyphicon-star star-yellow"></span>);
                }
                else {
                    overallStarContent.push(<span className="glyphicon glyphicon-star-empty star-yellow"></span>);
                }
            }
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
        if(this.state.product.status == 'published') {
            footerContent = <footer className="footer">
                <div className="container">
                    <div className="row text-right">
                        <div className="col-xs-12">
                            <button className="btn btn-hd-blue text-muted roffset5">收藏</button>
                            <button className="btn btn-hd-blue text-muted" onClick={this._redirectToOrderCreation.bind(this,this.state.product.product_id)}>预订</button>
                        </div>
                    </div>
                </div>
            </footer>;
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

            default:

        }



        return <div id="react_body">
            <div className="container blue-background-decoration"></div>
            <Header hgstyle="hg-navbar"/>

            {modalContent}

            <div className="container blue-background">
                <div className="page-header text-center hg-pageheader">
                    <h4>{categoryContent}</h4>

                    <h2><strong>{this.state.product.title}</strong></h2>

                    <div className="row text-center">
                        {overallStarContent}
                    </div>
                    <img src={this.state.product.vendor ? this.state.product.vendor.head_image_url : ""}
                         className="center-block img-responsive img-circle user-icon-header voffset10"/>
                    <h4 className="text-center">{this.state.product.vendor ? this.state.product.vendor.vendor_name : ""}</h4>
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

                <div className="row text-center voffset60">
                    <span className="glyphicon glyphicon-time hg-session-header-icon"></span>

                    <div className="hg-session-header-title voffset5">可预订时间</div>
                </div>
                <div className="row voffset15">
                    <div className="container">
                        <table className="hg-table text-center">
                            <tbody>
                            <tr>
                                <td>今天</td>
                                <td>可预订</td>
                            </tr>
                            <tr>
                                <td>明天</td>
                                <td>可预订</td>
                            </tr>
                            <tr>
                                <td>后天</td>
                                <td>可预订</td>
                            </tr>
                            <tr>
                                <td></td>
                                <td></td>
                            </tr>
                            </tbody>
                        </table>
                        <div className="text-center">
                            <button className="btn btn-hd-blue">更多</button>
                        </div>
                    </div>
                </div>

                {showCaseImageC}

                <div className="row text-center voffset60">
                    <i className="fa fa-map-o hg-session-header-icon"></i>

                    <div className="hg-session-header-title voffset5">地点</div>
                </div>
                <div className="row voffset15 text-center">
                    <p>{addressContent}</p>
                    <img className="img-responsive center-block"
                         src={mapURL}/>
                </div>

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

                    <div className="hg-session-header-title voffset5">{this.state.product.vendor ? this.state.product.vendor.vendor_name : ""}</div>
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
        window.location = "http://www.hidogs.cn/vendor/view/vendorpage?vendor="+vendorId;
    },

});

module.exports = app;

