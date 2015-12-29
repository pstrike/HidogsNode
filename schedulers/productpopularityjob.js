var operation = require('../model/operation');

exports.do = function () {
    var beginTime = new Date();
    //console.log('[Scheduler] [Product Popularity] Begin:' + beginTime);

    var productList = {};
    var productSortList = [];
    var resultList = {};
    var weight = {
        0: 0,
        1: -4,
        2: -2,
        3: 1,
        4: 2,
        5: 4,
    }
    var orderCreatedTime;

    operation.getObjectList(operation.getCollectionList().product_meta_category, {leaf: true}, {product_meta_category_id:1}, function(categoryList) {

        categoryList.forEach(function(item) {
            resultList[item.product_meta_category_id] = [];
        })

        var orderCreationFilterDate = new Date();
        orderCreationFilterDate.setMonth(orderCreationFilterDate.getMonth() - 3);

        operation.getObjectList(operation.getCollectionList().order, {status: { $in: [ 'tbcommented', 'completed' ] }}, {}, function(orderList) {
            orderList.forEach(function(item) {

                orderCreatedTime = new Date(item.created_time);

                if(orderCreatedTime > orderCreationFilterDate) {

                    if(!productList[item.product.product_id]) {
                        productList[item.product.product_id] = {
                            comment_rate: 0,
                            comment_no: 0,
                            sale_no: 0,
                            score: 0,
                            rate: 0,
                            category_id: item.product.product_category.product_meta_category_id,
                        }
                    }

                    if(item.comment && item.comment.content.rate > 0) {
                        productList[item.product.product_id].comment_rate += parseInt(item.comment.content.rate);
                        productList[item.product.product_id].comment_no ++;
                    }
                    productList[item.product.product_id].sale_no ++;
                }

            })

            for(var productId in productList) {
                if(productList[productId].comment_no > 0) {
                    productList[productId].rate = parseInt(productList[productId].comment_rate / productList[productId].comment_no);
                }

                productList[productId].score = productList[productId].sale_no * weight[productList[productId].rate];
                productList[productId].product_id = productId;
                productSortList.push(productList[productId]);
            }

            productSortList.sort(function(a,b){return a.score<b.score?1:-1});

            productSortList.forEach(function(item) {
                if(!resultList[item.category_id]) {
                    resultList[item.category_id] = [];
                }

                resultList[item.category_id].push(item);
            });

            operation.removeObjectReal(operation.getCollectionList().product_popular, {}, function(result) {

                operation.insertObject(operation.getCollectionList().product_popular, resultList, function(result) {
                    if(result.status == 'fail') {
                        console.log('[Scheduler] [Product Popularity] Err');
                        console.log(result.err);
                    }

                    var endTime = new Date();
                    console.log('[Scheduler] [Product Popularity] ['+beginTime+'] - ' + (endTime - beginTime) + 'ms');
                });
            })

        })
    })


}