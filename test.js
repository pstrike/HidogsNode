var newOrder;

var orderList = [
    {id:1},
    {id:2},
    {id:3},
]

orderList.forEach(function(order) {
    newOrder = {
        id: order.id,
    }

    console.log(newOrder);
})