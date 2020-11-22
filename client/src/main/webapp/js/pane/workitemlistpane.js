;
(function ($, window, document, undefined) {
    var pluginName = "workItemListPane";
    var defaults = {
        id: "",
        parent: "",
        uid: "",
        topparent: "",
        querytype: "",
    };

    var ListPane = function (element, options) {
        this.element = element;
        this.options = $.extend({
            id: "",
            parent: "",
            uid: "",
            topparent: "",
            querytype: "",
        }, defaults, options);
        this._defaults = defaults;
        this._name = pluginName;
        this.init(options);
    };

    ListPane.prototype.init = function (options) {
        var modalframe = document.createElement("div");
        this.element.appendChild(modalframe);
        modalframe.style.marginTop = "4px";

        var row = document.createElement("DIV");
        modalframe.appendChild(row);
        row.className = "row";

        var col = document.createElement("DIV");
        row.appendChild(col);
        col.className = "col-lg-12 col-md-12 col-sm-12 col-xs-12";
        col.id = "worklist" + options.id;

    };

    ListPane.prototype.refresh = function () {
        var col = document.getElementById("worklist" + this.options.id);
        this.loading(col, this.options.uid, "");
    };

    ListPane.prototype.loading = function (col, uid, condition) {
        $("#progressbar").show();
        this.condition = condition;
        var that = this;
        $.get(service.api(13), {
            uid: uid,// user id;
            cond: condition,
            qtype: this.options.querytype,
        }).complete(function (data) {
            that.loadData(col, data.responseJSON);
            $("#progressbar").hide();
        });
    };

    ListPane.prototype.loadData = function (p, data) {
        while (p.hasChildNodes()) { // clear cols
            p.removeChild(p.lastChild);
        }
        if (data != null && data.length > 0) {
            for (var i = 0; i < data.length; i++) {
                if (data[i].taskInstanceStatus == 1) {
                    if (this.options.topparent.leftMenuBar != undefined) {
                        this.options.topparent.leftMenuBar.setItem6Badge(1);
                    }
                    if (this.options.prt != undefined) {
                        if (this.options.querytype == 0) {
                            this.options.prt.setBadage(this.options.prt.tabLink0, 1);
                        }
                        if (this.options.querytype == 1) {
                            this.options.prt.setBadage(this.options.prt.tabLink1, 1);
                        }
                        if (this.options.querytype == 2) {
                            this.options.prt.setBadage(this.options.prt.tabLink2, 1);
                        }
                        if (this.options.querytype == 3) {
                            this.options.prt.setBadage(this.options.prt.tabLink3, 1);
                        }
                    }
                }
                if (data[i].taskInstanceStatus == 1 ||
                    data[i].taskInstanceStatus == 2) {
                    if (this.options.querytype == "1") {
                        if (data[i].priority == 2) {
                            this.createWrkItem(p, data[i]);
                        }
                    } else {
                        this.createWrkItem(p, data[i]);
                    }
                }
            }
        }
    }

    ListPane.prototype.createWrkItem = function (p, d) {
        var workitemPanel = document.createElement("DIV");
        p.appendChild(workitemPanel);
        workitemPanel.className = "panel";
        if (d.taskInstanceStatus == 1) {
            workitemPanel.style.borderColor = "#30d768";
        } else if (d.taskInstanceStatus == 2) {
            workitemPanel.style.borderColor = "#7e3e0d";
        }

        var panelBody = document.createElement("DIV");
        workitemPanel.appendChild(panelBody);
        panelBody.addEventListener('click', this, false);
        if (d.taskInstanceStatus == 1) {
            panelBody.className = "panel-body enabled-status enabled-title";
            panelBody.style.backgroundColor = "#f6fffd";
        } else if (d.taskInstanceStatus == 2) {
            panelBody.className = "panel-body running-status running-title";
            panelBody.style.backgroundColor = "#fff6ea";
        }
        panelBody.name = "uibody";
        panelBody.setAttribute("pid", d.wfProcessInstanceId);
        panelBody.setAttribute("tid", d.id);
        panelBody.setAttribute("alevel", d.wfProcessAccessLevel);
        panelBody.setAttribute("ptype", d.wfProcessType);
        panelBody.setAttribute("wtype", d.workflowType);
        panelBody.setAttribute("prty", d.priority);
        panelBody.setAttribute("ip", d.serverIp);

        var row1 = document.createElement("DIV");
        panelBody.appendChild(row1);
        row1.name = "row1";
        row1.className = "row";

        var col0 = document.createElement("DIV");
        row1.appendChild(col0);
        col0.name = "col1";
        col0.className = "col-lg-8 col-md-8 col-sm-12 col-xs-12";

        var col01 = document.createElement("DIV");
        col0.appendChild(col01);
        col01.className = "col";
        col01.name = "colBname";
        col01.style.marginTop = "10px";
        col01.style.fontSize = "18px";
        col01.style.fontWeight = "Bold";
        col01.innerHTML = d.wfProcessInstanceName; // 业务名称

        var col1 = document.createElement("DIV");
        row1.appendChild(col1);
        col1.name = "col2"
        col1.className = "col-lg-4 col-md-4 col-sm-12 col-xs-12";

        var col12 = document.createElement("DIV");
        col1.appendChild(col12);
        col12.className = "col";

        var colP1 = document.createElement("P");
        col12.appendChild(colP1);
        colP1.className = "text-right";
        colP1.name = "pActiveTime";
        if (d.taskInstanceStatus == 1) {
            if (d.taskInstanceEnabledDateTime == -1) {
                colP1.innerHTML = "激活时间: 未知"; // 激活时间
            } else {
                colP1.innerHTML = "激活时间:" + Utils.getDateTime(d.taskInstanceEnabledDateTime); // 激活时间
            }

        } else if (d.taskInstanceStatus == 2) {
            colP1.innerHTML = "查阅时间:" + Utils.getDateTime(d.taskInstanceStartDateTime); // 激活时间
        }

        var row2 = document.createElement("DIV");
        panelBody.appendChild(row2);
        row2.className = "row";
        row2.name = "row2";

        var col2 = document.createElement("DIV");
        row2.appendChild(col2);
        col2.name = "col3";
        col2.className = "col-lg-12 col-md-12 col-sm-12 col-xs-12";

        this.setLabel(col2, "work", "工作：", d.name);
        this.setLabel(col2, "priority", "优先级：", this.getPriority(d.priority));
        this.setLabel(col2, "launcher", "发起人：", d.launchUserName);
        this.setLabel(col2, "launchTime", "发起时间：", Utils.getDateTime(d.launchDateTime));
        if (d.taskInstanceStatus == 1) {
            this.setLabel(col2, "submitter", "执行人：", d.submitterName);
        } else if (d.taskInstanceStatus == 2) {
            this.setLabel(col2, "submitter", "执行人：", d.submitterName);
        }
    };

    ListPane.prototype.getPriority = function (priority) {
        if (priority == 0) {
            return "普通";
        } else if (priority == 1) {
            return "重要";
        } else if (priority == 2) {
            return "紧急";
        }

    };

    ListPane.prototype.setLabel = function (p, name, labelname, content) {
        var col = document.createElement("DIV");
        p.appendChild(col);
        col.className = "col";
        col.name = "col" + name;

        var label3 = document.createElement("label");
        col.appendChild(label3);
        label3.name = "lb" + name,
            label3.innerHTML = labelname;
        var span3 = document.createElement("span");
        col.appendChild(span3);
        span3.name = "sp" + name;
        span3.innerHTML = content;
    };

    ListPane.prototype.handleEvent = function (e) {
        switch (e.type) {
            case "click":
                this.doClick(e);
                break;
        }
    };

    ListPane.prototype.doClick = function (evt) {
        var t = evt.target;
        var pbody = null;
        if (t.tagName == "LABEL") {
            if (t.name = "lb" + "work" ||
                t.name == "lb" + "launcher" ||
                t.name == "lb" + "launchTime" || t.name == "lb" + "submitter") {
                pbody = t.parentElement.parentElement.parentElement.parentElement;
            }
        } else if (t.tagName == "SPAN") {
            if (t.name = "sp" + "work" ||
                t.name == "sp" + "launcher" ||
                t.name == "sp" + "launchTime" || t.name == "sp" + "submitter") {
                pbody = t.parentElement.parentElement.parentElement.parentElement;
            }
        } else if (t.tagName == "DIV") {
            if (t.name == "uibody") {
                pbody = t.parentElement;
            } else if (t.name == "colBname") {
                pbody = t.parentElement.parentElement.parentElement;
            } else if (t.name == "row1" || t.name == "row2") {
                pbody = t.parentElement.parentElement.parentElement;
            } else if (t.name == "col1" || t.name == "col2" || t.name == "col3") {
                pbody = t.parentElement.parentElement.parentElement;
            } else if (t.name = "col" + "work" || t.name == "col" + "launcher" ||
                t.name == "col" + "launchTime" || t.name == "col" + "submitter") {
                pbody = t.parentElement.parentElement.parentElement;
            }
        } else if (t.tagName == "P") {
            if (t.name == "pActiveTime") {
                pbody = t.parentElement.parentElement.parentElement.parentElement;
            }
        }
        var pid = pbody.getAttribute("pid");
        var tid = pbody.getAttribute("tid");
        var alevel = pbody.getAttribute("alevel");
        var ptype = pbody.getAttribute("ptype");
        var wtype = pbody.getAttribute("wtype");
        var prty = pbody.getAttribute("prty");
        var ip = pbody.getAttribute("ip");
        if (pid != undefined && pid != null) {
            if (this.options.parent != undefined &&
                this.options.parent.show != undefined) {
                this.options.parent.show(false);
            }
            if (this.options.topparent != undefined &&
                this.options.topparent.workbench != undefined) {
                this.options.topparent.workbench.loading(
                    ip, pid, tid, alevel, ptype, wtype, prty);
            }
        }

    };

    $.fn[pluginName] = function (options) {
        return this.each(function () {
            if (!$.data(this, pluginName)) {
                $.data(this, pluginName, new ListPane(this, options));
            } else if ($.isFunction(Plugin.prototype[options])) {
                $.data(this, pluginName)[options]();
            }
        });
    };

})(jQuery, window, document);

