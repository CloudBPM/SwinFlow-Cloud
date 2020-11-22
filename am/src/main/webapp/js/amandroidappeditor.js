;
(function ($, window, document, undefined) {
    var pluginName = "amAndroidAppMSPluginEditor";
    var defaults = {
        id: "", // android micro-service ID
        userId: "",
        userfullname: "",
        ownername: "",
        basicpropsheet: "",
        propsheet: "",
        owner: "", // organization ID
        width: 0,
        height: 0,
    };

    var Editor = function (element, options) {
        this.element = element;
        this.options = $.extend({
            id: "",// android micro-service ID
            userId: "",
            userfullname: "",
            ownername: "",
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

        // general message dialog plugin
        var p3 = $(this.element).messageDialog({
            id: "005231",
            title: vendor + " - 提示",
            parent: this,
        });
        this.messageDialog = p3.data("messageDialog");

        var p3 = $(this.element).submittingDialog({
            id: "006231",
            title: vendor + " - 提交意见",
            parent: this,
        });
        this.submittingDialog = p3.data("submittingDialog");

        this.loadingAppMSPlugin(options);
    };

    Editor.prototype.loadingAppMSPlugin = function (options) {
        $("progressbar").show();
        var that = this;
        $.getJSON(service.api(30), {
            id: options.id,
        }).complete(function (data) {
            var data = JSON.parse(data.responseText);
            that.loadData(data, options);
            that.shading(options);
            if (that.currObject.status != 1) {
                that.wdbutton.classList.add("active");
                that.wdbutton.disabled = true;
            } else {
                that.rlbutton.classList.add("active");
                that.rlbutton.disabled = true;
            }
            $("#progressbar").hide();
        });
    };

    Editor.prototype.loadData = function (data, options) {
        this.currObject = new AndroidAppPlugin();
        this.currObject.parsefromJSON(data);
        this.setPropertySheet();
    };

    Editor.prototype.createToolbar = function (options) {
        var parent = document.createElement("DIV");
        this.toolbarRow.appendChild(parent);
        parent.className = "col-lg-12 col-md-12 col-sm-12 col-xs-12";
        parent.style.margin = "0px";
        parent.style.padding = "2px";

        var c = "btn btn-default";
        var c1 = "btn btn-dangerous";
        var c2 = "btn btn-success";
        var g1 = this.createGroup(parent);
        // fa-lg: 24px; fa-2x ：32px
        this.undobutton = this.createTool(g1, "undo" + this.options.id, "撤销",
            c, "i", "fa fa-reply fa-lg");
        this.redobutton = this.createTool(g1, "redo" + this.options.id, "恢复",
            c, "i", "fa fa-share fa-lg");

        var g3 = this.createGroup(parent);
        this.printbutton = this.createTool(g3, "print" + this.options.id, "打印",
            c, "i", "fa fa-print fa-lg");

        this.stack.undoButton = this.undobutton;
        this.stack.redoButton = this.redobutton;
        this.disableButton(this.undobutton);
        this.disableButton(this.redobutton);

        var group1 = this.createGroup(parent);
        this.refreshbutton = this.createTool(group1, "refresh" + this.options.id,
            "刷新", c2, "i", "fa fa-refresh fa-lg");

        var group2 = this.createGroup(parent);
        this.sendtestbutton = this.createTool(group2, "sendTest" + this.options.id,
            "发送测试请求", c, "i", "fa fa-paper-plane fa-lg");

        var g7 = this.createGroup(parent);
        this.rlbutton = this.createTool(g7, "release" + this.options.id,
            "申请发布服务", c, "i", "fa fa-cloud-upload fa-lg");
        this.wdbutton = this.createTool(g7, "widthdraw" + this.options.id,
            "撤回服务", c, "i", "fa fa-cloud-download fa-lg");
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

    Editor.prototype.createTool = function (group,
                                            id,
                                            title,
                                            style,
                                            fonttag,
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

        this.canvasPane = document.createElement("DIV");
        canvasPanel.appendChild(this.canvasPane);

        this.canvasPane.className = "col-lg-12 col-md-12 col-sm-12 col-xs-12";
        this.canvasPane.id = "webappPane" + options.id;
        this.canvasPane.style.margin = "0px";
        this.canvasPane.style.padding = "0px";
        this.canvasPane.style.overflowX = "auto";
        this.canvasPane.style.overflowY = "auto";
        this.canvasPane.style.height = (options.height - 84) + "px";

        this.canvas = document.createElement("DIV");
        this.canvasPane.appendChild(this.canvas);

        var tabDIV = document.createElement("DIV");
        this.canvasPane.appendChild(tabDIV);
        tabDIV.style.margin = "0px";

        var tabUL = document.createElement("UL");
        tabUL.className = "nav nav-tabs andriodms-nav-tabs";
        tabUL.id = "andriodms-props-nav-tabs";
        tabUL.setAttribute("role", "tablist");
        tabDIV.appendChild(tabUL);
        this.newTabHead(tabUL, 0, "安卓微服务插件", true);
        this.newTabHead(tabUL, 1, "详细介绍", false);
        this.newTabHead(tabUL, 2, "更新记录", false);
        this.newTabHead(tabUL, 3, "用户反馈", false);
        this.newTabHead(tabUL, 4, "访问量统计", false);

        var that = this;
        $("#andriodms-props-nav-tabs").on("click", "a", function (e) {
            // e.preventDefault();
            $(this).tab('show');
            that.currtabindex = parseInt($(this).attr('href').substring(4));
        });

        var tabContents = document.createElement("DIV");
        tabDIV.appendChild(tabContents);
        tabContents.className = "tab-content";
        tabContents.id = "mstabs";

        // 130 is 126 (2 tab height + tool bar height)
        // + 4 (2 gap height + 2 tab border height)
        this.tabContent1 = this.newTabContent(tabContents, 0, true);
        if ($(this.tabContent1).amAndroidPluginEditor != undefined) {
            var plugin1 = $(this.tabContent1).amAndroidPluginEditor({
                id: "tab1",
                appid: options.id,
                alias : this.currObject.alias,
                basicpropsheet: options.basicpropsheet,
                propsheet: options.propsheet,
                width: options.width,
                height: (options.height - 130),
                parent: this,
                ownerId: options.owner,
            });
            this.amAndroidPluginEditor = plugin1.data("amAndroidPluginEditor");
        }

        this.tabContent2 = this.newTabContent(tabContents, 1, false);

        this.tabContent3 = this.newTabContent(tabContents, 2, false);

        this.tabContent4 = this.newTabContent(tabContents, 3, false);

        this.tabContent5 = this.newTabContent(tabContents, 4, false);

        $('#andriodms-props-nav-tabs a[href="#tab' + this.currtabindex + '"]').tab(
            'show');

    };

    Editor.prototype.newTabHead = function (parent, index, caption, active) {
        var tabLi = document.createElement("li");
        parent.appendChild(tabLi);
        if (active)
            tabLi.className = "active";
        tabLi.setAttribute("role", "presentation");
        var tabLink = document.createElement("a");
        tabLi.appendChild(tabLink);
        tabLink.setAttribute("href", "#tab" + index);
        tabLink.setAttribute("aria-controls", "tab" + index);
        tabLink.setAttribute("role", "tab");
        tabLink.setAttribute("data-toggle", "tab");
        tabLink.innerHTML = caption;
    };

    Editor.prototype.newTabContent = function (parent, index, active) {
        var tabContent = document.createElement("DIV");
        parent.appendChild(tabContent);
        tabContent.setAttribute("data", "tab" + index);
        tabContent.setAttribute("role", "tabpanel");
        if (active)
            tabContent.className = "tab-pane active";
        else
            tabContent.className = "tab-pane";
        tabContent.id = "tab" + index;
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
        if (evt.target == this.sendtestbutton
            || (evt.target.id == ("sendTest" + this.options.id))) {
            //console.log("3");
        } else if (evt.target == this.refreshbutton
            || (evt.target.id == ("refresh" + this.options.id))) {
            this.amAndroidPluginEditor.refresh();
            return;
        } else if (evt.target == this.undobutton
            || evt.target.id == ("undo" + this.options.id)) {
            this.stack.undo();
        } else if (evt.target == this.redobutton
            || evt.target.id == ("redo" + this.options.id)) {
            this.stack.redo();
        } else if (evt.target == this.printbutton
            || evt.target.id == ("print" + this.options.id)) {
            console.log("5");
        } else if (evt.target == this.rlbutton
            || evt.target.id == ("release" + this.options.id)) {
            this.submittingDialog.show(this.options.id, 1);
        } else if (evt.target == this.wdbutton
            || evt.target.id == ("widthdraw" + this.options.id)) {
            this.submittingDialog.show(this.options.id, 0);
        }
        Utils.stopBubble(evt);
    };

    // 发布和下架业务流程应用，即修改业务流程应用的状态
    Editor.prototype.doSubmit = function (id, status, comment) {
        var that = this;
        $("#progressbar").show();
        $.post(service.api(31), {
            id: id,
            d: status,
            lastupdate: (new Date()).getTime(),
            userId: this.options.userId,
            userfullname: this.options.userfullname,
            ownername: this.options.ownername,
            owner: this.options.owner,
            comment: comment,
        }, function (data) {
            if (status == 1) { // 点击上线按钮
                that.rlbutton.classList.add("active");
                that.rlbutton.disabled = true;
                that.wdbutton.classList.remove("active");
                that.wdbutton.disabled = false;
            } else { // 点击下线按钮
                that.wdbutton.classList.add("active");
                that.wdbutton.disabled = true;
                that.rlbutton.classList.remove("active");
                that.rlbutton.disabled = false;
            }
            that.currObject.status = status;
            that.setPropertySheet();
            that.submittingDialog.hide();
            $("#progressbar").hide();
        });
    };

    Editor.prototype.setPropertySheet = function() {
        // basic property setting
        if (this.basicpropsheet != null) {
            this.basicpropsheet.setSheet(this.currObject);
        }
        // advanced property setting.
        if (this.propsheet != null) {
            this.propsheet.setSheet(this.currObject, this.propsheet
                .getCurrTabIndex(this.currObject));
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

    Editor.prototype.disableAddButton = function () {
        this.disableButton(this.addbutton);
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