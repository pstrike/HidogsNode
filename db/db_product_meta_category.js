var vendor = [
    {
        product_meta_category_id: '1',
        name: "宠物服务",
        slug: "service",
        scope: "",
        path_slug: null,
        path_name: null,
        leaf: false,
    },
    {
        product_meta_category_id: '1-1',
        name: "宠物美容",
        slug: "grooming",
        scope: "",
        path_slug: 'service',
        path_name: '宠物服务',
        leaf: false,
    },
    {
        product_meta_category_id: '1-1-1',
        name: "美容护理",
        slug: "beautifying",
        scope: "拔耳毛、清洁耳道、剪趾甲、剃脚底毛、腹底毛、挤肛门腺、清洗全身、吹干、梳毛。",
        path_slug: 'service,grooming',
        path_name: '宠物服务,宠物美容',
        leaf: true,
    },
    {
        category_id: '1-1-2',
        name: "美容造型",
        slug: "model",
        scope: "拔耳毛、清洁耳道、剪趾甲、剃脚底毛、腹底毛、挤肛门腺、清洗全身、吹干拉毛、根据用户要求修剪造型。",
        path_slug: 'service,grooming',
        path_name: '宠物服务,宠物美容',
        leaf: true,
    },
    {
        category_id: '1-1-3',
        name: "全身剃光",
        slug: "bald",
        scope: "全身剃光、挤肛门腺、全身冲水、全身吹干、拔耳毛、清洁耳道、剪趾甲。",
        path_slug: 'service,grooming',
        path_name: '宠物服务,宠物美容',
        leaf: true,
    },
]

module.exports = vendor;