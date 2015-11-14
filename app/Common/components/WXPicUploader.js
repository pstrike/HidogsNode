/** @jsx React.DOM */

var React = require('react');

var WXPicUploader = React.createClass({

    getInitialState: function() {
        return {
            isShowSpinner: false,
        };
    },

    render: function() {
        var deleteBtn = "";
        if(this.props.delete == 'true') {
            deleteBtn = <button className="btn btn-hd-blue btn-sm roffset5" onClick={this.props.onDelete}>删除</button>;
        }

        var addBtn = "";
        if(this.props.add == 'true') {
            addBtn = <button className="btn btn-hd-blue btn-sm" onClick={this.props.onAdd}>添加</button>;
        }

        var imageContent = [];
        if(this.state.isShowSpinner) {
            imageContent.push(<div className="text-center pic-upload-placeholder">
                <i className="fa fa-spinner fa-spin fa-2x spinner"></i>
            </div>);
        }
        else {
            if(this.props.imageUrl) {
                imageContent.push(<div>
                    <img src={this.props.imageUrl} className="img-responsive"/>
                </div>);
            }
            else {
                imageContent.push(<div>
                    <img src='../../../img/image_placeholer.png' className="img-responsive"/>
                </div>);
            }
        }

        var inputContent;
        if(this.props.disabled == 'true') {
            inputContent = <input type="text" className="form-control no-border"
                                  placeholder="写点什么描述图片内容"
                                  value={this.props.text} name={this.props.textName} onChange={this.props.onChange} disabled/>;
        }
        else {
            inputContent = <input type="text" className="form-control simple-input"
                                  placeholder="写点什么描述图片内容"
                                  value={this.props.text} name={this.props.textName} onChange={this.props.onChange}/>;
        }

        return (
            <div>
                <div className="row">
                    <div className="col-xs-2"><label className="vcenter34"
                                                     for="vendorCertificateName1">名称</label></div>
                    <div className="col-xs-10">{inputContent}</div>
                </div>
                <div className="row">
                    <div className="col-xs-2"><label className="vcenter34"
                                                     for="vendorCertificatePic1">图片</label></div>
                    <div className="col-xs-10">
                        {imageContent}
                    </div>
                </div>
                <div className="row voffset10">
                    <div className="col-xs-12 text-right">
                        <button className="btn btn-hd-blue btn-sm roffset5" onClick={this._selectPic}>选择图片</button>
                        {deleteBtn}
                        {addBtn}
                    </div>
                </div>
            </div>
        );
    },

    _selectPic: function () {
        wx.chooseImage({
            count: 1, // 默认9
            sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
            success: function (res) {
                var localIds = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片

                wx.uploadImage({
                    localId: localIds[0], // 需要上传的图片的本地ID，由chooseImage接口获得
                    isShowProgressTips: 1, // 默认为1，显示进度提示
                    success: function (res) {
                        var serverId = res.serverId; // 返回图片的服务器端ID

                        this.props.getMedia(localIds[0], serverId, this.props.imageName, this._processType(this.props.imageName));

                        this.setState({
                            isShowSpinner: false,
                        });

                    }.bind(this)
                });

                this.setState({
                    isShowSpinner: true,
                });
            }.bind(this)
        });
    },

    _processType: function(id) {
        var newId = id;

        newId = newId.replace(/\./g,'');
        newId = newId.replace(/\[/g,'');
        newId = newId.replace(/\]/g,'');

        return newId;
    },


});

module.exports = WXPicUploader;

