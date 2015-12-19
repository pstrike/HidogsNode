/** @jsx React.DOM */

var React = require('react');
var HidogsConstants = require('../../Common/constants/HidogsConstants');
var AppDispatcher = require('../../Common/dispatcher/AppDispatcher');

var Store = require('../stores/VendorStore');
var Actions = require('../actions/Actions');
var Header = require('./../../Common/components/Header.react.js');


function getAppState() {
    return {
        userList: Store.getUserList(),
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

        return (
            <div className="col-sm-9 col-sm-offset-3 col-md-10 col-md-offset-2 main">

                <h1 className="page-header">用户列表</h1>

                <div className="table-responsive">
                    <table className="table table-striped">
                        <thead>
                        <tr>
                            <th>姓名</th>
                            <th>昵称</th>
                            <th>性别</th>
                            <th>电话</th>
                            <th>城市</th>
                        </tr>
                        </thead>
                        <tbody>
                        {this.state.userList.map(function(item){
                            var gender = '男';
                            if(item.gender == 1) {
                                gender = '女';
                            }

                            return <tr>
                                <td>{item.name}</td>
                                <td>{item.nick_name}</td>
                                <td>{gender}</td>
                                <td>{item.mobile}</td>
                                <td>{item.address.city}</td>
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
    }
});

module.exports = app;

