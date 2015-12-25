var wechat = require('wechat');
var OAuth = require('wechat-oauth');
var WechatAPI = require('wechat-api');
//var db = require('../../db/db');
var operation = require('../../model/operation');
var model = require('../../model/prototype');
var sign = require('../../util/wxjssign');
var fs = require('fs');
var genuuid = require('../../util/genuuid');
var genorderno = require('../../util/genorderno');
var Constants = require('../../app/Common/constants/HidogsConstants');

var configVendor = {
    token: 'hidogs',
    appid: 'wxb7d0de94e852afd6',
    encodingAESKey: 'CN7aaTt38ofCv5d4TnlRoh04LnBxhjffwUXc3x3PR01',
    secret: '8b8a251eaf5fa007ac8d933340a9d19b',
};


var configUser = {
    token: 'hidogs',
    appid: 'wxaddd7cf2ed2848ac',
    encodingAESKey: 'YrJHICF9PcXCYnLocVe1UoNUsOxC5MkPna4vll7IMxl',
    secret: '32a1a3ab9838fca79131c42c82fd7017',
};

var WXToken = 'hidogs';

var clientVendor = new OAuth(configVendor.appid, configVendor.secret);
var apiVendor = new WechatAPI(configVendor.appid, configVendor.secret);
var clientUser = new OAuth(configUser.appid, configUser.secret);
var apiUser = new WechatAPI(configUser.appid, configUser.secret);

exports.getWXUserAPI = function() {
    return apiUser;
};

exports.getWXVendorAPI = function() {
    return apiVendor;
};

exports.insert = wechat(WXToken).text(function (message, req, res, next) {
    var msg;

    switch (message.Content) {
        case "3a3404":
            msg = "内部列表\n" +
                "1.[达人功能]加入达人: vj\n" +
                "2.[达人功能]达人服务管理: vp\n" +
                "3.[达人功能]达人订单管理: vo\n" +
                "4.[达人功能]达人主页/信息管理: vpf\n" +
                "5.[达人功能]优惠码: vc\n" +
                "6.[用户功能]订单管理: uo\n" +
                "7.[用户功能]收藏: uf\n" +
                "8.[用户功能]优惠码: uc\n" +
                "9.[管理者功能]欢宠小Q服务管理: vpq\n" +
                "10.[管理者功能]管理者后台: ad\n"
            break;
        case "vj":
            msg = "http://www.hidogs.cn/wechat/auth?destination=001vendor1view1vendorjoin_vendor";
            break;
        case "vp":
            msg = "http://www.hidogs.cn/wechat/auth?destination=001product1view1vendorproduct_vendor";
            break;
        case "vpq":
            msg = "http://www.hidogs.cn/product/view/vendorproducthg1";
            break;
        case "vpf":
            msg = "http://www.hidogs.cn/wechat/auth?destination=001vendor1view1vendorprofile_vendor";
            break;
        case "uo":
            msg = "http://www.hidogs.cn/wechat/auth?destination=001order1view1userorder_user";
            break;
        case "uc":
            msg = "http://www.hidogs.cn/wechat/auth?destination=001coupon1view1usercoupon_user";
            break;
        case "uf":
            msg = "http://www.hidogs.cn/wechat/auth?destination=001user1view1userfav_user";
            break;
        case "vo":
            msg = "http://www.hidogs.cn/wechat/auth?destination=001order1view1vendororder_vendor";
            break;
        case "vc":
            msg = "http://www.hidogs.cn/wechat/auth?destination=001coupon1view1vendorcoupon_vendor";
            break;
        case "ad":
            msg = "http://www.hidogs.cn/admin/view/vendor(请在电脑登录)";
            break;
        case "hgopenid":
            msg = message.FromUserName;
            break;
        case "洗澡护理":
            msg=[
                    {
                        title: '洗澡护理服务',
                        description: '',
                        picurl: '',
                        url: 'http://www.hidogs.cn/product/view/userproductlist?params=1-1-1,null'
                    }
            ];

            break;
        case "美容造型":
            msg=[
                {
                    title: '美容造型服务',
                    description: '',
                    picurl: '',
                    url: 'http://www.hidogs.cn/product/view/userproductlist?params=1-1-2,null'
                }
            ];
            break;
        case "全身剃光":
            msg=[
                {
                    title: '全身剃光服务',
                    description: '',
                    picurl: '',
                    url: 'http://www.hidogs.cn/product/view/userproductlist?params=1-1-3,null'
                }
            ];
            break;
        case "SPA":
            msg=[
                {
                    title: 'SPA服务',
                    description: '',
                    picurl: '',
                    url: 'http://www.hidogs.cn/product/view/userproductlist?params=1-1-4,null'
                }
            ];
            break;
        default :
            msg = "text";

    }

    res.reply(msg);
}).image(function (message, req, res, next) {
    res.reply("image");
}).voice(function (message, req, res, next) {
    res.reply("voice");
}).video(function (message, req, res, next) {
    res.reply("video");
}).location(function (message, req, res, next) {
    res.reply("location");
}).link(function (message, req, res, next) {
    res.reply("link");
}).event(function (message, req, res, next) {
    res.reply("欢迎关注欢宠. 一起来加入我们, 成为欢宠美容服务伙伴.");
}).device_text(function (message, req, res, next) {
    res.reply("device_text");
}).device_event(function (message, req, res, next) {
    res.reply("device_event");
}).middlewarify();

exports.show = function(req, res, next){
    var type = req.params.wechat_id;
    var destination = req.query.destination;

    switch (type) {
        case "auth":
            var param = req.query.destination.split("_");
            var target = param[1];

            var client;
            switch(target) {
                case "user":
                    client = clientUser;
                    break;

                case "vendor":
                    client = clientVendor;
                    break;
            }

            if(client) {
                var url = client.getAuthorizeURL('http://www.hidogs.cn/wechat/base',destination,'snsapi_userinfo');
                res.redirect(url);
            }
            else {
                next(new Error("微信认证失败."));
            }

            break;

        case "base":
            // /wechat/base?code=[code]&state=[url]?[param]_[entity]

            var code = req.query.code;
            var param = req.query.state.split("_");
            var destination;
            if(param[0].indexOf("?")>-1) {
                var destinationPath = param[0].split("?")[0];
                destinationPath = destinationPath.replace(/0/g,".");
                destinationPath = destinationPath.replace(/1/g,"/");
                destination = destinationPath + "?" + param[0].split("?")[1];
            }
            else {
                destination = param[0];
                destination = destination.replace(/0/g,".");
                destination = destination.replace(/1/g,"/");
            }

            var target = param[1]; // distinguish "vendor" or "user" to handle different type of user

            var client;
            switch(target) {
                case "user":
                    client = clientUser;
                    break;

                case "vendor":
                    client = clientVendor;
                    break;
            }

            if(!client) {
                next(new Error("微信认证失败."));
            }

            client.getAccessToken(code, function (err, result) {
                if(err) {
                    next(new Error("微信认证失败. 请授权并重试."));
                }

                //console.log(result);
                //
                //if(typeof(result) === "undefined") {
                //    next(new Error("微信认证失败. 请授权并重试."));
                //}
                //
                //if(typeof(result.data) === "undefined") {
                //    next(new Error("微信认证失败. 请授权并重试."));
                //}

                try {
                    var accessToken = result.data.access_token;
                    var openid = result.data.openid;
                }
                catch (err) {
                    console.log("WX Oauth Err");
                    console.log(err);
                    next(new Error("微信认证失败. 请授权并重试."));
                }

                operation.getObjectList(operation.getCollectionList()[target], {openid: openid}, {}, function(objectList){
                    if(objectList.length == 0) {
                        client.getUser({openid: openid, lang: 'zh_CN'}, function (err, result) {
                            if(err) {
                                next(new Error("微信认证失败. 请授权并重试."));
                            }

                            // base on result errcode to determine whether this is a double wechat 'code' case
                            // if so, ignore invalid code and wait for valid code to proceed
                            if(result.errcode != '40001') {
                                var oauth_user = result;

                                var newAccount = {};

                                switch(target) {
                                    case "user":
                                        newAccount = model.getUserPrototype();
                                        break;

                                    case "vendor":
                                        newAccount = model.getVendorPrototype();
                                        break;
                                }

                                newAccount.openid = oauth_user.openid;
                                newAccount.nick_name = oauth_user.nickname;
                                newAccount.head_image_url = oauth_user.headimgurl;
                                newAccount.gender = oauth_user.sex;
                                newAccount.address.country = oauth_user.country;
                                newAccount.address.province = oauth_user.province;
                                newAccount.address.city = oauth_user.city;

                                operation.insertObject(operation.getCollectionList()[target], newAccount, function (result) {
                                    if (result.status == "fail") {
                                        next(result.err);
                                    }
                                    else {
                                        switch(target) {
                                            case "user":
                                                req.session.current_user = {
                                                    user_id: result.user_id,
                                                    head_image_url: newAccount.head_image_url,
                                                    nick_name: newAccount.nick_name,
                                                    openid: newAccount.openid,
                                                };
                                                break;

                                            case "vendor":
                                                req.session.current_user = {
                                                    vendor_id: result.vendor_id,
                                                    role: newAccount.role[0].slug,
                                                    head_image_url: newAccount.head_image_url,
                                                    nick_name: newAccount.nick_name,
                                                    status: newAccount.status,
                                                    openid: newAccount.openid,
                                                };
                                                break;
                                        }

                                        res.redirect(destination);
                                    }
                                })
                            }

                        })
                    }
                    else {
                        switch(target) {
                            case "user":
                                req.session.current_user = {
                                    user_id: objectList[0].user_id,
                                    head_image_url: objectList[0].head_image_url,
                                    nick_name: objectList[0].nick_name,
                                    openid: objectList[0].openid,
                                };
                                break;

                            case "vendor":
                                req.session.current_user = {
                                    vendor_id: objectList[0].vendor_id,
                                    role: objectList[0].role[0].slug,
                                    head_image_url: objectList[0].head_image_url,
                                    nick_name: objectList[0].nick_name,
                                    status: objectList[0].status,
                                    openid: objectList[0].openid,
                                };
                                break;
                        }

                        res.redirect(destination);
                    }
                })
            });
            break;

        case 'wxjssignature':
            var url = req.query.url;

            apiVendor.getTicket(function(err, result) {
                if(err) {
                    next(new Error("微信获取JS SDK失败. 请重试."));
                }

                //console.log(result);

                if(typeof result === "undefined") {
                    next(new Error("微信获取JS SDK失败. 请重试."));
                }

                var signature = sign(result.ticket, url);
                signature.appId = configVendor.appid;

                res.send(signature);
            })

            break;

        case 'wxgetmedia':
            var mediaId = req.query.mediaid;
            var path = req.query.path;

            apiVendor.getMedia(mediaId, function(err, result, wxres) {

                var contents = wxres.headers['content-disposition'].split('"');
                var fileName = contents[1];
                var updatedFileName = path + "_" + genuuid.uuid() + '.' + fileName.split('.')[1];

                fs.writeFile('/home/ftp/public/upload/'+updatedFileName, result, function (err) {
                    if (err) {
                        next(err);
                    }
                    else {
                        res.send('/upload/' + updatedFileName);
                    }
                });

            });
            break;

        default:
            // op
    };
};

exports.otherpost = function(req, res, next) {
    switch (req.params.wechat_id) {
        case 'template':
            /*
             * order: order detail
             * type: user / vendor
             * template: refer to HGConstants
             *
             * */

            var payload = req.body;

            //console.log(payload);

            var templateId = '';
            var data = {};
            var url = '';
            var openId = "";

            switch(payload.type) {
                case "user":
                    var order = payload.order;
                    var orderNo = genorderno.orderno(order.order_id, order.created_time);
                    templateId = '6qOcduQN72WBcj6bQmUKnY_hn-yEw-wNjNp6hAD82bk';
                    url = 'http://www.hidogs.cn/wechat/auth?destination=001order1view1userorder_user';

                    switch (payload.template) {
                        case Constants.USER_TBPAID:
                            openId = order.openid;
                            data = {
                                "first": {
                                    "value":"您的订单已经创建,请尽快进行支付！",
                                    "color":"#173177"
                                },
                                "keyword1":{
                                    "value":orderNo,
                                    "color":"#173177"
                                },
                                "keyword2": {
                                    "value": order.price.total + "元",
                                    "color":"#173177"
                                },
                                "keyword3": {
                                    "value": order.product.title ? order.product.title : order.product.product_title,
                                    "color":"#173177"
                                },
                                "remark":{
                                    "value":"感谢您对欢宠的支持！",
                                    "color":"#173177"
                                }
                            };
                            break;

                        case Constants.USER_TBSERVICED:
                            // handled in payment webhook
                            break;

                        case Constants.USER_TBCOMMENTED:
                            openId = order.openid;
                            data = {
                                "first": {
                                    "value":"感谢您使用我们的服务！",
                                    "color":"#173177"
                                },
                                "keyword1":{
                                    "value":orderNo,
                                    "color":"#173177"
                                },
                                "keyword2": {
                                    "value": order.price.total + "元",
                                    "color":"#173177"
                                },
                                "keyword3": {
                                    "value": order.product.title ? order.product.title : order.product.product_title,
                                    "color":"#173177"
                                },
                                "remark":{
                                    "value":"我们邀请您花1分钟给我们反馈,帮助我们提高服务.",
                                    "color":"#173177"
                                }
                            };
                            break;

                        case Constants.USER_REJECTED_REFUND:
                            openId = order.openid;
                            data = {
                                "first": {
                                    "value":"抱歉,达人无法在预订的时间内提供服务. 您的订单将进入退款流程.",
                                    "color":"#173177"
                                },
                                "keyword1":{
                                    "value":orderNo,
                                    "color":"#173177"
                                },
                                "keyword2": {
                                    "value": order.price.total + "元",
                                    "color":"#173177"
                                },
                                "keyword3": {
                                    "value": order.product.title ? order.product.title : order.product.product_title,
                                    "color":"#173177"
                                },
                                "remark":{
                                    "value":"感谢您对欢宠的支持！",
                                    "color":"#173177"
                                }
                            };
                            break;

                        case Constants.USER_TBREFUND:
                            openId = order.openid;
                            data = {
                                "first": {
                                    "value":"您的退款申请已提交.",
                                    "color":"#173177"
                                },
                                "keyword1":{
                                    "value":orderNo,
                                    "color":"#173177"
                                },
                                "keyword2": {
                                    "value": order.price.total + "元",
                                    "color":"#173177"
                                },
                                "keyword3": {
                                    "value": order.product.title ? order.product.title : order.product.product_title,
                                    "color":"#173177"
                                },
                                "remark":{
                                    "value":"感谢您对欢宠的支持！",
                                    "color":"#173177"
                                }
                            };
                            break;

                        case Constants.USER_COMPLETED:
                            openId = order.openid;
                            data = {
                                "first": {
                                    "value":"感谢您的评价.欢迎再次使用我们的服务.",
                                    "color":"#173177"
                                },
                                "keyword1":{
                                    "value":orderNo,
                                    "color":"#173177"
                                },
                                "keyword2": {
                                    "value": order.price.total + "元",
                                    "color":"#173177"
                                },
                                "keyword3": {
                                    "value": order.product.title ? order.product.title : order.product.product_title,
                                    "color":"#173177"
                                },
                                "remark":{
                                    "value":"感谢您对欢宠的支持！",
                                    "color":"#173177"
                                }
                            };
                            break;

                        case Constants.USER_REFUND_COMPLETED:
                            openId = order.openid;
                            data = {
                                "first": {
                                    "value":"您的退款已经完成.",
                                    "color":"#173177"
                                },
                                "keyword1":{
                                    "value":orderNo,
                                    "color":"#173177"
                                },
                                "keyword2": {
                                    "value": order.price.total + "元",
                                    "color":"#173177"
                                },
                                "keyword3": {
                                    "value": order.product.title ? order.product.title : order.product.product_title,
                                    "color":"#173177"
                                },
                                "remark":{
                                    "value":"感谢您对欢宠的支持！",
                                    "color":"#173177"
                                }
                            };
                            break;

                        case Constants.USER_CANCELLED:
                            openId = order.openid;
                            data = {
                                "first": {
                                    "value":"您的订单已经取消.",
                                    "color":"#173177"
                                },
                                "keyword1":{
                                    "value":orderNo,
                                    "color":"#173177"
                                },
                                "keyword2": {
                                    "value": order.price.total + "元",
                                    "color":"#173177"
                                },
                                "keyword3": {
                                    "value": order.product.title ? order.product.title : order.product.product_title,
                                    "color":"#173177"
                                },
                                "remark":{
                                    "value":"感谢您对欢宠的支持！",
                                    "color":"#173177"
                                }
                            };
                            break;
                    }

                    apiUser.sendTemplate(openId, templateId, url, '', data, function() {
                        console.log("[sent template msg]")
                    });

                    res.send('sent');

                    break;

                case "vendor":
                    switch (payload.template) {
                        case Constants.VENDOR_JOIN_SUCCESSFUL:
                            var vendor = payload.vendor;

                            openId = vendor.openid;
                            templateId = 'r_5Gp_PfRUfLw14kLzxLnN2a24P_CMHkE0r7fMTS9BA';
                            url = 'http://www.hidogs.cn/wechat/auth?destination=001vendor1view1vendorjoin_vendor';
                            var currentDate = new Date();
                            data = {
                                "first": {
                                    "value": "感谢您加入欢宠服务伙伴.您的审批已经通过！",
                                    "color": "#173177"
                                },
                                "keyword1": {
                                    "value": vendor.name,
                                    "color": "#173177"
                                },
                                "keyword2": {
                                    "value": vendor.mobile,
                                    "color": "#173177"
                                },
                                "keyword3": {
                                    "value": currentDate.getFullYear() + "/" + (currentDate.getMonth()+1) + "/" + currentDate.getDate() + " " +currentDate.getHours() + ":" + currentDate.getMinutes(),
                                    "color": "#173177"
                                },
                                "remark": {
                                    "value": "感谢您对欢宠的支持！",
                                    "color": "#173177"
                                }
                            };

                            apiVendor.sendTemplate(openId, templateId, url, '', data, function() {
                                console.log("[sent template msg]")
                            });

                            res.send('sent');

                            break;

                        case Constants.VENDOR_JOIN_REJECT:
                            var vendor = payload.vendor;

                            openId = vendor.openid;
                            templateId = 'r_5Gp_PfRUfLw14kLzxLnN2a24P_CMHkE0r7fMTS9BA';
                            url = 'http://www.hidogs.cn/wechat/auth?destination=001vendor1view1vendorjoin_vendor';
                            var currentDate = new Date();
                            data = {
                                "first": {
                                    "value": "感谢您加入欢宠服务伙伴.您需要更新/补充申请资料以完成审批过程.点击后查看详情！",
                                    "color": "#173177"
                                },
                                "keyword1": {
                                    "value": vendor.name,
                                    "color": "#173177"
                                },
                                "keyword2": {
                                    "value": vendor.mobile,
                                    "color": "#173177"
                                },
                                "keyword3": {
                                    "value": currentDate.getFullYear() + "/" + (currentDate.getMonth()+1) + "/" + currentDate.getDate() + " " +currentDate.getHours() + ":" + currentDate.getMinutes(),
                                    "color": "#173177"
                                },
                                "remark": {
                                    "value": "感谢您对欢宠的支持！",
                                    "color": "#173177"
                                }
                            };

                            apiVendor.sendTemplate(openId, templateId, url, '', data, function() {
                                console.log("[sent template msg]")
                            });

                            res.send('sent');

                            break;

                            case Constants.VENDOR_PRODUCT_PAID:
                                // handle in payment webhook
                                break;

                            case Constants.VENDOR_PRODUCT_COMMENTED:
                                break;
                    }

                    break;
            }

            break;

    }

};