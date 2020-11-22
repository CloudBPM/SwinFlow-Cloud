;
(function($, window, document, undefined) {
    var pluginName = "omHolidayEditor";
    var defaults = {
        id : "",
        ownerId : "",
        basicpropsheet : "",
        propsheet : "",
        width : 0,
        height : 0,
    };

    var Editor = function(element, options) {
        this.element = element;
        this.options = $.extend({
            id : "",
            ownerId : "",
            basicpropsheet : "",
            propsheet : "",
            height : 0,
            parent : "",
        }, defaults, options);
        this._defaults = defaults;
        this._name = pluginName;
        this.stack = new CommandStack();
        this.staffs = [];
        this.updatedStaffs = [];
        this.selectedStaff = null;
        this.basicpropsheet = options.basicpropsheet;
        this.propsheet = options.propsheet;
        this.currpage = null; // by default;
        this.pagesize = 30;
        this.init(options);
        this.createToolbar(options);
        this.createUserList(options);
        this.loading(1, this.pagesize, "", options.ownerId);
    };

    Editor.prototype.init = function(options) {
        this.editorPanel = document.createElement("DIV");
        this.element.appendChild(this.editorPanel);
        this.editorPanel.style.margin = "0px";
        this.editorPanel.style.padding = "0px";
        this.editorPanel.style.overflow = "auto";

        var div1 = document.createElement("div");
        this.editorPanel.appendChild(div1);
        div1.className = "row";
        div1.style.marginLeft = "5px";
        div1.style.marginBottom = "5px";
        div1.style.cssFloat = "left";

        //添加一个假期
        var add_btn = document.createElement("Button");
        div1.appendChild(add_btn);
        add_btn.style.marginTop = "5px";
        add_btn.innerText = "添加";
        add_btn.className = "btn btn-default";
        add_btn.id = "add_btn";
        add_btn.addEventListener("click", this, false);

        //刷新
        var add_btn = document.createElement("Button");
        div1.appendChild(add_btn);
        add_btn.style.marginLeft = "5px";
        add_btn.style.marginTop = "5px";
        add_btn.innerText = "刷新";
        add_btn.className = "btn btn-default";
        add_btn.id = "refresh_btn";
        add_btn.addEventListener("click", this, false);

        var div2 = document.createElement("div");
        this.editorPanel.appendChild(div2);
        div2.className = "row";
        div2.style.marginRight = "10px";
        div2.style.marginTop = "5px";
        div2.style.cssFloat = "right";

        //搜索条件1
        var search_btn1 = document.createElement("input");
        div2.appendChild(search_btn1);
        search_btn1.type = "date";
        search_btn1.style.marginRight = "10px";
        search_btn1.id = "search_btn1";

        var span1 = document.createElement("span");
        div2.appendChild(span1);
        span1.innerText = "至";
        span1.style.fontSize = "14px";

        //搜索条件2
        var search_btn2 = document.createElement("input");
        div2.appendChild(search_btn2);
        search_btn2.style.marginLeft = "10px";
        search_btn2.type = "date";
        search_btn2.id = "search_btn2";

        //搜索
        var search_btn = document.createElement("Button");
        div2.appendChild(search_btn);
        search_btn.style.marginLeft = "15px";
        search_btn.innerText = "搜索";
        search_btn.className = "btn btn-default";
        search_btn.id = "search_btn";
        search_btn.addEventListener("click", this, false);

        this.toolbarRow = document.createElement("DIV");
        this.editorPanel.appendChild(this.toolbarRow);
        this.toolbarRow.className = "row";
        this.toolbarRow.style.margin = "0px";
        this.toolbarRow.style.padding = "0px";
        this.painterRow = document.createElement("DIV");
        this.editorPanel.appendChild(this.painterRow);
        this.painterRow.className = "row";
        this.painterRow.style.margin = "0px";
        this.painterRow.style.padding = "0px";

        var canvasPanel = document.createElement("DIV");
        this.painterRow.appendChild(canvasPanel);
        var w = document.documentElement.clientWidth;
        canvasPanel.id = "userEditingPanel" + options.id;
        canvasPanel.className = "col";
        canvasPanel.style.width = (w - 600) + "px";
        canvasPanel.style.margin = "0px";
        canvasPanel.style.padding = "0px";
        canvasPanel.style.height = (options.height - 84) + "px";

        this.tableDivPane = document.createElement("DIV");
        canvasPanel.appendChild(this.tableDivPane);

        this.tableDivPane.className = "col-lg-12 col-md-12 col-sm-12 col-xs-12";
        this.tableDivPane.id = "convasPane" + options.id;
        this.tableDivPane.className = "table-responsive";
        this.tableDivPane.style.margin = "0px";
        this.tableDivPane.style.padding = "0px";
        this.tableDivPane.style.border = "1px solid #ddd";
        this.tableDivPane.style.height = options.height + "px";
        this.tableDivPane.style.borderRadius = "4px";
        this.tableDivPane.style.overflowY = "auto";

        if ($(this.element).delHolidayDialog != undefined) {
            var p2 = $(this.element).delHolidayDialog({ // 确认对话框
                id: "001234" + options.id,
                title: "提示 - 删除假期",
                parent: this,
            });
            this.delHolidayDialog = p2.data("delHolidayDialog");
        }

        if ($(this.element).createHolidayDialog != undefined) {
            var p3 = $(this.element).createHolidayDialog({ // 确认对话框
                id: "001235" + options.id,
                title: "提示 - 添加一个新假期",
                parent: this,
            });
            this.createHolidayDialog = p2.data("createHolidayDialog");
        }
    };

    Editor.prototype.createUserList = function(options) {
        this.safflist = document.createElement("table");
        this.safflist.id = "safflist";
        this.safflist.className = "table table-striped table-hover";
        this.tableDivPane.appendChild(this.safflist);
    };

    Editor.prototype.loading = function(pageno, pagesize, condition, ownerid) {
        $("#progressbar").show();
        var that = this;
        $.post(omservices.api(51, this.options.ownerId), {
             // pn : pageno,  //假期表分页
             // psz : pagesize,  //每页数量
        }).complete(
            function(data) {
                data = data.responseJSON;
                that.loadData(data);
                $("#progressbar").hide();
            });
    };

    Editor.prototype.getDirty = function() {
        return this.stack.isDirty();
    };

    Editor.prototype.loadData = function(jsonobj) {
        $(this.safflist).children().remove();

        this.addSaffListHeader(this.options);
        var isLeave = ["否","是"];
        if (jsonobj != null && jsonobj.length > 0) {
            for (var i = 0; i < jsonobj.length; i++) {
                var row = this.safflist.insertRow(-1);
                row.setAttribute("key", jsonobj[i].id);
                row.addEventListener("click", this, false);
                row.addEventListener("dblclick", this, false);
                this.createCell(0, jsonobj[i].holiday, row);
                this.createCell(1, isLeave[jsonobj[i].isHoliday], row);
                this.createCell1(2, jsonobj[i].id, row);
            }
        } else {
            this.initSaffList(this.options);
        }

    };

    Editor.prototype.initSaffList = function(options) {
        // document.createElement('tbody');
        for (var i = 0; i < 6; i++) {
            var row = this.safflist.insertRow(i);
            for (var j = 0; j < 12; j++) {
                var cell1 = row.insertCell(j);
                cell1.innerHTML = "&nbsp;";
            }
        }
    };

    Editor.prototype.addSaffListHeader = function(options) {
        // $(this.safflist).children().remove();
        var header = this.safflist.createTHead();
        var row = header.insertRow(0);
        this.createHead("日期", row);
        this.createHead("是否是假期", row);
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
        cell.innerHTML = cellname;
    };

    Editor.prototype.createCell1 = function(no, cellname, row) {
        var cell = row.insertCell(no);
        var btn2 = document.createElement("button");
        btn2.innerHTML = "删除";
        btn2.type = "button";
        btn2.className = "btn btn-default btn-xs";
        btn2.style.marginLeft = "5px";
        btn2.value = cellname;
        btn2.id = "del_holiday";
        btn2.addEventListener('click', this, false);
        cell.appendChild(btn2);
        return cell;
    };

    Editor.prototype.createToolbar = function(options) {
        var toolbarForm = document.createElement("form");
        toolbarForm.className = "form-inline";
        this.toolbarRow.appendChild(toolbarForm);

        var toolbarDiv = document.createElement("DIV");
        toolbarForm.appendChild(toolbarDiv);
        toolbarDiv.style.margin = "0px";
        toolbarDiv.style.padding = "2px";
        toolbarDiv.style.padding = "2px";
    };

    Editor.prototype.createLabel = function(group, id, title) {
        var label = document.createElement("Label");
        label.innerHTML = title;
        label.id = id;
        group.appendChild(label);
        return label;
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

    Editor.prototype.crateSGroup = function(parent) {
        var group = document.createElement("DIV");
        group.className = "input-group";
        group.style.padding = "2px";
        group.setAttribute("role", "search");
        group.setAttribute("aria-label", "");
        parent.appendChild(group);
        return group;
    };

    Editor.prototype.createTool = function(group, id, title, style, fonttag,
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

    Editor.prototype.handleEvent = function(e) {
        switch (e.type) {
            case "click":
                this.doClick(e);
                break;
            case "dblclick":
                this.doDblClick(e);
                break;
        }
    };

    Editor.prototype.doDblClick = function(evt) {
        if (evt.target.tagName == "TD") {
            this.safflist.focus();
        }
    };

    Editor.prototype.doClick = function(evt) {
        if(evt.target.id == "add_btn"){ // 添加假期
            this.createHolidayDialog.show(this.options.ownerId);
        }else if(evt.target.id == "del_holiday"){  //删除假期
            this.delHolidayDialog.show("您确定删除该假期吗？（请谨慎操作）",evt.target.value,this.options.ownerId);
        }else if(evt.target.id == "refresh_btn"){ //刷新
            this.loading(null,null,null,null);
        }else if(evt.target.id == "search_btn"){ //条件搜索
            $("#progressbar").show();
            // 条件搜索假期表数据
            var that = this;
            $.post(omservices.api(53, this.options.ownerId), {
                startTime:document.getElementById("search_btn1").value,
                toTime:document.getElementById("search_btn2").value
            }).complete(
                function(data) {
                    console.log(data);
                    data = data.responseJSON;
                    that.loadData(data);
                    $("#progressbar").hide();
                });
        }
    };


    Editor.prototype.doYesAction = function(evt,message, id, oid,type) {
        var that = this;
        if(type === "1"){ //删除假期表中的某个数据
            this.delHolidayDialog.hide();
            $.ajax({
                url:omservices.api(52, this.options.ownerId),
                data:{hid:id},
                type:'POST',
                complete:function(data) {
                    data = data.responseJSON;
                    that.loading(null,null,null,null);
                },
                dataType:'JSON'
            });
        }else if(type === "2"){//添加一个假期
            this.createHolidayDialog.hide();
            if(message != null && message != undefined && message != "" && message != "null"){
                $.ajax({
                    url:omservices.api(48, this.options.ownerId),
                    data:{htime:message},
                    type:'POST',
                    complete:function(data) {
                        data = data.responseJSON;
                        if(data.status == "0"){
                            console.log("添加失败,数据重复");
                        }
                        that.loading(null,null,null,null);
                    },
                    dataType:'JSON'
                });
            }else {
                console.log("数据为空");
            }
        }
    };

    Editor.prototype.doNoAction = function(evt,type) {
        if(type === "1"){
            this.delHolidayDialog.hide();
        }else if(type === "2"){
            this.createHolidayDialog.hide();
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