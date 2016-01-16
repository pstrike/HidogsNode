/** @jsx React.DOM */

var React = require('react');
var HGSessionStore = require('../../../app/Common/stores/session');
var AppDispatcher = require('../../../app/Common/dispatcher/AppDispatcher');
var WXSign = require('../../../app/Common/components/WXSign');
var HGWXAction = require('../../../app/Common/actions/wx');
var HGWXStore = require('../../../app/Common/stores/wx');
var Loading = require('./../../../app/Common/components/Loading.react');

var Store = require('../stores/Store');
var Actions = require('../actions/Actions');
var Input = require('../components/Input.react');
var List = require('../components/List.react');
var Message = require('../../Tinder/components/Message.react');

var mapconverter = require('../../../util/mapconverter');



function getAppState() {
    return {
        session: HGSessionStore.getSession(),
        wxSign: HGWXStore.getWxSign(),
        user: Store.getUser(),
        userList: Store.getUserList(),
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
        var content = <Loading></Loading>;
        if(this.state.user && this.state.user.user_id) {
            if(!this.state.user.wx_id) {
                content = <Input user={this.state.user}></Input>
            }
            else {
                content = <List userList={this.state.userList}></List>
            }

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

