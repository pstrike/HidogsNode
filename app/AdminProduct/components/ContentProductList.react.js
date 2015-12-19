/** @jsx React.DOM */

var React = require('react');
var HidogsConstants = require('../../Common/constants/HidogsConstants');
var AppDispatcher = require('../../Common/dispatcher/AppDispatcher');

var Store = require('../stores/VendorStore');
var Actions = require('../actions/Actions');
var Header = require('./../../Common/components/Header.react.js');


function getAppState() {
    return {
        productList: Store.getProductList(),
    };
}

var app = React.createClass({

    getInitialState: function() {
        return getAppState();
    },

    componentDidMount: function() {
        Store.addChangeListener(this._onChange);
        Actions.getProductList();
    },

    componentWillUnmount: function() {
        Store.removeChangeListener(this._onChange);
    },

    render: function () {

        return (
            <div className="col-sm-9 col-sm-offset-3 col-md-10 col-md-offset-2 main">

                <h1 className="page-header">服务列表</h1>

                <div className="table-responsive">
                    <table className="table table-striped">
                        <thead>
                        <tr>
                            <th>标题</th>
                            <th>达人</th>
                            <th>类别</th>
                            <th>状态</th>
                            <th>价格</th>
                            <th>销售数量</th>
                        </tr>
                        </thead>
                        <tbody>
                        {this.state.productList.map(function(item){

                            var categoryContent = "";
                            if(item.category.path_name) {
                                var categoryList = item.category.path_name.split(",");
                                categoryList.forEach(function(category, index) {
                                    if(index > 1) {
                                        categoryContent = categoryContent + category + ">";
                                    }
                                })
                                categoryContent = categoryContent.substring(0,categoryContent.length-1) + item.category.name;
                            }
                            else {
                                categoryContent = "未设置服务类别";
                            }

                            var priceContent = "";
                            var smallPrice = 999999999;
                            var bigPrice = 0
                            item.price.basic.forEach(function(priceItem) {
                                var price = parseInt(priceItem.price);

                                if(price > bigPrice) {
                                    bigPrice = price
                                }

                                if(price < smallPrice) {
                                    smallPrice = price
                                }
                            });
                            if(smallPrice == bigPrice) {
                                priceContent = smallPrice;
                            }
                            else if((smallPrice - bigPrice) == 999999999) {
                                priceContent = "未设置"
                            }
                            else {
                                priceContent = smallPrice + '-' + bigPrice;
                            }

                            var saleNoContent = "";
                            saleNoContent = item.sale_no
                            if(!item.sale_no) {
                                saleNoContent = 0;
                            }

                            var productLink = "http://www.hidogs.cn/product/view/userproduct?product="+item.product_id;


                            return <tr>
                                <td><a href={productLink} target="_blank">{item.title}</a></td>
                                <td>{item.vendor.vendor_name}</td>
                                <td>{categoryContent}</td>
                                <td>{item.status}</td>
                                <td>{priceContent}</td>
                                <td>{saleNoContent}</td>
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
});

module.exports = app;

