/** @jsx React.DOM */

var React = require('react');
var Store = require('../stores/Store');
var Actions = require('../actions/Actions');
var Main = require('./Main.react');

var WXSign = require('../../../app/Common/components/WXSign');
var HGSessionStore = require('../../../app/Common/stores/session');
var HGWXAction = require('../../../app/Common/actions/wx');
var HGWXStore = require('../../../app/Common/stores/wx');

var genuuid = require('../../../util/genuuid');
var mapconverter = require('../../../util/mapconverter');



function getAppState() {
    return {
        session: HGSessionStore.getSession(),
        wxSign: HGWXStore.getWxSign(),
        user: Store.getUser(),
        clientId: Store.getClientId(),
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

        Actions.getSession();
        Actions.getUser($("#react-main-mount").attr("userid"));

        if($("#react-main-mount").attr("iswx") == 'false') {
            if(window.localStorage){
                if(window.localStorage.clientId) {
                    Actions.initClientId(window.localStorage.clientId);
                }
                else {
                    window.localStorage.clientId = genuuid.uuid();
                    Actions.initClientId(window.localStorage.clientId);
                }
            }
        }
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
                        apilist = 'onMenuShareTimeline,getLocation'
                        callback = {this._wxCallback}>
                </WXSign>

                <Main user={this.state.user} clientId={this.state.clientId}></Main>
            </div>
        );
    },

    _onChange: function() {
        this.setState(getAppState());
    },

    _getWXSign: function() {
        if($("#react-main-mount").attr("iswx") == 'true') {
            HGWXAction.getWXSignature(document.location.href);
        }
    },

    _wxCallback: function() {
        if(this.state.session.user_id && $("#react-main-mount").attr("iswx") == 'true') {
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
                            parseFloat(longitude),
                            parseFloat(latitude),
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
                title: '一起来帮单身狗的摆脱宿命', // 分享标题
                link: 'http://www.hidogs.cn/love/view/showoff?userid='+this.state.user.user_id, // 分享链接
                imgUrl: 'http://www.hidogs.cn/img/logo-dog-1.png', // 分享图标
                success: function () {
                    // 用户确认分享后执行的回调函数
                },
                cancel: function () {
                    // 用户取消分享后执行的回调函数
                    alert("分享失败");
                }
            });
        }


    },

});

module.exports = app;
