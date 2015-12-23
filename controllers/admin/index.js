var React = require('react'),
    App = React.createFactory(require('../../app/Admin/components/App.react'));

exports.engine = 'ejs';

exports.page = function(req, res, next){
    var page = req.params.admin_id;

    switch (page) {
        case 'vendor':
            res.render('adminmain.ejs');
            break;

        case 'potentialvendor':
            res.render('adminpotentialvendor.ejs');
            break;

        case 'user':
            res.render('adminuser.ejs');
            break;

        case 'product':
            res.render('adminproduct.ejs');
            break;

        case 'order':
            res.render('adminorder.ejs');
            break;

        case 'coupon':
            res.render('admincoupon.ejs');
            break;

        default:
            next();
    }
};