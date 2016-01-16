/** @jsx React.DOM */

var React = require('react');

var Store = require('../stores/Store');
var Actions = require('../actions/Actions');
var Constants = require('../constants/Constants');
var Header = require('./../../../app/Common/components/Header.react.js');
var WXPicUploader = require('./../../../app/Common/components/WXPicUploader');

var APVTO = require('../../../util/assignpathvaluetoobject');

var typeList = [
    "贵宾(泰迪)",
    "雪纳瑞",
    "比熊",
    "博美",
    "萨摩耶",
    "金毛",
    "哈士奇",
    "拉布拉多",
    "阿拉斯加",
    "串串(混血)",
];

var colorList = [
    {"type": "贵宾(泰迪)", "color": "红棕色"},
    {"type": "贵宾(泰迪)", "color": "黑色"},
    {"type": "贵宾(泰迪)", "color": "灰色"},
    {"type": "贵宾(泰迪)", "color": "白色"},
    {"type": "贵宾(泰迪)", "color": "巧克力色"},
    {"type": "贵宾(泰迪)", "color": "奶油色"},
    {"type": "贵宾(泰迪)", "color": "花色"},
    {"type": "贵宾(泰迪)", "color": "杏色"},
    {"type": "比熊", "color": "白色"},
    {"type": "雪纳瑞", "color": "椒盐色"},
    {"type": "雪纳瑞", "color": "黑银色"},
    {"type": "雪纳瑞", "color": "黑色"},
    {"type": "博美", "color": "黑色"},
    {"type": "博美", "color": "褐色"},
    {"type": "博美", "color": "白色"},
    {"type": "博美", "color": "棕色"},
    {"type": "博美", "color": "花色"},
    {"type": "拉布拉多", "color": "黑色"},
    {"type": "拉布拉多", "color": "奶油色"},
    {"type": "拉布拉多", "color": "巧克力色"},
    {"type": "金毛", "color": "棕色"},
    {"type": "金毛", "color": "杏色"},
    {"type": "阿拉斯加", "color": "黑色"},
    {"type": "阿拉斯加", "color": "棕红色"},
    {"type": "阿拉斯加", "color": "灰色"},
    {"type": "阿拉斯加", "color": "白色"},
    {"type": "哈士奇", "color": "黑色"},
    {"type": "哈士奇", "color": "棕红色"},
    {"type": "哈士奇", "color": "灰色"},
    {"type": "哈士奇", "color": "白色"},
    {"type": "萨摩耶", "color": "白色"}
];


function getAppState() {
    return {
        editUser: Store.getEditUser(),
        verifyMsg: [],
        isScrollToErrMsg: false,
    };
}

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

    componentDidUpdate: function() {
        // submit btn
        if(this.props.status == Constants.STATE_SAVE_IN_PROGRESS){
            $('#submitProfileBtn').attr('disabled', 'true');
        }

        // verify msg
        if (this.state.verifyMsg.length > 0 && this.state.isScrollToErrMsg) {
            var position = $('body').scrollTop() + $('#errMsgAnchor').offset().top;

            $('body').animate({
                scrollTop: position
            }, 500);

            // ensure verify msg scroll only response once
            this.setState(
                {isScrollToErrMsg: false}
            );
        };
    },

    render: function() {

        // submit btn
        var submitBtn = <button id="submitProfileBtn" className="btn btn-hd-blue text-muted text-center" onClick={this._submit}>
            <span className="glyphicon glyphicon-ok" aria-hidden="true"></span>&nbsp;完成
        </button>

        if(this.props.isSubscribe) {
            submitBtn = <button id="submitProfileBtn" className="btn btn-hd-blue text-muted text-center" onClick={this._submit}>
                <span className="glyphicon glyphicon-ok" aria-hidden="true"></span>&nbsp;开始配对
            </button>
        }

        if(this.props.status == Constants.STATE_SAVE_IN_PROGRESS){
            submitBtn =<button id="submitProfileBtn" className="btn btn-hd-blue text-muted text-center">
                <i className="fa fa-spinner fa-spin"></i>
                </button>
        }

        // pet type
        var petTypeInput = "";
        var isPetTypeEdit = true;
        if(this.state.editUser.pet) {
            if(this.state.editUser.pet.type) {
                typeList.forEach(function(item) {
                    if(this.state.editUser.pet.type == item) {
                        isPetTypeEdit = false;
                    }
                }.bind(this))
            }
            else {
                isPetTypeEdit = false;
            }
        }
        if(isPetTypeEdit) {
            petTypeInput = <input type="text" className="form-control simple-input no-border" placeholder="请填写品种" value={this.state.editUser.pet ? this.state.editUser.pet.type : ""} name="pet.type" onChange={this._handleChange}/>
        }
        else {
            petTypeInput = <select className="form-control simple-input no-border" value={this.state.editUser.pet ? this.state.editUser.pet.type : ""} name="pet.type" onChange={this._handleChange}>
                <option value="" disabled>请选择狗狗品种</option>
                {typeList.map(function(item) {
                    return <option value={item}>{item}</option>
                })}
                <option value=" ">其它(自己填写)</option>
            </select>;
        }

        // pet type
        var petColorInput = "";
        var isPetColorEdit = true;
        if(this.state.editUser.pet) {
            if(this.state.editUser.pet.color) {
                colorList.forEach(function(item) {
                    if(this.state.editUser.pet.color == item) {
                        isPetColorEdit = false;
                    }
                }.bind(this))
            }
            else {
                isPetColorEdit = false;
            }
        }
        if(isPetColorEdit) {
            petColorInput = <input type="text" className="form-control simple-input no-border" placeholder="请填写毛色" value={this.state.editUser.pet ? this.state.editUser.pet.color : ""} name="pet.color" onChange={this._handleChange}/>
        }
        else {
            var colorSelectionItem = [];
            colorList.forEach(function(item) {
                if(item.type == this.state.editUser.pet.type) {
                    colorSelectionItem.push(<option value={item.color}>{item.color}</option>);
                }
            }.bind(this))

            if(this.state.editUser.pet.type) {
                petColorInput = <select className="form-control simple-input no-border" value={this.state.editUser.pet ? this.state.editUser.pet.color : ""} name="pet.color" onChange={this._handleChange}>
                    <option value="" disabled>请选择狗狗毛色</option>
                    {colorSelectionItem}
                    <option value=" ">其它(自己填写)</option>
                </select>;
            }
            else {
                petColorInput = <select className="form-control simple-input no-border" value={this.state.editUser.pet ? this.state.editUser.pet.color : ""} name="pet.color" onChange={this._handleChange}>
                    <option value="" disabled>请先选择狗狗品种</option>
                </select>;
            }

        }

        // Verify Msg
        var verifyMsgContent = "";
        if(this.state.verifyMsg.length > 0) {
            verifyMsgContent = <div className="text-right">
                <p className="bg-danger verification-msg voffset30">
                    <strong>请根据以下提示, 补充、修改资料:</strong><br/>
                    {this.state.verifyMsg.map(function(item) {
                        return <span>{item}<br/></span>;
                    })}
                </p>
                <div id="errMsgAnchor"></div>
            </div>;
        }

        return (
            <div className="hg-love" id="react_body">
                <div className="container blue-background-decoration"></div>

                <Header subtitle="解救单身狗 - 萌宠相亲活动" hgstyle="love-profile hg-navbar"/>

                <div className="container">

                    <div className="text-center">
                        <img src="../../img/logo-dog-5.png"/>
                            <h2 className="hg-header">解救单身狗</h2>
                        </div>
                        <div className="voffset30">
                            <ul>
                                <li><small><i>我们将根据您狗狗资料，智能推荐合适的相亲对象</i></small></li>
                                <li><small><i>当您有新的配对时，我们将向您发送消息通知您</i></small></li>
                                <li><small><i>打＊号的内容为必填项</i></small></li>
                            </ul>
                        </div>

                    <div className="form-group voffset30">
                        <label>狗狗名称*</label>
                        <input type="text" className="form-control simple-input no-border" placeholder="昵称" value={this.state.editUser.pet ? this.state.editUser.pet.name : ""} name="pet.name" onChange={this._handleChange}/>
                    </div>

                    <div className="form-group">
                        <label>狗狗品种*</label>
                        {petTypeInput}
                    </div>

                    <div className="form-group">
                        <div className="row">
                            <div className="col-xs-6">
                                <label>狗狗性别*</label>
                                <select className="form-control simple-input no-border" value={this.state.editUser.pet ? this.state.editUser.pet.gender : ""} name="pet.gender" onChange={this._handleChange}>
                                    <option value="" disabled>请选择狗狗性别</option>
                                    <option value="1">男狗狗</option>
                                    <option value="2">女狗狗</option>

                                </select>
                            </div>
                            <div className="col-xs-6">
                                <label>狗狗毛色*</label>
                                {petColorInput}
                            </div>
                        </div>
                    </div>

                    <div className="form-group">
                        <div className="row">
                            <div className="col-xs-6">
                                <label>肩高</label><small>(厘米)</small>
                                <input type="number" pattern="[0-9]*" className="form-control simple-input no-border" placeholder="厘米" value={this.state.editUser.pet ? this.state.editUser.pet.tall : ""} name="pet.tall" onChange={this._handleChange}/>
                            </div>
                            <div className="col-xs-6">
                                <label>体重</label><small>(斤)</small>
                                <input type="number" pattern="[0-9]*" className="form-control simple-input no-border" placeholder="斤" value={this.state.editUser.pet ? this.state.editUser.pet.weight : ""} name="pet.weight" onChange={this._handleChange}/>
                            </div>
                        </div>
                        <small><i>*请选填肩高／体重,如果都填写将提高配对成功率</i></small>
                    </div>

                    <div className="form-group">
                        <label>脱单宣言</label>
                        <textarea className="form-control simple-input no-border" rows="3" value={this.state.editUser.pet ? this.state.editUser.pet.statement : ""} placeholder="假如您还没有想好,我们将自动为您生成脱单宣言" name="pet.statement" onChange={this._handleChange}></textarea>
                    </div>

                    <div className="form-group">
                        <label>狗狗美照</label>
                        <div><small><i>*请上传至少1张图片,最多3张.以下第1张图片将成为您狗狗的封面照,确保它是美美的</i></small></div>
                        <br/>
                        <WXPicUploader textName='ignore'
                                       imageName='pet.image_url_list.[0]'
                                       text='狗狗美照1'
                                       imageUrl={this.state.editUser.pet && this.state.editUser.pet.image_url_list && this.state.editUser.pet.image_url_list.length>0 ? this.state.editUser.pet.image_url_list[0] : ""}
                                       onChange={this._handleChange}
                                       delete='false'
                                       //onDelete={this._removeCertificate.bind(this, i)}
                                       add='false'
                                       //onAdd={this._addNewCertificate}
                                       disabled='true'
                                       getMedia={this._getWXPicMedia}
                                       hideName='true'/>

                        <hr/><br/>

                        <WXPicUploader textName='ignore'
                                       imageName='pet.image_url_list.[1]'
                                       text='狗狗美照2'
                                       imageUrl={this.state.editUser.pet && this.state.editUser.pet.image_url_list && this.state.editUser.pet.image_url_list.length>0 ? this.state.editUser.pet.image_url_list[1] : ""}
                                       onChange={this._handleChange}
                                       delete='false'
                            //onDelete={this._removeCertificate.bind(this, i)}
                                       add='false'
                            //onAdd={this._addNewCertificate}
                                       disabled='true'
                                       getMedia={this._getWXPicMedia}
                                       hideName='true'/>

                        <hr/><br/>

                        <WXPicUploader textName='ignore'
                                       imageName='pet.image_url_list.[2]'
                                       text='狗狗美照3'
                                       imageUrl={this.state.editUser.pet && this.state.editUser.pet.image_url_list && this.state.editUser.pet.image_url_list.length>0 ? this.state.editUser.pet.image_url_list[2] : ""}
                                       onChange={this._handleChange}
                                       delete='false'
                            //onDelete={this._removeCertificate.bind(this, i)}
                                       add='false'
                            //onAdd={this._addNewCertificate}
                                       disabled='true'
                                       getMedia={this._getWXPicMedia}
                                       hideName='true'/>
                    </div>

                    {verifyMsgContent}

                </div>

                <footer className="footer love-profile">
                    <div className="container">
                        <div className="row text-right">
                            <div className="col-xs-12">
                                <button id="submitProfileBtn" className="btn btn-hd-blue text-muted text-center roffset5" onClick={this._cancel}>
                                    <span className="glyphicon glyphicon-remove" aria-hidden="true"></span>&nbsp;返回
                                </button>
                                {submitBtn}
                            </div>
                        </div>
                    </div>
                </footer>

            </div>
        );
    },

    _onChange: function() {
        this.setState(getAppState());
    },

    _handleChange: function(event) {
        if(event.target.name != "ignore") {
            var value = event.target.value;

            var newUser = APVTO.assign(this.state.editUser, event.target.name, value);

            this.setState({editUser: newUser});
        }
    },

    _getWXPicMedia: function(pic, mediaId, name, type) {
        Actions.uploadWXPicture(mediaId, name, type);

        var newUser = APVTO.assign(this.state.editUser, name, pic);
        this.setState({editUser: newUser});
    },

    _submit: function() {
        var verifyMsg = this._verify();

        if(verifyMsg.length == 0) {
            Actions.updateUser(this.state.editUser);
        }
        else {
            this.setState(
                {
                    verifyMsg: verifyMsg,
                    isScrollToErrMsg: true
                }
            );
        }
    },

    _cancel: function() {
        wx.closeWindow();
    },

    _verify: function() {
        var verifyMsg = [];

        if(this.state.editUser.pet.name == "") {
            verifyMsg.push("-请填写狗狗名称");
        }

        if(this.state.editUser.pet.type == "") {
            verifyMsg.push("-请填写狗狗品种");
        }

        if(this.state.editUser.pet.gender == "") {
            verifyMsg.push("-请填写狗狗性别");
        }

        if(this.state.editUser.pet.color == "") {
            verifyMsg.push("-请填写狗狗毛色");
        }

        if(this.state.editUser.pet.tall == "" && this.state.editUser.pet.weight == "") {
            verifyMsg.push("-请填写狗狗的肩高/体重中的一项");
        }

        //if(this.state.editUser.pet.statement == "") {
        //    verifyMsg.push("-请填写狗狗脱单宣言");
        //}

        if(this.state.editUser.pet.image_url_list.length == 0 || this.state.editUser.pet.image_url_list[0] == "") {
            verifyMsg.push("-请上传狗狗图片(放在第一张图片的位置)");
        }

        return verifyMsg;
    },

});

module.exports = app;

