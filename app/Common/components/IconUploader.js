/** @jsx React.DOM */

var React = require('react');
var picResize = require('../../../util/picresize');
var MAX_WIDTH = 150;
var MAX_HEIGHT = 150;

var IconUploader = React.createClass({

    render: function() {
        var imageContent = [];
        if(this.props.imageUrl == 'loadingspinner') {
            imageContent.push(<i className="fa fa-spinner fa-spin fa-2x spinner"></i>);
        }
        else {
            imageContent.push(<div>
                <img src={this.props.imageUrl} className="center-block img-responsive img-circle user-icon-header"/>
                <button className="btn btn-hd-blue center-block btn-sm voffset5" onClick={this._selectPic}>更换</button>
            </div>)
        }

        return (
            <div className="text-center">
                {imageContent}
                <div className="hidden">
                    <form method="post" encType="multipart/form-data" action="#">
                        <input id={this.props.name} type="file" name={this.props.name} onChange={this._uploadImg}/>
                    </form>
                </div>
                <br/>
            </div>
        );
    },

    _selectPic: function() {
        $('input[id='+this.props.name+']').click();
    },

    _uploadImg: function() {
        var id = this.props.name;
        var file = $('input[id='+id+']')[0].files[0];

        if(!file.type.match(/image.*/)) {
            alert("请选择图片类型的文件");
            return;
        }

        picResize.resize(file, MAX_WIDTH, MAX_HEIGHT, function(imgFile){
            var fd = new FormData();
            fd.append("image", imgFile);
            fd.append("type", id);
            this.props.onUpload(this.props.name, fd);
        }.bind(this))
    },

});

module.exports = IconUploader;

