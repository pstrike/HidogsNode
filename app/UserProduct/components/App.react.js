/** @jsx React.DOM */

var React = require('react');
var HidogsConstants = require('../../Common/constants/HidogsConstants');
var AppDispatcher = require('../../Common/dispatcher/AppDispatcher');

var Store = require('../stores/Store');
var Actions = require('../actions/Actions');
var Header = require('./../../Common/components/Header.react.js');


function getAppState() {
    return {
        product: Store.getProduct(),
        status: Store.getStatus()
    };
}

var app = React.createClass({

    getInitialState: function() {
        return getAppState();
    },

    componentDidMount: function() {
        Store.addChangeListener(this._onChange);

        var productId = "";
        if(!this.props.productId) {
            productId = $("#react-main-mount").attr("productid");
        }
        else {
            productId = this.props.productId;
        }

        Actions.getProduct(productId);
    },

    componentWillUnmount: function() {
        Store.removeChangeListener(this._onChange);
    },

    render: function() {
        var normalPriceContent = [];
        if(this.state.product.normal_price_list) {
            normalPriceContent = this.state.product.normal_price_list.map(function(item, i) {
                return (
                    <li>{item.name} - {item.price}元</li>
                );
            });
        };

        var additionalPriceContent = [];
        if(this.state.product.additional_price_list) {
            additionalPriceContent = this.state.product.additional_price_list.map(function(item, i) {
                return (
                    <li>{item.name} - {item.price}元</li>
                );
            });
        };

        var imageContent = [];
        if(this.state.product.image_list) {
            imageContent = this.state.product.image_list.map(function(item, i) {
                var imagePath = "../../.."+item;
                return (
                    <img src={imagePath} className="img-responsive"/>
                );
            });
        };

        var commentContent = [];
        if(this.state.product.comment_list) {
            commentContent = this.state.product.comment_list.map(function(item, i) {
                return (
                    <div>
                        <p><img src="../../../img/ppl_icon.png" className="img-circle"/>
                            {item.user_id} - {item.created_time}</p>
                        <p>{item.content}</p>
                    </div>
                );
            });
        }
        else {
            commentContent.push(<span>暂无评论</span>);
        };

        var availabilityContent = [];
        if(this.state.product.availability) {
            availabilityContent = this.state.product.availability.map(function(item, i) {
                return (
                    <li>{item.begin} - {item.end}</li>
                );
            });
        };

        return (
            <div>
                <Header/>

                <div className="container-fluid">
                    <div className="page-header">
                        <h1>{this.state.product.title}</h1>
                    </div>

                    <h3>一级类别</h3>

                    <p>{this.state.product.category ? this.state.product.category.l1 : ""}</p>

                    <h3>二级类别</h3>

                    <p>{this.state.product.category ? this.state.product.category.l2 : ""}</p>

                    <h3>基本价格</h3>
                    <ul>
                        {normalPriceContent}
                    </ul>


                    <h3>额外服务</h3>
                    <ul>
                        {additionalPriceContent}
                    </ul>

                    <h3>可预订时间</h3>
                    <ul>
                        {availabilityContent}
                    </ul>


                    <h3>用时<span className="small">(分钟)</span></h3>

                    <p>{this.state.product.duration ? this.state.product.duration.normal : ""}</p>

                    <h3>服务特色</h3>

                    <p>{this.state.product.feature}</p>

                    <h3>服务范围</h3>

                    <p>{this.state.product.scope}</p>

                    <h3>服务注意事项</h3>

                    <p>{this.state.product.notice}</p>

                    <h3>退订政策</h3>

                    <p>{this.state.product.exit}</p>

                    <h3>图片</h3>
                    {imageContent}

                    <h3>购买人数</h3>

                    <p>{this.state.product.used_no ? this.state.product.used_no : "暂无用户预订"}</p>

                    <h3>评论</h3>
                    {commentContent}

                    <div id="footer" className="container">

                        <nav className="navbar navbar-default navbar-fixed-bottom">

                            <div className="navbar-inner navbar-content-center">
                                <button className="btn btn-default" onClick={this.createOrder}>预订</button>
                            </div>

                        </nav>
                    </div>
                </div>
            </div>
        );
    },

    _onChange: function() {
        this.setState(getAppState());
    },

    createOrder: function() {
        var order = {};
        order["product_id"] = this.state.product._id;
        order["user_id"] = "1";
        order["vendor_id"] = this.state.product.owner_id;
        order["status"] = "drafted";
        order["price"] = {
            "total": 100,
            "normal": {"name": "洗澡", "price": 80},
            "addition": [
                {"name": "去结", "price": 20}
            ]
        };
        order["booked_time"] = "201510100900";
        order["commision_amt"] = order.price.total * this.state.product.commision_rate;
        order["commision_status"] = "pending";
        order["commsion_due_date"] = "201510310900";

        Actions.createOrder(order);
    }

});

module.exports = app;

