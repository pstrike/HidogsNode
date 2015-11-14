/** @jsx React.DOM */

var React = require('react');
var HidogsConstants = require('../../Common/constants/HidogsConstants');
var AppDispatcher = require('../../Common/dispatcher/AppDispatcher');

var Store = require('../stores/Store');
var Actions = require('../actions/Actions');
var Constants = require('../constants/Constants');
var Header = require('./../../Common/components/Header.react.js');
var PicUploader = require('./../../Common/components/PicUploader');
var IconUploader = require('./../../Common/components/IconUploader');
var APVTO = require('../../../util/assignpathvaluetoobject');

var app = React.createClass({


    render: function() {
        return <div className="modal modal-fullscreen fade" id="vendorProfileAgreement" tabindex="-1" role="dialog"
                    aria-labelledby="ProductDetailModalLabel" data-backdrop="static">
            <div className="modal-dialog" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <button type="button" className="close" onClick={this.closeAgreement}><span
                            aria-hidden="true">&times;</span></button>
                        <h4 className="modal-title text-center">欢宠服务伙伴协议</h4>
                    </div>

                    <div className="modal-body">
                        <p>本《服务伙伴协议》是由广州欢宠信息科技有限公司（简称为欢宠公司）与服务伙伴（是指为最终用户提供宠物服务的合作伙伴称呼）所订立的协议。本《服务伙伴协议》中欢宠公司为甲方，服务伙伴为乙方。</p>

                        <ol>
                            <li>甲方为乙方提供平台进行服务宣传、推广、运营和管理，乙方应遵守甲方在平台中的所有条款，如有违反将按相应的条款处理。乙方在提交认证过程中需提供真实有效的证件，不可提供虚假、过期信息作为认证，如发现虚假资料，甲方有权在查证后删除乙方在平台中的帐号信息。认证审核通过的帐号只限于乙方本人使用，此帐号不可转让、租借、出售。</li>

                            <li>乙方必须年满18周岁以上，具有完全个人民事处理能力，需在提供服务中有能力做好犬只安全、健康等方面的预防措施。如在服务过程中因乙方个人行为或技术失误而导致犬只在服务过程中造成伤害、走失、死亡或病重的，将由乙方承担全部责任。如因上述事故导致乙方遭受最终用户提起的索赔、诉讼的，甲方将尽力协调乙方与最终用户之间的纠纷。</li>

                            <li>乙方在接收最终用户犬只时应对其犬只进行外表检查，看是否有明显伤痕、伤口或者有生病的迹象，在发现有上述情况时应当面拒接并说明相关情况，由最终用户接回犬只并协商将服务延期或者退款。</li>

                            <li>乙方在提供服务期间需做好消毒环境、工具等设施，降低犬只之间的皮肤病交叉感染机率，如发现犬只患有严重皮肤病、传染性疾病（犬瘟、细小）的必须立即停止服务，避免其他用户犬只感染，应采取相应的隔离措施并通知最终用户接回或协商后送院治疗。</li>

                            <li>甲方将在乙方每张订单完成后收取此订单的百分之十五作为宣传、推广、运营和管理费用。</li>

                            <li>每周日凌晨零点为资金结算点，将结算上周日凌晨零点至本周日凌晨零点的所有订单。如结算金额未超过人民币500元时，将累积到下周的资金结算点，如结算金额超过人民币500元时，将进行转账至乙方帐号。每周二为转账日，将款以微信支付等形式转账到乙方帐号中，如出现退款情况请参照《退款条约》。</li>
                        </ol>

                    </div>

                    <div className="modal-footer">
                        <button type="button" className="btn btn-default btn-hd-blue" onClick={this.closeAgreement}>关闭</button>
                    </div>
                </div>
            </div>
        </div>;
    },

    closeAgreement: function() {
        Actions.closeAgreement();
    },

});

module.exports = app;

