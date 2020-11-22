;
(function ($, window, document, undefined) {
    var pluginName = "reportFieldsEditor";
    var defaults = {
        id: "",
        pid: "",// report service ID
        basicpropsheet: "",
        propsheet: "",
        width: 0,
        height: 0,
        parent: "",
        currObject: "",
        owner: "",
    };

    var Editor = function (element, options) {
        this.element = element;
        this.options = $.extend({
            id: "",
            pid: "",// released process
            basicpropsheet: "",
            propsheet: "",
            width: 0,
            height: 0,
            parent: "",
            currObject: "",
            owner: "",
        }, defaults, options);
        this._defaults = defaults;
        this._name = pluginName;
        this.stack = options.parent.stack;
        this.currObject = null;
        this.leftSelectedIndex = null;
        this.rightSelectedIndex = null;
        this.rightSelectedRowNum = -1;
        this.basicpropsheet = options.basicpropsheet;
        this.propsheet = options.propsheet;
        this.pageSize = 30;
        this.initMainPanel(options);
    };

    Editor.prototype.getDirty = function () {
        return this.stack.isDirty();
    };

    Editor.prototype.initMainPanel = function (options) {
        var editorPanel = document.createElement("DIV");
        this.element.appendChild(editorPanel);
        editorPanel.style.margin = "0px";
        editorPanel.style.padding = "0px";
        editorPanel.style.overflow = "auto";

        var searchRow = document.createElement("DIV");
        editorPanel.appendChild(searchRow);
        searchRow.className = "row";
        searchRow.style.margin = "0px";
        searchRow.style.marginTop = "2px";
        searchRow.style.padding = "0px";

        var sleftDiv = document.createElement("DIV");
        searchRow.appendChild(sleftDiv);
        sleftDiv.className = "col-lg-5 col-md-5 col-sm-5 col-xs-5";
        sleftDiv.style.margin = "0px";
        sleftDiv.style.padding = "0px";

        // 左边搜索框
        this.searchLeft = document.createElement("input");
        sleftDiv.appendChild(this.searchLeft);
        this.searchLeft.type = "text";
        this.searchLeft.className = "form-control";
        this.searchLeft.setAttribute("placeholder", "搜索...");
        this.searchLeft.addEventListener('input', this, false);// 为回车键加监听事件

        var smiddleDiv = document.createElement("DIV");
        searchRow.appendChild(smiddleDiv);
        smiddleDiv.className = "col-lg-2 col-md-2 col-sm-2 col-xs-2";
        smiddleDiv.style.margin = "0px";
        smiddleDiv.style.padding = "0px";

        var srightDiv = document.createElement("DIV");
        searchRow.appendChild(srightDiv);
        srightDiv.className = "col-lg-5 col-md-5 col-sm-5 col-xs-5";
        srightDiv.style.margin = "0px";
        srightDiv.style.padding = "0px";

        this.searchRight = document.createElement("input");
        srightDiv.appendChild(this.searchRight);
        this.searchRight.type = "text";
        this.searchRight.className = "form-control";
        this.searchRight.setAttribute("placeholder", "搜索...");
        this.searchRight.addEventListener('input', this, false);// 为回车键加监听事件

        var contentRow = document.createElement("DIV");
        editorPanel.appendChild(contentRow);
        contentRow.className = "row";
        contentRow.style.margin = "0px";
        contentRow.style.marginTop = "2px";
        contentRow.style.padding = "0px";
        var leftDiv = document.createElement("DIV");
        contentRow.appendChild(leftDiv);
        leftDiv.className = "col-lg-5 col-md-5 col-sm-5 col-xs-5 table-responsive";
        leftDiv.style.margin = "0px";
        leftDiv.style.padding = "0px";
        leftDiv.id = "leftlist" + options.pid;

        leftDiv.style.border = "1px solid #ddd";
        if (options.height > 34)
            leftDiv.style.height = (options.height - 34) + "px";
        else
            leftDiv.style.height = "0px";
        leftDiv.style.borderRadius = "4px";
        leftDiv.style.overflowY = "auto";

        this.list = document.createElement("table");
        leftDiv.appendChild(this.list);
        this.list.className = "table table-striped table-hover";

        var middleDiv = document.createElement("DIV");
        contentRow.appendChild(middleDiv);
        middleDiv.className = "col-lg-2 col-md-2 col-sm-2 col-xs-2";
        middleDiv.style.margin = "0px";
        middleDiv.style.padding = "0px";
        middleDiv.id = "middlelist" + options.pid;
        if (options.height > 34)
            middleDiv.style.height = (options.height - 34) + "px";
        else
            middleDiv.style.height = "0px";
        middleDiv.style.overflowY = "auto";

        // ------------------------------------
        this.createMiddleButtons(middleDiv);
        this.disableButton(this.removeAllButton);
        this.disableButton(this.removeOneButton);
        this.disableButton(this.addOneButton);
        this.disableButton(this.addAllButton);
        // ------------------------------------

        var rightDiv = document.createElement("DIV");
        contentRow.appendChild(rightDiv);
        rightDiv.className = "table-responsive col-lg-5 col-md-5 col-sm-5 col-xs-5";
        rightDiv.id = "rightlist" + options.pid;
        rightDiv.style.margin = "0px";
        rightDiv.style.padding = "0px";
        rightDiv.style.border = "1px solid #ddd";
        if (options.height > 34)
            rightDiv.style.height = (options.height - 34) + "px";
        else
            rightDiv.style.height = "0px";
        rightDiv.style.borderRadius = "4px";
        rightDiv.style.overflowY = "auto";

        this.rightlist = document.createElement("table");
        rightDiv.appendChild(this.rightlist);
        this.rightlist.className = "table table-striped table-hover";

        this.loadLeftData(options.currObject);
        this.loadRightData(options.currObject);
        this.setButtonStatus();
    };

    Editor.prototype.refresh = function () {
        this.loadLeftData(this.options.currObject);
        this.loadRightData(this.options.currObject);
        this.setButtonStatus();
    };

    // create <<, <, >, >> buttons
    Editor.prototype.createMiddleButtons = function (listDiv) {
        var middleDiv = document.createElement("center");
        listDiv.appendChild(middleDiv);

        var addAllButtonDiv = document.createElement("DIV");
        middleDiv.appendChild(addAllButtonDiv);
        addAllButtonDiv.style.padding = "2px";

        this.addAllButton = document.createElement("button");
        addAllButtonDiv.appendChild(this.addAllButton);
        this.addAllButton.id = "addAllButton" + this.options.pid;
        this.addAllButton.className = "btn btn-primary ";
        this.addAllButton.addEventListener('click', this, false);
        var icon4 = document.createElement("i");
        this.addAllButton.appendChild(icon4);
        icon4.id = "addAllButtonI" + this.options.pid;
        icon4.className = "fa fa-angle-double-right";
        icon4.setAttribute("aria-hidden", "true");
        icon4.setAttribute("title", "添加所有字段");

        var addOneButtonDiv = document.createElement("DIV");
        middleDiv.appendChild(addOneButtonDiv);
        addOneButtonDiv.style.padding = "2px";

        this.addOneButton = document.createElement("button");
        addOneButtonDiv.appendChild(this.addOneButton);
        this.addOneButton.id = "addOneButton" + this.options.pid;
        this.addOneButton.className = "btn btn-primary ";
        this.addOneButton.style.width = "34px";
        this.addOneButton.addEventListener('click', this, false);
        var icon3 = document.createElement("i");
        this.addOneButton.appendChild(icon3);
        icon3.id = "addOneButtonI" + this.options.pid;
        icon3.className = "fa fa-angle-right";
        icon3.setAttribute("aria-hidden", "true");
        icon3.setAttribute("title", "添加一个字段");

        var removeOneButtonDiv = document.createElement("DIV");
        middleDiv.appendChild(removeOneButtonDiv);
        removeOneButtonDiv.style.padding = "2px";

        this.removeOneButton = document.createElement("button");
        removeOneButtonDiv.appendChild(this.removeOneButton);
        this.removeOneButton.id = "removeOneButton" + this.options.pid;
        this.removeOneButton.className = "btn btn-primary ";
        this.removeOneButton.style.width = "34px";
        this.removeOneButton.addEventListener('click', this, false);
        var icon2 = document.createElement("i");
        this.removeOneButton.appendChild(icon2);
        icon2.id = "removeOneButtonI" + this.options.pid;
        icon2.className = "fa fa-angle-left";
        icon2.setAttribute("aria-hidden", "true");
        icon2.setAttribute("title", "移除一个字段");

        var removeAllButtonDiv = document.createElement("DIV");
        middleDiv.appendChild(removeAllButtonDiv);
        removeAllButtonDiv.style.padding = "2px";

        this.removeAllButton = document.createElement("button");
        removeAllButtonDiv.appendChild(this.removeAllButton);
        this.removeAllButton.id = "removeAllButton" + this.options.pid;
        this.removeAllButton.className = "btn btn-primary ";
        this.removeAllButton.addEventListener('click', this, false);
        var icon1 = document.createElement("i");
        this.removeAllButton.appendChild(icon1);
        icon1.id = "removeAllButtonI" + this.options.pid;
        icon1.className = "fa fa-angle-double-left";
        icon1.setAttribute("aria-hidden", "true");
        icon1.setAttribute("title", "移除所有字段");

    };

    Editor.prototype.loadLeftData = function (obj) {
        $(this.list).children().remove();
        if (obj.children != null && obj.children.length > 0) {
            for (var i = 0; i < obj.children.length; i++) {
                var child = obj.children[i];
                var row = this.list.insertRow(-1);
                row.setAttribute("key", child.id);
                row.addEventListener("click", this, false);
                this.createCell(0, (i + 1) + "", row);
                this.createCell(1, child.name, row);
                this.createCell(2, datatype[child.datatype], row);
            }
            if (obj.children.length < this.pageSize) {
                for (var i = obj.children.length; i < this.pageSize; i++) {
                    var row = this.list.insertRow(i);
                    for (var j = 0; j < 3; j++) {
                        this.createCell(j, "&nbsp;", row);
                    }
                }
            }
        } else {
            this.initLeftList();
        }
        this.addLeftHeader();
    };

    Editor.prototype.loadRightData = function (obj) {
        $(this.rightlist).children().remove();
        if (obj.reportDefinition != null && obj.reportDefinition.length > 0) {
            for (var i = 0; i < obj.reportDefinition.length; i++) {
                var child = obj.reportDefinition[i];
                var row = this.rightlist.insertRow(-1);
                row.setAttribute("key", child.id);
                row.setAttribute("order", "" + (i + 1));
                row.addEventListener("click", this, false);
                this.createCell(0, (i + 1) + "", row);
                this.createCell(1, child.name, row);
            }
            if (obj.reportDefinition.length < this.pageSize) {
                for (var i = obj.reportDefinition.length; i < this.pageSize; i++) {
                    var row = this.rightlist.insertRow(i);
                    for (var j = 0; j < 2; j++) {
                        this.createCell(j, "&nbsp;", row);
                    }
                }
            }
            if (this.rightSelectedIndex != null) {
                this.selectRow(this.rightSelectedIndex, this.rightlist);
            }
        } else {
            this.initRightList();
        }
        this.addRightHeader();
    };

    Editor.prototype.setButtonStatus = function () {
        if (this.options.currObject.children.length > 0) {
            this.enableButton(this.addAllButton);
            if (this.leftSelectedIndex != null) {
                this.enableButton(this.addOneButton);
            } else {
                this.disableButton(this.addOneButton);
            }
        } else {
            this.disableButton(this.addAllButton);
            this.disableButton(this.addOneButton);
        }
        if (this.options.currObject.reportDefinition.length > 1) {
            this.enableButton(this.removeAllButton);
            if (this.rightSelectedIndex != null) {
                this.enableButton(this.removeOneButton);
            } else {
                this.disableButton(this.removeOneButton);
            }
        } else {
            this.disableButton(this.removeOneButton);
            this.disableButton(this.removeAllButton);
        }
    }

    Editor.prototype.addLeftHeader = function () {
        var header = this.list.createTHead();
        var row = header.insertRow(0);
        this.createHead("序号", row);
        this.createHead("字段名称", row);
        this.createHead("字段类型", row);
    };

    Editor.prototype.addRightHeader = function () {
        var header = this.rightlist.createTHead();
        var row = header.insertRow(0);
        this.createHead("序号", row);
        this.createHead("显示字段", row);
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
    };

    Editor.prototype.initLeftList = function () {
        for (var i = 0; i < this.pageSize; i++) {
            var row = this.list.insertRow(i);
            for (var j = 0; j < 3; j++) {
                var cell1 = row.insertCell(j);
                cell1.innerHTML = "&nbsp;";
            }
        }
    };

    Editor.prototype.initRightList = function () {
        for (var i = 0; i < this.pageSize; i++) {
            var row = this.rightlist.insertRow(i);
            for (var j = 0; j < 3; j++) {
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
            case "input":
                this.doKeydown(e);
                break;
        }
        Utils.stopBubble(e);
    };

    Editor.prototype.doKeydown = function (evt) {
        var e = window.event ? window.event : (evt ? evt : arguments[0]);
        var key = e.keyCode || e.which;
        if (evt.target == this.searchLeft) {
            $(this.list).children().remove();
            this.searchLeftValue(this.searchLeft.value);
        } else if (evt.target == this.searchRight) {
            $(this.rightlist).children().remove();
            this.searchRightValue(this.searchRight.value);
        }
        return false;
    };

    Editor.prototype.searchLeftValue = function (value) {
        if (value != "") {
            var lst = this.options.currObject.searchLeftList(value);
            if (lst != null && lst.length > 0) {
                for (var i = 0; i < lst.length; i++) {
                    var child = lst[i];
                    // child is DataVariable
                    var row = this.list.insertRow(-1);
                    row.setAttribute("key", "" + (i + 1));
                    row.addEventListener("click", this, false);
                    this.createCell(0, (i + 1) + "", row);
                    this.createCell(1, child.name, row);
                    this.createCell(2, datatype[child.datatype], row);
                }
                if (lst.length < this.pageSize) {
                    for (var i = lst.length; i < this.pageSize; i++) {
                        var row = this.list.insertRow(i);
                        for (var j = 0; j < 3; j++) {
                            this.createCell(j, "&nbsp;", row);
                        }
                    }
                }
            } else {
                this.initLeftList();
            }
            this.addLeftHeader();
        } else {
            this.loadLeftData(this.options.currObject);
        }
    };

    Editor.prototype.searchRightValue = function (value) {
        if (value != "") {
            var lst = this.options.currObject.searchRightList(value);
            if (lst != null && lst.length > 0) {
                for (var i = 0; i < lst.length; i++) {
                    var child = lst[i];
                    //child is ReportField
                    var row = this.rightlist.insertRow(-1);
                    row.setAttribute("key", "" + (i + 1));
                    row.addEventListener("click", this, false);
                    this.createCell(0, (i + 1) + "", row);
                    this.createCell(1, child.name, row);
                }
                if (lst.length < this.pageSize) {
                    for (var i = lst.length; i < this.pageSize; i++) {
                        var row = this.rightlist.insertRow(i);
                        for (var j = 0; j < 2; j++) {
                            this.createCell(j, "&nbsp;", row);
                        }
                    }
                }
            } else {
                this.initRightList();
            }
            this.addRightHeader();
        } else {
            this.loadRightData(this.options.currObject);
        }
    };

    Editor.prototype.doClick = function (evt) {
        evt.preventDefault();
        if (evt.target == this.removeAllButton
            || evt.target.id == "removeAllButton" + this.options.pid
            || evt.target.id == "removeAllButtonI" + this.options.pid) {
            this.stack.execute(new BDMRemoveAllCmd(this.options.currObject, []));
        } else if (evt.target == this.removeOneButton
            || evt.target.id == "removeOneButton" + this.options.pid
            || evt.target.id == "removeOneButtonI" + this.options.pid) {
            for (var k = 0; k < this.options.currObject.reportDefinition.length; k++) {
                if (this.rightSelectedIndex == this.options.currObject.reportDefinition[k].id) {
                    this.stack.execute(new BDMRemoveOneCmd(this.options.currObject,
                        this.options.currObject.reportDefinition[k], k));
                    break;
                }
            }
        } else if (evt.target == this.addOneButton
            || evt.target.id == "addOneButton" + this.options.pid
            || evt.target.id == "addOneButtonI" + this.options.pid) {
            var f = false;
            for (var k = 0; k < this.options.currObject.reportDefinition.length; k++) {
                if (this.leftSelectedIndex == this.options.currObject.reportDefinition[k].id) {
                    f = true;
                    break;
                }
            }
            if (!f) {
                for (var i = 0; i < this.options.currObject.children.length; i++) {
                    var v = this.options.currObject.children[i];
                    if (this.leftSelectedIndex == v.id) {
                        var field = new ReportField();
                        field.id = v.id;
                        field.name = v.name;
                        this.stack.execute(new BDMAddOneCmd(this.options.currObject, field));
                        break;
                    }
                }
            }
        } else if (evt.target == this.addAllButton
            || evt.target.id == "addAllButton" + this.options.pid
            || evt.target.id == "addAllButtonI" + this.options.pid) {
            if (this.options.currObject.children.length > 0) {
                var fields = [];
                for (var i = 0; i < this.options.currObject.children.length; i++) {
                    var v = this.options.currObject.children[i];
                    var field = new ReportField();
                    field.id = v.id;
                    field.name = v.name;
                    fields.push(field);
                }
                this.stack.execute(new BDMAddAllCmd(this.options.currObject, fields));
            }
        } else if (evt.target.tagName == "TD") {
            var tbody = evt.target.parentElement.parentElement;
            this.clearProcessSheet(tbody);
            evt.target.parentElement.style.background = "#d1d1e0";
            var r = evt.target.parentElement;
            this.selectRow(r.getAttribute("key"), tbody);
            var table = tbody.parentElement;
            if (table == this.list) {
                this.leftSelectedIndex = r.getAttribute("key");
            } else if (table == this.rightlist) {
                this.rightSelectedIndex = r.getAttribute("key");
                this.rightSelectedRowNum = parseInt(r.getAttribute("order"));
                if (this.rightSelectedRowNum == 1) {
                    this.options.parent.disableButton(this.options.parent.upbutton);
                    this.options.parent.enableButton(this.options.parent.downbutton);
                } else if (this.rightSelectedRowNum == this.options.currObject.reportDefinition.length) {
                    this.options.parent.enableButton(this.options.parent.upbutton);
                    this.options.parent.disableButton(this.options.parent.downbutton);
                } else {
                    this.options.parent.enableButton(this.options.parent.upbutton);
                    this.options.parent.enableButton(this.options.parent.downbutton);
                }

            }
            this.setButtonStatus();
        }
    };

    Editor.prototype.moveOneUp = function () {
        if (this.rightSelectedRowNum - 1 > 0) {
            this.stack.execute(new BDMMoveOneUpCmd(this.options.currObject, this.rightSelectedRowNum - 1));
        } else {
            this.options.parent.disableButton(this.options.parent.upbutton);
            this.options.parent.enableButton(this.options.parent.downbutton);
        }
    };

    Editor.prototype.moveOneDown = function () {
        if (this.rightSelectedRowNum - 1 < this.options.currObject.reportDefinition.length - 1) {
            this.stack.execute(new BDMMoveOneDownCmd(this.options.currObject, this.rightSelectedRowNum - 1));
        } else {
            this.options.parent.enableButton(this.options.parent.upbutton);
            this.options.parent.disableButton(this.options.parent.downbutton);
        }
    };


    Editor.prototype.selectRow = function (id, table) {
        if (table.rows.length > 1) {
            for (var i = 0; i < table.rows.length; i++) {
                if (table.rows[i].getAttribute("key") == id) {
                    table.rows[i].style.background = "#d1d1e0";
                    this.rightSelectedRowNum = i + 1;
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
        this.rightSelectedRowNum = -1;
    };

    Editor.prototype.enableButton = function (button) {
        button.removeAttribute("disabled");
    };

    Editor.prototype.disableButton = function (button) {
        button.setAttribute("disabled", "true");
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