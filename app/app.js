var React = require('react');

var LocationApp = require('./components/HidogsApp.react');

/*
React.render(
    <LocationApp />,
    document.getElementById('react-main-mount')
);
*/


var mountNode = document.getElementById("react-main-mount");
React.render(new LocationApp({}), mountNode);


