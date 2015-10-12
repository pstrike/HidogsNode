/** @jsx React.DOM */

var React = require('react');
var HidogsConstants = require('../../Common/constants/HidogsConstants');
var ShopStore = require('../stores/ShopStore');
var AppDispatcher = require('../../Common/dispatcher/AppDispatcher');
var HidogsActions = require('../actions/VendorProdutActions');
var ShopComment = require('./ShopComment.react.js');

function getShopState() {
    return ShopStore.getShop();
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
        ShopStore.addChangeListener(this._onChange);
        HidogsActions.getShopById(this.props.shopId);
    },

    componentWillUnmount: function() {
        ShopStore.removeChangeListener(this._onChange);
    },

    render: function() {
        var isCommentShown = false;
        var comments = this.state.comment;
        var commentList = [];

        for (var key in comments) {
            commentList.push(<ShopComment comment={comments[key]}/>);
            isCommentShown = true;
        }

        var theme;
        if(this.state.type == "宠物店") {
            theme = "blue";
        }
        else if(this.state.type == "餐厅") {
            theme = "yellow";
        }

        return (
            <div className={"container shop theme_"+theme}>
                <div className={"container background theme_"+theme}></div>

                <div className="container header">
                    <div className="row text-center component">
                        <span className="glyphicon glyphicon-thumbs-up friendly-icon" aria-hidden="true" ></span><span className="friendly-note">95%好评</span>
                    </div>
                    <div className="row text-center component">
                        <span className="glyphicon glyphicon-asterisk category-icon" aria-hidden="true" ></span><span  className="category-note">{this.state.name}</span>
                    </div>
                    <div className="row text-center component">
                        <div className="col-xs-5 col-xs-offset-1"><button type="button" className={"btn btn-default theme_"+theme}>投票</button></div>
                        <div className="col-xs-5"><button type="button" className={"btn btn-default theme_"+theme}>评论</button></div>
                    </div>
                </div>

                <div className="container info">
                    <div className={"row text-center component dark theme_"+theme}>
                        <span className="glyphicon glyphicon-map-marker" aria-hidden="true" ></span>{this.state.address}
                    </div>
                    <div className={"row text-center component theme_"+theme}>
                        <span className="glyphicon glyphicon-earphone" aria-hidden="true" ></span>{this.state.tel}
                    </div>
                </div>

                <div className="container description">
                    <div className="row text-center description-icon"><span className="glyphicon glyphicon-pencil" aria-hidden="true" ></span></div>
                    <div className="row description-note" dangerouslySetInnerHTML={{__html:this.state.description}}></div>
                </div>

                {isCommentShown ?
                    <div className="container comment">
                        <div className="row text-center comment-icon"><span className="glyphicon glyphicon-comment" aria-hidden="true" ></span></div>
                            {commentList}
                        <div className="row text-center component">
                        <button type="button" className={"btn btn-default theme_"+theme}>查看其他16条评论</button>
                        </div>
                    </div>
                : null}

                <div className="container footer">
                    <div className="row text-center title"><span>欢宠</span></div>
                    <div className="row text-center"><span>广州欢宠信息科技有限公司</span></div>
                </div>

            </div>

        );


    },

    _onChange: function() {
        this.setState(getShopState());
    }

});

module.exports = HidogsApp;

