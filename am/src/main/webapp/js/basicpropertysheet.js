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
            title: "轩琦科技 - 提示",
            parent: this,
        });
        this.messageDialog = p3.data("messageDialog");

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

        var plugin4 = $(this.propertysheet).accessTypeSelectCellEditor({
            parent: this,
            msg: this.messageDialog,
        });
        this.editor4 = plugin4.data("accessTypeSelectCellEditor");

        var plugin5 = $(this.propertysheet).statusSelectCellEditor({
            parent: this,
            msg: this.messageDialog,
        });
        this.editor5 = plugin5.data("statusSelectCellEditor");

        var plugin6 = $(this.propertysheet).accessKeyCellEditor({
            parent: this,
            msg: this.messageDialog,
        });
        this.editor6 = plugin6.data("accessKeyCellEditor");

        var plugin7 = $(this.propertysheet).priceCellEditor({
            parent: this,
            msg: this.messageDialog,
        });
        this.editor7 = plugin7.data("priceCellEditor");

        var plugin8 = $(this.propertysheet).textPropsCellEditor({
            parent: this,
            msg: this.messageDialog,
        });
        this.editor8 = plugin8.data("textPropsCellEditor");
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

    BasicPropertySheet.prototype.setSheet = function (obj) {
        this.entity = obj;
        this.clearSheet();
        var sheet = this.propertysheet;
        if (obj instanceof SMSTemplate || obj instanceof EmailTemplate) {
            for (x in obj) {
                if (x == "id" || x == "name" || x == "useCounting"
                    || x == "status" || x == "createDateTime"
                    || x == "lastupdate" || x == "onlineDateTime"
                    || x == "offlineDateTime") {
                    var editable = "-1";
                    var keyname = "";
                    var isnull = "y";
                    if (x == "id") {
                        keyname = "模板标识";
                        editable = "-1";
                        isnull = "n";
                    } else if (x == "name") {
                        keyname = "模板名称";
                        editable = "nme";
                        isnull = "n";
                    } else if (x == "useCounting") {
                        keyname = "使用次数";
                        editable = "-1";
                        isnull = "n";
                    } else if (x == "status") {
                        keyname = "状态";
                        editable = "-1";
                        isnull = "n";
                    } else if (x == "createDateTime") {
                        keyname = "创建时间";
                        editable = "-1";
                        isnull = "n";
                    } else if (x == "lastupdate") {
                        keyname = "最后更新";
                        editable = "-1";
                        isnull = "n";
                    } else if (x == "onlineDateTime") {
                        keyname = "上线时间";
                        editable = "-1";
                        isnull = "n";
                    } else if (x == "offlineDateTime") {
                        keyname = "下线时间";
                        editable = "-1";
                        isnull = "n";
                    }
                    if (x == "name") {
                        this.setPropertyCell(sheet, x, keyname,
                            obj[x] != null ? Utils.parse(obj[x]) : "",
                            editable, isnull);
                    } else if (x == "status") {
                        this.setPropertyCell(sheet, x, keyname,
                            templatestatus[obj[x]], editable, isnull);
                    } else {
                        this.setPropertyCell(sheet, x, keyname, obj[x]);
                    }
                }
            }
        } else if (obj instanceof WebAppService) {
            for (x in obj) {
                if (x == "id" || x == "name" || x == "keywords"
                    || x == "accessType" || x == "status"
                    || x == "createDateTime" || x == "lastupdate"
                    || x == "securityAccessKey") {
                    var editable = "-1";
                    var keyname = "";
                    var isnull = "y";
                    if (x == "id") {
                        keyname = "系统标识";
                        editable = "-1";
                        isnull = "n";
                    } else if (x == "name") {
                        keyname = "服务名称";
                        editable = "nme";
                        isnull = "n";
                    } else if (x == "keywords") {
                        keyname = "关键字";
                        editable = "kw";
                        isnull = "y";
                    } else if (x == "accessType") {
                        keyname = "访问类型";
                        editable = "acctype";
                        isnull = "n";
                    } else if (x == "securityAccessKey") {
                        keyname = "访问密码";
                        editable = "pass";
                        isnull = "y";
                    } else if (x == "status") {
                        keyname = "状态";
                        editable = "-1";
                        isnull = "n";
                    } else if (x == "price") {
                        keyname = "价格（￥）";
                        editable = "price";
                        isnull = "y";
                    } else if (x == "createDateTime") {
                        keyname = "创建时间";
                        editable = "-1";
                        isnull = "n";
                    } else if (x == "lastupdate") {
                        keyname = "最后更新";
                        editable = "-1";
                        isnull = "n";
                    }
                    if (x == "name" || x == "keywords") {
                        this.setPropertyCell(sheet, x, keyname,
                            obj[x] != null ? Utils.parse(obj[x]) : "",
                            editable, isnull);
                    } else if (x == "status") {
                        this.setPropertyCell(sheet, x, keyname, onlinestatus[obj[x]],
                            editable, isnull);
                    } else if (x == "accessType") {
                        this.setPropertyCell(sheet, x, keyname,
                            accesstype[obj[x]], editable, isnull);
                    } else {
                        this.setPropertyCell(sheet, x, keyname, obj[x],
                            editable, isnull);
                    }
                }
            }
        } else if (obj instanceof ServiceContainer) {
            for (x in obj) {
                if (x == "id" || x == "name" || x == "containerType"
                    || x == "createDateTime" || x == "lastupdate") {
                    var editable = "-1";
                    var keyname = "";
                    var isnull = "y";
                    if (x == "id") {
                        keyname = "系统标识";
                        editable = "-1";
                        isnull = "n";
                    } else if (x == "name") {
                        keyname = "服务名称";
                        editable = "nme";
                        isnull = "n";
                    } else if (x == "containerType") {
                        keyname = "类型";
                        editable = "-1";
                        isnull = "n";
                    } else if (x == "createDateTime") {
                        keyname = "创建时间";
                        editable = "-1";
                        isnull = "n";
                    } else if (x == "lastupdate") {
                        keyname = "最后更新";
                        editable = "-1";
                        isnull = "n";
                    }
                    if (x == "name") {
                        this.setPropertyCell(sheet, x, keyname,
                            obj[x] != null ? Utils.parse(obj[x]) : "",
                            editable, isnull);
                    } else if (x == "containerType") {
                        this.setPropertyCell(sheet, x, keyname,
                            containertype[obj[x]], editable, isnull);
                    } else {
                        this.setPropertyCell(sheet, x, keyname, obj[x],
                            editable, isnull);
                    }

                }
            }
        } else if (obj instanceof AndroidAppPlugin) {
            for (x in obj) {
                if (x == "id" || x == "name" || x == "keywords"
                    || x == "accessType" || x == "status"
                    || x == "createDateTime" || x == "lastupdate"
                    || x == "securityAccessKey" || x == "versionName"
                    || x == "versionCode" ||  x == "apkFileName" || x == "alias") {
                    var editable = "-1";
                    var keyname = "";
                    var isnull = "y";
                    if (x == "id") {
                        keyname = "系统标识";
                        editable = "-1";
                        isnull = "n";
                    } else if (x == "name") {
                        keyname = "服务名称";
                        editable = "nme";
                        isnull = "n";
                    } else if (x == "alias") {
                        keyname = "插件别名";
                        editable = "-1";
                        isnull = "n";
                    } else if (x == "versionName") {
                        keyname = "版本名称";
                        editable = "vname";
                        isnull = "y";
                    } else if (x == "versionCode") {
                        keyname = "版本号码";
                        editable = "vcode";
                        isnull = "y";
                    } else if (x == "apkFileName") {
                        keyname = "插件文件名称";
                        editable = "afn";
                        isnull = "y";
                    } else if (x == "keywords") {
                        keyname = "关键字";
                        editable = "kw";
                        isnull = "y";
                    } else if (x == "accessType") {
                        keyname = "访问类型";
                        editable = "acctype";
                        isnull = "n";
                    } else if (x == "securityAccessKey") {
                        keyname = "访问密码";
                        editable = "pass";
                        isnull = "y";
                    } else if (x == "status") {
                        keyname = "状态";
                        editable = "-1";
                        isnull = "n";
                    } else if (x == "price") {
                        keyname = "价格（￥）";
                        editable = "price";
                        isnull = "y";
                    } else if (x == "createDateTime") {
                        keyname = "创建时间";
                        editable = "-1";
                        isnull = "n";
                    } else if (x == "lastupdate") {
                        keyname = "最后更新";
                        editable = "-1";
                        isnull = "n";
                    }
                    if (x == "name" || x == "keywords") {
                        this.setPropertyCell(sheet, x, keyname,
                            obj[x] != null ? Utils.parse(obj[x]) : "",
                            editable, isnull);
                    } else if (x == "status") {
                        this.setPropertyCell(sheet, x, keyname, onlinestatus[obj[x]],
                            editable, isnull);
                    } else if (x == "accessType") {
                        this.setPropertyCell(sheet, x, keyname,
                            accesstype[obj[x]], editable, isnull);
                    } else if (x == "createDateTime" || x == "lastupdate") {
                        this.setPropertyCell(sheet, x, keyname, Utils.getDateTime(new Date(obj[x]).getTime()),
                            editable, isnull);
                    } else {
                        this.setPropertyCell(sheet, x, keyname, obj[x],
                            editable, isnull);
                    }
                }
            }
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
                                                             keydesc,
                                                             keyvalue,
                                                             editable,
                                                             isnull) {
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
        if (t == "nme") {
            this.editor1.loadEditor(tag, this.entity, tag.getAttribute("key"),
                tag.getAttribute("null"));
        } else if (t == "vname") {
            this.editor8.loadEditor(tag, this.entity, tag.getAttribute("key"),
                tag.getAttribute("null"));
        } else if (t == "vcode") {
            this.editor8.loadEditor(tag, this.entity, tag.getAttribute("key"),
                tag.getAttribute("null"));
        } else if (t == "afn") {
            this.editor8.loadEditor(tag, this.entity, tag.getAttribute("key"),
                tag.getAttribute("null"));
        } else if (t == "status") {
            this.editor5.loadEditor(tag, this.entity, tag.getAttribute("key"),
                tag.getAttribute("null"), this.entity.status);
        } else if (t == "acctype") {
            this.editor4.loadEditor(tag, this.entity, tag.getAttribute("key"),
                tag.getAttribute("null"), this.entity.accessType);
        } else if (t == "kw") {
            this.editor2.loadEditor(tag, this.entity, tag.getAttribute("key"),
                tag.getAttribute("null"), "关键字以分号隔开隔开");
        } else if (t == "pass") {
            this.editor6.loadEditor(tag, this.entity, tag.getAttribute("key"),
                tag.getAttribute("null"), "服务访问密码是一个20位的数字加字母的字符串，它可以为空");
        } else if (t == "price") {
            this.editor7.loadEditor(tag, this.entity, tag.getAttribute("key"),
                tag.getAttribute("null"), "服务定价是金额，不能为空至少为0。它只在服务被成功访问时计价");
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