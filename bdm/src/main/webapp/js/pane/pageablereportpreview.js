;
(function ($, window, document, undefined) {
    var pluginName = "pageableReportServicePreview";
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
            pid: "",// report service ID
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
        this.currPage = null; // 装载后的原始数据都存在这里
        this.pagesize = 30;
        this.selectIndex = -1;
        this.delfileid = null;

        this.initMainPanel(options);
    };

    Editor.prototype.initMainPanel = function (options) {
        var editorPanel = document.createElement("DIV");
        this.element.appendChild(editorPanel);
        editorPanel.style.margin = "0px";
        editorPanel.style.padding = "0px";
        editorPanel.style.overflow = "auto";

        this.toolbarRow = document.createElement("DIV");
        editorPanel.appendChild(this.toolbarRow);
        this.toolbarRow.className = "row";
        this.toolbarRow.style.margin = "0px";
        this.toolbarRow.style.padding = "0px";

        var painterRow = document.createElement("DIV");
        editorPanel.appendChild(painterRow);
        painterRow.className = "row";
        painterRow.style.margin = "0px";
        painterRow.style.marginTop = "2px";
        painterRow.style.padding = "0px";

        var tableDivPane = document.createElement("DIV");
        painterRow.appendChild(tableDivPane);
        tableDivPane.className = "col-lg-12 col-md-12 col-sm-12 col-xs-12 table-responsive";
        tableDivPane.id = "pageablepreviewertable" + options.pid;
        tableDivPane.style.margin = "0px";
        tableDivPane.style.padding = "0px";
        tableDivPane.style.border = "1px solid #ddd";
        tableDivPane.style.height = (options.height - 40) + "px";
        tableDivPane.style.borderRadius = "4px";
        tableDivPane.style.overflowY = "auto";
        this.list = document.createElement("table");
        tableDivPane.appendChild(this.list);
        this.list.className = "table table-striped table-hover";

        this.createToolbar();

        // confirm message dialog plugin
        if ($(this.element).confirmInfoDialog != undefined) {
            var p2 = $(this.element).confirmInfoDialog({ // 确认对话框
                id: "00568A" + options.id,
                title: vendor + " - 提示",
                parent: this,
            });
            this.confirmInfoDialog = p2.data("confirmInfoDialog");
        }

        if ($(this.element).launchProcessInstanceDlg != undefined) {
            var p2 = $(this.element).launchProcessInstanceDlg({ // 确认对话框
                id: "00568A" + options.id,
                title: vendor + " - 提示",
                parent: this,
            });
            this.launchProcessInstanceDlg = p2.data("launchProcessInstanceDlg");
        }

    };

    Editor.prototype.refresh = function () {
        this.loadData(this.options, "", this.search.value,
            this.currPage.pageNo, this.pagesize);
    };

    Editor.prototype.initialize = function () {
        this.loadData(this.options, "", this.search.value,
            "1", this.pagesize);
    };

    Editor.prototype.generate = function () {
        this.generateData(this.options);
    };

    Editor.prototype.loadData = function (options, condition, search, pageno, pagesize) {
        var that = this;
        $("#progressbar").show();
        $.getJSON(service.api(9, options.owner), {
            id: options.pid,// report service Id
            condition: condition, // query condition string
            search: search,
            pageno: pageno,
            pagesize: pagesize,
        }).complete(function (data) {
            that.loadReport(data.responseJSON);
            $("#progressbar").hide();
        });
    };

    Editor.prototype.generateData = function (options) {
        var that = this;
        $("#progressbar").show();
        var fd = new FormData();
        fd.append('id', this.options.currObject.id);
        fd.append('condition', "");
        fd.append('search', "");
        fd.append('filename', this.options.currObject.name);
        var xhh = new XMLHttpRequest();
        xhh.open("post", service.api(4), true);
        xhh.responseType = 'blob'
        xhh.onreadystatechange = function() {
            if (xhh.readyState == 4) {
                if (xhh.status == 200) {
                    var contenttype = xhh.getResponseHeader("Content-Type");
                    var name = xhh.getResponseHeader("Content-disposition");
                    if (name != null) {
                        var filename = name.substring(21, name.length);
                        filename = decodeURI(filename, "utf-8");
                        that.saveFile(this.response, filename, contenttype);
                    }
                }
            }
            $("#progressbar").hide();
        };
        xhh.send(fd);
    };

    Editor.prototype.saveFile = function(blob, fileName, contenttype) {
        var b = Utils.getBrowserType();
        if (b == "Chrome") {
            var link = document.createElement('a');
            var file = new Blob([ blob ], {
                type : contenttype
            });
            link.href = window.URL.createObjectURL(file);
            link.download = fileName;
            link.click();
        } else if (b == "FF") {
            var file = new File([ blob ], fileName, {
                type : contenttype
            });
            var url = URL.createObjectURL(file);
            // window.location.href = url;
            parent.location.href = url;
        } else if (Utils.isIE()) {
            var file = new Blob([ blob ], {
                type : 'application/force-download'
            });
            window.navigator.msSaveBlob(file, fileName);
        }
    };

    Editor.prototype.loadReport = function (jsonobj) {
        $(this.list).children().remove();
        if (jsonobj != null) {
            this.currPage = new ReportPage();
            this.currPage.parseFromJSON(jsonobj);
            if (this.currPage.pageEntities != null
                && this.currPage.pageEntities.length > 0) {
                var objs = this.currPage.pageEntities;
                if (objs != null && objs.length > 0) {
                    for (var i = 0; i < objs.length; i++) {
                        var r = objs[i];
                        var row = this.list.insertRow(-1);
                        row.setAttribute("key", this.currPage.id + r.instanceId);
                        row.setAttribute("wftype", r.workflowType);
                        row.addEventListener("click", this, false);
                        row.setAttribute("pid", r.instanceId);
                        //row.addEventListener("dblclick", this, false);
                        for (var j = 0; j < r.children.length; j++) {
                            this.createCell(j, r.children[j].cellContent, row);
                        }
                        var cell = this.createCell(r.children.length, null, row);
                        // this.createIcon(cell, this.currPage.id + "0" + r.instanceId, "fa fa-search fa-lg",
                        //     "review", "查看", "btn-primary");
                        this.createIcon(cell, this.currPage.id + "1" + r.instanceId,
                            "fa fa-pencil-square-o fa-lg","modify", "修改", "btn-primary");
                        this.createIcon(cell, this.currPage.id + "2" + r.instanceId,
                            "fa fa-trash-o fa-lg","remove", "删除", "btn-danger");
                    }
                }
                if (objs.length < this.pagesize) {
                    for (var i = objs.length; i < this.pagesize; i++) {
                        var row = this.list.insertRow(i);
                        for (var j = 0; j < this.currPage.titles.length; j++) {
                            this.createCell(j, "&nbsp;", row);
                        }
                        this.createCell(this.currPage.titles.length, null, row);
                    }
                }
            } else {
                this.initList(this.options);
            }
        } else {
            this.initList(this.options);
        }
        this.addListHeader(this.options);
        this.pageno.innerHTML = "第" + this.currPage.pageNo + "页";
        this.totalpage.innerHTML = "/共" + this.currPage.allPagesCount + "页";
        if (this.currPage.allPagesCount <= 1) {
            this.disableButton(this.firstPageHButton);
            this.disableButton(this.previousPageHButton);
            this.disableButton(this.nextPageHButton);
            this.disableButton(this.lastPageHButton);
        } else if (this.currPage.allPagesCount > 1) {
            if (this.currPage.pageNo == 1) {
                this.disableButton(this.firstPageHButton);
                this.disableButton(this.previousPageHButton);
                this.enableButton(this.nextPageHButton);
                this.enableButton(this.lastPageHButton);
            } else if (this.currPage.pageNo == this.currPage.allPagesCount) {
                this.enableButton(this.firstPageHButton);
                this.enableButton(this.previousPageHButton);
                this.disableButton(this.nextPageHButton);
                this.disableButton(this.lastPageHButton);
            } else if (this.currPage.pageNo > 1
                && this.currPage.pageNo < this.currPage.allPagesCount) {
                this.enableButton(this.firstPageHButton);
                this.enableButton(this.previousPageHButton);
                this.enableButton(this.nextPageHButton);
                this.enableButton(this.lastPageHButton);
            }
        }
        if (this.currPage.pageEntities.length > 0) {
            var f = false;
            if (objs != null && objs.length > 0) {
                for (var i = 0; i < objs.length; i++) {
                    if (objs[i] != null && this.currPage.id + objs[i].instanceId == this.selectIndex) {
                        f = true;
                        break;
                    }
                }
            }
            if (f) {
                this.selectRow(this.selectIndex);
            } else {
                this.selectIndex = -1;
                this.selectRow(this.currPage.id + this.currPage.pageEntities[0].instanceId);
            }
        } else {
            this.selectIndex = -1;
        }
    };

    Editor.prototype.createIcon = function (parent, id, classname,
                                            name, title, style) {
        var button = document.createElement("BUTTON");
        parent.appendChild(button);
        button.id = id;
        button.name = name;
        button.className = "btn btn-default " + style;
        button.style.borderRadius = "15px";
        button.style.width = "29px";
        button.style.padding = "3px";
        button.title = title;
        var that = this;
        button.addEventListener("click", function (e) {
            var row = this.parentNode.parentNode;
            that.delfileid = row.getAttribute("pid");
            var wftype = row.getAttribute("wftype");
            if (this.name == "review") {

            } else if (this.name == "modify") {
                that.openEditor(that.delfileid, wftype);
            } else if (this.name == "remove") {
                that.confirmInfoDialog.show("您确定删除该文件吗？（请谨慎操作，不可恢复）");
            }
        }, false);
        var rmspan = document.createElement("SPAN");
        button.appendChild(rmspan);
        rmspan.className = classname;
        rmspan.name = name;
        rmspan.setAttribute("aria-hidden", "true");
        rmspan.setAttribute("data-toggle", "modal");
        rmspan.setAttribute("data-target", "myModal");
        rmspan.title = title;
        return rmspan;
    };

    Editor.prototype.getObjectById = function (id) {
        var objs = this.currPage.pageEntities;
        if (objs != null && objs.length > 0) {
            for (var i = 0; i < objs.length; i++) {
                if (objs[i] != null && this.currPage.id + objs[i].instanceId == id) {
                    return objs[i];
                }
            }
        }
        return null;
    };

    Editor.prototype.getCurrentSelected = function () {
        var objs = this.currPage.pageEntities;
        if (objs != null && objs.length > 0) {
            for (var i = 0; i < objs.length; i++) {
                if (objs[i] != null && this.currPage.id + objs[i].instanceId == this.selectIndex) {
                    return objs[i];
                }
            }
        }
        return null;
    };

    Editor.prototype.openEditor = function (piid, wftype) {
        this.launchProcessInstanceDlg.show(piid, wftype);
    };

    Editor.prototype.doNoAction = function (evt) {
        Utils.stopBubble(evt);
        this.confirmInfoDialog.hide();
    };

    Editor.prototype.doYesAction = function (evt) { // 确认删除文件
        Utils.stopBubble(evt);
        $("progressbar").show();
        this.confirmInfoDialog.hide();
        var that = this;
        $("#progressbar").show();
        $.post(service.api(6, this.options.owner), {
            id: that.delfileid,// process instance Id
        }).complete(function (data) {
            that.refresh();
            $("#progressbar").hide();
        });
    };

    Editor.prototype.addListHeader = function (options) {
        var header = this.list.createTHead();
        var row = header.insertRow(0);
        if (this.currPage != null) {
            for (var j = 0; j < this.currPage.titles.length; j++) {
                this.createHead(this.currPage.titles[j].name, row);
            }
            this.createHead("操作", row);
        }
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

    Editor.prototype.initList = function () {
        // document.createElement('tbody');
        for (var i = 0; i < this.pagesize; i++) {
            var row = this.list.insertRow(i);
            for (var j = 0; j <= this.currPage.titles.length; j++) {
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
            case "dblclick":
                this.doDblClick(e);
                break;
            case "keydown":
                this.doKeydown(e);
                break;
        }
        Utils.stopBubble(e);
    };

    Editor.prototype.doDblClick = function (evt) {
        if (evt.target.tagName == "TD") {
            this.tableList.focus();
        }
    };

    Editor.prototype.doClick = function (evt) {
        if (evt.target == this.firstPageHButton
            || (evt.target.id == ("firstPageS" + this.options.id))) {
            this.doNextPageAction(1);
            this.act = 1;
        } else if (evt.target == this.previousPageHButton
            || (evt.target.id == ("previousPageS" + this.options.id))) {
            this.doNextPageAction(this.currPage.pageNo - 1);
            this.act = 2;
        } else if (evt.target == this.nextPageHButton
            || (evt.target.id == ("nextPageS" + this.options.id))) {
            this.doNextPageAction(this.currPage.pageNo + 1);
            this.act = 3;
        } else if (evt.target == this.lastPageHButton
            || (evt.target.id == ("lastPageS" + this.options.id))) {
            this.doNextPageAction(this.currPage.allPagesCount);
            this.act = 4;
        } else if (evt.target == this.refreshHButton
            || (evt.target.id == ("refreshS" + this.options.id))) {
            this.doNextPageAction(this.currPage.pageNo);
            this.act = 5;
        } else if (evt.target == this.searchBtn
            || (evt.target.id == ("searchS" + this.options.id))) {
            this.doNextPageAction(1);
            this.act = 6;
        } else if (evt.target.tagName == "TD") {
            var table = evt.target.parentElement.parentElement;
            this.clearProcessSheet(table);
            evt.target.parentElement.style.background = "#d1d1e0";
            var r = evt.target.parentElement;
            this.selectRow(r.getAttribute("key"));
        }
    };

    Editor.prototype.doNextPageAction = function (pageno) {
        this.initialize();
    };

    Editor.prototype.doKeydown = function (evt) {
        var e = window.event ? window.event : (evt ? evt : arguments[0]);
        var key = e.keyCode || e.which;
        if (key == 13) {// 回车键
            evt.preventDefault();// 阻止该事件
            this.doNextPageAction(1);
            this.act = 6;
            return false;
        }
    };

    Editor.prototype.selectRow = function (id) {
        if (this.list.rows.length > 1) {
            for (var i = 0; i < this.list.rows.length; i++) {
                if (this.list.rows[i].getAttribute("key") == id) {
                    this.list.rows[i].style.background = "#d1d1e0";
                    break;
                }
            }
        }
    };

    Editor.prototype.createGroup = function (parent) {
        var group = document.createElement("DIV");
        group.className = "btn-group";
        group.style.padding = "2px";
        group.setAttribute("role", "group");
        group.setAttribute("aria-label", "");
        parent.appendChild(group);
        return group;
    };

    Editor.prototype.createToolbar = function () {
        var toolbarForm = document.createElement("form");
        toolbarForm.className = "form-inline";
        this.toolbarRow.appendChild(toolbarForm);

        var toolbarDiv = document.createElement("DIV");
        toolbarForm.appendChild(toolbarDiv);
        toolbarDiv.style.margin = "0px";
        toolbarDiv.style.padding = "2px";
        toolbarDiv.style.padding = "2px";
        this.createNavigationGroup(toolbarDiv);
        this.createSearchGroup(toolbarDiv);
    };

    Editor.prototype.createNavigationGroup = function (parent) {
        if (this.options.type != undefined
            && this.options.parent.addExtraButtons != undefined) {
            this.options.parent.addExtraButtons(parent);
        }

        var group1 = this.createGroup(parent);
        this.refreshHButton = this.createTool(group1, "refreshS"
            + this.options.id, "刷新", "btn btn-success", "i",
            "fa fa-refresh fa-lg");
        this.enableButton(this.refreshHButton);

        var group = this.createGroup(parent);
        this.firstPageHButton = this.createTool(group, "firstPageS"
            + this.options.id, "首页", "btn btn-default", "i",
            "fa fa-step-backward fa-lg");
        this.previousPageHButton = this.createTool(group, "previousPageS"
            + this.options.id, "前一页", "btn btn-default", "i",
            "fa fa-backward fa-lg");
        this.nextPageHButton = this.createTool(group, "nextPageS"
            + this.options.id, "后一页", "btn btn-default", "i",
            "fa fa-forward fa-lg");
        this.lastPageHButton = this.createTool(group, "lastPageS"
            + this.options.id, "末页", "btn btn-default", "i",
            "fa fa-step-forward fa-lg");
        this.disableButton(this.firstPageHButton);
        this.disableButton(this.previousPageHButton);
        this.disableButton(this.nextPageHButton);
        this.disableButton(this.lastPageHButton);

        var group2 = this.createGroup(parent);
        this.pageno = this.createLabel(group2, "Sl1" + this.options.id, "");
        this.totalpage = this.createLabel(group2, "Sl2" + this.options.id, "");

    };

    Editor.prototype.createLabel = function (group, id, title) {
        var label = document.createElement("Label");
        label.innerHTML = title;
        label.id = id;
        group.appendChild(label);
        return label;
    };

    Editor.prototype.createSearchGroup = function (parent) {
        var group = this.crateSGroup(parent);
        this.search = document.createElement("input");
        this.search.type = "text";
        this.search.className = "form-control";
        this.search.setAttribute("placeholder", "搜索...");
        this.search.addEventListener('keydown', this, false);// 为回车键加监听事件
        group.appendChild(this.search);

        var searchSpan = document.createElement("span");
        searchSpan.className = "input-group-btn";
        group.appendChild(searchSpan);

        this.searchBtn = this.createTool(searchSpan, "searchS"
            + this.options.id, "查找", "btn btn-primary", "i",
            "fa fa-search fa-lg");
    };

    Editor.prototype.createGroup = function (parent) {
        var group = document.createElement("DIV");
        group.className = "btn-group";
        group.style.padding = "2px";
        group.setAttribute("role", "group");
        group.setAttribute("aria-label", "");
        parent.appendChild(group);
        return group;
    };

    Editor.prototype.crateSGroup = function (parent) {
        var group = document.createElement("DIV");
        group.className = "input-group";
        group.style.padding = "2px";
        group.setAttribute("role", "search");
        group.setAttribute("aria-label", "");
        parent.appendChild(group);
        return group;
    };

    Editor.prototype.createTool = function (group, id, title, style,
                                            fonttag, fontclass) {
        var button = document.createElement("button");
        button.className = style;
        button.setAttribute("title", title);
        button.type = "button";
        button.id = id;
        button.addEventListener('click', this, false);
        group.appendChild(button);
        var icon = document.createElement(fonttag);
        icon.className = fontclass;
        icon.setAttribute("title", title);
        icon.id = id;
        button.appendChild(icon);
        return button;
    };

    Editor.prototype.enableButton = function (button) {
        button.disabled = false;
    };

    Editor.prototype.disableButton = function (button) {
        button.disabled = true;
    };

    Editor.prototype.clearProcessSheet = function (table) {
        if (table.rows.length > 0) {
            for (var i = 0; i < table.rows.length; i++) {
                table.rows[i].style.background = "";
            }
        }
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