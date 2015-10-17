var multiparty = require('multiparty');
var fs = require('fs');

exports.insert = function (req, res, next) {
    var form = new multiparty.Form({uploadDir: "./public/upload/tmp/"});

    form.parse(req, function(err, fields, files) {

        var filesTmp = JSON.stringify(files,null,2);

        if(err){
            console.log("[UpLoad File Err]");
            console.log(err);
            next(err);
        } else {
            console.log('parse files: ' + filesTmp);
            var inputFile = files.datafile[0];
            var uploadedPath = inputFile.path;
            var dstPath = './public/upload/' + inputFile.originalFilename;
            //重命名为真实文件名
            fs.rename(uploadedPath, dstPath, function(err) {
                if(err){
                    console.log("[Upload Rename File Err]");
                    console.log(err);
                    next(err);
                } else {
                    res.send('/upload/' + inputFile.originalFilename);
                }
            });
        }
    });
};
