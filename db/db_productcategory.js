var vendor = [
    {
        "_id": "l1_1",
        "name": "宠物服务",
        "slug": "service",
        "scope": null,
        "parent_id": null,
        "ancestor": null,
    },
    {
        "_id": "l2_1",
        "name": "宠物美容",
        "slug": "grooming",
        "scope": null,
        "parent_id": "l1_1",
        "ancestor": [
            { "_id" : "l1_1",
                "name" : "宠物服务",
                "slug" : "service",
            },
        ],
    },
    {
        "_id": "l3_1",
        "name": "美容护理",
        "slug": "beautifying",
        "scope": "拔耳毛、清洁耳道、剪趾甲、剃脚底毛、腹底毛、挤肛门腺、清洗全身、吹干、梳毛",
        "parent_id": "l2_1",
        "ancestor": [
            { "_id" : "l2_1",
                "name" : "宠物美容",
                "slug" : "grooming",
            },
            { "_id" : "l1_1",
                "name" : "宠物服务",
                "slug" : "service",
            },
        ]
    },
    {
        "_id": "l3_2",
        "name": "美容造型",
        "slug": "model",
        "scope": "拔耳毛、清洁耳道、剪趾甲、剃脚底毛、腹底毛、挤肛门腺、清洗全身、吹干拉毛、根据用户要求修剪造型",
        "parent_id": "l2_1",
        "ancestor": [
            { "_id" : "l2_1",
                "name" : "宠物美容",
                "slug" : "grooming",
            },
            { "_id" : "l1_1",
                "name" : "宠物服务",
                "slug" : "service",
            },
        ]
    },
    {
        "_id": "l3_3",
        "name": "全身剃光",
        "slug": "bald",
        "scope": "全身剃光、挤肛门腺、全身冲水、全身吹干、拔耳毛、清洁耳道、剪趾甲",
        "parent_id": "l2_1",
        "ancestor": [
            { "_id" : "l2_1",
                "name" : "宠物美容",
                "slug" : "grooming",
            },
            { "_id" : "l1_1",
                "name" : "宠物服务",
                "slug" : "service",
            },
        ]
    },
]


module.exports = vendor;