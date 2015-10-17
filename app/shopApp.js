var React = require('react');

var ShopApp = require('./VendorProduct/components/Shop.react');

/*
React.render(
    <LocationApp />,
    document.getElementById('react-main-mount')
);
*/


var mountNode = document.getElementById("react-main-mount");
var shopId = document.getElementById("react-main-mount").getAttribute("shop-id");
React.render(new ShopApp({"shopId": shopId}), mountNode);


