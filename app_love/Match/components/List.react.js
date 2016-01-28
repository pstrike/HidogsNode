/** @jsx React.DOM */

var React = require('react');

var Store = require('../stores/Store');
var Actions = require('../actions/Actions');
var Header = require('./../../../app/Common/components/Header.react.js');


var app = React.createClass({

    render: function() {

        var content = <div className="text-center">
            <h5>暂无互相喜欢的用户</h5>
        </div>;
        if(this.props.userList.length > 0) {
            content = <table className="hg-table text-center">
                <thead>
                <tr>
                    <th></th>
                    <th className="text-center">微信号/手机</th>
                    <th></th>
                </tr>
                </thead>
                <tbody>
                {
                    this.props.userList.map(function(user) {
                        return <tr>

                            <td className="text-left">
                                <img src={user.pet.image_url_list.length > 0 ? user.pet.image_url_list[0] : ""} className="user-icon-normal img-circle"/>&nbsp;{user.pet.name}
                            </td>
                            <td className="text-center">{user.wx_id ? user.wx_id : "暂未提供"}</td>
                            <td>
                                <button className="btn btn-hd-blue text-center" onClick={this._checkUser.bind(this, user.user_id)}>查看</button>
                            </td>
                        </tr>;
                    }.bind(this))
                }
                </tbody>
            </table>
        }

        return (
            <div className="hg-love" id="react_body">
                <div className="container blue-background-decoration"></div>

                <Header subtitle="解救单身狗 - 萌宠相亲活动" hgstyle="love-profile hg-navbar"/>

                <div className="container text-center">

                    <div className="page-header text-center hg-pageheader">
                        <h5>Match</h5>
                        <h2 className="voffset10"><strong>互相喜欢</strong></h2>
                    </div>

                    <hr/>

                    {content}

                </div>

            </div>
        );
    },

    _checkUser: function(userId) {
        window.location = "http://www.hidogs.cn/love/view/showoff?userid="+userId;
    }

});

module.exports = app;

