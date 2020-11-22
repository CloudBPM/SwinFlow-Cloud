/**
 *
 */
(function($, window, document, undefined) {
    var pluginName = "amAndroidPluginEditor";
    var defaults = {
        id : "",
        appid : "",
        alias : "",
        basicpropsheet : "",
        propsheet : "",
        width : 0,
        height : 0,
        parent : "",
        ownerId : "",
    };

    var Editor = function(element, options) {
        this.element = element;
        this.options = $.extend({
            id : "",
            appid : "",
            alias : "",
            basicpropsheet : "",
            propsheet : "",
            width : 0,
            height : 0,
            parent : "",
            ownerId : "",
        }, defaults, options);
        this.selectIndex = -1;
        this._defaults = defaults;
        this._name = pluginName;

        this.currObject = null;
        this.stack = options.parent.stack;
        this.basicpropsheet = options.basicpropsheet;
        this.propsheet = options.propsheet;
        this.init(options);
    };

    Editor.prototype.init = function(options) {
        var editorPanel = document.createElement("DIV");
        this.element.appendChild(editorPanel);

        editorPanel.id = "accAppPane3Div4" + options.appid;
        editorPanel.style.width = (options.width) + "px";
        editorPanel.style.margin = "0px";
        editorPanel.style.marginTop = "0px";
        editorPanel.style.padding = "0px";

        var uoloadRow = document.createElement("DIV");
        editorPanel.appendChild(uoloadRow);
        uoloadRow.className = "row";
        uoloadRow.style.margin = "0px";
        uoloadRow.style.padding = "0px";

        var uploadFileDivPane = document.createElement("DIV");
        uoloadRow.appendChild(uploadFileDivPane);
        uploadFileDivPane.className = "col-lg-6 col-md-6 col-sm-12 col-xs-12";
        uploadFileDivPane.style.margin = "0px";
        uploadFileDivPane.style.padding = "2px";
        uploadFileDivPane.style.height = "84px";

        var o1 = new Object();
        o1.ownerId = this.options.ownerId;
        o1.fid = this.options.appid;
        o1.aid = this.options.alias;
        o1.type = "android_app_plugin";

        var p1 = $(uploadFileDivPane).uploadFilesPlugin({
            id : "upload0168A", // plugin id
            parent: this,
            width : "100%",
            height : "80px",
            opt1 : o1,
        });

        var uploadIconDivPane = document.createElement("DIV");
        uoloadRow.appendChild(uploadIconDivPane);
        uploadIconDivPane.className = "col-lg-6 col-md-6 col-sm-12 col-xs-12";
        uploadIconDivPane.style.margin = "0px";
        uploadIconDivPane.style.padding = "2px";
        uploadIconDivPane.style.height = "84px";

        var o2 = new Object();
        o2.ownerId = this.options.ownerId;
        o2.fid = this.options.appid;
        o2.type = "android_app_plugin";

        var p1 = $(uploadIconDivPane).uploadIconsPlugin({
            id : "upload0168B", // plugin id
            parent: this,
            width : "100%",
            height : "80px",
            opt1 : o2,
        });

        var painterRow = document.createElement("DIV");
        editorPanel.appendChild(painterRow);
        painterRow.className = "row";
        painterRow.style.margin = "0px";
        painterRow.style.padding = "0px";

        var tableDivPane = document.createElement("DIV");
        painterRow.appendChild(tableDivPane);
        tableDivPane.className = "col-lg-12 col-md-12 col-sm-12 col-xs-12";
        tableDivPane.id = "listPane" + this.options.id;
        tableDivPane.className = "table-responsive";
        tableDivPane.style.margin = "0px";
        tableDivPane.style.padding = "0px";
        tableDivPane.style.border = "1px solid #ddd";
        tableDivPane.style.height = (this.options.height- 84) + "px";
        tableDivPane.style.borderRadius = "4px";
        tableDivPane.style.overflowY = "auto";

        this.tableList = document.createElement("table");
        tableDivPane.appendChild(this.tableList);
        this.tableList.id = "safflist";
        this.tableList.className = "table table-striped table-hover";

        // confirm message dialog plugin
        var p2 = $(this.element).confirmInfoDialog({ // 确认对话框
            id : "00568A",
            title : vendor + " - 提示",
            parent : this,
        });
        this.confirmInfoDialog = p2.data("confirmInfoDialog");

        this.loadingAppMSPluginFiles(options);
    };

    Editor.prototype.refresh= function() {
        this.loadingAppMSPluginFiles(this.options);
    };

    Editor.prototype.loadingAppMSPluginFiles= function(options) {
        $("progressbar").show();
        var that = this;
        $.getJSON(service.downloadapi(0, options.ownerId, ""), {
            oid: options.ownerId,
            dir : "android_app_plugin",
            fid: options.appid,
            project: "am",
        }).complete(function(data) {
            var data = JSON.parse(data.responseText);
            that.loadData(data, options);
            $("#progressbar").hide();
        });
    };

    Editor.prototype.loadData = function(data, options) {
        this.objects = data;
        $(this.tableList).children().remove();
        var objs = this.objects;
        if (objs != null && objs.length > 0) {
            if (objs != null && objs.length > 0) {
                for (var i = 0; i < objs.length; i++) {
                    var row = this.tableList.insertRow(-1);
                    row.setAttribute("key", objs[i].id);
                    row.addEventListener("click", this, false);
                    row.addEventListener("dblclick", this, false);
                    this.createCell(0, Utils.parse(objs[i].name), row);
                    this.createCell(1, Utils.formatBytes(objs[i].size), row);
                    this.createCell(2, Utils.getDateTime(Number(objs[i].lastupdate)), row);
                    var cell = this.createCell(3, "", row);
                    var b3 = this.createIcon(cell, objs[i].id, "6",
                        "fa fa-download fa-lg", "download", "下载", "");
                    var b4 = this.createIcon(cell, objs[i].id, "7", "fa fa-trash fa-lg",
                        "delete", "删除", "btn-danger");

                }
                if (objs.length < 30) {
                    for (var i = objs.length; i < 30; i++) {
                        var row = this.tableList.insertRow(i);
                        for (var j = 0; j < 4; j++) {
                            this.createCell(j, "&nbsp;", row);
                        }
                    }
                }
            } else {
                this.initList(this.options);
            }
        } else {
            this.initList(this.options);
        }
        this.addListHeader(this.options);
        if (this.objects.length > 0) {
            var f = false;
            if (objs != null && objs.length > 0) {
                for (var i = 0; i < objs.length; i++) {
                    if (objs[i] != null && objs[i].id == this.selectIndex) {
                        f = true;
                        break;
                    }
                }
            }
            if (f) {
                this.selectRow(this.selectIndex);
            } else {
                this.selectIndex = -1;
                this.selectRow(this.objects[0].id);
            }
        } else {
            this.selectIndex = -1;
        }

    };

    Editor.prototype.initList = function(options) {
        for (var i = 0; i < 30; i++) {
            var row = this.tableList.insertRow(i);
            for (var j = 0; j < 4; j++) {
                var cell1 = row.insertCell(j);
                cell1.innerHTML = "&nbsp;";
            }
        }
    };


    Editor.prototype.addListHeader = function(options) {
        var header = this.tableList.createTHead();
        var row = header.insertRow(0);
        this.createHeaders(row);

    };

    Editor.prototype.createHeaders = function(row) {
        this.createHead("插件文件名", row);
        this.createHead("大小", row);
        this.createHead("最后更新", row);
        this.createHead("操作", row);
    };


    Editor.prototype.createHead = function(content, row) {
        var th = document.createElement('th');
        th.setAttribute("nowrap", "true");
        th.innerHTML = content;
        row.appendChild(th);
    };

    Editor.prototype.createCell = function(no, cellname, row) {
        var cell = row.insertCell(no);
        cell.setAttribute("nowrap", "true");
        if (cellname != null && cellname != "") {
            cell.innerHTML = cellname;
        }
        return cell;
    };

    Editor.prototype.createIcon = function(parent, id, num, classname, name,
                                           title, style) {
        var button = document.createElement("BUTTON");
        parent.appendChild(button);
        button.id = id;
        button.name = name;
        button.className = "btn btn-default " + style;
        button.title = title;
        button.style.borderRadius = "15px";
        button.style.width = "29px";
        button.style.padding = "3px";
        var that = this;
        button.addEventListener("click", function(evt) {
            if (this.name == "delete") {
                that.delfileid = id;
                that.confirmInfoDialog.show("您确定删除该文件吗？（请谨慎操作，不可恢复）");
            }
            Utils.stopBubble(evt);
        });
        var rmspan = document.createElement("SPAN");
        button.appendChild(rmspan);
        rmspan.className = classname;
        rmspan.name = name;
        rmspan.setAttribute("aria-hidden", "true");
        rmspan.setAttribute("data-toggle", "modal");
        rmspan.setAttribute("data-target", "myModal");
        rmspan.title = title;
        rmspan.id = id + "i";
        return button;
    };

    Editor.prototype.doNoAction = function(evt) {
        Utils.stopBubble(evt);
        this.confirmInfoDialog.hide();
    };

    Editor.prototype.doYesAction = function(evt) { // 确认删除文件
        Utils.stopBubble(evt);
        $("progressbar").show();
        this.confirmInfoDialog.hide();
        var that = this;
        $.post(service.downloadapi("3", this.options.ownerId, ""), {
            ownerId : this.options.ownerId,
            dir : "android_app_plugin",
            appid : this.options.appid,
            fid : this.delfileid,
        }).complete(function(data) {
            that.refresh();
            $("progressbar").hide();
        });
    };


    Editor.prototype.selectRow = function(id) {
        if (this.tableList.rows.length > 1) {
            for (var i = 0; i < this.tableList.rows.length; i++) {
                if (this.tableList.rows[i].getAttribute("key") == id) {
                    this.tableList.rows[i].style.background = "#d1d1e0";
                    this.selectIndex = id;
                    break;
                }
            }
        }
        for (var i = 0; i < this.objects.length; i++) {
            if (this.objects[i].id == id) {
                //this.setPropertySheet(this.objects[i]);
                break;
            }
        }
    };

    Editor.prototype.handleEvent = function (e) {
        switch (e.type) {
            case "dblclick":
                this.doDblClick(e);
                break;
            case "click":
                this.doClick(e);
                break;
        }
    };

    Editor.prototype.doClick = function(evt) {
        if (evt.target.tagName == "TD") {
            var table = evt.target.parentElement.parentElement;
            this.clearProcessSheet(table);
            evt.target.parentElement.style.background = "#d1d1e0";
            var r = evt.target.parentElement;
            this.selectRow(r.getAttribute("key"));
            Utils.stopBubble(evt);
        }
    };

    Editor.prototype.doDblClick = function(evt) {
        if (evt.target.tagName == "TD") {
            this.tableList.focus();
        }
    };

    Editor.prototype.clearProcessSheet = function(table) {
        if (table.rows.length > 0) {
            for (var i = 0; i < table.rows.length; i++) {
                table.rows[i].style.background = "";
            }
            this.selectIndex = -1;
        }
    };

    $.fn[pluginName] = function(options) {
        return this.each(function() {
            if (!$.data(this, pluginName)) {
                $.data(this, pluginName, new Editor(this, options));
            } else if ($.isFunction(Plugin.prototype[options])) {
                $.data(this, pluginName)[options]();
            }
        });
    };

})(jQuery, window, document);