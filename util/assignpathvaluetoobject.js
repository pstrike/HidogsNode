exports.assign = function(target, path, value) {
    var rawPath = path.split(".");
    var isArray = false;

    var updatedPath = rawPath.map(function(item, index) {
        if(item.indexOf("[")>-1) {
            if(index == rawPath.length-1) {
                isArray = true;
            }

            return parseInt(item.substring(2, item.length-2));
        }
        else {
            return item;
        }
    });

    var object = target;
    var tmpObject = object;
    updatedPath.forEach(function(item, index){
        if(index == updatedPath.length-1) {
            tmpObject[item] = value;
        }
        else {
            if(!tmpObject[item]) {
                if(isArray && index == updatedPath.length-2) {
                    tmpObject[item] = [];
                }
                else {
                    tmpObject[item] = {};
                }
            }
            tmpObject = tmpObject[item];
        }
    });

    return object;
};

exports.path = function(path) {
    var rawPath = path.split(".");

    var updatedPath = rawPath.map(function(item, index) {
        if(item.indexOf("[")>-1) {
            return parseInt(item.substring(2, item.length-2));
        }
        else {
            return item;
        }
    });

    return updatedPath;
};