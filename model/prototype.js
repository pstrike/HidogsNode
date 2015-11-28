var Model = {
    getVendorPrototype: function () {
        var object = {
            vendor_id: "",
            pwd: "",
            name: "",
            nick_name: "",
            openid: "",
            gender: "",
            birthday: "",
            email: "",
            mobile: "",
            work_experience: "",
            address: {
                country: "",
                province: "",
                city: "",
                region: "",
                address: "",
            },
            location: {
                longitude: "",
                latitude: "",
            },
            head_image_url: "",
            id_card: {
                no: "",
                front_image_url: "",
                back_image_url: "",
            },
            honor_list: [],
            image_url_list: [
                {name: '', image_url: ''}
            ],
            status: "created",
            setting: {
                concurrent_no: "1",
                business_time_list: [{start_time: "", end_time: ""}],
                timeoff_list: [],
                reject_today_flag: false,
            },
            is_active: true,
            payment_account: "",
            description: "",
            role: [
                {
                    role_id: "1",
                    name: "美容达人",
                    slug: "grooming",
                    status: "drafted",
                    certificate_list: [
                        {name: '', image_url: ''}
                    ],
                    work_list: [
                        {name: '美容后,站立正面图', image_url: ''},
                        {name: '美容后,站立侧身图', image_url: ''},
                        //{name: '美容后,站立后视图', image_url: ''},
                    ],
                    reject_reason: "",
                    rate: "",
                },
            ],
            agreement: false,
            created_time: "",
            modified_time: "",
        };

        return JSON.parse(JSON.stringify(object));
    },

    getProductPrototype: function () {
        var object = {
            product_id: "",
            title: "",
            category: {},
            price: {
                basic: [
                    //{name: "体重在4公斤以内", price: ""},
                    //{name: "体重在4公斤-5公斤以内", price: ""},
                    //{name: "体重在5公斤-6公斤以内", price: ""},
                    //{name: "体重在6公斤-7公斤以内", price: ""},
                ],
                additional: [
                    {name: "", price: ""},
                ],
                type: "",
            },
            tag_list: [],
            duration: "",
            address: {
                country: "",
                province: "",
                city: "",
                region: "",
                address: "",
            },
            location: {
                longitude: "",
                latitude: "",
            },
            feature: "",
            notice: "",
            exit_policy: {},
            status: "",
            is_active: "",
            image_url_list: [
                {name: '', image_url: ''}
            ],
            vendor: {
                vendor_id: "",
                vendor_name: "",
                head_image_url: "",
            },
            commision_rate: "",
            sale_no: "",
            variants: [],
            comment_list: [],
            created_time: "",
            modified_time: "",
        };

        return JSON.parse(JSON.stringify(object));
    },
};

module.exports = Model;