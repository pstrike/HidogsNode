/** @jsx React.DOM */

var React = require('react');
var HidogsConstants = require('../../Common/constants/HidogsConstants');
var AppDispatcher = require('../../Common/dispatcher/AppDispatcher');

var Store = require('../stores/Store');
var Actions = require('../actions/Actions');
var ProductListItem = require('../components/ProductListItem.react');

var Header = require('./../../Common/components/Header.react');

var app = React.createClass({

    componentDidMount: function() {

        // init tab
        var tabs = $('#hgFilter button');
        tabs.click(function() {
            tabs.removeClass('btn-hd-active')
            var el = $(this);
            el.addClass('btn-hd-active');
        })
    },

    render: function () {

        // type content
        var addressContent = <div>
            <i className="fa fa-star roffset2"></i>
            全城热门
        </div>;

        if(this.props.type == 'geo') {
            addressContent = <i className="fa fa-spinner fa-spin"></i>;

            if(this.props.address) {
                addressContent = <div>
                    <i className="fa fa-map-marker roffset2"></i>
                    {this.props.address}
                </div>;
            }
        }

        // footer content
        var footerContent = "";
        if(this.props.type == 'geo') {
            footerContent = <footer className="footer">
                <div className="container">
                    <div className="row">
                        <div className="col-xs-12 text-right">
                            <button className="btn btn-hd-blue text-muted roffset5">更改地点</button>
                        </div>
                    </div>
                </div>
            </footer>;
        }

        return (
            <div id="react_body">

                <Header hgstyle="hg-navbar"></Header>

                <div className="container">

                    <div className="page-header text-center hg-pageheader">
                        <h4>Grooming</h4>

                        <h2 className="voffset10">
                            <i className="fa fa-certificate"></i>
                            <strong>{this.props.category}</strong>
                        </h2>

                        <div className="row text-center">
                            {addressContent}
                        </div>
                        <div id="hgFilter" className="btn-group voffset25" role="group">
                            <button type="button" className="btn btn-default btn-hd-blue btn-hd-active" onClick={this.sortByScore}>评分</button>
                            <button type="button" className="btn btn-default btn-hd-blue" onClick={this.sortBySaleNo}>销量</button>
                            <button type="button" className="btn btn-default btn-hd-blue" onClick={this.sortByDistance}>距离</button>
                            <button type="button" className="btn btn-default btn-hd-blue" onClick={this.sortByPrice}>价格</button>
                        </div>
                    </div>

                    <hr/>

                    {this.props.productList.map(function(item) {
                        return <ProductListItem product={item}></ProductListItem>
                    }.bind(this))}

                </div>

                {footerContent}
            </div>
        );
    },

    sortByScore: function() {
        Actions.sortByScore();
    },

    sortBySaleNo: function() {
        Actions.sortBySaleNo();
    },

    sortByDistance: function() {
        Actions.sortByDistance();
    },

    sortByPrice: function() {
        Actions.sortByPrice();
    },

});

module.exports = app;

