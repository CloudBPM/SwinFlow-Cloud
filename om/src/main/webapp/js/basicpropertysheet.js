/**
 *
 */

;
(function ($, window, document, undefined) {
    var pluginName = "basicPropertySheet";
    var defaults = {
        prop: "",
        ownerId: "",
        parent: "",
        topparent: "",
    };

    var BasicPropertySheet = function (element, options) {
        this.element = element;
        this.options = $.extend({
            prop: "",
            ownerId: "",
            parent: "",
            topparent: "",
        }, defaults, options);
        this._defaults = defaults;
        this._name = pluginName;
        this.tabId = null;
        this.topparent = null;
        this.propertysheet = null;
        this.init(options);
        this.clearSheet();
        this.initSheet();
    };

    BasicPropertySheet.prototype.init = function (options) {
        this.topparent = options.topparent;
        var panelDiv = document.createElement("DIV");
        panelDiv.className = "panel panel-default";
        this.element.appendChild(panelDiv);

        var header = document.createElement("DIV");
        header.className = "panel-heading";
        header.innerHTML = "基本属性";
        panelDiv.appendChild(header);

        var tableDiv = document.createElement("DIV");
        tableDiv.className = "table-responsive";
        tableDiv.style.overflowY = "auto";
        tableDiv.style.overflowX = "auto";
        tableDiv.id = "basicpropertysheet";
        panelDiv.appendChild(tableDiv);

        this.propertysheet = document.createElement("table");
        this.propertysheet.id = "propertysheet";
        this.propertysheet.className = "table table-striped table-hover";
        tableDiv.appendChild(this.propertysheet);

        // general message dialog plugin
        var p3 = $(options.topparent).messageDialog({
            id: "016",
            title: vendor + " - 提示",
            parent: this,
        });
        this.messageDialog = p3.data("messageDialog");

        var plugin1 = $(this.propertysheet).textCellEditor({
            parent: this,
            msg: this.messageDialog,
        });
        this.editor = plugin1.data("textCellEditor");

        var plugin2 = $(this.propertysheet).numberCellEditor({
            parent: this,
            msg: this.messageDialog,
        });
        this.editor2 = plugin2.data("numberCellEditor");

        var plugin3 = $(this.propertysheet).textareaCellEditor({
            parent: this,
            msg: this.messageDialog,
        });
        this.editor3 = plugin3.data("textareaCellEditor");

        var plugin4 = $(this.propertysheet).emailCellEditor({
            parent: this,
            msg: this.messageDialog,
        });
        this.editor4 = plugin4.data("emailCellEditor");

        var plugin5 = $(this.propertysheet).dateCellEditor({
            parent: this,
            msg: this.messageDialog,
        });
        this.editor5 = plugin5.data("dateCellEditor");

        var plugin6 = $(this.propertysheet).bcSelectCellEditor({
            parent: this,
            msg: this.messageDialog,
        });
        this.editor6 = plugin6.data("bcSelectCellEditor");

        var plugin7 = $(this.propertysheet).bcdSelectCellEditor({
            parent: this,
            msg: this.messageDialog,
        });
        this.editor7 = plugin7.data("bcdSelectCellEditor");

        var plugin8 = $(this.propertysheet).rankSelectCellEditor({
            parent: this,
            msg: this.messageDialog,
        });
        this.editor8 = plugin8.data("rankSelectCellEditor");

        var plugin9 = $(this.propertysheet).staffNumberCellEditor({
            parent: this,
            msg: this.messageDialog,
        });
        this.editor9 = plugin9.data("staffNumberCellEditor");

        var plugin10 = $(this.propertysheet).phoneNumberCellEditor({
            parent: this,
            msg: this.messageDialog,
        });
        this.editor10 = plugin10.data("phoneNumberCellEditor");

        var plugin11 = $(this.propertysheet).yesnoCellEditor({
            parent: this,
            msg: this.messageDialog,
        });
        this.editor11 = plugin11.data("yesnoCellEditor");

        var plugin12 = $(this.propertysheet).orgStatusCellEditor({
            parent: this,
            msg: this.messageDialog,
        });
        this.editor12 = plugin12.data("orgStatusCellEditor");

        var plugin13 = $(this.propertysheet).orgFullNameCellEditor({
            parent: this,
            msg: this.messageDialog,
        });
        this.editor13 = plugin13.data("orgFullNameCellEditor");

        var plugin14 = $(this.propertysheet).webCellEditor({
            parent: this,
            msg: this.messageDialog,
        });
        this.editor14 = plugin14.data("webCellEditor");

        // user / staff property editor
        var plugin15 = $(this.propertysheet).userFullNameCellEditor({
            parent: this,
            msg: this.messageDialog,
        });
        this.editor15 = plugin15.data("userFullNameCellEditor");

        var plugin16 = $(this.propertysheet).userGenderCellEditor({
            parent: this,
            msg: this.messageDialog,
        });
        this.editor16 = plugin16.data("userGenderCellEditor");

        var plugin17 = $(this.propertysheet).simpleDateCellEditor({
            parent: this,
            msg: this.messageDialog,
        });
        this.editor17 = plugin17.data("simpleDateCellEditor");

        var plugin18 = $(this.propertysheet).userIdTypeCellEditor({
            parent: this,
            msg: this.messageDialog,
        });
        this.editor18 = plugin18.data("userIdTypeCellEditor");

        var plugin181 = $(this.propertysheet).userIdNumCellEditor({
            parent: this,
            msg: this.messageDialog,
        });
        this.editor181 = plugin181.data("userIdNumCellEditor");

        var plugin19 = $(this.propertysheet).userTextPropCellEditor({
            parent: this,
            msg: this.messageDialog,
        });
        this.editor19 = plugin19.data("userTextPropCellEditor");

        var plugin20 = $(this.propertysheet).userNumPropCellEditor({
            parent: this,
            msg: this.messageDialog,
        });
        this.editor20 = plugin20.data("userNumPropCellEditor");

        var plugin21 = $(this.propertysheet).userTextAreaPropCellEditor({
            parent: this,
            msg: this.messageDialog,
        });
        this.editor21 = plugin21.data("userTextAreaPropCellEditor");

        var plugin22 = $(this.propertysheet).staffPropSelectCellEditor({
            parent: this,
            msg: this.messageDialog,
        });
        this.editor22 = plugin22.data("staffPropSelectCellEditor");

        var plugin23 = $(this.propertysheet).staffTextPropCellEditor({
            parent: this,
            msg: this.messageDialog,
        });
        this.editor23 = plugin23.data("staffTextPropCellEditor");

        var plugin24 = $(this.propertysheet).staffPhoneNumPropCellEditor({
            parent: this,
            msg: this.messageDialog,
        });
        this.editor24 = plugin24.data("staffPhoneNumPropCellEditor");

        var plugin25 = $(this.propertysheet).staffDateCellEditor({
            parent: this,
            msg: this.messageDialog,
        });
        this.editor25 = plugin25.data("staffDateCellEditor");

        var plugin26 = $(this.propertysheet).staffTextAreaPropCellEditor({
            parent: this,
            msg: this.messageDialog,
        });
        this.editor26 = plugin26.data("staffTextAreaPropCellEditor");

        var plugin27 = $(this.propertysheet).authGroupTextPropCellEditor({
            parent: this,
            msg: this.messageDialog,
        });
        this.editor27 = plugin27.data("authGroupTextPropCellEditor");

        var plugin28 = $(this.propertysheet).authGroupTextAreaPropCellEditor({
            parent: this,
            msg: this.messageDialog,
        });
        this.editor28 = plugin28.data("authGroupTextAreaPropCellEditor");

        var plugin29 = $(this.propertysheet).homePageValueEditor({
            parent: this,
            msg: this.messageDialog,
        });
        this.editor29 = plugin29.data("homePageValueEditor");

        var plugin30 = $(this.propertysheet).skinSelectCellEditor({
            parent: this,
            msg: this.messageDialog,
        });
        this.editor30 = plugin30.data("skinSelectCellEditor");


        var plugin31 = $(this.propertysheet).mbNameCellEditor({
            parent: this,
            msg: this.messageDialog,
        });
        this.editor31 = plugin31.data("mbNameCellEditor");

        var plugin32 = $(this.propertysheet).fontFamilyCellEditor({
            parent: this,
            msg: this.messageDialog,
        });
        this.editor32 = plugin32.data("fontFamilyCellEditor");

        var plugin33 = $(this.propertysheet).fontSizeCellEditor({
            parent: this,
            msg: this.messageDialog,
        });
        this.editor33 = plugin33.data("fontSizeCellEditor");

        var plugin34 = $(this.propertysheet).fontWeightCellEditor({
            parent: this,
            msg: this.messageDialog,
        });
        this.editor34 = plugin34.data("fontWeightCellEditor");

        var plugin35 = $(this.propertysheet).colorSelectCellEditor({
            parent: this,
            msg: this.messageDialog,
        });
        this.editor35 = plugin35.data("colorSelectCellEditor");

        var plugin36 = $(this.propertysheet).desktopIconNameCellEditor({
            parent: this,
            msg: this.messageDialog,
        });
        this.editor36 = plugin36.data("desktopIconNameCellEditor");

        var plugin37 = $(this.propertysheet).heightSelectCellEditor({
            parent: this,
            msg: this.messageDialog,
        });
        this.editor37 = plugin37.data("heightSelectCellEditor");
    };

    BasicPropertySheet.prototype.initSheet = function (options) {
        for (var i = 0; i < 20; i++) {
            var row = this.propertysheet.insertRow(-1);
            var cell1 = row.insertCell(0);
            cell1.innerHTML = "&nbsp;";
        }
    };

    BasicPropertySheet.prototype.clearSheet = function (options) {
        $(this.propertysheet).children().remove();
    };

    BasicPropertySheet.prototype.setSheet = function (obj, owner) {
        this.clearSheet();
        this.entity = obj;
        this.owner = owner; // owner object;
        var sheet = this.propertysheet;
        if (obj instanceof Organization) {
            for (x in obj) {
                if (x == "id" || x == "name" || x == "abbrLocal"
                    || x == "nameInternational" || x == "abbrInternational"
                    || x == "businessCategory" || x == "businessType"
                    || x == "registrationCode" || x == "registrationDate"
                    || x == "representative" || x == "address"
                    || x == "postCode" || x == "phoneNumber"
                    || x == "faxNumber" || x == "website" || x == "email"
                    || x == "microblog" || x == "webchat"
                    || x == "customerService" || x == "isHeadOffice"
                    || x == "businessScope" || x == "staffNumber"
                    || x == "introduction" || x == "status"
                    || x == "lastupdate" || x == "motherName") {
                    var editable = "-1";
                    var keyname = "";
                    var isnull = "y";
                    if (x == "id") {
                        keyname = "系统标识";
                        editable = "-1";
                    } else if (x == "name") {
                        keyname = "中文全称";
                        editable = "nme";// org name editable
                        isnull = "n";
                    } else if (x == "abbrLocal") {
                        keyname = "中文简称";
                        editable = "te"; // text editable
                        isnull = "n";
                    } else if (x == "nameInternational") {
                        keyname = "英文全称";
                        editable = "te";
                    } else if (x == "abbrInternational") {
                        keyname = "英文简称";
                        editable = "te";
                    } else if (x == "businessCategory") {
                        keyname = "行业大类";
                        editable = "bcse"; // selection editable
                        isnull = "n";
                    } else if (x == "businessType") {
                        keyname = "行业细分";
                        editable = "bcdse";
                        isnull = "n";
                    } else if (x == "staffNumber") {
                        keyname = "公司规模";
                        editable = "scse";
                        isnull = "n";
                    } else if (x == "address") {
                        keyname = "地址";
                        editable = "te";
                        isnull = "n";
                    } else if (x == "postCode") {
                        keyname = "邮政编码";
                        editable = "ne"; // positive number editable
                        isnull = "n";
                    } else if (x == "phoneNumber") {
                        keyname = "电话";
                        editable = "phe"; // phone editable
                        isnull = "n";
                    } else if (x == "faxNumber") {
                        keyname = "传真"; // phone editable
                        editable = "phe";
                        isnull = "n";
                    } else if (x == "email") {
                        keyname = "电子邮箱";// email editable
                        editable = "ee";
                        isnull = "n";
                    } else if (x == "website") {
                        keyname = "官方网站";
                        editable = "webe";
                    } else if (x == "microblog") {
                        keyname = "官方微博";
                        editable = "webe";
                    } else if (x == "webchat") {
                        keyname = "官方微信";
                        editable = "webe";
                    } else if (x == "customerService") {
                        keyname = "客服电话";
                        editable = "ne";
                    } else if (x == "businessScope") {
                        keyname = "业务范围";
                        editable = "tae";// text area editable
                    } else if (x == "introduction") {
                        keyname = "简介";
                        editable = "tae";
                    } else if (x == "isHeadOffice") {
                        keyname = "是否为总部";
                        editable = "ynse";// radio editable
                    } else if (x == "motherName") {
                        keyname = "上级";
                        editable = "-1";
                    } else if (x == "registrationCode") {
                        keyname = "社会信用代码";
                        editable = "te";
                        isnull = "n";
                    } else if (x == "registrationDate") {
                        keyname = "注册日期";
                        editable = "dte"; // date editable
                    } else if (x == "representative") {
                        keyname = "法定代表人";
                        editable = "te";
                        isnull = "n";
                    } else if (x == "status") {
                        keyname = "状态";
                        editable = "orgstse";
                        isnull = "n";
                    } else if (x == "lastupdate") {
                        keyname = "最后更新";
                        editable = "-1";
                    }
                    if (x == "name" || x == "abbrLocal" || x == "address"
                        || x == "nameInternational"
                        || x == "abbrInternational" || x == "address"
                        || x == "email" || x == "businessScope"
                        || x == "introduction" || x == "representative"
                        || x == "registrationCode") {
                        this.setPropertyCell(sheet, x, keyname,
                            obj[x] != null ? Utils.parse(obj[x]) : "",
                            editable, isnull);
                    } else if (x == "registrationDate") {
                        this.setPropertyCell(sheet, x, keyname, Utils
                            .getDate(obj[x]), editable, isnull);
                    } else if (x == "businessCategory") {
                        this.setPropertyCell(sheet, x, keyname,
                            category[obj[x]], editable, isnull);
                    } else if (x == "businessType") {
                        this.setPropertyCell(sheet, x, keyname,
                            categorydtails[obj[x]], editable, isnull);
                    } else if (x == "staffNumber") {
                        this.setPropertyCell(sheet, x, keyname,
                            staffnumber[obj[x]], editable, isnull);
                    } else if (x == "isHeadOffice") {
                        this.setPropertyCell(sheet, x, keyname, yesno[obj[x]],
                            editable, isnull);
                    } else if (x == "status") {
                        this.setPropertyCell(sheet, x, keyname,
                            orgstatus[obj[x]], editable, isnull);
                    } else if (x == "lastupdate") {
                        this.setPropertyCell(sheet, x, keyname, Utils.getDateTime(obj[x]),
                            editable, isnull);
                    } else {
                        this.setPropertyCell(sheet, x, keyname, obj[x],
                            editable, isnull);
                    }
                }
            }
        } else if (obj instanceof Division) {
            for (x in obj) {
                if (x == "id" || x == "name" || x == "abbrName" || x == "rank"
                    || x == "address" || x == "postCode"
                    || x == "phoneNumber" || x == "faxNumber"
                    || x == "email" || x == "createDate" || x == "parent"
                    || x == "status" || x == "lastupdate") {
                    var keyname = "";
                    var editable = "-1";
                    var isnull = "y";
                    if (x == "id") {
                        keyname = "系统标识";
                        editable = "-1";
                    } else if (x == "name") {
                        keyname = "全称";
                        editable = "nme"; // text
                        isnull = "n";
                    } else if (x == "abbrName") {
                        keyname = "简称";
                        editable = "te";
                        isnull = "n";
                    } else if (x == "rank") {
                        keyname = "等级";
                        editable = "rse"; // selection
                        isnull = "n";
                    } else if (x == "address") {
                        keyname = "地址";
                        editable = "te";
                    } else if (x == "postCode") {
                        keyname = "邮政编码";
                        editable = "ne";
                    } else if (x == "phoneNumber") {
                        keyname = "联系电话";
                        editable = "phe";
                    } else if (x == "faxNumber") {
                        keyname = "传真";
                        editable = "phe";
                    } else if (x == "email") {
                        keyname = "电子邮箱";
                        editable = "ee";
                    } else if (x == "createDate") {
                        keyname = "成立日期";
                        editable = "dte";
                    } else if (x == "parent") {
                        keyname = "上级部门";
                        editable = "-1";
                    } else if (x == "status") {
                        keyname = "状态";
                        editable = "orgstse";
                        isnull = "n";
                    } else if (x == "lastupdate") {
                        keyname = "最后更新";
                        editable = "-1";
                    }
                    if (x == "name" || x == "abbrName" || x == "address"
                        || x == "email") {
                        this.setPropertyCell(sheet, x, keyname,
                            obj[x] != null ? Utils.parse(obj[x]) : "",
                            editable, isnull);
                    } else if (x == "parent") {
                        this.setPropertyCell(sheet, x, keyname,
                            obj[x] != null ? Utils.parse(obj[x].name) : "",
                            editable, isnull);
                    } else if (x == "createDate") {
                        this.setPropertyCell(sheet, x, keyname, Utils.getDate(obj[x]),
                            editable, isnull);
                    } else if (x == "lastupdate") {
                        this.setPropertyCell(sheet, x, keyname, Utils.getDateTime(obj[x]),
                            editable, isnull);
                    } else if (x == "rank") {
                        this.setPropertyCell(sheet, x, keyname, rank[obj[x]],
                            editable, isnull);
                    } else if (x == "status") {
                        this.setPropertyCell(sheet, x, keyname,
                            validstatus[obj[x]], editable, isnull);
                    } else {
                        this.setPropertyCell(sheet, x, keyname, obj[x],
                            editable, isnull);
                    }
                }
            }
        } else if (obj instanceof Department) {
            for (x in obj) {
                if (x == "id" || x == "name" || x == "abbrName" || x == "rank"
                    || x == "createDate" || x == "parent" || x == "status"
                    || x == "lastupdate") {
                    var keyname = "";
                    var editable = "-1";
                    if (x == "id") {
                        keyname = "系统标识";
                        editable = "-1";
                    } else if (x == "name") {
                        keyname = "全称";
                        editable = "nme";
                        isnull = "n";
                    } else if (x == "abbrName") {
                        keyname = "简称";
                        isnull = "n";
                        editable = "te";
                    } else if (x == "rank") {
                        keyname = "等级";
                        isnull = "n";
                        editable = "rse";
                    } else if (x == "createDate") {
                        keyname = "成立日期";
                        editable = "dte";
                    } else if (x == "parent") {
                        keyname = "上级部门";
                        editable = "-1";
                    } else if (x == "status") {
                        keyname = "状态";
                        editable = "orgstse";
                        isnull = "n";
                    } else if (x == "lastupdate") {
                        keyname = "最后更新";
                        editable = "-1";
                    }
                    if (x == "name" || x == "abbrName") {
                        this.setPropertyCell(sheet, x, keyname,
                            obj[x] != null ? Utils.parse(obj[x]) : "",
                            editable, isnull);
                    } else if (x == "parent") {
                        this.setPropertyCell(sheet, x, keyname,
                            obj[x] != null ? Utils.parse(obj[x].name) : "",
                            editable, isnull);
                    } else if (x == "rank") {
                        this.setPropertyCell(sheet, x, keyname, rank[obj[x]],
                            editable, isnull);
                    } else if (x == "status") {
                        this.setPropertyCell(sheet, x, keyname,
                            validstatus[obj[x]], editable, isnull);
                    } else if (x == "createDate") {
                        this.setPropertyCell(sheet, x, keyname, Utils.getDate(obj[x]),
                            editable, isnull);
                    } else if (x == "lastupdate") {
                        this.setPropertyCell(sheet, x, keyname, Utils.getDateTime(obj[x]),
                            editable, isnull);
                    } else {
                        this.setPropertyCell(sheet, x, keyname, obj[x],
                            editable, isnull);
                    }
                }
            }
        } else if (obj instanceof ProjectTeam) {
            for (x in obj) {
                if (x == "id" || x == "name" || x == "abbrName" || x == "rank"
                    || x == "createDate" || x == "parent" || x == "status"
                    || x == "lastupdate") {
                    var keyname = "";
                    var editable = "-1";
                    if (x == "id") {
                        keyname = "系统标识";
                        editable = "-1";
                    } else if (x == "name") {
                        keyname = "全称";
                        editable = "nme";
                        isnull = "n";
                    } else if (x == "abbrName") {
                        keyname = "简称";
                        editable = "te";
                        isnull = "n";
                    } else if (x == "rank") {
                        keyname = "等级";
                        editable = "rse";
                        isnull = "n";
                    } else if (x == "createDate") {
                        keyname = "成立日期";
                        editable = "dte";
                    } else if (x == "parent") {
                        keyname = "上级部门";
                        editable = "-1";
                    } else if (x == "status") {
                        keyname = "状态";
                        editable = "orgstse";
                        isnull = "n";
                    } else if (x == "lastupdate") {
                        keyname = "最后更新";
                        editable = "-1";
                    }
                    if (x == "name" || x == "abbrName") {
                        this.setPropertyCell(sheet, x, keyname,
                            obj[x] != null ? Utils.parse(obj[x]) : "",
                            editable, isnull);
                    } else if (x == "parent") {
                        this.setPropertyCell(sheet, x, keyname,
                            obj[x] != null ? Utils.parse(obj[x].name) : "",
                            editable, isnull);
                    } else if (x == "rank") {
                        this.setPropertyCell(sheet, x, keyname, rank[obj[x]],
                            editable, isnull);
                    } else if (x == "status") {
                        this.setPropertyCell(sheet, x, keyname,
                            validstatus[obj[x]], editable, isnull);
                    } else if (x == "createDate") {
                        this.setPropertyCell(sheet, x, keyname, Utils.getDate(obj[x]),
                            editable, isnull);
                    } else if (x == "lastupdate") {
                        this.setPropertyCell(sheet, x, keyname, Utils.getDateTime(obj[x]),
                            editable, isnull);
                    } else {
                        this.setPropertyCell(sheet, x, keyname, obj[x],
                            editable, isnull);
                    }
                }
            }
        } else if (obj instanceof Position) {
            for (x in obj) {
                if (x == "id" || x == "name" || x == "abbrName" || x == "rank"
                    || x == "createDate" || x == "parent" || x == "status"
                    || x == "lastupdate") {
                    var keyname = "";
                    var editable = "-1";
                    if (x == "id") {
                        keyname = "系统标识";
                        editable = "-1";
                    } else if (x == "name") {
                        keyname = "全称";
                        editable = "nme";
                        isnull = "n";
                    } else if (x == "abbrName") {
                        keyname = "简称";
                        editable = "te";
                        isnull = "n";
                    } else if (x == "rank") {
                        keyname = "等级";
                        editable = "rse";
                        isnull = "n";
                    } else if (x == "createDate") {
                        keyname = "成立日期";
                        editable = "dte";
                    } else if (x == "parent") {
                        keyname = "上级岗位";
                        editable = "-1";
                    } else if (x == "status") {
                        keyname = "状态";
                        editable = "orgstse";
                        isnull = "n";
                    } else if (x == "lastupdate") {
                        keyname = "最后更新";
                        editable = "-1";
                    }
                    if (x == "name" || x == "abbrName") {
                        this.setPropertyCell(sheet, x, keyname,
                            obj[x] != null ? Utils.parse(obj[x]) : "",
                            editable, isnull);
                    } else if (x == "parent") {
                        this.setPropertyCell(sheet, x, keyname,
                            obj[x] != null ? Utils.parse(obj[x].name) : "",
                            editable, isnull);
                    } else if (x == "rank") {
                        this.setPropertyCell(sheet, x, keyname, rank[obj[x]],
                            editable, isnull);
                    } else if (x == "status") {
                        this.setPropertyCell(sheet, x, keyname,
                            validstatus[obj[x]], editable, isnull);
                    } else if (x == "createDate") {
                        this.setPropertyCell(sheet, x, keyname, Utils.getDate(obj[x]),
                            editable, isnull);
                    } else if (x == "lastupdate") {
                        this.setPropertyCell(sheet, x, keyname, Utils.getDateTime(obj[x]),
                            editable, isnull);
                    } else {
                        this.setPropertyCell(sheet, x, keyname, obj[x],
                            editable, isnull);
                    }
                }
            }
        } else if (obj instanceof ProjectRole) {
            for (x in obj) {
                if (x == "id" || x == "name" || x == "abbrName" || x == "rank"
                    || x == "createDate" || x == "parent" || x == "status"
                    || x == "lastupdate") {
                    var keyname = "";
                    var editable = "-1";
                    if (x == "id") {
                        keyname = "系统标识";
                        editable = "-1";
                    } else if (x == "name") {
                        keyname = "全称";
                        editable = "nme";
                        isnull = "n";
                    } else if (x == "abbrName") {
                        keyname = "简称";
                        editable = "te";
                        isnull = "n";
                    } else if (x == "rank") {
                        keyname = "等级";
                        editable = "rse";
                        isnull = "n";
                    } else if (x == "createDate") {
                        keyname = "成立日期";
                        editable = "dte";
                    } else if (x == "parent") {
                        keyname = "上级角色";
                        editable = "-1";
                    } else if (x == "status") {
                        keyname = "状态";
                        editable = "orgstse";
                        isnull = "n";
                    } else if (x == "lastupdate") {
                        keyname = "最后更新";
                        editable = "-1";
                    }
                    if (x == "name" || x == "abbrName") {
                        this.setPropertyCell(sheet, x, keyname,
                            obj[x] != null ? Utils.parse(obj[x]) : "",
                            editable, isnull);
                    } else if (x == "parent") {
                        this.setPropertyCell(sheet, x, keyname,
                            obj[x] != null ? Utils.parse(obj[x].name) : "",
                            editable, isnull);
                    } else if (x == "rank") {
                        this.setPropertyCell(sheet, x, keyname, rank[obj[x]],
                            editable, isnull);
                    } else if (x == "status") {
                        this.setPropertyCell(sheet, x, keyname,
                            validstatus[obj[x]], editable, isnull);
                    } else if (x == "createDate") {
                        this.setPropertyCell(sheet, x, keyname, Utils.getDate(obj[x]),
                            editable, isnull);
                    } else if (x == "lastupdate") {
                        this.setPropertyCell(sheet, x, keyname, Utils.getDateTime(obj[x]),
                            editable, isnull);
                    } else {
                        this.setPropertyCell(sheet, x, keyname, obj[x],
                            editable, isnull);
                    }
                }
            }
        } else if (obj instanceof Staff) {
            for (x in obj) {
                if (x == "user" || x == "professionalTitle" || x == "staffCode"
                    || x == "workPhoneNumber" || x == "workMobileNumber"
                    || x == "workFaxNumber" || x == "workEmail"
                    || x == "officeLocation" || x == "onBoardingDate"
                    || x == "resignDate" || x == "resignDescription"
                    || x == "jobStatus" || x == "workType"
                    || x == "workStatus" || x == "lastupdate") {
                    var keyname = "";
                    var editable = "-1";
                    if (x == "user") {
                        for (y in obj[x]) {
                            if (y == "name" || y == "givenname"
                                || y == "surname" || y == "gender"
                                || y == "birthday" || y == "idType"
                                || y == "idNumber" || y == "address"
                                || y == "postcode" || y == "loginCounting"
                                || y == "registrationDate" || y == "mobile"
                                || y == "bloodType" || y == "email"
                                || y == "lastupdate" || y == "usedName"
                                || y == "age" || y == "weight"
                                || y == "height" || y == "country"
                                || y == "province" || y == "city"
                                || y == "county"
                                || y == "householdAddress"
                                || y == "householdPostcode") {
                                if (y == "name") {
                                    keyname = "用户帐号";
                                    editable = "-1";
                                    isnull = "n";
                                } else if (y == "givenname") {
                                    keyname = "名";
                                    editable = "-1";
                                    isnull = "n";
                                } else if (y == "surname") {
                                    keyname = "姓";
                                    editable = "-1";
                                    isnull = "n";
                                } else if (y == "usedName") {
                                    keyname = "曾用名";
                                    editable = "-1";
                                    isnull = "n";
                                } else if (y == "gender") {
                                    keyname = "性别";
                                    editable = "-1";
                                    isnull = "n";
                                } else if (y == "bloodType") {
                                    keyname = "血型";
                                    editable = "-1";
                                    isnull = "n";
                                } else if (y == "birthday") {
                                    keyname = "生日";
                                    editable = "-1";
                                    isnull = "n";
                                } else if (y == "age") {
                                    keyname = "年龄";
                                    editable = "-1";
                                    isnull = "n";
                                } else if (y == "height") {
                                    keyname = "身高（CM）";
                                    editable = "-1";
                                    isnull = "n";
                                } else if (y == "weight") {
                                    keyname = "体重（Kg）";
                                    editable = "-1";
                                    isnull = "n";
                                } else if (y == "idType") {
                                    keyname = "证件类型";
                                    editable = "-1";
                                    isnull = "n";
                                } else if (y == "idNumber") {
                                    keyname = "证件号";
                                    editable = "-1";
                                    isnull = "n";
                                } else if (y == "householdAddress") {
                                    keyname = "户籍住址";
                                    editable = "-1";
                                    isnull = "n";
                                } else if (y == "householdPostcode") {
                                    keyname = "户籍邮编";
                                    editable = "-1";
                                    isnull = "n";
                                } else if (y == "country") {
                                    keyname = "现居国家";
                                    editable = "-1";
                                    isnull = "n";
                                } else if (y == "province") {
                                    keyname = "现居省区市";
                                    editable = "-1";
                                    isnull = "n";
                                } else if (y == "city") {
                                    keyname = "现居市/区";
                                    editable = "-1";
                                    isnull = "n";
                                } else if (y == "county") {
                                    keyname = "现居区县";
                                    editable = "-1";
                                    isnull = "n";
                                } else if (y == "address") {
                                    keyname = "现居住址";
                                    editable = "-1";
                                    isnull = "n";
                                } else if (y == "postcode") {
                                    keyname = "现居邮编";
                                    editable = "-1";
                                    isnull = "n";
                                } else if (y == "email") {
                                    keyname = "电子邮箱";
                                    editable = "-1";
                                    isnull = "n";
                                } else if (y == "mobile") {
                                    keyname = "手机";
                                    editable = "-1";
                                    isnull = "n";
                                } else if (y == "registrationDate") {
                                    keyname = "注册日期";
                                    editable = "-1";
                                    isnull = "n";
                                } else if (y == "loginCounting") {
                                    keyname = "登录次数";
                                    editable = "-1";
                                    isnull = "n";
                                } else if (y == "lastupdate") {
                                    keyname = "最后更新";
                                    editable = "-1";
                                    isnull = "n";
                                }
                                if (y == "fullName" || y == "address") {
                                    this.setPropertyCell(sheet, y, keyname,
                                        obj[x][y] != null ? Utils
                                            .parse(obj[x][y]) : "",
                                        editable, isnull);
                                } else if (y == "gender") {
                                    this
                                        .setPropertyCell(sheet, y, keyname,
                                            gender[obj[x][y]],
                                            editable, isnull);
                                } else if (y == "idType") {
                                    this
                                        .setPropertyCell(sheet, y, keyname,
                                            idtype[obj[x][y]],
                                            editable, isnull);
                                } else {
                                    this.setPropertyCell(sheet, y, keyname,
                                        obj[x][y], editable, isnull);
                                }
                            }
                        }
                        // Insert a title
                        var row = sheet.insertRow(-1);
                        var cell1 = row.insertCell(0);
                        var cell2 = row.insertCell(1);
                        cell1.innerHTML = "<strong>办公信息</strong>";
                        cell1.setAttribute("nowrap", "true");
                        cell1.setAttribute("key", "");
                        cell1.setAttribute("type", "h");
                        cell2.innerHTML = "";
                        cell2.setAttribute("key", "");
                        cell2.setAttribute("type", "h");
                        cell2.setAttribute("null", "n");
                    } else if (x == "professionalTitle") {
                        keyname = "职称";
                        editable = "-1";
                        isnull = "n";
                    } else if (x == "staffCode") {
                        keyname = "职员编号";
                        editable = "-1";
                        isnull = "n";
                    } else if (x == "workPhoneNumber") {
                        keyname = "办公电话";
                        editable = "-1";
                        isnull = "n";
                    } else if (x == "workMobileNumber") {
                        keyname = "办公手机";
                        editable = "-1";
                        isnull = "n";
                    } else if (x == "workFaxNumber") {
                        keyname = "办公传真";
                        editable = "-1";
                        isnull = "n";
                    } else if (x == "workEmail") {
                        keyname = "办公邮件";
                        editable = "-1";
                        isnull = "n";
                    } else if (x == "officeLocation") {
                        keyname = "办公位置";
                        editable = "-1";
                        isnull = "n";
                    } else if (x == "workType") {
                        keyname = "工作类型";
                        editable = "-1";
                        isnull = "n";
                    } else if (x == "jobStatus") {
                        keyname = "在职状态";
                        editable = "-1";
                        isnull = "n";
                    } else if (x == "onBoardingDate") {
                        keyname = "入职日期";
                        editable = "-1";
                        isnull = "n";
                    } else if (x == "resignDate") {
                        keyname = "离职日期";
                        editable = "-1";
                        isnull = "n";
                    } else if (x == "resignDescription") {
                        keyname = "离职原因";
                        editable = "-1";
                        isnull = "n";
                    } else if (x == "lastupdate") {
                        keyname = "最后更新";
                        editable = "-1";
                        isnull = "n";
                    }
                    // user has been loaded above
                    // status and workStatus don't loading.
                    if (x != "user" && x != "workStatus") {
                        if (x == "officeLocation" || x == "resignDescription") {
                            this.setPropertyCell(sheet, x, keyname,
                                obj[x] != null ? Utils.parse(obj[x]) : "",
                                editable, isnull);
                        } else if (x == "professionalTitle") {
                            this.setPropertyCell(sheet, x, keyname,
                                stafftitle[obj[x]], editable, isnull);
                        } else if (x == "workType") {
                            this.setPropertyCell(sheet, x, keyname,
                                worktype[obj[x]], editable, isnull);
                        } else if (x == "jobStatus") {
                            this.setPropertyCell(sheet, x, keyname,
                                jobstatus[obj[x]], editable, isnull);
                        } else {
                            this.setPropertyCell(sheet, x, keyname, obj[x],
                                editable, isnull);
                        }
                    }
                }
            }
        } else if (obj instanceof AuthorityGroup) { // group
            for (x in obj) {
                if (x == "id" || x == "name" || x == "description"
                    || x == "createDate" || x == "type") {
                    var keyname = "";
                    var editable = "-1";
                    if (x == "id") {
                        keyname = "系统标识";
                        editable = "-1";
                        isnull = "n";
                    } else if (x == "name") {
                        keyname = "权限组名";
                        if (obj.type == 1) {
                            editable = "grouptext";
                        }
                        isnull = "n";
                    } else if (x == "description") {
                        keyname = "权限描述";
                        if (obj.type == 1) {
                            editable = "grouptexta";
                        }
                        isnull = "n";
                    } else if (x == "createDate") {
                        keyname = "创建时间";
                        editable = "-1";
                        isnull = "n";
                    } else if (x == "type") {
                        keyname = "类型";
                        editable = "-1";
                        isnull = "n";
                    }
                    if (x == "name" || x == "description") {
                        this.setPropertyCell(sheet, x, keyname,
                            obj[x] != null ? Utils.parse(obj[x]) : "",
                            editable, isnull);
                    } else if (x == "type") {
                        this.setPropertyCell(sheet, x, keyname,
                            customtype[obj[x]], editable, isnull);
                    } else if (x == "createDate") {
                        this.setPropertyCell(sheet, x, keyname,
                            Utils.getDateTime(new Date(obj[x]).getTime()), editable, isnull);
                    } else {
                        this.setPropertyCell(sheet, x, keyname, obj[x],
                            editable, isnull);
                    }
                }
            }
        } else if (obj instanceof HomePageTemplate) {
            for (x in obj) {
                if (x == "id" || x == "organization" || x == "orgTitle"
                    || x == "skin" || x == "imgURL" || x == "lastupdate"
                    || x == "createdate") {
                    var keyname = "";
                    var editable = "-1";
                    if (x == "id") {
                        keyname = "系统标识";
                        editable = "-1";
                        isnull = "n";
                    } else if (x == "organization") {
                        keyname = "组织标识";
                        editable = "-1";
                        isnull = "n";
                    } else if (x == "orgTitle") {
                        keyname = "公司标题";
                        editable = "otitle";
                        isnull = "n";
                    } else if (x == "skin") {
                        keyname = "皮肤类型";
                        editable = "oskin";
                        isnull = "n";
                    } else if (x == "imgURL") {
                        keyname = "图片地址";
                        editable = "surl";
                        isnull = "n";
                    } else if (x == "lastupdate") {
                        keyname = "修改时间";
                        editable = "-1";
                        isnull = "n";
                    } else if (x == "createdate") {
                        keyname = "创建时间";
                        editable = "-1";
                        isnull = "n";
                    }

                    if (x == "id" || x == "organization") {
                        this.setPropertyCell(sheet, x, keyname,
                            obj[x] != null ? Utils.parse(obj[x]) : "",
                            editable, isnull);
                    } else if (x == "createdate") {
                        this.setPropertyCell(sheet, x, keyname,
                            obj[x] != null ? Utils.getDate(obj[x]) : "",
                            editable, isnull);
                    } else if (x == "lastupdate") {
                        this
                            .setPropertyCell(sheet, x, keyname,
                                obj[x] != null ? Utils
                                    .getDateTime(obj[x]) : "",
                                editable, isnull);
                    } else {
                        this.setPropertyCell(sheet, x, keyname, obj[x],
                            editable, isnull);
                    }
                }
            }
        } else if (obj instanceof MbButton) {
            for (x in obj) {
                if (x == "id" || x == "name" || x == "fontsize"
                    || x == "fontfamilty" || x == "fontWeight" || x == "lastupdate"
                    || x == "createDateTime" || x == "frontgroundColor" || x == "backgroundColor") {
                    var keyname = "";
                    var editable = "-1";
                    if (x == "id") {
                        keyname = "系统标识";
                        editable = "-1";
                        isnull = "n";
                    } else if (x == "name") {
                        keyname = "按钮标题";
                        editable = "btnme";
                        isnull = "n";
                    } else if (x == "fontfamilty") {
                        keyname = "字体名称";
                        editable = "ff";
                        isnull = "n";
                    } else if (x == "fontsize") {
                        keyname = "字体大小";
                        editable = "fsz";
                        isnull = "n";
                    } else if (x == "fontWeight") {
                        keyname = "字体风格";
                        editable = "fw";
                        isnull = "n";
                    } else if (x == "frontgroundColor") {
                        keyname = "前景色";
                        editable = "fc";
                        isnull = "n";
                    } else if (x == "backgroundColor") {
                        keyname = "背景色";
                        editable = "bc";
                        isnull = "n";
                    } else if (x == "createDateTime") {
                        keyname = "创建时间";
                        editable = "-1";
                        isnull = "n";
                    } else if (x == "lastupdate") {
                        keyname = "修改时间";
                        editable = "-1";
                        isnull = "n";
                    }
                    if (x == "id" || x == "name") {
                        this.setPropertyCell(sheet, x, keyname,
                            obj[x] != null ? Utils.parse(obj[x]) : "", editable, isnull);
                    } else if (x == "fontfamilty") {
                        this.setPropertyCell(sheet, x, keyname, fontfamilies[obj[x]], editable, isnull);
                    } else if (x == "fontsize") {
                        this.setPropertyCell(sheet, x, keyname, fontsizes[obj[x]], editable, isnull);
                    } else if (x == "fontWeight") {
                        this.setPropertyCell(sheet, x, keyname, fontweights[obj[x]], editable, isnull);
                    } else if (x == "lastupdate" || x == "createDateTime") {
                        this.setPropertyCell(sheet, x, keyname,
                            obj[x] != null ? Utils.getDateTime(obj[x]) : "", editable, isnull);
                    } else {
                        this.setPropertyCell(sheet, x, keyname, obj[x], editable, isnull);
                    }
                }
            }
        } else if (obj instanceof PCDesktopIcon) {
            for (x in obj) {
                if (x == "id" || x == "title" ||
                    x == "height" || x == "tip") {
                    var keyname = "";
                    var editable = "-1";
                    if (x == "id") {
                        keyname = "系统标识";
                        editable = "-1";
                        isnull = "n";
                    } else if (x == "title") {
                        keyname = "图标名称";
                        editable = "dticon";
                        isnull = "n";
                    } else if (x == "height") {
                        keyname = "图标高度";
                        editable = "dthigh";
                        isnull = "n";
                    } else if (x == "tip") {
                        keyname = "图标提示";
                        editable = "dttip";
                        isnull = "n";
                    }
                    if (x == "id" || x == "title" || x == "tip") {
                        this.setPropertyCell(sheet, x, keyname,
                            obj[x] != null ? Utils.parse(obj[x]) : "", editable, isnull);
                    } else {
                        this.setPropertyCell(sheet, x, keyname, obj[x], editable, isnull);
                    }
                }
            }
        } else {
            this.initSheet(this.options);
        }
    };

    BasicPropertySheet.prototype.setPropertyCell = function (table, key,
                                                             keydesc, keyvalue, editable, isnull) {
        var row = table.insertRow(-1);
        row.addEventListener("click", this, false);
        row.addEventListener("dblclick", this, false);
        var cell1 = row.insertCell(0);
        var cell2 = row.insertCell(1);
        $(cell1).text(keydesc);
        // cell1.innerHTML = keydesc;
        cell1.setAttribute("nowrap", "true");
        cell1.setAttribute("key", key);
        cell1.setAttribute("type", "h");
        $(cell2).text(keyvalue);
        // cell2.innerHTML = keyvalue;
        cell2.setAttribute("key", key);
        cell2.setAttribute("type", editable);
        cell2.setAttribute("null", isnull);
    };

    BasicPropertySheet.prototype.handleEvent = function (e) {
        switch (e.type) {
            case "click":
                this.doClick(e);
                break;
            case "dblclick":
                this.doDblClick(e);
                break;
        }
    };

    BasicPropertySheet.prototype.doDblClick = function (evt) {
        if (evt.target.tagName == "TD") {
            this.propertysheet.focus();
            this.startToEdit(evt.target);
        }
    };

    BasicPropertySheet.prototype.startToEdit = function (tag) {
        var t = tag.getAttribute("type");
        if (t == "te") {
            this.editor.loadEditor(tag, this.entity, tag.getAttribute("key"),
                tag.getAttribute("null"));
        } else if (t == "dte") {
            this.editor5.loadEditor(tag, this.entity, tag.getAttribute("key"),
                tag.getAttribute("null"));
        } else if (t == "bcse") {
            this.editor6.loadEditor(tag, this.entity, tag.getAttribute("key"),
                tag.getAttribute("null"));
        } else if (t == "bcdse") {
            this.editor7.loadEditor(tag, this.entity, tag.getAttribute("key"),
                tag.getAttribute("null"));
        } else if (t == "rse") {
            this.editor8.loadEditor(tag, this.entity, tag.getAttribute("key"),
                tag.getAttribute("null"));
        } else if (t == "tae") {
            this.editor3.loadEditor(tag, this.entity, tag.getAttribute("key"),
                tag.getAttribute("null"));
        } else if (t == "ee") {
            this.editor4.loadEditor(tag, this.entity, tag.getAttribute("key"),
                tag.getAttribute("null"));
        } else if (t == "phe") {
            this.editor10.loadEditor(tag, this.entity, tag.getAttribute("key"),
                tag.getAttribute("null"));
        } else if (t == "ne") {
            this.editor2.loadEditor(tag, this.entity, tag.getAttribute("key"),
                tag.getAttribute("null"));
        } else if (t == "scse") {
            this.editor9.loadEditor(tag, this.entity, tag.getAttribute("key"),
                tag.getAttribute("null"));
        } else if (t == "orgstse") {
            this.editor12.loadEditor(tag, this.entity, tag.getAttribute("key"),
                tag.getAttribute("null"));
        } else if (t == "ynse") {
            this.editor11.loadEditor(tag, this.entity, tag.getAttribute("key"),
                tag.getAttribute("null"));
        } else if (t == "nme") {
            this.editor13.loadEditor(tag, this.entity, tag.getAttribute("key"),
                tag.getAttribute("null"));
        } else if (t == "webe") {
            this.editor14.loadEditor(tag, this.entity, tag.getAttribute("key"),
                tag.getAttribute("null"));
        } else if (t == "givenname") { // user command
            this.editor15.loadEditor(this.tabId, tag, this.entity, tag
                .getAttribute("key"), tag.getAttribute("null"));
        } else if (t == "surname") { // user command
            this.editor15.loadEditor(this.tabId, tag, this.entity, tag
                .getAttribute("key"), tag.getAttribute("null"));
        } else if (t == "gender") { // user command
            this.editor16.loadEditor(this.tabId, tag, this.entity, tag
                .getAttribute("key"), tag.getAttribute("null"));
        } else if (t == "dob") { // user command
            this.editor17.loadEditor(this.tabId, tag, this.entity, tag
                .getAttribute("key"), tag.getAttribute("null"));
        } else if (t == "idtype") { // user command
            this.editor18.loadEditor(this.tabId, tag, this.entity, tag
                .getAttribute("key"), tag.getAttribute("null"));
        } else if (t == "idnumber") { // user command
            this.editor181.loadEditor(this.tabId, tag, this.entity, tag
                .getAttribute("key"), tag.getAttribute("null"));
        } else if (t == "textprop") { // user command
            this.editor19.loadEditor(this.tabId, tag, this.entity, tag
                .getAttribute("key"), tag.getAttribute("null"));
        } else if (t == "numprop") { // user command
            this.editor20.loadEditor(this.tabId, tag, this.entity, tag
                .getAttribute("key"), tag.getAttribute("null"));
        } else if (t == "texta") { // user command
            this.editor21.loadEditor(this.tabId, tag, this.entity, tag
                .getAttribute("key"), tag.getAttribute("null"));
        } else if (t == "staffselect") { // staff command
            this.editor22.loadEditor(this.tabId, tag, this.entity, tag
                .getAttribute("key"), tag.getAttribute("null"));
        } else if (t == "stafftext") { // staff command
            this.editor23.loadEditor(this.tabId, tag, this.entity, tag
                .getAttribute("key"), tag.getAttribute("null"));
        } else if (t == "staffphn") { // staff command
            this.editor24.loadEditor(this.tabId, tag, this.entity, tag
                .getAttribute("key"), tag.getAttribute("null"));
        } else if (t == "staffdate") { // staff command
            this.editor25.loadEditor(this.tabId, tag, this.entity, tag
                .getAttribute("key"), tag.getAttribute("null"));
        } else if (t == "stafftexta") { // staff command
            this.editor26.loadEditor(this.tabId, tag, this.entity, tag
                .getAttribute("key"), tag.getAttribute("null"));
        } else if (t == "grouptext") { // group command
            this.editor27.loadEditor(this.tabId, tag, this.entity, tag
                .getAttribute("key"), tag.getAttribute("null"));
        } else if (t == "grouptexta") { // group command
            this.editor28.loadEditor(this.tabId, tag, this.entity, tag
                .getAttribute("key"), tag.getAttribute("null"));
        } else if (t == "otitle") { // home page command
            this.editor29.loadEditor(tag, this.entity, tag.getAttribute("key"),
                tag.getAttribute("null"));
        } else if (t == "oskin") {
            this.editor30.loadEditor(tag, this.entity, tag.getAttribute("key"),
                tag.getAttribute("null"));
        } else if (t == "btnme") {
            this.editor31.loadEditor(tag, this.entity, tag.getAttribute("key"),
                tag.getAttribute("null"), this.owner.currOwner);
        } else if (t == "ff") {
            this.editor32.loadEditor(tag, this.entity, tag.getAttribute("key"),
                tag.getAttribute("null"), this.owner.currOwner);
        } else if (t == "fsz") {
            this.editor33.loadEditor(tag, this.entity, tag.getAttribute("key"),
                tag.getAttribute("null"), this.owner.currOwner);
        } else if (t == "fw") {
            this.editor34.loadEditor(tag, this.entity, tag.getAttribute("key"),
                tag.getAttribute("null"), this.owner.currOwner);
        } else if (t == "fc") {
            this.editor35.loadEditor(tag, this.entity, tag.getAttribute("key"),
                tag.getAttribute("null"), this.owner.currOwner);
        } else if (t == "bc") {
            this.editor35.loadEditor(tag, this.entity, tag.getAttribute("key"),
                tag.getAttribute("null"), this.owner.currOwner);
        } else if (t == "dticon") {
            this.editor36.loadEditor(this.owner.cateId, tag, this.entity, tag
                .getAttribute("key"), tag.getAttribute("null"));
        } else if (t == "dttip") {
            this.editor36.loadEditor(this.owner.cateId, tag, this.entity, tag
                .getAttribute("key"), tag.getAttribute("null"));
        } else if (t == "dthigh") {
            this.editor37.loadEditor(this.owner.cateId, tag, this.entity, tag
                .getAttribute("key"), tag.getAttribute("null"));
        }
    };

    BasicPropertySheet.prototype.doClick = function (evt) {
        if (evt.target.tagName == "TD") {
            var table = evt.target.parentElement.parentElement;
            this.clearSelection(table);
            evt.target.parentElement.style.background = "#d1d1e0";
        }
    };

    BasicPropertySheet.prototype.clearSelection = function (table) {
        if (table.rows.length > 0) {
            for (var i = 0; i < table.rows.length; i++) {
                table.rows[i].style.background = "";
                // console.log("红色");
            }
        }
    };

    $.fn[pluginName] = function (options) {
        return this
            .each(function () {
                if (!$.data(this, pluginName)) {
                    $.data(this, pluginName, new BasicPropertySheet(this,
                        options));
                } else if ($.isFunction(Plugin.prototype[options])) {
                    $.data(this, pluginName)[options]();
                }
            });
    };

})(jQuery, window, document);