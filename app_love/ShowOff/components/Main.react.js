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

        var isSupported = false;
        if(this.props.user.love) {
            for(var i=0; i<this.props.user.love.support.length; i++) {
                if(this.props.user.love.support[i] == this.props.clientId) {
                    isSupported = true;
                    break;
                }
            }
        }
        var supportBtn = <button className="btn btn-hd-blue text-muted hg-like-btn text-center" onClick={this._support}>
            <span className="glyphicon glyphicon-thumbs-up vcenter71" aria-hidden="true"></span>
        </button>;
        var supportInfoContent = <div className="col-xs-6">
            <div className="big-text voffset25">{this.props.user.love ? this.props.user.love.support.length : 0}</div>
            <div className="sub-title-text">人支持</div>
        </div>
        if(isSupported) {
            supportBtn = <button className="btn btn-hd-blue text-muted hg-like-btn text-center" disabled>
                <span className="glyphicon glyphicon-thumbs-up vcenter71" aria-hidden="true"></span>
            </button>;

            supportInfoContent = <div className="col-xs-6">
                <div className="big-text voffset15">{this.props.user.love ? this.props.user.love.support.length : 0}</div>
                <div className="sub-title-text">人支持</div>
                <div><small><i>(感谢您的支持)</i></small></div>
            </div>
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

        var moreIndContent = "";
        if(this.props.user.pet && this.props.user.pet.image_url_list.length > 1) {
            moreIndContent = <div className="text-center love-type3 voffset5">
                <i className="fa fa-arrow-circle-down"></i>下拉更多图片
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
                <Header subtitle="解救单身狗" hgstyle="love-profile hg-navbar"/>

                <div className="container text-center">

                    <div className="row text-center">
                        <div className="love-img-container love-img11"></div>

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

                            {moreIndContent}

                        </div>

                        {moreImgContent}

                    </div>

                </div>

                <footer className="footer">
                    <div className="container">
                        <div className="row text-center">
                            {supportInfoContent}
                            <div className="col-xs-6">
                                {supportBtn}
                            </div>
                        </div>
                    </div>
                </footer>

            </div>
        );
    },

    _support: function() {
        Actions.supportUser(this.props.user.user_id, this.props.clientId);
    },

});

module.exports = app;

