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

                <Header subtitle="解救单身狗" hgstyle="love-profile hg-navbar"/>

                <div className="container text-center">

                    <img src="../../img/logo-dog-2.png"/>

                    <h2 className="voffset0">资料成功保存</h2>
                    <h4>
                        <i className="fa fa-arrow-circle-right"></i>
                        下一步
                    </h4>

                    <div>长按/识别以下二维码关注欢宠公众号.关注后,您可以进行配对并得到互相喜欢狗狗主人的联系方式.</div>

                    <div className="voffset10">
                        <img src="../../img/qcode129x.png"/>
                    </div>

                </div>

            </div>
        );
    },

});

module.exports = app;

