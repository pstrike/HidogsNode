/** @jsx React.DOM */

var React = require('react');
var HidogsConstants = require('../../Common/constants/HidogsConstants');
var AppDispatcher = require('../../Common/dispatcher/AppDispatcher');

var Store = require('../stores/Store');
var Actions = require('../actions/Actions');
var Constants = require('../constants/Constants');
var Header = require('./../../Common/components/Header.react.js');
var WXSign = require('./../../Common/components/WXSign');
var Main = require('../components/Main.react');

var mapconverter = require('../../../util/mapconverter');


function getAppState() {
    return {
        address: Store.getAddress(),
        productList: Store.getProductList(),
        status: Store.getStatus(),
        wxSign: Store.getWXSign(),
    };
}

var app = React.createClass({

    getInitialState: function() {
        return getAppState();
    },

    componentDidMount: function() {
        Store.addChangeListener(this._onChange);
    },

    componentWillUnmount: function() {
        Store.removeChangeListener(this._onChange);
    },

    componentDidUpdate: function() {
        switch (this.state.status) {
            case Constants.STATE_INIT_LOCATION:
                break;

            case Constants.STATE_INIT_PRODUCT_LIST:
                Actions.initProductList()
                break;

            case Constants.STATE_PRODUCT_LIST:
                break;

        }
    },

    render: function() {

        return (
            <div>
                <WXSign signature = {this.state.wxSign}
                        getSign = {this._getWXSign}
                        apilist = 'getLocation'
                        callback = {this._getLocation}>
                </WXSign>

                <Main productList={this.state.productList} address={this.state.address}></Main>
            </div>
        );
    },

    _onChange: function() {
        this.setState(getAppState());
    },

    _getWXSign: function() {
        Actions.getWXSignature(document.location.href);
    },

    _getLocation: function() {
        wx.getLocation({
            type: 'gcj02', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
            success: function (res) {
                var latitude = res.latitude; // 纬度，浮点数，范围为90 ~ -90
                var longitude = res.longitude; // 经度，浮点数，范围为180 ~ -180。
                var speed = res.speed; // 速度，以米/每秒计
                var accuracy = res.accuracy; // 位置精度

                var geoc = new BMap.Geocoder();
                var bdPoint = mapconverter.gcj02tobd09(longitude, latitude);
                geoc.getLocation(new BMap.Point(bdPoint[0],bdPoint[1]), function(rs){
                    var addComp = rs.addressComponents;
                    //alert(rs.address);
                    //alert(addComp.province + ", " + addComp.city + ", " + addComp.district + ", " + addComp.street + ", " + addComp.streetNumber);
                    Actions.initAddress(addComp.city + ", " + addComp.district + ", " + addComp.street);
                });

                Actions.initProductList(latitude, longitude);
            }
        });
    },

});

module.exports = app;

