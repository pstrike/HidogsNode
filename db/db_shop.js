var shop = [
    {
        "_id": "1",
        "name": "牛宠物店",
        "type": "宠物店",
        "vote": [{"good": 10}, {"normal": 10}, {"bad": 10}],
        "address": "广州市海珠区琶洲商业广场",
        "latitude": 23.2323,
        "longitude": 21.2321,
        "tel": "020-12345678",
        "description": "<p>我家NaNa小姐系系老板这里买的，三个月的小家伙！非常活泼可爱，而且品种优良！最重要是带回家几天都非常健康的！然后来了我家住了一个礼拜后，我搞度距饱亲屙肚一次，琴晚就饿......</p><img class='img-responsive' src='../../img/20130910163136-1048260609.jpg'/>",
        "tab": ["牛店", "宠物店"],
        "comment": [
            {"name":"小新", "comment":"服务态度很好", "date":"2014-01-31 12:12:12"}
        ]
    },
    {
        "_id": "2",
        "name": "幸福餐厅",
        "type": "餐厅",
        "vote": [{"good": 2}, {"normal": 1}, {"bad": 3}],
        "address": "广州市天河区天河城广场",
        "latitude": 23.2323,
        "longitude": 21.2321,
        "tel": "020-12345678",
        "description": "<p>很好的一家餐厅</p>",
        "tab": ["美食", "餐厅", "幸福", "幸福餐厅"],
        "comment": []
    },
    {
        "_id": "3",
        "name": "唔系茶餐厅",
        "type": "餐厅",
        "vote": [{"good": 10}, {"normal": 1}, {"bad": 3}],
        "address": "广州市天河区体育东路",
        "latitude": 23.2323,
        "longitude": 21.2321,
        "tel": "020-12345678, 020-87654321",
        "description": "<p>香港特色茶餐厅</p>",
        "tab": ["美食", "餐厅", "唔系茶餐厅", "茶餐厅"],
        "comment": [
            {"name":"小新", "comment":"很好的餐厅，再来", "date":"2014-01-31 12:12:12"}
        ]
    }
]

module.exports = shop;