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
                        <div><small><i>可以花心 喜欢多次</i></small></div>
                    </div>
                </div>
            </div>
        </footer>
        if(this.props.userList.length == 1
            && (this.props.userList[0].pet.name == "nomoredata" || this.props.userList[0].pet.name == "limiteddata")) {
            footerContent = "";
        }

        return (
            <div className="hg-love" id="react_body">

                <Header subtitle="解救单身狗 - 萌宠相亲活动" hgstyle="love-profile hg-navbar"/>

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
                                                    <img src="../../img/logo-dog-1.png"/>
                                                    <h3>暂时没更多匹配的狗狗了...</h3>
                                                    <br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>
                                                    </div>
                                            }
                                            else if(item.pet.name == "limiteddata") {
                                                var creditNo = parseInt(this.props.user.love.support.length/10) *5
                                                var visitConetent = <p className="voffset0">今天的15只狗狗都看完了</p>
                                                if(creditNo > 0) {
                                                    visitConetent = <p className="voffset0">今天的{15+creditNo}只狗狗都看完了<small><i>(15只+点赞奖励{creditNo}只)</i></small></p>
                                                }

                                                result = <div className="Wallop-item text-center">
                                                    <div className="container">
                                                        <img src="../../img/logo-dog-1.png"/>

                                                        <h3 className="voffset0">请明天再继续 :)</h3>
                                                        {visitConetent}
                                                        <h4 className="voffset30">
                                                            <i className="fa fa-info-circle"></i>&nbsp;
                                                            还没尽兴?
                                                        </h4>

                                                        <p>分享狗狗的“求爱宣言”到朋友圈/微信群/QQ群,让朋友帮您点赞：
                                                            <ul>
                                                                <li>每积10个赞,每天就可以多匹配5只狗狗噢</li>
                                                                <li>点赞越多,狗狗的相亲推荐排名越靠前</li>
                                                                <li>点赞数量最多的单身狗将有机会得到奖励</li>
                                                            </ul>
                                                        </p>


                                                        <div className="voffset30">
                                                            <img src="../../img/qcode129x.png"/>
                                                        </div>
                                                        <div className="voffset10">长按二维码返回/关注欢宠公众号,有更多好玩内容</div>
                                                    </div>
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
                                    }.bind(this))
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
        if(this.props.userList.length > 0) {
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
        //if (slider.currentItemIndex == this.props.userList.length - 1
        //    && (this.props.userList[slider.currentItemIndex].pet.name != "nomoredata" || this.props.userList[slider.currentItemIndex].pet.name != "limiteddata")) {
        //    console.log("load more items")
        //    Actions.loadMoreUser(this.props.user.user_id);
        //}

        // Tinder Done then hide footer menu
        if(this.props.userList[slider.currentItemIndex].pet.name == "nomoredata"
        || this.props.userList[slider.currentItemIndex].pet.name == "limiteddata") {
            $("#tinderFooter").css("display", "none");
        }

        // scroll to top
        $("body").scrollTop(0);

        console.log("current:"+(slider.currentItemIndex+1)+"; total:"+this.props.userList.length);

    },

    _love: function() {
        Actions.loveUser(this.props.user.user_id, this.props.userList[slider.currentItemIndex].user_id)
        this._next();
    },

    _hate: function() {
        Actions.hateUser(this.props.user.user_id, this.props.userList[slider.currentItemIndex].user_id)
        this._next();
    },

});

module.exports = app;

