/** @jsx React.DOM */

var React = require('react');

var WXIconUploader = React.createClass({

    getInitialState: function() {
        return {
            isShowSpinner: false,
        };
    },

    render: function() {
        var imageContent = [];
        if(this.state.isShowSpinner) {
            imageContent = <i className="fa fa-spinner fa-spin fa-2x spinner"></i>;
        }
        else {
            imageContent = <div>
                <img src={this.props.imageUrl} className="center-block img-responsive img-circle user-icon-header"/>
                <button className="btn btn-hd-blue btn-sm voffset5" onClick={this._selectPic}>更换</button>
            </div>;
        }

        return (
            <div className="text-center">
                {imageContent}
                <br/>
            </div>
        );
    },

    _selectPic: function() {
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

                        this.props.getMedia(localIds[0], serverId, this.props.imageName, this.props.imageName);

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

});

module.exports = WXIconUploader;

