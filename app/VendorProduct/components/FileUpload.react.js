/** @jsx React.DOM */

var React = require('react');
var HidogsActions = require('../actions/VendorProdutActions');
var VendorProductConstants = require('../constants/VendorProductConstants');
var Store = require('../stores/FileUploadStore');

function getState() {
    return {
        picList: Store.getPicList(),
    };
};

var FileUpload = React.createClass({

    getInitialState: function() {
        return getState();
    },

    componentDidMount: function() {
        Store.addChangeListener(this._onChange);
    },

    componentWillUnmount: function() {
        Store.removeChangeListener(this._onChange);
    },

    render: function () {
        var imageContent = [];
        var picNo = this.state.picList.length+1;
        var picList = this.state.picList;

        var imageContent = this.state.picList.map(function (pic, i) {
            return (
                <div>
                    <button type="button" className="btn btn-default" onClick={this._deleteFile.bind(this, pic.url)}><span className="glyphicon glyphicon-remove" aria-hidden="true"></span></button>
                    <img src={pic.url} className="img-responsive" />
                </div>
            );
        }.bind(this));

        imageContent.push(<form method="post" encType="multipart/form-data" action="/picture">
            <div className="form-group">
                <label for="productInputName">上传图片</label>
                <input type="file" name="datafile" ref="file" onChange={this._uploadFile}/>
            </div>
        </form>);

        return (
            <div>
                {imageContent}
            </div>
        );
    },

    _onChange: function() {
        this.setState(getState());
    },

    _uploadFile: function(e) {
        var fileName = e.target.value;
        var fd = e.target.form;
        var data = new FormData(fd);

        if(fileName) {
            HidogsActions.uploadPicture(data, fileName);
        }
        else {
            alert("请选择图片.");
        }

    },

    _deleteFile: function(fileName) {
        console.log(fileName);

        if(fileName) {
            HidogsActions.removePicture(fileName);
        }

    },

});

module.exports = FileUpload;
