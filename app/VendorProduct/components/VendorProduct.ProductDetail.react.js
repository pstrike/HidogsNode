/** @jsx React.DOM */

var React = require('react');
var HidogsActions = require('../actions/VendorProdutActions');

var ProductDetail = React.createClass({

    render: function() {
        var normalPriceContent = [];
        if(this.props.product.normal_price_list) {
            normalPriceContent = this.props.product.normal_price_list.map(function(item, i) {
                return (
                    <li>{item.name} - {item.price}元</li>
                );
            });
        };

        var additionalPriceContent = [];
        if(this.props.product.additional_price_list) {
            additionalPriceContent = this.props.product.additional_price_list.map(function(item, i) {
                return (
                    <li>{item.name} - {item.price}元</li>
                );
            });
        };

        var imageContent = [];
        if(this.props.product.image_list) {
            imageContent = this.props.product.image_list.map(function(item, i) {
                var imagePath = "../../.."+item;
                return (
                    <img src={imagePath} className="img-responsive"/>
                );
            });
        };

        var commentContent = [];
        if(this.props.product.comment_list) {
            commentContent = this.props.product.comment_list.map(function(item, i) {
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

        return (
            <div className="modal modal-fullscreen fade" id="ProductDetailModal" tabindex="-2" role="dialog"
                 aria-labelledby="ProductDetailModalLabel" data-backdrop="static">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button type="button" className="close" onClick={this._onCancel} aria-label="Close"><span
                                aria-hidden="true">&times;</span></button>
                            <h4 className="modal-title" id="ProductDetailModalTitle">服务详情</h4>
                        </div>

                        <div className="modal-body">
                            <h1>{this.props.product.title}</h1>
                            <input type="text"/>

                            <h3>一级类别</h3>

                            <p>{this.props.product.category?this.props.product.category.l1:""}</p>

                            <h3>二级类别</h3>

                            <p>{this.props.product.category?this.props.product.category.l2:""}</p>

                            <h3>基本价格</h3>
                            <ul>
                                {normalPriceContent}
                            </ul>


                            <h3>额外服务</h3>

                            <ul>
                                {additionalPriceContent}
                            </ul>

                            <h3>用时<span className="small">(分钟)</span></h3>

                            <p>{this.props.product.duration?this.props.product.duration.normal:""}</p>

                            <h3>服务特色</h3>

                            <p>{this.props.product.feature}</p>

                            <h3>服务范围</h3>

                            <p>{this.props.product.scope}</p>

                            <h3>服务注意事项</h3>

                            <p>{this.props.product.notice}</p>

                            <h3>退订政策</h3>

                            <p>{this.props.product.exit}</p>

                            <h3>图片</h3>
                            {imageContent}

                            <h3>购买人数</h3>
                            <p>{this.props.product.used_no?this.props.product.used_no:"暂无用户预订"}</p>

                            <h3>评论</h3>
                            {commentContent}

                        </div>

                    </div>

                    <div className="modal-footer">
                        <button type="button" className="btn btn-default"
                                onClick={this._onCancel}>关闭
                        </button>
                    </div>
                </div>
            </div>

        );
    },

    _onCancel: function () {
        $('#ProductDetailModal').modal('hide');
        HidogsActions.vendorProductViewProductList();
    },
});

module.exports = ProductDetail;