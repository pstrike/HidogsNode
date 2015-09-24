/** @jsx React.DOM */

var React = require('react');
var HidogsConstants = require('../constants/HidogsConstants');
var AppDispatcher = require('../dispatcher/AppDispatcher');
var HidogsActions = require('../actions/HidogsActions');

function getShopState() {
    return {};
}

var HidogsApp = React.createClass({

    getInitialState: function() {
        //console.log(this.props.initData);
        if(this.props.initData)
            return this.props.initData;
        else
            return {};

    },

    componentDidMount: function() {
        console.log("mount shop react")
        //LocationStore.addChangeListener(this._onChange);
        //HidogsActions.getLocation(0);
    },

    componentWillUnmount: function() {
        //LocationStore.removeChangeListener(this._onChange);
    },

    render: function() {
        return (
            <div className="container shop theme_blue">
                <div className="container background theme_blue"></div>

                <div className="container header">
                    <div className="row text-center component">
                        <span className="glyphicon glyphicon-thumbs-up friendly-icon" aria-hidden="true" ></span><span className="friendly-note">95%好评</span>
                    </div>
                    <div className="row text-center component">
                        <span className="glyphicon glyphicon-asterisk category-icon" aria-hidden="true" ></span><span  className="category-note">{this.state.name}</span>
                    </div>
                    <div className="row text-center component">
                        <div className="col-xs-5 col-xs-offset-1"><button type="button" className="btn btn-default theme_blue">投票</button></div>
                        <div className="col-xs-5"><button type="button" className="btn btn-default theme_blue">评论</button></div>
                    </div>
                </div>

                <div className="container info">
                    <div className="row text-center component dark">
                        <span className="glyphicon glyphicon-map-marker" aria-hidden="true" ></span>广州市海珠区琶洲商业广场
                    </div>
                    <div className="row text-center component">
                        <span className="glyphicon glyphicon-earphone" aria-hidden="true" ></span>020-88110022
                    </div>
                </div>

                <div className="container description">
                    <div className="row text-center description-icon"><span className="glyphicon glyphicon-pencil" aria-hidden="true" ></span></div>
                    <div className="row description-note">
                        <p>我家NaNa小姐系系老板这里买的，三个月的小家伙！非常活泼可爱，而且品种优良！最重要是带回家几天都非常健康的！然后来了我家住了一个礼拜后，我搞度距饱亲屙肚一次，琴晚就饿......</p>
                        <img className="img-responsive" src="../img/20130910163136-1048260609.jpg"/>
                    </div>
                </div>

                <div className="container comment">
                    <div className="row text-center comment-icon"><span className="glyphicon glyphicon-comment" aria-hidden="true" ></span></div>
                    <div className="row component">
                        <div className="col-xs-2 col-xs-offset-1 text-center">
                            <img src="../img/ppl_icon.png"/><br/>
                            <span className="small">小新</span>
                        </div>
                        <div className="col-xs-8">
                            <em className="date small">2015.9.15, 14:30</em>
                            <p>我家波波有幸被抽中免费体验洗白白y∩__∩y 当然要回敬一个点评以表感激。其实我是住在这附近，这店开了很久了，就在马路边，很容易找到。</p>
                        </div>
                    </div>
                    <div className="row text-center component">
                        <button type="button" className="btn btn-default theme_blue">查看其他16条评论</button>
                    </div>
                </div>

                <div className="container footer">
                    <div className="row text-center title"><span>欢宠</span></div>
                    <div className="row text-center"><span>广州欢宠信息科技有限公司</span></div>
                </div>

            </div>

        );


    },

    _onChange: function() {
        console.log('callback');
        //console.log(LocationStore.getLocation());
        //this.setState(getLocationState());
    }

});

module.exports = HidogsApp;

