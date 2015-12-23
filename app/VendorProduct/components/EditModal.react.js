/** @jsx React.DOM */

var React = require('react');
var Store = require('../stores/Store');
var Actions = require('../actions/Actions');
var Uudi = require('../../../util/genuuid');
var APVTO = require('../../../util/assignpathvaluetoobject');
var WXPicUploader = require('./../../Common/components/WXPicUploader');
var mapconvertor = require('../../../util/mapconverter');

function getAppState() {
    return {
        editProduct: Store.getEditProduct(),
        productMeta: Store.getProductMeta(),
        vendorProfile: Store.getVendorProfile(),
        verifyMsg: Store.getProductVerifyMsg(),
    };
};

var app = React.createClass({

    getInitialState: function() {
        return getAppState();
    },

    componentDidMount: function() {
        Store.addChangeListener(this._onChange);

        //$('#productEdit').modal('show');
        showHgModal('productEdit')

        var pageHeight = $(window).height();
        var bodyHeight = pageHeight - 121;
        $('#editBody').css({"max-height": bodyHeight + 'px' });

        // avoid modal full screen bg display in front
        //$("input").focusout(function(){
        //    $("#editBody").css("z-index", 9999)
        //    //alert($("#editBody").css("z-index"));
        //});
        //
        //$("select").focusout(function(){
        //    console.log($(this).css("z-index"));
        //});
        //
        //$("textarea").focusout(function(){
        //    console.log($(this).css("z-index"));
        //});

        //$(window).resize(function() {
        //    var pageHeight = $(window).height();
        //    var bodyHeight = pageHeight - 121;
        //    $('#editBody').css({"max-height": bodyHeight + 'px' });
        //});

        // handle back event
        window.history.pushState({title: "preventback", url: "#"}, "preventback", "#");
        window.onpopstate = this._triggerCancel;

        // Set duation default option
        if(!this.state.editProduct.duration) {
            $("#durationDefaultOption").prop("selected", true)
        }

        // handle bd auto complete
        var ac = new BMap.Autocomplete(    //建立一个自动完成的对象
            {
                "input" : "suggestId",
                "location" : this.state.editProduct.address ? this.state.editProduct.address.city : "",
            });

        ac.addEventListener("onconfirm", function(e) {
            var myValue;
            var _value = e.item.value;
            myValue = _value.province +  _value.city +  _value.district +  _value.street +  _value.business;

            var local = new BMap.LocalSearch(this.state.editProduct.address ? this.state.editProduct.address.city : "", { //智能搜索
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

    componentWillUnmount: function() {
        //$('#productEdit').modal('hide');
        hideHgModal('productEdit')
        Store.removeChangeListener(this._onChange);
    },

    componentDidUpdate: function() {
        // Err Msg
        if (this.state.verifyMsg.length > 0 && this.state.isScrollToErrMsg) {
            var position = $('#editBody').scrollTop() + $('#errMsgAnchor').offset().top;

            $('#editBody').animate({
                scrollTop: position
            }, 500);

            // ensure verify msg scroll only response once
            this.setState(
                {isScrollToErrMsg: false}
            );
        };
    },

    render: function () {

        var categoryContent = [];
        categoryContent.push(<option value="" disabled>请选择服务类别</option>);
        if(this.state.productMeta.category) {
            this.state.productMeta.category.forEach(function(item) {
                categoryContent.push(<option value={item.product_meta_category_id}>{item.name}</option>);
            });
        }

        //var exitPolicyContent = [];
        //exitPolicyContent.push(<option value="" disabled>请选择服务类别</option>);
        //if(this.state.productMeta.exit_policy) {
        //    this.state.productMeta.exit_policy.forEach(function(item) {
        //        exitPolicyContent.push(<option value={item.product_meta_exit_policy_id}>{item.name}</option>);
        //    });
        //}

        var titleContent = '编辑服务';
        if(this.props.type == 'new') {
            titleContent = '创建服务'
        }

        var imageContent = [];
        if(this.state.editProduct.image_url_list) {
            for(var i=0; i<this.state.editProduct.image_url_list.length; i++) {
                var textName = "image_url_list.["+i+"].name";
                var imageName = "image_url_list.["+i+"].image_url";

                var addFlag = 'false';
                if(i == this.state.editProduct.image_url_list.length-1) {
                    addFlag = 'true';
                }

                var deleteFlag = 'true';
                if(this.state.editProduct.image_url_list.length == 1) {
                    deleteFlag = 'false';
                }

                imageContent.push(<WXPicUploader textName={textName}
                                                     imageName={imageName}
                                                     text={this.state.editProduct.image_url_list[i].name}
                                                     imageUrl={this.state.editProduct.image_url_list[i].image_url}
                                                     onChange={this.handleChange}
                                                     delete={deleteFlag}
                                                     onDelete={this._removeImage.bind(this, i)}
                                                     add={addFlag}
                                                     onAdd={this._addImage}
                                                     disabled='false'
                                                     getMedia={this._getWXPicMedia}
                    />);

                if(i != this.state.editProduct.image_url_list.length-1) {
                    imageContent.push(<hr/>);
                }
            }
        };

        var priceTypeContent = [];
        priceTypeContent.push(<option value="" disabled>请选择设置服务价格的标准</option>);
        if(this.state.editProduct.category) {
            for(var i=0; i<this.state.productMeta.category.length; i++) {
                if(this.state.editProduct.category.product_meta_category_id == this.state.productMeta.category[i].product_meta_category_id) {
                    this.state.productMeta.category[i].price_item.forEach(function(item) {
                        priceTypeContent.push(<option value={item.name}>{item.name + ' (' + item.unit + ')'}</option>);
                    });

                    break;
                }
            }
        }

        var priceBasicContent = [];
        if(this.state.editProduct.price && this.state.editProduct.price.type) {

            //var refPrice = [];
            //for(var i=0; i<this.state.editProduct.category.price_item.length; i++) {
            //    if (this.state.editProduct.price.type == this.state.editProduct.category.price_item[i].name) {
            //        refPrice = this.state.editProduct.category.price_item[i].price_list;
            //    }
            //}

            var unit = "";
            for(var i=0; i<this.state.editProduct.category.price_item.length; i++) {
                if (this.state.editProduct.price.type == this.state.editProduct.category.price_item[i].name) {
                    unit = this.state.editProduct.category.price_item[i].unit;
                }
            }

            this.state.editProduct.price.basic.forEach(function(item, index) {

                var titleName = "price.basic.["+index+"].name";
                var priceName = "price.basic.["+index+"].price";
                var upperName = "price.basic.["+index+"].upper";
                var lowerName = "price.basic.["+index+"].lower";
                //var placeHolder = "参考价格>" + refPrice[index].price + "元";

                //priceBasicContent.push(
                //    <div className="row voffset10">
                //        <div className="col-xs-7"><input type="text" className="form-control simple-input no-border" placeholder="服务名称" name={titleName} value={item.name} onChange={this.handleChange} disabled/></div>
                //        <div className="col-xs-5"><input type="number" pattern="[0-9]*" className="form-control simple-input" placeholder="服务价格" name={priceName} value={item.price} onChange={this.handleChange}/></div>
                //    </div>
                //);

                priceBasicContent.push(
                    <div className="row voffset10">
                        <div className="col-xs-3 right-padding0"><input type="text" className="form-control simple-input" placeholder={unit} name={lowerName} value={item.lower} onChange={this.handleChange}/></div>
                        <div className="col-xs-1 vcenter34 text-center left-padding0 right-padding0">至</div>
                        <div className="col-xs-3 left-padding0"><input type="text" className="form-control simple-input" placeholder={unit} name={upperName} value={item.upper} onChange={this.handleChange}/></div>
                        <div className="col-xs-5"><input type="text" className="form-control simple-input" placeholder="价格" name={priceName} value={item.price} onChange={this.handleChange}/></div>
                    </div>
                );

                if(this.state.editProduct.price.basic.length == 1) {
                    priceBasicContent.push(<div className="row voffset10"><div className="col-xs-12 text-right">
                        <button className="btn btn-hd-blue btn-sm" onClick={this._addBasicPrice}>继续添加</button>
                    </div></div>);
                }
                else {
                    if(index == this.state.editProduct.price.basic.length-1) {
                        priceBasicContent.push(<div className="row voffset10"><div className="col-xs-12 text-right">
                            <button className="btn btn-hd-blue btn-sm roffset5" onClick={this._removeBasicPrice.bind(this, index)}>删除</button>
                            <button className="btn btn-hd-blue btn-sm" onClick={this._addBasicPrice}>继续添加</button>
                        </div></div>);
                    }
                    else {
                        priceBasicContent.push(<div className="row voffset10"><div className="col-xs-12 text-right">
                            <button className="btn btn-hd-blue btn-sm" onClick={this._removeBasicPrice.bind(this, index)}>删除</button>
                        </div></div>);
                    }
                }

            }.bind(this));
        }

        var priceAdditionalContent = [];
        if(this.state.editProduct.price) {
            for(var i=0; i < this.state.editProduct.price.additional.length; i++) {
                var titleName = "price.additional.["+i+"].name";
                var priceName = "price.additional.["+i+"].price";

                var style = "row"
                if(i > 0) {
                    style = "row voffset10";
                }

                priceAdditionalContent.push(
                    <div className={style}>
                        <div className="col-xs-7"><input type="text" className="form-control simple-input" placeholder="服务名称" name={titleName} value={this.state.editProduct.price.additional[i].name} onChange={this.handleChange}/></div>
                        <div className="col-xs-5"><input type="number" pattern="[0-9]*" className="form-control simple-input" placeholder="服务价格(元)" name={priceName} value={this.state.editProduct.price.additional[i].price} onChange={this.handleChange}/></div>
                    </div>
                );

                if(this.state.editProduct.price.additional.length == 1) {
                    priceAdditionalContent.push(<div className="row voffset10"><div className="col-xs-12 text-right">
                        <button className="btn btn-hd-blue btn-sm" onClick={this._addAdditionalPrice}>继续添加</button>
                    </div></div>);
                }
                else {
                    if(i == this.state.editProduct.price.additional.length-1) {
                        priceAdditionalContent.push(<div className="row voffset10"><div className="col-xs-12 text-right">
                            <button className="btn btn-hd-blue btn-sm roffset5" onClick={this._removeAdditionalPrice.bind(this, i)}>删除</button>
                            <button className="btn btn-hd-blue btn-sm" onClick={this._addAdditionalPrice}>继续添加</button>
                        </div></div>);
                    }
                    else {
                        priceAdditionalContent.push(<div className="row voffset10"><div className="col-xs-12 text-right">
                            <button className="btn btn-hd-blue btn-sm" onClick={this._removeAdditionalPrice.bind(this, i)}>删除</button>
                        </div></div>);
                    }
                }

            }
        }

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

        var defaultNoticeContent = "";
        if(this.state.productMeta.other) {
            defaultNoticeContent = <div className="instruction" dangerouslySetInnerHTML={{__html: this.state.productMeta.other[2].value}}></div>;
        }

        // address
        var addressContent = "";
        if(this.state.editProduct.address.district) {
            addressContent = (this.state.editProduct.address.city ? this.state.editProduct.address.city : "") +
                (this.state.editProduct.address.district ? this.state.editProduct.address.district : "") +
                (this.state.editProduct.address.street ? this.state.editProduct.address.street : "") +
                (this.state.editProduct.address.business ? this.state.editProduct.address.business : "");
        }

        // delete Btn
        var deleteBtnContent = <button type="button" className="btn btn-default btn-hd-blue roffset5" onClick={this._triggerDelete}>删除</button>;
        if(this.props.type == 'new') {
            deleteBtnContent = "";
        }

        //var refundPolicy = <div className="form-group">
        //    <label>退款政策</label>
        //    <select className="form-control simple-input" name="exit_policy" value={this.state.editProduct.exit_policy ? this.state.editProduct.exit_policy.product_meta_exit_policy_id : ""} onChange={this.handleChange}>
        //        {exitPolicyContent}
        //    </select>
        //</div>;

        //return (
        //    <div className="modal modal-fullscreen fade" id="productEdit" tabindex="-2" role="dialog" data-backdrop="static">
        //        <div className="modal-dialog" role="document">
        //            <div className="modal-content">
        //                <div className="modal-header">
        //                    <button type="button" className="close" onClick={this._triggerCancel}><span
        //                        aria-hidden="true">&times;</span></button>
        //                    <h4 className="modal-title text-center" id="ProductEditModalTitle">{titleContent}</h4>
        //                </div>
        //
        //                <div className="modal-body" id="editBody">
        //
        //                    <h3>基本信息</h3>
        //                    <div className="form-group">
        //                        <label>服务标题</label>
        //                        <input type="text" className="form-control simple-input" placeholder="标题" name="title" value={this.state.editProduct.title} onChange={this.handleChange}/>
        //                    </div>
        //                    <div className="form-group">
        //                        <label>服务类别</label>
        //                        <select className="form-control simple-input" name="category" value={this.state.editProduct.category ? this.state.editProduct.category.product_meta_category_id : ""} onChange={this.handleChange}>
        //                            {categoryContent}
        //                        </select>
        //                    </div>
        //                    <div className="form-group">
        //                        <label>服务范围</label>
        //                        <blockquote>
        //                            <p className="instruction">服务范围会根据服务类别自动生成</p>
        //                        </blockquote>
        //                        <textarea className="form-control no-border simple-input" rows="5" value={this.state.editProduct.category ? this.state.editProduct.category.scope : ""} disabled></textarea>
        //                    </div>
        //
        //                    <div className="form-group">
        //                        <label>工作室地址</label>
        //                        <blockquote>
        //                            <p className="instruction">默认的地址为您的个人地址,您可以对其进行修改</p>
        //                        </blockquote>
        //                        <div className="row">
        //                            <div className="col-xs-2"><label className="vcenter34">省份</label></div>
        //                            <div className="col-xs-10"><input type="text" className="form-control simple-input" placeholder="省份" name="address.province" value={this.state.editProduct.address ? this.state.editProduct.address.province : ""} onChange={this.handleChange}/></div>
        //                        </div>
        //                        <div className="row">
        //                            <div className="col-xs-2"><label className="vcenter34">城市</label></div>
        //                            <div className="col-xs-10"><input type="text" className="form-control simple-input"  placeholder="城市" name="address.city" value={this.state.editProduct.address ? this.state.editProduct.address.city : ""} onChange={this.handleChange}/></div>
        //                        </div>
        //                        <div className="row">
        //                            <div className="col-xs-2"><label className="vcenter34">区域</label></div>
        //                            <div className="col-xs-10"><input type="text" className="form-control simple-input" placeholder="区域" name="address.region" value={this.state.editProduct.address ? this.state.editProduct.address.region : ""} onChange={this.handleChange}/></div>
        //                        </div>
        //                        <div className="row">
        //                            <div className="col-xs-2"><label className="vcenter34">地址</label></div>
        //                            <div className="col-xs-10"><input type="text" className="form-control simple-input" placeholder="具体地址" name="address.address" value={this.state.editProduct.address ? this.state.editProduct.address.address : ""} onChange={this.handleChange}/></div>
        //                        </div>
        //                    </div>
        //                    <div className="form-group">
        //                        <label>服务特色</label>
        //                        <textarea className="form-control simple-input" rows="5" placeholder="突出您的服务特点可以更好的帮助用户做出选择" name="feature" value={this.state.editProduct.feature} onChange={this.handleChange}></textarea>
        //                    </div>
        //                    <div className="form-group">
        //                        <label>预订注意事项</label>
        //                        <blockquote>
        //                            <p className="instruction">您可以根据您的情况对以下预设的预订注意事项进行修改</p>
        //                        </blockquote>
        //                        <textarea className="form-control simple-input" rows="5" placeholder="在用户选择您的服务时,有什么需要注意的?" name="notice" value={this.state.editProduct.notice} onChange={this.handleChange}></textarea>
        //                    </div>
        //
        //                    <h3 className="hg-session">图片展示</h3>
        //                    <blockquote>
        //                        <p className="instruction">添加可以展现您服务的特色图片可以让用户更好的了解您的服务. 例如: 美容造型前后的图片, 特别的配饰等. 将您最有特色的图片排放在前3张, 它们会得到最好的展示.</p>
        //                    </blockquote>
        //
        //                    {imageContent}
        //
        //                    <h3 className="hg-session">服务设置</h3>
        //                    <div className="form-group">
        //                        <label>服务时长(分钟)</label>
        //                        <input type="text" className="form-control simple-input" placeholder="服务时长" name="duration" value={this.state.editProduct.duration} onChange={this.handleChange}/>
        //                    </div>
        //
        //                    <div className="form-group">
        //                        <label>价格设置(元)</label>
        //                        <blockquote>
        //                            <p className="instruction">选择服务类别后即可设置服务基础价格. 如果您只专注于某一项服务的价格(例如: 体重小于10攻击的狗狗美容),您只需要设置该类别,其他类别价格留空即可.</p>
        //                        </blockquote>
        //                        <select className="form-control simple-input" name="price.type" value={this.state.editProduct.price ? this.state.editProduct.price.type : ""} onChange={this.handleChange}>
        //                            {priceTypeContent}
        //                        </select>
        //                        {priceBasicContent}
        //                    </div>
        //
        //                    <div className="form-group">
        //                        <label>附加服务价格设置(元)</label>
        //                        <blockquote>
        //                            <p className="instruction">如果您在基本的服务范围外还能提供额外的附加服务,可以在此设置</p>
        //                        </blockquote>
        //                        {priceAdditionalContent}
        //                    </div>
        //
        //                    {verifyMsgContent}
        //
        //                </div>
        //
        //                <div className="modal-footer">
        //                    <button type="button" className="btn btn-default btn-hd-blue" onClick={this._triggerCancel}>关闭</button>
        //                    <button type="button" className="btn btn-default btn-hd-blue" onClick={this._triggerSave}>保存</button>
        //                </div>
        //            </div>
        //        </div>
        //    </div>
        //
        //);

        return <div id="productEdit" className="hg-modal container-fluid">
            <div className="hg-modal-header row">
                <div className="col-xs-2 text-left hg-modal-header-close">
                    <button type="button" className="close"><span
                        aria-hidden="true" onClick={this._triggerCancel}>&times;</span></button>
                </div>
                <div className="col-xs-8 text-center hg-modal-title"><h4>{titleContent}</h4></div>
                <div className="col-xs-2 text-center hg-modal-title"></div>
            </div>

            <div className="hg-modal-body text-left" id="editBody">
                <h3>基本信息</h3>
                <div className="form-group">
                    <label>服务标题</label>
                    <input type="text" className="form-control simple-input" placeholder="标题" name="title" value={this.state.editProduct.title} onChange={this.handleChange}/>
                </div>
                <div className="form-group">
                    <label>服务类别</label>
                    <select className="form-control simple-input" name="category" value={this.state.editProduct.category ? this.state.editProduct.category.product_meta_category_id : ""} onChange={this.handleChange}>
                        {categoryContent}
                    </select>
                </div>
                <div className="form-group">
                    <label>服务范围</label>
                    <blockquote>
                        <p className="instruction">服务范围会根据服务类别自动生成</p>
                    </blockquote>
                    <textarea className="form-control no-border simple-input" rows="5" value={this.state.editProduct.category ? this.state.editProduct.category.scope : ""} disabled></textarea>
                </div>

                <div className="form-group">
                    <label>工作室地址</label>
                    <blockquote>
                        <p className="instruction">默认的地址为您的个人地址,您可以对其进行修改</p>
                    </blockquote>
                    <div className="row">
                        <div className="col-xs-2"><label className="vcenter34">搜索</label></div>
                        <div className="col-xs-10">
                            <div className="input-group">
                                <span className="input-group-addon" id="sizing-addon2">
                                    <span className="glyphicon glyphicon-search" aria-hidden="true"></span>
                                </span>
                                <input id="suggestId" type="text" className="form-control simple-input" placeholder="请输入关键字来搜索地址"/>
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-xs-2"><label className="vcenter34">地址</label></div>
                        <div className="col-xs-10">
                            <input type="text" className="form-control simple-input no-border" placeholder="请通过搜索结果来选择地址" value={addressContent} disabled/>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-xs-2"><label className="vcenter34"></label></div>
                        <div className="col-xs-10">
                            <input type="text" className="form-control simple-input" placeholder="补充楼号、门牌号等详细信息" name="address.additional" value={this.state.editProduct.address ? this.state.editProduct.address.additional : ""} onChange={this.handleChange}/>
                        </div>
                    </div>
                </div>
                <div className="form-group">
                    <label>服务特色</label>
                    <textarea className="form-control simple-input" rows="5" placeholder="突出您的服务特点可以更好的帮助用户做出选择" name="feature" value={this.state.editProduct.feature} onChange={this.handleChange}></textarea>
                </div>
                <div className="form-group">
                    <label>预订注意事项</label>
                    <blockquote>
                        <p className="instruction">
                            除了以下预设的注意事项,您还有什么需要用户注意或者知道的?
                            {defaultNoticeContent}
                        </p>
                    </blockquote>
                    <textarea className="form-control simple-input" rows="5" placeholder="在用户选择您的服务时,还有什么需要注意的?" name="notice" value={this.state.editProduct.notice} onChange={this.handleChange}></textarea>
                </div>

                <h3 className="hg-session">图片展示</h3>
                <blockquote>
                    <p className="instruction">添加可以展现您服务的特色图片可以让用户更好的了解您的服务. 例如: 美容造型前后的图片, 特别的配饰等. 将您最有特色的图片排放在前3张, 它们会得到最好的展示.</p>
                </blockquote>

                {imageContent}

                <h3 className="hg-session">服务设置</h3>
                <div className="form-group">
                    <label>服务时长(分钟)</label>
                    <select className="form-control simple-input" name="duration" value={this.state.editProduct.duration} onChange={this.handleChange}>
                        <option id="durationDefaultOption" value="0" disabled>请选择服务时长</option>
                        <option value="30">30分钟</option>
                        <option value="60">1个小时</option>
                        <option value="90">1个半小时</option>
                        <option value="120">2个小时</option>
                        <option value="150">2个半小时</option>
                        <option value="180">3个小时</option>
                        <option value="210">3个半小时</option>
                        <option value="240">4个小时</option>
                        <option value="270">4个半小时</option>
                        <option value="300">5个小时</option>
                        <option value="330">5个半小时</option>
                        <option value="360">6个小时</option>
                        <option value="390">6个半小时</option>
                        <option value="420">7个小时</option>
                        <option value="450">7个半小时</option>
                        <option value="480">8个小时</option>
                    </select>
                </div>

                <div className="form-group">
                    <label>价格设置(元)</label>
                    <blockquote>
                        <p className="instruction">请先选择"服务类别"及"价格标准"来开始您的价格设置</p>
                    </blockquote>
                    <select className="form-control simple-input" name="price.type" value={this.state.editProduct.price ? this.state.editProduct.price.type : ""} onChange={this.handleChange}>
                        {priceTypeContent}
                    </select>
                    {priceBasicContent}
                </div>

                <div className="form-group">
                    <label>附加服务价格设置(元)</label>
                    <blockquote>
                        <p className="instruction">如果您在基本的服务范围外还能提供额外的附加服务,可以在此设置</p>
                    </blockquote>
                    {priceAdditionalContent}
                </div>

                {verifyMsgContent}
            </div>

            <div className="hg-modal-footer text-right row">
                <div className="col-xs-12">
                    <button type="button" className="btn btn-default btn-hd-blue roffset5" onClick={this._triggerCancel}>关闭</button>
                    {deleteBtnContent}
                    <button type="button" className="btn btn-default btn-hd-blue" onClick={this._triggerSave}>保存</button>
                </div>
            </div>
        </div>;
    },

    _triggerSave: function() {
        var verifyMsg = this.verify();

        if(verifyMsg.length == 0) {
            var product = this.state.editProduct;
            product.status = "drafted";

            if(this.props.type == 'new') {
                product.commision_rate = this.state.productMeta.other[0].value;
                product.vendor.vendor_id = this.state.vendorProfile.vendorId;
                product.vendor.vendor_name = this.state.vendorProfile.vendorNickname;
                product.vendor.head_image_url = this.state.vendorProfile.vendorHeadImageUrl;
                product.product_id = Uudi.uuid();

                Actions.triggerNewSaveToDetail(product);
            }
            else {
                Actions.triggerEditSaveToDetail(product);
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

    _triggerCancel: function() {
        if(this.props.type == 'new') {
            Actions.triggerNewCancelToList();

        }
        else {
            Actions.triggerEditCancelToDetail()
        }

    },

    _triggerDelete: function() {
        if(confirm("您确定要删除该服务吗?")) {
            var newProduct = {};
            newProduct.product_id = this.state.editProduct.product_id;
            newProduct.status = "deleted";

            Actions.triggerEditDeleteToList(newProduct);
        }
    },

    handleChange: function(event) {
        var value = event.target.value;

        switch (event.target.name) {
            case "category":
                for(var i=0; i<this.state.productMeta.category.length; i++) {
                    if(event.target.value == this.state.productMeta.category[i].product_meta_category_id) {
                        value =  this.state.productMeta.category[i];

                        // reset price & type
                        var newProduct = APVTO.assign(this.state.editProduct, "price", {
                            basic: [
                                {name: "", price: "", upper: "", lower: ""},
                            ],
                            additional: [
                                {name: "", price: ""},
                            ],
                            type: "",
                        })
                        this.setState({editProduct: newProduct});

                        break;
                    }
                }
                break;

            case "price.type":
                if(this.state.editProduct.category.name) {

                    for(var i=0; i<this.state.editProduct.category.price_item.length; i++) {
                        if(event.target.value == this.state.editProduct.category.price_item[i].name) {
                            value = this.state.editProduct.category.price_item[i].name;

                            //var newBasicPrice = [];
                            //this.state.editProduct.category.price_item[i].price_list.forEach(function(item) {
                            //    newBasicPrice.push({name: item.name, price: "", show_name: item.show_name});
                            //})
                            //
                            //var priceProduct = APVTO.assign(this.state.editProduct, "price.basic", newBasicPrice)
                            //this.setState({editProduct: priceProduct});

                            // reset price & set price unit
                            var newProduct = APVTO.assign(this.state.editProduct, "price", {
                                basic: [
                                    {name: "", price: "", upper: "", lower: ""},
                                ],
                                additional: [
                                    {name: "", price: ""},
                                ],
                                unit: this.state.editProduct.category.price_item[i].unit,
                            })
                            this.setState({editProduct: newProduct});

                            break;
                        }
                    }
                }
                break;

            //case "exit_policy":
            //    for(var i=0; i<this.state.productMeta.exit_policy.length; i++) {
            //        if(event.target.value == this.state.productMeta.exit_policy[i].product_meta_exit_policy_id) {
            //            value =  this.state.productMeta.exit_policy[i];
            //            break;
            //        }
            //    }
            //    break;

            default:
                // do nothing
        }

        var newProduct = APVTO.assign(this.state.editProduct ,event.target.name, value)
        this.setState({editProduct: newProduct});

        // special handling for price basic price, automatically generate price name base on upper, lower and unit
        if(event.target.name.indexOf("price.basic") > -1) {
            var priceBasicParam = event.target.name.split(".");
            var priceBasicName = priceBasicParam[0] + "." + priceBasicParam[1] + "." + priceBasicParam[2] + ".name";

            var basicIndex = parseInt(priceBasicParam[2].substr(1,priceBasicParam[2].length-2));
            var priceItem = this.state.editProduct.price.basic[basicIndex];
            var priceBasicContent = this.state.editProduct.price.type
                + "在"
                + priceItem.lower
                + "-"
                + priceItem.upper
                + this.state.editProduct.price.unit
                + "之间";

            var newProduct = APVTO.assign(this.state.editProduct ,priceBasicName, priceBasicContent)
            this.setState({editProduct: newProduct});
        }
    },

    handleAddressChange: function(address, point) {
        var newProduct = this.state.editProduct;
        newProduct.address.city = address.city;
        newProduct.address.district = address.district;
        newProduct.address.street = address.street;
        newProduct.address.street_number = address.streetNumber;
        newProduct.address.business = address.business;

        newProduct.location.type = "Point";
        newProduct.location.coordinates = point;

        this.setState({editProduct: newProduct});
    },

    _addImage: function () {
        var product = this.state.editProduct;
        if(!product.image_url_list) {
            product.image_url_list = [{}];
        }
        else {
            product.image_url_list.push({});
        }
        this.setState({editProduct: product});
    },

    _removeImage: function (index) {
        var product = this.state.editProduct;
        product.image_url_list.splice(index,1);
        this.setState({editProduct: product});
    },

    _addBasicPrice: function() {
        var product = this.state.editProduct;
        if(!product.price.basic) {
            product.price.basic = [{}];
        }
        else {
            product.price.basic.push({});
        }

        this.setState({editProduct: product});
    },

    _removeBasicPrice: function (index) {
        var product = this.state.editProduct;
        product.price.basic.splice(index,1);
        this.setState({editProduct: product});
    },

    _addAdditionalPrice: function() {
        var product = this.state.editProduct;
        if(!product.price.additional) {
            product.price.additional = [{}];
        }
        else {
            product.price.additional.push({});
        }

        this.setState({editProduct: product});
    },

    _removeAdditionalPrice: function (index) {
        var product = this.state.editProduct;
        product.price.additional.splice(index,1);
        this.setState({editProduct: product});
    },

    _getWXPicMedia: function(pic, mediaId, name, type) {
        Actions.uploadWXPicture(mediaId, name, type);

        var newProduct = APVTO.assign(this.state.editProduct, name, pic);
        this.setState({editProduct: newProduct});
    },

    verify: function() {
        var verifyMsg = [];

        if(!this.state.editProduct.title) {
            verifyMsg.push("-请填写服务标题");
        }

        //if(!this.state.editProduct.category.name) {
        //    verifyMsg.push("-请选择服务类别");
        //}
        //
        //if(!this.state.editProduct.address.address) {
        //    verifyMsg.push("-请填写详细的工作室地址");
        //}
        //
        //if(!this.state.editProduct.duration) {
        //    verifyMsg.push("-请填写服务时长");
        //}
        var productDurationReg = new RegExp("^[0-9]*$");
        if(!productDurationReg.test(this.state.editProduct.duration.trim())) {
            verifyMsg.push("-您输入的服务时长有误,请确保仅输入数字");
        }
        //
        //var counter = 0;
        //this.state.editProduct.price.basic.forEach(function(item){
        //    if(!item.price) {
        //        counter++;
        //    }
        //})
        //if(counter == this.state.editProduct.price.basic.length) {
        //    verifyMsg.push("-您还没设置服务价格");
        //}
        //
        var isAdditionalPriceInvalid = false;
        this.state.editProduct.price.additional.forEach(function(item){
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
        var isRangeNoInvalid = false;
        var isRangeInvalid = false;
        this.state.editProduct.price.basic.forEach(function(item){

            if(!item.upper || !item.lower || !item.price) {
                if(item.upper || item.lower || item.price) {
                    // check when there is one item is inputted; ignore all blank item case
                    isRangeInvalid = true;
                }
            }
            else {
                // if price items are inpuuted, check whether it is a valid number
                if(!priceReg.test(item.price.trim())) {
                    isPriceInvalid = true;
                }

                if(!priceReg.test(item.upper.trim())) {
                    isRangeNoInvalid = true;
                }

                if(!priceReg.test(item.lower.trim())) {
                    isRangeNoInvalid = true;
                }
            }

        })
        this.state.editProduct.price.additional.forEach(function(item){
            if(!priceReg.test(item.price.trim())) {
                isPriceInvalid = true;
            }
        })
        if(isPriceInvalid) {
            verifyMsg.push("-您输入的服务价格有误,请确保仅输入数字");
        }
        if(isRangeNoInvalid) {
            verifyMsg.push("-您在设置服务价格时输入的服务体重/身高有误");
        }
        if(isRangeInvalid) {
            verifyMsg.push("-在设置服务价格时,请确保填写了服务体重/身高/价格");
        }

        if(this.state.editProduct.price.type) {
            //var refPrice = [];
            //for(var i=0; i<this.state.editProduct.category.price_item.length; i++) {
            //    if (this.state.editProduct.price.type == this.state.editProduct.category.price_item[i].name) {
            //        refPrice = this.state.editProduct.category.price_item[i].price_list;
            //    }
            //}

            var refPrice = this.state.editProduct.category.lowest_price;

            this.state.editProduct.price.basic.forEach(function(item){
                var baseline = parseInt(refPrice);

                if(parseInt(item.price) < baseline) {
                    verifyMsg.push('-请调整"'+item.name+'"的价格(不低于'+refPrice+'元)');
                }
            })
        }

        //if(!this.state.editProduct.exit_policy.name) {
        //    verifyMsg.push("-请选择退款政策");
        //}

        return verifyMsg;
    },

    _onChange: function() {
        this.setState(getAppState());
    },
});

module.exports = app;

