/** @jsx React.DOM */

var React = require('react');
var VendorOrderActions = require('../actions/VendorOrderActions');

var OrderItem = React.createClass({
    componentWillMount: function(){
        React.initializeTouchEvents(true);
    },

    handleTouchStart: function() {
        console.log('handleTouchStart');
    },

    render: function() {
        var order = this.props.order;
        var btnContent;
        if(order.status != "done") {
            btnContent = <button type="button" className="btn btn-default" onClick={this._checkOrder}><span className="glyphicon glyphicon-ok" aria-hidden="true"></span></button>;
        }


        return (
            <tr onClick={this._viewProductDetail} onTouchStart={this.handleTouchStart}>
                <td>{order._id}</td>
                <td>{order.product_id}</td>
                <td>{order.user_id}</td>
                <td>{order.price}</td>
                <td>{order.status}</td>
                <td>{order.booktime}</td>
                <td>
                    <div className="btn-group" role="group">
                        {btnContent}
                    </div>
                </td>
            </tr>

        );
    },

    _checkOrder: function() {
        VendorOrderActions.vendorOrderViewCheckOrder(this.props.order)
    }

});

module.exports = OrderItem;
