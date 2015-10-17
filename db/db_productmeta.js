var vendor = [
    {
        _id: "1",
        field: "category",
        meta_value: [
            {"l1":"美容", "l2":"造型护理", "scope": "造型护理范围"},
            {"l1":"美容", "l2":"洗澡护理", "scope": "洗澡护理范围"},
            {"l1":"美容", "l2":"全身剃光", "scope": "全身剃光范围"}
        ],
    },
    {
        _id: "2",
        field: "exit",
        meta_value: [
            {"name": "全额退款", "description": "无条件全额退款"},
            {"name": "部分退款", "description": "退款50%"},
            {"name": "无退款", "description": "不能退款"}
        ],
    },
    {
        _id: "3",
        field: "commision_rate",
        meta_value: 0.85,
    },
]

module.exports = vendor;