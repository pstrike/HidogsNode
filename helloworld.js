var express = require('express');
var xml2js = require('xml2js');

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


    if(msgType == "event" && eventType == "LOCATION")
    {
        app.latitude = req.body.xml.Latitude;
        app.longitude = req.body.xml.Longitude;
    }

    if(content == "登录")
    {
        var redirectUrl = encodeURI("120.25.105.129");
        var resContent="https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxaddd7cf2ed2848ac&redirect_uri="+redirectUrl+"&response_type=code&scope=snsapi_base&state=STATE#wechat_redirect";
        var responseXML="<xml><ToUserName><![CDATA["+toUser+"]]></ToUserName><FromUserName><![CDATA["+fromUser+"]]></FromUserName><CreateTime>"+createTime+"</CreateTime><MsgType><![CDATA[text]]></MsgType><Content><![CDATA["+resContent+"]]></Content></xml>";
    }
    else if(msgType == "event" && eventType == "CLICK" && eventKey == "find_food")
    {
        var resContent="正在查找美食. 位置:"+app.latitude+";"+app.longitude;
        var responseXML="<xml><ToUserName><![CDATA["+toUser+"]]></ToUserName><FromUserName><![CDATA["+fromUser+"]]></FromUserName><CreateTime>"+createTime+"</CreateTime><MsgType><![CDATA[news]]></MsgType><ArticleCount>3</ArticleCount><Articles><item><Title><![CDATA["+resContent+"]]></Title><Url><![CDATA[http://120.25.105.129:3000/index.html]]></Url></item><item><Title><![CDATA[Location1]]></Title><Url><![CDATA[http://120.25.105.129:3000/index.html]]></Url></item><item><Title><![CDATA[location2]]></Title><Url><![CDATA[http://120.25.105.129:3000/index.html]]></Url></item></Articles></xml>";
    }
    else
    {
        var resContent="你好,"+toUser;
        var responseXML="<xml><ToUserName><![CDATA["+toUser+"]]></ToUserName><FromUserName><![CDATA["+fromUser+"]]></FromUserName><CreateTime>"+createTime+"</CreateTime><MsgType><![CDATA[text]]></MsgType><Content><![CDATA["+resContent+"]]></Content></xml>";
    }

    res.send(responseXML);
    //console.log(req.body);
});


app.listen('80');