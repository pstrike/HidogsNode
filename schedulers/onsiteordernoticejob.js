var operation = require('../model/operation');
var wechat = require('../controllers/wechat');
var genorderno = require('../util/genorderno');

exports.do = function () {
    var beginTime = new Date();

    var noticeList = [];
    var filter = {
        isOnSite: true,
        status: 'tbconfirmed',
    }

    var nowTime = new Date();
    var noticeTime;

    var wechatUserApi = wechat.getWXVendorAPI();

    operation.getObjectList(operation.getCollectionList().order, filter, {}, function(orderList) {

        orderList.forEach(function(order) {
            noticeTime = new Date(order.created_time);
            noticeTime = noticeTime.setHours(noticeTime.getHours() + 1);

            if(nowTime > noticeTime) {
                noticeList.push(genNotice(genorderno.orderno(order.order_id, new Date(order.created_time))));
            }
        })

        operation.getObjectList(operation.getCollectionList().admin, {}, {}, function(userList) {

            userList.forEach(function(user) {
                noticeList.forEach(function(notice) {
                    wechatUserApi.sendTemplate(user.openid, 'Q-gjYrZxbwp-6lGRV9lwRfVOc4OU7cUONHudT2vdgG4', 'http://www.hidogs.cn/admin/view/order', '', notice, function() {
                        console.log("[sent template msg]")
                    }.bind(user));
                })
            })

            var endTime = new Date();
            console.log('[Scheduler] [OnSite Order Notice] ['+beginTime+'] - ' + (endTime - beginTime) + 'ms');
        })
    })
}

function genNotice(orderId) {
    return {
        "first": {
            "value":"达人尚未回应上门服务订单",
            "color":"#173177"
        },
        "keyword1":{
            "value":"请联系达人尽快回应订单",
            "color":"#173177"
        },
        "keyword2": {
            "value": "上门服务",
            "color":"#173177"
        },
        "remark":{
            "value":"订单号:"+orderId,
            "color":"#173177"
        }
    }
}