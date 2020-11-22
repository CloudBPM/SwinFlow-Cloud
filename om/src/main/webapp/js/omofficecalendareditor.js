;
(function($, window, document, undefined) {
    var pluginName = "omOfficeCalendarEditor";
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
            width : 0,
            height : 0,
        }, defaults, options);
        this._defaults = defaults;
        this._name = pluginName;
        this.stack = new CommandStack();
        this.currOwner = null;
        this.selectedStaff = null;
        this.staffsLeft = [];
        this.basicpropsheet = options.basicpropsheet;
        this.propsheet = options.propsheet;

        this.init(options);
        this.shading(options);
        this.createUserListLeft(options);
        this.createUserListRight(options);
        this.loading();
        this.officeDayLoading();
    };

    Editor.prototype.getDirty = function() {
        return this.stack.isDirty();
    };

    Editor.prototype.init = function(options) {
        var editorPanel = document.createElement("DIV");
        this.element.appendChild(editorPanel);
        editorPanel.style.margin = "0px";
        editorPanel.style.padding = "0px";
        editorPanel.style.overflow = "auto";
        var toolbarRow = document.createElement("DIV");
        editorPanel.appendChild(toolbarRow);
        toolbarRow.className = "row";
        toolbarRow.style.margin = "0px";
        toolbarRow.style.padding = "0px";
        this.painterRow = document.createElement("DIV");
        editorPanel.appendChild(this.painterRow);
        this.painterRow.className = "row";
        this.painterRow.style.margin = "0px";
        this.painterRow.style.padding = "0px";

        var parent = document.createElement("DIV");
        toolbarRow.appendChild(parent);
        parent.className = "col-lg-12 col-md-12 col-sm-12 col-xs-12";
        parent.style.margin = "0px";
        parent.style.padding = "2px";

        //添加一个时间段
        var add_btn = document.createElement("Button");
        parent.appendChild(add_btn);
        add_btn.style.marginTop = "5px";
        add_btn.innerText = "添加";
        add_btn.className = "btn btn-default";
        add_btn.id = "add_btn";
        add_btn.addEventListener("click", this, false);

        //刷新
        var refresh_btn = document.createElement("Button");
        parent.appendChild(refresh_btn);
        refresh_btn.style.marginLeft = "5px";
        refresh_btn.style.marginTop = "5px";
        refresh_btn.innerText = "刷新";
        refresh_btn.className = "btn btn-default";
        refresh_btn.id = "refresh_btn";
        refresh_btn.addEventListener("click", this, false);

        if ($(this.element).delPeriodDialog != undefined) {
            var p2 = $(this.element).delPeriodDialog({ // 确认对话框
                id: "001238" + options.id,
                title: "提示 - 删除工作时间段",
                parent: this,
            });
            this.delPeriodDialog = p2.data("delPeriodDialog");
        }

        if ($(this.element).createPeriodDialog != undefined) {
            var p3 = $(this.element).createPeriodDialog({ // 确认对话框
                id: "001239" + options.id,
                title: "提示 - 添加工作时间段",
                parent: this,
            });
            this.createPeriodDialog = p3.data("createPeriodDialog");
        }

    };

    Editor.prototype.createGroup = function(parent) {
        var group = document.createElement("DIV");
        parent.appendChild(group);
        group.className = "btn-group";
        group.style.padding = "2px";
        group.setAttribute("role", "group");
        group.setAttribute("aria-label", "");
        return group;
    };


    Editor.prototype.shading = function(options) {
        var canvasPanel = document.createElement("DIV");
        this.painterRow.appendChild(canvasPanel);
        canvasPanel.id = "officeCalendarPanel" + options.id;
        canvasPanel.className = "row";
        canvasPanel.style.width = options.width + "px";
        canvasPanel.style.margin = "0px";
        canvasPanel.style.marginTop = "5px";
        canvasPanel.style.padding = "0px";

        var leftPane = document.createElement("DIV");
        canvasPanel.appendChild(leftPane);
        leftPane.className = "col-lg-6 col-md-6 col-sm-12 col-xs-12";
        leftPane.style.margin = "0px";
        leftPane.style.padding = "0px";

        var calendarPane = document.createElement("DIV");
        leftPane.appendChild(calendarPane);
        calendarPane.className = "panel panel-default";

        var calendarPaneBody = document.createElement("DIV");
        calendarPane.appendChild(calendarPaneBody);
        calendarPaneBody.id = "officeCalendarPane" + options.id;
        calendarPaneBody.className = "panel-body";
        calendarPaneBody.style.margin = "0px";
        calendarPaneBody.style.padding = "0px";
        calendarPaneBody.style.overflowX = "auto";
        calendarPaneBody.style.overflowY = "auto";
        calendarPaneBody.style.height = (options.height - 84) + "px";

        this.tableDivLeftPane = document.createElement("DIV");
        calendarPaneBody.appendChild(this.tableDivLeftPane);

        this.tableDivLeftPane.className = "col-lg-12 col-md-12 col-sm-12 col-xs-12";
        this.tableDivLeftPane.id = "convasPane" + options.id;
        this.tableDivLeftPane.className = "table-responsive";
        this.tableDivLeftPane.style.margin = "0px";
        this.tableDivLeftPane.style.padding = "0px";
        this.tableDivLeftPane.style.border = "1px solid #ddd";
        this.tableDivLeftPane.style.height = options.height + "px";
        this.tableDivLeftPane.style.borderRadius = "4px";
        this.tableDivLeftPane.style.overflowY = "auto";


        var rightPane = document.createElement("DIV");
        canvasPanel.appendChild(rightPane);
        rightPane.className = "col-lg-6 col-md-6 col-sm-12 col-xs-12";
        rightPane.style.margin = "0px";
        rightPane.style.padding = "0px";

        var holidayPane = document.createElement("DIV");
        rightPane.appendChild(holidayPane);
        holidayPane.className = "panel panel-default";

        var holidayPaneBody = document.createElement("DIV");
        holidayPane.appendChild(holidayPaneBody);
        holidayPaneBody.id = "holidayPane" + options.id;
        holidayPaneBody.className = "panel-body";
        holidayPaneBody.style.margin = "0px";
        holidayPaneBody.style.padding = "0px";
        holidayPaneBody.style.overflowX = "auto";
        holidayPaneBody.style.overflowY = "auto";
        holidayPaneBody.style.height = (options.height - 84) + "px";

        this.tableDivRightPane = document.createElement("DIV");
        holidayPaneBody.appendChild(this.tableDivRightPane);

        this.tableDivRightPane.className = "col-lg-12 col-md-12 col-sm-12 col-xs-12";
        this.tableDivRightPane.id = "convasPane" + options.id;
        this.tableDivRightPane.className = "table-responsive";
        this.tableDivRightPane.style.margin = "0px";
        this.tableDivRightPane.style.padding = "0px";
        this.tableDivRightPane.style.border = "1px solid #ddd";
        this.tableDivRightPane.style.height = options.height + "px";
        this.tableDivRightPane.style.borderRadius = "4px";
        this.tableDivRightPane.style.overflowY = "auto";

    };

    //根据日历查询周期  周一到周日
    Editor.prototype.officeDayLoading = function() {
        $("#progressbar").show();
        var that = this;
        $.post(omservices.api(54, this.options.ownerId), {
            cid:this.options.id,
        }).complete(
            function(data) {
                data = data.responseJSON;
                that.officeDayLoadData(data);
                $("#progressbar").hide();
            });
    };

    Editor.prototype.createUserListLeft = function(options) {
        this.safflistLeft = document.createElement("table");
        this.safflistLeft.id = "safflistLeft";
        this.safflistLeft.className = "table table-striped table-hover";
        this.tableDivLeftPane.appendChild(this.safflistLeft);
    };

    Editor.prototype.createUserListRight = function(options) {
        this.safflistRight = document.createElement("table");
        this.safflistRight.id = "safflistRight";
        this.safflistRight.className = "table table-striped table-hover";

        this.tableDivRightPane.appendChild(this.safflistRight);
    };

    Editor.prototype.officeDayLoadData = function(jsonobj) {
        $(this.safflistLeft).children().remove();
        this.addSaffListHeader(this.options);
        var week = ["","周一","周二","周三","周四","周五","周六","周日"];
        if (jsonobj != null && jsonobj.length > 0) {
            for (var i = 0; i < jsonobj.length; i++) {
                var row = this.safflistLeft.insertRow(-1);
                row.setAttribute("key", jsonobj[i].id);
                row.addEventListener("click", this, false);
                this.createCell(0, week[jsonobj[i].weekkDay], row);
            }
        } else {
            this.initSaffListLeft(this.options);
        }

        if (jsonobj.length > 0) {
            this.selectRow(jsonobj[0].id);
        }
    };

    Editor.prototype.initSaffListLeft = function(options) {
        for (var i = 0; i < 20; i++) {
            var row = this.safflistLeft.insertRow(i);
            for (var j = 0; j < 12; j++) {
                var cell = row.insertCell(j);
                cell.innerHTML = "&nbsp;";
            }
        }
    };

    Editor.prototype.initSaffListRight = function(options) {
        // document.createElement('tbody');
        for (var i = 0; i < 6; i++) {
            var row = this.safflistRight.insertRow(i);
        }
    };

    Editor.prototype.addSaffListHeader = function(options) {
        var header = this.safflistLeft.createTHead();
        var row = header.insertRow(0);
        this.createHead("名称", row);
    };

    Editor.prototype.addSaffListHoursHeader = function(options) {
        var header = this.safflistRight.createTHead();
        var row = header.insertRow(0);
        this.createHead("开始时间", row);
        this.createHead("结束时间", row);
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
        btn2.id = "del_period";
        btn2.addEventListener('click', this, false);
        cell.appendChild(btn2);
        return cell;
    };

    //根据周几 查询对应时间段
    Editor.prototype.officeDayHoursLoading = function(parentId) {
        $("#progressbar").show();
        var that = this;
        $.post(omservices.api(55, this.options.ownerId), {
             officeDayId:parentId,
        }).complete(
            function(data) {
                data = data.responseJSON;
                that.officeDayHoursLoadData(data);
                $("#progressbar").hide();
            });
    };

    //查询当前日历下的周一的id
    Editor.prototype.loading = function() {
        $("#progressbar").show();
        var that = this;
        $.post(omservices.api(56, this.options.ownerId), {
            cid:this.options.id,
        }).complete(
            function(data) {
                data = data.responseJSON;
                that.officeDayHoursLoadData(data);
                $("#progressbar").hide();
            });
    };

    Editor.prototype.officeDayHoursLoadData = function(jsonobj) {
        $(this.safflistRight).children().remove();
        this.addSaffListHoursHeader(this.options);
        if (jsonobj != null && jsonobj.length > 0) {
            for (var i = 0; i < jsonobj.length; i++) {
                var row = this.safflistRight.insertRow(-1);
                this.createCell(0, jsonobj[i].fromTime, row);
                this.createCell(1, jsonobj[i].toTime, row);
                this.createCell1(2, jsonobj[i].id, row);
            }
        } else {
            this.initSaffListRight(this.options);
        }
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
        if(evt.target.id == "add_btn"){ // 添加一个时间段
            //获取选中的周期id
            this.createPeriodDialog.show(this.options.ownerId);
        }else if(evt.target.id == "del_period"){  //删除时间段
            //获取对应的 时间段id
            this.delPeriodDialog.show("您确定删除该工作时间段吗？（请谨慎操作）",evt.target.value,this.options.ownerId);
        }else if(evt.target.id == "refresh_btn"){ //刷新
            this.officeDayLoading();
            this.loading();
        }else if (evt.target.tagName == "TD") {
            var r = evt.target.parentElement;
            this.selectRow(r.getAttribute("key"));
            this.officeDayHoursLoading(r.getAttribute("key"));
        }
    };

    Editor.prototype.selectRow = function(id) {
        if (this.safflistLeft.rows.length > 1) {
            for (var i = 0; i < this.safflistLeft.rows.length; i++) {
                if (this.safflistLeft.rows[i].getAttribute("key") == id) {
                    this.safflistLeft.rows[i].style.background = "#d1d1e0";
                    this.cycleId = id;
                }else {
                    this.safflistLeft.rows[i].style.background = "";
                }
            }
        }
        for (var i = 0; i < this.staffsLeft.length; i++) {
            if (this.staffsLeft[i].id == id) {
                this.setPropertySheet(this.staffsLeft[i]);
                this.selectedStaff = this.staffsLeft[i];
                break;
            }
        }
    };

    Editor.prototype.setPropertySheet = function(obj) {
        if (obj == null && this.staffsLeft != null && this.staffsLeft.length > 0) {
            obj = this.staffsLeft[0];
        }
        // basic property setting
        if (this.basicpropsheet != null) {
            this.basicpropsheet.tabId = this.options.id;
            this.basicpropsheet.setSheet(obj);
        }
        // advanced property setting.
        if (this.propsheet != null) {
            this.propsheet.tabId = this.options.id;
            this.propsheet.setSheet(obj);
        }
    };

    Editor.prototype.clearProcessSheet = function(table) {
        if (table.rows.length > 0) {
            for (var i = 0; i < table.rows.length; i++) {
                table.rows[i].style.background = "";
            }
        }
    };

    Editor.prototype.doYesAction = function(evt,formTime, toTime, id,oid,type) {
        var that = this;
        if(type === "1"){ //删除窗口
            this.delPeriodDialog.hide();
            $.ajax({
                url:omservices.api(57, this.options.ownerId),
                data:{pid:id},
                type:'POST',
                complete:function() {
                    that.officeDayHoursLoading(that.cycleId);
                },
                dataType:'JSON'
            });
        }else if(type === "2"){ //添加窗口
            this.createPeriodDialog.hide();
            if(formTime == null || formTime == "" ){
                console.log("开始时间为空");
            }else if(toTime == null || toTime == ""){
                console.log("结束时间为空");
            }else {
                $.ajax({
                    url:omservices.api(47, this.options.ownerId),
                    data:{formTime:formTime,
                        toTime:toTime,
                        parentId:this.cycleId},
                    type:'POST',
                    complete:function(data) {
                        data = data.responseJSON;
                        if(data.status == "0"){
                            console.log("添加失败");
                        }else {
                            console.log("添加成功");
                        }
                        that.officeDayHoursLoading(that.cycleId);
                    },
                    dataType:'JSON'
                });
            }
        }
    };

    Editor.prototype.doNoAction = function(evt,type) {
        if(type === "1"){ //删除窗口
            this.delPeriodDialog.hide();
        }else if(type === "2"){ //添加窗口
            this.createPeriodDialog.hide();
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