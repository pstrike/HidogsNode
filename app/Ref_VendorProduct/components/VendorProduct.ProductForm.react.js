/** @jsx React.DOM */

var React = require('react');
var HidogsActions = require('../actions/VendorProdutActions');
var VendorProductConstants = require('../constants/VendorProductConstants');
var UploadFile = require('../components/FileUpload.react');
var Store = require('../stores/FileUploadStore');

var ProductForm = React.createClass({

    getInitialState: function() {
        return {
            basicCost: 1,
            additionalCost: 1,
            scopeContent: "",
        };
    },

    componentDidUpdate: function () {
        if(this.props.status == VendorProductConstants.VENDOR_PRODUCT_STORE_STATE_EDIT) {
            this.refs.title.getDOMNode().value = this.props.product ? this.props.product.title : "";
        }
    },

    render: function () {
        var title;

        var status = this.props.status;

        if(status == VendorProductConstants.VENDOR_PRODUCT_STORE_STATE_NEW)
            title = "创建新的服务";
        else
            title = "修改服务";

        var meta = this.props.meta;
        var categoryContent = [];
        categoryContent.push(<option>请选择服务类别</option>);
        if(meta) {
            if(meta.category) {
                categoryContent.push(meta.category.map(function(item, i){
                    return <option>{item.l2}</option>
                }));
            }
        }

        var exitContent = [];
        exitContent.push(<option>请选择服务类别</option>);
        if(meta) {
            if(meta.category) {
                exitContent.push(meta.exit.map(function(item, i){
                    return <option>{item.name}</option>
                }));
            }
        }

        var basicCostContent = [];
        for(var i=0; i<this.state.basicCost; i++) {
            var refTitle = "basicPriceTitle"+i;
            var refInput = "basicPrice"+i;
            basicCostContent.push(<div className="form-inline">
                <input type="text" className="form-control"
                       placeholder="费用名称" ref={refTitle}/>
                <input type="text" className="form-control"
                       placeholder="费用" ref={refInput}/>
            </div>);
        }

        var additionaCostContent = [];
        for(var i=0; i<this.state.additionalCost; i++) {
            var refTitle = "additionalPriceTitle"+i;
            var refInput = "additionalPrice"+i;
            additionaCostContent.push(<div className="form-inline">
                <input type="text" className="form-control"
                       placeholder="费用名称" ref={refTitle}/>
                <input type="text" className="form-control"
                       placeholder="费用" ref={refInput}/>
            </div>);
        }

        return (
            <div className="modal modal-fullscreen fade" id="productFormModal" tabindex="-1" role="dialog"
                 aria-labelledby="myModalLabel" data-backdrop="static">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button type="button" className="close" onClick={this._onCancel}
                                    aria-label="Close"><span
                                aria-hidden="true">&times;</span></button>
                            <h4 className="modal-title">{title}</h4>
                        </div>
                        <div className="modal-body">
                            <div className="form-group">
                                <label for="productInputName">标题</label>
                                <input type="text" className="form-control" placeholder="标题" ref="title"/>
                            </div>

                            <div className="form-group">
                                <label for="productInputCategory">服务类别</label>
                                <select className="form-control" ref="category" onChange={this._setScopeContent}>
                                    {categoryContent}
                                </select>
                                <p>服务范围: {this.state.scopeContent}</p>
                            </div>

                            <div className="form-group">
                                <label for="productInputPrice">基本价格</label>
                                {basicCostContent}
                                <button type="button" className="btn btn-default" onClick={this._addBaiscCostItem}><span
                                    className="glyphicon glyphicon-plus" aria-hidden="true"></span></button>
                            </div>

                            <div className="form-group">
                                <label for="productInputPrice">额外价格</label>
                                {additionaCostContent}
                                <button type="button" className="btn btn-default" onClick={this._addAdditionalCostItem}>
                                    <span className="glyphicon glyphicon-plus" aria-hidden="true"></span></button>
                            </div>

                            <div className="form-group">
                                <label for="productInputName">标签
                                    <small>(用逗号分隔)</small>
                                </label>
                                <input type="text" className="form-control" placeholder="标签" ref="tag"/>
                            </div>

                            <div className="form-group">
                                <label for="productInputName">服务用时
                                    <small>(分钟)</small>
                                </label>
                                <input type="text" className="form-control" placeholder="服务用时" ref="duration"/>
                            </div>

                            <div className="form-group">
                                <label for="productInputDescription">服务特色</label>
                                <textarea className="form-control" rows="5" placeholder="服务特色" ref="feature"></textarea>
                            </div>

                            <div className="form-group">
                                <label for="productInputDescription">服务注意事项</label>
                                <textarea className="form-control" rows="5" placeholder="服务注意事项"
                                          ref="notice"></textarea>
                            </div>

                            <div className="form-group">
                                <label for="productInputCategory">退订政策</label>
                                <select className="form-control" ref="exit">
                                    {exitContent}
                                </select>
                            </div>

                            <UploadFile/>

                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-primary"
                                    onClick={this._onSubmit}>提交
                            </button>
                            <button type="button" className="btn btn-default"
                                    onClick={this._onCancel}>关闭
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    },

    _onCancel: function () {
        this._resetAdditionalCostItem();
        this._resetBasicCostItem();
        $('#productFormModal').modal('hide');
        HidogsActions.vendorProductViewProductList();
    },

    _onSubmit: function () {
        $('#productFormModal').modal('hide');

        var status = this.props.status;
        var product = this._wrapProductFromForm();

        switch (status) {
            case VendorProductConstants.VENDOR_PRODUCT_STORE_STATE_NEW:
                HidogsActions.vendorProductNewProduct(product);
                break;

            case VendorProductConstants.VENDOR_PRODUCT_STORE_STATE_EDIT:
                HidogsActions.vendorProductEditProduct(product);
                break;

            default :
        };

    },

    _wrapProductFromForm: function () {
        var product = {
            title: this.refs.title.getDOMNode().value,
            tag: this.refs.tag.getDOMNode().value,
            feature: this.refs.feature.getDOMNode().value,
            scope: this.state.scopeContent,
            notice: this.refs.notice.getDOMNode().value,
            exit: this.refs.exit.getDOMNode().value,
        };

        product["category"] = {l1:"美容", l2:this.refs.category.getDOMNode().value};
        product["duration"] = {normal:this.refs.duration.getDOMNode().value};
        product["commision_rate"] = this.props.product?this.props.product.commision_rate:this.props.meta.commision_rate;
        product["owner_id"] = "1";

        var basicPrice = [];
        for(var i=0; i<this.state.basicCost; i++) {
            if(this.refs["basicPriceTitle"+i].getDOMNode().value) {
                basicPrice.push({name:this.refs["basicPriceTitle"+i].getDOMNode().value, price:this.refs["basicPrice"+i].getDOMNode().value});
            }
        }
        product["normal_price_list"] = basicPrice;

        var additionalPrice = [];
        for(var i=0; i<this.state.additionalCost; i++) {
            if(this.refs["additionalPriceTitle"+i].getDOMNode().value) {
                additionalPrice.push({name:this.refs["additionalPriceTitle"+i].getDOMNode().value, price:this.refs["additionalPrice"+i].getDOMNode().value});
            }
        }
        product["additional_price_list"] = additionalPrice;

        var picList = Store.getPicList();
        var productImageList = [];
        for(var i=0; i<picList.length; i++) {
            productImageList.push(picList[i].url);
        }
        product["image_list"] = productImageList;

        if(this.props.status != VendorProductConstants.VENDOR_PRODUCT_STORE_STATE_NEW) {
            product["_id"] = this.props.product ? this.props.product._id: "";
        }

        return product;
    },

    _addAdditionalCostItem: function() {
        var acItemCount = parseInt(this.state.additionalCost);
        acItemCount++;
        this.setState({additionalCost: acItemCount})
    },

    _addBaiscCostItem: function() {
        var basicItemCount = parseInt(this.state.basicCost);
        basicItemCount++;
        this.setState({basicCost: basicItemCount})
    },

    _resetAdditionalCostItem: function() {
        this.setState({additionalCost: 1})
    },

    _resetBasicCostItem: function() {
        this.setState({basicCost: 1})
    },

    _setScopeContent: function() {
        var meta = this.props.meta;
        var category = this.refs.category.getDOMNode().value;
        var scopeContent = "";
        for(var i=0; i<meta.category.length; i++) {
            if(category == meta.category[i].l2) {
                scopeContent = meta.category[i].scope;
            }
        }
        this.setState({scopeContent: scopeContent})
    },

});

module.exports = ProductForm;
