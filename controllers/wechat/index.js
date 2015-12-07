var wechat = require('wechat');
var OAuth = require('wechat-oauth');
var WechatAPI = require('wechat-api');
//var db = require('../../db/db');
var operation = require('../../model/operation');
var model = require('../../model/prototype');
var sign = require('../../util/wxjssign');
var fs = require('fs');
var genuuid = require('../../util/genuuid');

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

exports.insert = wechat(WXToken).text(function (message, req, res, next) {
    var msg;

    switch (message.Content) {
        case "hgsecret":
            msg = "内部列表\n" +
                "1.[达人功能]加入达人: hgvj\n" +
                "2.[达人功能]达人服务管理: hgvp\n" +
                "3.[管理者功能]欢宠小Q服务管理: hgvpq\n" +
                "4.[用户功能]订单管理: hguo\n"
            break;
        case "hgvj":
            msg = "http://www.hidogs.cn/wechat/auth?destination=001vendor1view1vendorjoin_vendor";
            break;
        case "hgvp":
            msg = "http://www.hidogs.cn/wechat/auth?destination=001product1view1vendorproduct_vendor";
            break;
        case "hgvpq":
            msg = "http://www.hidogs.cn/product/view/vendorproducthg1";
            break;
        case "hguo":
            msg = "http://www.hidogs.cn/wechat/auth?destination=001order1view1userorder_user";
            break;
        case "hgopenid":
            msg = message.FromUserName;
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
    }

};