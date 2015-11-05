/** @jsx React.DOM */

var React = require('react');
var picResize = require('../../../util/picresize');
var MAX_WIDTH = 1280;
var MAX_HEIGHT = 1024;

var PicUploader = React.createClass({

    render: function() {
        var id = this._processId(this.props.imageName);

        var deleteBtn = "";
        if(this.props.delete == 'true') {
            deleteBtn = <button className="btn btn-hd-blue btn-sm roffset5" onClick={this.props.onDelete}>删除</button>;
        }

        var addBtn = "";
        if(this.props.add == 'true') {
            addBtn = <button className="btn btn-hd-blue btn-sm" onClick={this.props.onAdd}>添加</button>;
        }

        var imageContent = [];
        if(this.props.imageUrl == 'loadingspinner') {
            imageContent.push(<div className="text-center pic-upload-placeholder">
                <i className="fa fa-spinner fa-spin fa-2x spinner"></i>
            </div>);
        }
        else {
            imageContent.push(<div className="hidden"><form method="post" encType="multipart/form-data" action="#">
                <input id={id} type="file" name={this.props.imageName} onChange={this._uploadImg}/>
            </form></div>);
            if(this.props.imageUrl) {
                imageContent.push(<div>
                    <img src={this.props.imageUrl} className="img-responsive"/>
                </div>);
            }
        }

        var inputContent;
        if(this.props.disabled == 'true') {
            inputContent = <input type="text" className="form-control no-border"
                                  placeholder="写点什么让用户更容易理解图片内容"
                                  value={this.props.text} name={this.props.textName} onChange={this.props.onChange} disabled/>;
        }
        else {
            inputContent = <input type="text" className="form-control "
                                  placeholder="写点什么让用户更容易理解图片内容"
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

    _selectPic: function() {
        var id = this._processId(this.props.imageName);
        $('input[id='+id+']').click();
    },

    _processId: function(id) {
        var newId = id;

        newId = newId.replace(/\./g,'');
        newId = newId.replace(/\[/g,'');
        newId = newId.replace(/\]/g,'');

        return newId;
    },

    _uploadImg: function() {
        var id = this._processId(this.props.imageName);
        var file = $('input[id='+id+']')[0].files[0];

        if(!file.type.match(/image.*/)) {
            alert("请选择图片类型的文件");
            return;
        }

        picResize.resize(file, MAX_WIDTH, MAX_HEIGHT, function(imgFile){
            var fd = new FormData();
            fd.append("image", imgFile);
            fd.append("type", id);
            this.props.onUpload(this.props.imageName, fd);
        }.bind(this))
    },

});

module.exports = PicUploader;

