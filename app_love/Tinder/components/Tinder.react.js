/** @jsx React.DOM */

var React = require('react');

var Actions = require('../actions/Actions');
var Constants = require('../constants/Constants');
var Header = require('./../../../app/Common/components/Header.react.js');

var Statement = require('../../ShowOff/constants/Statement');

var app = React.createClass({

    componentDidUpdate: function () {
        // init wallop
        slider = new Wallop(document.querySelector('.Wallop'));
        if(this.props.userList.length > 0) {
            this.props.userList[0].pet.image_url_list.forEach(function(url, index) {
                $(".love-img1"+(index+1)).css("background-image","url("+this.props.userList[slider.currentItemIndex].pet.image_url_list[index]+")");
            }.bind(this))
        }

        // expand image height
        var imageHeight = parseInt($(window).height()) - 119 - 50 - 110;
        $('.love-img-container').css({"height": imageHeight + 'px' });

    },

    componentDidMount: function () {
        // init wallop
        slider = new Wallop(document.querySelector('.Wallop'));
        if(this.props.userList.length > 0) {
            this.props.userList[0].pet.image_url_list.forEach(function(url, index) {
                $(".love-img1"+(index+1)).css("background-image","url("+this.props.userList[slider.currentItemIndex].pet.image_url_list[index]+")");
            }.bind(this))
        }

        // expand image height
        var imageHeight = parseInt($(window).height()) - 119 - 50 - 110;
        $('.love-img-container').css({"height": imageHeight + 'px' });
    },

    render: function () {

        var footerContent = <footer className="footer" id="tinderFooter">
            <div className="container">
                <div className="row text-center">
                    <div className="col-xs-6">
                        <button className="btn btn-hd-blue text-muted hg-like-btn text-center"
                                onClick={this._hate}>
                                        <span className="glyphicon glyphicon-remove vcenter71"
                                              aria-hidden="true"></span>
                        </button>
                    </div>
                    <div className="col-xs-6">
                        <button className="btn btn-hd-blue text-muted hg-like-btn text-center"
                                onClick={this._love}>
                            <span className="glyphicon glyphicon-heart vcenter71" aria-hidden="true"></span>
                        </button>
                    </div>
                </div>
            </div>
        </footer>
        if(this.props.userList.length == 1 && this.props.userList[0].pet.name == "nomoredata") {
            footerContent = "";
        }

        return (
            <div className="hg-love" id="react_body">

                <Header subtitle="解救单身狗" hgstyle="love-profile hg-navbar"/>

                <div className="container"><div className="row">
                        <div className="Wallop Wallop--fold">
                            <div id="list" className="Wallop-list">
                                {
                                    this.props.userList.map(function(item, index) {

                                        var style = "";
                                        var style2 = "";
                                        var style3 = "";
                                        if(index % 2 == 0) {
                                            style = "love-img-container love-img11";
                                            style2 = "love-img-container love-img12";
                                            style3 = "love-img-container love-img13";
                                        }
                                        else {
                                            style = "love-img-container love-img21";
                                            style2 = "love-img-container love-img21";
                                            style3 = "love-img-container love-img23"
                                        }

                                        var labelContent = "";
                                        if(item.pet && item.pet.tall && !item.pet.weight) {
                                            labelContent = <div className="col-xs-8 text-right vcenter40">
                                                <i className="fa fa-paw fa-1x"></i>&nbsp;
                                                <span className="love-type2">{item.pet.gender == "1" ? "男狗狗" : "女狗狗"}</span>
                                                &nbsp;
                                                <span className="love-type2">肩高{item.pet.tall}厘米</span>
                                            </div>
                                        }

                                        if(item.pet && item.pet.weight && !item.pet.tall) {
                                            labelContent = <div className="col-xs-8 text-right vcenter40">
                                                <i className="fa fa-paw fa-1x"></i>&nbsp;
                                                <span className="love-type2">{item.pet.gender == "1" ? "男狗狗" : "女狗狗"}</span>
                                                &nbsp;
                                                <span className="love-type2">体重{item.pet.weight}斤</span>
                                            </div>
                                        }

                                        if(item.pet && item.pet.weight && item.pet.tall) {
                                            labelContent = <div className="col-xs-8 text-right vcenter40">
                                                <i className="fa fa-paw fa-1x"></i>&nbsp;
                                                <span className="love-type2">{item.pet.gender == "1" ? "男狗狗" : "女狗狗"}</span>
                                                &nbsp;
                                                <span className="love-type2">肩高{item.pet.tall}厘米</span>
                                                &nbsp;
                                                <span className="love-type2">体重{item.pet.weight}斤</span>
                                            </div>
                                        }

                                        var moreImgContent = "";
                                        if(item.pet.image_url_list.length == 2) {
                                            moreImgContent = <div>
                                                <div className="text-center voffset30">
                                                        <span
                                                            className="glyphicon glyphicon-option-horizontal hg-session-header-icon"></span>
                                                    <h4 className="voffset0">更多图片</h4>
                                                </div>

                                                <div className="text-center voffset50">
                                                    <div className={style2}></div>
                                                </div>

                                            </div>
                                        }
                                        else if(item.pet.image_url_list.length == 3) {
                                            moreImgContent = <div>
                                                <div className="text-center voffset30">
                                                        <span
                                                            className="glyphicon glyphicon-option-horizontal hg-session-header-icon"></span>
                                                    <h4 className="voffset0">更多图片</h4>
                                                </div>

                                                <div className="text-center voffset50">
                                                    <div className={style2}></div>
                                                </div>

                                                <div className="text-center voffset50">
                                                    <div className={style3}></div>
                                                </div>
                                            </div>
                                        }

                                        var moreIndContent = "";
                                        if(item.pet && item.pet.image_url_list.length > 1) {
                                            moreIndContent = <div className="text-center love-type3 voffset5">
                                                <i className="fa fa-arrow-circle-down"></i>下拉更多图片
                                            </div>
                                        }

                                        var statementContent = "";
                                        if(item.pet && item.pet.statement) {
                                            statementContent = item.pet.statement;
                                        }
                                        else if(item.pet && !item.statement) {
                                            var index = parseInt(Math.random() * Statement.length, 10);
                                            statementContent = Statement[index];
                                        }

                                        var result = ""
                                        if(item.pet.name) {

                                            if(item.pet.name == "nomoredata") {
                                                result = <div className="Wallop-item text-center">
                                                    <h3>暂时没更多匹配的佳丽了...</h3>
                                                    </div>
                                            }
                                            else {
                                                result = <div className="Wallop-item text-center">
                                                    <div className={style}></div>

                                                    <div className="container love-content white_text">
                                                        <div className="row">
                                                            <div className="col-xs-4 text-left"><span
                                                                className="love-header2">{item.pet.name}</span>
                                                            </div>
                                                            {labelContent}
                                                        </div>
                                                        <div className="row love-statement2 text-left">
                                                            <div className="col-xs-12">
                                                                <span>{statementContent}</span>
                                                            </div>
                                                        </div>

                                                        {moreIndContent}

                                                    </div>

                                                    {moreImgContent}

                                                </div>
                                            }

                                        }

                                        return result;
                                    })
                                }

                            </div>
                        </div>
                        <button className="Wallop-buttonPrevious hidden">Dislike</button>
                        <button className="Wallop-buttonNext hidden">Dislike</button>
                </div></div>

                {footerContent}

            </div>
        );
    },

    _next: function () {
        slider.next();

        // set image bg
        if(this.props.userList.length > 0 && this.props.userList[slider.currentItemIndex].pet.name != "nomoredata") {
            if(slider.currentItemIndex % 2 == 0){

                this.props.userList[slider.currentItemIndex].pet.image_url_list.forEach(function(url, index) {
                    $(".love-img1"+(index+1)).css("background-image","url("+this.props.userList[slider.currentItemIndex].pet.image_url_list[index]+")");
                }.bind(this))

            }
            else {
                this.props.userList[slider.currentItemIndex].pet.image_url_list.forEach(function(url, index) {
                    $(".love-img2"+(index+1)).css("background-image","url("+this.props.userList[slider.currentItemIndex].pet.image_url_list[index]+")");
                }.bind(this))
            }
        }

        // load image
        if (slider.currentItemIndex == this.props.userList.length - 1 && this.props.userList[slider.currentItemIndex].pet.name != "nomoredata") {
            console.log("load more items")
            Actions.loadMoreUser(this.props.session.user_id);
        }

        // Tinder Done then hide footer menu
        if(this.props.userList[slider.currentItemIndex].pet.name == "nomoredata") {
            $("#tinderFooter").css("display", "none");
        }

        // scroll to top
        $("body").scrollTop(0);

        console.log("current:"+(slider.currentItemIndex+1)+"; total:"+this.props.userList.length);

    },

    _love: function() {
        Actions.loveUser(this.props.session.user_id, this.props.userList[slider.currentItemIndex].user_id)
        this._next();
    },

    _hate: function() {
        Actions.hateUser(this.props.session.user_id, this.props.userList[slider.currentItemIndex].user_id)
        this._next();
    },

});

module.exports = app;

