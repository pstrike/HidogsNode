var React = require('react');

var ShopApp = require('./components/VendorProductApp.react.js');

var mountNode = document.getElementById("react-main-mount");
React.render(new ShopApp(), mountNode);


