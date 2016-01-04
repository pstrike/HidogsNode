var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var AppDispatcher = require('../../Common/dispatcher/AppDispatcher');
var Constants = require('../constants/Constants');
var ModelPrototype = require('../../../model/prototype');
var APVTO = require('../../../util/assignpathvaluetoobject');
var CHANGE_EVENT = 'change';

// Store State
var _productList = [];
var _product = {};
var _editProduct = {};
var _status = "";
var _productMeta = {};
var _vendorProfile = {};
var _wxSign = {};
var _editSetting = {};
var _productVerifyMsg = {};
var _settingVerifyMsg = {};

// Store actions
// List Actions
function triggerListToDetail(productId) {

    for(var i=0; i<_productList.length; i++) {
        if(_productList[i].product_id == productId) {
            _product = _productList[i];
            break;
        }
    }
    _status = Constants.STATE_VENDOR_PRODUCT_DETAIL;

    Store.emitChange();
};

function triggerListToSetting() {
    _status = Constants.STATE_VENDOR_PRODUCT_SETTING;

    Store.emitChange();
};

function triggerListToNew() {
    _editProduct = ModelPrototype.getProductPrototype();
    _editProduct.address = JSON.parse(JSON.stringify(_vendorProfile.address));
    _editProduct.location = JSON.parse(JSON.stringify(_vendorProfile.location));
    _status = Constants.STATE_VENDOR_PRODUCT_NEW;
    _productVerifyMsg = {};

    Store.emitChange();
};

function triggerListToAgreement() {
    _status = Constants.STATE_VENDOR_PRODUCT_AGREEMENT;

    Store.emitChange();
};

function triggerListToGuide() {
    _status = Constants.STATE_VENDOR_PRODUCT_GUIDE;

    Store.emitChange();
};

function loadSessionSuccessful(response) {
    _vendorProfile.vendorId = response.vendor_id;
    _vendorProfile.vendorRole = response.role;
    _vendorProfile.vendorHeadImageUrl = response.head_image_url;
    _vendorProfile.vendorNickname = response.nick_name;
    _vendorProfile.status = response.status;

    //console.log('load vendor session');
    //console.log(_vendorProfile);

    if(!response.vendor_id) {
        _status = Constants.STATE_VENDOR_PRODUCT_LIST_ERR;
    }

    if(response.status != "approved") {
        _status = Constants.STATE_VENDOR_PRODUCT_LIST_JOIN;
    }

    Store.emitChange();
};

function loadSessionFail() {
    _status = Constants.STATE_VENDOR_PRODUCT_LIST_ERR;

    Store.emitChange();
};

function loadProductListSuccessful(productList) {
    _productList = productList;

    //console.log('load product list');
    //console.log(productList);

    if(_status != Constants.STATE_VENDOR_PRODUCT_LIST_JOIN) {
        if(productList.length > 0) {
            _status = Constants.STATE_VENDOR_PRODUCT_LIST
        }
        //else {
        //    _status = Constants.STATE_VENDOR_PRODUCT_LIST_WELCOME
        //}
    }

    Store.emitChange();
};

function loadExampleSuccessful(productList) {
    if(_vendorProfile.vendorId != 'hg1') {
        productList.forEach(function(item) {
            if(item.status == "published") {
                _productList.push(item);
            }
        })
    }

    //console.log('load example list');
    //console.log(productList);

    if(_status != Constants.STATE_VENDOR_PRODUCT_LIST_JOIN && _vendorProfile.agreement) {
        if(_productList.length > 0) {
            _status = Constants.STATE_VENDOR_PRODUCT_LIST;
        }
        else {
            _status = Constants.STATE_VENDOR_PRODUCT_LIST_WELCOME;
        }
    }

    Store.emitChange();
}

function loadProductMetaSuccessful(metaData) {
    _productMeta = metaData;

    //console.log('load product meta');
    //console.log(_productMeta);

    Store.emitChange();
};

function loadVendorProfileSuccessful(profile) {
    _vendorProfile.address = profile.address;
    _vendorProfile.location = profile.location;
    _vendorProfile.setting = profile.setting;
    _vendorProfile.agreement = profile.agreement;

    if(_status != Constants.STATE_VENDOR_PRODUCT_LIST_JOIN) {
        if(!_vendorProfile.agreement) {
            _status = Constants.STATE_VENDOR_PRODUCT_LIST_AGREEMENT;
        }
    }

    //console.log('load vendor profile');
    //console.log(_vendorProfile);

    //if(!_vendorProfile.agreement) {
    //    _status = Constants.STATE_VENDOR_PRODUCT_AGREEMENT;
    //}

    Store.emitChange();
};

// New Actions
function triggerNewSaveToDetail(tmpProduct) {
    _productList.splice(0,0,tmpProduct);
    _product = tmpProduct;
    _status = Constants.STATE_VENDOR_PRODUCT_DETAIL;
    _productVerifyMsg = "";

    Store.emitChange();
};

function triggerNewCancelToList() {
    if(_productList.length == 0) {
        _status = Constants.STATE_VENDOR_PRODUCT_LIST_WELCOME
    }
    else {
        _status = Constants.STATE_VENDOR_PRODUCT_LIST;
    }

    Store.emitChange();
};

function triggerNewSaveDataSuccess(product) {
    // do nothing
}

// Setting Actions
function triggerSettingToList() {
    if(_productList.length == 0) {
        _status = Constants.STATE_VENDOR_PRODUCT_LIST_WELCOME
    }
    else {
        _status = Constants.STATE_VENDOR_PRODUCT_LIST;
    }

    Store.emitChange();
};

function triggerSettingToSettingEdit() {
    _editSetting = JSON.parse(JSON.stringify(_vendorProfile.setting));
    if(_editSetting.business_time_list.length == 0) {
        _editSetting.business_time_list.push({start_time:"", end_time:""});
    }

    _status = Constants.STATE_VENDOR_PRODUCT_SETTING_EDIT;

    Store.emitChange();
};

function saveRejectFlag(vendor) {
    _vendorProfile.setting.reject_today_flag = vendor.setting.reject_today_flag;
    //_vendorProfile.setting.reject_in_progress_flag = false;

    Store.emitChange();
};

// Setting Edit Actions
function triggerSettingEditSaveToSetting(vendor) {
    _vendorProfile.setting = vendor.setting;
    _status = Constants.STATE_VENDOR_PRODUCT_SETTING;

    Store.emitChange();
};

function triggerSettingEditCancelToSetting() {
    _status = Constants.STATE_VENDOR_PRODUCT_SETTING;

    Store.emitChange();
};

function saveSettingSuccessful() {
    // do nothing
};

function showSettingVerifyMsg(msg) {
    _settingVerifyMsg = msg;

    Store.emitChange();
};

// Detail Actions
function triggerDetailToEdit(tmpProduct) {
    if(tmpProduct.status) {
        _product.status = tmpProduct.status;
        for(var i=0; i<_productList.length; i++) {
            if(tmpProduct.product_id == _productList[i].product_id) {
                _productList[i].status = tmpProduct.status;
                break;
            }
        }
    }
    _editProduct = JSON.parse(JSON.stringify(_product));
    _status = Constants.STATE_VENDOR_PRODUCT_EDIT;
    _productVerifyMsg = {};

    Store.emitChange();
};

function triggerDetailToList() {
    if(_productList.length == 0) {
        _status = Constants.STATE_VENDOR_PRODUCT_LIST_WELCOME
    }
    else {
        _status = Constants.STATE_VENDOR_PRODUCT_LIST;
    }

    Store.emitChange();
};

function triggerDetailToComment() {
    _status = Constants.STATE_VENDOR_PRODUCT_COMMENT;

    Store.emitChange();
};

function triggerDetailToPreview() {
    alert("trigger preview");
};

function loadProductDetailSuccssful(product) {
    _product = product;

    //console.log("load product detail");
    //console.log(_product);

    Store.emitChange();
};

function publishProduct(tmpProduct) {
    _product.status = tmpProduct.status;
    for(var i=0; i<_productList.length; i++) {
        if(tmpProduct.product_id == _productList[i].product_id) {
            _productList[i].status = tmpProduct.status;
            break;
        }
    }

    Store.emitChange();
}

function withdrawProduct(tmpProduct) {
    _product.status = tmpProduct.status;
    for(var i=0; i<_productList.length; i++) {
        if(tmpProduct.product_id == _productList[i].product_id) {
            _productList[i].status = tmpProduct.status;
            break;
        }
    }

    Store.emitChange();
}

// Comment Actions
function triggerCommentToDetail() {
    _status = Constants.STATE_VENDOR_PRODUCT_DETAIL;

    Store.emitChange();
};

// Edit Actions
function triggerEditSaveToDetail(tmpProduct) {
    _product = tmpProduct;
    _productVerifyMsg = "";

    for(var i=0; i<_productList.length; i++) {
        if(tmpProduct.product_id == _productList[i].product_id) {
            _productList[i] = tmpProduct;
            break;
        }
    }
    _status = Constants.STATE_VENDOR_PRODUCT_DETAIL;

    Store.emitChange();
};

function triggerEditDeleteToList(tmpProduct) {
    _product = {};
    _productVerifyMsg = "";
    _editProduct = {};

    for(var i=0; i<_productList.length; i++) {
        if(tmpProduct.product_id == _productList[i].product_id) {
            _productList.splice(i, 1);
            break;
        }
    }

    if(_productList.length == 0) {
        _status = Constants.STATE_VENDOR_PRODUCT_LIST_WELCOME;
    }
    else {
        _status = Constants.STATE_VENDOR_PRODUCT_LIST;
    }

    Store.emitChange();
};

function triggerEditCancelToDetail() {
    _status = Constants.STATE_VENDOR_PRODUCT_DETAIL;

    Store.emitChange();
};

function updateProductSuccessful() {
    // do nothing
};

function editDeleteSuccessful() {
    // do nothing
};

function showProductVerifyMsg(msg) {
    _productVerifyMsg = msg;

    Store.emitChange();
};

// Agreement
function triggerAgreementCancelToList() {
    if(_vendorProfile.agreement) {
        if(_productList.length == 0) {
            _status = Constants.STATE_VENDOR_PRODUCT_LIST_WELCOME;
        }
        else {
            _status = Constants.STATE_VENDOR_PRODUCT_LIST;
        }
    }
    else {
        _status = Constants.STATE_VENDOR_PRODUCT_LIST_AGREEMENT;
    }

    Store.emitChange();
};

function triggerAgreementAgreeToList() {
    _vendorProfile.agreement = true;

    if(_productList.length == 0) {
        _status = Constants.STATE_VENDOR_PRODUCT_LIST_WELCOME
    }
    else {
        _status = Constants.STATE_VENDOR_PRODUCT_LIST;
    }

    Store.emitChange();
};

function agreeSuccssful() {
    // do nothing
};

// Guide
function triggerGuideToList() {
    if(_vendorProfile.agreement) {
        if(_productList.length == 0) {
            _status = Constants.STATE_VENDOR_PRODUCT_LIST_WELCOME;
        }
        else {
            _status = Constants.STATE_VENDOR_PRODUCT_LIST;
        }
    }
    else {
        _status = Constants.STATE_VENDOR_PRODUCT_LIST_AGREEMENT;
    }

    Store.emitChange();
};

// Other
function getWXSignatureSuccess(signature) {
    _wxSign = signature;

    Store.emitChange();
};

function getWXMediaSuccess(fileName, path) {
    APVTO.assign(_editProduct, path, fileName);

    Store.emitChange();
};

// Err Handling
function err(msg) {
    console.log("[Err] "+msg);
    alert("好像出了点问题,请刷新页面重试一下.抱歉.");
};

// Store definition
var Store = assign({}, EventEmitter.prototype, {

    getProductList: function() {
        return _productList;
    },

    getProduct: function() {
        return _product;
    },

    getEditProduct: function() {
        return _editProduct;
    },

    getProductMeta: function() {
        return _productMeta;
    },

    getVendorProfile: function() {
        return _vendorProfile;
    },

    getWXSign: function() {
        return _wxSign;
    },

    getEditSetting: function() {
        return _editSetting;
    },

    getProductVerifyMsg: function() {
        return _productVerifyMsg;
    },

    getSettingVerifyMsg: function() {
        return _settingVerifyMsg;
    },

    getStatus: function() {
        return _status;
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
        // List Actions
        case Constants.ACTION_VENDOR_PRODUCT_LIST_TRIGGER_DETAIL:
            var productId = action.productId;
            triggerListToDetail(productId);
            break;

        case Constants.ACTION_VENDOR_PRODUCT_LIST_TRIGGER_SETTING:
            triggerListToSetting();
            break;

        case Constants.ACTION_VENDOR_PRODUCT_LIST_TRIGGER_NEW:
            triggerListToNew();
            break;

        case Constants.ACTION_VENDOR_PRODUCT_LIST_LOAD_SESSION_SUCCESSFUL:
            var response = action.response;

            loadSessionSuccessful(response);
            break;

        case Constants.ACTION_VENDOR_PRODUCT_LIST_LOAD_LIST_SUCCESSFUL:
            var productList = JSON.parse(action.payload.response);

            loadProductListSuccessful(productList);
            break;

        case Constants.ACTION_VENDOR_PRODUCT_LIST_LOAD_META_SUCCESSFUL:
            var metaData = JSON.parse(action.payload.response);

            loadProductMetaSuccessful(metaData);
            break;

        case Constants.ACTION_VENDOR_PRODUCT_LIST_LOAD_VENDOR_SUCCESSFUL:
            var profile = JSON.parse(action.payload.response);

            loadVendorProfileSuccessful(profile);
            break;

        case Constants.ACTION_VENDOR_PRODUCT_LIST_TRIGGER_AGREEMENT:
            triggerListToAgreement();
            break;

        case Constants.ACTION_VENDOR_PRODUCT_LIST_TRIGGER_GUIDE:
            triggerListToGuide();
            break;

        case Constants.ACTION_VENDOR_PRODUCT_LIST_LOAD_EXAMPLE_SUCCESSFUL:
            var productList = JSON.parse(action.payload.response);

            loadExampleSuccessful(productList);
            break;

        // New Actions
        case Constants.ACTION_VENDOR_PRODUCT_NEW_SAVE_TRIGGER_DETAIL:
            var tmpProduct = action.tmpProduct;
            triggerNewSaveToDetail(tmpProduct);
            break;

        case Constants.ACTION_VENDOR_PRODUCT_NEW_SAVE_DATA_SUCCESS:
            var product = action.payload.response;
            triggerNewSaveDataSuccess(product);
            break;

        case Constants.ACTION_VENDOR_PRODUCT_NEW_CANCEL_TRIGGER_LIST:
            triggerNewCancelToList();
            break;

        // Setting Actions
        case Constants.ACTION_VENDOR_PRODUCT_SETTING_TRIGGER_LIST:
            triggerSettingToList();
            break;

        case Constants.ACTION_VENDOR_PRODUCT_SETTING_TRIGGER_SETTING_EDIT:
            triggerSettingToSettingEdit();
            break;

        case Constants.ACTION_VENDOR_PRODUCT_SETTING_SAVE_DATA_SUCCESSFUL:
            var vendor = action.vendor;
            saveRejectFlag(vendor);
            break;

        // Setting Edit Actions
        case Constants.ACTION_VENDOR_PRODUCT_SETTING_EDIT_SAVE_TRIGGER_SETTING:
            var vendor = action.vendor;
            triggerSettingEditSaveToSetting(vendor);
            break;

        case Constants.ACTION_VENDOR_PRODUCT_SETTING_EDIT_CANCEL_TRIGGER_SETTING:
            triggerSettingEditCancelToSetting();
            break;

        case Constants.ACTION_VENDOR_PRODUCT_SETTING_EDIT_SAVE_DATA_SUCCESSFUL:
            saveSettingSuccessful();
            break;

        case Constants.ACTION_VENDOR_PRODUCT_SETTING_EDIT_SHOW_VERIFY_MSG:
            var msg = action.msg;
            showSettingVerifyMsg(msg);
            break;

        // Detail Actions
        case Constants.ACTION_VENDOR_PRODUCT_DETAIL_TRIGGER_COMMENT:
            triggerDetailToComment();
            break;

        case Constants.ACTION_VENDOR_PRODUCT_DETAIL_TRIGGER_EDIT:
            triggerDetailToEdit(action.product);
            break;

        case Constants.ACTION_VENDOR_PRODUCT_DETAIL_TRIGGER_LIST:
            triggerDetailToList();
            break;

        case Constants.ACTION_VENDOR_PRODUCT_DETAIL_TRIGGER_PREVIEW:
            var redirect = action.payload.response;

            window.location = redirect;
            //triggerDetailToPreview();
            break;

        case Constants.ACTION_VENDOR_PRODUCT_DETAIL_LOAD_DETAIL_SUCCESSFUL:
            var product = JSON.parse(action.payload.response);
            loadProductDetailSuccssful(product);
            break;

        case Constants.ACTION_VENDOR_PRODUCT_DETAIL_PUBLISH:
            var product = action.product;
            publishProduct(product);
            break;

        case Constants.ACTION_VENDOR_PRODUCT_DETAIL_WITHDRAW:
            var product = action.product;
            withdrawProduct(product);
            break;

        // Edit Actions
        case Constants.ACTION_VENDOR_PRODUCT_EDIT_SAVE_TRIGGER_DETAIL:
            var product = action.product;

            triggerEditSaveToDetail(product);
            break;

        case Constants.ACTION_VENDOR_PRODUCT_EDIT_CANCEL_TRIGGER_DETAIL:
            triggerEditCancelToDetail();
            break;

        case Constants.ACTION_VENDOR_PRODUCT_EDIT_SAVE_DATA_SUCCESSFUL:
            updateProductSuccessful();
            break;

        case Constants.ACTION_VENDOR_PRODUCT_EDIT_SHOW_VERIFY_MSG:
            var msg = action.msg;
            showProductVerifyMsg(msg);

            break;

        case Constants.ACTION_VENDOR_PRODUCT_EDIT_DELETE_TRIGGER_LIST:
            var product = action.product;

            triggerEditDeleteToList(product);
            break;

        case Constants.ACTION_VENDOR_PRODUCT_EDIT_DELETE_DATA_SUCCESSFUL:
            editDeleteSuccessful();
            break;

        // Comment Actions
        case Constants.ACTION_VENDOR_PRODUCT_COMMENT_TRIGGER_DETAIL:
            triggerCommentToDetail();
            break;

        // Agreement Actions
        case Constants.ACTION_VENDOR_PRODUCT_AGREEMENT_AGREE_TRIGGER_LIST:
            triggerAgreementAgreeToList();
            break;

        case Constants.ACTION_VENDOR_PRODUCT_AGREEMENT_CANCEL_TRIGGER_LIST:
            triggerAgreementCancelToList();
            break;

        case Constants.ACTION_VENDOR_PRODUCT_AGREEMENT_AGREE_SUCCESSFUL:
            agreeSuccssful();
            break;

        // Guide Actions
        case Constants.ACTION_VENDOR_PRODUCT_GUIDE_TRIGGER_LIST:
            triggerGuideToList();
            break;

        // Other
        case Constants.ACTION_GET_WX_SIGNATURE_SUCCESS:
            var signature = JSON.parse(action.payload.response);

            getWXSignatureSuccess(signature);
            break;

        case Constants.ACTION_GET_WX_MEDIA_SUCCESS:
            var fileName = action.payload.response;
            var path = action.path;
            getWXMediaSuccess(fileName, path);

            break;

        // Handle Err
        case Constants.ACTION_VENDOR_PRODUCT_LIST_LOAD_SESSION_FAIL:
            loadSessionFail();
            break;

        case Constants.ACTION_VENDOR_PRODUCT_LIST_LOAD_LIST_FAIL:
        case Constants.ACTION_VENDOR_PRODUCT_LIST_LOAD_META_FAIL:
        case Constants.ACTION_VENDOR_PRODUCT_LIST_LOAD_VENDOR_FAIL:
        case Constants.ACTION_VENDOR_PRODUCT_LIST_LOAD_EXAMPLE_FAIL:

        case Constants.ACTION_VENDOR_PRODUCT_NEW_SAVE_DATA_FAIL:

        case Constants.ACTION_VENDOR_PRODUCT_DETAIL_LOAD_DETAIL_FAIL:
        case Constants.ACTION_VENDOR_PRODUCT_DETAIL_TRIGGER_PREVIEW_FAIL:

        case Constants.ACTION_VENDOR_PRODUCT_EDIT_SAVE_DATA_FAIL:
        case Constants.ACTION_VENDOR_PRODUCT_EDIT_DELETE_DATA_FAIL:

        case Constants.ACTION_VENDOR_PRODUCT_SETTING_SAVE_DATA_FAIL:

        case Constants.ACTION_VENDOR_PRODUCT_SETTING_EDIT_SAVE_DATA_FAIL:

        case Constants.ACTION_VENDOR_PRODUCT_AGREEMENT_AGREE_FAIL:

        case Constants.ACTION_GET_WX_SIGNATURE_FAIL:
        case Constants.ACTION_GET_WX_MEDIA_FAIL:
            err(action.actionType);
            break;

        default:
            err("no action catach");
    }
});

module.exports = Store;