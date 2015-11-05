/** @jsx React.DOM */

var React = require('react');
var Store = require('../stores/Store');
var Actions = require('../actions/Actions');
var Uudi = require('../../../util/genuuid');
var APVTO = require('../../../util/assignpathvaluetoobject');

function getAppState() {
    return {
        editProduct: Store.getEditProduct(),
    };
};

var app = React.createClass({

    getInitialState: function() {
        return getAppState();
    },

    componentDidMount: function() {
        Store.addChangeListener(this._onChange);
    },

    componentWillUnmount: function() {
        Store.removeChangeListener(this._onChange);
    },

    render: function () {

        var titleContent = '编辑服务';
        if(this.props.type == 'new') {
            titleContent = '创建服务'
        }

        return (
            <div className="modal modal-fullscreen fade" id="productEdit" tabindex="-2" role="dialog" data-backdrop="static">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span
                                aria-hidden="true">&times;</span></button>
                            <h4 className="modal-title text-center" id="ProductEditModalTitle">{titleContent}</h4>
                        </div>

                        <div className="modal-body">
                            <h3>基本信息</h3>
                            <div className="form-group">
                                <label>服务标题</label>
                                <input type="text" className="form-control simple-input" placeholder="昵称" name="title" value={this.state.editProduct.title} onChange={this.handleChange}/>
                            </div>
                            <div className="form-group">
                                <label>服务类别</label>
                                <select className="form-control simple-input">
                                    <option>美容护理</option>
                                    <option>美容造型</option>
                                    <option>全身剃光</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>服务范围</label>
                                <textarea className="form-control no-border simple-input" rows="5" disabled>今年是二战胜利和联合国成立70周年，国际秩序也是今年国际社会讨论热点。从此次习主席访英取得的成功看，关注国际秩序并推动其向更加公正、合理的方向发展，不仅是对历史的纪念，更是当今时代发展的呼唤。</textarea>
                            </div>

                            <h3 className="hg-session">详细信息</h3>
                            <div className="form-group">
                                <label>服务地址</label>
                                <div className="row">
                                    <div className="col-xs-2"><label className="vcenter34">省份</label></div>
                                    <div className="col-xs-10"><input type="text" className="form-control simple-input" placeholder="省份" value="广东省" /></div>
                                </div>
                                <div className="row">
                                    <div className="col-xs-2"><label className="vcenter34">城市</label></div>
                                    <div className="col-xs-10"><input type="text" className="form-control simple-input"  placeholder="城市" value="广州市" /></div>
                                </div>
                                <div className="row">
                                    <div className="col-xs-2"><label className="vcenter34">区域</label></div>
                                    <div className="col-xs-10"><input type="text" className="form-control simple-input" placeholder="区域" value="海珠区" /></div>
                                </div>
                                <div className="row">
                                    <div className="col-xs-2"><label className="vcenter34">地址</label></div>
                                    <div className="col-xs-10"><input type="text" className="form-control simple-input" placeholder="具体地址" value="滨江东路418号天天小区3栋201" /></div>
                                </div>
                            </div>
                            <div className="form-group">
                                <label>服务特色</label>
                                <textarea className="form-control simple-input" rows="5">今年是二战胜利和联合国成立70周年，国际秩序也是今年国际社会讨论热点。从此次习主席访英取得的成功看，关注国际秩序并推动其向更加公正、合理的方向发展，不仅是对历史的纪念，更是当今时代发展的呼唤。</textarea>
                            </div>
                            <div className="form-group">
                                <label>服务注意事项</label>
                                <textarea className="form-control simple-input" rows="5">今年是二战胜利和联合国成立70周年，国际秩序也是今年国际社会讨论热点。从此次习主席访英取得的成功看，关注国际秩序并推动其向更加公正、合理的方向发展，不仅是对历史的纪念，更是当今时代发展的呼唤。</textarea>
                            </div>

                            <h3 className="hg-session">服务图片
                        <span>
                        </span>
                            </h3>
                            <div className="form-group">
                                <div className="row">
                                    <div className="col-xs-2"><label className="vcenter34">名称</label></div>
                                    <div className="col-xs-10"><input type="text" className="form-control no-border simple-input" placeholder="美容后站立正面图" value="美容后站立正面图"/></div>
                                </div>
                                <div className="row">
                                    <div className="col-xs-2"><label className="vcenter34">图片</label></div>
                                    <div className="col-xs-10">
                                        <form method="post" encType="multipart/form-data" action="#">
                                            <input type="file" name="datafile" />
                                        </form>
                                    </div>
                                </div>
                                <br/>
                                <div className="row">
                                    <div className="col-xs-2"><label className="vcenter34" for="vendorWorkName2">名称</label></div>
                                    <div className="col-xs-10"><input type="text" className="form-control no-border simple-input" id="vendorWorkName2" placeholder="美容后站立正面图" value="美容后站立正面图"/></div>
                                </div>
                                <div className="row">
                                    <div className="col-xs-2"><label className="vcenter34">图片</label></div>
                                    <div className="col-xs-10">
                                        <form method="post" encType="multipart/form-data" action="#">
                                            <input type="file" name="datafile" />
                                        </form>
                                    </div>
                                </div>
                            </div>

                            <h3 className="hg-session">服务设置</h3>
                            <div className="form-group">
                                <label>服务时长</label>
                                <input type="text" className="form-control simple-input" placeholder="服务时长"/>
                            </div>

                            <div className="form-group">
                                <label>服务时长</label>
                                <div className="row">
                                    <div className="col-xs-7"><input type="text" className="form-control simple-input" placeholder="项目名称"/></div>
                                    <div className="col-xs-5"><input type="text" className="form-control simple-input" placeholder="项目价格"/></div>
                                </div>
                                <div className="row voffset10">
                                    <div className="col-xs-7"><input type="text" className="form-control simple-input" placeholder="项目名称"/></div>
                                    <div className="col-xs-5"><input type="text" className="form-control simple-input" placeholder="项目价格"/></div>
                                </div>
                                <div className="row voffset10">
                                    <div className="col-xs-7"><input type="text" className="form-control simple-input" placeholder="项目名称"/></div>
                                    <div className="col-xs-5"><input type="text" className="form-control simple-input" placeholder="项目价格"/></div>
                                </div>
                                <div className="row voffset10">
                                    <div className="col-xs-7"><input type="text" className="form-control simple-input" placeholder="项目名称"/></div>
                                    <div className="col-xs-5"><input type="text" className="form-control simple-input" placeholder="项目价格"/></div>
                                </div>
                            </div>

                            <div className="form-group">
                                <label>额外服务项目</label>
                                <div className="row">
                                    <div className="col-xs-7"><input type="text" className="form-control simple-input" placeholder="项目名称"/></div>
                                    <div className="col-xs-5"><input type="text" className="form-control simple-input" placeholder="项目价格"/></div>
                                </div>
                                <div className="row voffset10">
                                    <div className="col-xs-7"><input type="text" className="form-control simple-input" placeholder="项目名称"/></div>
                                    <div className="col-xs-5"><input type="text" className="form-control simple-input" placeholder="项目价格"/></div>
                                </div>
                            </div>

                            <div className="form-group">
                                <label>退款政策</label>
                                <select className="form-control simple-input">
                                    <option>全额退款</option>
                                    <option>部分退款</option>
                                    <option>无退款安排</option>
                                </select>
                            </div>

                        </div>

                        <div className="modal-footer">
                            <button type="button" className="btn btn-default btn-hd-blue" data-dismiss="modal">关闭</button>
                            <button type="button" className="btn btn-default btn-hd-blue" onClick={this._triggerNewSave}>保存</button>
                        </div>
                    </div>
                </div>
            </div>

        );
    },

    _triggerEditSave: function() {
        Actions.triggerEditSaveToDetail();
    },

    _triggerEditCancel: function() {
        Actions.triggerEditCancelToDetail()
    },

    _triggerNewSave: function() {
        var newProduct = this.state.editProduct;
        newProduct.product_id = Uudi.uuid();

        console.log(newProduct);

        Actions.triggerNewSaveToList(newProduct);
    },

    _triggerNewCancel: function() {
        Actions.Actions.triggerNewCancelToList();
    },

    handleChange: function(event) {
        var newProduct = APVTO.assign(this.state.editProduct ,event.target.name, event.target.value)
        this.setState({editProduct: newProduct});
    },

    _onChange: function() {
        this.setState(getAppState());
    },
});

module.exports = app;

