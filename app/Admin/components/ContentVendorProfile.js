/** @jsx React.DOM */

var React = require('react');
var HidogsConstants = require('../../Common/constants/HidogsConstants');
var AppDispatcher = require('../../Common/dispatcher/AppDispatcher');

var Store = require('../stores/VendorStore');
var Actions = require('../actions/Actions');
var VendorProfileModal = require('../components/ContentVendorProfileModal');
var Header = require('./../../Common/components/Header.react.js');


function getAppState() {
    return {
        vendorList: Store.getVendorList(),
        vendor: Store.getVendor(),
        status: Store.getStatus(),
    };
}

var app = React.createClass({

    getInitialState: function() {
        return getAppState();
    },

    componentDidMount: function() {
        Store.addChangeListener(this._onChange);
        Actions.vendorGetVendorList();
    },

    componentWillUnmount: function() {
        Store.removeChangeListener(this._onChange);
    },

    render: function () {

        return (
            <div className="col-sm-9 col-sm-offset-3 col-md-10 col-md-offset-2 main">

                <VendorProfileModal vendor={this.state.vendor}/>

                <h1 className="page-header">服务伙伴列表</h1>


                <div className="table-responsive">
                    <table className="table table-striped">
                        <thead>
                        <tr>
                            <th>#</th>
                            <th>昵称</th>
                            <th>姓名</th>
                            <th>电话</th>
                            <th>电邮</th>
                            <th>状态</th>
                        </tr>
                        </thead>
                        <tbody>
                        {this.state.vendorList.map(function(item){
                            return <tr onClick={this._viewVendorProfile.bind(this, item.openid)}>
                                <td>{item.openid}</td>
                                <td>{item.nick_name}</td>
                                <td>{item.name}</td>
                                <td>{item.mobile}</td>
                                <td>{item.email}</td>
                                <td>{item.status}</td>
                            </tr>;
                        },this)}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    },

    _viewVendorProfile: function(id) {
        $('#profileModal').modal('show');
        Actions.vendorGetVendor(id);
    },

    _onChange: function() {
        this.setState(getAppState());
    }
});

module.exports = app;

