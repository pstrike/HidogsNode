var operation = require('../model/operation');
var wechat = require('../controllers/wechat');
var genorderno = require('../util/genorderno');
var formatdatetime = require('../util/formatdatetime');

exports.do = function () {
    var beginTime = new Date();

    var noticeList = [];
    var wechatUserApi = wechat.getWXUserAPI();

    operation.getObjectList(operation.getCollectionList().user, {}, {user_id:1, love:1, openid:1}, function(userList) {
        userList.forEach(function(user) {

            if(user.user_id.indexOf("robot")<0) {

                if(user.love.love_me_no) {
                    if(user.love.love_me.length > parseInt(user.love.love_me_no) && !user.love.reject_love_me_no_notice) {
                        noticeList.push(
                            {
                                openid: user.openid,
                                notice: genNotice(user.love.love_me.length - parseInt(user.love.love_me_no), beginTime),
                            }
                        );
                    }
                }

                var newUser = {};
                newUser.user_id = user.user_id;
                newUser.love = user.love;
                newUser.love.love_me_no = user.love.love_me.length;

                operation.updateObject(operation.getCollectionList().user, newUser, function(result) {
                    if(result.status == 'fail') {
                        console.log('[Scheduler] [Love Love Me Notice] Err');
                        console.log(result.err);
                    }
                    // do nothing
                });

            }

        })

        noticeList.forEach(function(notice,index) {
            wechatUserApi.sendTemplate(notice.openid, 'Ew_R9-CWd-7LhA6n_Zp1N9su7rkb45RiieY3oNW9dRI', 'http://www.hidogs.cn/love/view/top', '', notice.notice, function() {
                console.log("[sent love love me template msg]")
            }.bind(notice));
        })

        var endTime = new Date();
        console.log('[Scheduler] [Love Love Me Notice] ['+beginTime+'] - ' + (endTime - beginTime) + 'ms');
    })
}

function genNotice(matchNo, time) {
    return {
        "first": {
            "value":'有新的宠友在"解救单身狗"活动中喜欢了您家狗狗',
            "color":"#173177"
        },
        "keyword1":{
            "value":"新增"+matchNo+"位宠友喜欢了您家狗狗,点击该消息去看看有没合眼缘的佳丽:)",
            "color":"#173177"
        },
        "keyword2": {
            "value": formatdatetime.formatDate(time),
            "color":"#173177"
        },
        "remark":{
            "value":'假如您以后不想收到该消息,请回复"取消相亲通知".抱歉打扰了您.',
            "color":"#173177"
        }
    }
}