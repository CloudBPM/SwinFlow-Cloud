/**
 *
 */
;
(function ($, window, document, undefined) {
    var pluginName = "pageableTableViewPlugin";
    var defaults = {
        id: "",
        rid : "",
        width: 0,
        height: 0,
    };

    var ListViewPanel = function (element, options) {
        this.element = element;
        this.options = $.extend({
            id: "",
            rid : "",
            width: 0,
            height: 0,
        }, defaults, options);
        this._defaults = defaults;
        this._name = pluginName;
        this.rptId = null;
        this.pagesize = 30;
        this.selectIndex = -1;
        // 0:no operation buttons;1: has operation buttons
        this.hasOperations = 0;
        this.hasViewButton = 0;// 0:no;1:has
        this.hasModifyButton = 0;// 0:no;1:has
        this.hasDeleteButton = 0;// 0:no;1:has
        this.init(options);
    };

    ListViewPanel.prototype.init = function (options) {
        var editorPanel = document.createElement("DIV");
        this.element.appendChild(editorPanel);
        editorPanel.style.margin = "0px";
        editorPanel.style.padding = "0px";
        editorPanel.style.overflow = "auto";
        editorPanel.id = "tablePanel" + options.rid;
        editorPanel.style.width = "100%";

        var toolbarRow = document.createElement("DIV");
        editorPanel.appendChild(toolbarRow);
        toolbarRow.className = "row";
        toolbarRow.style.margin = "0px";
        toolbarRow.style.padding = "0px";

        var painterRow = document.createElement("DIV");
        editorPanel.appendChild(painterRow);
        painterRow.className = "row";
        painterRow.style.margin = "0px";
        painterRow.style.padding = "0px";

        var tableDivPane = document.createElement("DIV");
        painterRow.appendChild(tableDivPane);
        tableDivPane.className = "col-lg-12 col-md-12 col-sm-12 col-xs-12";
        tableDivPane.id = "tablePane" + options.rid;
        tableDivPane.className = "table-responsive";
        tableDivPane.style.margin = "0px";
        tableDivPane.style.padding = "0px";
        tableDivPane.style.border = "1px solid #ddd";
        tableDivPane.style.height = options.height;
        tableDivPane.style.borderRadius = "4px";
        tableDivPane.style.overflowY = "auto";

        this.tableList = document.createElement("table");
        tableDivPane.appendChild(this.tableList);
        this.tableList.id = "table" + options.rid;
        this.tableList.className = "table table-striped table-hover";

        this.createToolbar(toolbarRow);

        var tableDivPane1 = document.createElement("DIV");
        this.element.appendChild(tableDivPane1);
        // confirm message dialog plugin
        if ($(tableDivPane1).deletionConfirmInfoDialog != undefined) {
            var p2 = $(tableDivPane1).deletionConfirmInfoDialog({ // 确认对话框
                id: "00568A" + options.rid,
                title: vendor + " - 提示",
            });
            this.deletionConfirmInfoDialog = p2.data("deletionConfirmInfoDialog");
        }

        if ($(tableDivPane1).launchProcessInstanceDlg != undefined) {
            var p2 = $(tableDivPane1).launchProcessInstanceDlg({ // 确认对话框
                id: "00568A" + options.rid,
                title: vendor + " - 提示",
            });
            this.launchProcessInstanceDlg = p2.data("launchProcessInstanceDlg");
        }

    };

    ListViewPanel.prototype.refresh = function () {
        this.loadData(this.rptId, 1, this.pagesize);
    };

    ListViewPanel.prototype.loadData = function (rid, pageno, pagesize) {
        var that = this;
        $("#progressbar").show();
        $.getJSON(service.api(25), {
            id: rid,// report service Id
            search: this.search.value,
            pageno: pageno,
            pagesize: pagesize,
        }).complete(function (data) {
            that.loadReport(data.responseJSON);
            $("#progressbar").hide();
        });
    };

    ListViewPanel.prototype.loadReport = function (jsonobj) {
        $(this.tableList).children().remove();
        var currPage = new ReportPage();
        if (jsonobj != null) {
            currPage.parseFromJSON(jsonobj);
            if (currPage.pageEntities != null
                && currPage.pageEntities.length > 0) {
                var objs = currPage.pageEntities;
                if (objs != null && objs.length > 0) {
                    for (var i = 0; i < objs.length; i++) {
                        var r = objs[i];
                        var row = this.tableList.insertRow(-1);
                        row.setAttribute("key", currPage.id + r.instanceId);
                        row.setAttribute("wftype", r.workflowType);
                        row.addEventListener("click", this, false);
                        row.setAttribute("pid", r.instanceId);
                        for (var j = 0; j < r.children.length; j++) {
                            this.createCell(j, r.children[j].cellContent, row);
                        }
                        if (this.hasOperations == 1) {
                            var cell = this.createCell(r.children.length, null, row);
                            if (this.hasViewButton == 1) {
                                // this.createIcon(cell, this.currPage.id + "0" + r.instanceId, "fa fa-search fa-lg",
                                //     "review", "查看", "btn-primary");
                            }
                            if (this.hasModifyButton == 1) {
                                this.createIcon(cell, this.id + "1" + r.instanceId,
                                    "fa fa-pencil-square-o fa-lg", "modify", "修改", "btn-primary");
                            }
                            if (this.hasDeleteButton == 1) {
                                this.createIcon(cell, this.id + "2" + r.instanceId,
                                    "fa fa-trash-o fa-lg", "remove", "删除", "btn-danger");
                            }
                        }

                    }
                }
                if (objs.length < this.pagesize) {
                    for (var i = objs.length; i < this.pagesize; i++) {
                        var row = this.tableList.insertRow(i);
                        for (var j = 0; j < currPage.titles.length; j++) {
                            this.createCell(j, "&nbsp;", row);
                        }
                        if (this.hasOperations == 1) {
                            this.createCell(currPage.titles.length, null, row);
                        }
                    }
                }
            } else {
                this.initList(currPage);
            }
        } else {
            currPage.titles.push(new ReportField("001", "标题1"));
            currPage.titles.push(new ReportField("002", "标题2"));
            currPage.titles.push(new ReportField("003", "标题3"));
            this.initList(currPage);
        }
        this.addListHeader(currPage);
        this.pageno.innerHTML = "第" + currPage.pageNo + "页";
        this.totalpage.innerHTML = "/共" + currPage.allPagesCount + "页";
        if (currPage.allPagesCount <= 1) {
            this.disableButton(this.firstPageHButton);
            this.disableButton(this.previousPageHButton);
            this.disableButton(this.nextPageHButton);
            this.disableButton(this.lastPageHButton);
        } else if (currPage.allPagesCount > 1) {
            if (currPage.pageNo == 1) {
                this.disableButton(this.firstPageHButton);
                this.disableButton(this.previousPageHButton);
                this.enableButton(this.nextPageHButton);
                this.enableButton(this.lastPageHButton);
            } else if (currPage.pageNo == currPage.allPagesCount) {
                this.enableButton(this.firstPageHButton);
                this.enableButton(this.previousPageHButton);
                this.disableButton(this.nextPageHButton);
                this.disableButton(this.lastPageHButton);
            } else if (currPage.pageNo > 1
                && currPage.pageNo < currPage.allPagesCount) {
                this.enableButton(this.firstPageHButton);
                this.enableButton(this.previousPageHButton);
                this.enableButton(this.nextPageHButton);
                this.enableButton(this.lastPageHButton);
            }
        }
        if (currPage.pageEntities != null &&
            currPage.pageEntities.length > 0) {
            var f = false;
            if (objs != null && objs.length > 0) {
                for (var i = 0; i < objs.length; i++) {
                    if (objs[i] != null && currPage.id + objs[i].instanceId == this.selectIndex) {
                        f = true;
                        break;
                    }
                }
            }
            if (f) {
                this.selectRow(this.selectIndex);
            } else {
                this.selectIndex = -1;
                this.selectRow(currPage.id + currPage.pageEntities[0].instanceId);
            }
        } else {
            this.selectIndex = -1;
        }
        this.currPage = currPage;
    };

    ListViewPanel.prototype.getObjectById = function (id) {
        var objs = this.objects;
        if (objs != null && objs.length > 0) {
            for (var i = 0; i < objs.length; i++) {
                if (objs[i] != null && objs[i].id == id) {
                    return objs[i];
                }
            }
        }
        return null;
    };

    ListViewPanel.prototype.getCurrentSelected = function () {
        var objs = this.objects;
        if (objs != null && objs.length > 0) {
            for (var i = 0; i < objs.length; i++) {
                if (objs[i] != null && objs[i].id == this.selectIndex) {
                    return objs[i];
                }
            }
        }
        return null;
    };

    ListViewPanel.prototype.initList = function (currPage) {
        for (var i = 0; i < this.pagesize; i++) {
            var row = this.tableList.insertRow(i);
            for (var j = 0; j < currPage.titles.length; j++) {
                var cell1 = row.insertCell(j);
                cell1.innerHTML = "&nbsp;";
            }
            if (this.hasOperations == 1) {
                var cell1 = row.insertCell(currPage.titles.length);
                cell1.innerHTML = "&nbsp;";
            }
        }
    };

    ListViewPanel.prototype.createCell = function (no, content, row) {
        var cell = row.insertCell(no);
        cell.setAttribute("nowrap", "true");
        if (content != null || content != "")
            cell.innerHTML = content;
        return cell;
    };

    ListViewPanel.prototype.addListHeader = function (currPage) {
        var header = this.tableList.createTHead();
        var row = header.insertRow(0);
        if (currPage != null) {
            for (var j = 0; j < currPage.titles.length; j++) {
                this.createHead(currPage.titles[j].name, row);
            }
            if (this.hasOperations == 1) {
                this.createHead("操作", row);
            }
        }
    };

    ListViewPanel.prototype.createHead = function (content, row) {
        var th = document.createElement('th');
        th.setAttribute("nowrap", "true");
        th.innerHTML = content;
        row.appendChild(th);
    };


    ListViewPanel.prototype.createIcon = function (parent, id, classname,
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
                that.deletionConfirmInfoDialog.show("您确定删除该数据吗？（请谨慎操作，不可恢复）");
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

    ListViewPanel.prototype.createToolbar = function (toolbar) {
        var toolbarForm = document.createElement("form");
        toolbarForm.className = "form-inline";
        toolbar.appendChild(toolbarForm);

        var toolbarDiv = document.createElement("DIV");
        toolbarForm.appendChild(toolbarDiv);
        toolbarDiv.style.margin = "0px";
        toolbarDiv.style.padding = "2px";
        toolbarDiv.style.padding = "2px";
        this.createNavigationGroup(toolbarDiv);
        this.createSearchGroup(toolbarDiv);
    };

    ListViewPanel.prototype.createNavigationGroup = function (parent) {
        // if (this.type != undefined
        //     && this.parent.addExtraButtons != undefined) {
        //     this.parent.addExtraButtons(parent);
        // }

        var group1 = this.createGroup(parent);
        this.refreshHButton = this.createTool(group1, "refreshS"
            + this.options.rid, "刷新", "btn btn-success", "i",
            "fa fa-refresh fa-lg");
        this.enableButton(this.refreshHButton);

        var group = this.createGroup(parent);
        this.firstPageHButton = this.createTool(group, "firstPageS"
            + this.options.rid, "首页", "btn btn-default", "i",
            "fa fa-step-backward fa-lg");
        this.previousPageHButton = this.createTool(group, "previousPageS"
            + this.options.rid, "前一页", "btn btn-default", "i",
            "fa fa-backward fa-lg");
        this.nextPageHButton = this.createTool(group, "nextPageS"
            + this.options.rid, "后一页", "btn btn-default", "i",
            "fa fa-forward fa-lg");
        this.lastPageHButton = this.createTool(group, "lastPageS"
            + this.options.rid, "末页", "btn btn-default", "i",
            "fa fa-step-forward fa-lg");
        this.disableButton(this.firstPageHButton);
        this.disableButton(this.previousPageHButton);
        this.disableButton(this.nextPageHButton);
        this.disableButton(this.lastPageHButton);

        var group2 = this.createGroup(parent);
        this.pageno = this.createLabel(group2, "Sl1" + this.options.rid, "");
        this.totalpage = this.createLabel(group2, "Sl2" + this.options.rid, "");

    };

    ListViewPanel.prototype.createLabel = function (group, id, title) {
        var label = document.createElement("Label");
        label.innerHTML = title;
        label.id = id;
        group.appendChild(label);
        return label;
    };

    ListViewPanel.prototype.createSearchGroup = function (parent) {
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
            + this.id, "查找", "btn btn-primary", "i",
            "fa fa-search fa-lg");
    };

    ListViewPanel.prototype.createGroup = function (parent) {
        var group = document.createElement("DIV");
        group.className = "btn-group";
        group.style.padding = "2px";
        group.setAttribute("role", "group");
        group.setAttribute("aria-label", "");
        parent.appendChild(group);
        return group;
    };

    ListViewPanel.prototype.crateSGroup = function (parent) {
        var group = document.createElement("DIV");
        group.className = "input-group";
        group.style.padding = "2px";
        group.setAttribute("role", "search");
        group.setAttribute("aria-label", "");
        parent.appendChild(group);
        return group;
    };

    ListViewPanel.prototype.createTool = function (group, id, title, style,
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

    ListViewPanel.prototype.selectRow = function (id) {
        if (this.tableList.rows.length > 1) {
            for (var i = 0; i < this.tableList.rows.length; i++) {
                if (this.tableList.rows[i].getAttribute("key") == id) {
                    this.tableList.rows[i].style.background = "#d1d1e0";
                    break;
                }
            }
        }
    };

    ListViewPanel.prototype.enableButton = function (button) {
        button.disabled = false;
    };

    ListViewPanel.prototype.disableButton = function (button) {
        button.disabled = true;
    };

    ListViewPanel.prototype.handleEvent = function (e) {
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

    ListViewPanel.prototype.doKeydown = function (evt) {
        var e = window.event ? window.event : (evt ? evt : arguments[0]);
        var key = e.keyCode || e.which;
        if (key == 13) {// 回车键
            evt.preventDefault();// 阻止该事件
            this.doNextPageAction(1);
            this.act = 6;
            return false;
        }
    };

    ListViewPanel.prototype.doDblClick = function (evt) {
        if (evt.target.tagName == "TD") {
            this.tableList.focus();
        }
    };

    ListViewPanel.prototype.doClick = function (evt) {
        if (evt.target == this.firstPageHButton
            || (evt.target.id == ("firstPageS" + this.options.rid))) {
            this.doNextPageAction(1);
            this.act = 1;
        } else if (evt.target == this.previousPageHButton
            || (evt.target.id == ("previousPageS" + this.options.rid))) {
            this.doNextPageAction(this.currPage.pageNo - 1);
            this.act = 2;
        } else if (evt.target == this.nextPageHButton
            || (evt.target.id == ("nextPageS" + this.options.rid))) {
            this.doNextPageAction(this.currPage.pageNo + 1);
            this.act = 3;
        } else if (evt.target == this.lastPageHButton
            || (evt.target.id == ("lastPageS" + this.options.rid))) {
            this.doNextPageAction(this.currPage.allPagesCount);
            this.act = 4;
        } else if (evt.target == this.refreshHButton
            || (evt.target.id == ("refreshS" + this.options.rid))) {
            this.doNextPageAction(this.currPage.pageNo);
            this.act = 5;
        } else if (evt.target == this.searchBtn
            || (evt.target.id == ("searchS" + this.options.rid))) {
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

    ListViewPanel.prototype.doNextPageAction = function (pageno) {
        this.loadData(this.rptId, pageno, this.pagesize);
    };

    ListViewPanel.prototype.selectRow = function (id) {
        if (this.tableList.rows.length > 1) {
            for (var i = 0; i < this.tableList.rows.length; i++) {
                if (this.tableList.rows[i].getAttribute("key") == id) {
                    this.tableList.rows[i].style.background = "#d1d1e0";
                    this.selectIndex = id;
                    break;
                }
            }
        }
        // for (var i = 0; i < this.objects.length; i++) {
        //     if (this.objects[i].id == id) {
        //         this.setPropertySheet(this.objects[i]);
        //         break;
        //     }
        // }
    };

    ListViewPanel.prototype.clearProcessSheet = function (table) {
        if (table.rows.length > 0) {
            for (var i = 0; i < table.rows.length; i++) {
                table.rows[i].style.background = "";
            }
            this.selectIndex = -1;
        }
    };

    ListViewPanel.prototype.selectRow = function (id) {
    if (this.tableList.rows.length > 1) {
        for (var i = 0; i < this.tableList.rows.length; i++) {
            if (this.tableList.rows[i].getAttribute("key") == id) {
                this.tableList.rows[i].style.background = "#d1d1e0";
                break;
            }
        }
    }
};

    $.fn[pluginName] = function (options) {
        return this.each(function () {
            if (!$.data(this, pluginName)) {
                $.data(this, pluginName, new ListViewPanel(this, options));
            } else if ($.isFunction(Plugin.prototype[options])) {
                $.data(this, pluginName)[options]();
            }
        });
    };

})(jQuery, window, document);
