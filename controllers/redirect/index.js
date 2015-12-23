
exports.show = function(req, res, next){
    var redirect = req.params.redirect_id;

    switch(redirect) {
        case 'userproduct':
            var product = req.query.product;

            res.send("../../product/view/userproductprecheck?product="+product);
            break;

        default:
            next(new Error("Redirect Fail"));
    }
};
