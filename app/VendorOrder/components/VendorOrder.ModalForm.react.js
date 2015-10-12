/** @jsx React.DOM */

var React = require('react');
var Actions = require('../actions/VendorOrderActions');
var Constants = require('../constants/VendorOrderConstants');

var ProductForm = React.createClass({

    componentDidUpdate: function () {
        var status = this.props.status;

        switch (status) {
            case Constants.VENDOR_ORDER_STORE_STATE_CHECK:
                $('#orderFormModal').modal('show');
                break;

            case Constants.VENDOR_ORDER_STORE_STATE_CHECK_FAIL:
                $('#orderFormModal').modal('show');
                break;

            case Constants.VENDOR_ORDER_STORE_STATE_CHECK_SUCCESS:
                $('#orderFormModal').modal('show');

                var order = this.props.order;
                order["status"] = "done";
                Actions.vendorOrderUpdateOrder(order);

                break;

            case Constants.VENDOR_ORDER_STORE_STATE_CHECK_UPDATE_SUCCESS:
                $('#orderFormModal').modal('show');
                break;

            case Constants.VENDOR_ORDER_STORE_STATE_CHECK_IN_PROGRESS:
                $('#orderFormModal').modal('show');
                break;

            default:

        }
    },

    render: function () {
        var content;
        var footer;

        if(this.props.status == Constants.VENDOR_ORDER_STORE_STATE_CHECK) {
            var text = "请输入订单"+this.props.order._id+"的验证码以确认使用订单";

            content = <div className="modal-body">
                <form>
                    <div className="form-group">
                        <label for="productInputName">{text}</label>
                        <input type="text" className="form-control" id="orderCode"
                               placeholder="请输入订单验证码" ref="code"/>
                    </div>
                </form>
            </div>;

            footer = <div className="modal-footer">
                <button type="button" className="btn btn-primary"
                        onClick={this._onSubmit}>提交
                </button>
                <button type="button" className="btn btn-default"
                        onClick={this._onCancel}>关闭
                </button>
            </div>;
        }
        else if (this.props.status == Constants.VENDOR_ORDER_STORE_STATE_CHECK_IN_PROGRESS) {
            content = <div className="modal-body">
                订单验证中...
            </div>;

            footer = <div className="modal-footer">
                <button type="button" className="btn btn-primary"
                        onClick={this._onSubmit} disabled="disabled">提交
                </button>
                <button type="button" className="btn btn-default"
                        onClick={this._onCancel}>关闭
                </button>
            </div>;
        }
        else if (this.props.status == Constants.VENDOR_ORDER_STORE_STATE_CHECK_SUCCESS
            || this.props.status == Constants.VENDOR_ORDER_STORE_STATE_CHECK_UPDATE_SUCCESS) {
            content = <div className="modal-body">
                订单验证成功
            </div>;

            footer = <div className="modal-footer">
                <button type="button" className="btn btn-default"
                        onClick={this._onCancel}>关闭
                </button>
            </div>;
        }
        else if (this.props.status == Constants.VENDOR_ORDER_STORE_STATE_CHECK_FAIL) {
            content = <div className="modal-body">
                订单验证失败
            </div>;

            footer = <div className="modal-footer">
                <button type="button" className="btn btn-default"
                        onClick={this._onCancel}>关闭
                </button>
            </div>;
        }

        return (
            <div className="modal fade" id="orderFormModal" tabindex="-1" role="dialog"
                 aria-labelledby="myModalLabel" data-backdrop="static">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button type="button" className="close" onClick={this._onCancel}
                                    aria-label="Close"><span
                                aria-hidden="true">&times;</span></button>
                            <h4 className="modal-title" id="myModalLabel">订单确认</h4>
                        </div>
                        {content}
                        {footer}
                    </div>
                </div>
            </div>
        );
    },

    _onCancel: function () {
        $('#orderFormModal').modal('hide');
        Actions.vendorOrderViewOrderList();
    },

    _onSubmit: function () {
        var order = this.props.order;
        order["code"] = this.refs.code.getDOMNode().value;
        Actions.vendorOrderCheckOrder(order);
    }

});

module.exports = ProductForm;
