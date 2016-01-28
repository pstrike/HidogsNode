var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var AppDispatcher = require('../../Common/dispatcher/AppDispatcher');
var Constants = require('../constants/Constants');
var CHANGE_EVENT = 'change';

// Store State
var _userList = [];
var _user = {};

// Store actions
function getUserListSuccess(userList) {

    _userList = [];

    userList.forEach(function(user) {
        if(user.user_id.indexOf("robot")<0) {

            user.love.match_no = 0;
            for(var i=0; i<user.love.i_love.length; i++){
                for(var j=0; j<user.love.love_me.length; j++) {
                    if(user.love.i_love[i] == user.love.love_me[j]) {
                        user.love.match_no++;
                        break;
                    }
                }
            }

            if(!user.visit_count) {
                user.visit_count = {love:0,talent:0};
            }

            if(!user.visit_count.love) {
                user.visit_count.love = 0;
            }

            if(!user.visit_count.talent) {
                user.visit_count.talent = 0;
            }

            _userList.push(user);
        }
    })

    Store.emitChange();
};

function getWXUserBatchSuccess(userList) {
    userList.forEach(function(user) {
        for(var i=0; i<_userList.length; i++) {
            if(user.openid == _userList[i].openid) {
                _userList[i].isSubscribe = user.subscribe == 1 ? true : false;
            }
        }
    })
    Store.emitChange();
};

// sort support 3 params
function sortByKey(key) {

    var keys = key.split(".")

    var isLength = false;
    if(keys[keys.length] == 'length') {
        keys.splice(keys.length-1, 1);
        isLength = true
    }

    if(isLength) {
        switch (keys.length) {
            case 1:
                _userList.sort(function(a,b){return a[keys[0]].length<b[keys[0]].length?1:-1});
                break;

            case 2:
                _userList.sort(function(a,b){return a[keys[0]][keys[1]].length<b[keys[0]][keys[1]].length?1:-1});
                break;

        }
    }
    else {
        switch (keys.length) {
            case 1:
                _userList.sort(function(a,b){return a[keys[0]]<b[keys[0]]?1:-1});
                break;

            case 2:
                _userList.sort(function(a,b){return a[keys[0]][keys[1]]<b[keys[0]][keys[1]]?1:-1});
                break;

            case 3:
                _userList.sort(function(a,b){return a[keys[0]][keys[1]][keys[2]]<b[keys[0]][keys[1]][keys[2]]?1:-1});
                break;

        }
    }

    Store.emitChange();
}

function getUserDetail(userId) {
    for(var i=0; i<_userList.length; i++) {
        if(userId == _userList[i]) {
            _user = _userList[i];
        }
    }

    Store.emitChange();

}

function getUserDetailOk(user) {
    user.love.match_no = 0;

    for(var i=0; i<user.love.i_love.length; i++){
        for(var j=0; j<user.love.love_me.length; j++) {
            if(user.love.i_love[i] == user.love.love_me[j]) {
                user.love.match_no++;
                break;
            }
        }
    }

    if(!user.visit_count) {
        user.visit_count = {love:0,talent:0};
    }

    _user = user;

    Store.emitChange();
}

// Err Handling
function err(msg) {
    console.log("[Err] "+msg);
    alert("好像出了点问题,请刷新页面重试一下.抱歉.");
};

// Store definition
var Store = assign({}, EventEmitter.prototype, {

    getUserList: function() {
        return _userList;
    },

    getUser: function() {
        return _user;
    },

    emitChange: function() {
        this.emit(CHANGE_EVENT);
    },

    /**
     * @param {function} callback
     */
    addChangeListener: function(callback) {
        this.on(CHANGE_EVENT, callback);
    },

    /**
     * @param {function} callback
     */
    removeChangeListener: function(callback) {
        this.removeListener(CHANGE_EVENT, callback);
    }
});

// Handle dispatcher
AppDispatcher.register(function(action) {

    switch (action.actionType) {
        case Constants.ACTION_GET_USER_LIST_SUCCESS:
            getUserListSuccess(action.userList);
            break;

        case Constants.ACTION_GET_WX_USER_BATCH_SUCCESS:
            getWXUserBatchSuccess(JSON.parse(action.payload.response));
            break;

        case Constants.ACTION_SORT_USER_LIST:
            sortByKey(action.key);
            break;

        case Constants.ACTION_GET_USER_DETAIL:
            getUserDetail(action.userId);
            break;

        case Constants.ACTION_GET_USER_DETAIL_OK:
            getUserDetailOk(JSON.parse(action.payload.response));
            break;

        case Constants.ACTION_GET_USER_LIST_FAIL:
        case Constants.ACTION_GET_USER_DETAIL_FAIL:
            err(action.actionType);
            break;

        default:
            err("no action catach");
    }
});

module.exports = Store;