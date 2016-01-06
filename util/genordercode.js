exports.ordercode = function (orderId) {
    return orderId.substring(4,5)+orderId.substring(10,11)+orderId.substring(20,21)+orderId.substring(30,31);
}