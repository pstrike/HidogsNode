/** @jsx React.DOM */

var React = require('react');

var Store = require('../stores/Store');
var Actions = require('../actions/Actions');
var Header = require('./../../../app/Common/components/Header.react.js');

var Statement = require('../../ShowOff/constants/Statement');


var app = React.createClass({

    render: function () {

        // fav
        var favContent = "";
        if(this.props.topList.fav && this.props.topList.fav.user_id) {
            var statementContent = "";
            if (this.props.topList.fav.pet && this.props.topList.fav.pet.statement) {
                statementContent = this.props.topList.fav.pet.statement;
            }
            else if (this.props.topList.fav.pet && !this.props.topList.fav.pet.statement) {
                this.props.topList.fav.pet.statement = this._genRandomStatement();
                statementContent = this._genRandomStatement();
            }

            favContent = <div>
                    <div className="row text-center">
                        <div className="col-xs-12">
                            <span className="hg-love-top-trophy"><i className="fa fa-heart"></i> 最具魅力</span>
                            <div>有{this.props.topList.fav ? this.props.topList.fav.love.love_me.length : 0}只狗狗追求ta</div>
                        </div>
                        <div className="col-xs-12 voffset15">
                            <img src={this.props.topList.fav ? this.props.topList.fav.pet.image_url_list[0] : ""} className="hg-love-top-icon img-circle"/>

                            <h3 className="voffset5">{this.props.topList.fav ? this.props.topList.fav.pet.name : ""}</h3>
                        </div>
                        <div className="col-xs-12">
                            <p className="voffset0">{statementContent}</p>
                        </div>
                        <div className="col-xs-12">
                            <button className="btn btn-hd-blue" onClick={this._checkDetail.bind(this, this.props.topList.fav.user_id)}>查看</button>
                        </div>

                    </div>

                    <hr className="voffset30"/>
                </div>

        }

        // pop
        var popContent = "";
        if(this.props.topList.pop && this.props.topList.pop.user_id) {
            var statementContent = "";
            if (this.props.topList.pop.pet && this.props.topList.pop.pet.statement) {
                statementContent = this.props.topList.pop.pet.statement;
            }
            else if (this.props.topList.pop.pet && !this.props.topList.pop.pet.statement) {
                this.props.topList.pop.pet.statement = this._genRandomStatement();
                statementContent = this._genRandomStatement();
            }

            popContent = <div>
                <div className="row text-center">
                    <div className="col-xs-12">
                        <span className="hg-love-top-trophy"><i className="fa fa-users"></i> 最具人气</span>
                        <div>有{this.props.topList.pop ? this.props.topList.pop.love.support.length : 0}个赞支持ta</div>
                    </div>
                    <div className="col-xs-12 voffset15">
                        <img src={this.props.topList.pop ? this.props.topList.pop.pet.image_url_list[0] : ""} className="hg-love-top-icon img-circle"/>

                        <h3 className="voffset5">{this.props.topList.pop ? this.props.topList.pop.pet.name : ""}</h3>
                    </div>
                    <div className="col-xs-12">
                        <p className="voffset0">{statementContent}</p>
                    </div>
                    <div className="col-xs-12">
                        <button className="btn btn-hd-blue" onClick={this._checkDetail.bind(this, this.props.topList.pop.user_id)}>查看</button>
                    </div>

                </div>

                <hr className="voffset30"/>
            </div>

        }

        // playdog
        var playdogContent = "";
        if(this.props.topList.playdog && this.props.topList.playdog.user_id) {

            var statementContent = "";
            if (this.props.topList.playdog.pet && this.props.topList.playdog.pet.statement) {
                statementContent = this.props.topList.playdog.pet.statement;
            }
            else if (this.props.topList.playdog.pet && !this.props.topList.playdog.pet.statement) {
                this.props.topList.playdog.pet.statement = this._genRandomStatement();
                statementContent = this._genRandomStatement();
            }

            playdogContent = <div>
                <div className="row text-center">
                    <div className="col-xs-12">
                        <span className="hg-love-top-trophy"><i className="fa fa-star"></i> 最花心</span>
                        <div>ta追求了{this.props.topList.playdog ? this.props.topList.playdog.love.i_love.length : 0}只狗狗</div>
                    </div>
                    <div className="col-xs-12 voffset15">
                        <img src={this.props.topList.playdog ? this.props.topList.playdog.pet.image_url_list[0] : ""} className="hg-love-top-icon img-circle"/>

                        <h3 className="voffset5">{this.props.topList.playdog ? this.props.topList.playdog.pet.name : ""}</h3>
                    </div>
                    <div className="col-xs-12">
                        <p className="voffset0">{statementContent}</p>
                    </div>
                    <div className="col-xs-12">
                        <button className="btn btn-hd-blue" onClick={this._checkDetail.bind(this, this.props.topList.playdog.user_id)}>查看</button>
                    </div>

                </div>

                <hr className="voffset30"/>
            </div>

        }

        // lazy
        var lazyContent = "";
        if(this.props.topList.lazy && this.props.topList.lazy.user_id) {

            var statementContent = "";
            if (this.props.topList.lazy.pet && this.props.topList.lazy.pet.statement) {
                statementContent = this.props.topList.lazy.pet.statement;
            }
            else if (this.props.topList.lazy.pet && !this.props.topList.lazy.pet.statement) {
                this.props.topList.lazy.pet.statement = this._genRandomStatement();
                statementContent = this._genRandomStatement();
            }

            lazyContent = <div>
                <div className="row text-center">
                    <div className="col-xs-12">
                        <span className="hg-love-top-trophy"><i className="fa fa-life-ring"></i> 最闷骚</span>
                        <div>那么多佳丽,只追求了{this.props.topList.lazy ? this.props.topList.lazy.love.i_love.length : 0}只狗狗</div>
                    </div>
                    <div className="col-xs-12 voffset15">
                        <img src={this.props.topList.lazy ? this.props.topList.lazy.pet.image_url_list[0] : ""} className="hg-love-top-icon img-circle"/>

                        <h3 className="voffset5">{this.props.topList.lazy ? this.props.topList.lazy.pet.name : ""}</h3>
                    </div>
                    <div className="col-xs-12">
                        <p className="voffset0">{statementContent}</p>
                    </div>
                    <div className="col-xs-12">
                        <button className="btn btn-hd-blue" onClick={this._checkDetail.bind(this, this.props.topList.lazy.user_id)}>查看</button>
                    </div>

                </div>

                <hr className="voffset30"/>
            </div>

        }

        // cool
        var coolContent = "";
        if(this.props.topList.cool && this.props.topList.cool.user_id) {

            var statementContent = "";
            if (this.props.topList.cool.pet && this.props.topList.cool.pet.statement) {
                statementContent = this.props.topList.cool.pet.statement;
            }
            else if (this.props.topList.cool.pet && !this.props.topList.cool.pet.statement) {
                this.props.topList.cool.pet.statement = this._genRandomStatement();
                statementContent = this._genRandomStatement();
            }

            coolContent = <div>
                <div className="row text-center">
                    <div className="col-xs-12">
                        <span className="hg-love-top-trophy"><i className="fa fa-trophy"></i> 最专情</span>
                        <div>有{this.props.topList.cool ? this.props.topList.cool.love.love_me.length : 0}追求Ta; 但Ta只喜欢了{this.props.topList.cool ? this.props.topList.cool.love.i_love.length : 0}只狗狗</div>
                    </div>
                    <div className="col-xs-12 voffset15">
                        <img src={this.props.topList.cool ? this.props.topList.cool.pet.image_url_list[0] : ""} className="hg-love-top-icon img-circle"/>

                        <h3 className="voffset5">{this.props.topList.cool ? this.props.topList.cool.pet.name : ""}</h3>
                    </div>
                    <div className="col-xs-12">
                        <p className="voffset0">{statementContent}</p>
                    </div>
                    <div className="col-xs-12">
                        <button className="btn btn-hd-blue" onClick={this._checkDetail.bind(this, this.props.topList.cool.user_id)}>查看</button>
                    </div>

                </div>

                <hr className="voffset30"/>
            </div>

        }

        // random list
        var randomList = [];
        var randomItemContent = [];
        this.props.randomList.forEach(function(user, index) {
            randomItemContent.push(<div className="col-xs-4" onClick={this._checkDetail.bind(this, user.user_id)}>
                <img src={user.pet.image_url_list[0]} className="user-icon-header img-circle"/>
                <div>{user.pet.name}</div>
            </div>)

            if((index+1)%3 == 0) {
                randomList.push(
                    <div className="row voffset30 text-center">
                        {randomItemContent}
                    </div>
                );

                randomItemContent = [];
            }

        }.bind(this))

        // footer
        var footerBtnContent = "";
        if(this.props.user.pet && this.props.user.pet.name) {
            if(this.props.user.isSubscribe) {
                footerBtnContent = <button className="btn btn-hd-blue text-muted text-left" onClick={this._redirectToTinder}>
                    开始配对
                </button>
            }
            else {
                footerBtnContent = <button className="btn btn-hd-blue text-muted text-left" onClick={this._checkQrCode}>
                    关注公众号,开始相亲配对
                </button>
            }
        }
        else {
            footerBtnContent = <button className="btn btn-hd-blue text-muted text-left" onClick={this._redirectToProfile}>
                填写狗狗资料,开始相亲配对
            </button>
        }

        return (
            <div className="hg-love" id="react_body">
                <div className="container blue-background-decoration"></div>

                <Header subtitle="解救单身狗 - 萌宠相亲活动" hgstyle="love-profile hg-navbar"/>

                <div className="container text-center">

                    <div className="page-header text-center hg-pageheader">
                        <h5>解救单身狗</h5>

                        <h2 className="voffset10"><strong>萌宠相亲</strong></h2>
                    </div>

                    <hr/>

                    {favContent}
                    {playdogContent}
                    {popContent}
                    {coolContent}
                    {lazyContent}

                    <div className="row text-center voffset30">
                        <div className="col-xs-12">
                            <span className="hg-love-top-trophy"><i className="fa fa-paw"></i> 更多萌犬</span>
                        </div>
                    </div>

                    {randomList}

                    <hr/>

                    <div id="qrcodeAnchor" className="voffset60">
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


                </div>

                <footer className="small-footer footer">
                    <div className="container">
                        <div className="row text-right">
                            <div className="col-xs-12">
                                {footerBtnContent}
                            </div>
                        </div>
                    </div>
                </footer>


            </div>
        );
    },

    _checkDetail: function(userId) {
        window.location = "http://www.hidogs.cn/love/view/showoff?userid="+userId;
    },

    _genRandomStatement: function() {
        var index = parseInt(Math.random() * Statement.length, 10);
        return Statement[index];
    },

    _redirectToProfile: function() {
        window.location = "http://www.hidogs.cn/love/view/profile";
    },

    _redirectToTinder: function() {
        window.location = "http://www.hidogs.cn/love/view/tinder";
    },

    _checkQrCode: function() {
        var position = $('body').scrollTop() + $('#qrcodeAnchor').offset().top;

        $('body').animate({
            scrollTop: position
        }, 500);
    },

});

module.exports = app;

