/** @jsx React.DOM */

var React = require('react');
var HidogsConstants = require('../../Common/constants/HidogsConstants');
var AppDispatcher = require('../../Common/dispatcher/AppDispatcher');

var Store = require('../stores/Store');
var Actions = require('../actions/Actions');
var ProductListItem = require('../components/ProductListItem.react');

var Header = require('./../../Common/components/Header.react');

var mapconvertor = require('../../../util/mapconverter');



var app = React.createClass({

    getInitialState: function() {
        return {
            address: {},
            location: {},
        };
    },

    componentDidMount: function() {

        var city = "";
        if(this.props.address && this.props.address.indexOf(",")>0) {
            city = this.props.address.split(",")[0];
        }

        // handle bd auto complete
        var ac = new BMap.Autocomplete(    //建立一个自动完成的对象
            {
                "input" : "suggestId",
                "location" : city,
            });

        ac.addEventListener("onconfirm", function(e) {
            var myValue;
            var _value = e.item.value;
            myValue = _value.province +  _value.city +  _value.district +  _value.street +  _value.business;

            var local = new BMap.LocalSearch(city, { //智能搜索
                onSearchComplete: function () {
                    var pp = local.getResults().getPoi(0).point;    //获取第一个智能搜索的结果

                    //console.log(pp);
                    var newPoint = mapconvertor.bd09togcj02(pp.lng, pp.lat);
                    this.handleAddressChange(_value, newPoint);

                }.bind(this)
            });
            local.search(myValue);
        }.bind(this));
    },

    render: function () {

        return (
            <div id="react_body">

                <Header hgstyle="hg-navbar"></Header>

                <div className="container">

                    <div className="page-header text-center hg-pageheader">
                        <span>Modify Location</span>
                        <h2 className="voffset0"><strong>改变我的位置</strong></h2>
                    </div>

                    <hr/>

                    <div className="row">
                        <div className="col-xs-12">
                            <div className="input-group">
                                <span className="input-group-addon no-border" id="sizing-addon2">
                                    <span className="glyphicon glyphicon-search" aria-hidden="true"></span>
                                </span>
                                <input id="suggestId" type="text" className="form-control simple-input no-border" placeholder="请输入小区、写字楼、学校、街道"/>
                            </div>
                        </div>
                    </div>

                </div>

                <footer className="footer">
                    <div className="container">
                        <div className="row text-right">
                            <div className="col-xs-12">
                                <button className="btn btn-hd-blue text-muted roffset5" onClick={this.cancel}>取消</button>
                                <button className="btn btn-hd-blue text-muted" onClick={this.submit}>确定</button>
                            </div>
                        </div>
                    </div>
                </footer>
            </div>
        );
    },

    cancel: function() {
        Actions.cancelModifyLocation();
    },

    submit: function() {
        Actions.submitModifyLocation();
        Actions.initLocation(this.state.location);
        Actions.initAddress(this.state.address.city +  this.state.address.district +  this.state.address.street +  this.state.address.business);
        Actions.initGeoProductList(this.state.location.coordinates[1], this.state.location.coordinates[0], this.props.categoryId, this.props.keyword);
    },

    handleAddressChange: function(address, point) {
        this.setState({
            address: address,
            location: {
                type: "Point",
                coordinates: point,
            }
        });
    },

});

module.exports = app;

