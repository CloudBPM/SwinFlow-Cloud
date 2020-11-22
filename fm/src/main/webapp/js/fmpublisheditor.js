;
(function ($, window, document, undefined) {
    var pluginName = "fmFormPublishEditor";
    var defaults = {
        id: "", // form ID
        userId: "",
        userfullname: "",
        ownername: "",
        basicpropsheet: "",
        propsheet: "",
        owner: "", // organization ID
        width: 0,
        height: 0,
        sid: "",
    };

    var Editor = function (element, options) {
        this.element = element;
        this.options = $.extend({
            id: "",// form ID
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
        this.painterRow = null;
        this.toolbarRow = null;
        this.currObject = null;
        this.canvas = null;
        this.basicpropsheet = options.basicpropsheet;
        this.propsheet = options.propsheet;
        this.selected = null;

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

        var p3 = $(this.element).submittingDialog({
            id: "006",
            title: "轩琦科技 - 提交意见",
            parent: this,
        });
        this.submittingDialog = p3.data("submittingDialog");
    };

    Editor.prototype.createToolbar = function (options) {
        var parent = document.createElement("DIV");
        this.toolbarRow.appendChild(parent);
        parent.className = "col-lg-12 col-md-12 col-sm-12 col-xs-12";
        parent.style.margin = "0px";
        parent.style.padding = "2px";

        var c = "btn btn-default";
        var c1 = "btn btn-danger";
        var c2 = "btn btn-primary";
        var g1 = this.createGroup(parent);
        // fa-lg: 24px; fa-2x ：32px
        this.undobutton = this.createTool(g1, "undo" + this.options.id, "撤销",
            c, "i", "fa fa-reply fa-lg");
        this.redobutton = this.createTool(g1, "redo" + this.options.id, "恢复",
            c, "i", "fa fa-share fa-lg");
        this.stack.undoButton = this.undobutton;
        this.stack.redoButton = this.redobutton;
        this.disableButton(this.undobutton);
        this.disableButton(this.redobutton);

        var g3 = this.createGroup(parent);
        this.printbutton = this.createTool(g3, "print" + this.options.id, "打印",
            c2, "i", "fa fa-print fa-lg");

        var g5 = this.createGroup(parent);
        this.mobile = this.createTool(g5, "mobile" + this.options.id, "智能手机",
            c, "i", "fa fa-mobile fa-lg");
        this.tablet = this.createTool(g5, "tablet" + this.options.id, "平板电脑",
            c, "i", "fa fa-tablet fa-lg");
        this.laptop = this.createTool(g5, "laptop" + this.options.id, "手提电脑",
            c, "i", "fa fa-laptop fa-lg");
        this.desktop = this.createTool(g5, "desktop" + this.options.id, "台式电脑",
            c, "i", "fa fa-desktop fa-lg");
        this.desktop.classList.add("active");

        var g4 = this.createGroup(parent);
        this.portrait = this.createTool(g4, "portrait" + this.options.id,
            "设备竖放的界面效果", c, "i", "fa fa-arrows-v fa-lg");
        this.landscape = this.createTool(g4, "landscape" + this.options.id,
            "设备横放的界面效果", c, "i", "fa fa-arrows-h fa-lg");
        this.portrait.classList.add("active");

        var g5 = this.createGroup(parent);
        this.preview = this.createTool(g5, "preview" + this.options.id,
            "预览实际运行效果", c2, "i", "fa fa-coffee fa-lg");

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

    Editor.prototype.shading = function (options) {
        var canvasPanel = document.createElement("DIV");
        this.painterRow.appendChild(canvasPanel);

        canvasPanel.id = "rlpcanvasPanel" + options.id;
        canvasPanel.className = "row";
        canvasPanel.style.width = options.width + "px";
        canvasPanel.style.margin = "0px";
        canvasPanel.style.marginLeft = "0px";
        canvasPanel.style.padding = "0px";

        this.canvasPane = document.createElement("DIV");
        canvasPanel.appendChild(this.canvasPane);

        this.canvasPane.className = "col-lg-12 col-md-12 col-sm-12 col-xs-12";
        this.canvasPane.id = "rlprocPane" + options.id;
        this.canvasPane.style.margin = "0px";
        this.canvasPane.style.padding = "0px";
        this.canvasPane.style.overflowX = "auto";
        this.canvasPane.style.overflowY = "auto";
        // this.canvasPane.style.border = "1px solid #ddd";
        this.canvasPane.clientHeight = (options.height - 82) + "px";

        var tabDIV = document.createElement("DIV");
        this.canvasPane.appendChild(tabDIV);
        tabDIV.style.margin = "1px";

        var tabUL = document.createElement("UL");
        tabDIV.appendChild(tabUL);
        tabUL.className = "nav nav-tabs rlfrm-nav-tabs";
        tabUL.id = "rlfrm-props-nav-tabs" + options.id;
        tabUL.setAttribute("role", "tablist");
        this.newTabHead(tabUL, 0, "已版本化表单", true);
        if (pversion > 2) {
            this.newTabHead(tabUL, 1, "详细介绍", false);
            this.newTabHead(tabUL, 2, "版本更新记录", false);
            this.newTabHead(tabUL, 3, "用户反馈", false);
            this.newTabHead(tabUL, 4, "运行数据统计", false);
        }

        var tabContents = document.createElement("DIV");
        tabDIV.appendChild(tabContents);
        tabContents.className = "tab-content";
        tabContents.id = "rlfrmtabs";

        var that = this;
        $(tabUL).on("click", "a", function (e) {
            //e.preventDefault();
            $(this).tab('show');
            that.currtabindex = $(this).attr('href').substring(4, 5);
            if (that.currtabindex == 0) {
                that.rlfmEditor.loadingObject(that.rlfmEditor.options);
            }
        });

        this.tabContent1 = this.newTabContent(tabContents, 0, true);
        if ($(this.tabContent1).rlfmEditor != undefined) {
            var plugin1 = $(this.tabContent1).rlfmEditor({
                id: "tab0" + options.id,
                fid: options.id,
                basicpropsheet: options.basicpropsheet,
                propsheet: options.propsheet,
                width: options.width,
                height: (options.height - 128),
                parent: this,
                owner: options.owner,
            });
            // 130 is 126 (2 tab height + tool bar height)
            // + 4 (2 gap height + 2 tab border height)
            this.rlfmEditor = plugin1.data("rlfmEditor");
        }

        if (pversion > 2) {
            this.tabContent2 = this.newTabContent(tabContents, 1, false);
            // if ($(this.tabContent2).orgDiskManagementPane != undefined) {
            // var plugin2 = $(this.tabContent2).orgDiskManagementPane({
            // id : "tab1"+options.id,,
            // parent : this,
            // entity : this.currObject,
            // topparent : this.element,
            // });
            // this.orgDiskManagementPane = plugin2.data("orgDiskManagementPane");
            // }
            //
            this.tabContent3 = this.newTabContent(tabContents, 2, false);
            // if ($(this.tabContent3).orgPaymentManagementPane != undefined) {
            // var plugin3 = $(this.tabContent3).orgPaymentManagementPane({
            // id : "tab2"+options.id,,
            // parent : this,
            // entity : this.currObject,
            // topparent : this.element,
            // });
            // this.orgPaymentManagementPane = plugin3
            // .data("orgPaymentManagementPane");
            // }
            //
            this.tabContent4 = this.newTabContent(tabContents, 3, false);

            this.tabContent5 = this.newTabContent(tabContents, 4, false);
        }

        // console.log(this.currtabindex);

        this.showTab(this.currtabindex);

    };

    Editor.prototype.showTab = function (index) {
        $('#rlfrm-props-nav-tabs' + this.options.id + ' a[href="#tab' + index + this.options.id + '"]').tab(
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
        tabLink.setAttribute("href", "#tab" + index + this.options.id);
        tabLink.setAttribute("aria-controls", "tab" + index + this.options.id);
        tabLink.setAttribute("role", "tab");
        tabLink.setAttribute("data-toggle", "tab");
        tabLink.innerHTML = caption;
    };

    Editor.prototype.newTabContent = function (parent, index, active) {
        var tabContent = document.createElement("DIV");
        parent.appendChild(tabContent);
        tabContent.setAttribute("data", "tab" + index + this.options.id);
        tabContent.setAttribute("role", "tabpanel");
        if (active)
            tabContent.className = "tab-pane active";
        else
            tabContent.className = "tab-pane";
        tabContent.id = "tab" + index + this.options.id;
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
        } else if (evt.target == this.mobile
            || evt.target.id == ("mobile" + this.options.id)) {
            this.mobile.classList.add("active");
            this.tablet.classList.remove("active");
            this.laptop.classList.remove("active");
            this.desktop.classList.remove("active");
            this.currObject.dom.style.width = "483px";
        } else if (evt.target == this.tablet
            || evt.target.id == ("tablet" + this.options.id)) {
            this.tablet.classList.add("active");
            this.mobile.classList.remove("active");
            this.laptop.classList.remove("active");
            this.desktop.classList.remove("active");
            this.currObject.dom.style.width = "738px";
        } else if (evt.target == this.laptop
            || evt.target.id == ("laptop" + this.options.id)) {
            this.laptop.classList.add("active");
            this.mobile.classList.remove("active");
            this.tablet.classList.remove("active");
            this.desktop.classList.remove("active");
            this.currObject.dom.style.width = "1360px";
        } else if (evt.target == this.desktop
            || evt.target.id == ("desktop" + this.options.id)) {
            this.desktop.classList.add("active");
            this.mobile.classList.remove("active");
            this.tablet.classList.remove("active");
            this.laptop.classList.remove("active");
            this.currObject.dom.style.width = "1920px";
        } else if (evt.target == this.landscape
            || evt.target.id == ("landscape" + this.options.id)) {
            this.landscape.classList.add("active");
            this.portrait.classList.remove("active");
        } else if (evt.target == this.portrait
            || evt.target.id == ("portrait" + this.options.id)) {
            this.portrait.classList.add("active");
            this.landscape.classList.remove("active");
        } else if (evt.target == this.preview
            || evt.target.id == ("preview" + this.options.id)) {
            //this.previewDlg.show(this.currObject.clone());
            window.open("fmpreview.jsp?sessionId=" + this.options.sid + "&fid=" + this.options.id + "&r=1");
        } else if (evt.target == this.rlbutton
            || evt.target.id == ("release" + this.options.id)) {
            if (approval == 0) {
                // 自动审核
                this.doSubmit(this.currObject.id, 2, "自动审核通过");
            } else {
                // 手工审核
                this.submittingDialog.show(this.currObject.id, 0);
            }
        } else if (evt.target == this.wdbutton
            || evt.target.id == ("widthdraw" + this.options.id)) {
            if (approval == 0) {
                // 自动审核
                this.doSubmit(this.currObject.id, 1, "自动审核撤下");
            } else {
                // 手工审核
                this.submittingDialog.show(this.currObject.id, 1);
            }
        }
        Utils.stopBubble(evt);
    };

    // 发布和下架业务流程应用，即修改业务流程应用的状态
    Editor.prototype.doSubmit = function (id, status, comment) {
        var that = this;
        $("#progressbar").show();
        $.post(service.api(19), {
            id: id,
            d: status,
            lastupdate: (new Date()).getTime(),
            userId: this.options.userId,
            userfullname: this.options.userfullname,
            ownername: this.options.ownername,
            owner: this.options.owner,
            comment: comment,
        }, function (data) {
            if (approval == 1) {
                if (status == 0) { // 点击上线按钮
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
                that.rlfmEditor.currObject.deprecated = status;
                that.setPropertySheet();
                that.submittingDialog.hide();
            } else if (approval == 0) {
                if (status == 2) { // 点击上线按钮
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
                that.rlfmEditor.currObject.deprecated = status;
                that.setPropertySheet();
            }
            $("#progressbar").hide();
        });
    };

    Editor.prototype.setPropertySheet = function () {
        var obj = this.currObject;
        if (this.selected != null) {
            obj = this.selected;
        }
        if (this.basicpropsheet != null) {
            this.basicpropsheet.setSheet(obj, this.currObject);
        }
        if (this.propsheet != null) {
            this.propsheet.setSheet(obj, this.currObject, this.propsheet
                .getCurrTabIndex(obj));
        }
    };

    Editor.prototype.doKeypress = function (evt) {
        evt = evt || window.event;
        if (evt.ctrlKey) {
        }
    };

    Editor.prototype.enableEditButtons = function () {
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