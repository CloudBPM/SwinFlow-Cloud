;
(function ($, window, document, undefined) {
    var pluginName = "pageableReportServiceEditor";
    var defaults = {
        id: "", // process ID
        userId: "",
        userfullname: "",
        ownername: "",
        basicpropsheet: "",
        propsheet: "",
        owner: "", // organization ID
        width: 0,
        height: 0,
        edata: "",// attached data
    };

    var Editor = function (element, options) {
        this.element = element;
        this.options = $.extend({
            id: "", // process ID
            userId: "",
            userfullname: "",
            ownername: "",
            basicpropsheet: "",
            propsheet: "",
            owner: "", // organization ID
            width: 0,
            height: 0,
            edata: "",// attached data
        }, defaults, options);
        this._defaults = defaults;
        this._name = pluginName;
        this.stack = new CommandStack();
        this.painterRow = null;
        this.toolbarRow = null;
        this.currObject = new ReportService();
        this.basicpropsheet = options.basicpropsheet;
        this.propsheet = options.propsheet;

        this.init(options);
        this.createToolbar(options);
        this.loading(options);
    };

    Editor.prototype.getDirty = function () {
        return this.stack.isDirty();
    };

    Editor.prototype.init = function (options) {
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
        this.painterRow = document.createElement("DIV");
        editorPanel.appendChild(this.painterRow);
        this.painterRow.className = "row";
        this.painterRow.style.margin = "0px";
        this.painterRow.style.padding = "0px";
    };

    Editor.prototype.createToolbar = function (options) {
        var parent = document.createElement("DIV");
        this.toolbarRow.appendChild(parent);
        parent.className = "col-lg-12 col-md-12 col-sm-12 col-xs-12";
        parent.style.margin = "0px";
        parent.style.padding = "2px";

        var c = "btn btn-default";
        var c1 = "btn btn-dangerous";
        var c2 = "btn btn-primary";
        var g1 = this.createGroup(parent);
        // fa-lg: 24px; fa-2x ：32px
        this.undobutton = this.createTool(g1, "undo" + this.options.id, "撤销",
            c, "i", "fa fa-reply fa-lg");
        this.redobutton = this.createTool(g1, "redo" + this.options.id, "恢复",
            c, "i", "fa fa fa-share fa-lg");

        var group2 = this.createGroup(parent);
        this.upbutton = this.createTool(group2, "up" + this.options.id, "向下移动",
            c2, "i", "fa fa-arrow-up fa-lg");
        this.downbutton = this.createTool(group2, "down" + this.options.id, "向上移动",
            c2, "i", "fa fa-arrow-down fa-lg");
        this.disableButton(this.upbutton);
        this.disableButton(this.downbutton);

        var group1 = this.createGroup(parent);
        this.refreshHButton = this.createTool(group1, "refreshS" + this.options.id, "刷新",
            "btn btn-success", "i", "fa fa-refresh fa-lg");

        var g3 = this.createGroup(parent);
        this.printbutton = this.createTool(g3, "print" + this.options.id, "打印",
            c, "i", "fa fa-print fa-lg");

        var g4 = this.createGroup(parent);
        this.generatebutton = this.createTool(g4, "generate" + this.options.id, "导出Excel",
            c, "i", "fa fa-file-excel-o fa-lg");

        var g6 = this.createGroup(parent);
        this.pbutton = this.createTool(g6, "preview" + this.options.id, "打开新窗口预览",
            c, "i", "fa fa-coffee fa-lg");

        this.stack.undoButton = this.undobutton;
        this.stack.redoButton = this.redobutton;
        this.disableButton(this.undobutton);
        this.disableButton(this.redobutton);

        var g7 = this.createGroup(parent);
        this.rlbutton = this.createTool(g7, "release" + this.options.id,
            "申请上线应用", c, "i", "fa fa-cloud-upload fa-lg");
        this.wdbutton = this.createTool(g7, "widthdraw" + this.options.id,
            "下线应用", c, "i", "fa fa-cloud-download fa-lg");
    };

    Editor.prototype.createGroup = function (parent) {
        var group = document.createElement("DIV");
        parent.appendChild(group);
        group.className = "btn-group";
        group.style.padding = "2px";
        group.setAttribute("role", "group");
        group.setAttribute("aria-label", "");
        return group;
    };

    Editor.prototype.createTool = function (group, id, title, style, fonttag,
                                            fontclass) {
        var button = document.createElement("button");
        group.appendChild(button);
        button.className = style;
        button.setAttribute("title", title);
        button.type = "button";
        button.id = id;
        button.addEventListener('click', this, false);
        var icon = document.createElement(fonttag);
        button.appendChild(icon);
        icon.className = fontclass;
        icon.setAttribute("title", title);
        icon.id = id;
        return button;
    };

    Editor.prototype.shading = function (options, currObject) {
        var canvasPanel = document.createElement("DIV");
        this.painterRow.appendChild(canvasPanel);

        canvasPanel.id = "rlpcanvasPanel" + options.id;
        canvasPanel.className = "col";
        canvasPanel.style.width = options.width + "px";
        canvasPanel.style.margin = "0px";
        canvasPanel.style.padding = "0px";

        var canvasPane = document.createElement("DIV");
        canvasPanel.appendChild(canvasPane);

        canvasPane.className = "col-lg-12 col-md-12 col-sm-12 col-xs-12";
        canvasPane.id = "rlprocPane" + options.id;
        canvasPane.style.margin = "0px";
        canvasPane.style.padding = "0px";
        canvasPane.style.height = (options.height - 84) + "px";

        var tabUL = document.createElement("UL");
        canvasPane.appendChild(tabUL);
        tabUL.className = "nav nav-tabs rpt-nav-tabs";
        tabUL.id = "rpt-props-nav-tabs" + options.id;
        tabUL.setAttribute("role", "tablist");
        this.newTabHead(tabUL, 0, "显示字段", true, options.id);
        this.newTabHead(tabUL, 1, "查询条件", false, options.id);
        if (this.currObject.crossVersion == 1) {
            this.newTabHead(tabUL, 2, "查询版本", false, options.id);
        }
        this.newTabHead(tabUL, 3, "结果预览", false, options.id);
        if (pversion > 2) {
            this.newTabHead(tabUL, 4, "运行统计", false, options.id);
        }
        var that = this;
        $("#rpt-props-nav-tabs" + options.id).on("click", "a", function (e) {
            // e.preventDefault();
            $(this).tab('show');
            that.currtabindex = parseInt($(this).attr('href').substring(7, 8));
            that.setPropertySheet();
            if (that.currtabindex == 2) {
                if (that.queryVersionRangePane != null &&
                    that.queryVersionRangePane.initialize != undefined) {
                    that.queryVersionRangePane.initialize();
                }
            } else if (that.currtabindex == 3) {
                if (that.pageableReportServicePreview.initialize != undefined) {
                    that.pageableReportServicePreview.initialize();
                }
            }
        });

        var tabContents = document.createElement("DIV");
        canvasPane.appendChild(tabContents);
        tabContents.className = "tab-content";
        tabContents.id = "rlptabs";

        this.tabContent1 = this.newTabContent(tabContents, 0, true, options.id);
        if ($(this.tabContent1).reportFieldsEditor != undefined) {
            var plugin1 = $(this.tabContent1).reportFieldsEditor({
                id: "rpttab1" + options.id,
                pid: options.id,// report service Object Id
                basicpropsheet: options.basicpropsheet,
                propsheet: options.propsheet,
                width: options.width,
                height: (options.height - 130),
                parent: this,
                currObject: currObject,// report service Object
                owner: options.owner,
            });
            // 130 is 126 (2 tab height + tool bar height)
            // + 4 (2 gap height + 2 tab border height)
            this.reportFieldsEditor = plugin1.data("reportFieldsEditor");
        }

        this.tabContent2 = this.newTabContent(tabContents, 1, false, options.id);
        if ($(this.tabContent2).queryConditionPane != undefined) {
            var plugin1 = $(this.tabContent2).queryConditionPane({
                id: "rpttab2" + options.id,
                pid: options.id,// report service Object Id
                basicpropsheet: options.basicpropsheet,
                propsheet: options.propsheet,
                width: options.width,
                height: (options.height - 130),
                parent: this,
                currObject: currObject,// report service Object
                owner: options.owner,
            });
            this.pageableReportServicePreview = plugin1.data("pageableReportServicePreview");
        }

        if (this.currObject.crossVersion == 1) {
            this.tabContent3 = this.newTabContent(tabContents, 2, false, options.id);
            if ($(this.tabContent3).queryVersionRangePane != undefined) {
                var plugin1 = $(this.tabContent3).queryVersionRangePane({
                    id: "rpttab3" + options.id,
                    pid: options.id,// report service Object Id
                    basicpropsheet: options.basicpropsheet,
                    propsheet: options.propsheet,
                    width: options.width,
                    height: (options.height - 130),
                    parent: this,
                    currObject: currObject,// report service Object
                    owner: options.owner,
                    edata: options.edata,
                });
                this.queryVersionRangePane = plugin1.data("queryVersionRangePane");
            }
        }

        this.tabContent4 = this.newTabContent(tabContents, 3, false, options.id);
        if ($(this.tabContent4).pageableReportServicePreview != undefined) {
            var plugin1 = $(this.tabContent4).pageableReportServicePreview({
                id: "rpttab4" + options.id,
                pid: options.id,// report service Object Id
                basicpropsheet: options.basicpropsheet,
                propsheet: options.propsheet,
                width: options.width,
                height: (options.height - 130),
                parent: this,
                currObject: currObject,// report service Object
                owner: options.owner,
            });
            this.pageableReportServicePreview = plugin1.data("pageableReportServicePreview");
        }

        if (pversion > 2) {
            this.tabContent5 = this.newTabContent(tabContents, 4, false, options.id);
        }

        $('#rpt-props-nav-tabs' + options.id + ' a[href="#rpttab' + this.currtabindex + options.id + '"]')
            .tab('show');

    };

    // loading report service object
    Editor.prototype.loading = function (options) {
        var that = this;
        $("#progressbar").show();
        $.getJSON(service.api(2, options.owner), {
            id: options.id,
        }).complete(function (data) {
            that.currObject.parseFromJSON(data.responseJSON);
            that.shading(options, that.currObject);
            that.setPropertySheet();
            $("#progressbar").hide();
        });
    };

    Editor.prototype.newTabHead = function (parent, index, caption, active, id) {
        var tabLi = document.createElement("li");
        parent.appendChild(tabLi);
        if (active)
            tabLi.className = "active";
        tabLi.setAttribute("role", "presentation");
        var tabLink = document.createElement("a");
        tabLi.appendChild(tabLink);
        tabLink.setAttribute("href", "#rpttab" + index + id);
        tabLink.setAttribute("aria-controls", "rpttab" + index + id);
        tabLink.setAttribute("role", "tab");
        tabLink.setAttribute("data-toggle", "tab");
        tabLink.innerHTML = caption;
    };

    Editor.prototype.newTabContent = function (parent, index, active, id) {
        var tabContent = document.createElement("DIV");
        parent.appendChild(tabContent);
        tabContent.setAttribute("data", "rpttab" + index + id);
        tabContent.setAttribute("role", "tabpanel");
        if (active)
            tabContent.className = "tab-pane active";
        else
            tabContent.className = "tab-pane";
        tabContent.id = "rpttab" + index + id;
        return tabContent;
    };

    Editor.prototype.handleEvent = function (e) {
        switch (e.type) {
            case "keydown":
                this.doKeypress(e);
                break;
            case "click":
                this.doClick(e);
                break;
        }
    };

    Editor.prototype.doClick = function (evt) {
        if (evt.target == this.undobutton
            || evt.target.id == ("undo" + this.options.id)) {
            this.stack.undo();
        } else if (evt.target == this.redobutton
            || evt.target.id == ("redo" + this.options.id)) {
            this.stack.redo();
        } else if (evt.target == this.printbutton
            || evt.target.id == ("print" + this.options.id)) {

        } else if (evt.target == this.generatebutton
            || evt.target.id == ("generate" + this.options.id)) {
            if (this.pageableReportServicePreview.refresh != undefined) {
                this.pageableReportServicePreview.generate();
            }
        } else if (evt.target == this.pbutton
            || evt.target.id == ("preview" + this.options.id)) {

        } else if (evt.target == this.refreshHButton
            || (evt.target.id == ("refreshS" + this.options.id))) {
            if (this.pageableReportServicePreview.refresh != undefined) {
                this.pageableReportServicePreview.refresh();
            }
        } else if (evt.target == this.upbutton
            || (evt.target.id == ("up" + this.options.id))) {
            this.reportFieldsEditor.moveOneUp();
        } else if (evt.target == this.downbutton
            || (evt.target.id == ("down" + this.options.id))) {
            this.reportFieldsEditor.moveOneDown();
        }
    };

    Editor.prototype.doKeypress = function (evt) {
        evt = evt || window.event;
        if (evt.ctrlKey) {
        }
    };

    Editor.prototype.setPropertySheet = function () {
        var obj = this.currObject;
        if (this.basicpropsheet != null) {
            this.basicpropsheet.setSheet(obj, null);
        }
        if (this.propsheet != null) {
            this.propsheet.setSheet(obj, null, this.propsheet
                .getCurrTabIndex(obj));
        }
    };

    Editor.prototype.enableButton = function (button) {
        button.disabled = false;
    };

    Editor.prototype.disableButton = function (button) {
        button.disabled = true;
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