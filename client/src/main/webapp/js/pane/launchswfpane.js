/**
 *
 */

;
(function ($, window, document, undefined) {
    var pluginName = "launchSWfPane";
    var defaults = {
        id: "",
        parent: "",
    };

    var Board = function (element, options) {
        this.element = element;
        this.options = $.extend({
            id: "",
            parent: "",
        }, defaults, options);
        this._defaults = defaults;
        this._name = pluginName;
        this.stack = new CommandStack();
        this.init(options);
    };

    Board.prototype.init = function (options) {
        this.board = document.createElement("DIV");
        this.element.appendChild(this.board);
        this.board.className = "row";
        this.show(false);

        this.workpane = document.createElement("DIV");
        this.board.appendChild(this.workpane);
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

        this.head3 = document.createElement("LABEL");
        headTitleDIV.appendChild(this.head3);
        this.head3.className = "panel-title";
        this.head3.innerText = "新建";

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

        var g2 = document.createElement("SPAN");
        bgtoobar.appendChild(g2);
        g2.className = "btn-group";
        this.tCloseBtn = this.createButton(g2, "tClose" + options.id, "关闭", c1,
            "i", "fa fa-minus fa-lg");

        // form container.
        this.formbody = document.createElement("DIV");
        workitemPanel.appendChild(this.formbody);
        this.formbody.className = "panel-body";
        this.formbody.style.overflowY = "auto";
        this.formbody.style.overflowX = "auto";
        if (window.android != undefined) {
            var h = document.documentElement.clientHeight;
            this.formbody.style.height = (h) + "px";
            this.formbody.style.margin = "0px";
        } else {
            var h = document.documentElement.clientHeight;
            this.formbody.style.height = (h - 200) + "px";
            this.formbody.style.margin = "0px";
        }

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

        this.backButton = document.createElement("Button");
        btnGroup.appendChild(this.backButton);
        this.backButton.type = "button";
        this.backButton.className = "btn btn-primary";
        this.backButton.innerHTML = "回退";
        this.backButton.addEventListener('click', this, false);

        this.closeButton = document.createElement("Button");
        btnGroup.appendChild(this.closeButton);
        this.closeButton.type = "button";
        this.closeButton.className = "btn btn-default";
        this.closeButton.innerHTML = "关闭";
        this.closeButton.id = "close" + options.id;
        this.closeButton.addEventListener('click', this, false);

        // confirm message dialog plugin
        var p2 = $(this.board).confirmInfoDialog({
            id: "MY0057",
            title: "我的轩琦 - 提示",
            parent: this,
        });
        this.confirmInfoDialog = p2.data("confirmInfoDialog");

    };

    Board.prototype.createButton = function (group, id, title, style, fonttag,
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
        icon.id = "i" + id;
        return button;
    };

    Board.prototype.handleEvent = function (e) {
        switch (e.type) {
            case "click":
                this.doClick(e);
                break;
        }
    };

    // loading firstly.
    Board.prototype.loading = function (pid) {
        $("#progressbar").show();
        var that = this;
        this.pid = pid;// process definition Id
        this.piid = -1;
        this.ctid = -1;
        this.ip = "";
        $.get(service.api("LL0"), {
            pid: pid,// process definition id;
        }).complete(function (data) {
            if (data.responseJSON != null) {
                if (that.options.parent.hiddenAll != undefined) {
                    that.options.parent.hiddenAll();
                }
                that.loadData(data.responseJSON, 1);
                that.show(true);
            }
            $("#progressbar").hide();
        });
    };

    // launch: 1:first page;2:secondary page
    Board.prototype.loadData = function (obj, launch) {
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
        // this.wtype = obj.workflowType;
        // this.form.parseJSONforRuntime(obj.formContent);
        this.head3.innerText = this.form.name;
        // this.form = this.form.clone();
        // map[this.form.id] = this;
        // this.formbody.appendChild(this.form.dom);
        this.submitButton.id = "SUBMIT" + this.form.id;
        this.backButton.id = "BCAK" + this.form.id;
        if (launch == 1) {
            this.submitButton.style.display = "";
            this.backButton.style.display = "none";
            this.closeButton.style.display = "";
            this.tCloseBtn.style.display = "";
        } else {
            this.submitButton.style.display = "";
            this.backButton.style.display = "";
            this.closeButton.style.display = "none";
            this.tCloseBtn.style.display = "none";
        }
    };

    Board.prototype.doSaveAction = function (evt) {
        if (map[this.form.id] != null && map[this.form.id].stack != undefined) {
            map[this.form.id].stack.save();
        }
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
        if (this.ctid == -1) {
            $.post(service.api("LL7"), { // submit data to server for launching
                pid: this.pid,// process instance id;
                list: JSON.stringify(list),
            }).complete(function (data) {
                // 2意味着此应用为 多人参与，则关闭窗口。
                var o = data.responseJSON;
                if (o.status == 1) {
                    that.piid = o.wfProcessInstanceId;
                    that.ip = o.serverIp;
                    if (o.wfProcessInstanceStatus != 8) {
                        delete map[that.form.id];
                        that.ctid = o.id;
                        if (o.formContent != null) {
                            that.loadData(o, 2);
                        } else {
                            that.closeWorkbench();
                        }
                    } else {
                        that.closeWorkbench();
                    }
                } else {
                    alert("服务器未启动，提交失败！请先启动服务器。");
                    that.closeWorkbench();
                }
                $("#progressbar").hide();
            });
        } else {
            $.post(service.api("LL3"), { // submit & save data to server
                cmd: 2,// 2:提交;
                ip: this.ip,
                pid: this.piid,// process instance id;
                tid: this.ctid,// task instance id;
                list: JSON.stringify(list),
            }).complete(function (data) {
                var o = data.responseJSON;
                if (o != undefined && o != null) {
                    if (o.status == 1) {
                        that.ctid = o.id;
                        if (o.wfProcessInstanceStatus != 8) {
                            delete map[that.form.id];
                            if (o.formContent != null) {
                                that.loadData(o, 2);
                            }
                        } else {
                            that.closeWorkbench();
                        }
                    } else {
                        alert("服务器未启动，提交失败！请先启动服务器。");
                        that.closeWorkbench();
                    }
                } else {
                    that.closeWorkbench();
                }
                $("#progressbar").hide();
            });
        }
    };

    Board.prototype.show = function (show) {
        this.stack.clearStack();
        if (this.tUndoBtn != undefined)
            this.tUndoBtn.disabled = true;
        if (this.tRedoBtn != undefined)
            this.tRedoBtn.disabled = true;
        if (show) {
            this.board.style.display = "";
        } else {
            this.board.style.display = "none";
        }
        if (!show) {
            if (this.options.parent.hide != undefined) {
                this.options.parent.hide();
            }
        }
    };

    Board.prototype.doNoAction = function (evt) {
        this.confirmInfoDialog.hide();
        this.closeWorkbench("");
    };

    Board.prototype.getDirty = function () {
        return this.stack.isDirty();
    };

    Board.prototype.doYesAction = function (evt) {
        this.confirmInfoDialog.hide();
        this.closeWorkbench();
    };

    Board.prototype.doClick = function (evt) {
        var t = evt.target;
        if (t.id == "tUndo" + this.options.id
            || t.id == "itUndo" + this.options.id) {
            this.stack.undo();
        } else if (t.id == "tRedo" + this.options.id
            || t.id == "itRedo" + this.options.id) {
            this.stack.redo();
        } else if (t.id == "SUBMIT" + this.form.id) {
            this.doSaveAction();
        } else if (t.id == "BACK" + this.form.id) {

        } else if (t.id == "close" + this.options.id
            || t.id == "tClose" + this.options.id
            || t.id == "itClose" + this.options.id) {
            if (map[this.form.id].getDirty()) {
                this.confirmInfoDialog.show("关闭窗口将不保存您已经输入的数据，确定关闭吗？");
            } else {
                this.closeWorkbench();
            }
        }
    };

    Board.prototype.closeWorkbench = function (msg) {
        delete map[this.form.id];
        if (window.android != undefined) {
            if (msg == "") {
                window.android.close();
            } else {
                window.android.message(msg);
            }
        } else {
            this.show(false);
            if (this.options.parent != undefined &&
                this.options.parent.hiddenAll != undefined) {
                this.options.parent.hiddenAll();
            }
            if (this.options.parent != undefined &&
                this.options.parent.dashboard != undefined &&
                this.options.parent.dashboard.show != undefined) {
                this.options.parent.dashboard.show(true);
            }
        }
    };

    $.fn[pluginName] = function (options) {
        return this.each(function () {
            if (!$.data(this, pluginName)) {
                $.data(this, pluginName, new Board(this, options));
            } else if ($.isFunction(Plugin.prototype[options])) {
                $.data(this, pluginName)[options]();
            }
        });
    };

})(jQuery, window, document);