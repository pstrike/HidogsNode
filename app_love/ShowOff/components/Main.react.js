/** @jsx React.DOM */

var React = require('react');

var Store = require('../stores/Store');
var Actions = require('../actions/Actions');
var Header = require('./../../../app/Common/components/Header.react.js');

var Statement = require('../constants/Statement');

var app = React.createClass({

    componentDidMount: function () {
        // expand image height
        var imageHeight = parseInt($(window).height()) - 119 - 50 - 110;
        $('.love-img-container').css({"height": imageHeight + 'px' });
    },

    componentDidUpdate: function () {
        // init wallop
        if(this.props.user.pet && this.props.user.pet.image_url_list.length > 0) {
            this.props.user.pet.image_url_list.forEach(function(url, index) {
                $(".love-img1"+(index+1)).css("background-image","url("+this.props.user.pet.image_url_list[index]+")");
            }.bind(this))
        }
    },

    render: function() {

        var isVisitorPetOwner = false;
        if(this.props.visitor.pet && this.props.visitor.pet.name) {
            isVisitorPetOwner = true;
        }

        var footerInfo = <div className="col-xs-7">
            <div className="voffset15"></div>
            <div className="text-left">
                <span className="roffset15">被追求<span className="big-text">{this.props.user.love ? this.props.user.love.love_me.length : 0}</span>次</span>
                <span><span className="big-text">{this.props.user.love ? this.props.user.love.support.length : 0}</span>人支持</span>
            </div>
            <div className="voffset5 text-left"><small>颜值打败了<span className="big-text-20">{this.props.user.ranking ? parseInt(this.props.user.ranking*100) : 0}%</span>的单身狗</small></div>
        </div>;

        var footerBtn = "";

        if(isVisitorPetOwner) {
            var isLoved = false;

            if(this.props.user.love) {
                for(var i=0; i<this.props.user.love.love_me.length; i++) {
                    if(this.props.user.love.love_me[i] == this.props.visitor.user_id) {
                        isLoved = true;
                        break;
                    }
                }
            }

            if(isLoved) {
                footerBtn = <div className="col-xs-5">
                    <button className="btn btn-hd-blue text-muted hg-share-btn text-center" onClick={this._share}>
                        分享
                    </button>
                    <div className="sub-title-text"><small>感谢支持</small></div>
                </div>
            }
            else {
                footerBtn = <div className="col-xs-5">
                    <button className="btn btn-hd-blue text-muted hg-like-btn text-center"
                            onClick={this._love}>
                        <span className="glyphicon glyphicon-heart vcenter71" aria-hidden="true"></span>
                    </button>
                    <div className="sub-title-text"><small>喜欢ta</small></div>
                </div>
            }
        }
        else {
            var isSupported = false;
            if(this.props.user.love) {
                for(var i=0; i<this.props.user.love.support.length; i++) {
                    if(this.props.user.love.support[i] == this.props.clientId) {
                        isSupported = true;
                        break;
                    }
                }
            }

            if(isSupported) {
                footerBtn = <div className="col-xs-5">
                    <button className="btn btn-hd-blue text-muted hg-share-btn text-center" onClick={this._share}>
                        分享
                    </button>
                    <div className="sub-title-text"><small>感谢支持</small></div>
                </div>
            }
            else {
                footerBtn = <div className="col-xs-5">
                    <button className="btn btn-hd-blue text-muted hg-like-btn text-center" onClick={this._support}>
                        <span className="glyphicon glyphicon-thumbs-up vcenter71" aria-hidden="true"></span>
                    </button>
                    <div className="sub-title-text"><small>支持越多,成功率越高</small></div>
                </div>
            }
        }

        if(this.props.user.user_id == this.props.sessionId) {
            footerBtn = <div className="col-xs-5">
                <button className="btn btn-hd-blue text-muted hg-share-btn text-center" onClick={this._share}>
                分享
                </button>
            </div>;
        }

        var labelContent = "";
        if(this.props.user.pet && this.props.user.pet.tall && !this.props.user.pet.weight) {
            labelContent = <div className="col-xs-8 text-right vcenter40">
                <i className="fa fa-paw fa-1x"></i>&nbsp;
                <span className="love-type2">体重{this.props.user.pet ? this.props.user.pet.gender == 1 ? "男狗狗" : "女狗狗" : ""}</span>
                &nbsp;
                <span className="love-type2">肩高{this.props.user.pet ? this.props.user.pet.tall : ""}厘米</span>
            </div>
        }

        if(this.props.user.pet && this.props.user.pet.weight && !this.props.user.pet.tall) {
            labelContent = <div className="col-xs-8 text-right vcenter40">
                <i className="fa fa-paw fa-1x"></i>&nbsp;
                <span className="love-type2">{this.props.user.pet ? this.props.user.pet.gender == 1 ? "男狗狗" : "女狗狗" : ""}</span>
                &nbsp;
                <span className="love-type2">体重{this.props.user.pet ? this.props.user.pet.weight : ""}斤</span>
            </div>
        }

        if(this.props.user.pet && this.props.user.pet.weight && this.props.user.pet.tall) {
            labelContent = <div className="col-xs-8 text-right vcenter40">
                <i className="fa fa-paw fa-1x"></i>&nbsp;
                <span className="love-type2">{this.props.user.pet ? this.props.user.pet.gender == 1 ? "男狗狗" : "女狗狗" : ""}</span>
                &nbsp;
                <span className="love-type2">肩高{this.props.user.pet ? this.props.user.pet.tall : ""}厘米</span>
                &nbsp;
                <span className="love-type2">体重{this.props.user.pet ? this.props.user.pet.weight : ""}斤</span>
            </div>
        }

        var moreImgContent = "";
        if(this.props.user.pet && this.props.user.pet.image_url_list.length == 2) {
            moreImgContent = <div>
                <div className="text-center voffset30">
                                                        <span
                                                            className="glyphicon glyphicon-option-horizontal hg-session-header-icon"></span>
                    <h4 className="voffset0">更多图片</h4>
                </div>

                <div className="text-center voffset50">
                    <div className="love-img-container love-img12"></div>
                </div>

            </div>
        }
        else if(this.props.user.pet && this.props.user.pet.image_url_list.length == 3) {
            moreImgContent = <div>
                <div className="text-center voffset30">
                    <span className="glyphicon glyphicon-option-horizontal hg-session-header-icon"></span>
                    <h4 className="voffset0">更多图片</h4>
                </div>

                <div className="text-center voffset50">
                    <div className="love-img-container love-img12"></div>
                </div>

                <div className="text-center voffset50">
                    <div className="love-img-container love-img13"></div>
                </div>
            </div>
        }

        var statementContent = "";
        if(this.props.user.pet && this.props.user.pet.statement) {
            statementContent = this.props.user.pet.statement;
        }
        else if(this.props.user.pet && !this.props.user.pet.statement) {
            var index = parseInt(Math.random() * Statement.length, 10);
            this.props.user.pet.statement = Statement[index];
            statementContent = Statement[index];
        }

        return (
            <div className="hg-love" id="react_body">
                <Header subtitle="解救单身狗 - 萌宠相亲活动" hgstyle="love-profile hg-navbar"/>

                <div className="container text-center">

                    <div className="row text-center">
                        <div className="love-img-container love-img11"></div>

                        <div className="hg-love-icon text-right">
                            <img src={this.props.user.head_image_url} className="user-icon-normal img-circle white-border"/>
                        </div>

                        <div className="container love-content white_text">
                            <div className="row">
                                <div className="col-xs-4 text-left"><span
                                    className="love-header2">{this.props.user.pet ? this.props.user.pet.name : ""}</span>
                                </div>
                                {labelContent}
                            </div>
                            <div className="row love-statement2 text-left">
                                <div className="col-xs-12">
                                    <span>{statementContent}</span>
                                </div>
                            </div>

                            <div className="text-center love-type3 voffset5">
                                <i className="fa fa-arrow-circle-down"></i>下拉更多内容
                            </div>

                        </div>

                        {moreImgContent}

                        <div className="voffset15 container">
                            <button className="btn btn-hd-blue text-muted text-center" onClick={this._checkMore}>
                                <span className="glyphicon glyphicon-info-sign"></span>
                                &nbsp;点击这里还有更多狗狗 :)
                            </button>
                        </div>

                        <hr/>

                        <div className="voffset10 container">
                            <h2>欢宠</h2>
                            <p>
                                “解救单身狗”萌宠相亲爱心公益活动旨在帮助宠友解决狗狗相亲找对象的老大难问题.解救单身狗的方式:
                                <ul>
                                    <li>点赞求爱宣言,让单身狗的相亲推荐排名更靠前</li>
                                    <li>转发求爱宣言,让更多的异性单身狗有机会看到</li>
                                    <li>关注欢宠公众号,带着自己的狗狗一起来相亲!</li>
                                </ul>
                            </p>

                            <p>长按/识别二维码,关注欢宠公众号,即可参加活动</p>
                            <img src="../../img/qcode129x.png"/>
                        </div>

                        <div className="voffset10">&nbsp;</div>

                    </div>

                </div>

                <footer className="footer">
                    <div className="container">
                        <div className="row text-center">
                            {footerInfo}
                            {footerBtn}
                        </div>
                    </div>
                </footer>

            </div>
        );
    },

    _support: function() {
        Actions.supportUser(this.props.user.user_id, this.props.clientId);
    },

    _share: function() {
        document.getElementById('mcover').style.display='block';
    },

    _checkMore: function() {
        window.location = "http://www.hidogs.cn/love/view/top";
    },

    _love: function() {
        Actions.loveUser(this.props.visitor.user_id, this.props.user.user_id);
    },

});

module.exports = app;

