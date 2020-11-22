/**
 *
 */
;
(function ($, window, document, undefined) {
    var pluginName = "workbench";
    var defaults = {
        id: "",
        parent: "",
        uid: "",
        userName: "",
    };

    var Workbench = function (element, options) {
        this.element = element;
        this.options = $.extend({
            id: "",
            parent: "",
            uid: "",
            userName: "",
        }, defaults, options);
        this._defaults = defaults;
        this._name = pluginName;
        this.stack = new CommandStack();
        // this variable is used in mobile APP in worklist4mb.jsp
        this.worklist = null;
        this.source = 0;
        this.init(options);
    };

    Workbench.prototype.init = function (options) {
        this.workbench = document.createElement("DIV");
        this.element.appendChild(this.workbench);
        this.show(false);

        var layout = document.createElement("DIV");
        this.workbench.appendChild(layout);
        layout.className = "row";

        this.workpane = document.createElement("DIV");
        layout.appendChild(this.workpane);
        this.workpane.className = "col-lg-12 col-md-12 col-sm-12 col-xs-12";

        var workitemPanel = document.createElement("DIV");
        this.workpane.appendChild(workitemPanel);
        workitemPanel.className = "panel panel-default";
        workitemPanel.style.marginBottom = "0px";

        var workitemPanelHead = document.createElement("DIV");
        workitemPanel.appendChild(workitemPanelHead);
        workitemPanelHead.className = "panel-heading";

        var headTitleDIV = document.createElement("DIV");
        workitemPanelHead.appendChild(headTitleDIV);
        headTitleDIV.className = "form-inline";

        var headTitle = document.createElement("LABEL");
        headTitleDIV.appendChild(headTitle);
        headTitle.className = "panel-title";

        this.head3 = document.createElement("LABEL");
        headTitle.appendChild(this.head3);
        this.head3.className = "panel-title";
        this.head3.innerText = "我的测试业务";

        var bgtoobar = document.createElement("DIV");
        headTitleDIV.appendChild(bgtoobar);
        bgtoobar.className = "btn-toolbar pull-right";
        bgtoobar.setAttribute("role", "toolbar");
        bgtoobar.setAttribute("aria-label",
            "Workbench top toolbar with button groups");

        // fa-lg: 24px; fa-2x ：32px
        var c0 = "btn btn-primary btn-xs";
        var c1 = "btn btn-danger btn-xs";
        var c2 = "btn btn-default btn-xs";

        var g0 = document.createElement("SPAN");
        bgtoobar.appendChild(g0);
        g0.className = "btn-group";
        this.tUndoBtn = this.createButton(g0, "tUndo" + options.id, "撤销", c2,
            "i", "fa fa-reply fa-lg");
        this.tRedoBtn = this.createButton(g0, "tRedo" + options.id, "恢复", c2,
            "i", "fa fa-share fa-lg");
        this.tUndoBtn.disabled = true;
        this.tRedoBtn.disabled = true;
        this.stack.undoButton = this.tUndoBtn;
        this.stack.redoButton = this.tRedoBtn;

        var g1 = document.createElement("SPAN");
        bgtoobar.appendChild(g1);
        g1.className = "btn-group";
        this.tLeftArrowBtn = this.createButton(g1, "tLeftArrow" + options.id,
            "上一个", c0, "i", "fa fa-arrow-left fa-lg");
        this.tRightArrowBtn = this.createButton(g1, "tRightArrow" + options.id,
            "下一个", c0, "i", "fa fa-arrow-right fa-lg");
        this.tLeftArrowBtn.style.display = "none";
        this.tRightArrowBtn.style.display = "none";

        var g2 = document.createElement("SPAN");
        bgtoobar.appendChild(g2);
        g2.className = "btn-group";
        this.tCloseBtn = this.createButton(g2, "tClose" + options.id, "关闭", c1,
            "i", "fa fa-minus");

        // form container.
        this.formbody = document.createElement("DIV");
        workitemPanel.appendChild(this.formbody);
        this.formbody.className = "panel-body";
        this.formbody.style.overflowY = "auto";
        this.formbody.style.overflowX = "auto";
        this.formbody.style.margin = "0px";
        var h = document.documentElement.clientHeight;
        this.formbody.style.height = (h - 200) + "px";
        //this.formbody.style.padding = "4px";
        this.formbody.style.margin = "0px";

        var workitemPanelFooter = document.createElement("DIV");
        workitemPanel.appendChild(workitemPanelFooter);
        workitemPanelFooter.className = "panel-footer";

        var btnGroup = document.createElement("DIV");
        workitemPanelFooter.appendChild(btnGroup);
        btnGroup.className = "form-inline";

        this.submitButton = document.createElement("Button");
        btnGroup.appendChild(this.submitButton);
        this.submitButton.type = "button";
        this.submitButton.className = "btn btn-primary";
        this.submitButton.innerHTML = "提交";
        this.submitButton.addEventListener('click', this, false);

        this.saveButton = document.createElement("Button");
        btnGroup.appendChild(this.saveButton);
        this.saveButton.type = "button";
        this.saveButton.className = "btn btn-default";
        this.saveButton.innerHTML = "保存";
        this.saveButton.id = "saveG";
        this.saveButton.setAttribute("s", "hh");
        this.saveButton.addEventListener('click', this, false);

        this.returnButton = document.createElement("Button");
        btnGroup.appendChild(this.returnButton);
        this.returnButton.type = "button";
        this.returnButton.className = "btn btn-default";
        this.returnButton.innerHTML = "退回";
        this.returnButton.id = "return" + options.id;
        this.returnButton.addEventListener('click', this, false);
        this.returnButton.style.display = "none";

        this.closeButton = document.createElement("Button");
        btnGroup.appendChild(this.closeButton);
        this.closeButton.type = "button";
        this.closeButton.className = "btn btn-default";
        this.closeButton.innerHTML = "关闭";
        this.closeButton.id = "close" + options.id;
        this.closeButton.addEventListener('click', this, false);

        this.relocateButton = document.createElement("Button");
        btnGroup.appendChild(this.relocateButton);
        this.relocateButton.type = "button";
        this.relocateButton.className = "btn btn-default";
        this.relocateButton.innerHTML = "委托";
        this.relocateButton.id = "relocate" + options.id;
        this.relocateButton.addEventListener('click', this, false);
        this.relocateButton.style.display = "none";

        this.relocateDepSelect = document.createElement("SELECT");
        btnGroup.appendChild(this.relocateDepSelect);
        this.relocateDepSelect.type = "button";
        this.relocateDepSelect.className = "form-control";
        this.relocateDepSelect.id = "relocateDepSelect" + options.id;
        this.relocateDepSelect.addEventListener('change', this, false);
        this.relocateDepSelect.style.display = "none";

        this.addOptions(this.relocateDepSelect, "-- 请选择部门 --", "-1", 0);

        this.relocateSelect = document.createElement("SELECT");
        btnGroup.appendChild(this.relocateSelect);
        this.relocateSelect.type = "button";
        this.relocateSelect.className = "form-control";
        this.relocateSelect.id = "relocateSelect" + options.id;
        this.relocateSelect.addEventListener('change', this, false);
        this.relocateSelect.style.display = "none";

        this.addOptions(this.relocateSelect, "-- 请选择办理人 --", "-1", 0);

        var span = document.createElement("SPAN");
        btnGroup.appendChild(span);
        span.className = "pull-right";

        var g1 = document.createElement("DIV");
        span.appendChild(g1);
        g1.className = "btn-group";
        this.bLeftArrowBtn = this.createButton(g1, "bLeftArrow" + options.id,
            "上一个", c0, "i", "fa fa-arrow-left fa-lg");
        this.bRightArrowBtn = this.createButton(g1, "bRightArrow" + options.id,
            "下一个", c0, "i", "fa fa-arrow-right fa-lg");
        this.bLeftArrowBtn.style.display = "none";
        this.bRightArrowBtn.style.display = "none";

        // confirm message dialog plugin
        var p2 = $(workitemPanel).confirmInfoDialog({
            id: "MY005",
            title: "我的轩琦 - 提示",
            parent: this,
        });
        this.confirmInfoDialog = p2.data("confirmInfoDialog");

        // this.consultpane = document.createElement("DIV");
        // layout.appendChild(this.consultpane);
        // this.consultpane.className = "col-lg-4 col-md-4 col-sm-12 col-xs-12";
        //
        // var consultPanel = document.createElement("DIV");
        // this.consultpane.appendChild(consultPanel);
        // consultPanel.className = "panel panel-primary";
        // consultPanel.style.marginBottom = "0px";
        //
        // var consultPanelHead = document.createElement("DIV");
        // consultPanel.appendChild(consultPanelHead);
        // consultPanelHead.className = "panel-heading";
        //
        // var cheadTitle = document.createElement("LABEL");
        // consultPanelHead.appendChild(cheadTitle);
        // cheadTitle.className = "panel-title";
        //
        // var head3 = document.createElement("H4");
        // cheadTitle.appendChild(head3);
        // head3.innerHTML = "会商";
        //
        // var consultBody = document.createElement("DIV");
        // consultPanel.appendChild(consultBody);
        // consultBody.className = "panel-body";
        // consultBody.style.height = "400px";
        // consultBody.innerHTML = "f";

    };

    Workbench.prototype.setSource = function (source) {
        this.source = source;
    };

    Workbench.prototype.createButton = function (group, id, title, style,
                                                 fonttag, fontclass) {
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

    Workbench.prototype.addOptions = function (parent, title, value, index) {
        var option = document.createElement("option");
        option.text = title;
        option.value = value;
        parent.options.add(option, index);
    };

    Workbench.prototype.loading = function (ip, pid, tid, alevel, ptype, wtype,
                                            prty) {
        $("#progressbar").show();
        var that = this;
        this.pid = pid;
        this.tid = tid;
        this.ip = ip;
        $.get(service.api(2), {
            ip: ip,
            pid: pid,// process instance id;
            tid: tid,// task instance id;
            pri: prty,// priority
            uid: this.options.uid,
        }).complete(function (data) {
            that.loadData(data.responseJSON, alevel, ptype, wtype, prty);
            $("#progressbar").hide();
        });
    };

    Workbench.prototype.loadData = function (obj, alevel, ptype, wtype, prty) {
        if (obj!= null && obj.formContent != null) {
            while (this.formbody.hasChildNodes()) { // clear dom
                this.formbody.removeChild(this.formbody.firstChild);
            }
            this.form = new ReleasedForm();
            this.wtype = obj.workflowType;
            this.form.parseJSONforRuntime(obj.formContent);
            this.form.toDomForHTML(this.formbody);
            map[this.form.id] = this;

            // this.form = new ReleasedForm();
            // while (this.formbody.hasChildNodes()) { // clear dom
            //     this.formbody.removeChild(this.formbody.firstChild);
            // }
            // this.form.parseJSONforRuntime(obj.formContent);
            // this.form = this.form.clone();
            // map[this.form.id] = this;
            this.head3.innerText = this.form.name;
            // this.formbody.appendChild(this.form.dom);
            this.submitButton.disabled = false;
            this.submitButton.id = "SUBMIT" + this.form.id;
            $(this.saveButton).addClass("disabled");
            // this.returnButton.disabled = false;
            this.closeButton.disabled = false;
            this.tCloseBtn.disabled = false;
            // if (wtype == 2) {
            // 	this.relocateButton.style.display = "";
            // 	this.relocateDepSelect.style.display = "";
            // 	this.relocateSelect.style.display = "";
            // } else {
            // 	this.relocateButton.style.display = "none";
            // 	this.relocateDepSelect.style.display = "none";
            // 	this.relocateSelect.style.display = "none";
            // 	this.relocateButton.disabled = true;
            // }
            // this.bLeftArrowBtn.disabled = true;
            // this.bRightArrowBtn.disabled = true;
            // this.tLeftArrowBtn.disabled = true;
            // this.tRightArrowBtn.disabled = true;
            this.show(true);
        }
    };

    Workbench.prototype.handleEvent = function (e) {
        switch (e.type) {
            case "click":
                this.doClick(e);
                break;
            case "change":
                this.doChange(e);
                break;
        }
    };

    Workbench.prototype.show = function (show) {
        this.stack.clearStack();
        if (this.tUndoBtn != undefined)
            this.tUndoBtn.disabled = true;
        if (this.tRedoBtn != undefined)
            this.tRedoBtn.disabled = true;
        if (show) {
            this.workbench.style.display = "";
        } else {
            this.workbench.style.display = "none";
        }
    };

    Workbench.prototype.getDirty = function () {
        return this.stack.isDirty();
    };

    Workbench.prototype.doYesAction = function (evt) {
        this.doSaveAction();
    };

    Workbench.prototype.doSaveAction = function (evt) {
        map[this.form.id].stack.save();
        var objs = this.form.seekObjects();
        var list = {};
        if (objs.length > 0) {
            for (var i = 0; i < objs.length; i++) {
                if (objs[i].varId != undefined && objs[i].varId != null
                    && objs[i].varId != "" && objs[i].ac == 1) {
                    if (objs[i].classtypename == "SingleLineText" ||
                        objs[i].classtypename == "SingleSelect" ||
                        objs[i].classtypename == "RichTextInput" ||
                        objs[i].classtypename == "MultipleLineText" ||
                        objs[i].classtypename == "IntegerInput" ||
                        objs[i].classtypename == "CurrencyInput" ||
                        objs[i].classtypename == "DecimalsInput" ||
                        objs[i].classtypename == "NaturalNumberInput") {
                        if (objs[i].readOnly == 0 && objs[i].disabled == 0) {
                            list[objs[i].varId] = objs[i].initValue;
                        }
                    } else if (objs[i].classtypename == "CheckBoxes" ||
                        objs[i].classtypename == "Radios" ||
                        objs[i].classtypename == "DateTimeInput" ||
                        objs[i].classtypename == "DateTimeRangeInput") {
                        if (objs[i].readOnly == 0 && objs[i].disabled == 0) {
                            list[objs[i].varId] = objs[i].fetchValue();
                        }
                    } else if (objs[i].classtypename == "FileUpload") {

                    }
                }
            }
        }
        $("#progressbar").show();
        var that = this;
        $.post(service.api("LL3"), { // save data to server
            cmd: this.cmd,// 0:保存;1:关闭;2:提交;3:退回;4:委托
            ip: this.ip,
            pid: this.pid,// process instance id;
            tid: this.tid,// task instance id;
            list: JSON.stringify(list),
        }).complete(function (data) {
            that.closeWorkbench();
            that.confirmInfoDialog.hide();
            $("#progressbar").hide();
        });
    };

    Workbench.prototype.returnTaskInstanceNoSaving = function () {
        $("#progressbar").show();// return this task instance
        var that = this;
        $.post(service.api(4), {
            ip: this.ip,
            pid: this.pid,// process instance id;
            tid: this.tid,// task instance id;
        }).complete(function (data) {
            that.closeWorkbench();
            $("#progressbar").hide();
        });
    };

    Workbench.prototype.reassignTaskInstanceNoSaving = function () {
        $("#progressbar").show();// reassign this task instance to others
        var that = this;
        $.post(service.api(5), {
            ip: this.ip,
            pid: this.pid,// process instance id;
            tid: this.tid,// task instance id;
            newuserid: this.newuserId,// task instance id;
        }).complete(function (data) {
            that.closeWorkbench();
            that.confirmInfoDialog.hide();
            $("#progressbar").hide();
        });
    };

    Workbench.prototype.doNoAction = function (evt) {
        if (this.cmd == 1) {
            this.confirmInfoDialog.hide();
            this.closeWorkbench();
        } else if (this.cmd == 3) {
            this.returnTaskInstanceNoSaving();
        } else if (this.cmd == 4) {
            this.reassignTaskInstanceNoSaving();
        }
    };

    Workbench.prototype.closeWorkbench = function (evt) {
        delete map[this.form.id];
        this.show(false);
        if (this.worklist != null) {
            this.worklist.show(true);
        } else {
            this.options.parent.hiddenAll();
            if (this.source == 0) {
                this.options.parent.dashboard.show(true);
            } else {
                this.options.parent.queuePane.show(true);
            }
        }
    };

    Workbench.prototype.doClick = function (evt) {
        // this.cmd含义代表着命令，也就是点了那个按钮
        // 0:保存;1:关闭;2:提交;3:退回;4:委托
        var t = evt.target;
        if (t.id == "tUndo" + this.options.id
            || t.id == "itUndo" + this.options.id) {
            this.stack.undo();
        } else if (t.id == "tRedo" + this.options.id
            || t.id == "itRedo" + this.options.id) {
            this.stack.redo();
        } else if (t.id == "SUBMIT" + this.form.id) {
            this.cmd = 2;
            this.doSaveAction();
        } else if (t.id == "saveG") {
            this.cmd = 0;
            this.doSaveAction();
        } else if (t.id == "return" + this.options.id) {
            this.cmd = 3;
            if (map[this.form.id].getDirty()) {
                this.confirmInfoDialog.show("您已经修改了部分界面数据，是否保存修改？");
            } else {
                this.returnTaskInstanceNoSaving();
            }
        } else if (t.id == "close" + this.options.id
            || t.id == "tClose" + this.options.id
            || t.id == "itClose" + this.options.id) {
            this.cmd = 1;
            if (map[this.form.id].getDirty()) {
                this.confirmInfoDialog.show("您已经修改了部分界面数据，是否保存修改？");
            } else {
                this.closeWorkbench();
            }
        } else if (t.id == "relocate" + this.options.id) {
            this.cmd = 4;
            if (map[this.form.id].getDirty()) {
                this.confirmInfoDialog.show("您已经修改了部分界面数据，是否保存修改？");
            } else {
                this.reassignTaskInstanceNoSaving();
            }
        } else if (t.id == "tLeftArrow" + this.options.id
            || t.id == "itLeftArrow" + this.options.id) {
            // this.doSaveAction();
        } else if (t.id == "tRightArrow" + this.options.id
            || t.id == "itRightArrow" + this.options.id) {

        } else if (t.id == "bLeftArrow" + this.options.id
            || t.id == "ibLeftArrow" + this.options.id) {

        } else if (t.id == "bRightArrow" + this.options.id
            || t.id == "ibRightArrow" + this.options.id) {

        }
    };

    Workbench.prototype.doChange = function (evt) {
        if (evt.target == this.relocateDepSelect) {
            if (this.relocateDepSelect.selectedIndex != 0) {

            }
        } else if (evt.target == this.relocateSelect) {
            if (this.relocateSelect.value != 0) {
                this.relocateButton.disabled = false;
            } else {
                this.relocateButton.disabled = true;
            }
        }

    };

    $.fn[pluginName] = function (options) {
        return this.each(function () {
            if (!$.data(this, pluginName)) {
                $.data(this, pluginName, new Workbench(this, options));
            } else if ($.isFunction(Plugin.prototype[options])) {
                $.data(this, pluginName)[options]();
            }
        });
    };

})(jQuery, window, document);