/**
 *
 */

;
(function ($, window, document, undefined) {
    var pluginName = "basicPropertySheet";
    var defaults = {
        prop: "",
        topparent: "",
    };

    var BasicPropertySheet = function (element, options) {
        this.element = element;
        this.options = $.extend({
            prop: "",
            topparent: "",
        }, defaults, options);
        this._defaults = defaults;
        this._name = pluginName;
        this.topparent;
        this.propertysheet;
        this.entity = null;
        this.routeorderpane;
        this.init(options);
        this.clearSheet();
        this.initSheet();
    };

    BasicPropertySheet.prototype.init = function (options) {
        this.topparent = options.topparent;
        var panelDiv = document.createElement("DIV");
        this.element.appendChild(panelDiv);
        panelDiv.className = "panel panel-default";

        var header = document.createElement("DIV");
        panelDiv.appendChild(header);
        header.className = "panel-heading";
        header.innerHTML = "基本属性";

        var tableDiv = document.createElement("DIV");
        panelDiv.appendChild(tableDiv);
        tableDiv.className = "table-responsive";
        tableDiv.style.overflowY = "auto";
        tableDiv.style.overflowX = "auto";
        tableDiv.id = "basicpropertysheet";

        this.propertysheet = document.createElement("table");
        tableDiv.appendChild(this.propertysheet);
        this.propertysheet.id = "propertysheet";
        this.propertysheet.className = "table table-striped table-hover";

        // general message dialog plugin
        var p3 = $(options.topparent).messageDialog({
            id: "0161",
            title: vendor + " - 提示",
            parent: this,
        });
        this.messageDialog = p3.data("messageDialog");

        var plugin0 = $(this.propertysheet).formNameCellEditor({
            parent: this,
            msg: this.messageDialog,
        });
        this.editor0 = plugin0.data("formNameCellEditor");

        var plugin1 = $(this.propertysheet).textCellEditor({
            parent: this,
            msg: this.messageDialog,
        });
        this.editor1 = plugin1.data("textCellEditor");

        var plugin2 = $(this.propertysheet).textareaCellEditor({
            parent: this,
            msg: this.messageDialog,
        });
        this.editor2 = plugin2.data("textareaCellEditor");

        var plugin3 = $(this.propertysheet).imageShapeCellEditor({
            parent: this,
            msg: this.messageDialog,
        });
        this.editor3 = plugin3.data("imageShapeCellEditor");

        var plugin4 = $(this.propertysheet).selectListCellEditor({
            parent: this,
            msg: this.messageDialog,
        });
        this.editor4 = plugin4.data("selectListCellEditor");

        var plugin5 = $(this.propertysheet).yesnoCellEditor({
            parent: this,
            msg: this.messageDialog,
        });
        this.editor5 = plugin5.data("yesnoCellEditor");

        var plugin6 = $(this.propertysheet).numberCellEditor({
            parent: this,
            msg: this.messageDialog,
        });
        this.editor6 = plugin6.data("numberCellEditor");

        var plugin7 = $(this.propertysheet).priceCellEditor({
            parent: this,
            msg: this.messageDialog,
        });
        this.editor7 = plugin7.data("priceCellEditor");

        var plugin8 = $(this.propertysheet).referenceNameCellEditor({
            parent: this,
            msg: this.messageDialog,
        });
        this.editor8 = plugin8.data("referenceNameCellEditor");

        var plugin9 = $(this.propertysheet).trialPeriodSelectCellEditor({
            parent: this,
            msg: this.messageDialog,
        });
        this.editor9 = plugin9.data("trialPeriodSelectCellEditor");
    };

    BasicPropertySheet.prototype.initSheet = function (options) {
        for (i = 0; i < 20; i++) {
            var row = this.propertysheet.insertRow(-1);
            var cell1 = row.insertCell(0);
            cell1.innerHTML = "&nbsp;";
        }
    };

    BasicPropertySheet.prototype.clearSheet = function (options) {
        $(this.propertysheet).children().remove();
    };

    BasicPropertySheet.prototype.setSheet = function (obj, owner) {
        this.entity = obj;
        this.owner = owner;
        this.clearSheet();
        var sheet = this.propertysheet;
        if (obj instanceof Form) {
            for (x in obj) {
                if (x == "id" || x == "name" || x == "code" || x == "status"
                    || x == "description" || x == "keywords"
                    || x == "author" || x == "createDatetime"
                    || x == "lastupdate" || x == "parent"
                    || x == "owner" || x == "classtypename"
                    || x == "serviceType") {
                    var editable = "-1";
                    var keyname = "";
                    var isnull = "y";
                    if (x == "id") {
                        keyname = "表单标识";
                        editable = "-1";
                        isnull = "n";
                    } else if (x == "code") {
                        keyname = "表单编码";
                        editable = "-1";
                        isnull = "n";
                    } else if (x == "name") {
                        keyname = "表单名称";
                        editable = "fnme";
                        isnull = "n";
                    } else if (x == "status") {
                        keyname = "状态";
                        editable = "-1";
                        isnull = "n";
                    } else if (x == "author") {
                        keyname = "设计人";
                        editable = "nme";
                        isnull = "n";
                    } else if (x == "keywords") {
                        keyname = "关键字";
                        editable = "kw";
                        isnull = "n";
                    } else if (x == "serviceType") {
                        keyname = "服务类型";
                        editable = "-1";
                        isnull = "n";
                    } else if (x == "description") {
                        keyname = "表单简介";
                        editable = "desc";
                        isnull = "y";
                    } else if (x == "purchasePrice") {
                        keyname = "销售价（￥）";
                        editable = "pp";
                        isnull = "n";
                    } else if (x == "usagePrice") {
                        keyname = "租用价（￥）";
                        editable = "up";
                        isnull = "n";
                    } else if (x == "createDatetime") {
                        keyname = "创建时间";
                        editable = "-1";
                        isnull = "n";
                    } else if (x == "lastupdate") {
                        keyname = "最后更新";
                        editable = "-1";
                        isnull = "n";
                    } else if (x == "parent") {
                        keyname = "文件夹";
                        editable = "-1";
                        isnull = "n";
                    } else if (x == "owner") {
                        keyname = "所有人";
                        editable = "-1";
                        isnull = "n";
                    } else if (x == "classtypename") {
                        keyname = "组件类型";
                        editable = "-1";
                        isnull = "n";
                    }
                    if (x == "name" || x == "author" || x == "keywords"
                        || x == "description") {
                        this.setPropertyCell(sheet, x, keyname,
                            obj[x] != null ? Utils.parse(obj[x]) : "",
                            editable, isnull);
                    } else if (x == "status") {
                        this.setPropertyCell(sheet, x, keyname,
                            lockstatus[obj[x]], editable, isnull);
                    } else if (x == "serviceType") {
                        this.setPropertyCell(sheet, x, keyname,
                            servicetype[obj[x]], editable, isnull);
                    } else if (x == "parent") {
                        var p = $('#treeview').jstree('get_node', obj[x]);
                        this.setPropertyCell(sheet, x, keyname, p.text,
                            editable, isnull);
                    } else if (x == "owner") {
                        var p = $('#treeview').jstree('get_node', obj[x]);
                        this.setPropertyCell(sheet, x, keyname, p.text,
                            editable, isnull);
                    } else if (x == "lastupdate" || x == "createDatetime") {
                        this.setPropertyCell(sheet, x, keyname, Utils.getDateTime(obj[x]),
                            editable, isnull);
                    } else if (x == "classtypename") {
                        this.setPropertyCell(sheet, x, keyname, formcomponenttype[obj[x]],
                            editable, isnull);
                    } else {
                        this.setPropertyCell(sheet, x, keyname, obj[x],
                            editable, isnull);
                    }
                }
            }
        } else if (obj instanceof ReleasedForm) {
            for (x in obj) {
                if (x == "id" || x == "name" || x == "code" || x == "status"
                    || x == "description" || x == "keywords"
                    || x == "author" || x == "createDatetime"
                    || x == "lastupdate" || x == "parent" || x == "owner"
                    || x == "version" || x == "releaser"
                    || x == "releaseStatement" || x == "releaseDate"
                    || x == "deprecated" || x == "likeCounting"
                    || x == "totalUseCounting" || x == "successCounting"
                    || x == "trialPeriod" || x == "totalDownloading"
                    || x == "classtypename" || x == "serviceType") {
                    var editable = "-1";
                    var keyname = "";
                    var isnull = "y";
                    if (x == "id") {
                        keyname = "表单标识";
                        editable = "-1";
                        isnull = "n";
                    } else if (x == "code") {
                        keyname = "表单编码";
                        editable = "-1";
                        isnull = "n";
                    } else if (x == "name") {
                        keyname = "表单名称";
                        editable = "fnme";
                        isnull = "n";
                    } else if (x == "status") {
                        keyname = "状态";
                        editable = "-1";
                        isnull = "n";
                    } else if (x == "author") {
                        keyname = "设计人";
                        editable = "-1";
                        isnull = "n";
                    } else if (x == "keywords") {
                        keyname = "关键字";
                        editable = "-1";
                        isnull = "n";
                    } else if (x == "serviceType") {
                        keyname = "服务类型";
                        editable = "-1";
                        isnull = "n";
                    } else if (x == "description") {
                        keyname = "表单简介";
                        editable = "-1";
                        isnull = "y";
                    } else if (x == "purchasePrice") {
                        keyname = "销售价（￥）";
                        editable = "pp";
                        isnull = "n";
                    } else if (x == "usagePrice") {
                        keyname = "租用价（￥）";
                        editable = "up";
                        isnull = "n";
                    } else if (x == "createDatetime") {
                        keyname = "创建时间";
                        editable = "-1";
                        isnull = "n";
                    } else if (x == "lastupdate") {
                        keyname = "最后更新";
                        editable = "-1";
                        isnull = "n";
                    } else if (x == "parent") {
                        keyname = "文件夹";
                        editable = "-1";
                        isnull = "n";
                    } else if (x == "owner") {
                        keyname = "所有人";
                        editable = "-1";
                        isnull = "n";
                    } else if (x == "version") {
                        keyname = "版本";
                        editable = "nme";
                        isnull = "n";
                    } else if (x == "releaser") {
                        keyname = "发布人";
                        editable = "nme";
                        isnull = "n";
                    } else if (x == "releaseStatement") {
                        keyname = "发布声明";
                        editable = "state";
                        isnull = "n";
                    } else if (x == "releaseDate") {
                        keyname = "发布日期";
                        editable = "-1";
                        isnull = "n";
                    } else if (x == "deprecated") {
                        keyname = "在线状态";
                        editable = "-1";
                        isnull = "n";
                    } else if (x == "likeCounting") {
                        keyname = "点赞人数";
                        isnull = "n";
                    } else if (x == "totalDownloading") {
                        keyname = "下载总计";
                        isnull = "n";
                    } else if (x == "totalUseCounting") {
                        keyname = "使用总计";
                        isnull = "n";
                    } else if (x == "successCounting") {
                        keyname = "成功总计";
                        isnull = "n";
                    } else if (x == "trialPeriod") {
                        keyname = "试用期";
                        editable = "tri";
                        isnull = "n";
                    } else if (x == "classtypename") {
                        keyname = "组件类型";
                        editable = "-1";
                        isnull = "n";
                    }
                    if (x == "name" || x == "author" || x == "keywords"
                        || x == "description") {
                        this.setPropertyCell(sheet, x, keyname,
                            obj[x] != null ? Utils.parse(obj[x]) : "",
                            editable, isnull);
                    } else if (x == "status") {
                        this.setPropertyCell(sheet, x, keyname,
                            lockstatus[obj[x]], editable, isnull);
                    } else if (x == "serviceType") {
                        this.setPropertyCell(sheet, x, keyname,
                            servicetype[obj[x]], editable, isnull);
                    } else if (x == "trialPeriod") {
                        this.setPropertyCell(sheet, x, keyname,
                            trialperiod[obj[x]], editable, isnull);
                    } else if (x == "deprecated") {
                        this.setPropertyCell(sheet, x, keyname,
                            pfonlinestatus[obj[x]], editable, isnull);
                    } else if (x == "parent") {
                        var p = $('#treeview').jstree('get_node', obj[x]);
                        this.setPropertyCell(sheet, x, keyname, p.text,
                            editable, isnull);
                    } else if (x == "owner") {
                        var p = $('#treeview').jstree('get_node', obj[x]);
                        this.setPropertyCell(sheet, x, keyname, p.text,
                            editable, isnull);
                    } else if (x == "lastupdate" || x == "createDatetime"
                        || x == "releaseDate") {
                        this.setPropertyCell(sheet, x, keyname, Utils.getDateTime(obj[x]),
                            editable, isnull);
                    } else if (x == "classtypename") {
                        this.setPropertyCell(sheet, x, keyname, formcomponenttype[obj[x]],
                            editable, isnull);
                    } else {
                        this.setPropertyCell(sheet, x, keyname, obj[x],
                            editable, isnull);
                    }
                }
            }
        } else if (obj instanceof SingleLineText) {
            for (x in obj) {
                if (x == "id" || x == "title" || x == "placeholder"
                    || x == "help" || x == "required" || x == "tabIndex"
                    || x == "readOnly" || x == "disabled" || x == "hidden"
                    || x == "maxLengh" || x == "classtypename") {
                    var editable = "-1";
                    var keyname = "";
                    var isnull = "y";
                    if (x == "id") {
                        keyname = "标识";
                        editable = "-1";
                        isnull = "n";
                    } else if (x == "title") {
                        keyname = "标签";
                        if (!(this.owner instanceof ReleasedForm)) {
                            editable = "title";
                        }
                        isnull = "n";
                    } else if (x == "placeholder") {
                        keyname = "输入描述";
                        if (!(this.owner instanceof ReleasedForm)) {
                            editable = "plher";
                        }
                        isnull = "y";
                    } else if (x == "help") {
                        keyname = "帮助指南";
                        if (!(this.owner instanceof ReleasedForm)) {
                            editable = "hlp";
                        }
                        isnull = "y";
                    } else if (x == "required") {
                        keyname = "可为空";
                        if (!(this.owner instanceof ReleasedForm)) {
                            editable = "rqd";
                        }
                        isnull = "n";
                    } else if (x == "tabIndex") {
                        keyname = "跳转顺序";
                        if (!(this.owner instanceof ReleasedForm)) {
                            editable = "tab";
                        }
                        isnull = "n";
                    } else if (x == "maxLengh") {
                        keyname = "最大长度";
                        if (!(this.owner instanceof ReleasedForm)) {
                            editable = "maxl";
                        }
                        isnull = "n";
                    } else if (x == "readOnly") {
                        keyname = "只读";
                        if (!(this.owner instanceof ReleasedForm)) {
                            editable = "roly";
                        }
                        isnull = "n";
                    } else if (x == "disabled") {
                        keyname = "置灰";
                        if (!(this.owner instanceof ReleasedForm)) {
                            editable = "disbl";
                        }
                        isnull = "n";
                    } else if (x == "hidden") {
                        keyname = "不显示";
                        if (!(this.owner instanceof ReleasedForm)) {
                            editable = "hidn";
                        }
                        isnull = "n";
                    } else if (x == "classtypename") {
                        keyname = "组件类型";
                        editable = "-1";
                        isnull = "n";
                    }
                    if (x == "title" || x == "placeholder" || x == "help") {
                        this.setPropertyCell(sheet, x, keyname,
                            obj[x] != null ? Utils.parse(obj[x]) : "",
                            editable, isnull);
                    } else if (x == "required" || x == "readOnly"
                        || x == "disabled" || x == "hidden") {
                        this.setPropertyCell(sheet, x, keyname, yesno[obj[x]],
                            editable, isnull);
                    } else if (x == "classtypename") {
                        this.setPropertyCell(sheet, x, keyname, formcomponenttype[obj[x]],
                            editable, isnull);
                    } else {
                        this.setPropertyCell(sheet, x, keyname, obj[x],
                            editable, isnull);
                    }
                }
            }
        } else if (obj instanceof SingleSelect) {
            for (x in obj) {
                if (x == "id" || x == "title" || x == "help" || x == "required"
                    || x == "tabIndex" || x == "disabled" || x == "readOnly"
                    || x == "hidden" || x == "classtypename") {
                    var editable = "-1";
                    var keyname = "";
                    var isnull = "y";
                    if (x == "id") {
                        keyname = "标识";
                        editable = "-1";
                        isnull = "n";
                    } else if (x == "title") {
                        keyname = "标签";
                        if (!(this.owner instanceof ReleasedForm)) {
                            editable = "title";
                        }
                        isnull = "n";
                    } else if (x == "help") {
                        keyname = "帮助指南";
                        if (!(this.owner instanceof ReleasedForm)) {
                            editable = "hlp";
                        }
                        isnull = "y";
                    } else if (x == "required") {
                        keyname = "可为空";
                        if (!(this.owner instanceof ReleasedForm)) {
                            editable = "rqd";
                        }
                        isnull = "n";
                    } else if (x == "tabIndex") {
                        keyname = "跳转顺序";
                        if (!(this.owner instanceof ReleasedForm)) {
                            editable = "tab";
                        }
                        isnull = "n";
                    } else if (x == "readOnly") {
                        keyname = "只读";
                        if (!(this.owner instanceof ReleasedForm)) {
                            editable = "roly";
                        }
                        isnull = "n";
                    } else if (x == "disabled") {
                        keyname = "置灰";
                        if (!(this.owner instanceof ReleasedForm)) {
                            editable = "disbl";
                        }
                        isnull = "n";
                    } else if (x == "hidden") {
                        keyname = "不显示";
                        if (!(this.owner instanceof ReleasedForm)) {
                            editable = "hidn";
                        }
                        isnull = "n";
                    } else if (x == "classtypename") {
                        keyname = "组件类型";
                        editable = "-1";
                        isnull = "n";
                    }
                    if (x == "title" || x == "help") {
                        this.setPropertyCell(sheet, x, keyname,
                            obj[x] != null ? Utils.parse(obj[x]) : "",
                            editable, isnull);
                    } else if (x == "required" || x == "readOnly"
                        || x == "disabled" || x == "hidden") {
                        this.setPropertyCell(sheet, x, keyname, yesno[obj[x]],
                            editable, isnull);
                    } else if (x == "classtypename") {
                        this.setPropertyCell(sheet, x, keyname, formcomponenttype[obj[x]],
                            editable, isnull);
                    } else {
                        this.setPropertyCell(sheet, x, keyname, obj[x],
                            editable, isnull);
                    }
                }
            }
        } else if (obj instanceof MultipleLineText) {
            for (x in obj) {
                if (x == "id" || x == "title" || x == "help" || x == "required"
                    || x == "tabIndex" || x == "readOnly"
                    || x == "disabled" || x == "hidden" || x == "maxLengh"
                    || x == "rows" || x == "classtypename") {
                    var editable = "-1";
                    var keyname = "";
                    var isnull = "y";
                    if (x == "id") {
                        keyname = "标识";
                        editable = "-1";
                        isnull = "n";
                    } else if (x == "title") {
                        keyname = "标签";
                        if (!(this.owner instanceof ReleasedForm)) {
                            editable = "title";
                        }
                        isnull = "n";
                    } else if (x == "help") {
                        keyname = "帮助指南";
                        if (!(this.owner instanceof ReleasedForm)) {
                            editable = "hlp";
                        }
                        isnull = "y";
                    } else if (x == "required") {
                        keyname = "可为空";
                        if (!(this.owner instanceof ReleasedForm)) {
                            editable = "rqd";
                        }
                        isnull = "n";
                    } else if (x == "tabIndex") {
                        keyname = "跳转顺序";
                        if (!(this.owner instanceof ReleasedForm)) {
                            editable = "tab";
                        }
                        isnull = "n";
                    } else if (x == "rows") {
                        keyname = "高度";
                        if (!(this.owner instanceof ReleasedForm)) {
                            editable = "rws";
                        }
                        isnull = "n";
                    } else if (x == "maxLengh") {
                        keyname = "最大长度";
                        if (!(this.owner instanceof ReleasedForm)) {
                            editable = "maxl";
                        }
                        isnull = "n";
                    } else if (x == "readOnly") {
                        keyname = "只读";
                        if (!(this.owner instanceof ReleasedForm)) {
                            editable = "roly";
                        }
                        isnull = "n";
                    } else if (x == "disabled") {
                        keyname = "置灰";
                        if (!(this.owner instanceof ReleasedForm)) {
                            editable = "disbl";
                        }
                        isnull = "n";
                    } else if (x == "hidden") {
                        keyname = "不显示";
                        if (!(this.owner instanceof ReleasedForm)) {
                            editable = "hidn";
                        }
                        isnull = "n";
                    } else if (x == "classtypename") {
                        keyname = "组件类型";
                        editable = "-1";
                        isnull = "n";
                    }
                    if (x == "title" || x == "help") {
                        this.setPropertyCell(sheet, x, keyname,
                            obj[x] != null ? Utils.parse(obj[x]) : "",
                            editable, isnull);
                    } else if (x == "required" || x == "readOnly"
                        || x == "disabled" || x == "hidden") {
                        this.setPropertyCell(sheet, x, keyname, yesno[obj[x]],
                            editable, isnull);
                    } else if (x == "classtypename") {
                        this.setPropertyCell(sheet, x, keyname, formcomponenttype[obj[x]],
                            editable, isnull);
                    } else {
                        this.setPropertyCell(sheet, x, keyname, obj[x],
                            editable, isnull);
                    }
                }
            }
        } else if (obj instanceof CheckBoxes) {
            for (x in obj) {
                if (x == "id" || x == "title" || x == "help" || x == "required"
                    || x == "tabIndex" || x == "inline" || x == "hidden" || x == "readOnly"
                    || x == "disabled" || x == "classtypename") {
                    var editable = "-1";
                    var keyname = "";
                    var isnull = "y";
                    if (x == "id") {
                        keyname = "标识";
                        editable = "-1";
                        isnull = "n";
                    } else if (x == "title") {
                        keyname = "标签";
                        if (!(this.owner instanceof ReleasedForm)) {
                            editable = "title";
                        }
                        isnull = "y";
                    } else if (x == "help") {
                        keyname = "帮助指南";
                        if (!(this.owner instanceof ReleasedForm)) {
                            editable = "hlp";
                        }
                        isnull = "y";
                    } else if (x == "required") {
                        keyname = "可为空";
                        if (!(this.owner instanceof ReleasedForm)) {
                            editable = "rqd";
                        }
                        isnull = "n";
                    } else if (x == "readOnly") {
                        keyname = "只读";
                        if (!(this.owner instanceof ReleasedForm)) {
                            editable = "roly";
                        }
                        isnull = "n";
                    } else if (x == "disabled") {
                        keyname = "置灰";
                        if (!(this.owner instanceof ReleasedForm)) {
                            editable = "disbl";
                        }
                        isnull = "n";
                    } else if (x == "tabIndex") {
                        keyname = "跳转顺序";
                        if (!(this.owner instanceof ReleasedForm)) {
                            editable = "tab";
                        }
                        isnull = "n";
                    } else if (x == "inline") {
                        keyname = "横排显示";
                        if (!(this.owner instanceof ReleasedForm)) {
                            editable = "inl";
                        }
                        isnull = "n";
                    } else if (x == "hidden") {
                        keyname = "不显示";
                        if (!(this.owner instanceof ReleasedForm)) {
                            editable = "hidn";
                        }
                        isnull = "n";
                    } else if (x == "classtypename") {
                        keyname = "组件类型";
                        editable = "-1";
                        isnull = "n";
                    }
                    if (x == "title" || x == "help") {
                        this.setPropertyCell(sheet, x, keyname,
                            obj[x] != null ? Utils.parse(obj[x]) : "",
                            editable, isnull);
                    } else if (x == "required" || x == "inline"
                        || x == "hidden" || x == "readOnly"
                        || x == "disabled") {
                        this.setPropertyCell(sheet, x, keyname, yesno[obj[x]],
                            editable, isnull);
                    } else if (x == "classtypename") {
                        this.setPropertyCell(sheet, x, keyname, formcomponenttype[obj[x]],
                            editable, isnull);
                    } else {
                        this.setPropertyCell(sheet, x, keyname, obj[x],
                            editable, isnull);
                    }
                }
            }
        } else if (obj instanceof CheckBox) {
            for (x in obj) {
                if (x == "id" || x == "name" || x == "required"
                    || x == "hidden" || x == "readOnly"
                    || x == "disabled" || x == "classtypename") {
                    var editable = "-1";
                    var keyname = "";
                    var isnull = "y";
                    if (x == "id") {
                        keyname = "标识";
                        editable = "-1";
                        isnull = "n";
                    } else if (x == "name") {
                        keyname = "名称";
                        if (!(this.owner instanceof ReleasedForm)) {
                            editable = "title";
                        }
                        isnull = "y";
                    } else if (x == "readOnly") {
                        keyname = "只读";
                        if (!(this.owner instanceof ReleasedForm)) {
                            editable = "roly";
                        }
                        isnull = "n";
                    } else if (x == "disabled") {
                        keyname = "置灰";
                        if (!(this.owner instanceof ReleasedForm)) {
                            editable = "disbl";
                        }
                        isnull = "n";
                    } else if (x == "required") {
                        keyname = "可为空";
                        if (!(this.owner instanceof ReleasedForm)) {
                            editable = "rqd";
                        }
                        isnull = "n";
                    } else if (x == "hidden") {
                        keyname = "不显示";
                        if (!(this.owner instanceof ReleasedForm)) {
                            editable = "hidn";
                        }
                        isnull = "n";
                    } else if (x == "classtypename") {
                        keyname = "组件类型";
                        editable = "-1";
                        isnull = "n";
                    }
                    if (x == "name") {
                        this.setPropertyCell(sheet, x, keyname,
                            obj[x] != null ? Utils.parse(obj[x]) : "",
                            editable, isnull);
                    } else if (x == "required" || x == "hidden" || x == "readOnly"
                        || x == "disabled") {
                        this.setPropertyCell(sheet, x, keyname, yesno[obj[x]],
                            editable, isnull);
                    } else if (x == "classtypename") {
                        this.setPropertyCell(sheet, x, keyname, formcomponenttype[obj[x]],
                            editable, isnull);
                    } else {
                        this.setPropertyCell(sheet, x, keyname, obj[x],
                            editable, isnull);
                    }
                }
            }
        } else if (obj instanceof Radios) {
            for (x in obj) {
                if (x == "id" || x == "title" || x == "help" || x == "required"
                    || x == "tabIndex" || x == "inline" || x == "hidden" || x == "readOnly"
                    || x == "disabled" || x == "classtypename") {
                    var editable = "-1";
                    var keyname = "";
                    var isnull = "y";
                    if (x == "id") {
                        keyname = "标识";
                        editable = "-1";
                        isnull = "n";
                    } else if (x == "title") {
                        keyname = "标签";
                        if (!(this.owner instanceof ReleasedForm)) {
                            editable = "title";
                        }
                        isnull = "y";
                    } else if (x == "help") {
                        keyname = "帮助指南";
                        if (!(this.owner instanceof ReleasedForm)) {
                            editable = "hlp";
                        }
                        isnull = "y";
                    } else if (x == "readOnly") {
                        keyname = "只读";
                        if (!(this.owner instanceof ReleasedForm)) {
                            editable = "roly";
                        }
                        isnull = "n";
                    } else if (x == "disabled") {
                        keyname = "置灰";
                        if (!(this.owner instanceof ReleasedForm)) {
                            editable = "disbl";
                        }
                        isnull = "n";
                    } else if (x == "required") {
                        keyname = "可为空";
                        if (!(this.owner instanceof ReleasedForm)) {
                            editable = "rqd";
                        }
                        isnull = "n";
                    } else if (x == "tabIndex") {
                        keyname = "跳转顺序";
                        if (!(this.owner instanceof ReleasedForm)) {
                            editable = "tab";
                        }
                        isnull = "n";
                    } else if (x == "inline") {
                        keyname = "横排显示";
                        if (!(this.owner instanceof ReleasedForm)) {
                            editable = "inl";
                        }
                        isnull = "n";
                    } else if (x == "hidden") {
                        keyname = "不显示";
                        if (!(this.owner instanceof ReleasedForm)) {
                            editable = "hidn";
                        }
                        isnull = "n";
                    } else if (x == "classtypename") {
                        keyname = "组件类型";
                        editable = "-1";
                        isnull = "n";
                    }
                    if (x == "title" || x == "help") {
                        this.setPropertyCell(sheet, x, keyname,
                            obj[x] != null ? Utils.parse(obj[x]) : "",
                            editable, isnull);
                    } else if (x == "required" || x == "inline"
                        || x == "hidden" || x == "readOnly"
                        || x == "disabled") {
                        this.setPropertyCell(sheet, x, keyname, yesno[obj[x]],
                            editable, isnull);
                    } else if (x == "classtypename") {
                        this.setPropertyCell(sheet, x, keyname, formcomponenttype[obj[x]],
                            editable, isnull);
                    } else {
                        this.setPropertyCell(sheet, x, keyname, obj[x],
                            editable, isnull);
                    }
                }
            }
        } else if (obj instanceof Radio) {
            for (x in obj) {
                if (x == "id" || x == "name" || x == "required"
                    || x == "hidden" || x == "readOnly"
                    || x == "disabled" || x == "classtypename") {
                    var editable = "-1";
                    var keyname = "";
                    var isnull = "y";
                    if (x == "id") {
                        keyname = "标识";
                        editable = "-1";
                        isnull = "n";
                    } else if (x == "name") {
                        keyname = "名称";
                        if (!(this.owner instanceof ReleasedForm)) {
                            editable = "title";
                        }
                        isnull = "y";
                    } else if (x == "readOnly") {
                        keyname = "只读";
                        if (!(this.owner instanceof ReleasedForm)) {
                            editable = "roly";
                        }
                        isnull = "n";
                    } else if (x == "disabled") {
                        keyname = "置灰";
                        if (!(this.owner instanceof ReleasedForm)) {
                            editable = "disbl";
                        }
                        isnull = "n";
                    } else if (x == "required") {
                        keyname = "可为空";
                        if (!(this.owner instanceof ReleasedForm)) {
                            editable = "rqd";
                        }
                        isnull = "n";
                    } else if (x == "hidden") {
                        keyname = "不显示";
                        if (!(this.owner instanceof ReleasedForm)) {
                            editable = "hidn";
                        }
                        isnull = "n";
                    } else if (x == "classtypename") {
                        keyname = "组件类型";
                        editable = "-1";
                        isnull = "n";
                    }
                    if (x == "name") {
                        this.setPropertyCell(sheet, x, keyname,
                            obj[x] != null ? Utils.parse(obj[x]) : "",
                            editable, isnull);
                    } else if (x == "required" || x == "hidden" || x == "readOnly"
                        || x == "disabled") {
                        this.setPropertyCell(sheet, x, keyname, yesno[obj[x]],
                            editable, isnull);
                    } else if (x == "classtypename") {
                        this.setPropertyCell(sheet, x, keyname, formcomponenttype[obj[x]],
                            editable, isnull);
                    } else {
                        this.setPropertyCell(sheet, x, keyname, obj[x],
                            editable, isnull);
                    }
                }
            }
        } else if (obj instanceof Button) {
            for (x in obj) {
                if (x == "id" || x == "title" || x == "tabIndex"
                    || x == "fillWidth" || x == "disabled"
                    || x == "hidden" || x == "classtypename") {
                    var editable = "-1";
                    var keyname = "";
                    var isnull = "y";
                    if (x == "id") {
                        keyname = "标识";
                        editable = "-1";
                        isnull = "n";
                    } else if (x == "title") {
                        keyname = "标签";
                        if (!(this.owner instanceof ReleasedForm)) {
                            editable = "title";
                        }
                        isnull = "n";
                    } else if (x == "tabIndex") {
                        keyname = "跳转顺序";
                        if (!(this.owner instanceof ReleasedForm)) {
                            editable = "tab";
                        }
                        isnull = "n";
                    } else if (x == "fillWidth") {
                        keyname = "全宽度";
                        if (!(this.owner instanceof ReleasedForm)) {
                            editable = "fw";
                        }
                        isnull = "n";
                    } else if (x == "disabled") {
                        keyname = "置灰";
                        if (!(this.owner instanceof ReleasedForm)) {
                            editable = "disbl";
                        }
                        isnull = "n";
                    } else if (x == "hidden") {
                        keyname = "不显示";
                        if (!(this.owner instanceof ReleasedForm)) {
                            editable = "hidn";
                        }
                        isnull = "n";
                    } else if (x == "classtypename") {
                        keyname = "组件类型";
                        editable = "-1";
                        isnull = "n";
                    }
                    if (x == "title") {
                        this.setPropertyCell(sheet, x, keyname,
                            obj[x] != null ? Utils.parse(obj[x]) : "",
                            editable, isnull);
                    } else if (x == "fillWidth" || x == "disabled"
                        || x == "hidden") {
                        this.setPropertyCell(sheet, x, keyname, yesno[obj[x]],
                            editable, isnull);
                    } else if (x == "classtypename") {
                        this.setPropertyCell(sheet, x, keyname, formcomponenttype[obj[x]],
                            editable, isnull);
                    } else {
                        this.setPropertyCell(sheet, x, keyname, obj[x],
                            editable, isnull);
                    }
                }
            }
        } else if (obj instanceof LargeButton) {
            for (x in obj) {
                if (x == "id" || x == "title" || x == "tabIndex"
                    || x == "fillWidth" || x == "disabled"
                    || x == "hidden" || x == "classtypename") {
                    var editable = "-1";
                    var keyname = "";
                    var isnull = "y";
                    if (x == "id") {
                        keyname = "标识";
                        editable = "-1";
                        isnull = "n";
                    } else if (x == "title") {
                        keyname = "标签";
                        if (!(this.owner instanceof ReleasedForm)) {
                            editable = "title";
                        }
                        isnull = "n";
                    } else if (x == "tabIndex") {
                        keyname = "跳转顺序";
                        if (!(this.owner instanceof ReleasedForm)) {
                            editable = "tab";
                        }
                        isnull = "n";
                    } else if (x == "fillWidth") {
                        keyname = "全宽度";
                        if (!(this.owner instanceof ReleasedForm)) {
                            editable = "fw";
                        }
                        isnull = "n";
                    } else if (x == "disabled") {
                        keyname = "置灰";
                        if (!(this.owner instanceof ReleasedForm)) {
                            editable = "disbl";
                        }
                        isnull = "n";
                    } else if (x == "hidden") {
                        keyname = "不显示";
                        if (!(this.owner instanceof ReleasedForm)) {
                            editable = "hidn";
                        }
                        isnull = "n";
                    } else if (x == "classtypename") {
                        keyname = "组件类型";
                        editable = "-1";
                        isnull = "n";
                    }
                    if (x == "title") {
                        this.setPropertyCell(sheet, x, keyname,
                            obj[x] != null ? Utils.parse(obj[x]) : "",
                            editable, isnull);
                    } else if (x == "fillWidth" || x == "disabled"
                        || x == "hidden") {
                        this.setPropertyCell(sheet, x, keyname, yesno[obj[x]],
                            editable, isnull);
                    } else if (x == "classtypename") {
                        this.setPropertyCell(sheet, x, keyname, formcomponenttype[obj[x]],
                            editable, isnull);
                    } else {
                        this.setPropertyCell(sheet, x, keyname, obj[x],
                            editable, isnull);
                    }
                }
            }
        } else if (obj instanceof ListSelect) {
            for (x in obj) {
                if (x == "id" || x == "title" || x == "help" || x == "required"
                    || x == "tabIndex" || x == "multiple"
                    || x == "disabled" || x == "hidden" || x == "classtypename") {
                    var editable = "-1";
                    var keyname = "";
                    var isnull = "y";
                    if (x == "id") {
                        keyname = "标识";
                        editable = "-1";
                        isnull = "n";
                    } else if (x == "title") {
                        keyname = "标签";
                        if (!(this.owner instanceof ReleasedForm)) {
                            editable = "title";
                        }
                        isnull = "n";
                    } else if (x == "help") {
                        keyname = "帮助指南";
                        if (!(this.owner instanceof ReleasedForm)) {
                            editable = "hlp";
                        }
                        isnull = "y";
                    } else if (x == "required") {
                        keyname = "可为空";
                        if (!(this.owner instanceof ReleasedForm)) {
                            editable = "rqd";
                        }
                        isnull = "n";
                    } else if (x == "tabIndex") {
                        keyname = "跳转顺序";
                        if (!(this.owner instanceof ReleasedForm)) {
                            editable = "tab";
                        }
                        isnull = "n";
                    } else if (x == "multiple") {
                        keyname = "可多选";
                        if (!(this.owner instanceof ReleasedForm)) {
                            editable = "multi";
                        }
                        isnull = "n";
                    } else if (x == "disabled") {
                        keyname = "置灰";
                        if (!(this.owner instanceof ReleasedForm)) {
                            editable = "disbl";
                        }
                        isnull = "n";
                    } else if (x == "hidden") {
                        keyname = "不显示";
                        if (!(this.owner instanceof ReleasedForm)) {
                            editable = "hidn";
                        }
                        isnull = "n";
                    } else if (x == "classtypename") {
                        keyname = "组件类型";
                        editable = "-1";
                        isnull = "n";
                    }
                    if (x == "title" || x == "help") {
                        this.setPropertyCell(sheet, x, keyname,
                            obj[x] != null ? Utils.parse(obj[x]) : "",
                            editable, isnull);
                    } else if (x == "required" || x == "multiple"
                        || x == "disabled" || x == "hidden") {
                        this.setPropertyCell(sheet, x, keyname, yesno[obj[x]],
                            editable, isnull);
                    } else if (x == "classtypename") {
                        this.setPropertyCell(sheet, x, keyname, formcomponenttype[obj[x]],
                            editable, isnull);
                    } else {
                        this.setPropertyCell(sheet, x, keyname, obj[x],
                            editable, isnull);
                    }
                }
            }
        } else if (obj instanceof Image) {
            for (x in obj) {
                if (x == "id" || x == "title"
                    || x == "alt" || x == "tabIndex"
                    || x == "shapeType" || x == "hidden"
                    || x == "classtypename") {
                    var editable = "-1";
                    var keyname = "";
                    var isnull = "y";
                    if (x == "id") {
                        keyname = "标识";
                        editable = "-1";
                        isnull = "n";
                    } else if (x == "title") {
                        keyname = "图片注释";
                        if (!(this.owner instanceof ReleasedForm)) {
                            editable = "title";
                        }
                        isnull = "y";
                    } else if (x == "alt") {
                        keyname = "图片名";
                        if (!(this.owner instanceof ReleasedForm)) {
                            editable = "nme";
                        }
                        isnull = "y";
                    } else if (x == "tabIndex") {
                        keyname = "跳转顺序";
                        if (!(this.owner instanceof ReleasedForm)) {
                            editable = "tab";
                        }
                        isnull = "n";
                    } else if (x == "shapeType") {
                        keyname = "图片形状";
                        if (!(this.owner instanceof ReleasedForm)) {
                            editable = "shape";
                        }
                        isnull = "n";
                    } else if (x == "hidden") {
                        keyname = "不显示";
                        if (!(this.owner instanceof ReleasedForm)) {
                            editable = "hidn";
                        }
                        isnull = "n";
                    } else if (x == "classtypename") {
                        keyname = "组件类型";
                        editable = "-1";
                        isnull = "n";
                    }
                    if (x == "title" || x == "alt") {
                        this.setPropertyCell(sheet, x, keyname,
                            obj[x] != null ? Utils.parse(obj[x]) : "",
                            editable, isnull);
                    } else if (x == "shapeType") {
                        this.setPropertyCell(sheet, x, keyname,
                            shapetype[obj[x]], editable, isnull);
                    } else if (x == "hidden") {
                        this.setPropertyCell(sheet, x, keyname, yesno[obj[x]],
                            editable, isnull);
                    } else if (x == "classtypename") {
                        this.setPropertyCell(sheet, x, keyname, formcomponenttype[obj[x]],
                            editable, isnull);
                    } else {
                        this.setPropertyCell(sheet, x, keyname, obj[x],
                            editable, isnull);
                    }
                }
            }
        } else if (obj instanceof FileUpload) {
            for (x in obj) {
                if (x == "id" || x == "title" || x == "help"
                    || x == "required"
                    || x == "tabIndex" || x == "readOnly"
                    || x == "disabled" || x == "hidden"
                    || x == "classtypename") {
                    var editable = "-1";
                    var keyname = "";
                    var isnull = "y";
                    if (x == "id") {
                        keyname = "标识";
                        editable = "-1";
                        isnull = "n";
                    } else if (x == "title") {
                        keyname = "标签";
                        if (!(this.owner instanceof ReleasedForm)) {
                            editable = "title";
                        }
                        isnull = "n";
                    } else if (x == "help") {
                        keyname = "帮助指南";
                        if (!(this.owner instanceof ReleasedForm)) {
                            editable = "hlp";
                        }
                        isnull = "y";
                    } else if (x == "required") {
                        keyname = "可为空";
                        if (!(this.owner instanceof ReleasedForm)) {
                            editable = "rqd";
                        }
                        isnull = "n";
                    } else if (x == "tabIndex") {
                        keyname = "跳转顺序";
                        if (!(this.owner instanceof ReleasedForm)) {
                            editable = "tab";
                        }
                        isnull = "n";
                    } else if (x == "readOnly") {
                        keyname = "只读";
                        if (!(this.owner instanceof ReleasedForm)) {
                            editable = "roly";
                        }
                        isnull = "n";
                    } else if (x == "disabled") {
                        keyname = "置灰";
                        if (!(this.owner instanceof ReleasedForm)) {
                            editable = "disbl";
                        }
                        isnull = "n";
                    } else if (x == "hidden") {
                        keyname = "不显示";
                        if (!(this.owner instanceof ReleasedForm)) {
                            editable = "hidn";
                        }
                        isnull = "n";
                    } else if (x == "classtypename") {
                        keyname = "组件类型";
                        editable = "-1";
                        isnull = "n";
                    }
                    if (x == "title" || x == "help") {
                        this.setPropertyCell(sheet, x, keyname,
                            obj[x] != null ? Utils.parse(obj[x]) : "",
                            editable, isnull);
                    } else if (x == "required" || x == "readOnly"
                        || x == "disabled" || x == "hidden") {
                        this.setPropertyCell(sheet, x, keyname, yesno[obj[x]],
                            editable, isnull);
                    } else if (x == "classtypename") {
                        this.setPropertyCell(sheet, x, keyname, formcomponenttype[obj[x]],
                            editable, isnull);
                    } else {
                        this.setPropertyCell(sheet, x, keyname, obj[x],
                            editable, isnull);
                    }
                }
            }
        } else if (obj instanceof Anchor) {
            for (x in obj) {
                if (x == "id" || x == "title" || x == "tabIndex"
                    || x == "fillWidth" || x == "hidden"
                    || x == "classtypename") {
                    var editable = "-1";
                    var keyname = "";
                    var isnull = "y";
                    if (x == "id") {
                        keyname = "标识";
                        editable = "-1";
                        isnull = "n";
                    } else if (x == "title") {
                        keyname = "标签";
                        if (!(this.owner instanceof ReleasedForm)) {
                            editable = "title";
                        }
                        isnull = "n";
                    } else if (x == "tabIndex") {
                        keyname = "跳转顺序";
                        if (!(this.owner instanceof ReleasedForm)) {
                            editable = "tab";
                        }
                        isnull = "n";
                    } else if (x == "fillWidth") {
                        keyname = "全宽度";
                        if (!(this.owner instanceof ReleasedForm)) {
                            editable = "fw";
                        }
                        isnull = "n";
                    } else if (x == "hidden") {
                        keyname = "不显示";
                        if (!(this.owner instanceof ReleasedForm)) {
                            editable = "hidn";
                        }
                        isnull = "n";
                    } else if (x == "classtypename") {
                        keyname = "组件类型";
                        editable = "-1";
                        isnull = "n";
                    }
                    if (x == "title") {
                        this.setPropertyCell(sheet, x, keyname,
                            obj[x] != null ? Utils.parse(obj[x]) : "",
                            editable, isnull);
                    } else if (x == "fillWidth" || x == "hidden") {
                        this.setPropertyCell(sheet, x, keyname, yesno[obj[x]],
                            editable, isnull);
                    } else if (x == "classtypename") {
                        this.setPropertyCell(sheet, x, keyname, formcomponenttype[obj[x]],
                            editable, isnull);
                    } else {
                        this.setPropertyCell(sheet, x, keyname, obj[x],
                            editable, isnull);
                    }
                }
            }
        } else if (obj instanceof Header) {
            for (x in obj) {
                if (x == "id" || x == "type" || x == "tabIndex"
                    || x == "fontStyle" || x == "textAlign"
                    || x == "hidden" || x == "classtypename") {
                    var editable = "-1";
                    var keyname = "";
                    var isnull = "y";
                    if (x == "id") {
                        keyname = "标识";
                        editable = "-1";
                        isnull = "n";
                    } else if (x == "type") {
                        keyname = "标题大小";
                        if (!(this.owner instanceof ReleasedForm)) {
                            editable = "htype";
                        }
                        isnull = "n";
                    } else if (x == "fontStyle") {
                        keyname = "字体风格";
                        if (!(this.owner instanceof ReleasedForm)) {
                            editable = "fstyle";
                        }
                        isnull = "n";
                    } else if (x == "textAlign") {
                        keyname = "标题位置";
                        if (!(this.owner instanceof ReleasedForm)) {
                            editable = "talign";
                        }
                        isnull = "n";
                    } else if (x == "tabIndex") {
                        keyname = "跳转顺序";
                        if (!(this.owner instanceof ReleasedForm)) {
                            editable = "tab";
                        }
                        isnull = "n";
                    } else if (x == "hidden") {
                        keyname = "不显示";
                        if (!(this.owner instanceof ReleasedForm)) {
                            editable = "hidn";
                        }
                        isnull = "n";
                    } else if (x == "classtypename") {
                        keyname = "组件类型";
                        editable = "-1";
                        isnull = "n";
                    }
                    if (x == "type") {
                        this.setPropertyCell(sheet, x, keyname,
                            headertype[obj[x]], editable, isnull);
                    } else if (x == "fontStyle") {
                        this.setPropertyCell(sheet, x, keyname,
                            fontstyle[obj[x]], editable, isnull);
                    } else if (x == "textAlign") {
                        this.setPropertyCell(sheet, x, keyname,
                            textalign[obj[x]], editable, isnull);
                    } else if (x == "hidden") {
                        this.setPropertyCell(sheet, x, keyname, yesno[obj[x]],
                            editable, isnull);
                    } else if (x == "classtypename") {
                        this.setPropertyCell(sheet, x, keyname, formcomponenttype[obj[x]],
                            editable, isnull);
                    } else {
                        this.setPropertyCell(sheet, x, keyname, obj[x],
                            editable, isnull);
                    }
                }
            }
        } else if (obj instanceof Paragraph) {
            for (x in obj) {
                if (x == "id" || x == "type" || x == "tabIndex"
                    || x == "textAlign" || x == "hidden"
                    || x == "classtypename") {
                    var editable = "-1";
                    var keyname = "";
                    var isnull = "y";
                    if (x == "id") {
                        keyname = "标识";
                        editable = "-1";
                        isnull = "n";
                    } else if (x == "textAlign") {
                        keyname = "段落位置";
                        if (!(this.owner instanceof ReleasedForm)) {
                            editable = "talign";
                        }
                        isnull = "n";
                    } else if (x == "hidden") {
                        keyname = "不显示";
                        if (!(this.owner instanceof ReleasedForm)) {
                            editable = "hidn";
                        }
                        isnull = "n";
                    } else if (x == "classtypename") {
                        keyname = "组件类型";
                        editable = "-1";
                        isnull = "n";
                    }
                    if (x == "textAlign") {
                        this.setPropertyCell(sheet, x, keyname,
                            textalign[obj[x]], editable, isnull);
                    } else if (x == "hidden") {
                        this.setPropertyCell(sheet, x, keyname, yesno[obj[x]],
                            editable, isnull);
                    } else if (x == "classtypename") {
                        this.setPropertyCell(sheet, x, keyname, formcomponenttype[obj[x]],
                            editable, isnull);
                    } else {
                        this.setPropertyCell(sheet, x, keyname, obj[x],
                            editable, isnull);
                    }
                }
            }
        } else if (obj instanceof StaticList) {
            for (x in obj) {
                if (x == "id" || x == "type" || x == "tabIndex"
                    || x == "textAlign" || x == "listType"
                    || x == "hidden" || x == "classtypename") {
                    var editable = "-1";
                    var keyname = "";
                    var isnull = "y";
                    if (x == "id") {
                        keyname = "标识";
                        editable = "-1";
                        isnull = "n";
                    } else if (x == "textAlign") {
                        keyname = "列表位置";
                        if (!(this.owner instanceof ReleasedForm)) {
                            editable = "talign";
                        }
                        isnull = "n";
                    } else if (x == "listType") {
                        keyname = "是否排序";
                        if (!(this.owner instanceof ReleasedForm)) {
                            editable = "ltype";
                        }
                        isnull = "n";
                    } else if (x == "hidden") {
                        keyname = "不显示";
                        if (!(this.owner instanceof ReleasedForm)) {
                            editable = "hidn";
                        }
                        isnull = "n";
                    } else if (x == "classtypename") {
                        keyname = "组件类型";
                        editable = "-1";
                        isnull = "n";
                    }
                    if (x == "textAlign") {
                        this.setPropertyCell(sheet, x, keyname,
                            textalign[obj[x]], editable, isnull);
                    } else if (x == "listType") {
                        this.setPropertyCell(sheet, x, keyname,
                            liststyle[obj[x]], editable, isnull);
                    } else if (x == "hidden") {
                        this.setPropertyCell(sheet, x, keyname, yesno[obj[x]],
                            editable, isnull);
                    } else if (x == "classtypename") {
                        this.setPropertyCell(sheet, x, keyname, formcomponenttype[obj[x]],
                            editable, isnull);
                    } else {
                        this.setPropertyCell(sheet, x, keyname, obj[x],
                            editable, isnull);
                    }
                }
            }
        } else if (obj instanceof Reference) {
            for (x in obj) {
                if (x == "id" || x == "name" || x == "description"
                    || x == "createDatetime" || x == "lastupdate"
                    || x == "parent" || x == "owner" || x == "classtypename") {
                    var editable = "-1";
                    var keyname = "";
                    var isnull = "y";
                    if (x == "id") {
                        keyname = "标识";
                        editable = "-1";
                        isnull = "n";
                    } else if (x == "name") {
                        keyname = "名称";
                        editable = "rfnme";
                        isnull = "n";
                    } else if (x == "description") {
                        keyname = "备注";
                        editable = "note";
                        isnull = "y";
                    } else if (x == "createDatetime") {
                        keyname = "创建时间";
                        editable = "-1";
                        isnull = "n";
                    } else if (x == "lastupdate") {
                        keyname = "最后更新";
                        editable = "-1";
                        isnull = "n";
                    } else if (x == "parent") {
                        keyname = "文件夹";
                        editable = "-1";
                        isnull = "n";
                    } else if (x == "owner") {
                        keyname = "所有人";
                        editable = "-1";
                        isnull = "n";
                    } else if (x == "classtypename") {
                        keyname = "组件类型";
                        editable = "-1";
                        isnull = "n";
                    }
                    if (x == "name" || x == "description") {
                        this.setPropertyCell(sheet, x, keyname,
                            obj[x] != null ? Utils.parse(obj[x]) : "",
                            editable, isnull);
                    } else if (x == "parent") {
                        var p = $('#treeview').jstree('get_node', obj[x]);
                        this.setPropertyCell(sheet, x, keyname, p.text,
                            editable, isnull);
                    } else if (x == "owner") {
                        var p = $('#treeview').jstree('get_node', obj[x]);
                        this.setPropertyCell(sheet, x, keyname, p.text,
                            editable, isnull);
                    } else if (x == "lastupdate" || x == "createDatetime") {
                        this.setPropertyCell(sheet, x, keyname, Utils.getDateTime(obj[x]),
                            editable, isnull);
                    } else if (x == "classtypename") {
                        this.setPropertyCell(sheet, x, keyname, formcomponenttype[obj[x]],
                            editable, isnull);
                    } else {
                        this.setPropertyCell(sheet, x, keyname, obj[x],
                            editable, isnull);
                    }
                }
            }
        } else if (obj instanceof PageableTableView) {
            for (x in obj) {
                if (x == "id" || x == "title" || x == "tabIndex"
                    || x == "fillWidth" || x == "hidden"
                    || x == "classtypename") {
                    var editable = "-1";
                    var keyname = "";
                    var isnull = "y";
                    if (x == "id") {
                        keyname = "标识";
                        editable = "-1";
                        isnull = "n";
                    } else if (x == "title") {
                        keyname = "标签";
                        if (!(this.owner instanceof ReleasedForm)) {
                            editable = "title";
                        }
                        isnull = "n";
                    } else if (x == "tabIndex") {
                        keyname = "跳转顺序";
                        if (!(this.owner instanceof ReleasedForm)) {
                            editable = "tab";
                        }
                        isnull = "n";
                    } else if (x == "fillWidth") {
                        keyname = "全宽度";
                        if (!(this.owner instanceof ReleasedForm)) {
                            editable = "fw";
                        }
                        isnull = "n";
                    } else if (x == "hidden") {
                        keyname = "不显示";
                        if (!(this.owner instanceof ReleasedForm)) {
                            editable = "hidn";
                        }
                        isnull = "n";
                    } else if (x == "classtypename") {
                        keyname = "组件类型";
                        editable = "-1";
                        isnull = "n";
                    }
                    if (x == "title") {
                        this.setPropertyCell(sheet, x, keyname,
                            obj[x] != null ? Utils.parse(obj[x]) : "",
                            editable, isnull);
                    } else if (x == "fillWidth" || x == "hidden") {
                        this.setPropertyCell(sheet, x, keyname, yesno[obj[x]],
                            editable, isnull);
                    } else if (x == "classtypename") {
                        this.setPropertyCell(sheet, x, keyname, formcomponenttype[obj[x]],
                            editable, isnull);
                    } else {
                        this.setPropertyCell(sheet, x, keyname, obj[x],
                            editable, isnull);
                    }
                }
            }

        } else if (obj instanceof TableView) {
            for (x in obj) {
                if (x == "id" || x == "title" || x == "tabIndex"
                    || x == "fillWidth" || x == "hidden" || x == "classtypename") {
                    var editable = "-1";
                    var keyname = "";
                    var isnull = "y";
                    if (x == "id") {
                        keyname = "标识";
                        editable = "-1";
                        isnull = "n";
                    } else if (x == "title") {
                        keyname = "标签";
                        if (!(this.owner instanceof ReleasedForm)) {
                            editable = "title";
                        }
                        isnull = "n";
                    } else if (x == "tabIndex") {
                        keyname = "跳转顺序";
                        if (!(this.owner instanceof ReleasedForm)) {
                            editable = "tab";
                        }
                        isnull = "n";
                    } else if (x == "fillWidth") {
                        keyname = "全宽度";
                        if (!(this.owner instanceof ReleasedForm)) {
                            editable = "fw";
                        }
                        isnull = "n";
                    } else if (x == "hidden") {
                        keyname = "不显示";
                        if (!(this.owner instanceof ReleasedForm)) {
                            editable = "hidn";
                        }
                        isnull = "n";
                    } else if (x == "classtypename") {
                        keyname = "组件类型";
                        editable = "-1";
                        isnull = "n";
                    }
                    if (x == "title") {
                        this.setPropertyCell(sheet, x, keyname,
                            obj[x] != null ? Utils.parse(obj[x]) : "",
                            editable, isnull);
                    } else if (x == "fillWidth" || x == "hidden") {
                        this.setPropertyCell(sheet, x, keyname, yesno[obj[x]],
                            editable, isnull);
                    } else if (x == "classtypename") {
                        this.setPropertyCell(sheet, x, keyname, formcomponenttype[obj[x]],
                            editable, isnull);
                    } else {
                        this.setPropertyCell(sheet, x, keyname, obj[x],
                            editable, isnull);
                    }
                }
            }
        } else if (obj instanceof IntegerInput) {
            for (x in obj) {
                if (x == "id" || x == "title" || x == "placeholder"
                    || x == "help" || x == "required" || x == "tabIndex"
                    || x == "readOnly" || x == "disabled" || x == "hidden"
                    || x == "maxLengh" || x == "classtypename") {
                    var editable = "-1";
                    var keyname = "";
                    var isnull = "y";
                    if (x == "id") {
                        keyname = "标识";
                        editable = "-1";
                        isnull = "n";
                    } else if (x == "title") {
                        keyname = "标签";
                        if (!(this.owner instanceof ReleasedForm)) {
                            editable = "title";
                        }
                        isnull = "n";
                    } else if (x == "placeholder") {
                        keyname = "输入描述";
                        if (!(this.owner instanceof ReleasedForm)) {
                            editable = "plher";
                        }
                        isnull = "y";
                    } else if (x == "help") {
                        keyname = "帮助指南";
                        if (!(this.owner instanceof ReleasedForm)) {
                            editable = "hlp";
                        }
                        isnull = "y";
                    } else if (x == "required") {
                        keyname = "可为空";
                        if (!(this.owner instanceof ReleasedForm)) {
                            editable = "rqd";
                        }
                        isnull = "n";
                    } else if (x == "tabIndex") {
                        keyname = "跳转顺序";
                        if (!(this.owner instanceof ReleasedForm)) {
                            editable = "tab";
                        }
                        isnull = "n";
                    } else if (x == "maxLengh") {
                        keyname = "最大长度";
                        if (!(this.owner instanceof ReleasedForm)) {
                            editable = "maxl";
                        }
                        isnull = "n";
                    } else if (x == "readOnly") {
                        keyname = "只读";
                        if (!(this.owner instanceof ReleasedForm)) {
                            editable = "roly";
                        }
                        isnull = "n";
                    } else if (x == "disabled") {
                        keyname = "置灰";
                        if (!(this.owner instanceof ReleasedForm)) {
                            editable = "disbl";
                        }
                        isnull = "n";
                    } else if (x == "hidden") {
                        keyname = "不显示";
                        if (!(this.owner instanceof ReleasedForm)) {
                            editable = "hidn";
                        }
                        isnull = "n";
                    } else if (x == "classtypename") {
                        keyname = "组件类型";
                        editable = "-1";
                        isnull = "n";
                    }
                    if (x == "title" || x == "placeholder" || x == "help") {
                        this.setPropertyCell(sheet, x, keyname,
                            obj[x] != null ? Utils.parse(obj[x]) : "",
                            editable, isnull);
                    } else if (x == "required" || x == "readOnly"
                        || x == "disabled" || x == "hidden") {
                        this.setPropertyCell(sheet, x, keyname, yesno[obj[x]],
                            editable, isnull);
                    } else if (x == "classtypename") {
                        this.setPropertyCell(sheet, x, keyname, formcomponenttype[obj[x]],
                            editable, isnull);
                    } else {
                        this.setPropertyCell(sheet, x, keyname, obj[x],
                            editable, isnull);
                    }
                }
            }
        } else if (obj instanceof DecimalsInput) {
            for (x in obj) {
                if (x == "id" || x == "title" || x == "placeholder"
                    || x == "help" || x == "required" || x == "tabIndex"
                    || x == "readOnly" || x == "disabled" || x == "hidden"
                    || x == "maxLengh" || x == "classtypename") {
                    var editable = "-1";
                    var keyname = "";
                    var isnull = "y";
                    if (x == "id") {
                        keyname = "标识";
                        editable = "-1";
                        isnull = "n";
                    } else if (x == "title") {
                        keyname = "标签";
                        if (!(this.owner instanceof ReleasedForm)) {
                            editable = "title";
                        }
                        isnull = "n";
                    } else if (x == "placeholder") {
                        keyname = "输入描述";
                        if (!(this.owner instanceof ReleasedForm)) {
                            editable = "plher";
                        }
                        isnull = "y";
                    } else if (x == "help") {
                        keyname = "帮助指南";
                        if (!(this.owner instanceof ReleasedForm)) {
                            editable = "hlp";
                        }
                        isnull = "y";
                    } else if (x == "required") {
                        keyname = "可为空";
                        if (!(this.owner instanceof ReleasedForm)) {
                            editable = "rqd";
                        }
                        isnull = "n";
                    } else if (x == "tabIndex") {
                        keyname = "跳转顺序";
                        if (!(this.owner instanceof ReleasedForm)) {
                            editable = "tab";
                        }
                        isnull = "n";
                    } else if (x == "maxLengh") {
                        keyname = "最大长度";
                        if (!(this.owner instanceof ReleasedForm)) {
                            editable = "maxl";
                        }
                        isnull = "n";
                    } else if (x == "readOnly") {
                        keyname = "只读";
                        if (!(this.owner instanceof ReleasedForm)) {
                            editable = "roly";
                        }
                        isnull = "n";
                    } else if (x == "disabled") {
                        keyname = "置灰";
                        if (!(this.owner instanceof ReleasedForm)) {
                            editable = "disbl";
                        }
                        isnull = "n";
                    } else if (x == "hidden") {
                        keyname = "不显示";
                        if (!(this.owner instanceof ReleasedForm)) {
                            editable = "hidn";
                        }
                        isnull = "n";
                    } else if (x == "classtypename") {
                        keyname = "组件类型";
                        editable = "-1";
                        isnull = "n";
                    }
                    if (x == "title" || x == "placeholder" || x == "help") {
                        this.setPropertyCell(sheet, x, keyname,
                            obj[x] != null ? Utils.parse(obj[x]) : "",
                            editable, isnull);
                    } else if (x == "required" || x == "readOnly"
                        || x == "disabled" || x == "hidden") {
                        this.setPropertyCell(sheet, x, keyname, yesno[obj[x]],
                            editable, isnull);
                    } else if (x == "classtypename") {
                        this.setPropertyCell(sheet, x, keyname, formcomponenttype[obj[x]],
                            editable, isnull);
                    } else {
                        this.setPropertyCell(sheet, x, keyname, obj[x],
                            editable, isnull);
                    }
                }
            }
        } else if (obj instanceof CurrencyInput) {
            for (x in obj) {
                if (x == "id" || x == "title" || x == "placeholder"
                    || x == "help" || x == "required" || x == "tabIndex"
                    || x == "readOnly" || x == "disabled" || x == "hidden"
                    || x == "maxLengh" || x == "classtypename") {
                    var editable = "-1";
                    var keyname = "";
                    var isnull = "y";
                    if (x == "id") {
                        keyname = "标识";
                        editable = "-1";
                        isnull = "n";
                    } else if (x == "title") {
                        keyname = "标签";
                        if (!(this.owner instanceof ReleasedForm)) {
                            editable = "title";
                        }
                        isnull = "n";
                    } else if (x == "placeholder") {
                        keyname = "输入描述";
                        if (!(this.owner instanceof ReleasedForm)) {
                            editable = "plher";
                        }
                        isnull = "y";
                    } else if (x == "help") {
                        keyname = "帮助指南";
                        if (!(this.owner instanceof ReleasedForm)) {
                            editable = "hlp";
                        }
                        isnull = "y";
                    } else if (x == "required") {
                        keyname = "可为空";
                        if (!(this.owner instanceof ReleasedForm)) {
                            editable = "rqd";
                        }
                        isnull = "n";
                    } else if (x == "tabIndex") {
                        keyname = "跳转顺序";
                        if (!(this.owner instanceof ReleasedForm)) {
                            editable = "tab";
                        }
                        isnull = "n";
                    } else if (x == "maxLengh") {
                        keyname = "最大长度";
                        if (!(this.owner instanceof ReleasedForm)) {
                            editable = "maxl";
                        }
                        isnull = "n";
                    } else if (x == "readOnly") {
                        keyname = "只读";
                        if (!(this.owner instanceof ReleasedForm)) {
                            editable = "roly";
                        }
                        isnull = "n";
                    } else if (x == "disabled") {
                        keyname = "置灰";
                        if (!(this.owner instanceof ReleasedForm)) {
                            editable = "disbl";
                        }
                        isnull = "n";
                    } else if (x == "hidden") {
                        keyname = "不显示";
                        if (!(this.owner instanceof ReleasedForm)) {
                            editable = "hidn";
                        }
                        isnull = "n";
                    } else if (x == "classtypename") {
                        keyname = "组件类型";
                        editable = "-1";
                        isnull = "n";
                    }
                    if (x == "title" || x == "placeholder" || x == "help") {
                        this.setPropertyCell(sheet, x, keyname,
                            obj[x] != null ? Utils.parse(obj[x]) : "",
                            editable, isnull);
                    } else if (x == "required" || x == "readOnly"
                        || x == "disabled" || x == "hidden") {
                        this.setPropertyCell(sheet, x, keyname, yesno[obj[x]],
                            editable, isnull);
                    } else if (x == "classtypename") {
                        this.setPropertyCell(sheet, x, keyname, formcomponenttype[obj[x]],
                            editable, isnull);
                    } else {
                        this.setPropertyCell(sheet, x, keyname, obj[x],
                            editable, isnull);
                    }
                }
            }
        } else if (obj instanceof NaturalNumberInput) {
            for (x in obj) {
                if (x == "id" || x == "title" || x == "placeholder"
                    || x == "help" || x == "required" || x == "tabIndex"
                    || x == "readOnly" || x == "disabled" || x == "hidden"
                    || x == "maxLengh" || x == "classtypename") {
                    var editable = "-1";
                    var keyname = "";
                    var isnull = "y";
                    if (x == "id") {
                        keyname = "标识";
                        editable = "-1";
                        isnull = "n";
                    } else if (x == "title") {
                        keyname = "标签";
                        if (!(this.owner instanceof ReleasedForm)) {
                            editable = "title";
                        }
                        isnull = "n";
                    } else if (x == "placeholder") {
                        keyname = "输入描述";
                        if (!(this.owner instanceof ReleasedForm)) {
                            editable = "plher";
                        }
                        isnull = "y";
                    } else if (x == "help") {
                        keyname = "帮助指南";
                        if (!(this.owner instanceof ReleasedForm)) {
                            editable = "hlp";
                        }
                        isnull = "y";
                    } else if (x == "required") {
                        keyname = "可为空";
                        if (!(this.owner instanceof ReleasedForm)) {
                            editable = "rqd";
                        }
                        isnull = "n";
                    } else if (x == "tabIndex") {
                        keyname = "跳转顺序";
                        if (!(this.owner instanceof ReleasedForm)) {
                            editable = "tab";
                        }
                        isnull = "n";
                    } else if (x == "maxLengh") {
                        keyname = "最大长度";
                        if (!(this.owner instanceof ReleasedForm)) {
                            editable = "maxl";
                        }
                        isnull = "n";
                    } else if (x == "readOnly") {
                        keyname = "只读";
                        if (!(this.owner instanceof ReleasedForm)) {
                            editable = "roly";
                        }
                        isnull = "n";
                    } else if (x == "disabled") {
                        keyname = "置灰";
                        if (!(this.owner instanceof ReleasedForm)) {
                            editable = "disbl";
                        }
                        isnull = "n";
                    } else if (x == "hidden") {
                        keyname = "不显示";
                        if (!(this.owner instanceof ReleasedForm)) {
                            editable = "hidn";
                        }
                        isnull = "n";
                    } else if (x == "classtypename") {
                        keyname = "组件类型";
                        editable = "-1";
                        isnull = "n";
                    }
                    if (x == "title" || x == "placeholder" || x == "help") {
                        this.setPropertyCell(sheet, x, keyname,
                            obj[x] != null ? Utils.parse(obj[x]) : "",
                            editable, isnull);
                    } else if (x == "required" || x == "readOnly"
                        || x == "disabled" || x == "hidden") {
                        this.setPropertyCell(sheet, x, keyname, yesno[obj[x]],
                            editable, isnull);
                    } else if (x == "classtypename") {
                        this.setPropertyCell(sheet, x, keyname, formcomponenttype[obj[x]],
                            editable, isnull);
                    } else {
                        this.setPropertyCell(sheet, x, keyname, obj[x],
                            editable, isnull);
                    }
                }
            }
        } else if (obj instanceof DateTimeInput) {
            for (x in obj) {
                if (x == "id" || x == "title" || x == "placeholder"
                    || x == "help" || x == "required" || x == "tabIndex"
                    || x == "readOnly" || x == "disabled"
                    || x == "hidden" || x == "classtypename") {
                    var editable = "-1";
                    var keyname = "";
                    var isnull = "y";
                    if (x == "id") {
                        keyname = "标识";
                        editable = "-1";
                        isnull = "n";
                    } else if (x == "title") {
                        keyname = "标签";
                        if (!(this.owner instanceof ReleasedForm)) {
                            editable = "title";
                        }
                        isnull = "n";
                    } else if (x == "placeholder") {
                        keyname = "输入描述";
                        if (!(this.owner instanceof ReleasedForm)) {
                            editable = "plher";
                        }
                        isnull = "y";
                    } else if (x == "help") {
                        keyname = "帮助指南";
                        if (!(this.owner instanceof ReleasedForm)) {
                            editable = "hlp";
                        }
                        isnull = "y";
                    } else if (x == "required") {
                        keyname = "可为空";
                        if (!(this.owner instanceof ReleasedForm)) {
                            editable = "rqd";
                        }
                        isnull = "n";
                    } else if (x == "tabIndex") {
                        keyname = "跳转顺序";
                        if (!(this.owner instanceof ReleasedForm)) {
                            editable = "tab";
                        }
                        isnull = "n";
                    } else if (x == "readOnly") {
                        keyname = "只读";
                        if (!(this.owner instanceof ReleasedForm)) {
                            editable = "roly";
                        }
                        isnull = "n";
                    } else if (x == "disabled") {
                        keyname = "置灰";
                        if (!(this.owner instanceof ReleasedForm)) {
                            editable = "disbl";
                        }
                        isnull = "n";
                    } else if (x == "hidden") {
                        keyname = "不显示";
                        if (!(this.owner instanceof ReleasedForm)) {
                            editable = "hidn";
                        }
                        isnull = "n";
                    } else if (x == "classtypename") {
                        keyname = "组件类型";
                        editable = "-1";
                        isnull = "n";
                    }
                    if (x == "title" || x == "placeholder" || x == "help") {
                        this.setPropertyCell(sheet, x, keyname,
                            obj[x] != null ? Utils.parse(obj[x]) : "",
                            editable, isnull);
                    } else if (x == "required" || x == "readOnly"
                        || x == "disabled" || x == "hidden") {
                        this.setPropertyCell(sheet, x, keyname, yesno[obj[x]],
                            editable, isnull);
                    } else if (x == "classtypename") {
                        this.setPropertyCell(sheet, x, keyname, formcomponenttype[obj[x]],
                            editable, isnull);
                    } else {
                        this.setPropertyCell(sheet, x, keyname, obj[x],
                            editable, isnull);
                    }
                }
            }
        } else if (obj instanceof DateTimeRangeInput) {
            for (x in obj) {
                if (x == "id" || x == "title" || x == "placeholder"
                    || x == "help" || x == "required" || x == "tabIndex"
                    || x == "readOnly" || x == "disabled" || x == "hidden"
                    || x == "classtypename") {
                    var editable = "-1";
                    var keyname = "";
                    var isnull = "y";
                    if (x == "id") {
                        keyname = "标识";
                        editable = "-1";
                        isnull = "n";
                    } else if (x == "title") {
                        keyname = "标签";
                        if (!(this.owner instanceof ReleasedForm)) {
                            editable = "title";
                        }
                        isnull = "n";
                    } else if (x == "placeholder") {
                        keyname = "输入描述";
                        if (!(this.owner instanceof ReleasedForm)) {
                            editable = "plher";
                        }
                        isnull = "y";
                    } else if (x == "help") {
                        keyname = "帮助指南";
                        if (!(this.owner instanceof ReleasedForm)) {
                            editable = "hlp";
                        }
                        isnull = "y";
                    } else if (x == "required") {
                        keyname = "可为空";
                        if (!(this.owner instanceof ReleasedForm)) {
                            editable = "rqd";
                        }
                        isnull = "n";
                    } else if (x == "tabIndex") {
                        keyname = "跳转顺序";
                        if (!(this.owner instanceof ReleasedForm)) {
                            editable = "tab";
                        }
                        isnull = "n";
                    } else if (x == "readOnly") {
                        keyname = "只读";
                        if (!(this.owner instanceof ReleasedForm)) {
                            editable = "roly";
                        }
                        isnull = "n";
                    } else if (x == "disabled") {
                        keyname = "置灰";
                        if (!(this.owner instanceof ReleasedForm)) {
                            editable = "disbl";
                        }
                        isnull = "n";
                    } else if (x == "hidden") {
                        keyname = "不显示";
                        if (!(this.owner instanceof ReleasedForm)) {
                            editable = "hidn";
                        }
                        isnull = "n";
                    } else if (x == "classtypename") {
                        keyname = "组件类型";
                        editable = "-1";
                        isnull = "n";
                    }
                    if (x == "title" || x == "placeholder" || x == "help") {
                        this.setPropertyCell(sheet, x, keyname,
                            obj[x] != null ? Utils.parse(obj[x]) : "",
                            editable, isnull);
                    } else if (x == "required" || x == "readOnly"
                        || x == "disabled" || x == "hidden") {
                        this.setPropertyCell(sheet, x, keyname, yesno[obj[x]],
                            editable, isnull);
                    } else if (x == "classtypename") {
                        this.setPropertyCell(sheet, x, keyname, formcomponenttype[obj[x]],
                            editable, isnull);
                    } else {
                        this.setPropertyCell(sheet, x, keyname, obj[x],
                            editable, isnull);
                    }
                }
            }
        } else if (obj instanceof FileDisplayer) {
            for (x in obj) {
                if (x == "id" || x == "title" || x == "placeholder"
                    || x == "help" || x == "required" || x == "tabIndex"
                    || x == "hidden" || x == "classtypename") {
                    var editable = "-1";
                    var keyname = "";
                    var isnull = "y";
                    if (x == "id") {
                        keyname = "标识";
                        editable = "-1";
                        isnull = "n";
                    } else if (x == "title") {
                        keyname = "标签";
                        if (!(this.owner instanceof ReleasedForm)) {
                            editable = "title";
                        }
                        isnull = "n";
                    } else if (x == "placeholder") {
                        keyname = "输入描述";
                        if (!(this.owner instanceof ReleasedForm)) {
                            editable = "plher";
                        }
                        isnull = "y";
                    } else if (x == "help") {
                        keyname = "帮助指南";
                        if (!(this.owner instanceof ReleasedForm)) {
                            editable = "hlp";
                        }
                        isnull = "y";
                    } else if (x == "required") {
                        keyname = "可为空";
                        if (!(this.owner instanceof ReleasedForm)) {
                            editable = "rqd";
                        }
                        isnull = "n";
                    } else if (x == "tabIndex") {
                        keyname = "跳转顺序";
                        if (!(this.owner instanceof ReleasedForm)) {
                            editable = "tab";
                        }
                        isnull = "n";
                    } else if (x == "hidden") {
                        keyname = "不显示";
                        if (!(this.owner instanceof ReleasedForm)) {
                            editable = "hidn";
                        }
                        isnull = "n";
                    } else if (x == "classtypename") {
                        keyname = "组件类型";
                        editable = "-1";
                        isnull = "n";
                    }
                    if (x == "title" || x == "placeholder" || x == "help") {
                        this.setPropertyCell(sheet, x, keyname,
                            obj[x] != null ? Utils.parse(obj[x]) : "",
                            editable, isnull);
                    } else if (x == "required" || x == "hidden") {
                        this.setPropertyCell(sheet, x, keyname, yesno[obj[x]],
                            editable, isnull);
                    } else if (x == "classtypename") {
                        this.setPropertyCell(sheet, x, keyname, formcomponenttype[obj[x]],
                            editable, isnull);
                    } else {
                        this.setPropertyCell(sheet, x, keyname, obj[x],
                            editable, isnull);
                    }
                }
            }
        } else if (obj instanceof FilesDisplayer) {
            for (x in obj) {
                if (x == "id" || x == "title" || x == "placeholder"
                    || x == "help" || x == "required" || x == "tabIndex"
                    || x == "hidden" || x == "classtypename") {
                    var editable = "-1";
                    var keyname = "";
                    var isnull = "y";
                    if (x == "id") {
                        keyname = "标识";
                        editable = "-1";
                        isnull = "n";
                    } else if (x == "title") {
                        keyname = "标签";
                        if (!(this.owner instanceof ReleasedForm)) {
                            editable = "title";
                        }
                        isnull = "n";
                    } else if (x == "placeholder") {
                        keyname = "输入描述";
                        if (!(this.owner instanceof ReleasedForm)) {
                            editable = "plher";
                        }
                        isnull = "y";
                    } else if (x == "help") {
                        keyname = "帮助指南";
                        if (!(this.owner instanceof ReleasedForm)) {
                            editable = "hlp";
                        }
                        isnull = "y";
                    } else if (x == "required") {
                        keyname = "可为空";
                        if (!(this.owner instanceof ReleasedForm)) {
                            editable = "rqd";
                        }
                        isnull = "n";
                    } else if (x == "tabIndex") {
                        keyname = "跳转顺序";
                        if (!(this.owner instanceof ReleasedForm)) {
                            editable = "tab";
                        }
                        isnull = "n";
                    } else if (x == "hidden") {
                        keyname = "不显示";
                        if (!(this.owner instanceof ReleasedForm)) {
                            editable = "hidn";
                        }
                        isnull = "n";
                    } else if (x == "classtypename") {
                        keyname = "组件类型";
                        editable = "-1";
                        isnull = "n";
                    }
                    if (x == "title" || x == "placeholder" || x == "help") {
                        this.setPropertyCell(sheet, x, keyname,
                            obj[x] != null ? Utils.parse(obj[x]) : "",
                            editable, isnull);
                    } else if (x == "required" || x == "hidden") {
                        this.setPropertyCell(sheet, x, keyname, yesno[obj[x]],
                            editable, isnull);
                    } else if (x == "classtypename") {
                        this.setPropertyCell(sheet, x, keyname, formcomponenttype[obj[x]],
                            editable, isnull);
                    } else {
                        this.setPropertyCell(sheet, x, keyname, obj[x],
                            editable, isnull);
                    }
                }
            }
        } else {
            this.initSheet();
        }
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

    BasicPropertySheet.prototype.setPropertyCell = function (table, key,
                                                             keydesc, keyvalue, editable, isnull) {
        var row = table.insertRow(-1);
        row.addEventListener("click", this, false);
        row.addEventListener("dblclick", this, false);
        var cell1 = row.insertCell(0);
        var cell2 = row.insertCell(1);
        $(cell1).text(keydesc);
        cell1.setAttribute("nowrap", "true");
        cell1.setAttribute("key", key);
        cell1.setAttribute("type", "h");
        $(cell2).text(keyvalue);
        cell2.setAttribute("key", key);
        cell2.setAttribute("type", editable);
        cell2.setAttribute("null", isnull);
    };

    BasicPropertySheet.prototype.doDblClick = function (evt) {
        if (evt.target.tagName == "TD") {
            this.propertysheet.focus();
            this.startToEdit(evt.target);
        }
    };

    BasicPropertySheet.prototype.startToEdit = function (tag) {
        var t = tag.getAttribute("type");
        if (t == "fnme") {
            this.editor0.loadEditor(tag, this.entity, tag.getAttribute("key"),
                tag.getAttribute("null"), this.owner);
        } else if (t == "nme") {
            this.editor1.loadEditor(tag, this.entity, tag.getAttribute("key"),
                tag.getAttribute("null"), this.owner);
        } else if (t == "desc") {
            this.editor2.loadEditor(tag, this.entity, tag.getAttribute("key"),
                tag.getAttribute("null"), "字数不宜超过1000字", this.owner);
        } else if (t == "kw") {
            this.editor2.loadEditor(tag, this.entity, tag.getAttribute("key"),
                tag.getAttribute("null"), "关键字以分号隔开隔开", this.owner);
        } else if (t == "pp") {
            this.editor7.loadEditor(tag, this.entity, tag.getAttribute("key"),
                tag.getAttribute("null"), this.owner);
        } else if (t == "up") {
            this.editor7.loadEditor(tag, this.entity, tag.getAttribute("key"),
                tag.getAttribute("null"), this.owner);
        } else if (t == "rqd") {
            this.editor5.loadEditor(tag, this.entity, tag.getAttribute("key"),
                tag.getAttribute("null"), this.entity.required, this.owner);
        } else if (t == "inl") {
            this.editor5.loadEditor(tag, this.entity, tag.getAttribute("key"),
                tag.getAttribute("null"), this.entity.inline, this.owner);
        } else if (t == "fw") {
            this.editor5
                .loadEditor(tag, this.entity, tag.getAttribute("key"), tag
                        .getAttribute("null"), this.entity.fillWidth,
                    this.owner);
        } else if (t == "hlp") {
            this.editor2.loadEditor(tag, this.entity, tag.getAttribute("key"),
                tag.getAttribute("null"), "简要帮助字数不宜超过50字", this.owner);
        } else if (t == "tab") {
            this.editor7.loadEditor(tag, this.entity, tag.getAttribute("key"),
                tag.getAttribute("null"), this.owner);
        } else if (t == "title" || t == "plher") {
            this.editor7.loadEditor(tag, this.entity, tag.getAttribute("key"),
                tag.getAttribute("null"), this.owner);
        } else if (t == "shape") {
            this.editor3
                .loadEditor(tag, this.entity, tag.getAttribute("key"), tag
                        .getAttribute("null"), this.entity.shapeType,
                    this.owner);
        } else if (t == "htype") {
            this.editor4.loadEditor(tag, this.entity, tag.getAttribute("key"),
                tag.getAttribute("null"), this.entity.type, this.owner,
                headertype);
        } else if (t == "fstyle") {
            this.editor4.loadEditor(tag, this.entity, tag.getAttribute("key"),
                tag.getAttribute("null"), this.entity.fontStyle,
                this.owner, fontstyle);
        } else if (t == "talign") {
            this.editor4.loadEditor(tag, this.entity, tag.getAttribute("key"),
                tag.getAttribute("null"), this.entity.textAlign,
                this.owner, textalign);
        } else if (t == "ltype") {
            this.editor4.loadEditor(tag, this.entity, tag.getAttribute("key"),
                tag.getAttribute("null"), this.entity.listType, this.owner,
                liststyle);
        } else if (t == "roly") {
            this.editor5.loadEditor(tag, this.entity, tag.getAttribute("key"),
                tag.getAttribute("null"), this.entity.readOnly, this.owner);
        } else if (t == "disbl") {
            this.editor5.loadEditor(tag, this.entity, tag.getAttribute("key"),
                tag.getAttribute("null"), this.entity.disabled, this.owner);
        } else if (t == "maxl") {
            this.editor6.loadEditor(tag, this.entity, tag.getAttribute("key"),
                tag.getAttribute("null"), this.owner);
        } else if (t == "rws") {
            this.editor7.loadEditor(tag, this.entity, tag.getAttribute("key"),
                tag.getAttribute("null"), this.owner);
        } else if (t == "note") {
            this.editor2.loadEditor(tag, this.entity, tag.getAttribute("key"),
                tag.getAttribute("null"), "字数不宜超过1000字", this.owner);
        } else if (t == "rfnme") {
            this.editor8.loadEditor(tag, this.entity, tag.getAttribute("key"),
                tag.getAttribute("null"), this.owner);
        } else if (t == "multi") {
            this.editor5.loadEditor(tag, this.entity, tag.getAttribute("key"),
                tag.getAttribute("null"), this.entity.multiple, this.owner);
        } else if (t == "hidn") {
            this.editor5.loadEditor(tag, this.entity, tag.getAttribute("key"),
                tag.getAttribute("null"), this.entity.hidden, this.owner);
        } else if (t == "dep") {
            this.editor5.loadEditor(tag, this.entity, tag.getAttribute("key"),
                tag.getAttribute("null"), this.entity.deprecated,
                this.owner);
        } else if (t == "state") {
            this.editor2.loadEditor(tag, this.entity, tag.getAttribute("key"),
                tag.getAttribute("null"), "发布声明字数不宜超过5000字", this.owner);
        } else if (t == "tri") {
            this.editor9.loadEditor(tag, this.entity, tag.getAttribute("key"),
                tag.getAttribute("null"), this.owner);
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
            for (i = 0; i < table.rows.length; i++) {
                table.rows[i].style.background = "";
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