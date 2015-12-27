exports.show = function(req, res, next){
    var key = req.params.session_id;

    res.send(req.session[key]);
};

exports.otherget = function(req, res, next){
    var sessionId = req.params.session_id;

    switch (sessionId) {
        case "sessionforusertesting":
            if(req.query.code=="3a3404") {
                req.session.current_user = {
                    user_id: "e79fe7aa-2dfe-1fd6-76e9-b62985b0aa7a",
                    head_image_url: "http://wx.qlogo.cn/mmopen/ajNVdqHZLLAKwztbcTspbibFnCLP5D5eToEsia8SZXvjHu0swsd455HIcl5hxzK3jREKYhEqykVFYYhZZI7FZOgg/0",
                    nick_name: "one_pan",
                };

                res.send("login with user one_pan")
            }
            else {
                next();
            }

            break;

        case "sessionforvendortesting":
            if(req.query.code=="3a3404") {
                req.session.current_user = {
                    vendor_id: "d18c4e5c-6f49-7f82-7d49-db362c64cb03",
                    role: "grooming",
                    head_image_url: "http://wx.qlogo.cn/mmopen/ajNVdqHZLLAKwztbcTspbibFnCLP5D5eToEsia8SZXvjHu0swsd455HIcl5hxzK3jREKYhEqykVFYYhZZI7FZOgg/0",
                    nick_name: "one_pan",
                    status: "approved"
                };

                res.send("login with vendor one_pan")
            }
            else {
                next();
            }

            break;
    }
}