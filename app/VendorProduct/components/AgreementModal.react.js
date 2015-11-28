/** @jsx React.DOM */

var React = require('react');
var Actions = require('../actions/Actions');
var Store = require('../stores/Store');

function getAppState() {
    return {
        vendorProfile: Store.getVendorProfile(),
    };
};

var app = React.createClass({

    getInitialState: function() {
        return getAppState();
    },

    componentDidMount: function() {
        Store.addChangeListener(this._onChange);

        //$('#productAgreement').modal('show');
        showHgModal('productAgreement')

        // set modal body height
        var pageHeight = $(window).height();
        var bodyHeight = pageHeight - 121;
        $('#agreementBody').css({"max-height": bodyHeight + 'px' });

        // handle back event
        window.history.pushState({title: "preventback", url: "#"}, "preventback", "#");
        window.onpopstate = this._cancelAgreement;

    },

    componentWillUnmount: function() {
        //$('#productAgreement').modal('hide');
        hideHgModal('productAgreement')
        Store.removeChangeListener(this._onChange);
    },

    render: function() {
        var agreeBtn = <button type="button" className="btn btn-default btn-hd-blue" onClick={this._agreeAgreement}>同意</button>;
        if(this.state.vendorProfile.agreement) {
            agreeBtn = <button type="button" className="btn btn-default" onClick={this._agreeAgreement} disabled>已同意</button>;
        }

        //return <div className="modal modal-fullscreen fade" id="productAgreement" tabindex="-1" role="dialog"
        //            aria-labelledby="ProductDetailModalLabel" data-backdrop="static">
        //    <div className="modal-dialog" role="document">
        //        <div className="modal-content">
        //            <div className="modal-header">
        //                <button type="button" className="close" onClick={this._cancelAgreement}><span
        //                    aria-hidden="true">&times;</span></button>
        //                <h4 className="modal-title text-center">服务协议</h4>
        //            </div>
        //
        //            <div className="modal-body" id="agreementBody">
        //                <p>本《服务伙伴协议》是由广州欢宠信息科技有限公司（简称为欢宠公司）与服务伙伴（是指为最终用户提供宠物服务的合作伙伴称呼）所订立的协议。本《服务伙伴协议》中欢宠公司为甲方，服务伙伴为乙方。</p>
        //
        //                <ol>
        //                    <li>甲方为乙方提供平台进行服务宣传、推广、运营和管理，乙方应遵守甲方在平台中的所有条款，如有违反将按相应的条款处理。乙方在提交认证过程中需提供真实有效的证件，不可提供虚假、过期信息作为认证，如发现虚假资料，甲方有权在查证后删除乙方在平台中的帐号信息。认证审核通过的帐号只限于乙方本人使用，此帐号不可转让、租借、出售。</li>
        //
        //                    <li>乙方必须年满18周岁以上，具有完全个人民事处理能力，需在提供服务中有能力做好犬只安全、健康等方面的预防措施。如在服务过程中因乙方个人行为或技术失误而导致犬只在服务过程中造成伤害、走失、死亡或病重的，将由乙方承担全部责任。如因上述事故导致乙方遭受最终用户提起的索赔、诉讼的，甲方将尽力协调乙方与最终用户之间的纠纷。</li>
        //
        //                    <li>乙方在接收最终用户犬只时应对其犬只进行外表检查，看是否有明显伤痕、伤口或者有生病的迹象，在发现有上述情况时应当面拒接并说明相关情况，由最终用户接回犬只并协商将服务延期或者退款。</li>
        //
        //                    <li>乙方在提供服务期间需做好消毒环境、工具等设施，降低犬只之间的皮肤病交叉感染机率，如发现犬只患有严重皮肤病、传染性疾病（犬瘟、细小）的必须立即停止服务，避免其他用户犬只感染，应采取相应的隔离措施并通知最终用户接回或协商后送院治疗。</li>
        //
        //                    <li>甲方将在乙方每张订单完成后收取此订单的百分之十五作为宣传、推广、运营和管理费用。</li>
        //
        //                    <li>每周日凌晨零点为资金结算点，将结算上周日凌晨零点至本周日凌晨零点的所有订单。如结算金额未超过人民币500元时，将累积到下周的资金结算点，如结算金额超过人民币500元时，将进行转账至乙方帐号。每周二为转账日，将款以微信支付等形式转账到乙方帐号中，如出现退款情况请参照《退款条约》。</li>
        //                </ol>
        //
        //            </div>
        //
        //            <div className="modal-footer">
        //                <button type="button" className="btn btn-default btn-hd-blue" onClick={this._cancelAgreement}>关闭</button>
        //                {agreeBtn}
        //            </div>
        //        </div>
        //    </div>
        //</div>;

        return <div id="productAgreement" className="hg-modal container-fluid">
            <div className="hg-modal-header row">
                <div className="col-xs-2 text-left hg-modal-header-close">
                    <button type="button" className="close"><span
                        aria-hidden="true" onClick={this._cancelAgreement}>&times;</span></button>
                </div>
                <div className="col-xs-8 text-center hg-modal-title"><h4>服务协议</h4></div>
                <div className="col-xs-2 text-center hg-modal-title"></div>
            </div>

            <div className="hg-modal-body text-left" id="agreementBody">
                <p>本《服务伙伴协议》是由广州欢宠信息科技有限公司（简称为欢宠公司）与服务伙伴（是指为最终用户提供宠物服务的合作伙伴称呼）所订立的协议。本《服务伙伴协议》中欢宠公司为甲方，服务伙伴为乙方。</p>
                <ol>
                    <li>甲方为乙方提供平台进行服务宣传、推广、运营和管理，乙方应遵守甲方在平台中的所有条款，如有违反将按相应的条款处理。乙方在提交认证过程中需提供真实有效的证件，不可提供虚假、过期信息作为认证，如发现虚假资料，甲方有权在查证后删除乙方在平台中的帐号信息。认证审核通过的帐号只限于乙方本人使用，此帐号不可转让、租借、出售。</li>

                    <li>乙方必须年满18周岁以上，具有完全个人民事处理能力，需在提供服务中有能力做好犬只安全、健康等方面的预防措施。如在服务过程中因乙方个人行为或技术失误而导致犬只在服务过程中造成伤害、走失、死亡或病重的，将由乙方承担全部责任。如因上述事故导致乙方遭受最终用户提起的索赔、诉讼的，甲方将尽力协调乙方与最终用户之间的纠纷。</li>

                    <li>乙方在接收最终用户犬只时应对其犬只进行外表检查，看是否有明显伤痕、伤口或者有生病的迹象，在发现有上述情况时应当面拒接并说明相关情况，由最终用户接回犬只并协商将服务延期或者退款。</li>

                    <li>乙方在提供服务期间需做好消毒环境、工具等设施，降低犬只之间的皮肤病交叉感染机率，如发现犬只患有严重皮肤病、传染性疾病（犬瘟、细小）的必须立即停止服务，避免其他用户犬只感染，应采取相应的隔离措施并通知最终用户接回或协商后送院治疗。</li>

                    <li>甲方将在乙方每张订单完成后收取此订单的百分之十五作为宣传、推广、运营和管理费用。</li>

                    <li>每周日凌晨零点为资金结算点，将结算上周日凌晨零点至本周日凌晨零点的所有订单。如结算金额未超过人民币500元时，将累积到下周的资金结算点，如结算金额超过人民币500元时，将进行转账至乙方帐号。每周二为转账日，将款以微信支付等形式转账到乙方帐号中，如出现退款情况请参照《退款条约》。</li>

                    <li>如用户在以下情况下申请退款, 退款的安排如下:
                        <ul>
                            <li>
                                预约当天订单的用户如因用户个人原因申请退款,将扣除其订单金额5%的手续费。
                            </li>

                            <li>
                                预约除当天外,未来日期的用户,因用户个人原因无法完成服务的,可以申请更改延期一次.如在申请更改延期后再次无法完成服务,平台将进行退款并会扣除订单金额的5%作为手续费。
                            </li>

                            <li>
                                服务伙伴在订单生效后因其个人原因无法进行按时提供服务的，可申请与用户协商改期提供服务。如改期后再次无法为最户提供已预订的服务，平台将向用户退款，并按此订单金额5%的比例向服务伙伴收取手续费。
                            </li>

                            <li>
                                用户在下单前需熟知服务伙伴的注意事项。如因最终用户违反注意事项造成事故、损失，将由用户承担。并且用户订单中的金额将不予退款，用户帐号也会被停用。
                            </li>
                        </ul>
                    </li>
                </ol>
            </div>

            <div className="hg-modal-footer text-right row">
                <div className="col-xs-12">
                    <button type="button" className="btn btn-default btn-hd-blue roffset5" onClick={this._cancelAgreement}>关闭</button>
                    {agreeBtn}
                </div>
            </div>
        </div>;
    },

    _cancelAgreement: function() {
        Actions.triggerAgreementCancelToList();
    },

    _agreeAgreement: function() {
        var newVendor = {};
        newVendor.vendor_id = this.state.vendorProfile.vendorId;
        newVendor.agreement = true;

        Actions.triggerAgreementAgreeToList(newVendor);
    },

    _onChange: function() {
        this.setState(getAppState());
    },

});

module.exports = app;

