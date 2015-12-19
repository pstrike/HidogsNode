exports.orderno = function (orderId, createdTime) {

    var currentDate = new Date(createdTime);
    var orderIdParams = orderId.split("-");
    return currentDate.getTime() + orderIdParams[1];

}