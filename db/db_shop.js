var shop = [
    {
        "_id": "1",
        "name": "牛店",
        "type": "宠物店",
        "vote": [{"good": 10}, {"normal": 10}, {"bad": 10}],
        "address": "地址1",
        "latitude": 23.2323,
        "longitude": 21.2321,
        "tel": "888888",
        "description": "<p>我家NaNa小姐系系老板这里买的，三个月的小家伙！非常活泼可爱，而且品种优良！最重要是带回家几天都非常健康的！然后来了我家住了一个礼拜后，我搞度距饱亲屙肚一次，琴晚就饿......</p><img class='img-responsive' src='../../img/20130910163136-1048260609.jpg'/>",
        "tab": ["美食", "餐厅"],
        "comment": [
            {"name":"用户名", "comment":"评论", "date":"2014-01-31 12:12:12"},
            {"name":"用户名", "comment":"评论", "date":"2014-01-31 12:12:12"}
        ]
    },
    {
        "_id": "2",
        "name": "宠物店",
        "type": "餐厅",
        "vote": [{"good": 2}, {"normal": 1}, {"bad": 3}],
        "address": "地址2",
        "latitude": 23.2323,
        "longitude": 21.2321,
        "tel": "888888",
        "description": "<p>描述2</p>",
        "tab": ["美食", "餐厅"],
        "comment": []
    }
]

module.exports = shop;