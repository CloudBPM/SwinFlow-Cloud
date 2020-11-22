/**
 *
 */
;
(function ($, window, document, undefined) {
    var pluginName = "bookListEditor";
    var defaults = {
        id: "",
        owner: "",
        userId: "",
        userfullname: "",
        ownername: "",
        basicpropsheet: "",
        propsheet: "",
        width: 0,
        height: 0,
        parent: "",
    };

    var Editor = function (element, options) {
        this.element = element, this.options = $.extend({
            id: "",
            owner: "",
            userId: "",
            userfullname: "",
            ownername: "",
            basicpropsheet: "",
            propsheet: "",
            width: 0,
            height: 0,
            parent: "",
        }, defaults, options);
        this._defaults = defaults;
        this._name = pluginName;
        this.stack = new CommandStack();
        this.basicpropsheet = options.basicpropsheet;
        this.propsheet = options.propsheet;
        this.deprecated = 99;
        this.init(options);
    };

    Editor.prototype.init = function (options) {
        var p1 = $(this.element).readonlyTableViewer({
            id: options.id,
            ownerId: options.owner,
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
        this.listViewPane.headersize = 7;
        this.listViewPane.loading(1, 10, "", this.options.userId);

        var p5 = $(this.element).messageDialog({
            id: "017",
            title: "提示",
            parent: this,
        });
        this.messageDialog = p5.data("messageDialog");

        var p3 = $(this.element).submittingDialog({
            id: "006",
            title: vendor + " - 提交意见",
            parent: this,
        });
        this.submittingDialog = p3.data("submittingDialog");

        var p4 = $(this.element).EbookViewEditor({
            id: "003",
            cid: options.cid,
            title: "添加电子书",
            owner: options.owner,
            userId: options.userId,
            userfullname: options.userfullname,
            ownername: options.ownername,
            basicpropsheet: options.basicpropsheet,
            propsheet: options.propsheet,
            ownerId: options.ownerId,
            width: 650,
            height: 400,
            parent: this,
        });
        this.bookEditor = p4.data("EbookViewEditor")
    };

    Editor.prototype.getDirty = function () {
        return this.stack.isDirty();
    };

    Editor.prototype.addExtraButtons = function (parent) {
        var group = this.createGroup(parent);
        this.createSelection(group);
    };

    Editor.prototype.createSelection = function (parent) {
        var group = this.createGroup(parent);
        this.statusSelect = this.createTool(group, "addbook" + this.options.id,
            "添加电子书", "btn btn-default btn-success", "addbook",
            "fa fa-plus fa-lg");
        this.statusSelect.addEventListener("change", this, false);
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
    Editor.prototype.createTool = function (group, id, title, style, fonttag,
                                            fontclass) {
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

    Editor.prototype.addOptions = function (parent, title, value, index) {
        var option = document.createElement("option");
        option.text = title;
        option.value = value;
        parent.options.add(option, index);
    };

    Editor.prototype.loading = function (pageno, pagesize, condition, userid) {
        $("#progressbar").show();
        var that = this;
        $.post(service.api(31), {
            pn: pageno,
            psz: pagesize,
            cond: condition,
            userId: userid,
            type: ""
        }).complete(function (data) {
            that.listViewPane.loadData(data.responseJSON);
            that.setPropertySheet();
            $("#progressbar").hide();
        });
    };

    Editor.prototype.createCells = function (obj) {
        var book = new Book();
        book.parseFromJSON(obj);
        this.listViewPane.objects.push(book);
        var row = this.listViewPane.tableList.insertRow(-1);
        // row.setAttribute("key", book.id);
        row.addEventListener("click", this, false);
        row.addEventListener("dblclick", this, false);

        this.listViewPane.createCell(0, book.bookName, row);
        this.listViewPane.createCell(1, book.bookAuthor, row);
        this.listViewPane.createCell(2, book.createTime, row);
        this.listViewPane.createCell(3, book.sellType, row);
        this.listViewPane.createCell(4, book.goodPrise + "元", row);
        this.listViewPane.createCell(5, book.discountPrise + "元", row);
        var cell = this.listViewPane.createCell(6, null, row);
        cell.setAttribute("key", book.bookPath);
        var b0 = this.createIcon(cell, book.id, "4", "fa fa-file-o fa-lg",
            "view", "查看", "btn-primary", book);
        this.b1 = this.createIcon(cell, book.id, "0", "fa fa-cloud-upload fa-lg",
            "online", "上架", "", "");
        this.b2 = this.createIcon(cell, book.id, "1",
            "fa fa-cloud-download fa-lg", "offline", "下架", "");
        var b3 = this.createIcon(cell, book.id, "2",
            "fa fa-thumbs-o-down fa-lg", "sendback", "审核未通过", "", "");
        var b4 = this.createIcon(cell, book.id, "3",
            "fa fa-trash fa-lg", "delete", "删除", "", "");
        // this.buttonSelected(book.deprecated, b1, b2, b3);
    };

    Editor.prototype.buttonSelected = function (deprecated, b1, b2, b3) {
        switch (deprecated) {
            case 2:// 已经上线 deprecated是2
                b1.classList.add("active");
                b1.disabled = true;
                b3.classList.add("active");
                b3.disabled = true;
                break;
            case 0:// 已经下线 deprecated是0
                b2.classList.add("active");
                b2.disabled = true;
                break;
        }
    };

    Editor.prototype.createIcon = function (parent, id, num, classname, name,
                                            title, style, data) {
        var button = document.createElement("BUTTON");
        parent.appendChild(button);
        button.id = name + id + num;
        button.className = "btn btn-default " + style;
        button.style.borderRadius = "15px";
        button.style.width = "29px";
        button.style.padding = "3px";
        button.title = title;
        button.name = name;
        var that = this;
        button.addEventListener("click", function (evt) {
            if (this.name == "sendback") {
                console.log(parent.getAttribute("key1"));
            } else if (this.name == "view") {
                that.bookEditor.show();
                that.bookEditor.loadDataFormDB(data);
            } else if (this.name == "online") {
                that.upperShelf(id)
            } else if (this.name == "offline") {
                that.lowerShelf(id);
            } else if (this.name == "delete") {
                that.deleteBook(id, parent.getAttribute("key"));
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

    Editor.prototype.upperShelf = function (id) {
        $("#progressbar").show()
        var that = this;
        $.post(service.api(37), {
            id: id,
            type: 1
        }).complete(function (data) {
            if (data.responseJSON.status == "success")
                that.messageDialog.show("上架成功");
            that.loading(1, 10, "", that.options.userId);
            that.b1.setAttribute("disable", true);
            $("#progressbar").hide();
        });
    };

    Editor.prototype.lowerShelf = function (id) {
        $("#progressbar").show()
        var that = this;
        $.post(service.api(38), {
            id: id,
            type: 1
        }).complete(function (data) {
            that.messageDialog.show("下架成功");
            that.loading(1, 10, "", that.options.userId);
            that.b2.disable = true;
            $("#progressbar").hide();
        });
    };


    Editor.prototype.deleteBook = function (id, path) {
        $("#progressbar").show();
        var that = this;
        $.post(service.api(35), {
            id: id,
            path: path,
            userId: this.options.userId,
            userName: this.options.userName,
            type: 1,
        }).complete(function (data) {
            var result = data.responseJSON.status;
            if (result == "success") {
                that.messageDialog.show("刪除成功");
                that.loading(1, 10, "", that.options.userId);
            }
            $("#progressbar").hide();
        });
    };

    Editor.prototype.handleEvent = function (e) {
        this.listViewPane.handleEvent(e);
        switch (e.type) {
            case "change":
                this.doChange(e);
                break;
            case "click":
                this.doClick(e);
                break;
            case "dblclick":
                break;
        }
    };

    Editor.prototype.doClick = function (evt) {
        if (evt.target == this.addNew || (evt.target.id == ("addbook" + this.options.id))) {
            this.bookEditor.loadData(new Book(), true);
        }

    };

    Editor.prototype.doKeydown = function (evt) {
        var e = window.event ? window.event : (evt ? evt : arguments[0]);
        var key = e.keyCode || e.which;
        if (key == 13) {//回车键
            //阻止该事件
            evt.preventDefault();
            if (evt.target.value != "") {
                this.loading(1, 10, "", this.options.userId);
            }
            return false;
        }
    };


    Editor.prototype.doChange = function (evt) {
        if (evt.target.value > -1) {
            this.deprecated = evt.target.value;
            this.listViewPane.refresh();
        }
    };

    Editor.prototype.createHeaders = function (row) {
        this.listViewPane.createHead("书籍名称", row);
        this.listViewPane.createHead("书籍作者", row);
        this.listViewPane.createHead("上传时间", row);
        this.listViewPane.createHead("是否免费", row);
        this.listViewPane.createHead("价格", row);
        this.listViewPane.createHead("折扣价格", row);
        this.listViewPane.createHead("操作", row);
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

    Editor.prototype.setPropertySheet = function () {
        // // basic property setting
        // if (this.basicpropsheet != null) {
        // this.basicpropsheet.setSheet(this.currObject);
        // }
        // // advanced property setting.
        // if (this.propsheet != null) {
        // this.propsheet.setSheet(this.currObject, this.currObject,
        // this.propsheet
        // .getCurrTabIndex(this.currObject));
        // }
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
