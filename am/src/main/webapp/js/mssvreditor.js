;
(function ($, window, document, undefined) {
    var pluginName = "amMSServerEditor";
    var defaults = {
        id: "", // micro-service server ID
        basicpropsheet: "",
        propsheet: "",
        owner: "", // organization ID
        width: 0,
        height: 0,
    };

    var Editor = function (element, options) {
        this.element = element;
        this.options = $.extend({
            id: "",// process ID
            basicpropsheet: "",
            propsheet: "",
            owner: "", // organization ID
            width: 0,
            height: 0,
        }, defaults, options);
        this._defaults = defaults;
        this._name = pluginName;
        this.stack = new CommandStack();
        this.basicpropsheet = options.basicpropsheet;
        this.propsheet = options.propsheet;
        this.currObject = null;
        this.init(options);
        this.shading(options);
        this.createToolbar(options);
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

        var p3 = $(this.element).messageDialog({
            id: "006",
            title: "轩琦科技 - 提示",
            parent: this,
        });
        this.messageDialog = p3.data("messageDialog");
    };

    Editor.prototype.createToolbar = function (options) {
        var parent = document.createElement("DIV");
        this.toolbarRow.appendChild(parent);
        parent.className = "col-lg-12 col-md-12 col-sm-12 col-xs-12";
        parent.style.margin = "0px";
        parent.style.padding = "2px";

        var c = "btn btn-default";
        var c1 = "btn btn-dangerous";
        var g1 = this.createGroup(parent);
        // fa-lg: 24px; fa-2x ：32px
        this.undobutton = this.createTool(g1, "undo" + this.options.id, "撤销",
            c, "i", "fa fa-reply fa-lg");
        this.redobutton = this.createTool(g1, "redo" + this.options.id, "恢复",
            c, "i", "fa fa fa-share fa-lg");

        var g3 = this.createGroup(parent);
        this.printbutton = this.createTool(g3, "print" + this.options.id, "打印",
            c, "i", "fa fa-print fa-lg");

        this.stack.undoButton = this.undobutton;
        this.stack.redoButton = this.redobutton;
        this.disableButton(this.undobutton);
        this.disableButton(this.redobutton);

        var g4 = this.createGroup(parent);
        this.startbutton = this.createTool(g4, "start" + this.options.id,
            "启动服务器", c, "i", "fa fa-play fa-lg");
        this.stopbutton = this.createTool(g4, "stop" + this.options.id,
            "停止服务器", c, "i", "fa fa-stop fa-lg");
        this.restartbutton = this.createTool(g4, "restart" + this.options.id,
            "重启服务器", c, "i", "fa fa-repeat fa-lg");
        this.startbutton.disabled = true;
        this.stopbutton.disabled = true;

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

    Editor.prototype.shading = function (options) {
        var canvasPanel = document.createElement("DIV");
        this.painterRow.appendChild(canvasPanel);

        canvasPanel.id = "webappPanel" + options.id;
        canvasPanel.className = "col";
        canvasPanel.style.width = options.width + "px";
        canvasPanel.style.margin = "0px";
        canvasPanel.style.padding = "0px";

        var tabDIV = document.createElement("DIV");
        canvasPanel.appendChild(tabDIV);
        tabDIV.className = "col-lg-12 col-md-12 col-sm-12 col-xs-12";
        tabDIV.id = "webappPane" + options.id;
        tabDIV.style.margin = "0px";
        tabDIV.style.padding = "0px";
        tabDIV.style.overflowX = "auto";
        tabDIV.style.overflowY = "auto";
        tabDIV.style.height = (options.height - 84) + "px";

        var tabUL = document.createElement("UL");
        tabDIV.appendChild(tabUL);
        tabUL.className = "nav nav-tabs ms-nav-tabs";
        tabUL.id = "ms-props-nav-tabs" + options.id;
        tabUL.setAttribute("role", "tablist");

        this.newTabHead(tabUL, 0, "配置信息", true);
        this.newTabHead(tabUL, 1, "文件管理", false);
        this.newTabHead(tabUL, 2, "访问量统计", false);

        var that = this;
        $("#ms-props-nav-tabs" + options.id).on("click", "a", function (e) {
            e.preventDefault();
            $(this).tab('show');
            that.currtabindex = parseInt($(this).attr('href').substring(6));
        });

        var tabContents = document.createElement("DIV");
        tabDIV.appendChild(tabContents);
        tabContents.className = "tab-content";
        tabContents.id = "mstabs" + options.id;

        // user editor
        this.tabContent1 = this.newTabContent(tabContents, 0, true);
        if ($(this.tabContent1).mServerConfigureEditor != undefined) {
            var plugin1 = $(this.tabContent1).mServerConfigureEditor({
                id: "mstab0" + options.id,
                cid: options.id,
                basicpropsheet: options.basicpropsheet,
                propsheet: options.propsheet,
                width: options.width,
                height: (options.height - 130),
                parent: this,
            });
            this.containerData = plugin1.data("mServerConfigureEditor");
        }

        this.tabContent2 = this.newTabContent(tabContents, 1, false);
        if ($(this.tabContent2).amFileManagementEditor != undefined) {
            var plugin2 = $(this.tabContent2).amFileManagementEditor({
                id: "mstab1" + options.id,// +this.options.id,
                cid: options.id,
                ownerId: this.options.owner,
                basicpropsheet: options.basicpropsheet,
                propsheet: options.propsheet,
                width: options.width,
                height: (options.height - 130),
                parent: this,
            });
            this.amFileManagement = plugin2.data("amFileManagementEditor");
        }

        this.tabContent3 = this.newTabContent(tabContents, 2, false);
        if ($(this.tabContent3).dataStatisticsEditor != undefined) {
            var plugin3 = $(this.tabContent3).dataStatisticsEditor({
                id: "mstab2" + options.id,
                cid: options.id,
                ownerId: this.options.owner,
                basicpropsheet: options.basicpropsheet,
                propsheet: options.propsheet,
                width: options.width,
                height: (options.height - 130),
                parent: this,
            });
            this.dataStatistics = plugin3.data("dataStatisticsEditor");
        }

        $('#ms-props-nav-tabs'+options.id+' a[href="#mstab' +
            this.currtabindex + options.id + '"]').tab('show');

    };

    Editor.prototype.newTabHead = function (parent, index, caption, active) {
        var tabLi = document.createElement("li");
        parent.appendChild(tabLi);
        if (active)
            tabLi.className = "active";
        tabLi.setAttribute("role", "presentation");
        var tabLink = document.createElement("a");
        tabLi.appendChild(tabLink);
        tabLink.setAttribute("href", "#mstab" + index + this.options.id);
        tabLink.setAttribute("aria-controls", "mstab" + index + this.options.id);
        tabLink.setAttribute("role", "tab");
        tabLink.setAttribute("data-toggle", "tab");
        tabLink.innerHTML = caption;
    };

    Editor.prototype.newTabContent = function (parent, index, active) {
        var tabContent = document.createElement("DIV");
        parent.appendChild(tabContent);
        tabContent.setAttribute("data", "mstab" + index + this.options.id);
        tabContent.setAttribute("role", "tabpanel");
        if (active)
            tabContent.className = "tab-pane active";
        else
            tabContent.className = "tab-pane";
        tabContent.id = "mstab" + index + this.options.id;
        return tabContent;
    };

    Editor.prototype.setPropertySheet = function () {
        this.containerData.setPropertySheet();
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
            || (evt.target.id == ("undo" + this.options.id))) {
            this.stack.undo();
        } else if (evt.target == this.redobutton
            || (evt.target.id == ("redo" + this.options.id))) {
            this.stack.redo();
        } else if (evt.target == this.printbutton
            || evt.target.id == ("print" + this.options.id)) {
            console.log("5");
        } else if (evt.target.id == "start" + this.options.id) {
            this.checkPort();
        } else if (evt.target.id == "stop" + this.options.id) {
            this.stopContainer();
        } else if (evt.target.id == "restart" + this.options.id) {
            this.restartContainer();
        }
    };

    Editor.prototype.startContainer = function (port) {
        var flag = this.checkData();
        if (flag == "0") {
            var that = this;
            $("#progressbar").show();
            $.getJSON(service.api("23"), {
                oid: this.options.owner,
                cid: this.options.id,
                name: this.currObject.containerName,
                tag: this.containerData.currImages.imagesTag,
                port: this.containerData.currImages.imagePort,
                type: this.currObject.containerType,
            }).complete(function (data) {
                if (data.responseJSON != null) {
                    that.loadData(data.responseJSON);
                    that.containerData.currImages.imagePort = port;
                    that.containerData.inputPort.value = port;
                    that.startbutton.disabled = true;
                    that.stopbutton.disabled = false;
                }
                that.dataStatistics.loading(that.currObject.containerType);
                $("#progressbar").hide();
            });
        }
    };

    Editor.prototype.stopContainer = function () {
        var that = this;
        $("#progressbar").show();
        $.getJSON(service.api("24"), {
            containerId: this.currObject.containerId,
        }).complete(function (data) {
            if (data.responseText == "0") {
                that.messageDialog.show("参数为空或者没有创建实例");
                that.startbutton.disabled = false;
                that.stopbutton.disabled = false;
            } else {
                that.startbutton.disabled = true;
                that.stopbutton.disabled = true;
            }
            $("#progressbar").hide();
        });
    };

    Editor.prototype.restartContainer = function () {
        var that = this;
        $("#progressbar").show();
        $.getJSON(service.api("26"), {
            containerId: this.currObject.containerId,
        }).complete(function (data) {
            if (data.responseText == "fail") {
                that.messageDialog.show("参数为空或者没有创建实例");
                that.startbutton.disabled = false;
                that.stopbutton.disabled = false;
            } else {
                that.startbutton.disabled = true;
                that.stopbutton.disabled = false;
                that.dataStatistics.loading(that.currObject.containerType);
            }
            $("#progressbar").hide();
        });
    };
    Editor.prototype.loadingImages = function () {
        var that = this;
        $("#progressbar").show();
        $.getJSON(service.api("21"), {
            type: that.currObject.containerType,
        }).complete(function (data) {
            $("#progressbar").hide();
        });
    };

    Editor.prototype.loadData = function (jsondb) {
        var serviceContainer = new ServiceContainer();
        this.currContainer = serviceContainer;
        this.currContainer.parse(jsondb);
        this.currObject = this.currContainer;
        this.containerData.inputID.value = this.currObject.containerId;
        this.containerData.inputName.disabled = true;
        this.containerData.select.disabled = "disabled";
        //this.dataStatistics.loading();
    };

    Editor.prototype.checkData = function () {
        var name = this.currObject.containerName;
        var tag = this.containerData.select.value;
        if (name != null && name != "") {
            if (tag != "-1") {
                return "0";
            } else {
                this.messageDialog.show("请选择镜像");
                return "1";
            }
        } else {
            this.messageDialog.show("请输入名称");
            return "1";
        }
    };

    Editor.prototype.checkPort = function () {
        var that = this;
        $("#progressbar").show();
        $.getJSON(service.api("27"), {}).complete(function (data) {
            if (data.responseJSON != null) {
                that.startContainer(data.responseJSON.imagePort);
            }
            $("#progressbar").hide();
        });
    };

    Editor.prototype.setPropertySheet = function () {
        if (this.basicpropsheet != null) {
            this.basicpropsheet.setSheet(this.currObject);
        }
        if (this.propsheet != null) {
            this.propsheet.setSheet(this.currObject);
        }
    };

    Editor.prototype.doKeypress = function (evt) {
        evt = evt || window.event;
        if (evt.ctrlKey) {
        }
    };

    Editor.prototype.enableAddButton = function () {
        this.enableButton(this.addbutton);
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