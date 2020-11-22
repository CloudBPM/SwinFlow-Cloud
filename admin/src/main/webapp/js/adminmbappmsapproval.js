/**
 *
 */
;
// 在审核过程中，不管手机APP微服务的状态如何改变，都应该发送一条通知给用户，告知结果
(function ($, window, document, undefined) {
    var pluginName = "adminMobileAppMSApproval";
    var defaults = {
        id: "",
        userId: "",
        userfullname: "",
        ownername: "",
        owner: "",
        basicpropsheet: "",
        propsheet: "",
        width: 0,
        height: 0,
        parent: "",
    };

    var Editor = function (element, options) {
        this.element = element;
        this.options = $.extend({
            id: "",
            userId: "",
            userfullname: "",
            ownername: "",
            owner: "",
            basicpropsheet: "",
            propsheet: "",
            width: 0,
            height: 0,
            parent: "",
        }, defaults, options);
        this._defaults = defaults;
        this._name = pluginName;
        this.stack = new CommandStack();
        this.currObject = null;
        this.basicpropsheet = options.basicpropsheet;
        this.propsheet = options.propsheet;
        this.newsStatus = 99;
        this.init(options);
    };

    Editor.prototype.init = function (options) {
        // basic property sheet plugin
        var p1 = $(this.element).readonlyTableViewer({
            id: options.id,
            ownerId: options.ownerId,
            basicpropsheet: options.basicpropsheet,
            propsheet: options.propsheet,
            width: options.width,
            height: options.height,
            parent: this,
            type: "ext",
        });
        this.listViewPane = p1.data("readonlyTableViewer");
        this.listViewPane.init();
        this.listViewPane.createToolbar();
        this.listViewPane.headersize = 4;
        this.listViewPane.loading(1, this.listViewPane.pagesize, "",
            options.ownerId);

        // confirm message dialog plugin
        var p2 = $(this.element).confirmInfoDialog({ // 确认对话框
            id: "005",
            title: vendor + " - 提示",
            parent: this,
        });
        this.confirmInfoDialog = p2.data("confirmInfoDialog");

        var p3 = $(this.element).submittingDialog({
            id: "006",
            title: vendor + " - 提交意见",
            parent: this,
        });
        this.submittingDialog = p3.data("submittingDialog");
    };

    // 获取Mobile App Plugin列表
    Editor.prototype.loading = function (pageno, pagesize, condition, owner) {
        $("#progressbar").show();
        var that = this;
        $.getJSON(service.api("29"), {
            pn: pageno,
            psz: pagesize,
            cond: condition,
            newsState: this.newsStatus, // 查询所有符合状态的App Plugins
        }).complete(function (data) {
            that.listViewPane.loadData(data.responseJSON);
            that.setPropertySheet();
            $("#progressbar").hide();
        });
    };

    Editor.prototype.createCells = function (obj) {
        var plugin = new AndroidAppPlugin();
        plugin.parsefromJSON(obj);
        this.listViewPane.objects.push(plugin);
        var row = this.listViewPane.tableList.insertRow(-1);
        row.setAttribute("key", plugin.id);
        row.addEventListener("click", this, false);
        row.addEventListener("dblclick", this, false);

        this.listViewPane.createCell(0, Utils.parse(plugin.name), row);
        this.listViewPane.createCell(1, Utils.getDateTime(new Date(plugin.lastupdate).getTime()), row);
        this.listViewPane.createCell(2, onlinestatus[plugin.status], row);

        // 创建操作按钮
        var cell = this.listViewPane.createCell(3, "", row);
        var b1 = this.createIcon(cell, plugin.id, "4",
            "fa fa-thumbs-o-down fa-lg", "sendback", "审核未通过", "");
        var b2 = this.createIcon(cell, plugin.id, "5",
            "fa fa-cloud-upload fa-lg", "online", "发布", "");
        var b3 = this.createIcon(cell, plugin.id, "6",
            "fa fa-cloud-download fa-lg", "offline", "撤回", "");
        var b4 = this.createIcon(cell, plugin.id, "7", "fa fa-trash fa-lg",
            "deleteNews", "删除", "btn-danger");
        this.buttonSelected(plugin.status, b1, b2, b3, b4);
    };

    Editor.prototype.buttonSelected = function (status, b1, b2, b3, b4) {
        switch (status) {
            case 1:// 审核中
                b3.classList.add("active");
                b3.disabled = true;
                break;
            case 2:// 已发布
                b1.classList.add("active");
                b1.disabled = true;
                b2.classList.add("active");
                b2.disabled = true;
                break;
            default:
                break;
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

    Editor.prototype.addExtraButtons = function (parent) {
        var group = this.createGroup(parent);
        this.addButton = this.createSelection(group);
    };

    Editor.prototype.createSelection = function (group) {
        var colDIV2 = document.createElement("DIV");
        group.appendChild(colDIV2);
        colDIV2.className = "col-sm-10";

        this.statusSelect = document.createElement("SELECT");
        colDIV2.appendChild(this.statusSelect);
        this.statusSelect.className = "form-control";
        this.statusSelect.addEventListener("change", this, false);
        this.addOptions(this.statusSelect, "--请选择状态--", -1, 0);
        this.addOptions(this.statusSelect, "全部", 99, 1);
        this.addOptions(this.statusSelect, "已发布", 2, 2);
        this.addOptions(this.statusSelect, "发布待审核", 1, 3);
    };

    Editor.prototype.addOptions = function (parent, title, value, index) {
        var option = document.createElement("option");
        option.text = title;
        option.value = value;
        parent.options.add(option, index);
    };

    // 发布和下架新闻，即修改新闻的状态
    Editor.prototype.doSubmit = function (id, status, comment) {
        var that = this;
        $("#progressbar").show();
        $.post(service.api(30), {
            d: status,
            id: id,
            lastupdate: new Date().getTime(),
            comment: comment,
            owner: this.options.owner,
            userId: this.options.userId,
            userfullname: this.options.userfullname,
            ownername: this.options.ownername,
        }, function (data) {
            that.submittingDialog.hide();
            that.listViewPane.refresh();
            $("#progressbar").hide();
        });
    };

    Editor.prototype.createIcon = function (parent, id, num,
                                            classname, name,
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
        button.addEventListener("click", function (evt) {
            if (this.name == "sendback") {
                that.submittingDialog.show(id, 4);
            } else if (this.name == "online") {
                that.submittingDialog.show(id, 2);
            } else if (this.name == "offline") {
                that.submittingDialog.show(id, 1);
            } else if (this.name == "deleteNews") {
                that.delNewsid = id;
                that.confirmInfoDialog.show("您确定删除该手机APP微服务插件吗？（请谨慎操作，不可恢复）");
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

    Editor.prototype.handleEvent = function (e) {
        this.listViewPane.handleEvent(e);
        switch (e.type) {
            case "click":
                this.doClick(e);
                break;
            case "change":
                this.doChange(e);
                break;
        }
        Utils.stopBubble(e);
    };

    Editor.prototype.doNoAction = function (evt) {
        Utils.stopBubble(evt);
        this.confirmInfoDialog.hide();
    };

    Editor.prototype.doYesAction = function (evt) { // 确认删除APP Plugins
        // Utils.stopBubble(evt);
        // this.confirmInfoDialog.hide();
        // var newsId = this.delNewsid;
        // var that = this;
        // $.getJSON(service.api("10"), {
        //     newsId: newsId,
        // }).complete(function (data) {
        //     that.listViewPane.refresh();
        // });
    };

    Editor.prototype.doClick = function (evt) {
    };

    Editor.prototype.doChange = function (evt) {
        if (evt.target.value > -1) {
            this.newsStatus = evt.target.value;
            this.listViewPane.refresh();
        }
    }

    Editor.prototype.createHeaders = function (row) {
        this.listViewPane.createHead("手机APP微服务插件名", row);
        this.listViewPane.createHead("更新时间", row);
        this.listViewPane.createHead("状态", row);
        this.listViewPane.createHead("操作", row);
    };

    Editor.prototype.setPropertySheet = function () {
        // basic property setting
        // if (this.basicpropsheet != null) {
        //     this.basicpropsheet.setSheet(this.currObject);
        // }
        // if (this.propsheet != null) {
        //     this.propsheet.setSheet(this.currObject, this.currObject,
        //         this.propsheet
        //             .getCurrTabIndex(this.currObject));
        // }
    };

    Editor.prototype.getDirty = function () {
        return false;
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
