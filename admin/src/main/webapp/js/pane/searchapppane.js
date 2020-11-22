/**
 *
 */
;
(function ($, window, document, undefined) {
    var pluginName = "searchAppPane";
    var defaults = {
        id: "", // plugin id
        pid: "", // process id
        uid: "", // user id
        basicpropsheet: "",
        propsheet: "",
        width: 0,
        height: 0,
        parent: "",
    };

    var SearchConditionPanel = function (element, options) {
        this.element = element;
        this.options = $.extend({
            id: "",
            pid: "",
            uid: "",
            basicpropsheet: "",
            propsheet: "",
            width: 0,
            height: 0,
            parent: "",
        }, defaults, options);
        this._defaults = defaults;
        this._name = pluginName;
        this.init(options);
    };

    SearchConditionPanel.prototype.init = function (options) {
        var modalframe = document.createElement("DIV");
        modalframe.style.width = options.width + "px";
        modalframe.id = "searchAppPane" + options.pid;
        this.element.appendChild(modalframe);

        var schpane = document.createElement("DIV");
        modalframe.appendChild(schpane);
        schpane.className = "col-lg-12 col-md-12 col-sm-12 col-xs-12";
        schpane.style.margin = "0px";
        schpane.style.marginTop = "2px";
        schpane.style.padding = "0px";

        var schForm = this.createPanel(schpane, "");
        var gDiv = document.createElement("DIV");
        schForm.appendChild(gDiv);
        gDiv.className = "form-group";

        var label1 = document.createElement("Label");
        gDiv.appendChild(label1);
        label1.className = "col-lg-2 col-md-2 col-sm-12 col-xs-12  control-label";
        label1.innerHTML = "搜索";

        var colDIV = document.createElement("DIV");
        gDiv.appendChild(colDIV);
        colDIV.className = "col-lg-10 col-md-10 col-sm-12 col-xs-12 ";

        var sDiv = document.createElement("DIV");
        colDIV.appendChild(sDiv);
        sDiv.className = "input-group";

        this.searchInput = document.createElement("INPUT");
        sDiv.appendChild(this.searchInput);
        this.searchInput.className = "form-control";
        this.searchInput.type = "text";
        this.searchInput.setAttribute("placeholder", "发起人姓名、发起人证件号等");

        var sSpan = document.createElement("SPAN");
        sDiv.appendChild(sSpan);
        sSpan.className = "input-group-btn";

        this.sButton = document.createElement("BUTTON");
        sSpan.appendChild(this.sButton);
        this.sButton.className = "btn btn-primary";
        this.sButton.id = "searchBtn" + options.pid;
        this.sButton.addEventListener('click', this, false);

        var i = document.createElement("I");
        this.sButton.appendChild(i);
        i.id = "isearchBtn" + options.pid;
        i.className = "fa fa-search fa-lg";

        //
        var gDiv1 = document.createElement("DIV");
        schForm.appendChild(gDiv1);
        gDiv1.className = "form-group";

        var label2 = document.createElement("Label");
        gDiv1.appendChild(label2);
        label2.className = "col-sm-2 control-label";
        label2.innerHTML = "当前状态";

        var colDIV2 = document.createElement("DIV");
        gDiv1.appendChild(colDIV2);
        colDIV2.className = "col-sm-10";

        this.statusSelect = document.createElement("SELECT");
        colDIV2.appendChild(this.statusSelect);
        this.statusSelect.className = "form-control";
        this.addOptions(this.statusSelect, "- 请选择 -", "-1", 0);
        this.addOptions(this.statusSelect, "运行", "5", 1);
        this.addOptions(this.statusSelect, "暂停", "6", 2);
        //
        var gDiv2 = document.createElement("DIV");
        schForm.appendChild(gDiv2);
        gDiv2.className = "form-group";

        var label3 = document.createElement("Label");
        gDiv2.appendChild(label3);
        label3.className = "col-sm-2 control-label";
        label3.innerHTML = "启动时间";

        var label4 = document.createElement("Label");
        gDiv2.appendChild(label4);
        label4.className = "col-sm-1 control-label";
        label4.innerHTML = "从";

        var colDIV3 = document.createElement("DIV");
        gDiv2.appendChild(colDIV3);
        colDIV3.className = "col-sm-4";

        this.fromDateInput = document.createElement("INPUT");
        colDIV3.appendChild(this.fromDateInput);
        this.fromDateInput.type = "button";
        this.fromDateInput.className = "form-control";

        $(this.fromDateInput).datetimepicker({
            dateFormat: "yy-mm-dd",
            timeFormat: "HH:mm:ss",
        });

        var label5 = document.createElement("Label");
        gDiv2.appendChild(label5);
        label5.className = "col-sm-1 control-label";
        label5.innerHTML = "到";

        var colDIV4 = document.createElement("DIV");
        gDiv2.appendChild(colDIV4);
        colDIV4.className = "col-sm-4";

        this.toDateInput = document.createElement("INPUT");
        colDIV4.appendChild(this.toDateInput);
        this.toDateInput.type = "button";
        this.toDateInput.className = "form-control";

        $(this.toDateInput).datetimepicker({
            dateFormat: "yy-mm-dd",
            timeFormat: "HH:mm:ss",
        });

        var toolbar = document.createElement("DIV");
        schpane.appendChild(toolbar);
        toolbar.className = "row";
        toolbar.style.margin = "0px";
        toolbar.style.padding = "0px";

        this.createToolbar(options, toolbar);

        var resultForm = this.createResultPanel(schpane, "");

        var tableDiv = document.createElement("DIV");
        resultForm.appendChild(tableDiv);
        tableDiv.id = "resultdiv" + options.pid;
        tableDiv.className = "table-responsive";
        tableDiv.style.overflowY = "auto";
        tableDiv.style.overflowX = "auto";
        tableDiv.style.height = (options.height - 215) + "px";

        this.instancelist = document.createElement("table");
        this.instancelist.className = "table table-striped table-hover";
        tableDiv.appendChild(this.instancelist);

        this.initList();

    };

    SearchConditionPanel.prototype.createToolbar = function (options, toolbar) {
        var parent = document.createElement("DIV");
        toolbar.appendChild(parent);
        parent.className = "col-lg-12 col-md-12 col-sm-12 col-xs-12";
        parent.style.margin = "0px";
        parent.style.padding = "0px";

        var c = "btn btn-default btn-sm";
        var c1 = "btn btn-danger btn-sm";
        var c2 = "btn btn-warning btn-sm";
        var c4 = "btn btn-success btn-sm";

        var g3 = this.createGroup(parent);
        this.exportbutton = this.createTool(g3, "export" + this.options.id,
            "导出成报表", c, "i", "fa fa-download fa-lg");
        this.resumebutton = this.createTool(g3, "resume" + this.options.id,
            "恢复执行", c4, "i", "fa fa-play fa-lg");
        this.pausebutton = this.createTool(g3, "pause" + this.options.id,
            "暂停执行", c2, "i", "fa fa-pause fa-lg");
        this.terminatebutton = this.createTool(g3, "terminate"
            + this.options.id, "中止执行", c1, "i", "fa fa-stop fa-lg");
        this.exportbutton.disabled = true;
        this.resumebutton.disabled = true;
        this.pausebutton.disabled = true;
        this.terminatebutton.disabled = true;
        this.createNavigationGroup(parent);

        var g4 = this.createGroup(parent);
        this.startbutton = this.createTool(g4, "start" + this.options.id,
            "自动应用走你：启动应用（该按钮只适合于启动自动应用！单人应用和多人应用应该在桌面上启动）",
            c, "i", "fa fa-hand-o-right fa-lg");
        //this.startbutton.style.display = "none";

    };

    SearchConditionPanel.prototype.createNavigationGroup = function (parent) {
        var group1 = this.createGroup(parent);
        this.refreshHButton = this.createTool(group1, "refreshH"
            + this.options.pid, "刷新", "btn btn-success btn-sm", "i",
            "fa fa-refresh fa-lg");

        var group = this.createGroup(parent);
        this.firstPageHButton = this.createTool(group, "firstPageH"
            + this.options.pid, "首页", "btn btn-default btn-sm", "i",
            "fa fa-step-backward fa-lg");
        this.previousPageHButton = this.createTool(group, "previousPageH"
            + this.options.pid, "前一页", "btn btn-default btn-sm", "i",
            "fa fa-backward fa-lg");
        this.nextPageHButton = this.createTool(group, "nextPageH"
            + this.options.pid, "后一页", "btn btn-default btn-sm", "i",
            "fa fa-forward fa-lg");
        this.lastPageHButton = this.createTool(group, "lastPageH"
            + this.options.pid, "末页", "btn btn-default btn-sm", "i",
            "fa fa-step-forward fa-lg");

        var group2 = this.createGroup(parent);
        this.pageno = this.createLabel(group2, "l1" + this.options.pid, "");
        this.totalpage = this.createLabel(group2, "l2" + this.options.pid, "");

    };

    SearchConditionPanel.prototype.createLabel = function (group, id, title) {
        var label = document.createElement("Label");
        label.innerHTML = title;
        label.id = id;
        group.appendChild(label);
        return label;
    };

    SearchConditionPanel.prototype.createGroup = function (parent) {
        var group = document.createElement("DIV");
        parent.appendChild(group);
        group.className = "btn-group";
        group.style.padding = "2px";
        group.setAttribute("role", "group");
        group.setAttribute("aria-label", "");
        return group;
    };

    SearchConditionPanel.prototype.handleEvent = function (e) {
        switch (e.type) {
            case "click":
                this.doClick(e);
                break;
            case "dblclick":
                this.doDblClick(e);
                break;
        }
    };

    SearchConditionPanel.prototype.createTool = function (group, id, title,
                                                          style, fonttag, fontclass) {
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
        icon.id = "i" + id;
        return button;
    };

    SearchConditionPanel.prototype.doDblClick = function (evt) {
        if (evt.target.tagName == "TD") {
            var row = evt.target.parentElement;
            var id = row.getAttribute("key")
            var title = row.getAttribute("pname");
            this.options.topparent.addNewTabForRPI(title, id,
                this.options.owner);
        }
    };

    SearchConditionPanel.prototype.doClick = function (evt) {
        if (evt.target == this.firstPageHButton
            || evt.target.id == "ifirstPageH" + this.options.pid
            || evt.target.id == "firstPageH" + this.options.pid) {
            this.loading(this.options.pid, 1, 30,
                this.searchInput.value, this.statusSelect.value,
                this.fromDateInput.value, this.toDateInput.value);
        } else if (evt.target == this.previousPageHButton
            || evt.target.id == "ipreviousPageH" + this.options.pid
            || evt.target.id == "previousPageH" + this.options.pid) {
            this.loading(this.options.pid, this.currpage.pageNo - 1, 30,
                this.searchInput.value, this.statusSelect.value,
                this.fromDateInput.value, this.toDateInput.value);
        } else if (this.nextPageHButton == evt.target
            || evt.target.id == "inextPageH" + this.options.pid
            || evt.target.id == "nextPageH" + this.options.pid) {
            this.loading(this.options.pid, this.currpage.pageNo + 1, 30,
                this.searchInput.value, this.statusSelect.value,
                this.fromDateInput.value, this.toDateInput.value);
        } else if (evt.target == this.lastPageHButton
            || evt.target.id == "ilastPageH" + this.options.pid
            || evt.target.id == "lastPageH" + this.options.pid) {
            this.loading(this.options.pid, this.currpage.allPagesCount, 30,
                this.searchInput.value, this.statusSelect.value,
                this.fromDateInput.value, this.toDateInput.value);
        } else if (evt.target == this.refreshHButton
            || evt.target.id == "irefreshH" + this.options.pid
            || evt.target.id == "refreshH" + this.options.pid) {
            this.loading(this.options.pid, 1, 30,
                this.searchInput.value, this.statusSelect.value,
                this.fromDateInput.value, this.toDateInput.value);
        } else if (evt.target == this.sButton ||
            evt.target.id == "searchBtn" + this.options.pid
            || evt.target.id == "isearchBtn" + this.options.pid) {
            this.loading(this.options.pid, 1, 30,
                this.searchInput.value, this.statusSelect.value,
                this.fromDateInput.value, this.toDateInput.value);
        } else if (evt.target.id == "export" + this.options.pid
            || evt.target.id == "iexport" + this.options.pid) {

        } else if (evt.target.id == "resume" + this.options.pid
            || evt.target.id == "iresume" + this.options.pid) {

        } else if (evt.target.id == "pause" + this.options.pid
            || evt.target.id == "ipause" + this.options.pid) {

        } else if (evt.target.id == "terminate" + this.options.pid
            || evt.target.id == "iterminate" + this.options.pid) {

        } else if (evt.target.id == "start" + this.options.id
            || evt.target.id == "istart" + this.options.id) {
            $("#progressbar").show();
            var that = this;
            $.post(service.api(2), {
                pid: this.options.pid,// process ID
                uid: this.options.uid,
            }).complete(function (data) {
                $("#progressbar").hide();
            });
        }
        Utils.stopDefault(evt);
    };

    SearchConditionPanel.prototype.addOptions = function (parent, title, value,
                                                          index) {
        var option = document.createElement("option");
        option.text = title;
        option.value = value;
        parent.options.add(option, index);
    };

    SearchConditionPanel.prototype.createPanel = function (parent, title) {
        var panelDiv = document.createElement("DIV");
        parent.appendChild(panelDiv);
        panelDiv.className = "panel panel-default";
        panelDiv.style.marginBottom = "0px";

        if (title != "") {
            var panelHeadDiv = document.createElement("DIV");
            panelDiv.appendChild(panelHeadDiv);
            panelHeadDiv.className = "panel-heading";
            panelHeadDiv.innerHTML = title;
        }

        var panelBodyDiv = document.createElement("DIV");
        panelDiv.appendChild(panelBodyDiv);
        panelBodyDiv.className = "panel-body";

        var panelForm = document.createElement("Form");
        panelBodyDiv.appendChild(panelForm);
        panelForm.className = "form-horizontal"
        return panelForm;
    };

    SearchConditionPanel.prototype.createResultPanel = function (parent, title) {
        var panelDiv = document.createElement("DIV");
        parent.appendChild(panelDiv);
        panelDiv.className = "panel panel-default";
        panelDiv.style.marginBottom = "0px";

        if (title != "") {
            var panelHeadDiv = document.createElement("DIV");
            panelDiv.appendChild(panelHeadDiv);
            panelHeadDiv.className = "panel-heading";
            panelHeadDiv.innerHTML = title;
        }

        var panelBodyDiv = document.createElement("DIV");
        panelDiv.appendChild(panelBodyDiv);
        panelBodyDiv.className = "panel-body";
        panelBodyDiv.style.padding = "0px";

        var panelForm = document.createElement("Form");
        panelBodyDiv.appendChild(panelForm);
        panelForm.className = "form-horizontal"
        return panelForm;
    };

    SearchConditionPanel.prototype.loading = function (pid, pageno, pagesize,
                                                       condition1, condition2,
                                                       condition3, condition4) {
        $("#progressbar").show();
        var that = this;
        $.get(service.api(40), {
            pid: pid,// process definition ID
            pn: pageno,
            psz: pagesize,
            cond1: condition1,// search
            cond2: condition2,// status
            cond3: condition3,// from date time
            cond4: condition4,// to date time
        }).complete(function (data) {
            that.loadData(data.responseJSON);
            $("#progressbar").hide();
        });
    };

    SearchConditionPanel.prototype.loadData = function (obj) {
        var currPage = new Page();
        currPage.parseFromJSON(obj);
        this.currpage = currPage;
        $(this.instancelist).children().remove();
        var objs = currPage.pageEntities;
        if (objs != null && objs.length > 0) {
            for (var i = 0; i < objs.length; i++) {
                var row = this.instancelist.insertRow(-1);
                row.setAttribute("key", objs[i].instanceId);
                row.setAttribute("pname", objs[i].processName);
                row.addEventListener('dblclick', this, false);
                this.createCell(0, objs[i].instanceId, row);
                this.createCell(1, objs[i].processName, row);
                this.createCell(2, objs[i].processVersion, row);
                this.createCell(3, processstatus[objs[i].status], row);
                this.createCell(4, objs[i].launcher, row);
                this.createCell(5, objs[i].idType, row);
                this.createCell(6, objs[i].idNumber, row);
                this.createCell(7, Utils.parseDateTime(objs[i].startTime), row);
                this.createCell(8, objs[i].suspensionTime == -1 ? "" : Utils.parseDateTime(objs[i].suspensionTime), row);
                this.createCell(9, objs[i].updateTime == -1 ? "" : Utils.parseDateTime(objs[i].updateTime), row);
                this.createCell(10, objs[i].server, row);
            }
            if (objs.length < 30) {
                for (var i = objs.length; i < 30; i++) {
                    var row = this.instancelist.insertRow(i);
                    for (var j = 0; j < 11; j++) {
                        this.createCell(j, "&nbsp;", row);
                    }
                }
            }
            this.addHeader();
            this.pageno.innerHTML = "第" + this.currpage.pageNo + "页";
            this.totalpage.innerHTML = "/共" + this.currpage.allPagesCount + "页";
        } else {
            this.initList();
        }
        if (this.currpage.allPagesCount <= 1) {
            this.firstPageHButton.disabled = true;
            this.previousPageHButton.disabled = true;
            this.nextPageHButton.disabled = true;
            this.lastPageHButton.disabled = true;
        } else if (this.currpage.allPagesCount > 1) {
            if (this.currpage.pageNo == 1) {
                this.firstPageHButton.disabled = true;
                this.previousPageHButton.disabled = true;
                this.nextPageHButton.disabled = false;
                this.lastPageHButton.disabled = false;
            } else if (this.currpage.pageNo == this.currpage.allPagesCount) {
                this.firstPageHButton.disabled = false;
                this.previousPageHButton.disabled = false;
                this.nextPageHButton.disabled = true;
                this.lastPageHButton.disabled = true;
            } else if (this.currpage.pageNo > 1
                && this.currpage.pageNo < this.currpage.allPagesCount) {
                this.firstPageHButton.disabled = false;
                this.previousPageHButton.disabled = false;
                this.nextPageHButton.disabled = false;
                this.lastPageHButton.disabled = false;
            }
        }
    };

    SearchConditionPanel.prototype.addHeader = function () {
        var header = this.instancelist.createTHead();
        var row = header.insertRow(0);
        this.createHead("应用标识", row);
        this.createHead("应用名称", row);
        this.createHead("版本", row);
        this.createHead("当前状态", row);
        this.createHead("发起人", row);
        this.createHead("证件", row);
        this.createHead("证件号", row);
        this.createHead("启动时间", row);
        this.createHead("暂停时间", row);
        this.createHead("修改时间", row);
        this.createHead("服务器IP", row);
    };

    SearchConditionPanel.prototype.createCell = function (no, content, row) {
        var cell = row.insertCell(no);
        cell.setAttribute("nowrap", "true");
        cell.innerHTML = content;
    };

    SearchConditionPanel.prototype.createHead = function (content, row) {
        var th = document.createElement('th');
        th.setAttribute("nowrap", "true");
        th.innerHTML = content;
        row.appendChild(th);
    };

    SearchConditionPanel.prototype.initList = function () {
        // document.createElement('tbody');
        for (var i = 0; i < 30; i++) {
            var row = this.instancelist.insertRow(i);
            for (var j = 0; j < 11; j++) {
                var cell1 = row.insertCell(j);
                cell1.innerHTML = "&nbsp;";
            }
        }
        this.addHeader();
        this.pageno.innerHTML = "第0页";
        this.totalpage.innerHTML = "/共0页";
        this.firstPageHButton.disabled = true;
        this.previousPageHButton.disabled = true;
        this.nextPageHButton.disabled = true;
        this.lastPageHButton.disabled = true;
    };

    $.fn[pluginName] = function (options) {
        return this.each(function () {
            if (!$.data(this, pluginName)) {
                $.data(this, pluginName,
                    new SearchConditionPanel(this, options));
            } else if ($.isFunction(Plugin.prototype[options])) {
                $.data(this, pluginName)[options]();
            }
        });
    };

})(jQuery, window, document);