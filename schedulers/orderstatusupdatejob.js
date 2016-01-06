var operation = require('../model/operation');

exports.do = function () {

    var currentTime = new Date();
    var orderDate;

    operation.getObjectList(operation.getCollectionList().order, {}, {order_id:1,status:1,booked_time:1}, function(orderList) {
        orderList.forEach(function(order, index) {
            orderDate = new Date(order.booked_time.booked_date);
            orderDate.setDate(orderDate.getDate()+1);
            orderDate.setHours(0);
            orderDate.setMinutes(0);
            orderDate.setSeconds(0);
            orderDate.setMilliseconds(0);

            if(currentTime > orderDate) {
                var newOrder = {
                    order_id: order.order_id,
                    status: order.status,
                };

                switch (order.status) {
                    case "tbpaid":
                        newOrder.status = 'cancelled';
                        break;

                    case "payfail":
                        newOrder.status = 'cancelled';
                        break;

                    case "tbserviced":
                        newOrder.status = 'overdue';
                        break;

                    case "tbconfirmed":
                        newOrder.status = 'overdue';
                        break;
                }

                if(newOrder.status != order.status) {
                    operation.updateObject(operation.getCollectionList().order, newOrder, function(result) {
                        if(result.status == 'fail') {
                            console.log(result.err);
                        }
                        console.log("[OrderStatusJob] - update " + newOrder.order_id + " to " + newOrder.status + " from " + order.status);
                    })
                }
            }

            if(index == orderList.length-1) {
                var endTime = new Date();
                console.log('[Scheduler] [Order Status] ['+currentTime+'] - ' + (endTime - currentTime) + 'ms');
            }
        })
    })


}