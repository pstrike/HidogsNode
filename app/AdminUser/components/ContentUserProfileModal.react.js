/** @jsx React.DOM */

var React = require('react');

var formatdatetime = require('../../../util/formatdatetime');

var app = React.createClass({

    render: function() {

        var addressContent = "";
        if(this.props.user.address) {
            addressContent = (this.props.user.address.city ? this.props.user.address.city : "") +
                (this.props.user.address.district ? this.props.user.address.district : "") +
                (this.props.user.address.street ? this.props.user.address.street : "") +
                (this.props.user.address.business ? this.props.user.address.business : "") +
                (this.props.user.address.additional ? this.props.user.address.additional : "");
        }

        var userLink = "http://www.hidogs.cn/love/view/showoff?userid="+this.props.user.user_id;

        return (
            <div className="modal-fullscreen modal fade" id="profileModal" tabindex="-1" role="dialog"
                 aria-labelledby="myModalLabel" data-backdrop="static">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">

                        <div className="modal-header">
                            <button type="button" className="close" data-dismiss="modal"><span
                                aria-hidden="true">&times;</span></button>
                            <h4 className="modal-title">服务伙伴详情</h4>
                        </div>

                        <div className="modal-body">
                            <img src={this.props.user.head_image_url}
                                 className="center-block img-responsive img-circle user-icon-header"/>

                            <h3 className="text-center">{this.props.user.nick_name}</h3>

                            <h3>基本信息</h3>

                            <div className="form-group">
                                <label>姓名</label>
                                <input type="text" className="form-control no-border" value={this.props.user.name} disabled/>
                            </div>

                            <div className="form-group">
                                <label>性别</label>
                                <input type="text" className="form-control no-border" value={this.props.user.gender ? this.props.user.gender == 1 ? "男" : "女" : ""} disabled/>
                            </div>

                            <div className="form-group">
                                <label>微信/手机号</label>
                                <input type="text" className="form-control no-border" value={this.props.user.wx_id ? this.props.user.wx_id : ""} disabled/>
                            </div>

                            <div className="form-group">
                                <label>地址</label>
                                <input type="text" className="form-control no-border" value={addressContent} disabled/>
                            </div>

                            <div className="form-group">
                                <label>最后访问欢宠时间</label>
                                <input type="text" className="form-control no-border" value={this.props.user.modified_time ? formatdatetime.formatDate(new Date(this.props.user.modified_time)) : ""} disabled/>
                            </div>

                            <div className="form-group">
                                <label>首次访问欢宠时间</label>
                                <input type="text" className="form-control no-border" value={this.props.user.created_time ? formatdatetime.formatDate(new Date(this.props.user.created_time)) : ""} disabled/>
                            </div>


                            <h3 className="voffset60">宠物信息</h3>
                            <div className="form-group">
                                <label>名称</label>
                                <input type="text" className="form-control no-border" value={this.props.user.pet ? this.props.user.pet.name : ""} disabled/>
                            </div>

                            <div className="form-group">
                                <label>性别</label>
                                <input type="text" className="form-control no-border" value={this.props.user.pet ? this.props.user.pet.gender == 1 ? "男" : "女" : ""} disabled/>
                            </div>

                            <div className="form-group">
                                <label>类别</label>
                                <input type="text" className="form-control no-border" value={this.props.user.pet ? this.props.user.pet.type : ""} disabled/>
                            </div>

                            <div className="form-group">
                                <label>颜色</label>
                                <input type="text" className="form-control no-border" value={this.props.user.pet ? this.props.user.pet.color : ""} disabled/>
                            </div>

                            <div className="form-group">
                                <label>肩高</label>
                                <input type="text" className="form-control no-border" value={this.props.user.pet ? this.props.user.pet.tall : ""} disabled/>
                            </div>

                            <div className="form-group">
                                <label>体重</label>
                                <input type="text" className="form-control no-border" value={this.props.user.pet ? this.props.user.pet.weight : ""} disabled/>
                            </div>

                            <a role="button" href={userLink} target="_blank" className="btn btn-default">查看用户主页</a>

                            <h3 className="voffset60">解救单身狗</h3>
                            <div className="form-group">
                                <label>访问次数</label>
                                <input type="text" className="form-control no-border" value={this.props.user.visit_count ? this.props.user.visit_count.love : 0} disabled/>
                            </div>

                            <div className="form-group">
                                <label>喜欢</label>
                                <input type="text" className="form-control no-border" value={this.props.user.love ? this.props.user.love.i_love.length : ""} disabled/>
                            </div>

                            <div className="form-group">
                                <label>被喜欢</label>
                                <input type="text" className="form-control no-border" value={this.props.user.love ? this.props.user.love.love_me.length : ""} disabled/>
                            </div>

                            <div className="form-group">
                                <label>无感</label>
                                <input type="text" className="form-control no-border" value={this.props.user.love ? this.props.user.love.i_hate.length : ""} disabled/>
                            </div>

                            <div className="form-group">
                                <label>支持</label>
                                <input type="text" className="form-control no-border" value={this.props.user.love ? this.props.user.love.support.length : ""} disabled/>
                            </div>

                            <div className="form-group">
                                <label>配对</label>
                                <input type="text" className="form-control no-border" value={this.props.user.love ? this.props.user.love.match_no : ""} disabled/>
                            </div>

                        </div>

                        <div className="modal-footer form-inline">
                            <button type="button" className="btn btn-default"
                                    data-dismiss="modal">关闭
                            </button>

                        </div>

                    </div>
                </div>
            </div>
        );
    },


});

module.exports = app;

