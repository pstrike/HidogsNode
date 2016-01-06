/** @jsx React.DOM */

var React = require('react');
var Actions = require('../actions/Actions');

var formatdatetime = require('../../../util/formatdatetime');

var app = React.createClass({

    componentDidMount: function() {
        showHgModal('productAvailabilityModal');

        var pageHeight = $(window).height();
        var bodyHeight = pageHeight - 121;
        $('#productAvailabilityBody').css({"height": bodyHeight + 'px' });
        $('#productAvailabilityModal').css({"height": pageHeight + 'px' });

    },

    componentWillUnmount: function() {
        hideHgModal('productAvailabilityModal');
    },

    render: function () {

        var availabilityContent = [];
        var flag;
        var dateText;
        var timeText;
        this.props.availabilityList.forEach(function(day, dayIndex) {
            switch (dayIndex) {
                case 0:
                    dateText = "今天";
                    break;

                case 1:
                    dateText = "明天";
                    break;

                case 2:
                    dateText = "后天";
                    break;
                default :
                    dateText = formatdatetime.formatDate(new Date(day.date));
            }

            day.timeslot.forEach(function(timeslot, timeSlotIndex) {
                if(timeslot.isAvailable) {
                    flag = <span className="glyphicon glyphicon-ok-sign green_text"></span>;
                }
                else {
                    flag = <span className="glyphicon glyphicon-remove-sign grey_text"></span>;
                }

                timeText = formatdatetime.formatTime(new Date(timeslot.start_time)) + "-" + formatdatetime.formatTime(new Date(timeslot.end_time));

                if(timeSlotIndex == 0) {
                    availabilityContent.push(
                        <tr>
                            <td>{dateText}</td>
                            <td className="hg-td-60pt">{timeText}</td>
                            <td>{flag}</td>
                        </tr>
                    );
                }
                else {
                    availabilityContent.push(
                        <tr>
                            <td></td>
                            <td className="hg-td-60pt">{timeText}</td>
                            <td>{flag}</td>
                        </tr>
                    );
                }
            })
        })

        return (
            <div id="productAvailabilityModal" className="hg-modal container-fluid">
                <div className="hg-modal-header row">
                    <div className="col-xs-2 text-left hg-modal-header-close">
                        <button type="button" className="close"><span
                            aria-hidden="true" onClick={this._onCancel}>&times;</span></button>
                    </div>
                    <div className="col-xs-8 text-center hg-modal-title modal_grey_font"><h4>服务时间</h4></div>
                    <div className="col-xs-2 text-center hg-modal-title"></div>
                </div>

                <div className="hg-modal-body text-left modal_grey_font" id="productAvailabilityBody">
                    <div>
                        <table className="hg-table text-center">
                            <tbody>
                            {availabilityContent}
                            <tr>
                                <td></td>
                                <td className="hg-td-60pt"></td>
                                <td></td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
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
        Actions.triggerAvailabilityToProduct();
    },
});

module.exports = app;

