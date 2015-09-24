var users = exports.users = [];
users.push({ name: 'user1', id: 0 });

var locations = exports.locations = [];
locations.push({ id: 0, name: 'location1', address: 'tianhe', coupons: [{name:'5折优惠',price:'10'},{name:'6折优惠',price:'5'}] });
locations.push({ id: 1, name: 'location2', address: 'haizhu', coupons: [{name:'1折优惠',price:'100'}] });
locations.push({ id: 2, name: 'location3', address: 'panyu', coupons:[] });

var orders = exports.orders = [];
orders.push({id: 0, user: users[0], coupons: [locations[0].coupons[0]] });