var operation = require('../../model/operation');
var prototype = require('../../model/prototype');
var formatdatetime = require('../../util/formatdatetime');

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

var resultBasicNo = 15;
var resultCredit = 5;
var resulCreditPerCommentNo = 10;

exports.page = function(req, res, next){
    var page = req.params.love_id;
    var access = req.query.access;
    var token = '3a3404';

    switch (page) {
        case 'profile':
            var isappinstalled = req.query.isappinstalled; // when share in wx friend line, the req have this param

            var userAgent = req.headers['user-agent'];
            if(userAgent.indexOf('MicroMessenger') > -1 || access == token) {
                if(req.session['current_user'] && req.session['current_user'].user_id) {
                    if(isappinstalled) {
                        // to ensure url is the same even after share in wx
                        res.redirect("http://www.hidogs.cn/love/view/profile");
                    }
                    else {
                        visitCount(req.session['current_user'].user_id, function() {
                            res.render('love.ejs',{loveapp: 'profileApp'});
                        });
                    }
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
                        visitCount(req.session['current_user'].user_id, function() {
                            res.render('tinder.ejs',{loveapp: 'tinderApp'});
                        });
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
                        visitCount(req.session['current_user'].user_id, function() {
                            res.render('showoff.ejs',{loveapp: 'showOffApp', userid: userId, iswx: 'true'});
                        });
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
                        visitCount(req.session['current_user'].user_id, function() {
                            res.render('love.ejs',{loveapp: 'matchApp'});
                        });
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

        case 'top':
            var isappinstalled = req.query.isappinstalled; // when share in wx friend line, the req have this param

            var userAgent = req.headers['user-agent'];
            if(userAgent.indexOf('MicroMessenger') > -1 || access == token) {
                if(req.session['current_user'] && req.session['current_user'].user_id) {
                    if(isappinstalled) {
                        // to ensure url is the same even after share in wx
                        res.redirect("http://www.hidogs.cn/love/view/top");
                    }
                    else {
                        visitCount(req.session['current_user'].user_id, function() {
                            res.render('love.ejs',{loveapp: 'topApp'});
                        });
                    }
                }
                else {
                    var url = "http://www.hidogs.cn/wechat/auth?destination=001love1view1top_user";
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
            var netLoveMeList = [];

            operation.getObject(operation.getCollectionList().user, userId, {user_id:1, pet:1, love:1, address:1}, function(user) {

                var isMatched;
                for(var m=0; m<user.love.love_me.length; m++) {
                    isMatched = false;

                    for(var n=0; n<user.love.i_love.length; n++) {
                        if(user.love.love_me[m] == user.love.i_love[n]) {
                            isMatched = true;
                            break;
                        }
                    }

                    if(!isMatched) {
                        netLoveMeList.push(user.love.love_me[m]);
                    }
                }

                var isCommonType = false;
                for(var i=0; i<commonType.length; i++) {
                    if(user.pet.type == commonType[i]) {
                        isCommonType = true;
                        break;
                    }
                }

                var city = "其他";
                if(user.address.city.indexOf('广州') > -1
                ||user.address.city.indexOf('深圳') > -1
                ||user.address.city.indexOf('上海') > -1
                ||user.address.city.indexOf('北京') > -1
                ||user.address.city.indexOf('长沙') > -1
                ||user.address.city.indexOf('杭州') > -1
                ||user.address.city.indexOf('温州') > -1
                ||user.address.city.indexOf('天津') > -1
                ||user.address.city.indexOf('重庆') > -1
                ||user.address.city.indexOf('成都') > -1
                ||user.address.city.indexOf('武汉') > -1
                ||user.address.city.indexOf('沈阳') > -1) {
                    city = "主要";
                }

                var filter;
                if(isCommonType) {
                    filter = {
                        'address.city': { $in: [ user.address.city, city ] },
                        'pet.gender': user.pet.gender == "1" ? "2" : "1",
                    }
                }
                else {
                    filter = {
                        'pet.gender': user.pet.gender == "1" ? "2" : "1",
                    }
                }

                operation.getObjectList(operation.getCollectionList().user, filter, {user_id:1, pet:1, address:1, created_time:1, head_image_url:1}, function(userList) {
                    var tempTargetUserList = userList.map(function(targetUser) {
                        if(isCommonType) {
                            targetUser.score = userScoreForCommonType(user, targetUser, netLoveMeList);
                        }
                        else {
                            targetUser.score = userScoreForOtherType(user, targetUser, netLoveMeList);
                        }

                        return targetUser;
                    })

                    var isILoved;
                    var iHatedNo;
                    var isLoveMe;
                    var isSameType;
                    var tmpResult = [];

                    tempTargetUserList.forEach(function(tmpTargetUser) {
                        isILoved = false;
                        iHatedNo = 0;
                        isLoveMe = false;
                        isSameType = false;

                        for(var j=0; j<user.love.i_love.length; j++) {
                            if(tmpTargetUser.user_id == user.love.i_love[j]) {
                                isILoved = true;
                                break;
                            }
                        }

                        for(var k=0; k<user.love.i_hate.length; k++) {
                            if(tmpTargetUser.user_id == user.love.i_hate[k]) {

                                // if same type pet and hate before, then reduce the score for reshow preparation
                                if(isCommonType) {
                                    if(tmpTargetUser.score >= 10000) {
                                        tmpTargetUser.score = 10000-1;
                                        isSameType = true;
                                    }
                                }
                                else {
                                    if(tmpTargetUser.score >= 100000) {
                                        tmpTargetUser.score = 100000-1;
                                        isSameType = true;
                                    }
                                }

                                iHatedNo++;
                            }
                        }

                        for(var l=0; l<netLoveMeList.length; l++) {
                            if(tmpTargetUser.user_id == netLoveMeList[l]) {
                                isLoveMe = true;
                                tmpTargetUser.isLoveMe = true; // set this flag so that F/E could handle
                            }
                        }

                        //console.log("user:"+tmpTargetUser.user_id+" score:"+tmpTargetUser.score)

                        if(
                            (!isILoved && iHatedNo<1)
                            || (!isILoved && iHatedNo < 2 && (isLoveMe || isSameType))
                        ) {
                            tmpResult.push(tmpTargetUser);
                        }
                    })

                    tmpResult = tmpResult.sort(function(a,b){return a.score<b.score?1:-1});

                    // calculate total result no base on user
                    var resultLimitedNo = resultBasicNo + parseInt(user.love.support.length / resulCreditPerCommentNo) * resultCredit;

                    var resultNo = resultLimitedNo;
                    var todayDate = new Date();
                    var latestVisitedDate = user.love.visit_status.date ? new Date(user.love.visit_status.date) : "";
                    if(latestVisitedDate && formatdatetime.formatDate(todayDate) == formatdatetime.formatDate(latestVisitedDate)) {
                        resultNo = resultLimitedNo - user.love.visit_status.count;
                    }

                    for(var i=0; i<(resultNo < tmpResult.length ? resultNo : tmpResult.length); i++) {
                        result.push(tmpResult[i]);
                    }

                    // make same type result in random way
                    var disorderList = [];
                    result.forEach(function(item) {
                        if(isCommonType) {
                            if(item.score >= 10000) {
                                disorderList.push(item);
                            }
                        }
                        else {
                            if(item.score >= 100000) {
                                disorderList.push(item);
                            }
                        }
                    })
                    disorderList = disorderList.sort(function(a,b){return Math.random()>.5 ? -1 : 1;});
                    var finalResult = [];
                    for(var i=0; i<result.length; i++) {
                        if(i<disorderList.length) {
                            finalResult.push(disorderList[i]);
                        }
                        else {
                            finalResult.push(result[i]);
                        }

                    }

                    res.send({
                        isLimited: user.love.visit_status.count >= resultLimitedNo ? true : false,
                        isMore: finalResult.length < tmpResult.length ? true : false,
                        result: finalResult,
                    });
                })
            })

            break;

        case 'loveuser':
            var userId = req.query.userid;
            var lovedUserId = req.query.loveduserid;

            //console.log(userId + " love " + lovedUserId);

            operation.getObject(operation.getCollectionList().user, userId, {user_id:1, love:1}, function(user) {
                if(user) {

                    var newUser = {};
                    newUser.user_id = user.user_id;
                    newUser.love = user.love;
                    if(!user.love) {
                        newUser.love = prototype.getUserPrototype().love;
                    }
                    newUser.love.i_love.push(lovedUserId);

                    var todayDate = new Date();
                    var latestVisitedDate = user.love.visit_status.date ? new Date(user.love.visit_status.date) : "";
                    if(latestVisitedDate && formatdatetime.formatDate(todayDate) == formatdatetime.formatDate(latestVisitedDate)) {
                        newUser.love.visit_status.count ++;
                    }
                    else {
                        newUser.love.visit_status.date = todayDate;
                        newUser.love.visit_status.count = 1;
                    }

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

            //console.log(userId + " hate " + hatedUserId);

            operation.getObject(operation.getCollectionList().user, userId, {user_id:1, love:1}, function(user) {
                if(user) {
                    var newUser = {};
                    newUser.user_id = user.user_id;
                    newUser.love = user.love;
                    if(!user.love) {
                        newUser.love = prototype.getUserPrototype().love;
                    }
                    newUser.love.i_hate.push(hatedUserId);

                    var todayDate = new Date();
                    var latestVisitedDate = user.love.visit_status.date ? new Date(user.love.visit_status.date) : "";
                    if(latestVisitedDate && formatdatetime.formatDate(todayDate) == formatdatetime.formatDate(latestVisitedDate)) {
                        newUser.love.visit_status.count ++;
                    }
                    else {
                        newUser.love.visit_status.date = todayDate;
                        newUser.love.visit_status.count = 1;
                    }

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

        case 'top':
            var result = {
                fav: {},
                playdog: {},
                pop: {},
                cool: {},
                lazy: {},
            };
            var userList = []

            operation.getObjectList(operation.getCollectionList().user, {}, {user_id:1, pet:1, love:1}, function(objectList) {
                objectList.forEach(function(user) {
                    if(user.user_id.indexOf("robot") < 0) {
                        user.fav = user.love.love_me.length;
                        user.playdog = user.love.i_love.length;
                        user.pop = user.love.support.length;
                        user.cool = user.love.love_me.length > 0 ? user.love.i_love.length / user.love.love_me.length : 0;

                        userList.push(user);
                    }
                })

                userList = userList.sort(function(a,b){return a.fav<b.fav?1:-1});
                for(var j=0; j<userList.length; j++) {
                    if(userList[j].pet.name)
                    {
                        result.fav = userList[j];
                        break;
                    }
                }

                userList = userList.sort(function(a,b){return a.playdog<b.playdog?1:-1});
                for(var j=0; j<userList.length; j++) {
                    if(userList[j].pet.name)
                    {
                        result.playdog = userList[j];
                        break;
                    }
                }

                userList = userList.sort(function(a,b){return a.pop<b.pop?1:-1});
                for(var j=0; j<userList.length; j++) {
                    if(userList[j].pet.name)
                    {
                        result.pop = userList[j];
                        break;
                    }
                }

                userList = userList.sort(function(a,b){return a.cool>b.cool?1:-1});
                for(var i=0; i<userList.length; i++) {
                    if(userList[i].fav > 20 && userList[j].pet.name)
                    {
                        result.cool = userList[i];
                        break;
                    }
                }

                userList = userList.sort(function(a,b){return a.playdog>b.playdog?1:-1});
                for(var j=0; j<userList.length; j++) {
                    if(userList[j].pet.name)
                    {
                        result.lazy = userList[j];
                        break;
                    }
                }

                res.send(result);
            })

            break;

        case "random":
            var favNo = parseInt(req.query.no/3);
            var popNo = parseInt(req.query.no/3);
            var playdogNo = parseInt(req.query.no/3) + req.query.no%3;
            var randomNo;

            var result = [];
            var userList = [];

            operation.getObjectList(operation.getCollectionList().user, {}, {user_id:1, pet:1, love:1}, function(objectList) {
                objectList.forEach(function (user) {
                    if (user.user_id.indexOf("robot") < 0 && user.pet && user.pet.name) {
                        user.fav = user.love.love_me.length;
                        user.playdog = user.love.i_love.length;
                        user.pop = user.love.support.length;

                        userList.push(user);
                    }
                })

                userList = userList.sort(function(a,b){return a.fav<b.fav?1:-1});
                for(var j=0; j<favNo; j++) {
                    randomNo = parseInt(Math.random() * ((userList.length / favNo)-1), 10) + j * parseInt(userList.length / favNo);
                    result.push(userList[randomNo]);
                }

                userList = userList.sort(function(a,b){return a.pop<b.pop?1:-1});
                for(var j=0; j<popNo; j++) {
                    randomNo = parseInt(Math.random() * ((userList.length / favNo)-1), 10) + j * parseInt(userList.length / popNo);
                    result.push(userList[randomNo]);
                }

                userList = userList.sort(function(a,b){return a.playdog<b.playdog?1:-1});
                for(var j=0; j<playdogNo; j++) {
                    randomNo = parseInt(Math.random() * ((userList.length / favNo)-1), 10) + j * parseInt(userList.length / playdogNo);
                    result.push(userList[randomNo]);
                }

                res.send(result);
            })

            break;

        case "ranking":
            var userId = req.query.userid;
            var userList = [];

            operation.getObjectList(operation.getCollectionList().user, {}, {user_id:1, pet:1, love:1}, function(objectList) {
                objectList.forEach(function (user) {
                    if (user.user_id.indexOf("robot") < 0 && user.pet && user.pet.name) {
                        // the score is determine by love_me (weight 5) + support (weight 1)
                        user.ranking = user.love.love_me.length*5 + user.love.support.length;

                        userList.push(user);
                    }
                })

                userList = userList.sort(function(a,b){return a.ranking<b.ranking?1:-1});
                var counter;
                for(counter=0; counter<userList.length; counter++) {
                    //console.log("counter:"+counter+";user id:"+userList[counter].user_id)
                    if(userList[counter].user_id == userId) {
                        break;
                    }
                }

                var rank = userList.length == 0 ? 0 : (userList.length - counter) / userList.length;
                if(rank < 0.3) {
                    rank = 0.3 + Math.random()*0.1;
                }

                //console.log("total:"+userList.length+";rank:"+counter);

                res.send({
                    rank: rank,
                });
            })



            break;

        default:
            next();
    }
};

function userScoreForCommonType(user, targetUser, netLoveMeList) {
    var result = 0;

    for(var i=0; i<netLoveMeList.length; i++) {
        if(netLoveMeList[i] == targetUser.user_id) {
            result += 100000;
            break;
        }
    }

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

function userScoreForOtherType(user, targetUser, netLoveMeList) {
    var result = 0;

    for(var i=0; i<netLoveMeList.length; i++) {
        if(netLoveMeList[i] == targetUser.user_id) {
            result += 1000000;
            break;
        }
    }

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

function visitCount(userId, callback) {
    operation.getObject(operation.getCollectionList().user, userId, {user_id:1, visit_count:1}, function(user) {
        if (user) {
            var newUser = {};
            newUser.user_id = user.user_id;
            if(!user.visit_count) {
                newUser.visit_count = prototype.getUserPrototype().visit_count;
            }
            else {
                newUser.visit_count = user.visit_count;
            }

            if(newUser.visit_count['love']) {
                newUser.visit_count['love']++;
            }
            else {
                newUser.visit_count['love'] = 1;
            }

            newUser.last_visited_time = new Date();

            operation.updateObject(operation.getCollectionList().user, newUser, function(result) {
                if(result.status == 'fail') {
                    next(result.err);
                }
                callback();
            });

        }
    })
}