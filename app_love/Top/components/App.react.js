/** @jsx React.DOM */

var React = require('react');

var Store = require('../stores/Store');
var Actions = require('../actions/Actions');
var List = require('../components/List.react');

var HGSessionStore = require('../../../app/Common/stores/session');
var WXSign = require('../../../app/Common/components/WXSign');
var HGWXAction = require('../../../app/Common/actions/wx');
var HGWXStore = require('../../../app/Common/stores/wx');

var mapconverter = require('../../../util/mapconverter');



function getAppState() {
    return {
        session: HGSessionStore.getSession(),
        wxSign: HGWXStore.getWxSign(),
        topList: Store.getTopList(),
        randomList: Store.getRandomList(),
        user: Store.getUser(),
        status: Store.getStatus(),
    };
}

var app = React.createClass({

    getInitialState: function() {
        return getAppState();
    },

    componentDidMount: function() {
        Store.addChangeListener(this._onChange);
        HGSessionStore.addChangeListener(this._onChange);
        HGWXStore.addChangeListener(this._onChange);

        Actions.getSessionThenUser();
    },

    componentWillUnmount: function() {
        Store.removeChangeListener(this._onChange);
        HGSessionStore.removeChangeListener(this._onChange);
        HGWXStore.removeChangeListener(this._onChange);
    },

    render: function() {

        return (
            <div>
                <WXSign signature = {this.state.wxSign}
                        getSign = {this._getWXSign}
                        apilist = 'getLocation,onMenuShareTimeline,onMenuShareAppMessage'
                        callback = {this._getLocation}>
                </WXSign>

                <List topList={this.state.topList} randomList={this.state.randomList} user={this.state.user}></List>
            </div>
        );
    },

    _onChange: function() {
        this.setState(getAppState());
    },

    _getWXSign: function() {
        HGWXAction.getWXSignature(document.location.href);
    },

    _getLocation: function() {
        wx.getLocation({
            type: 'gcj02', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
            success: function (res) {
                var latitude = res.latitude; // 纬度，浮点数，范围为90 ~ -90
                var longitude = res.longitude; // 经度，浮点数，范围为180 ~ -180。
                //var speed = res.speed; // 速度，以米/每秒计
                //var accuracy = res.accuracy; // 位置精度
                var location = {
                    type: "Point",
                    coordinates: [
                        parseFloat(longitude ? longitude : 0),
                        parseFloat(latitude ? latitude : 0),
                    ],
                };

                var geoc = new BMap.Geocoder();
                var bdPoint = mapconverter.gcj02tobd09(longitude, latitude);
                geoc.getLocation(new BMap.Point(bdPoint[0],bdPoint[1]), function(rs){
                    Actions.initLocation(this.state.session.user_id, location, rs.addressComponents);
                }.bind(this));

            }.bind(this)
        });

        wx.onMenuShareTimeline({
            title: '欢宠解救单身狗 -- 萌犬相亲活动', // 分享标题
            link: 'http://www.hidogs.cn/love/view/top', // 分享链接
            imgUrl: 'http://www.hidogs.cn/img/logo-dog-5.png', // 分享图标
            success: function () {
                // 用户确认分享后执行的回调函数
            },
            cancel: function () {
                // 用户取消分享后执行的回调函数
            }
        });

        wx.onMenuShareAppMessage({
            title: '欢宠解救单身狗 -- 萌犬相亲活动', // 分享标题
            desc: '“解救单身狗”萌宠相亲爱心公益活动旨在帮助宠友解决狗狗相亲找对象的老大难问题', // 分享描述
            link: 'http://www.hidogs.cn/love/view/top', // 分享链接
            imgUrl: 'http://www.hidogs.cn/img/logo-dog-5.png', // 分享图标
            type: '', // 分享类型,music、video或link，不填默认为link
            dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
            success: function () {
                // 用户确认分享后执行的回调函数
            },
            cancel: function () {
                // 用户取消分享后执行的回调函数
            }
        });
    },

});

module.exports = app;

