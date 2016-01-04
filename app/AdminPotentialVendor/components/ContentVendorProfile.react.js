/** @jsx React.DOM */

var React = require('react');
var HidogsConstants = require('../../Common/constants/HidogsConstants');
var AppDispatcher = require('../../Common/dispatcher/AppDispatcher');

var Store = require('../stores/VendorStore');
var Actions = require('../actions/Actions');
var Header = require('./../../Common/components/Header.react.js');


function getAppState() {
    return {
        vendorList: Store.getVendorList(),
    };
}

var app = React.createClass({

    getInitialState: function() {
        return getAppState();
    },

    componentDidMount: function() {
        Store.addChangeListener(this._onChange);
        Actions.getVendorList();
    },

    componentWillUnmount: function() {
        Store.removeChangeListener(this._onChange);
    },

    render: function () {

        return (
            <div className="col-sm-9 col-sm-offset-3 col-md-10 col-md-offset-2 main">

                <h1 className="page-header">潜在达人列表</h1>

                <div className="table-responsive">
                    <table className="table table-striped">
                        <thead>
                        <tr>
                            <th>姓名</th>
                            <th>性别</th>
                            <th>地址</th>
                            <th>电话</th>
                            <th>推荐人姓名</th>
                            <th>推荐人电话</th>
                        </tr>
                        </thead>
                        <tbody>
                        {this.state.vendorList.map(function(item){
                            return <tr>
                                <td>{item.name}</td>
                                <td>{item.gender}</td>
                                <td>{item.address}</td>
                                <td>{item.mobile}</td>
                                <td>{item.refer_name}</td>
                                <td>{item.refer_mobile}</td>
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

