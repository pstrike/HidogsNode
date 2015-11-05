var multiparty = require('multiparty');
var fs = require('fs');
var genuuid = require('../../util/genuuid');

exports.insert = function (req, res, next) {
    var form = new multiparty.Form({uploadDir: "./public/upload/tmp/"});

    form.parse(req, function(err, fields, files) {
        if(err){
            console.log("[UpLoad File Err]");
            console.log(err);
            next(err);
        } else {
            var inputFile = "";

            for(var i in files) {
                inputFile = files[i][0];
            }

            var type = fields.type[0];

            var uploadedPath = inputFile.path;
            var fileName = type + "_" + genuuid.uuid() + ".jpeg";
            //var dstPath = './public/upload/' + inputFile.originalFilename;
            var dstPath = './public/upload/' + fileName;
            //重命名为真实文件名
            fs.rename(uploadedPath, dstPath, function(err) {
                if(err){
                    console.log("[Upload Rename File Err]");
                    console.log(err);
                    next(err);
                } else {
                    //res.send('/upload/' + inputFile.originalFilename);
                    res.send('/upload/' + fileName);
                }
            });
        }
    });
};
