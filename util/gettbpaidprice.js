exports.cal = function (total, discount) {
    return parseFloat((parseFloat(total) - parseFloat(discount)).toFixed(2));
}