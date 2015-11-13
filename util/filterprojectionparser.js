exports.parse = function (req, res, next) {

    if(req.query.filter) {
        var rawFilter = req.query.filter.split(",");
        var filter = {};
        for(var i=0; i<rawFilter.length; i=i+2) {
            filter[rawFilter[i]] = rawFilter[i+1];
        }
        req.filter = filter;
    }

    if(req.query.projection) {
        var rawProjection = req.query.projection.split(",");
        var projection = {};
        for(i in rawProjection)
        {
            projection[rawProjection[i]] = 1;
        }
        req.projection = projection;
    }

    if(req.query.exclusion) {
        var rawExclusion = req.query.exclusion.split(",");
        var exclusion = {};
        for(i in rawExclusion)
        {
            exclusion[rawExclusion[i]] = 0;
        }
    }

    if(!req.projection) {
        req.projection = exclusion;
    }
    else {
        for(var key in exclusion) {
            req.projection[key] = exclusion[key];
        }
    }

    next();
}