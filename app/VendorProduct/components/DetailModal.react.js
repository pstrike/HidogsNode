/** @jsx React.DOM */

var React = require('react');
var Actions = require('../actions/Actions');
var CommentItem = require('../components/CommentItem.react');

var app = React.createClass({

    render: function () {

        return (
            <div className="modal modal-fullscreen fade" id="productDetail" tabindex="-2" role="dialog"
                 data-backdrop="static">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button type="button" className="close" onClick={this._onCancel}><span
                                aria-hidden="true">&times;</span></button>
                            <h4 className="modal-title text-center" id="ProductDetailModalTitle">服务详情</h4>
                        </div>

                        <div className="modal-body">
                            <h3>基本信息</h3>

                            <div className="form-group">
                                <label>标题</label>
                                <input type="text" className="form-control no-border" placeholder="标题" value="5星级洗澡服务"
                                       disabled/>
                            </div>
                            <div className="form-group">
                                <label>类别</label>
                                <input type="text" className="form-control no-border" placeholder="类别" value="美容 > 美容护理"
                                       disabled/>
                            </div>
                            <div className="form-group">
                                <label>服务范围</label>
                                <textarea className="form-control no-border" rows="5" disabled>今年是二战胜利和联合国成立70周年，国际秩序也是今年国际社会讨论热点。从此次习主席访英取得的成功看，关注国际秩序并推动其向更加公正、合理的方向发展，不仅是对历史的纪念，更是当今时代发展的呼唤。</textarea>
                            </div>
                            <div className="form-group">
                                <label>服务订购数量</label>
                                <input type="text" className="form-control no-border" placeholder="服务订购数量" value="3"
                                       disabled/>
                            </div>

                            <h3 className="hg-session">详细信息</h3>

                            <div className="form-group">
                                <label>服务地址</label>

                                <div className="row">
                                    <div className="col-xs-2"><label className="vcenter34">省份</label></div>
                                    <div className="col-xs-10"><input type="text" className="form-control no-border"
                                                                      placeholder="省份" value="广东省" disabled/></div>
                                </div>
                                <div className="row">
                                    <div className="col-xs-2"><label className="vcenter34">城市</label></div>
                                    <div className="col-xs-10"><input type="text" className="form-control no-border"
                                                                      placeholder="城市" value="广州市" disabled/></div>
                                </div>
                                <div className="row">
                                    <div className="col-xs-2"><label className="vcenter34">区域</label></div>
                                    <div className="col-xs-10"><input type="text" className="form-control no-border"
                                                                      placeholder="区域" value="海珠区" disabled/></div>
                                </div>
                                <div className="row">
                                    <div className="col-xs-2"><label className="vcenter34">地址</label></div>
                                    <div className="col-xs-10"><input type="text" className="form-control no-border"
                                                                      placeholder="具体地址" value="滨江东路418号天天小区3栋201"
                                                                      disabled/></div>
                                </div>
                            </div>
                            <div className="form-group">
                                <label>服务特色</label>
                                <textarea className="form-control no-border" rows="5" disabled>今年是二战胜利和联合国成立70周年，国际秩序也是今年国际社会讨论热点。从此次习主席访英取得的成功看，关注国际秩序并推动其向更加公正、合理的方向发展，不仅是对历史的纪念，更是当今时代发展的呼唤。</textarea>
                            </div>
                            <div className="form-group">
                                <label>注意事项</label>
                                <textarea className="form-control no-border" rows="5" disabled>今年是二战胜利和联合国成立70周年，国际秩序也是今年国际社会讨论热点。从此次习主席访英取得的成功看，关注国际秩序并推动其向更加公正、合理的方向发展，不仅是对历史的纪念，更是当今时代发展的呼唤。</textarea>
                            </div>
                            <div className="form-group">
                                <label>服务图片</label>

                                <div className="row">
                                    <div className="col-xs-2"><label className="vcenter34">名称</label></div>
                                    <div className="col-xs-10"><input type="text" className="form-control no-border"
                                                                      placeholder="写点什么描述您的图片" value="洗澡前" disabled/>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-xs-2"><label className="vcenter34">图片</label></div>
                                    <div className="col-xs-10">
                                        <img className="img-responsive" src="../../img/image_placeholer.png"/>
                                    </div>
                                </div>
                                <br/>

                                <div className="row">
                                    <div className="col-xs-2"><label className="vcenter34">名称</label></div>
                                    <div className="col-xs-10"><input type="text" className="form-control no-border"
                                                                      placeholder="写点什么描述您的图片" value="洗澡后" disabled/>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-xs-2"><label className="vcenter34">图片</label></div>
                                    <div className="col-xs-10">
                                        <img className="img-responsive" src="../../img/image_placeholer.png"/>
                                    </div>
                                </div>
                            </div>

                            <h3 className="hg-session">服务设置</h3>

                            <div className="form-group">
                                <label>服务时长</label>
                                <input type="text" className="form-control no-border" placeholder="服务时长" value="65分钟"
                                       disabled/>
                            </div>
                            <div className="form-group">
                                <label>服务价格</label>

                                <div className="row">
                                    <div className="col-xs-7"><input type="text" className="form-control no-border"
                                                                     placeholder="价格名称" value="4公斤以内" disabled/></div>
                                    <div className="col-xs-5"><input type="text" className="form-control no-border"
                                                                     placeholder="价格" value="60元" disabled/></div>
                                </div>
                                <div className="row voffset5">
                                    <div className="col-xs-7"><input type="text" className="form-control no-border"
                                                                     placeholder="价格名称" value="4公斤起-5公斤" disabled/>
                                    </div>
                                    <div className="col-xs-5"><input type="text" className="form-control no-border"
                                                                     placeholder="价格" value="60元" disabled/></div>
                                </div>
                                <div className="row voffset5">
                                    <div className="col-xs-7"><input type="text" className="form-control no-border"
                                                                     placeholder="价格名称" value="5公斤起-6公斤" disabled/>
                                    </div>
                                    <div className="col-xs-5"><input type="text" className="form-control no-border"
                                                                     placeholder="价格" value="60元" disabled/></div>
                                </div>
                                <div className="row voffset5">
                                    <div className="col-xs-7"><input type="text" className="form-control no-border"
                                                                     placeholder="价格名称" value="6公斤起-10公斤" disabled/>
                                    </div>
                                    <div className="col-xs-5"><input type="text" className="form-control no-border"
                                                                     placeholder="价格" value="60元" disabled/></div>
                                </div>
                            </div>
                            <div className="form-group">
                                <label>额外服务价格</label>

                                <div className="row">
                                    <div className="col-xs-7"><input type="text" className="form-control no-border"
                                                                     placeholder="额外价格名称" value="接送服务" disabled/></div>
                                    <div className="col-xs-5"><input type="text" className="form-control no-border"
                                                                     placeholder="价格" value="60元" disabled/></div>
                                </div>
                                <div className="row voffset5">
                                    <div className="col-xs-7"><input type="text" className="form-control no-border"
                                                                     placeholder="额外价格名称" value="高级沐浴露" disabled/></div>
                                    <div className="col-xs-5"><input type="text" className="form-control no-border"
                                                                     placeholder="价格" value="60元" disabled/></div>
                                </div>
                            </div>

                            <h3 className="hg-session">服务评价</h3>
                            <ul className="list-unstyled">
                                <li>
                                    <CommentItem></CommentItem>
                                    <hr/>
                                </li>

                                <li>
                                    <CommentItem></CommentItem>
                                </li>

                            </ul>
                            <div className="text-center">
                                <button className="btn btn-hd-blue btn-sm" onClick={this._triggerComment}>
                                    查看其他11条评论
                                </button>
                            </div>

                        </div>

                        <div className="modal-footer">
                            <button type="button" className="btn btn-default btn-hd-blue" onClick={this._onCancel}>
                                关闭
                            </button>
                            <button type="button" className="btn btn-default btn-hd-blue" onClick={this._triggerEdit}>
                                编辑
                            </button>
                            <button type="button" className="btn btn-default btn-hd-blue" onClick={this._triggerPreview}>预览
                            </button>
                        </div>
                    </div>
                </div>
            </div>

        );
    },

    _triggerEdit: function() {
        Actions.triggerDetailToEdit();
    },

    _triggerComment: function() {
        Actions.triggerDetailToComment();
    },

    _triggerPreview: function() {
        Actions.triggerDetailToPreview();
    },

    _onCancel: function() {
        Actions.triggerDetailToList();
    },
});

module.exports = app;

