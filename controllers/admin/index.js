var React = require('react'),
    App = React.createFactory(require('../../app/Admin/components/App.react'));

exports.engine = 'ejs';

exports.page = function(req, res, next){
    var page = req.params.admin_id;

    switch (page) {
        case 'main':
            res.render('adminmain.ejs');
            break;

        default:
            next();
    }
};