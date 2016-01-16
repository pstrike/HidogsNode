/** @jsx React.DOM */

var React = require('react');
var Header = require('./../../../app/Common/components/Header.react.js');


var app = React.createClass({

    render: function() {

        return (
            <div className="hg-love" id="react_body">
                <Header subtitle="解救单身狗 - 萌宠相亲活动" hgstyle="love-profile hg-navbar"/>

                <div className="container text-center">

                    <img src="../../img/logo-dog-1.png"/>

                    <h2>{this.props.message}</h2>

                    <div>通过长按以下二维码返回/关注我们的公众号, 参与欢宠"解救单身狗"活动</div>

                    <div className="voffset30">
                        <img src="../../img/qcode129x.png"/>
                    </div>

                </div>

            </div>
        );
    },

});

module.exports = app;

