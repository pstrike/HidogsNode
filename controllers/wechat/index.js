var wechat = require('wechat');
var OAuth = require('wechat-oauth');
var db = require('../../db/db');

var config = {
    token: 'hidogs',
    appid: 'wxaddd7cf2ed2848ac',
    encodingAESKey: 'YrJHICF9PcXCYnLocVe1UoNUsOxC5MkPna4vll7IMxl'
};
var client = new OAuth('wxaddd7cf2ed2848ac', '32a1a3ab9838fca79131c42c82fd7017');

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
    res.reply("event");
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
            var url = client.getAuthorizeURL('http://www.hidogs.cn/wechat/base',destination,'snsapi_base');
            res.redirect(url);
            break;

        case "base":
            var code = req.query.code;
            var param = req.query.state.split("9");
            var destination = param[0].replace(/0/g,".");
            destination = destination.replace(/1/g,"/");
            var target = param[1];

            client.getAccessToken(code, function (err, result) {
                var accessToken = result.data.access_token;
                var openid = result.data.openid;

                db.get().collection(target).find({"openid":openid}).limit(1).toArray(function(err, docs) {
                    if(err || docs.length == 0) {
                        client.getUser(openid, function (err, result) {
                            var oauth_user = result;
                            var newuser = {
                                openid: oauth_user.openid,
                                nick_name: oauth_user.nickname,
                                head_image_url: oauth_user.headimgurl,
                                gender: oauth_user.sex,
                                address: {
                                    country: oauth_user.country,
                                    province: oauth_user.province,
                                    city: oauth_user.city,
                                },
                                status: "created",
                                certificate_list: [{name: '', image_url: ''}],
                                id_card: {
                                    no: '',
                                    front_image_url: '',
                                    back_image_url: '',
                                },
                                image_url_list: [
                                    {name: '美容后,站立正面图', image_url: ''},
                                    {name: '美容后,站立侧身图', image_url: ''},
                                    {name: '美容后,站立后视图', image_url: ''},
                                ],
                                modified_time: new Date(),
                            };
                            db.get().collection(target).insertOne(newuser, function (err, result) {
                                if (err) {
                                    console.log("[DB Err]" + err);
                                    next(err);
                                }
                                else {
                                    console.log("Inserted "+newuser.nickname+" into the user collection.");

                                    req.session.current_user = {openid: openid};

                                    res.redirect(destination);
                                }
                            });
                        });
                    }
                    else {
                        /*
                        if(user.is_valid == true){
                            req.session.current_user = user;
                            res.redirect('/mobile')
                        }else{
                            //if phone_number exist,go to user detail page to fill it
                            req.session.current_user = void 0;
                            res.redirect('/users/' + user._id + '/verify');
                        }
                        */
                        req.session.current_user = {openid: openid};
                        res.redirect(destination)
                    }

                });

            });
            break;

        default:
            // op
    }

};