var operation = require('../../model/operation');

exports.show = function(req, res, next){
    var key = req.params.session_id;

    res.send(req.session[key]);
};

exports.otherget = function(req, res, next){
    var sessionId = req.params.session_id;

    if(!req.query.code == "3a3404") {
        next();
    }

    switch (sessionId) {
        case "sessionforusertesting":
            var userId = req.query.userid;

            operation.getObject(operation.getCollectionList().user, userId, {}, function(object) {
                if(object) {
                    req.session.current_user = {
                        user_id: object.user_id,
                        head_image_url: object.head_image_url,
                        nick_name: object.nick_name,
                        openid: object.opend_id,
                    };

                    res.send("login with user")
                }
                else {
                    next();
                }

            })

            break;

        case "sessionforvendortesting":
            var vendorId = req.query.vendorid;

            operation.getObject(operation.getCollectionList().vendor, vendorId, {}, function(object) {
                if(object) {
                    req.session.current_user = {
                        vendor_id: object.vendor_id,
                        role: "grooming",
                        head_image_url: object.head_image_url,
                        nick_name: object.nick_name,
                        status: object.status
                    };

                    res.send("login with vendor")
                }
                else {
                    next();
                }

            })

            break;
    }
}