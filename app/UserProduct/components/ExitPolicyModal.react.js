/** @jsx React.DOM */

var React = require('react');
var Actions = require('../actions/Actions');

var app = React.createClass({

    componentDidMount: function() {
        showHgModal('exitPolicyModal');

        var pageHeight = $(window).height();
        var bodyHeight = pageHeight - 121;
        $('#exitPolicyBody').css({"height": bodyHeight + 'px' });
        $('#exitPolicyModal').css({"height": pageHeight + 'px' });

    },

    componentWillUnmount: function() {
        hideHgModal('exitPolicyModal');
    },

    render: function () {

        return (
            <div id="exitPolicyModal" className="hg-modal container-fluid">
                <div className="hg-modal-header row">
                    <div className="col-xs-2 text-left hg-modal-header-close">
                        <button type="button" className="close"><span
                            aria-hidden="true" onClick={this._onCancel}>&times;</span></button>
                    </div>
                    <div className="col-xs-8 text-center hg-modal-title modal_grey_font"><h4>退款政策</h4></div>
                    <div className="col-xs-2 text-center hg-modal-title"></div>
                </div>

                <div className="hg-modal-body text-left modal_grey_font" id="exitPolicyBody">
                    <div dangerouslySetInnerHTML={{__html: this.props.content}}></div>
                </div>

                <div className="hg-modal-footer text-right row">
                    <div className="col-xs-12">
                        <button className="btn btn-hd-blue text-muted" onClick={this._onCancel}>关闭</button>
                    </div>
                </div>
            </div>
        );
    },

    _onCancel: function () {
        Actions.triggerExitPolicyToProduct();
    },
});

module.exports = app;

