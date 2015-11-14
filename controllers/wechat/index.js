var wechat = require('wechat');
var OAuth = require('wechat-oauth');
var WechatAPI = require('wechat-api');
//var db = require('../../db/db');
var operation = require('../../model/operation');
var model = require('../../model/prototype');
var sign = require('../../util/wxjssign');
var fs = require('fs');
var genuuid = require('../../util/genuuid');

var config = {
    token: 'hidogs',
    appid: 'wxb7d0de94e852afd6',
    encodingAESKey: 'CN7aaTt38ofCv5d4TnlRoh04LnBxhjffwUXc3x3PR01',
    secret: '8b8a251eaf5fa007ac8d933340a9d19b',
};

var client = new OAuth(config.appid, config.secret);
var api = new WechatAPI(config.appid, config.secret);

exports.insert = wechat(config).text(function (message, req, res, next) {
    res.reply("text");
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
            var url = client.getAuthorizeURL('http://www.hidogs.cn/wechat/base',destination,'snsapi_userinfo');
            res.redirect(url);
            break;

        case "base":
            var code = req.query.code;
            var param = req.query.state.split("9");
            var destination = param[0].replace(/0/g,".");
            destination = destination.replace(/1/g,"/");
            var target = param[1]; // distinguish "vendor" or "user" to handle different type of user

            client.getAccessToken(code, function (err, result) {
                if(err) {
                    next(new Error("微信认证失败. 请授权并重试."));
                }

                console.log(result);

                if(!result) {
                    next(new Error("微信认证失败. 请授权并重试."));
                }

                if(!result.data) {
                    next(new Error("微信认证失败. 请授权并重试."));
                }

                var accessToken = result.data.access_token;
                var openid = result.data.openid;

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
                                var newVendor = model.getVendorPrototype();

                                newVendor.openid = oauth_user.openid;
                                newVendor.nick_name = oauth_user.nickname;
                                newVendor.head_image_url = oauth_user.headimgurl;
                                newVendor.gender = oauth_user.sex;
                                newVendor.address.country = oauth_user.country;
                                newVendor.address.province = oauth_user.province;
                                newVendor.address.city = oauth_user.city;

                                operation.insertObject(operation.getCollectionList()[target], newVendor, function (result) {
                                    if (result.status == "fail") {
                                        next(result.err);
                                    }
                                    else {
                                        req.session.current_user = {
                                            vendor_id: result.vendor_id,
                                            role: newVendor.role[0].slug,
                                        };

                                        res.redirect(destination);
                                    }
                                })
                            }

                        })
                    }
                    else {
                        req.session.current_user = {
                            vendor_id: objectList[0].vendor_id,
                            role: objectList[0].role[0].slug,
                        };

                        res.redirect(destination);
                    }
                })
            });
            break;

        case 'wxjssignature':
            var url = req.query.url;

            api.getTicket(function(err, result) {
                if(err) {
                    next(new Error("微信获取JS SDK失败. 请重试."));
                }

                console.log(result);

                if(!result) {
                    next(new Error("微信获取JS SDK失败. 请重试."));
                }

                var signature = sign(result.ticket, url);
                signature.appId = config.appid;

                res.send(signature);
            })

            break;

        case 'wxgetmedia':
            var mediaId = req.query.mediaid;
            var path = req.query.path;

            api.getMedia(mediaId, function(err, result, wxres) {

                var contents = wxres.headers['content-disposition'].split('"');
                var fileName = contents[1];
                var updatedFileName = path + "_" + genuuid.uuid() + '.' + fileName.split('.')[1];

                fs.writeFile('./public/upload/'+updatedFileName, result, function (err) {
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