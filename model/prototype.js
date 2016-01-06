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
                district: "",
                street: "",
                street_number: "",
                additional: "",
            },
            location: {
                type: "Point",
                coordinates: [0,0],
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
                page_style: "",
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
                    rate: {
                        sum: 0,
                        no: 0,
                    },
                    comment: {},
                },
            ],
            agreement: false,
            created_time: "",
            modified_time: "",
        };

        return JSON.parse(JSON.stringify(object));
    },

    getUserPrototype: function () {
        var object = {
            user_id: "",
            pwd: "",
            name: "",
            nick_name: "",
            openid: "",
            gender: "",
            birthday: "",
            email: "",
            mobile: "",
            address: {
                country: "",
                province: "",
                city: "",
                district: "",
                street: "",
                street_number: "",
                additional: "",
            },
            location: {
                type: "Point",
                coordinates: [0,0],
            },
            head_image_url: "",
            is_active: true,
            fav_list: {
                product: [],
                vendor: [],
            },
            coupon_list: [],
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
                    {name: "", price: "", upper: "", lower: ""},
                ],
                additional: [
                    {name: "", price: ""},
                ],
                type: "",
            },
            tag_list: [],
            duration: "0",
            address: {
                country: "",
                province: "",
                city: "",
                district: "",
                street: "",
                street_number: "",
                additional: "",
            },
            location: {
                type: "Point",
                coordinates: [0,0],
            },
            feature: "",
            notice: "",
            exit_policy: {},
            status: "",
            is_active: true,
            image_url_list: [
                {name: '', image_url: ''}
            ],
            vendor: {
                vendor_id: "",
                nick_name: "",
                head_image_url: "",
            },
            commision_rate: "",
            sale_no: 0,
            variants: [],
            //comment_list: [],
            comment_show: {},
            rate: {
                sum: 0,
                no: 0,
            },
            created_time: "",
            modified_time: "",
        };

        return JSON.parse(JSON.stringify(object));
    },

    getOrderPrototype: function () {
        var object = {
            order_id: "",
            product: {
                product_id: "",
                title: "",
                category: {
                    product_meta_category_id: "",
                    name: "",
                    slug: "",
                    path_name: "",
                    path_slug: "",
                },
            },
            user: {
                user_id: "",
                nick_name: "",
                head_image_url: "",
            },
            vendor: {
                vendor_id: "",
                nick_name: "",
                head_image_url: "",
            },
            status: "tbpaid",
            price: {
                basic: [],
                additional: [],
                coupon: {},
                total: 0.0,
                discount: 0.0,
            },
            address: {
                country: "",
                province: "",
                city: "",
                district: "",
                street: "",
                street_number: "",
                additional: "",
            },
            location: {
                type: "Point",
                coordinates: [0,0],
            },
            booked_time: {
                start_time: "",
                end_time: "",
                booked_date: "",
                is_rescheduled: false,
            },
            isOnSite: false,
            remark: "",
            is_active: true,
            created_time: "",
            paid_time: "",
            confirmed_time: "",
            serviced_time: "",
            commented_time: "",
            commision_time: "",
            commision_due_date: "",
            commision_status: "",
            modified_time: "",
        };

        return JSON.parse(JSON.stringify(object));
    },

    getCouponPrototype: function () {
        var object = {
            coupon_id: "",
            code: "",
            title: "",
            type: "",
            number_total: 0,
            occupied: [],
            used: [],
            status: "drafted",
            rule: {
                user: [],
                vendor: [],
                product: [],
            },
            off_percentage: 0,
            due_date: "",
            vendor_owner: "",
            created_time: "",
            is_active: true,
        };

        return JSON.parse(JSON.stringify(object));
    },
};

module.exports = Model;