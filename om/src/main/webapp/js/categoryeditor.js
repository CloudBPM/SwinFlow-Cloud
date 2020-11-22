/**
 *
 */
;
(function ($, window, document, undefined) {
    var pluginName = "omCategoryEditor";
    var defaults = {
        id: "",// category ID
        ownerId: "",
        type: "",
        basicpropsheet: "",
        propsheet: "",
        parent: "", // maincontent
        width: 0,
        height: 0,
    };

    var Editor = function (element, options) {
        this.element = element;
        this.options = $.extend({
            id: "",
            ownerId: "",
            type: "",
            basicpropsheet: "",
            propsheet: "",
            parent: "",
            width: 0,
            height: 0,
        }, defaults, options);
        this._defaults = defaults;
        this._name = pluginName;
        this.currObject = null;
        this.currtabindex = 0;
        this.stack = new CommandStack();
        this.init(options);
        this.createToolbar(options);
        this.loading(options);
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
            title: vendor + " - 提交意见",
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
        var c3 = "btn btn-success";
        var g1 = this.createGroup(parent);
        // fa-lg: 24px; fa-2x ：32px
        this.undobutton = this.createTool(g1, "undo" + this.options.id, "撤销",
            c, "i", "fa fa-reply fa-lg");
        this.redobutton = this.createTool(g1, "redo" + this.options.id, "恢复",
            c, "i", "fa fa fa-share fa-lg");

        var g3 = this.createGroup(parent);
        this.leftbutton = this.createTool(g3, "left" + this.options.id, "向左移动",
            c2, "i", "fa fa-arrow-left fa-lg");
        this.rightbutton = this.createTool(g3, "right" + this.options.id, "向右移动",
            c2, "i", "fa fa-arrow-right fa-lg");
        this.disableButton(this.leftbutton);
        this.disableButton(this.rightbutton);

        var g5 = this.createGroup(parent);
        this.upbutton = this.createTool(g5, "up" + this.options.id, "向下移动",
            c2, "i", "fa fa-arrow-up fa-lg");
        this.downbutton = this.createTool(g5, "down" + this.options.id, "向上移动",
            c2, "i", "fa fa-arrow-down fa-lg");
        this.disableButton(this.upbutton);
        this.disableButton(this.downbutton);

        var g10 = this.createGroup(parent);
        this.deletebutton = this.createTool(g10, "delete" + options.id,
            "清除当前表单上的所有组件", c1, "i", "fa fa-trash-o fa-lg");

        var g4 = this.createGroup(parent);
        this.printbutton = this.createTool(g4, "print" + this.options.id, "打印",
            c, "i", "fa fa-print fa-lg");

        var g8 = this.createGroup(parent);
        this.resumebutton = this.createTool(g8, "resume" + this.options.id, "恢复默认界面",
            c, "i", "fa fa-reply-all fa-lg");

        var g9 = this.createGroup(parent);
        this.refreshbutton = this.createTool(g9, "refresh" + this.options.id, "刷新界面",
            c3, "i", "fa fa-refresh fa-lg");

        var g6 = this.createGroup(parent);
        this.pbutton = this.createTool(g6, "preview" + this.options.id, "预览",
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

    Editor.prototype.loading = function (options) {
        var that = this;
        $("#progressbar").show();
        $.getJSON(service.api(38, options.owner), {
            cateid: options.id,
        }).complete(function (data) {
            if (data.responseText != "") {
                // category object
                var c = JSON.parse(data.responseText);
                var cate = new Category();
                cate.parseFromJSON(c);
                that.currObject = cate;
                that.shading(options, cate);
            }
            $("#progressbar").hide();
        });
    };

    Editor.prototype.fetchObject = function () {
        // 保存的时候，才将MbContent对象获取回来。
        this.currObject.mbUIContent = this.mbUIEditor.currObject;
        this.currObject.pcUIContent = this.pcDesktopEditor.currObject;
        var o = this.currObject.stringifyforJSON();
        return o;
    };

    Editor.prototype.refresh = function () {
        this.mbUIEditor.loading(this.currObject);// category object
    };

    Editor.prototype.shading = function (options, obj) {
        var mainPanel = document.createElement("DIV");
        this.painterRow.appendChild(mainPanel);

        mainPanel.id = "cateUIPanel" + options.id;
        mainPanel.className = "col";
        mainPanel.style.width = options.width + "px";
        mainPanel.style.margin = "0px";
        mainPanel.style.padding = "0px";

        this.tabPane = document.createElement("DIV");
        mainPanel.appendChild(this.tabPane);

        this.tabPane.className = "col-lg-12 col-md-12 col-sm-12 col-xs-12";
        this.tabPane.id = "cateUIPane" + options.id;
        this.tabPane.style.margin = "0px";
        this.tabPane.style.padding = "0px";
        this.tabPane.style.height = (options.height - 84) + "px";

        var tabUL = document.createElement("UL");
        this.tabPane.appendChild(tabUL);
        tabUL.className = "nav nav-tabs cateui-nav-tabs";
        tabUL.id = "cateui-props-nav-tabs" + options.id
        tabUL.setAttribute("role", "tablist");
        this.newTabHead(tabUL, 0, "桌面电脑端界面", true);
        this.newTabHead(tabUL, 1, "平板电脑端界面", false);
        this.newTabHead(tabUL, 2, "手机端界面", false);
        // this.newTabHead(tabUL, 3, "用户反馈", false);
        // this.newTabHead(tabUL, 4, "运行数据统计", false);

        var that = this;
        $("#cateui-props-nav-tabs" + options.id).on("click", "a", function (e) {
            // e.preventDefault();
            $(this).tab('show');
            var f = $(this).attr('href').substring(10, 11);
            that.currtabindex = parseInt(f);
            that.setPropertySheet();
        });

        var tabContents = document.createElement("DIV");
        this.tabPane.appendChild(tabContents);
        tabContents.className = "tab-content";
        tabContents.id = "cateuitabs" + options.id;

        this.tabContent1 = this.newTabContent(tabContents, 0, true);
        if ($(this.tabContent1).pcDesktopEditor != undefined) {
            var plugin3 = $(this.tabContent1).pcDesktopEditor({
                id: "cateuitab2" + options.id,
                pid: options.id,
                basicpropsheet: options.basicpropsheet,
                propsheet: options.propsheet,
                owner: options.ownerId,
                width: options.width,
                height: (options.height - 130),
                parent: this,
                sid: this.options.sid,
            });
            this.pcDesktopEditor = plugin3.data("pcDesktopEditor");
            this.pcDesktopEditor.loading(obj);
        }

        this.tabContent2 = this.newTabContent(tabContents, 1, false);
        // if ($(this.tabContent2).orgDiskManagementPane != undefined) {
        // var plugin2 = $(this.tabContent2).orgDiskManagementPane({
        // id : "cateuitab1",
        // parent : this,
        // entity : this.currOwner,
        // topparent : this.element,
        // });
        // this.orgDiskManagementPane = plugin2.data("orgDiskManagementPane");
        // }
        //
        this.tabContent3 = this.newTabContent(tabContents, 2, false);
        if ($(this.tabContent3).mbUIEditor != undefined) {
            var plugin1 = $(this.tabContent3).mbUIEditor({
                id: "cateuitab0" + options.id,
                pid: options.id,
                basicpropsheet: options.basicpropsheet,
                propsheet: options.propsheet,
                width: options.width,
                height: (options.height - 130),
                parent: this,
                ownerId: options.ownerId,
            });
            // 130 is 126 (2 tab height + tool bar height)
            // + 4 (2 gap height + 2 tab border height)
            this.mbUIEditor = plugin1.data("mbUIEditor");
            this.mbUIEditor.loading(obj);// category object
        }

        $('#cateui-props-nav-tabs a[href="#cateuitab' + this.currtabindex + options.id + '"]').tab('show');

    };

    Editor.prototype.newTabHead = function (parent, index, caption, active) {
        var tabLi = document.createElement("li");
        parent.appendChild(tabLi);
        if (active)
            tabLi.className = "active";
        tabLi.setAttribute("role", "presentation");
        var tabLink = document.createElement("a");
        tabLi.appendChild(tabLink);
        tabLink.setAttribute("href", "#cateuitab" + index + this.options.id);
        tabLink.setAttribute("aria-controls", "cateuitab" + index + this.options.id);
        tabLink.setAttribute("role", "tab");
        tabLink.setAttribute("data-toggle", "tab");
        tabLink.innerHTML = caption;
    };

    Editor.prototype.newTabContent = function (parent, index, active) {
        var tabContent = document.createElement("DIV");
        parent.appendChild(tabContent);
        tabContent.setAttribute("data", "cateuitab" + index + this.options.id);
        tabContent.setAttribute("role", "tabpanel");
        if (active)
            tabContent.className = "tab-pane active";
        else
            tabContent.className = "tab-pane";
        tabContent.id = "cateuitab" + index + this.options.id;
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
            if (this.currtabindex == 0) {
            } else if (this.currtabindex == 1) {
            } else if (this.currtabindex == 2) {
            }
        } else if (evt.target == this.refreshbutton
            || evt.target.id == ("refresh" + this.options.id)) {
            if (this.currObject != null) {
                var that = this;
                $("#progressbar").show();
                $.getJSON(service.api(38, this.options.owner), {
                    cateid: this.currObject.id,
                }).complete(function (data) {
                    if (data.responseText != "") {
                        var c = JSON.parse(data.responseText);
                        var cate = new Category();
                        cate.parseFromJSON(c);
                        if (that.currtabindex == 0) {
                            map[that.currObject.id].stack.execute(
                                new OMCategoryUIContentChangeCmd(that.currObject, cate.mbUIContent));
                        } else if (that.currtabindex == 2) {

                        }
                    }
                    $("#progressbar").hide();
                });
            }

        } else if (evt.target == this.pbutton
            || evt.target.id == ("preview" + this.options.id)) {
            if (this.currtabindex == 0) {
                service.previewdesktopui(this.options.id, this.options.ownerId);
            } else if (this.currtabindex == 1) {
            } else if (this.currtabindex == 2) {
                service.previewmbui(this.options.id, this.options.ownerId);
            }
        } else if (evt.target == this.rlbutton
            || evt.target.id == ("release" + this.options.id)) {
            if (this.currtabindex == 0) {
            } else if (this.currtabindex == 1) {
            } else if (this.currtabindex == 2) {
                this.submittingDialog.show(
                    this.releasedWfProcessEditor.wfprocess.id, 0);
            }
        } else if (evt.target == this.wdbutton
            || evt.target.id == ("widthdraw" + this.options.id)) {
            if (this.currtabindex == 0) {
            } else if (this.currtabindex == 1) {
            } else if (this.currtabindex == 2) {
                this.submittingDialog.show(
                    this.releasedWfProcessEditor.wfprocess.id, 1);
            }
        } else if (evt.target == this.leftbutton
            || evt.target.id == ("left" + this.options.id)) {
            if (this.currtabindex == 0) {
            } else if (this.currtabindex == 1) {
            } else if (this.currtabindex == 2) {
                this.mbUIEditor.moveLeftAction();
            }
        } else if (evt.target == this.rightbutton
            || evt.target.id == ("right" + this.options.id)) {
            if (this.currtabindex == 0) {
            } else if (this.currtabindex == 1) {
            } else if (this.currtabindex == 2) {
                this.mbUIEditor.moveRightAction();
            }
        } else if (evt.target == this.upbutton
            || evt.target.id == ("up" + this.options.id)) {
            if (this.currtabindex == 0) {

            } else if (this.currtabindex == 1) {
            } else if (this.currtabindex == 2) {
                this.mbUIEditor.moveUpAction();
            }
        } else if (evt.target == this.downbutton
            || evt.target.id == ("down" + this.options.id)) {
            if (this.currtabindex == 0) {
            } else if (this.currtabindex == 1) {
            } else if (this.currtabindex == 2) {
                this.mbUIEditor.moveDownAction();
            }
        } else if (evt.target == this.deletebutton
            || evt.target.id == ("delete" + this.options.id)) {
            if (this.currtabindex == 0) {
            } else if (this.currtabindex == 1) {
            } else if (this.currtabindex == 2) {
                this.pcDesktopEditor.clearAll(evt);
            }
        } else if (evt.target == this.resumebutton
            || evt.target.id == ("resume" + this.options.id)) {
            if (this.currObject.assignCategoryId != null) {
                var that = this;
                $("#progressbar").show();
                $.getJSON(service.api(38, this.options.owner), {
                    cateid: this.currObject.assignCategoryId,
                }).complete(function (data) {
                    if (data.responseText != "") {
                        var c = JSON.parse(data.responseText);
                        var cate = new Category();
                        cate.parseFromJSON(c);
                        if (that.currtabindex == 0) {
                            map[that.currObject.id].stack.execute(
                                new OMCategoryUIContentChangeCmd(that.currObject, cate.mbUIContent));
                        } else if (that.currtabindex == 2) {
                        }
                    }
                    $("#progressbar").hide();
                });
            }
        }
    };

    // 发布和下架业务流程应用，即修改业务流程应用的状态
    Editor.prototype.doSubmit = function (id, status, comment) {
    };

    Editor.prototype.doKeypress = function (evt) {
        evt = evt || window.event;
        if (evt.ctrlKey) {
        }
    };

    Editor.prototype.repaint = function () {
        if (this.currtabindex == 0) {
            this.pcDesktopEditor.updateDom();
        } else if (this.currtabindex == 2) {
            this.mbUIEditor.repaint();
        }
    };

    Editor.prototype.setPropertySheet = function () {
        if (this.currtabindex == 0) {
            this.pcDesktopEditor.setPropertySheet();
        } else if (this.currtabindex == 2) {
            this.mbUIEditor.setPropertySheet();
        }
    };

    Editor.prototype.enableButton = function (button) {
        button.disabled = false;
    };

    Editor.prototype.disableButton = function (button) {
        button.disabled = true;
    };

    Editor.prototype.enableLeftButton = function () {
        this.enableButton(this.leftbutton);
    };

    Editor.prototype.enableRightButton = function () {
        this.enableButton(this.rightbutton);
    };

    Editor.prototype.disableLeftButton = function () {
        this.disableButton(this.leftbutton);
    };

    Editor.prototype.disableRightButton = function () {
        this.disableButton(this.rightbutton);
    };

    Editor.prototype.enableUpButton = function () {
        this.enableButton(this.upbutton);
    };

    Editor.prototype.enableDownButton = function () {
        this.enableButton(this.downbutton);
    };

    Editor.prototype.enableRemoveButton = function () {
        this.enableButton(this.deletebutton);
    };

    Editor.prototype.disableRemoveButton = function () {
        this.disableButton(this.deletebutton);
    };

    Editor.prototype.disableUpButton = function () {
        this.disableButton(this.upbutton);
    };

    Editor.prototype.disableDownButton = function () {
        this.disableButton(this.downbutton);
    };

    Editor.prototype.disableAllArrowButtons = function () {
        this.disableButton(this.leftbutton);
        this.disableButton(this.rightbutton);
        this.disableButton(this.upbutton);
        this.disableButton(this.downbutton);
    };


    Editor.prototype.getDirty = function () {
        return this.stack.isDirty();
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
