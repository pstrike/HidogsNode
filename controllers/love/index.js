var operation = require('../../model/operation');
var prototype = require('../../model/prototype');

var commonType = [
    "贵宾(泰迪)",
    "雪纳瑞",
    "比熊",
    "博美",
    "萨摩耶",
    "金毛",
    "哈士奇",
    "拉布拉多",
    "阿拉斯加",
    "串串(混血)",
]

var weightTallConversion = [
    {
        weight: {lower: 0, upper: 8},
        tall: {lower: 0, upper: 28},
    },
    {
        weight: {lower: 8, upper: 20},
        tall: {lower: 28, upper: 38},
    },
    {
        weight: {lower: 20, upper: 40},
        tall: {lower: 38, upper: 48},
    },
    {
        weight: {lower: 40, upper: 60},
        tall: {lower: 48, upper: 60},
    },
    {
        weight: {lower: 60, upper: 999999},
        tall: {lower: 60, upper: 999999},
    },
]

exports.page = function(req, res, next){
    var page = req.params.love_id;
    var access = req.query.access;
    var token = '3a3404';

    switch (page) {
        case 'profile':

            var userAgent = req.headers['user-agent'];
            if(userAgent.indexOf('MicroMessenger') > -1 || access == token) {
                if(req.session['current_user'] && req.session['current_user'].user_id) {
                    res.render('love.ejs',{loveapp: 'profileApp'});
                }
                else {
                    var url = "http://www.hidogs.cn/wechat/auth?destination=001love1view1profile_user";
                    res.redirect(url);
                }
            }
            else {
                res.render('err.ejs');
            }

            break;
        case 'tinder':
            var isappinstalled = req.query.isappinstalled;

            var userAgent = req.headers['user-agent'];
            if(userAgent.indexOf('MicroMessenger') > -1 || access == token) {
                if(req.session['current_user'] && req.session['current_user'].user_id) {
                    if(isappinstalled) {
                        // to ensure url is the same even after share in wx
                        res.redirect("http://www.hidogs.cn/love/view/tinder");
                    }
                    else {
                        res.render('tinder.ejs',{loveapp: 'tinderApp'});
                    }
                }
                else {
                    var url = "http://www.hidogs.cn/wechat/auth?destination=001love1view1tinder_user";
                    res.redirect(url);
                }
            }
            else {
                res.render('err.ejs');
            }

            break;
        case 'showoff':
            var userId = req.query.userid;
            var isappinstalled = req.query.isappinstalled;

            var userAgent = req.headers['user-agent'];
            if(userAgent.indexOf('MicroMessenger') > -1 || access == token) {
                if(req.session['current_user'] && req.session['current_user'].user_id) {
                    if(isappinstalled) {
                        // to ensure url is the same even after share in wx
                        res.redirect("http://www.hidogs.cn/love/view/showoff?userid="+userId);
                    }
                    else {
                        res.render('showoff.ejs',{loveapp: 'showOffApp', userid: userId, iswx: 'true'});
                    }
                }
                else {
                    var url = "http://www.hidogs.cn/wechat/auth?destination=001love1view1showoff?userid="+userId+"_user";
                    res.redirect(url);
                }
            }
            else {
                res.render('showoff.ejs',{loveapp: 'showOffApp', userid: userId, iswx: 'false'});
            }

            break;
        case 'match':
            var isappinstalled = req.query.isappinstalled;

            var userAgent = req.headers['user-agent'];
            if(userAgent.indexOf('MicroMessenger') > -1 || access == token) {
                if(req.session['current_user'] && req.session['current_user'].user_id) {
                    if(isappinstalled) {
                        // to ensure url is the same even after share in wx
                        res.redirect("http://www.hidogs.cn/love/view/match");
                    }
                    else {
                        res.render('love.ejs',{loveapp: 'matchApp'});
                    }
                }
                else {
                    var url = "http://www.hidogs.cn/wechat/auth?destination=001love1view1match_user";
                    res.redirect(url);
                }
            }
            else {
                res.render('err.ejs');
            }

            break;
        default:
            next();
    }
};

exports.otherget = function(req, res, next){
    var type = req.params.love_id;

    switch (type) {
        case 'tinder':
            var userId = req.query.userid;
            var result = [];

            operation.getObject(operation.getCollectionList().user, userId, {user_id:1, pet:1, love:1, address:1}, function(user) {
                var isCommonType = false;
                for(var i=0; i<commonType.length; i++) {
                    if(user.pet.type == commonType[i]) {
                        isCommonType = true;
                        break;
                    }
                }

                var filter;
                if(isCommonType) {
                    filter = {
                        'address.city': user.address.city,
                        'pet.gender': user.pet.gender == "1" ? "2" : "1",
                    }
                }
                else {
                    filter = {
                        'pet.gender': user.pet.gender == "1" ? "2" : "1",
                    }
                }

                operation.getObjectList(operation.getCollectionList().user, filter, {user_id:1, pet:1, address:1, created_time:1}, function(userList) {
                    var tempTargetUserList = userList.map(function(targetUser) {
                        if(isCommonType) {
                            targetUser.score = userScoreForCommonType(user, targetUser);
                        }
                        else {
                            targetUser.score = userScoreForOtherType(user, targetUser);
                        }

                        return targetUser;
                    })

                    var isILoved = false;
                    var isIHated = false;

                    tempTargetUserList.forEach(function(tmpTargetUser) {
                        for(var j=0; j<user.love.i_love.length; j++) {
                            if(tmpTargetUser.user_id == user.love.i_love[j]) {
                                isILoved = true;
                                break;
                            }
                        }

                        for(var k=0; k<user.love.i_hate.length; k++) {
                            if(tmpTargetUser.user_id == user.love.i_hate[k]) {
                                isIHated = true;
                                break;
                            }
                        }

                        //console.log("user:"+tmpTargetUser.user_id+" score:"+tmpTargetUser.score)

                        if(!isILoved && !isIHated) {
                            result.push(tmpTargetUser);
                        }

                        isILoved = false;
                        isIHated = false;
                    })

                    result = result.sort(function(a,b){return a.score<b.score?1:-1});

                    res.send(result);
                })
            })

            break;

        case 'loveuser':
            var userId = req.query.userid;
            var lovedUserId = req.query.loveduserid;

            console.log(userId + " love " + lovedUserId);

            operation.getObject(operation.getCollectionList().user, userId, {user_id:1, love:1}, function(user) {
                if(user) {

                    var newUser = {};
                    newUser.user_id = user.user_id;
                    newUser.love = user.love;
                    if(!user.love) {
                        newUser.love = prototype.getUserPrototype().love;
                    }
                    newUser.love.i_love.push(lovedUserId);

                    operation.updateObject(operation.getCollectionList().user, newUser, function(result) {
                        if(result.status == 'fail') {
                            next(result.err);
                        }

                        operation.getObject(operation.getCollectionList().user, lovedUserId, {user_id:1, love:1}, function(lovedUser) {
                            if(lovedUser) {
                                var newLovedUser = {};
                                newLovedUser.user_id = lovedUser.user_id;
                                newLovedUser.love = lovedUser.love;
                                if(!lovedUser.love) {
                                    newLovedUser.love = prototype.getUserPrototype().love;
                                }
                                newLovedUser.love.love_me.push(userId);

                                operation.updateObject(operation.getCollectionList().user, newLovedUser, function(result) {
                                    if(result.status == 'fail') {
                                        next(result.err);
                                    }
                                    res.send(result);
                                });
                            }
                            else {
                                next();
                            }
                        })

                    });
                }
                else {
                    next();
                }
            })

            break;

        case 'hateuser':
            var userId = req.query.userid;
            var hatedUserId = req.query.hateduserid;

            console.log(userId + " hate " + hatedUserId);

            operation.getObject(operation.getCollectionList().user, userId, {user_id:1, love:1}, function(user) {
                if(user) {
                    var newUser = {};
                    newUser.user_id = user.user_id;
                    newUser.love = user.love;
                    if(!user.love) {
                        newUser.love = prototype.getUserPrototype().love;
                    }
                    newUser.love.i_hate.push(hatedUserId);

                    operation.updateObject(operation.getCollectionList().user, newUser, function(result) {
                        if(result.status == 'fail') {
                            next(result.err);
                        }
                        res.send(result);
                    });
                }
                else {
                    next();
                }
            })

            break;

        case 'support':
            var userIp = req.query.ip;
            var userId = req.query.userid;

            operation.getObject(operation.getCollectionList().user, userId, {user_id:1, love:1}, function(user) {
                if(user) {
                    var newUser = {};
                    newUser.user_id = user.user_id;
                    newUser.love = user.love;
                    if(!user.love) {
                        newUser.love = prototype.getUserPrototype().love;
                    }
                    newUser.love.support.push(userIp);

                    operation.updateObject(operation.getCollectionList().user, newUser, function(result) {
                        if(result.status == 'fail') {
                            next(result.err);
                        }
                        res.send(result);
                    });
                }
                else {
                    next();
                }
            })

            break;

        default:
            next();
    }
};

function userScoreForCommonType(user, targetUser) {
    var result = 0;

    if(user.pet.type == targetUser.pet.type) {
        result += 10000;
    }

    if(user.pet.weight && user.pet.tall) {
        if(isTallSimilar(user.pet.gender, user.pet.tall, targetUser.pet.tall ? targetUser.pet.tall : weightConvertToTall(targetUser.pet.weight))) {
            result += 1000;
        }

        if(isWeightSimilar(user.pet.gender, user.pet.weight, targetUser.pet.weight ? targetUser.pet.weight : tallConvertToWeight(targetUser.pet.tall))) {
            result += 100;
        }
    }
    else if(user.pet.weight && !user.pet.tall) {
        if(isWeightSimilar(user.pet.gender, user.pet.weight, targetUser.pet.weight ? targetUser.pet.weight : tallConvertToWeight(targetUser.pet.tall))) {
            result += 1000;
        }

        if(isTallSimilar(user.pet.gender, weightConvertToTall(user.pet.weight), targetUser.pet.tall ? targetUser.pet.tall : weightConvertToTall(targetUser.pet.weight))) {
            result += 100;
        }

    }
    else if(!user.pet.weight && user.pet.tall) {
        if(isTallSimilar(user.pet.gender, user.pet.tall, targetUser.pet.tall ? targetUser.pet.tall : weightConvertToTall(targetUser.pet.weight))) {
            result += 1000;
        }

        if(isWeightSimilar(user.pet.gender, tallConvertToWeight(user.pet.tall), targetUser.pet.weight ? targetUser.pet.weight : tallConvertToWeight(targetUser.pet.tall))) {
            result += 100;
        }
    }

    if(user.pet.color == targetUser.pet.color) {
        result += 10;
    }

    if(isRobot(targetUser)) {
        result += 0;
    }
    else {
        if(isNewUser(targetUser)){
            result += 2;
        }
        else {
            result += 1;
        }
    }

    return result;
}

function userScoreForOtherType(user, targetUser) {
    var result = 0;

    if(user.pet.type == targetUser.pet.type) {
        result += 100000;
    }

    if(user.pet.weight && user.pet.tall) {
        if(isTallSimilar(user.pet.gender, user.pet.tall, targetUser.pet.tall ? targetUser.pet.tall : weightConvertToTall(targetUser.pet.weight))) {
            result += 10000;
        }

        if(isWeightSimilar(user.pet.gender, user.pet.weight, targetUser.pet.weight ? targetUser.pet.weight : tallConvertToWeight(targetUser.pet.tall))) {
            result += 1000;
        }
    }
    else if(user.pet.weight && !user.pet.tall) {
        if(isWeightSimilar(user.pet.gender, user.pet.weight, targetUser.pet.weight ? targetUser.pet.weight : tallConvertToWeight(targetUser.pet.tall))) {
            result += 10000;
        }

        if(isTallSimilar(user.pet.gender, weightConvertToTall(user.pet.weight), targetUser.pet.tall ? targetUser.pet.tall : weightConvertToTall(targetUser.pet.weight))) {
            result += 1000;
        }

    }
    else if(!user.pet.weight && user.pet.tall) {
        if(isTallSimilar(user.pet.gender, user.pet.tall, targetUser.pet.tall ? targetUser.pet.tall : weightConvertToTall(targetUser.pet.weight))) {
            result += 10000;
        }

        if(isWeightSimilar(user.pet.gender, tallConvertToWeight(user.pet.tall), targetUser.pet.weight ? targetUser.pet.weight : tallConvertToWeight(targetUser.pet.tall))) {
            result += 1000;
        }
    }

    if(user.address.city == targetUser.address.city) {
        result += 100;
    }

    if(user.pet.color == targetUser.pet.color) {
        result += 10;
    }

    if(isRobot(targetUser)) {
        result += 0;
    }
    else {
        if(isNewUser(targetUser)){
            result += 2;
        }
        else {
            result += 1;
        }
    }

    return result;
}

function weightConvertToTall(weight) {
    var result = 0;

    for(var i=0; i<weightTallConversion.length; i++) {
        if(weight >= weightTallConversion[i].weight.lower && weight < weightTallConversion[i].weight.upper) {
            result = ((weightTallConversion[i].tall.upper - weightTallConversion[i].tall.lower) * (weight - weightTallConversion[i].weight.lower) / (weightTallConversion[i].weight.upper - weightTallConversion[i].weight.lower)) + weightTallConversion[i].tall.lower;
        }
    }

    return result;
}

function tallConvertToWeight(tall) {
    var result = 0;

    for(var i=0; i<weightTallConversion.length; i++) {
        if(tall >= weightTallConversion[i].tall.lower && tall < weightTallConversion[i].tall.upper) {
            result = ((weightTallConversion[i].weight.upper - weightTallConversion[i].weight.lower) * (tall - weightTallConversion[i].tall.lower) / (weightTallConversion[i].tall.upper - weightTallConversion[i].tall.lower)) + weightTallConversion[i].weight.lower;
        }
    }

    return result;
}

function isTallSimilar(gender, tall, targetTall) {
    var result = false;
    var iTall = parseFloat(tall);
    var iTargetTall = parseFloat(targetTall);

    if(gender == '1') {
        if(iTargetTall <= iTall+10 && iTargetTall >= iTall-5) {
            result = true;
        }
    }
    else {
        if(iTargetTall <= iTall+5 && iTargetTall >= iTall-10) {
            result = true;
        }
    }

    return result;
}

function isWeightSimilar(gender, weight, targetWeight) {
    var result = false;
    var iWeight = parseFloat(weight);
    var iTargetWeight = parseFloat(targetWeight);

    if(gender == '1') {
        if(iTargetWeight <= iWeight+10 && iTargetWeight >= iWeight-5) {
            result = true;
        }
    }
    else {
        if(iTargetWeight <= iWeight+5 && iTargetWeight >= iWeight-10) {
            result = true;
        }
    }

    return result;
}

function isNewUser(user) {
    var newUserLine = new Date();
    newUserLine.setDate(newUserLine.getDate - 1);

    var userCreatedDate = new Date(user.created_time);

    if(userCreatedDate > newUserLine) {
        return true;
    }
    else {
        return false;
    }
}

function isRobot(user) {
    if(user.user_id.indexOf("robot")>-1) {
        return true;
    }
    else {
        return false;
    }
}