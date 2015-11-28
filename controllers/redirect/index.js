
exports.show = function(req, res, next){
    var redirect = req.params.redirect_id;

    switch(redirect) {
        case 'userproduct':
            var product = req.query.product;
            console.log(product);
            res.send("../../product/view/userproduct?product="+product);
            break;

        default:
            next(new Error("Redirect Fail"));
    }
};
