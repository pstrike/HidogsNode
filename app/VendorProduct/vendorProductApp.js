var React = require('react');

var App = require('./components/VendorProductApp.react.js');

var mountNode = document.getElementById("react-main-mount");
React.render(<App/>, mountNode);


