var wechat = require('wechat');
var OAuth = require('wechat-oauth');
var WechatAPI = require('wechat-api');



var Constants = {
    base: "snsapi_base",
    userinfo: "snsapi_userinfo",
};



var WechatService = function (config, msgContent) {
    this.wechatOAuth = new OAuth(config.appid, config.appsecret);
    this.wechatApi = new WechatAPI(config.appid, config.appsecret);
    this.config = config;

    this.msgContent = msgContent;
};

WechatService.prototype.message = wechat(this.config.token).text(function (message, req, res, next) {
    if(this.msgContent.text[message.Content]) {
        res.reply(this.msgContent.text[message.Content]);
    }
    else {
        res.reply(this.msgContent.text['default']);
    }
}).image(function (message, req, res, next) {
    if(this.msgContent.image[message.Content]) {
        res.reply(this.msgContent.image[message.Content]);
    }
    else {
        res.reply(this.msgContent.image['default']);
    }
}).voice(function (message, req, res, next) {
    if(this.msgContent.voice[message.Content]) {
        res.reply(this.msgContent.voice[message.Content]);
    }
    else {
        res.reply(this.msgContent.voice['default']);
    }
}).video(function (message, req, res, next) {
    if(this.msgContent.video[message.Content]) {
        res.reply(this.msgContent.video[message.Content]);
    }
    else {
        res.reply(this.msgContent.video['default']);
    }
}).location(function (message, req, res, next) {
    if(this.msgContent.location[message.Content]) {
        res.reply(this.msgContent.location[message.Content]);
    }
    else {
        res.reply(this.msgContent.location['default']);
    }
}).link(function (message, req, res, next) {
    if(this.msgContent.link[message.Content]) {
        res.reply(this.msgContent.link[message.Content]);
    }
    else {
        res.reply(this.msgContent.link['default']);
    }
}).event(function (message, req, res, next) {
    if(this.msgContent.event[message.Content]) {
        res.reply(this.msgContent.event[message.Content]);
    }
    else {
        res.reply(this.msgContent.event['default']);
    }
}).device_text(function (message, req, res, next) {
    if(this.msgContent.device_text[message.Content]) {
        res.reply(this.msgContent.device_text[message.Content]);
    }
    else {
        res.reply(this.msgContent.device_text['default']);
    }
}).device_event(function (message, req, res, next) {
    if(this.msgContent.device_event[message.Content]) {
        res.reply(this.msgContent.device_event[message.Content]);
    }
    else {
        res.reply(this.msgContent.device_event['default']);
    }
}).middlewarify();

WechatService.prototype.oauthAccess = function(type, destination, req, res, next){
    var url = this.wechatOAuth.getAuthorizeURL(this.config.oauthRedirectUrl, destination, type);
    res.redirect(url);
};

WechatService.prototype.oauthGetBaseInfo = function(req, res, next){

};

WechatService.prototype.oauthGetUserInfo = function(req, res, next){

};