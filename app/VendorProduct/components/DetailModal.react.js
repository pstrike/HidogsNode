/** @jsx React.DOM */

var React = require('react');
var Actions = require('../actions/Actions');
var Store = require('../stores/Store');
var CommentItem = require('../components/CommentItem.react');

function getAppState() {
    return {
        product: Store.getProduct(),
        verifyMsg: Store.getProductVerifyMsg(),
        vendorProfile: Store.getVendorProfile(),
    };
};

var app = React.createClass({

    getInitialState: function() {
        return getAppState();
    },

    componentDidMount: function() {
        Store.addChangeListener(this._onChange);

        //$('#productDetail').modal('show');
        showHgModal('productDetail')

        // set modal body height
        var pageHeight = $(window).height();
        var bodyHeight = pageHeight - 121;
        $('#detailBody').css({"max-height": bodyHeight + 'px' });

        // handle back event
        window.history.pushState({title: "preventback", url: "#"}, "preventback", "#");
        window.onpopstate = this._onCancel;
    },

    componentWillUnmount: function() {
        //$('#productDetail').modal('hide');
        hideHgModal('productDetail')
        Store.removeChangeListener(this._onChange);
    },

    componentDidUpdate: function() {
        if (this.state.verifyMsg.length > 0 && this.state.isScrollToErrMsg) {
            var position = $('#detailBody').scrollTop() + $('#errMsgAnchor').offset().top;

            $('#detailBody').animate({
                scrollTop: position
            }, 500);

            // ensure verify msg scroll only response once
            this.setState(
                {isScrollToErrMsg: false}
            );
        };
    },

    render: function () {

        var categoryContent = "";
        if(this.state.product.category.path_name) {
            var categoryList = this.state.product.category.path_name.split(",");
            var categoryContent = "";
            categoryList.forEach(function(category, index) {
                if(index > 1) {
                    categoryContent = categoryContent + category + ">";
                }
            })
            categoryContent = categoryContent.substring(0,categoryContent.length-1) + this.state.product.category.name;
        }

        var additionalPriceContent = [];
        if(this.state.product.price) {
            if(this.state.product.price.additional.length == 1 && !this.state.product.price.additional[0].name) {
                    additionalPriceContent.push(<div className="row"><div className="col-xs-12">无额外项目</div></div>);
            }
            else {
                this.state.product.price.additional.map(function(item, index) {
                    var style = "row voffset5";
                    if(index == 0) {
                        style = "row";
                    }

                    additionalPriceContent.push(<div className={style}>
                        <div className="col-xs-7"><input type="text" className="form-control no-border"
                                                         placeholder="价格名称" value={item.name} disabled/>
                        </div>
                        <div className="col-xs-5"><input type="text" className="form-control no-border"
                                                         placeholder="价格" value={item.price} disabled/></div>
                    </div>);
                })
            }
        }

        var basicPriceContent = [];
        if(this.state.product.price) {
            this.state.product.price.basic.map(function(item, index) {
                if(item.price) {
                    var style = "row voffset5";
                    if(index == 0) {
                        style = "row";
                    }

                    basicPriceContent.push(<div className={style}>
                        <div className="col-xs-7"><input type="text" className="form-control no-border"
                                                         placeholder="价格名称" value={item.name} disabled/>
                        </div>
                        <div className="col-xs-5"><input type="text" className="form-control no-border"
                                                         placeholder="价格" value={item.price} disabled/></div>
                    </div>);
                }
            })
        }

        var commentContent = [];
        if(this.state.product.comment_list) {
            if(this.state.product.comment_list.length == 0) {
                commentContent.push(<li>暂无评论</li>);
            }

            for(var i=0; i<this.state.product.comment_list.length; i++) {
                commentContent.push(<li>
                    <CommentItem
                        author="大白"
                        createdTime="2015/10/31"
                        star="3"
                        authorImage="../../img/ppl_icon.png"
                        content="我家波波有幸被抽中免费体验洗白白y∩__∩y 当然要回敬一个点评以表感激。其实我是住在这附近，这店开了很久了，就在马路边，很容易找到。"></CommentItem>
                    <hr/>
                </li>);
            }
        }

        var publishWithdrawBtn = "";
        if(this.state.product.status == "published") {
            publishWithdrawBtn = <button type="button" className="btn btn-default btn-hd-blue" onClick={this._onWithdraw}>下线</button>;
        }
        else {
            publishWithdrawBtn = <button type="button" className="btn btn-default btn-hd-blue" onClick={this._onPublish}>发布</button>;
        }

        var refundPolicy = <div className="form-group">
            <label>退款政策</label>
            <input type="text" className="form-control no-border" placeholder="退款政策" value={this.state.product.exit_policy ? this.state.product.exit_policy.name : ""} disabled/>
        </div>;

        var verifyMsgContent = "";
        if(this.state.verifyMsg.length > 0) {
            verifyMsgContent = <div className="text-right">
                <p className="bg-danger text-danger verification-msg voffset30">
                    <strong>请根据以下提示, 补充、修改服务内容:</strong><br/>
                    {this.state.verifyMsg.map(function(item) {
                        return <span>{item}<br/></span>;
                    })}
                </p>
                <div id="errMsgAnchor"></div>
            </div>;
        }

        var statusLabelClass = 'label label-default';
        var statusContent = '样例';
        var footerContent = <div className="col-xs-10">
            <button type="button" className="btn btn-default btn-hd-blue roffset5" onClick={this._onCancel}>
                关闭
            </button>
            <button type="button" className="btn btn-default btn-hd-blue roffset5" onClick={this._triggerPreview.bind(this, this.state.product.product_id)}>
                预览
            </button>
        </div>;
        if(this.state.vendorProfile.vendorId == this.state.product.vendor.vendor_id) {
            footerContent = <div className="col-xs-10">
                <button type="button" className="btn btn-default btn-hd-blue roffset5" onClick={this._onCancel}>
                    关闭
                </button>
                <button type="button" className="btn btn-default btn-hd-blue roffset5" onClick={this._triggerEdit}>
                    编辑
                </button>
                <button type="button" className="btn btn-default btn-hd-blue roffset5" onClick={this._triggerPreview.bind(this, this.state.product.product_id)}>
                    预览
                </button>
                {publishWithdrawBtn}
            </div>;

            if(this.state.product.status == "published") {
                statusLabelClass = 'label label-success';
                statusContent = '已发布';
            }
            else {
                statusLabelClass = 'label label-danger';
                statusContent = '未发布'
            }
        }

        //return (
        //    <div className="modal modal-fullscreen fade" id="productDetail" tabindex="-2" role="dialog"
        //         data-backdrop="static">
        //        <div className="modal-dialog" role="document">
        //            <div className="modal-content">
        //                <div className="modal-header">
        //                    <button type="button" className="close" onClick={this._onCancel}><span
        //                        aria-hidden="true">&times;</span></button>
        //                    <h4 className="modal-title text-center" id="ProductDetailModalTitle">服务详情</h4>
        //                </div>
        //
        //                <div className="modal-body" id="detailBody">
        //                    <h3>基本信息</h3>
        //
        //                    <div className="form-group">
        //                        <label>服务标题</label>
        //                        <input type="text" className="form-control no-border" placeholder="标题" value={this.state.product.title}
        //                               disabled/>
        //                    </div>
        //                    <div className="form-group">
        //                        <label>服务类别</label>
        //                        <input type="text" className="form-control no-border" placeholder="类别" value={categoryContent} disabled/>
        //                    </div>
        //                    <div className="form-group">
        //                        <label>服务范围</label>
        //                        <textarea className="form-control no-border" rows="5" value={this.state.product.category ? this.state.product.category.scope : ""} disabled></textarea>
        //                    </div>
        //                    <div className="form-group">
        //                        <label>用户预订服务次数</label>
        //                        <input type="text" className="form-control no-border" placeholder="0" value={this.state.product.sale_no} disabled/>
        //                    </div>
        //
        //                    <div className="form-group">
        //                        <label>工作室地址</label>
        //
        //                        <div className="row">
        //                            <div className="col-xs-2"><label className="vcenter34">省份</label></div>
        //                            <div className="col-xs-10"><input type="text" className="form-control no-border"
        //                                                              placeholder="省份" value={this.state.product.address ? this.state.product.address.province : ""} disabled/></div>
        //                        </div>
        //                        <div className="row">
        //                            <div className="col-xs-2"><label className="vcenter34">城市</label></div>
        //                            <div className="col-xs-10"><input type="text" className="form-control no-border"
        //                                                              placeholder="城市" value={this.state.product.address ? this.state.product.address.city : ""} disabled/></div>
        //                        </div>
        //                        <div className="row">
        //                            <div className="col-xs-2"><label className="vcenter34">区域</label></div>
        //                            <div className="col-xs-10"><input type="text" className="form-control no-border"
        //                                                              placeholder="区域" value={this.state.product.address ? this.state.product.address.region : ""} disabled/></div>
        //                        </div>
        //                        <div className="row">
        //                            <div className="col-xs-2"><label className="vcenter34">地址</label></div>
        //                            <div className="col-xs-10"><input type="text" className="form-control no-border"
        //                                                              placeholder="具体地址" value={this.state.product.address ? this.state.product.address.address : ""}
        //                                                              disabled/></div>
        //                        </div>
        //                    </div>
        //                    <div className="form-group">
        //                        <label>服务特色</label>
        //                        <textarea className="form-control no-border" rows="5" value={this.state.product.feature} disabled></textarea>
        //                    </div>
        //                    <div className="form-group">
        //                        <label>预订注意事项</label>
        //                        <textarea className="form-control no-border" rows="5" value={this.state.product.notice} disabled></textarea>
        //                    </div>
        //                    <div className="form-group">
        //                        <label>图片展示</label>
        //
        //                        {this.state.product.image_url_list ? this.state.product.image_url_list.map(function(item){
        //                            if(item.name == "" && item.image_url == "") {
        //                                return <p>您还没添加图片</p>;
        //                            }
        //                            else {
        //                                return <div>
        //                                    <div className="row">
        //                                        <div className="col-xs-2"><label className="vcenter34">名称</label></div>
        //                                        <div className="col-xs-10"><input type="text" className="form-control no-border"
        //                                                                          placeholder="名称" value={item.name} disabled/></div>
        //                                    </div>
        //                                    <div className="row">
        //                                        <div className="col-xs-2"><label className="vcenter34">图片</label></div>
        //                                        <div className="col-xs-10">
        //                                            <img className="img-responsive" src={item.image_url ? item.image_url : '../../../img/image_placeholer.png'}/>
        //                                        </div>
        //                                    </div>
        //                                    <br/>
        //                                </div>;
        //                            }
        //
        //                        }) : ""}
        //                    </div>
        //
        //                    <h3 className="hg-session">服务设置</h3>
        //
        //                    <div className="form-group">
        //                        <label>服务时长(分钟)</label>
        //                        <input type="text" className="form-control no-border" placeholder="服务时长" value={this.state.product.duration} disabled/>
        //                    </div>
        //                    <div className="form-group">
        //                        <label>价格设置(元)</label>
        //
        //                        {basicPriceContent}
        //                    </div>
        //
        //                    <div className="form-group">
        //                        <label>附加服务价格设置(元)</label>
        //
        //                        {additionalPriceContent}
        //                    </div>
        //
        //                    <h3 className="hg-session">用户评价</h3>
        //                    <ul className="list-unstyled">
        //                        {commentContent}
        //                    </ul>
        //
        //                </div>
        //
        //                <div className="modal-footer">
        //                    <div className="row">
        //                        <div className="col-xs-2 text-left">
        //                            <span className={statusLabelClass}>{statusContent}</span>
        //                        </div>
        //                        <div className="col-xs-10">
        //                            <button type="button" className="btn btn-default btn-hd-blue" onClick={this._onCancel}>
        //                                关闭
        //                            </button>
        //                            <button type="button" className="btn btn-default btn-hd-blue" onClick={this._triggerEdit}>
        //                                编辑
        //                            </button>
        //                            <button type="button" className="btn btn-default btn-hd-blue" onClick={this._triggerPreview.bind(this, this.state.product.product_id)}>
        //                                预览
        //                            </button>
        //                            {publishWithdrawBtn}
        //                        </div>
        //                    </div>
        //                </div>
        //            </div>
        //        </div>
        //    </div>
        //
        //);

        return <div id="productDetail" className="hg-modal container-fluid">
            <div className="hg-modal-header row">
                <div className="col-xs-2 text-left hg-modal-header-close">
                    <button type="button" className="close"><span
                        aria-hidden="true" onClick={this._onCancel}>&times;</span></button>
                </div>
                <div className="col-xs-8 text-center hg-modal-title"><h4>服务详情</h4></div>
                <div className="col-xs-2 text-center hg-modal-title"></div>
            </div>

            <div className="hg-modal-body text-left"  id="detailBody">
                <h3>基本信息</h3>

                <div className="form-group">
                    <label>服务标题</label>
                    <input type="text" className="form-control no-border" placeholder="标题" value={this.state.product.title}
                           disabled/>
                </div>
                <div className="form-group">
                    <label>服务类别</label>
                    <input type="text" className="form-control no-border" placeholder="类别" value={categoryContent} disabled/>
                </div>
                <div className="form-group">
                    <label>服务范围</label>
                    <textarea className="form-control no-border" rows="5" value={this.state.product.category ? this.state.product.category.scope : ""} disabled></textarea>
                </div>
                <div className="form-group">
                    <label>用户预订服务次数</label>
                    <input type="text" className="form-control no-border" placeholder="0" value={this.state.product.sale_no} disabled/>
                </div>

                <div className="form-group">
                    <label>工作室地址</label>

                    <div className="row">
                        <div className="col-xs-2"><label className="vcenter34">省份</label></div>
                        <div className="col-xs-10"><input type="text" className="form-control no-border"
                                                          placeholder="省份" value={this.state.product.address ? this.state.product.address.province : ""} disabled/></div>
                    </div>
                    <div className="row">
                        <div className="col-xs-2"><label className="vcenter34">城市</label></div>
                        <div className="col-xs-10"><input type="text" className="form-control no-border"
                                                          placeholder="城市" value={this.state.product.address ? this.state.product.address.city : ""} disabled/></div>
                    </div>
                    <div className="row">
                        <div className="col-xs-2"><label className="vcenter34">区域</label></div>
                        <div className="col-xs-10"><input type="text" className="form-control no-border"
                                                          placeholder="区域" value={this.state.product.address ? this.state.product.address.region : ""} disabled/></div>
                    </div>
                    <div className="row">
                        <div className="col-xs-2"><label className="vcenter34">地址</label></div>
                        <div className="col-xs-10"><input type="text" className="form-control no-border"
                                                          placeholder="具体地址" value={this.state.product.address ? this.state.product.address.address : ""}
                                                          disabled/></div>
                    </div>
                </div>
                <div className="form-group">
                    <label>服务特色</label>
                    <textarea className="form-control no-border" rows="5" value={this.state.product.feature} disabled></textarea>
                </div>
                <div className="form-group">
                    <label>预订注意事项</label>
                    <textarea className="form-control no-border" rows="5" value={this.state.product.notice} disabled></textarea>
                </div>
                <div className="form-group">
                    <label>图片展示</label>

                    {this.state.product.image_url_list ? this.state.product.image_url_list.map(function(item){
                        if(item.name == "" && item.image_url == "") {
                            return <p>您还没添加图片</p>;
                        }
                        else {
                            return <div>
                                <div className="row">
                                    <div className="col-xs-2"><label className="vcenter34">名称</label></div>
                                    <div className="col-xs-10"><input type="text" className="form-control no-border"
                                                                      placeholder="名称" value={item.name} disabled/></div>
                                </div>
                                <div className="row">
                                    <div className="col-xs-2"><label className="vcenter34">图片</label></div>
                                    <div className="col-xs-10">
                                        <img className="img-responsive" src={item.image_url ? item.image_url : '../../../img/image_placeholer.png'}/>
                                    </div>
                                </div>
                                <br/>
                            </div>;
                        }

                    }) : ""}
                </div>

                <h3 className="hg-session">服务设置</h3>

                <div className="form-group">
                    <label>服务时长(分钟)</label>
                    <input type="text" className="form-control no-border" placeholder="服务时长" value={this.state.product.duration} disabled/>
                </div>
                <div className="form-group">
                    <label>价格设置(元)</label>

                    {basicPriceContent}
                </div>

                <div className="form-group">
                    <label>附加服务价格设置(元)</label>

                    {additionalPriceContent}
                </div>

                <h3 className="hg-session">用户评价</h3>
                <ul className="list-unstyled">
                    {commentContent}
                </ul>

                {verifyMsgContent}
            </div>

            <div className="hg-modal-footer text-right row">
                <div className="col-xs-12">
                    <div className="row">
                        <div className="col-xs-2 text-left">
                            <span className={statusLabelClass}>{statusContent}</span>
                        </div>
                        {footerContent}
                    </div>
                </div>
            </div>
        </div>;

        //<div className="text-center voffset15">
        //    <button className="btn btn-hd-blue btn-sm" onClick={this._triggerComment}>
        //        查看其他11条评论
        //    </button>
        //</div>
    },

    _triggerEdit: function() {
        var newProduct = {}; // for published product to reset status to "drafted"

        if(this.state.product.status == "published") {
            if(confirm("对已经发布的服务进行编辑后服务会自动下线.你需要在编辑完后再次发布.")) {
                newProduct.product_id = this.state.product.product_id;
                newProduct.status = "drafted";

                Actions.triggerDetailToEdit(newProduct);
            }
        }
        else {
            Actions.triggerDetailToEdit(newProduct);
        }
    },

    _triggerComment: function() {
        Actions.triggerDetailToComment();
    },

    _triggerPreview: function(productId) {
        Actions.triggerDetailToPreview(productId);
    },

    _onPublish: function() {
        var verifyMsg = this._verify();

        if(verifyMsg.length == 0) {
            if(confirm("您确定要发布服务吗?")) {
                var newProduct = {};
                newProduct.product_id = this.state.product.product_id;
                newProduct.status = "published";

                Actions.publishProduct(newProduct);
            }
        }
        else {
            // scroll to err msg
            this.setState(
                {isScrollToErrMsg: true}
            );

            Actions.verifyProduct(verifyMsg);
        }


    },

    _onWithdraw: function() {
        if(confirm("您确定要下线服务吗?")) {
            var newProduct = {};
            newProduct.product_id = this.state.product.product_id;
            newProduct.status = "drafted";

            Actions.withdrawProduct(newProduct);
        }
    },

    _verify: function() {
        var verifyMsg = [];

        if(!this.state.product.title) {
            verifyMsg.push("-请填写服务标题");
        }

        if(!this.state.product.category.name) {
            verifyMsg.push("-请选择服务类别");
        }

        if(!this.state.product.address.address) {
            verifyMsg.push("-请填写详细的工作室地址");
        }

        if(!this.state.product.duration) {
            verifyMsg.push("-请填写服务时长");
        }
        else {
            var numberReg = new RegExp("^[0-9]*$");
            if(!numberReg.test(this.state.product.duration.trim())) {
                verifyMsg.push("-您输入的服务时长有误,请确保仅输入数字");
            }
        }

        var counter = 0;
        this.state.product.price.basic.forEach(function(item){
            if(!item.price) {
                counter++;
            }
        })
        if(counter == this.state.product.price.basic.length) {
            verifyMsg.push("-您还没设置服务价格");
        }

        var isAdditionalPriceInvalid = false;
        this.state.product.price.additional.forEach(function(item){
            if(item.name && !item.price) {
                isAdditionalPriceInvalid = true;
            }

            if(item.price && !item.name) {
                isAdditionalPriceInvalid = true;
            }
        })
        if(isAdditionalPriceInvalid) {
            verifyMsg.push("-请检查附加服务价格项目名称及价格是否正确填写");
        }

        var priceReg = new RegExp("^[0-9]*$");
        var isPriceInvalid = false;
        this.state.product.price.basic.forEach(function(item){
            if(!priceReg.test(item.price.trim())) {
                isPriceInvalid = true;
            }
        })
        this.state.product.price.additional.forEach(function(item){
            if(!priceReg.test(item.price.trim())) {
                isPriceInvalid = true;
            }
        })
        if(isPriceInvalid) {
            verifyMsg.push("-您输入的服务价格有误,请确保仅输入数字");
        }

        if(this.state.product.price.type) {
            var refPrice = [];
            for(var i=0; i<this.state.product.category.price_item.length; i++) {
                if (this.state.product.price.type == this.state.product.category.price_item[i].name) {
                    refPrice = this.state.product.category.price_item[i].price_list;
                }
            }
            this.state.product.price.basic.forEach(function(item, index){
                var baseline = parseInt(refPrice[index].price);

                if(parseInt(item.price) < baseline) {
                    verifyMsg.push('-请调整"'+item.name+'"的价格(不低于'+refPrice[index].price+'元)');
                }
            }.bind(this))
        }

        if(!this.state.product.feature) {
            verifyMsg.push("-请填写服务特色让用户更好的了解您的服务");
        }

        var isImageInValid = true;
        this.state.product.image_url_list.forEach(function(item){
            if(item.image_url) {
                isImageInValid = false;
            }
        })
        if(isImageInValid) {
            verifyMsg.push("-请上传服务相关的图片让用户更好的了解您的服务");
        }

        return verifyMsg;
    },

    _onCancel: function() {
        Actions.triggerDetailToList();
    },

    _onChange: function() {
        this.setState(getAppState());
    },
});

module.exports = app;

