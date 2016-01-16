/** @jsx React.DOM */

var React = require('react');

var Store = require('../stores/Store');
var Actions = require('../actions/Actions');
var Constants = require('../constants/Constants');
var Tinder = require('./Tinder.react');
var Message = require('./Message.react');
var Guide = require('./Guide.react');
var Loading = require('./../../../app/Common/components/Loading.react');
var HGSessionStore = require('../../../app/Common/stores/session');
var WXSign = require('../../../app/Common/components/WXSign');
var HGWXAction = require('../../../app/Common/actions/wx');
var HGWXStore = require('../../../app/Common/stores/wx');
var mapconverter = require('../../../util/mapconverter');



function getAppState() {
    return {
        session: HGSessionStore.getSession(),
        wxSign: HGWXStore.getWxSign(),
        userList: Store.getUserList(),
        status: Store.getStatus(),
        user: Store.getUser(),
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

        var content = <Loading></Loading>;

        if(this.state.userList.length > 0) {
            content = <Guide></Guide>
        }

        if(this.state.status == Constants.STATE_TINDER) {
            content = <Tinder userList={this.state.userList} status={this.state.status} user={this.state.user}></Tinder>
        }


        if(this.state.user && this.state.user.user_id) {
            if(!this.state.user.pet.name) {
                content = <Message message="请填写您狗狗的资料"></Message>
            }

            if(!this.state.user.isSubscribe) {
                content = <Message message="请您关注欢宠公众号"></Message>
            }
        }

        return (
            <div>
                <WXSign signature = {this.state.wxSign}
                        getSign = {this._getWXSign}
                        apilist = 'getLocation'
                        callback = {this._getLocation}>
                </WXSign>

                {content}
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
    },

});

module.exports = app;

