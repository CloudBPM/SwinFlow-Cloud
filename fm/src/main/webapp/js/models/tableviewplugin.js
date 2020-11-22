/**
 *
 */
;
(function ($, window, document, undefined) {
    var pluginName = "tableViewPlugin";
    var defaults = {
        id: "",
        rid: "",
        width: 0,
        height: 0,
    };

    var ListViewPanel = function (element, options) {
        this.element = element;
        this.options = $.extend({
            id: "",
            rid: "",
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
        this.loadData(this.rptId);
    };

    ListViewPanel.prototype.loadData = function (rid) {
        var that = this;
        $("#progressbar").show();
        $.getJSON(service.api(26), {
            id: rid,// report service Id
        }).complete(function (data) {
            that.loadReport(data.responseJSON);
            $("#progressbar").hide();
        });
    };

    ListViewPanel.prototype.loadReport = function (jsonobj) {
        $(this.tableList).children().remove();
        var currPage = new Report();
        if (jsonobj != null) {
            currPage.parsefromJSON(jsonobj);
            if (currPage.children != null
                && currPage.children.length > 0) {
                var objs = currPage.children;
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
        if (currPage.children != null &&
            currPage.children.length > 0) {
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
                this.selectRow(currPage.id + currPage.children[0].instanceId);
            }
        } else {
            this.selectIndex = -1;
        }
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

    ListViewPanel.prototype.handleEvent = function (e) {
        switch (e.type) {
            case "click":
                this.doClick(e);
                break;
        }
        Utils.stopBubble(e);
    };

    ListViewPanel.prototype.doClick = function (evt) {
        if (evt.target.tagName == "TD") {
            var table = evt.target.parentElement.parentElement;
            this.clearProcessSheet(table);
            evt.target.parentElement.style.background = "#d1d1e0";
            var r = evt.target.parentElement;
            this.selectRow(r.getAttribute("key"));
        }
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
