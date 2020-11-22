;
(function ($, window, document, undefined) {
    var pluginName = "reportServicePreview";
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
        this.stack = options.parent.stack;
        this.pagesize = 30;
        this.delfileid = null;

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
        tableDivPane.className = "col-lg-12 col-md-12 col-sm-12 col-xs-12 table-responsive";
        tableDivPane.id = "previewlist" + options.pid;
        tableDivPane.style.margin = "0px";
        tableDivPane.style.padding = "0px";
        tableDivPane.style.border = "1px solid #ddd";
        if (options.height>0) {
            tableDivPane.style.height = (options.height) + "px";
        }
        tableDivPane.style.borderRadius = "4px";
        tableDivPane.style.overflowY = "auto";
        this.list = document.createElement("table");
        tableDivPane.appendChild(this.list);
        this.list.className = "table table-striped table-hover";


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
        this.loadData(this.options, "");
    };

    Editor.prototype.generate = function () {
        this.generateData(this.options);
    };

    Editor.prototype.initialize = function () {
        this.loadData(this.options, "");
    };

    Editor.prototype.loadData = function (options, condition) {
        var that = this;
        $("#progressbar").show();
        $.getJSON(service.api(12), {
            id: options.pid,// report service Id
            condition: condition,
        }).complete(function (data) {
            that.loadReport(data.responseJSON);
            $("#progressbar").hide();
        });
    };

    Editor.prototype.generateData = function () {
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

    Editor.prototype.downFile = function (blob, fileName) {
        if (window.navigator.msSaveOrOpenBlob) {
            navigator.msSaveBlob(blob, fileName);
        } else {
            var link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = fileName;
            link.click();
            window.URL.revokeObjectURL(link.href);
        }
    }

    Editor.prototype.loadReport = function (obj) {
        $(this.list).children().remove();
        if (obj != null) {
            this.currObject = new Report();
            this.currObject.parsefromJSON(obj);
            if (this.currObject.children.length > 0) {
                for (var i = 0; i < this.currObject.children.length; i++) {
                    var r = this.currObject.children[i];
                    var row = this.list.insertRow(-1);
                    row.setAttribute("key", r.name);
                    row.setAttribute("wftype", r.workflowType);
                    row.addEventListener("click", this, false);
                    row.setAttribute("pid", r.instanceId);
                    //row.addEventListener("dblclick", this, false);
                    for (var j = 0; j < r.children.length; j++) {
                        this.createCell(j, r.children[j].cellContent, row);
                    }
                    var cell = this.createCell(r.children.length, null, row);
                    // this.createIcon(cell, this.currObject.id + "0", "fa fa-search fa-lg",
                    //     "review", "查看", "btn-primary");
                    this.createIcon(cell, this.currObject.id + "1", "fa fa-pencil-square-o fa-lg",
                        "modify", "修改", "btn-primary");
                    this.createIcon(cell, this.currObject.id + "2", "fa fa-trash-o fa-lg",
                        "remove", "删除", "btn-danger");
                }
                if (this.currObject.children.length < this.pagesize) {
                    for (var i = this.currObject.children.length; i < this.pagesize; i++) {
                        var row = this.list.insertRow(i);
                        for (var j = 0; j < this.currObject.titles.length; j++) {
                            this.createCell(j, "&nbsp;", row);
                        }
                        this.createCell(this.currObject.titles.length, null, row);
                    }
                }
            } else {
                this.initList(this.options);
            }
        } else {
            this.initList(this.options);
        }
        this.addListHeader(this.options);
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
        $.post(service.api(6), {
            id: that.delfileid,// process instance Id
        }).complete(function (data) {
            that.refresh();
            $("#progressbar").hide();
        });
    };

    Editor.prototype.addListHeader = function (options) {
        var header = this.list.createTHead();
        var row = header.insertRow(0);
        if (this.currObject != null) {
            for (var j = 0; j < this.currObject.titles.length; j++) {
                this.createHead(this.currObject.titles[j].name, row);
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
            for (var j = 0; j <= this.currObject.titles.length; j++) {
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
            var table = evt.target.parentElement.parentElement;
            this.clearProcessSheet(table);
            evt.target.parentElement.style.background = "#d1d1e0";
            var r = evt.target.parentElement;
            this.selectRow(r.getAttribute("key"));
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