;
(function ($, window, document, undefined) {
    var pluginName = "queryConditionPane";
    var defaults = {
        id: "",
        pid: "",// report service ID
        basicpropsheet: "",
        propsheet: "",
        width: 0,
        height: 0,
        parent: "",
        currObject: "",// report service object
        owner: "",
    };

    var Editor = function (element, options) {
        this.element = element;
        this.options = $.extend({
            id: "",
            pid: "",// report service ID
            basicpropsheet: "",
            propsheet: "",
            width: 0,
            height: 0,
            parent: "",
            currObject: "",// report service object
            owner: "",
        }, defaults, options);
        this._defaults = defaults;
        this._name = pluginName;
        this.stack = options.parent.stack;
        this.leftSelectedIndex = null;
        this.leftSelectedRowNum = -1;
        this.pageSize = 30;

        this.initMainPanel(options);
    };

    Editor.prototype.initMainPanel = function (options) {
        var editorPanel = document.createElement("DIV");
        this.element.appendChild(editorPanel);
        editorPanel.style.margin = "0px";
        editorPanel.style.padding = "0px";
        editorPanel.style.overflow = "auto";

        var painterRow = document.createElement("DIV");
        editorPanel.appendChild(painterRow);
        painterRow.className = "row";
        painterRow.style.margin = "0px";
        painterRow.style.marginTop = "2px";
        painterRow.style.padding = "0px";

        var tableDivPane = document.createElement("DIV");
        painterRow.appendChild(tableDivPane);
        tableDivPane.className = "col-lg-7 col-md-7 col-sm-7 col-xs-7 table-responsive";
        tableDivPane.id = "querycondition" + options.pid;
        tableDivPane.style.margin = "0px";
        tableDivPane.style.padding = "0px";
        tableDivPane.style.border = "1px solid #ddd";
        tableDivPane.style.height = (options.height) + "px";
        tableDivPane.style.borderRadius = "4px";
        tableDivPane.style.overflowY = "auto";
        this.fieldlist = document.createElement("table");
        tableDivPane.appendChild(this.fieldlist);
        this.fieldlist.className = "table table-striped table-hover";

        this.loadingFields(options.currObject);

        var rightPane = document.createElement("DIV");
        painterRow.appendChild(rightPane);
        rightPane.className = "col-lg-5 col-md-5 col-sm-5 col-xs-5";
        rightPane.id = "othercondition" + options.pid;
        rightPane.style.margin = "0px";
        rightPane.style.padding = "0px";
        rightPane.style.border = "1px solid #ddd";
        rightPane.style.borderRadius = "4px";
        rightPane.style.height = (options.height) + "px";
        rightPane.style.overflowY = "auto";
    };

    Editor.prototype.loadingFields = function (obj) {
        $(this.fieldlist).children().remove();
        // console.log(obj.children);
        // obj.children is variable list in a process definition;
        if (obj.children != null && obj.children.length > 0) {
            for (var i = 0; i < obj.children.length; i++) {
                var child = obj.children[i];
                var row = this.fieldlist.insertRow(-1);
                row.setAttribute("key", child.id);
                row.setAttribute("order", "" + (i + 1));
                row.addEventListener("click", this, false);
                var cell = this.createCell(0, "", row);
                this.createCheckbox(cell, "qcondition", obj.id, child.id);
                this.createCell(1, (i + 1) + "", row);
                this.createCell(2, child.name, row);
                this.createCell(3, datatype[child.datatype], row);
                if (child instanceof ArrayDataVariable) {
                    this.createCell(4, "是", row);
                } else if (child instanceof DataVariable) {
                    this.createCell(4, "否", row);
                }
                var oper = this.createCell(5, "", row);
                var val = this.createCell(6, "", row);
                if (child.datatype != "TimeDuration" &&
                    child.datatype != "JSONData" &&
                    child.datatype != "File" &&
                    child.datatype != "Handwriting") {
                    oper.style.padding = "0px";
                    this.createOperator(oper, child.datatype);
                    val.style.padding = "0px";
                    this.createValue(val, child.datatype);
                }
            }
            // if (obj.children.length < this.pageSize) {
            //     for (var i = obj.children.length; i < this.pageSize; i++) {
            //         var row = this.fieldlist.insertRow(i);
            //         for (var j = 0; j < 5; j++) {
            //             this.createCell(j, "&nbsp;", row);
            //         }
            //     }
            // }
        } else {
            this.initLeftList();
        }
        this.addFieldListHeader();
    };

    Editor.prototype.refresh = function () {
        this.loadingFields(this.options.currObject);
    };

    Editor.prototype.createOperator = function (parent, datatype) {
        var select = document.createElement("SELECT");
        parent.appendChild(select);
        select.className = "form-control";
        select.style.padding = "0px";
        select.style.paddingLeft = "12px";
        select.style.paddingRight = "12px";
        select.addEventListener("change", function (e) {
            // var row = this.parentNode.parentNode;
            // that.delfileid = row.getAttribute("pid");
            // var wftype = row.getAttribute("wftype");
            // if (this.name == "review") {
            //
            // } else if (this.name == "modify") {
            //     that.openEditor(that.delfileid, wftype);
            // } else if (this.name == "remove") {
            //     that.confirmInfoDialog.show("您确定删除该文件吗？（请谨慎操作，不可恢复）");
            // }
        }, false);
        /**
         * Currently we have 12 data types:
         * "Integer": "整数","Double": "小数","Boolean": "真假值","String": "字符串",
         * "DateTime": "日期时间","Date": "日期","Time": "时间","TimeDuration": "时间区间",
         * "Currency": "货币","JSONData": "JSON数据","File": "文件","Handwriting": "写字板"
         */
        if (datatype == "Integer" || datatype == "Double" ||
            datatype == "Currency" || datatype == "DateTime" ||
            datatype == "Date" || datatype == "Time" || datatype == "Boolean") {
            this.addOptions(select, "等于", "eq", 0);
            this.addOptions(select, "不等于", "neq", 0);
            this.addOptions(select, "大于", "gt", 1);
            this.addOptions(select, "大于等于", "gteq", 2);
            this.addOptions(select, "小于等于", "lteq", 3);
            this.addOptions(select, "小于", "lt", 4);
            this.addOptions(select, "类似于", "like", 5);
            this.addOptions(select, "不类似于", "notlike", 6);
            this.addOptions(select, "为空值", "isnull", 7);
            this.addOptions(select, "不为空值", "notnull", 8);
            this.addOptions(select, "在..之中", "in", 8);
            this.addOptions(select, "不在..之中", "notin", 9);
            this.addOptions(select, "在两者之间", "between", 10);
            this.addOptions(select, "不在两者之间", "notbetween", 11);
        } else if (datatype == "String") {
            this.addOptions(select, "等于", "eq", 0);
            this.addOptions(select, "类似于", "like", 1);
            this.addOptions(select, "不类似于", "notlike", 2);
            this.addOptions(select, "是空串", "nullstr", 3);
            this.addOptions(select, "不是空串", "notnullstr", 4);
            this.addOptions(select, "为空值", "isnull", 5);
            this.addOptions(select, "不为空值", "notnull", 6);
            this.addOptions(select, "在..之中", "in", 7);
            this.addOptions(select, "不在..之中", "notin", 8);
            this.addOptions(select, "在两者之间", "between", 9);
            this.addOptions(select, "不在两者之间", "notbetween", 10);
        }
        return select;
    };

    Editor.prototype.addOptions = function (parent, title, value, index) {
        var option = document.createElement("option");
        option.text = title;
        option.value = value;
        parent.options.add(option, index);
    };

    Editor.prototype.createValue = function (parent, datatype) {
        var input = document.createElement("INPUT");
        parent.appendChild(input);
        input.className = "form-control";
        input.style.padding = "0px";
        input.style.paddingLeft = "12px";
        input.style.paddingRight = "12px";
        return input;
    };

    // Editor.prototype.doNoAction = function (evt) {
    //     Utils.stopBubble(evt);
    //     this.confirmInfoDialog.hide();
    // };
    //
    // Editor.prototype.doYesAction = function (evt) { // 确认删除文件
    //     Utils.stopBubble(evt);
    //     $("progressbar").show();
    //     this.confirmInfoDialog.hide();
    //     var that = this;
    //     $("#progressbar").show();
    //     $.post(service.api(6, this.options.owner), {
    //         id: that.delfileid,// process instance Id
    //     }).complete(function (data) {
    //         that.refresh();
    //         $("#progressbar").hide();
    //     });
    // };

    Editor.prototype.addFieldListHeader = function () {
        var header = this.fieldlist.createTHead();
        var row = header.insertRow(0);
        var th = this.createHead("全选&nbsp;&nbsp;", row);
        this.createCheckbox(th, "allSel", this.options.currObject.id, this.options.currObject.id);
        this.createHead("序号", row);
        this.createHead("字段名称", row);
        this.createHead("字段类型", row);
        this.createHead("是否是数组", row);
        this.createHead("运算符", row);
        this.createHead("值", row);
    };

    Editor.prototype.createCell = function (no, content, row) {
        var cell = row.insertCell(no);
        cell.setAttribute("nowrap", "true");
        if (content != null || content != "")
            cell.innerHTML = content;
        return cell;
    };

    Editor.prototype.createHead = function (content, row) {
        var th = document.createElement('th');
        th.setAttribute("nowrap", "true");
        th.innerHTML = content;
        row.appendChild(th);
        return th;
    };

    Editor.prototype.createCheckbox = function (parent, name, rpId, varId) {
        var button = document.createElement("Input");
        parent.appendChild(button);
        button.name = name + rpId;
        button.type = "checkbox";
        button.value = varId;
        if (this.options.currObject.queryCondition.length > 0) {
            for (var i = 0; i < this.options.currObject.queryCondition.length; i++) {
                if (this.options.currObject.queryCondition[i].varId == varId) {
                    button.checked = true;
                    break;
                }
            }
        }
        var rid = rpId;
        var that = this;
        button.addEventListener("click", function (e) {
            var row = this.parentNode.parentNode;
            //var key = row.getAttribute("key");
            var selects = []
            if (this.name == "allSel" + rid) {
                var ch = document.getElementsByName("qcondition" + rid);
                var sels = [];
                if (this.checked) {
                    for (var i = 0; i < ch.length; i++) {
                        ch[i].checked = true;
                        var cond = new QueryCondition();
                        cond.id = "";
                        cond.vid = ch[i].value;
                        cond.operator = "";
                        cond.value = "";
                        sels.push(cond);
                    }
                } else {
                    for (var i = 0; i < ch.length; i++) {
                        ch[i].checked = false;
                    }
                    sels = [];
                }
                selects = sels;
            } else if (this.name == "qcondition" + rid) {
                var sels = [];
                // clone one for the reference.
                for (var k = 0; k < that.options.currObject.queryCondition.length; k++) {
                    sels.push(that.options.currObject.queryCondition[k].clone());
                }
                if (this.checked) {
                    var cond = new QueryCondition();
                    cond.id = "";
                    cond.vid = this.value;
                    cond.operator = "";
                    cond.value = "";
                    sels.push(cond);
                } else {
                    for (var i = 0; i < sels.length; i++) {
                        if (this.value == sels[i].vid) {
                            sels.splice(i, 1);
                            break;
                        }
                    }
                }
                selects = sels;
            }
            that.stack.execute(new BDMChangeQueryConditionCmd(that.options.currObject, selects));
        }, false);
        return button;
    };

    Editor.prototype.initLeftList = function () {
        // document.createElement('tbody');
        for (var i = 0; i < this.pageSize; i++) {
            var row = this.list.insertRow(i);
            for (var j = 0; j < 7; j++) {
                var cell1 = row.insertCell(j);
                cell1.innerHTML = "&nbsp;";
            }
        }
    };

    Editor.prototype.handleEvent = function (e) {
        switch (e.type) {
            case "click":
                this.doClick(e);
                break;
        }
        Utils.stopBubble(e);
    };

    Editor.prototype.doClick = function (evt) {
        if (evt.target.tagName == "TD") {
            var tbody = evt.target.parentElement.parentElement;
            this.clearProcessSheet(tbody);
            evt.target.parentElement.style.background = "#d1d1e0";
            var r = evt.target.parentElement;
            this.selectRow(r.getAttribute("key"), tbody);
            var table = tbody.parentElement;
            if (table == this.fieldlist) {
                this.leftSelectedIndex = r.getAttribute("key");
            }
        }
    };

    Editor.prototype.selectRow = function (id) {
        if (this.fieldlist.rows.length > 1) {
            for (var i = 0; i < this.fieldlist.rows.length; i++) {
                if (this.fieldlist.rows[i].getAttribute("key") == id) {
                    this.fieldlist.rows[i].style.background = "#d1d1e0";
                    this.leftSelectedRowNum = i + 1;
                    break;
                }
            }
        }
    };

    Editor.prototype.clearProcessSheet = function (table) {
        if (table.rows.length > 0) {
            for (var i = 0; i < table.rows.length; i++) {
                table.rows[i].style.background = "";
            }
        }
        this.leftSelectedRowNum = -1;
    };

    $.fn[pluginName] = function (options) {
        return this.each(function () {
            if (!$.data(this, pluginName)) {
                $.data(this, pluginName, new Editor(this, options));
            } else if ($.isFunction(Plugin.prototype[options])) {
                $.data(this, pluginName)[options]();
            }
        });
    };

})(jQuery, window, document);