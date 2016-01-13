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

                var matchNo = 0;
                for(var i=0; i<user.love.i_love.length; i++) {
                    for(var j=0; j<user.love.love_me.length; j++) {
                        if(user.love.i_love[i] == user.love.love_me[j]) {
                            matchNo++;
                            break;
                        }
                    }
                }

                if(matchNo > parseInt(user.love.match_no)) {
                    noticeList.push(
                        {
                            openid: user.openid,
                            notice: genNotice(matchNo - parseInt(user.love.match_no), beginTime),
                        }
                    );

                    var newUser = {};
                    newUser.user_id = user.user_id;
                    newUser.love = user.love;
                    newUser.love.match_no = matchNo;

                    operation.updateObject(operation.getCollectionList().user, newUser, function(result) {
                        if(result.status == 'fail') {
                            console.log('[Scheduler] [Love Match Notice] Err');
                            console.log(result.err);
                        }
                        // do nothing
                    });
                }

            }

        })

        noticeList.forEach(function(notice) {
            wechatUserApi.sendTemplate(notice.openid, 'Ew_R9-CWd-7LhA6n_Zp1N9su7rkb45RiieY3oNW9dRI', 'http://www.hidogs.cn/love/view/match', '', notice.notice, function() {
                console.log("[sent love template msg]")
            }.bind(notice));
        })

        var endTime = new Date();
        console.log('[Scheduler] [Love Match Notice] ['+beginTime+'] - ' + (endTime - beginTime) + 'ms');
    })
}

function genNotice(matchNo, time) {
    return {
        "first": {
            "value":'您在"解救单身狗"的活动中有新的配对',
            "color":"#173177"
        },
        "keyword1":{
            "value":"有新的"+matchNo+"位用户也同时喜欢了您家狗狗",
            "color":"#173177"
        },
        "keyword2": {
            "value": formatdatetime.formatDate(time),
            "color":"#173177"
        },
        "remark":{
            "value":"点击该消息即可看到最新配对结果",
            "color":"#173177"
        }
    }
}