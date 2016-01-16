/** @jsx React.DOM */

var React = require('react');

var Store = require('../stores/Store');
var Actions = require('../actions/Actions');
var Header = require('./../../../app/Common/components/Header.react.js');
var HGQRCode = require('./../../../app/Common/components/HGQRCode.react');


var app = React.createClass({

    render: function() {

        return (
            <div className="hg-love" id="react_body">
                <div className="blue-background-decoration"></div>

                <Header subtitle="解救单身狗 - 萌宠相亲活动" hgstyle="love-profile hg-navbar"/>

                <div className="container text-center">

                    <img src="../../img/logo-dog-2.png"/>

                    <h2 className="voffset0">
                        <i className="fa fa-arrow-circle-right"></i>
                        下一步
                    </h2>

                    <div>长按／识别以下二维码关注欢宠公众号，即可获得智能推荐并开始配对，一旦有互相喜欢的相亲对象，公众号将发送消息通知您</div>

                    <div className="voffset10">
                        <img src="../../img/qcode129x.png"/>
                    </div>

                </div>

            </div>
        );
    },

});

module.exports = app;

