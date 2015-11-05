var url = require("url");
var crypto = require("crypto");

function sha1(str){
    var md5sum = crypto.createHash("sha1");
    md5sum.update(str);
    str = md5sum.digest("hex");
    return str;
}

exports.validateToken = function (req,res,next){
    var query = url.parse(req.url,true).query;
    //console.log("*** URL:" + req.url);
    //console.log(query);
    var signature = query.signature;
    var echostr = query.echostr;
    var timestamp = query['timestamp'];
    var nonce = query.nonce;
    var oriArray = new Array();
    oriArray[0] = nonce;
    oriArray[1] = timestamp;
    oriArray[2] = "hidogs";//这里是你在微信开发者中心页面里填的token，而不是****
    oriArray.sort();
    var original = oriArray.join('');
    console.log("Original str : " + original);
    console.log("Signature : " + signature );
    var scyptoString = sha1(original);
    if(signature == scyptoString){
        res.end(echostr);
        console.log("Confirm and send echo back");
    }else {
        res.end("false");
        console.log("Failed!");
    }
}
