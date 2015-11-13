/** @jsx React.DOM */

var React = require('react');

var WXSign = React.createClass({

    getInitialState: function() {
        return {
            isInit: false,
        };
    },

    componentDidMount: function() {
        this.props.getSign();
    },

    componentDidUpdate: function() {
        if(this.props.signature.signature  && !this.state.isInit) {

            wx.config({
                debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                appId: this.props.signature.appId,
                timestamp: this.props.signature.timestamp,
                nonceStr: this.props.signature.nonceStr,
                signature: this.props.signature.signature,
                jsApiList: this.props.apilist.split(',') // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
            });

            wx.ready(function() {
                this.setState({
                    isInit: true,
                });
            }.bind(this));

            wx.error(function(res) {
                alert('好像出了点问题, 请您重新打开一次页面.');
            });

        }
    },

    render: function() {
        return (
            <div className="hidden"></div>
        );
    },

});

module.exports = WXSign;

