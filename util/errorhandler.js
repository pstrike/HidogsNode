// create an error with .status. we
// can then use the property in our
// custom error handler (Connect repects this prop as well)
exports.new = function(status, msg) {
    var err = new Error(msg);
    err.status = status;
    return err;
};