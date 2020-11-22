/**
 *
 */
;
(function($, window, document, undefined) {
    var pluginName = "invoiceEditor";
    var defaults = {
        id : "",
        owner : "",
        userId : "",
        userfullname : "",
        ownername : "",
        basicpropsheet : "",
        propsheet : "",
        width : 0,
        height : 0,
        parent : "",
    };

    var Editor = function(element, options) {
        this.element = element, this.options = $.extend({
            id : "",
            owner : "",
            userId : "",
            userfullname : "",
            ownername : "",
            basicpropsheet : "",
            propsheet : "",
            width : 0,
            height : 0,
            parent : "",
        }, defaults, options);
        this._defaults = defaults;
        this._name = pluginName;
        this.stack = new CommandStack();
        this.basicpropsheet = options.basicpropsheet;
        this.propsheet = options.propsheet;
        this.deprecated = 99;
        this.init(options);
    };

    Editor.prototype.init = function(options) {
        var p1 = $(this.element).readonlyTableViewer({
            id : options.id,
            ownerId : options.owner,
            basicpropsheet : options.basicpropsheet,
            propsheet : options.propsheet,
            width : options.width,
            height : options.height,
            parent : this,
            type : "ext",
        });
        this.listViewPane = p1.data("readonlyTableViewer");
        this.listViewPane.init();
        this.listViewPane.createToolbar();
        this.listViewPane.headersize = 6;
        this.listViewPane.loading(1, this.listViewPane.pagesize, "",
            options.owner);

        var p2 = $(this.element).messageDialog({
            id : "001",
            title : "提示",
            parent : this,
        });
        this.messageDialog = p2.data("messageDialog");

        var p2 = $(this.element).invoiceInforEditor({
            id : "002",
            title : "发票详情",
            parent : this,
        });
        this.invoiceInfor = p2.data("invoiceInforEditor");
    };

    Editor.prototype.addExtraButtons = function(parent) {
        var group = this.createGroup(parent);
        this.createSelection(group);
    };

    Editor.prototype.createSelection = function(group) {
        var colDIV2 = document.createElement("DIV");
        group.appendChild(colDIV2);
        colDIV2.className = "col-sm-10";

        this.statusSelect = document.createElement("SELECT");
        colDIV2.appendChild(this.statusSelect);
        this.statusSelect.className = "form-control";
        this.statusSelect.addEventListener("change", this, false);
        this.addOptions(this.statusSelect, "--请选择状态--", -1, 0);
        this.addOptions(this.statusSelect, "全部", 99, 1);
        this.addOptions(this.statusSelect, "已上线", 2, 2);
        this.addOptions(this.statusSelect, "上线待审核", 0, 3);
    };

    Editor.prototype.addOptions = function(parent, title, value, index) {
        var option = document.createElement("option");
        option.text = title;
        option.value = value;
        parent.options.add(option, index);
    };

    Editor.prototype.loading = function(pageno, pagesize, condition, owner) {
        $("#progressbar").show();
        var that = this;
        $.getJSON(service.api(41), {
            pn : pageno,
            psz : pagesize,
            cond : condition,
        }).complete(function(data) {
            console.log(data);
            that.listViewPane.loadData(data.responseJSON.data);
            // that.setPropertySheet();

        });
        $("#progressbar").hide();
    };

    Editor.prototype.createCells = function(obj) {
        console.log(obj);
        var objdata = new Invoice();
        var invoice = objdata.parseFromJSON(obj);
        this.listViewPane.objects.push(invoice);
        var row = this.listViewPane.tableList.insertRow(-1);
        row.setAttribute("key", invoice.invoiceId);
        row.addEventListener("click", this, false);
        row.addEventListener("dblclick", this, false);

        this.listViewPane.createCell(0, invoice.orderId, row);
        this.listViewPane.createCell(1, invoice.receivePersonType, row);
        this.listViewPane.createCell(2, invoice.receiveType, row);
        this.listViewPane.createCell(3, invoice.email, row);
        this.listViewPane.createCell(4, invoice.applyTime, row);
        this.listViewPane.createCell(5, invoice.orderPrice+"元", row);
        this.listViewPane.createCell(6, invoice.invoiceStatus, row);

        var cell = this.listViewPane.createCell(7, null, row);
        var b0 = this.createIcon(cell, invoice.invoiceId, "4", "fa fa-file-o fa-lg",
            "view", "查看", "btn-primary");
        var b1 = this.createIcon(cell, invoice.invoiceId, "0", "fa fa-cloud-upload fa-lg",
            "online", "开具发票", "");
        // var b2 = this.createIcon(cell, invoice.invoiceId, "1",
        //     "fa fa-cloud-download fa-lg", "offline", "下线", "");
        // var b3 = this.createIcon(cell, invoice.invoiceId, "2",
        //     "fa fa-thumbs-o-down fa-lg", "sendback", "审核未通过", "");
        // this.buttonSelected(rwp.deprecated, b1, b2, b3);
    };

    Editor.prototype.buttonSelected = function(deprecated, b1, b2, b3) {
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

    Editor.prototype.createIcon = function(parent, id, num, classname, name,
                                           title, style) {
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
        button.addEventListener("click", function(evt) {
            if (this.name == "sendback") {
                that.submittingDialog.show(id, 4);
            } else if (this.name == "online") {
                that.auditInvoice(id);
            } else if (this.name == "offline") {
                that.submittingDialog.show(id, 0);
            } else if (this.name=="view"){
                console.log("view");
                that.invoiceInfor.show(id)
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

    Editor.prototype.doSubmit = function(id, status, comment) {
        var that = this;
        $("#progressbar").show();
        $.post(service.api(8), {
            deprecated : status,
            rid : id,
            lastupdate : new Date().getTime(),
            owner : this.options.owner,
            userId : this.options.userId,
            userfullname : this.options.userfullname,
            ownername : this.options.ownername,
            comment : comment,
        }).complete(function(data) {
            that.submittingDialog.hide();
            that.listViewPane.refresh();
            $("#progressbar").hide();
        });
    };

    Editor.prototype.handleEvent = function(e) {
        this.listViewPane.handleEvent(e);
        switch (e.type) {
            case "change":
                this.doChange(e);
                break;
            case "click":
                break;
            case "dblclick":
                break;
        }
    };

    Editor.prototype.doChange = function(evt) {
        if (evt.target.value > -1) {
            this.deprecated = evt.target.value;
            this.listViewPane.refresh();
        }
    };

    Editor.prototype.auditInvoice=function(id){
        var that = this;
        $.post(service.api(39),{
            invoiceId:id
        }).complete(function (data) {
            if (data.responseJSON.codeMessage.message==="success"){
                that.messageDialog.show("开具成功");
                that.listViewPane.loading(1, that.listViewPane.pagesize, "",
                    that.options.owner);
            }
        })
    };

    Editor.prototype.createHeaders = function(row) {
        this.listViewPane.createHead("订单编号", row);
        this.listViewPane.createHead("接收人类型", row);
        this.listViewPane.createHead("发票抬头", row);
        this.listViewPane.createHead("邮箱", row);
        this.listViewPane.createHead("申请时间", row);
        this.listViewPane.createHead("金额", row);
        this.listViewPane.createHead("发票状态", row);
        this.listViewPane.createHead("操作", row);
    };

    Editor.prototype.createGroup = function(parent) {
        var group = document.createElement("DIV");
        group.className = "btn-group";
        group.style.padding = "2px";
        group.setAttribute("role", "group");
        group.setAttribute("aria-label", "");
        parent.appendChild(group);
        return group;
    };

    Editor.prototype.setPropertySheet = function() {
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

    Editor.prototype.getDirty = function() {
        return this.stack.isDirty();
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
