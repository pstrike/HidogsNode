/** @jsx React.DOM */

var React = require('react');
var Actions = require('../actions/Actions');
var app = React.createClass({

    componentDidMount: function() {
        //$('#productAgreement').modal('show');
        showHgModal('productGuide')

        // set modal body height
        var pageHeight = $(window).height();
        var bodyHeight = pageHeight - 121;
        $('#guideBody').css({"max-height": bodyHeight + 'px' });

        // handle back event
        window.history.pushState({title: "preventback", url: "#"}, "preventback", "#");
        window.onpopstate = this._onCancel;

    },

    componentWillUnmount: function() {
        //$('#productAgreement').modal('hide');
        hideHgModal('productGuide')
    },

    render: function() {

        return <div id="productGuide" className="hg-modal container-fluid">
            <div className="hg-modal-header row">
                <div className="col-xs-2 text-left hg-modal-header-close">
                    <button type="button" className="close"><span
                        aria-hidden="true" onClick={this._onCancel}>&times;</span></button>
                </div>
                <div className="col-xs-8 text-center hg-modal-title"><h4>服务教程</h4></div>
            </div>

            <div className="hg-modal-body text-left" id="guideBody">
                <p>感谢您成为欢宠服务伙伴. 在创建服务前,您可以阅读以下教程,它将帮助您更好的管理/设置您的服务.</p>

                <h4>一、创建服务</h4>

                <p>（1）、点击【服务协议】按钮，仔细阅读全文确认无误后，点击【同意】确认。</p>
                <img src="../../img/guide/1.jpg" className="img-responsive"/>
                <img src="../../img/guide/2.jpg" className="img-responsive"/>
                <img src="../../img/guide/3.jpg" className="img-responsive"/>

                <p>（2）、返回“服务管理”页面，点击【新建】，开始创建服务。</p>


                <p>（3）、在“创建服务”页面，设置服务的基本信息：

                    <p>1、【服务标题】：取一个可以打动用户的名字，以便在众多的服务展示中能迅速被客户认出，留下印象，如“”。</p>

                    <p>2、点击【服务类别】框，在弹出的下拉列表中选择创建的服务类型，每次只能创建一种服务，“洗澡护理”、“美容造型”、“全身剃光”三种服务都有的需要创建3次。</p>

                    <p>3、选定服务类别，【服务范围】会默认自动生成，无须手动填写。美容师应提供相应全套服务，不可减少或更改，有特殊情况（狗狗身体情况不允许）的应跟用户沟通协商。</p>
                    <img src="../../img/guide/4.jpg" className="img-responsive"/>
                </p>

                <p>
                    4、【工作室地址】是指用户带狗上门、及进行服务的场所，在预览时会生成地图显示，为确保信息的准确性，请完整、详细地填写实际地址。
                    <img src="../../img/guide/5.jpg" className="img-responsive"/>
                </p>

                <p>5、在【服务特色】一栏，对你的服务进行描述，如介绍自己擅长的风格、服务的特色、工作经验资历等，语言尽量优美真挚、言简意赅，帮助用户能更好地了解你、信任你、选择你。</p>
                <img src="../../img/guide/6.jpg" className="img-responsive"/>


                <p>怎么介绍自己的服务特色呢？有几个角度供参考：</p>

                <p>•突出美容师的服务宗旨、个人理念</p>

                <p>•介绍美容师的个人经历</p>

                <p>•介绍工作室的服务细节、服务流程</p>

                <p>•介绍使用的清洁、沐浴、美容用品品牌等</p>

                <p>•介绍工作室的作业环境</p>

                <p>【以下范例仅供参考，请不要完全引用】</p>

                <p>举例（一）</p>

                <p>•周边5公里免费接送</p>

                <p>•藉由对狗狗的爱延伸至每一项服务內容——沐浴露、精心筛选的宠物用品</p>

                <p>•减少狗狗精神和身体上的负担，让主人平时容易打理为准则</p>

                <p>•综合主人的喜好，方便在家简单修整，以及狗狗的体态、毛发特点、生长周期这几点，做出最合适的造型。</p>

                <p>•秉持著宠物即是家人的理念 只选择"天然丶有机"來對待我的家人</p>

                <p>举例（二）</p>

                <p>•以精致为走向,不超收，给予每只宠物宝贝最从容的服务</p>

                <p>•全程独立作业，不假手助理，美容品质稳定</p>

                <p>•美容前与主人充分沟通，避免想像落差</p>

                <p>•我所使用的清洁护理用品,都经过严谨的挑选</p>

                <p>•顾及宝贝们的身心状况,不强做处理，必要时主人可陪伴安抚</p>

                <p>•非店面式环境，仅供单纯剪毛洗澡，无异味且无病狗传感之虞，工具设备彻底消毒</p>

                <p>举例（三）</p>

                <p>
                    对宠物服务技术专业度的追求一直以來是我所追求的，不断的自我提升和技艺精进是我的自我要求，努力提供狗宝贝们安心、尊重和自由，藉由对他们的爱延伸至每一项服务內容——沐浴露、精心筛选的狗粮、用品、寄养，提升主人与狗狗的生活品质。让主人安心托付无担忧，让狗狗快乐、幸福，满足您及狗狗的需求。</p>

                <p>举例（四）</p>

                <p>专业:由专业美容师洗、剪、吹、整； 純手工吹整，</p>

                <p>仔細观察您家宝贝皮肤是否有异样。</p>

                <p>安全:设备、工具严格消毒，洗澡用毛巾不重复使用，美容器具均消毒杀菌后再使用</p>

                <p>用心: 针对每位狗狗的皮肤狀況挑选适合的沐浴露；</p>

                <p>另外会依据特殊毛质和毛色使用不同的护毛/护色洗剂</p>

                <p>洁净: 使用日本进口超微細气泡莲蓬头–能深入毛孔，彻底清洁，跟狗狗体味说bye bye！</p>

                <p>吸睛: 洗澡后头部修剪, 让宝贝亮丽有型；更有敷泥、泡泡浴、增色染、染色等特殊项目，能让您的宝贝独一无二！</p>

                <p>舒适: 您的狗狗可在这明亮干净的地方，享受美容的愉悅时光</p>

                <p>举例（五）</p>

                <p>Dog
                    Salon是间迷你的个人工作室，我原本是位普通的上班族，辞掉工作決定创业又希望可以陪着爱狗，于是一头钻入宠物美容行列，除了特地拜师学艺外，也在动物医院內担任美的A.P.D.C有容师长达三年，拥有认证执照。成立工作室后，依然保持严谨挑剔的作风，从宠物的饮食到用品皆十分讲究，因此用具也都是精挑细选，最基本的洗剂等都只用日本进口机系列，我非常爱狗，因此每只上门的狗狗都以这样的心情对待，让每只狗狗都能享受自己的洗香香時光</p>

                <p>举例（六）</p>

                <p>step 1：首先会与狗狗做朋友，让狗狗信任我、熟悉环境，并与您沟通狗狗的个性、习惯及身体状况，让狗狗不紧张。</p>

                <p>step 2：缓狗狗紧张情绪后，会先帮狗狗清耳朵、剪指教与修剪底毛，并贴心地帮狗狗把指甲磨圆。</p>

                <p>step 3：接下来是最重要也是我的坚持，两道洗澡流程及一道润肤，帮狗狗洗净毛孔污垢及深层护毛，让狗狗的毛发更加柔顺蓬松有光泽，让您回家更好整理。</p>

                <p>step 4：再帮狗狗的脚掌擦伤一层保养霜，滋润狗狗脚掌。</p>

                <p>step 5：当狗狗毛发吹整完毕后，会再修剪脸部及脚围毛发，让狗狗更清爽有型哦！</p>

                <p>step 6：最后帮狗狗的毛发擦上XXXX蛋白精华，使毛发柔顺有光泽。</p>


                <p>7、对于不接受服务的情况，在【注意事项】里说明，系统已经默认设置了一些通用的条件，其他情况可另行补充。
                    比如：提醒用户准时不要迟到、如果身上有毛结，要另外收取费用……等等
                    <img src="../../img/guide/7.jpg" className="img-responsive"/>
                </p>

                <p>8、【图片展示】：上传狗狗各种各样的发型图、工作室的环境图、美容产品用具图等等，将工作室的环境和美容师的技术、给用户提供的附加服务等，进行直观的展示，用户所见即所得，更加安心、放心，促成下单。

                    对焦清晰、分辨率高、画面干净的照片，更受人欢迎哦，可以多花谢心思在照片的拍摄、后期加工和挑选上。
                    <img src="../../img/guide/8.jpg" className="img-responsive"/>
                </p>

                <p>
                    举例示范：
                </p>

                <p>名称：不使用合成的界面活性剂和化学香料的沐浴露，
                    使用日本进口的XXXXXX。</p>
                <img src="../../img/guide/9.jpg" className="img-responsive"/>


                <p>名称：草药有的很好的抗菌消炎效果</p>
                <img src="../../img/guide/10.jpg" className="img-responsive"/>


                <p>名称：清洁明亮的美容室，没有任何令人讨厌的异味。</p>
                <img src="../../img/guide/11.jpg" className="img-responsive"/>

                <p>名称：除臭器和空气清新器的双重效果，彻底有效清除空气中的霉菌和细菌、病毒。</p>
                <img src="../../img/guide/12.jpg" className="img-responsive"/>

                <p>名称：宽敞的自由空间，狗狗可以随意玩耍活动</p>
                <img src="../../img/guide/13.jpg" className="img-responsive"/>

                <p>名称：提供全套沐浴、皮肤护理服务</p>
                <img src="../../img/guide/14.jpg" className="img-responsive"/>


                <p>9、服务时长：完成该项服务所需要的平均时间。</p>
                <img src="../../img/guide/15.jpg" className="img-responsive"/>


                <p>10、价格设置：点击下拉框，可以按“肩高”或者按“体重”，分别进行设置。</p>
                <img src="../../img/guide/16.jpg" className="img-responsive"/>


                <p>11、除了基本的剪毛服务，如果还有其他像断甲、药浴、spa……等等的附加服务，可以这里进行设置：</p>
                <img src="../../img/guide/17.jpg" className="img-responsive"/>

                <p>12、保存服务、预览</p>


                <p>13、发布</p>


                <h4>二、修改和管理服务</h4>

                <p>进入欢宠伙伴服务号——进入“服务管理”页面，点击“查看”，可对已经建立的服务进行修改。</p>
                <img src="../../img/guide/18.jpg" className="img-responsive"/>
                <img src="../../img/guide/19.jpg" className="img-responsive"/>
                <img src="../../img/guide/20.jpg" className="img-responsive"/>
            </div>

            <div className="hg-modal-footer text-right row">
                <div className="col-xs-12">
                    <button type="button" className="btn btn-default btn-hd-blue roffset5" onClick={this._onCancel}>关闭</button>
                </div>
            </div>
        </div>;
    },

    _onCancel: function() {
        Actions.triggerAgreementCancelToList();
    },

});

module.exports = app;

