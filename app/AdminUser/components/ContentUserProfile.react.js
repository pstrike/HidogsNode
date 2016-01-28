/** @jsx React.DOM */

var React = require('react');
var HidogsConstants = require('../../Common/constants/HidogsConstants');
var AppDispatcher = require('../../Common/dispatcher/AppDispatcher');

var Store = require('../stores/VendorStore');
var Actions = require('../actions/Actions');
var ContentUserProfileModal = require('../components/ContentUserProfileModal.react');
var Header = require('./../../Common/components/Header.react.js');

var formatdatetime = require('../../../util/formatdatetime');


function getAppState() {
    return {
        userList: Store.getUserList(),
        user: Store.getUser(),
    };
}

var app = React.createClass({

    getInitialState: function() {
        return getAppState();
    },

    componentDidMount: function() {
        Store.addChangeListener(this._onChange);
        Actions.getUserList();
    },

    componentWillUnmount: function() {
        Store.removeChangeListener(this._onChange);
    },

    render: function () {

        var subscribeNo = 0;
        var petOwnerNo = 0;
        var matchNo = 0;
        this.state.userList.forEach(function(user) {
            if(user.isSubscribe) {
                subscribeNo++;
            }

            if(user.pet.name) {
                petOwnerNo++;
            }

            matchNo += user.love.match_no;
        })

        return (
            <div className="col-sm-9 col-sm-offset-3 col-md-10 col-md-offset-2 main">

                <ContentUserProfileModal user={this.state.user}/>

                <h1 className="page-header">用户列表</h1>

                <div className="table-responsive">

                    <div className="text-left">
                        <span className="label label-info">用户数:{this.state.userList.length}</span>&nbsp;&nbsp;&nbsp;
                        <span className="label label-info">宠友数(填了宠物资料):{petOwnerNo}</span>&nbsp;&nbsp;&nbsp;
                        <span className="label label-info">关注数:{subscribeNo}</span>&nbsp;&nbsp;&nbsp;
                        <span className="label label-info">配对数:{matchNo/2}</span>
                    </div>

                    <hr/>

                    <table className="table table-striped">
                        <thead>
                        <tr>
                            <th>昵称</th>
                            <th><a href="#" onClick={this._sortByKey.bind(this, 'gender')}>性别</a></th>
                            <th><a href="#" onClick={this._sortByKey.bind(this, 'address.city')}>地址</a></th>
                            <th>宠物名称</th>
                            <th><a href="#" onClick={this._sortByKey.bind(this, 'pet.type')}>宠物品种</a></th>
                            <th><a href="#" onClick={this._sortByKey.bind(this, 'love.i_love.length')}>喜欢</a></th>
                            <th><a href="#" onClick={this._sortByKey.bind(this, 'love.love_me.length')}>被喜欢</a></th>
                            <th><a href="#" onClick={this._sortByKey.bind(this, 'love.i_hate.length')}>无感</a></th>
                            <th><a href="#" onClick={this._sortByKey.bind(this, 'love.support.length')}>赞</a></th>
                            <th><a href="#" onClick={this._sortByKey.bind(this, 'love.match_no')}>配对</a></th>
                            <th><a href="#" onClick={this._sortByKey.bind(this, 'visit_count.love')}>访问次数</a></th>
                            <th><a href="#" onClick={this._sortByKey.bind(this, 'isSubscribe')}>关注?</a></th>
                            <th><a href="#" onClick={this._sortByKey.bind(this, 'modified_time')}>最后访问</a></th>
                            <th><a href="#" onClick={this._sortByKey.bind(this, 'created_time')}>首次访问</a></th>
                        </tr>
                        </thead>
                        <tbody>
                        {this.state.userList.map(function(item){
                            var gender = "";
                            if(item.gender == 2) {
                                gender = '女';
                            }
                            else if(item.gender == 1) {
                                gender = '男';
                            }

                            var lastModifiedDate = ""
                            if(item.modified_time) {
                                lastModifiedDate = formatdatetime.formatDate(new Date(item.modified_time));
                            }

                            var createdDate = ""
                            if(item.created_time) {
                                createdDate = formatdatetime.formatDate(new Date(item.created_time));
                            }

                            var addressContent = "";
                            if(item.address) {
                                addressContent = (item.address.city ? item.address.city : "") +
                                    (item.address.district ? item.address.district : "") +
                                    (item.address.street ? item.address.street : "") +
                                    (item.address.business ? item.address.business : "") +
                                    (item.address.additional ? item.address.additional : "");
                            }

                            return <tr onClick={this._viewUserProfile.bind(this, item.user_id)} onTouchStart={this.handleTouchStart}>
                                <td>
                                    <img src={item.head_image_url} className="img-circle user-icon-small"/>
                                    {item.nick_name}
                                </td>
                                <td>{gender}</td>
                                <td>{addressContent}</td>
                                <td>{item.pet.name}</td>
                                <td>{item.pet.type}</td>
                                <td>{item.love.i_love.length}</td>
                                <td>{item.love.love_me.length}</td>
                                <td>{item.love.i_hate.length}</td>
                                <td>{item.love.support.length}</td>
                                <td>{item.love.match_no}</td>
                                <td>{item.visit_count ? item.visit_count.love : 0}</td>
                                <td>{item.isSubscribe == true ? "Y" : "N" }</td>
                                <td>{lastModifiedDate}</td>
                                <td>{createdDate}</td>
                            </tr>;
                        },this)}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    },

    _onChange: function() {
        this.setState(getAppState());
    },

    _sortByKey: function(key) {
        Actions.sortUserList(key);
    },

    _viewUserProfile: function(id) {
        $('#profileModal').modal('show');
        Actions.getUserDetail(id);
    },
});

module.exports = app;

