/** @jsx React.DOM */

var React = require('react');
var Header = require('./../../../app/Common/components/Header.react.js');
var Actions = require('../actions/Actions');


var app = React.createClass({

    render: function() {

        return (
            <div className="hg-love" id="react_body">
                <Header subtitle="解救单身狗 - 萌宠相亲活动" hgstyle="love-profile hg-navbar"/>

                <div className="container text-center">

                    <div className="row">
                        <img className="img-responsive" src="../../img/love/love_guide.png" onClick={this.triggerTinder}/>
                    </div>


                </div>

            </div>
        );
    },

    triggerTinder: function() {
        Actions.triggerTinder();
    }

});

module.exports = app;

