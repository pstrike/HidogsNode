/** @jsx React.DOM */

var React = require('react');
var HidogsConstants = require('../../Common/constants/HidogsConstants');
var AppDispatcher = require('../../Common/dispatcher/AppDispatcher');

var Store = require('../stores/Store');
var Actions = require('../actions/Actions');
var Constants = require('../constants/Constants');
var Header = require('./../../Common/components/Header.react.js');
var ProductListItem = require('../components/ProductListItem.react');
var DetailModal = require('../components/DetailModal.react');
var EditModal = require('../components/EditModal.react');
var SettingModal = require('../components/SettingModal.react');
var SettingEditModal = require('../components/SettingEditModal.react');
var CommentModal = require('../components/CommentModal.react');


function getAppState() {
    return {
        object: Store.getProductList(),
        status: Store.getStatus(),
    };
}

var app = React.createClass({

    getInitialState: function() {
        return getAppState();
    },

    componentDidMount: function() {
        Store.addChangeListener(this._onChange);
        Actions.loadProductList();
    },

    componentWillUnmount: function() {
        Store.removeChangeListener(this._onChange);
    },

    componentDidUpdate: function() {

        $('#productDetail').modal('hide');
        $('#productEdit').modal('hide');
        $('#productSetting').modal('hide');
        $('#productSettingEdit').modal('hide');
        $('#productComment').modal('hide');

        switch (this.state.status) {
            case Constants.STATE_VENDOR_PRODUCT_LIST:
                // no op
                break;

            case Constants.STATE_VENDOR_PRODUCT_DETAIL:
                $('#productDetail').modal('show');
                break;

            case Constants.STATE_VENDOR_PRODUCT_EDIT:
            case Constants.STATE_VENDOR_PRODUCT_NEW:
                $('#productEdit').modal('show');
                break;

            case Constants.STATE_VENDOR_PRODUCT_SETTING:
                $('#productSetting').modal('show');
                break;

            case Constants.STATE_VENDOR_PRODUCT_SETTING_EDIT:
                $('#productSettingEdit').modal('show');
                break;

            case Constants.STATE_VENDOR_PRODUCT_COMMENT:
                $('#productComment').modal('show');
                break;

            default:
                // no op
        }
    },

    render: function() {
        var editType = 'edit';
        if(this.state.status == Constants.STATE_VENDOR_PRODUCT_NEW) {
            editType = 'new';
        }

        return (
            <div>
                <Header subtitle="服务伙伴 - 服务管理"/>

                <DetailModal></DetailModal>
                <EditModal type={editType}></EditModal>
                <SettingModal></SettingModal>
                <SettingEditModal></SettingEditModal>
                <CommentModal></CommentModal>

                <div className="container voffset60">
                    <ul className="list-unstyled">
                        <li>
                            <ProductListItem category='美容>美容护理' status='published' title='5星级洗澡服务' price='10-20' usedNo='9'></ProductListItem>
                        </li>
                        <li>
                            <ProductListItem category='美容>美容造型' status='drafted' title='超cool贵宾造型' price='100-200' usedNo='12'></ProductListItem>
                        </li>
                    </ul>
                </div>

                <footer className="footer">
                    <div className="container">
                        <div className="row text-right">
                            <div className="col-xs-12">
                                <button className="btn btn-hd-blue text-muted roffset5" onClick={this._triggerSetting}>设置</button>
                                <button className="btn btn-hd-blue text-muted" onClick={this._triggerNew}>新建</button>
                            </div>
                        </div>
                    </div>
                </footer>

            </div>
        );
    },

    _onChange: function() {
        this.setState(getAppState());
    },

    _triggerSetting: function() {
        Actions.triggerListToSetting();
    },

    _triggerNew: function() {
        Actions.triggerListToNew();
    },

});

module.exports = app;

