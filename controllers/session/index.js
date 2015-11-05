exports.show = function(req, res, next){
    var key = req.params.session_id;

    res.send(req.session[key]);
};