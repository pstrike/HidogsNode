var express = require('express');
var xml2js = require('xml2js');
var db = require('./db/db');
var config = require('./config')('production');

var app = express();

function xmlBodyParser(req, res, next) {
    if (req._body) return next();
    req.body = req.body || {};

    // ignore GET
    if ('GET' == req.method || 'HEAD' == req.method) return next();

    // check Content-Type
    //if ('text/xml' != utils.mime(req)) return next();

    // flag as parsed
    req._body = true;

    // parse
    var buf = '';
    req.setEncoding('utf8');
    req.on('data', function(chunk){ buf += chunk });
    req.on('end', function(){
        var parseString = xml2js.parseString;
        parseString(buf, function(err, json) {
            if (err) {
                err.status = 400;
                next(err);
            } else {
                req.body = json;
                next();
            }
        });
    });
};

app.use(xmlBodyParser);

app.get('/', function(req, res){
    console.log(req.body);
});

app.post('/', function(req, res){
    console.log(req.body);

    var toUser = req.body.xml.FromUserName;
    var fromUser = req.body.xml.ToUserName;
    var msgType = req.body.xml.MsgType;
    var content = req.body.xml.Content;
    var createTime = new Date();
    var eventType = req.body.xml.Event;
    var eventKey = req.body.xml.EventKey;
    var responseXML="test";


    if(msgType == "event" && eventType == "LOCATION")
    {
        app.latitude = req.body.xml.Latitude;
        app.longitude = req.body.xml.Longitude;
    }

    if(content == "登录")
    {
        var redirectUrl = encodeURI("120.25.105.129");
        var resContent="https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxaddd7cf2ed2848ac&redirect_uri="+redirectUrl+"&response_type=code&scope=snsapi_base&state=STATE#wechat_redirect";
        responseXML="<xml><ToUserName><![CDATA["+toUser+"]]></ToUserName><FromUserName><![CDATA["+fromUser+"]]></FromUserName><CreateTime>"+createTime+"</CreateTime><MsgType><![CDATA[text]]></MsgType><Content><![CDATA["+resContent+"]]></Content></xml>";

        console.log(responseXML);
        res.send(responseXML);
    }
    else if(msgType == "event" && eventType == "CLICK" && eventKey == "find_food")
    {
        db.get().collection('shop').find().toArray(function(err, docs) {
            var shopList=new Array();
            for (i = 0, count = docs.length; i < count; i++) {
                shopList.push("<item><Title><![CDATA["+docs[i].name+"]]></Title><Url><![CDATA[http://120.25.105.129:3000/shop/view/"+docs[i]._id+"]]></Url></item>");
            }

            var resContent="正在查找美食. 位置:"+app.latitude+";"+app.longitude;
            responseXML="<xml><ToUserName><![CDATA["+toUser+"]]></ToUserName><FromUserName><![CDATA["+fromUser+"]]></FromUserName><CreateTime>"+createTime+"</CreateTime><MsgType><![CDATA[news]]></MsgType><ArticleCount>"+docs.length+"</ArticleCount><Articles>"+shopList+"</Articles></xml>";

            console.log(responseXML);
            res.send(responseXML);
        });
    }
    else if(msgType == "text")
    {
        db.get().collection('shop').find({"type":content[0]}).toArray(function(err, docs) {
            var shopList=new Array();
            for (i = 0, count = docs.length; i < count; i++) {
                shopList.push("<item><Title><![CDATA["+docs[i].name+"]]></Title><Url><![CDATA[http://120.25.105.129:3000/shop/view/"+docs[i]._id+"]]></Url></item>");
            }

            if(docs.length==0)
            {
                //responseXML="<xml><ToUserName><![CDATA["+toUser+"]]></ToUserName><FromUserName><![CDATA["+fromUser+"]]></FromUserName><CreateTime>"+createTime+"</CreateTime><MsgType><![CDATA[text]]></MsgType><Content><![CDATA[没找到相关地点]]></Content></xml>";
                responseXML="<xml><ToUserName><![CDATA["+toUser+"]]></ToUserName><FromUserName><![CDATA["+fromUser+"]]></FromUserName><CreateTime>"+createTime+"</CreateTime><MsgType><![CDATA[text]]></MsgType><Content><![CDATA[没找到相关地点]]></Content></xml>";
            }
            else
            {
                var resContent="正在查找美食. 位置:"+app.latitude+";"+app.longitude;
                responseXML="<xml><ToUserName><![CDATA["+toUser+"]]></ToUserName><FromUserName><![CDATA["+fromUser+"]]></FromUserName><CreateTime>"+createTime+"</CreateTime><MsgType><![CDATA[news]]></MsgType><ArticleCount>"+docs.length+"</ArticleCount><Articles>"+shopList+"</Articles></xml>";
            }

            console.log(responseXML);
            res.send(responseXML);
        });
    }
    else
    {
        var resContent="你好,"+toUser;
        responseXML="<xml><ToUserName><![CDATA["+toUser+"]]></ToUserName><FromUserName><![CDATA["+fromUser+"]]></FromUserName><CreateTime>"+createTime+"</CreateTime><MsgType><![CDATA[text]]></MsgType><Content><![CDATA["+resContent+"]]></Content></xml>";

        console.log(responseXML);
        res.send(responseXML);
    }

    //console.log(responseXML);
    //res.send(responseXML);
    //console.log(req.body);
});

db.connect('mongodb://' + config.mongo.host + ':' + config.mongo.port + '/hidogs', function(err) {
    if (err) {
        console.log('Sorry, there is no mongo db server running.');
    }
    else
    {
        app.listen(80);
        console.log(
                'Successfully connected to mongodb://' + config.mongo.host + ':' + config.mongo.port,
                '\nExpress server listening on port ' + config.port
        );
    }
});