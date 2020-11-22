/**
 *
 */

;
(function ($, window, document, undefined) {
    var pluginName = "systemTaskEditPanel";
    var defaults = {
        id: "",
        parent: "",
        entity: "",
        topparent: "",
        currowner: "",
    };

    var SystetmTaskEditPanel = function (element, options) {
        this.element = element;
        this.options = $.extend({
            id: "",
            parent: "",
            entity: "",
            topparent: "",
            currowner: "",
        }, defaults, options);
        this._defaults = defaults;
        this._name = pluginName;
        this.topparent = options.topparent;
        this.ruleditdialog;
        this.entity = options.entity;
        this.appagents = [];

        this.init(options);
    };

    SystetmTaskEditPanel.prototype.init = function (options) {
        var plugin2 = $(this.topparent).assignmentEditDialog({
            id: options.id,
            title: "轩琦科技 - 表达式编辑器",
            parent: this,
            topparent: this.topparent,
        });
        this.ruleditdialog = plugin2.data("assignmentEditDialog");

        var plugin3 = $(this.topparent).appServiceStoreDialog({
            id: options.id,
            title: "轩琦科技 - 微服务商店",
            parent: this,
            topparent: this.topparent,
        });
        this.appstoredialog = plugin3.data("appServiceStoreDialog");

        this.loadPane(options.entity, options.currowner);
    };

    SystetmTaskEditPanel.prototype.loadPane = function (entity, owner) {
        this.owner = owner;
        this.entity = entity;
        var mainmodalframeDiv = document.createElement("div");
        mainmodalframeDiv.className = "col-lg-12 col-md-12 col-sm-12 col-xs-12";
        mainmodalframeDiv.style.padding = "4px";
        this.element.appendChild(mainmodalframeDiv);

        var mainmodalframe = document.createElement("div");
        mainmodalframe.className = "panel panel-default";
        mainmodalframe.style.border = "0px";
        mainmodalframeDiv.appendChild(mainmodalframe);

        var modalframe = document.createElement("div");
        modalframe.className = "panel-body";
        modalframe.id = "";
        mainmodalframe.appendChild(modalframe);

        var appserviceform = document.createElement("form");
        appserviceform.className = "form-horizontal";
        modalframe.appendChild(appserviceform);

        var appServiceGroupDiv1 = document.createElement("div");
        appServiceGroupDiv1.className = "form-group";
        appserviceform.appendChild(appServiceGroupDiv1);

        var appServiceLebl = document.createElement("label");
        appServiceGroupDiv1.appendChild(appServiceLebl);
        appServiceLebl.setAttribute("for", "appservice" + this.options.id);
        appServiceLebl.className = "col-sm-2 control-label";
        appServiceLebl.innerHTML = "访问微服务";

        var apiListDiv = document.createElement("div");
        appServiceGroupDiv1.appendChild(apiListDiv);
        apiListDiv.className = "col-sm-10";

        var group = document.createElement("DIV");
        apiListDiv.appendChild(group);
        group.className = "input-group";
        group.style.padding = "2px";
        group.setAttribute("role", "search");
        group.setAttribute("aria-label", "");

        this.apiInput = document.createElement("input");
        group.appendChild(this.apiInput);
        this.apiInput.className = "form-control";
        this.apiInput.id = "appservice" + this.options.id;
        this.apiInput.setAttribute("placeholder", "选择并设置微服务...");
        this.apiInput.readOnly = true;

        // open application service market
        var searchSpan = document.createElement("span");
        group.appendChild(searchSpan);
        searchSpan.className = "input-group-btn";

        this.searchBtn = this.createTool(searchSpan, "searchAppBtn"
            + this.options.id, "打开微服务商店查找可用的微服务", "btn btn-primary", "i",
            "fa fa-search");

        var securityKeyDiv = document.createElement("div");
        appserviceform.appendChild(securityKeyDiv);
        securityKeyDiv.className = "form-group";

        var securityKeyLabel = document.createElement("label");
        securityKeyDiv.appendChild(securityKeyLabel);
        securityKeyLabel.className = "col-sm-2 control-label";
        securityKeyLabel.innerHTML = "访问密码";
        securityKeyLabel.setAttribute("for", "securityKey" + this.options.id);

        var skeyInoutDiv = document.createElement("div");
        securityKeyDiv.appendChild(skeyInoutDiv);
        skeyInoutDiv.className = "col-sm-10";

        this.sekeyInput = document.createElement("input");
        skeyInoutDiv.appendChild(this.sekeyInput);
        this.sekeyInput.className = "form-control";
        this.sekeyInput.id = "sekey" + this.options.id;
        this.sekeyInput.setAttribute("placeholder", "请输入访问密码，如果无访问密码，该输入框为只读。");
        this.sekeyInput.addEventListener("change", this, false);
        this.sekeyInput.readOnly = true;

        // parameter setting
        // for java app service, they are the parameters;
        // for web app service (micro service): they are path parameters;
        var apiParamGroupDiv1 = document.createElement("div");
        apiParamGroupDiv1.className = "form-group";
        appserviceform.appendChild(apiParamGroupDiv1);

        var paramLabel = document.createElement("label");
        apiParamGroupDiv1.appendChild(paramLabel);
        paramLabel.className = "col-sm-2 control-label";
        paramLabel.innerHTML = "请求参数";
        paramLabel.setAttribute("for", "");

        var paramsDiv = document.createElement("div");
        apiParamGroupDiv1.appendChild(paramsDiv);
        paramsDiv.className = "col-sm-10";

        var paramPanelDiv = document.createElement("div");
        paramsDiv.appendChild(paramPanelDiv);
        paramPanelDiv.className = "panel panel-default";
        paramPanelDiv.id = "paramsPane" + this.options.id;
        paramPanelDiv.addEventListener("click", this, false);

        var paramsTableDiv = document.createElement("div");
        paramPanelDiv.appendChild(paramsTableDiv);
        paramsTableDiv.className = "table-responsive";

        this.paramList = document.createElement("table");
        // this.paramList.id = "params" + this.options.id;
        this.paramList.className = "table table-striped table-hover";
        paramsTableDiv.appendChild(this.paramList);

        var tr1 = this.paramList.insertRow(0);
        this.newTh(tr1, "参数名");
        this.newTh(tr1, "类型");
        this.newTh(tr1, "参数赋值");
        this.newTh(tr1, "参数注释");

        // extra parameter setting
        // for web app service (micro service): they are form parameters;
        var extraParamGroupDiv = document.createElement("div");
        appserviceform.appendChild(extraParamGroupDiv);
        extraParamGroupDiv.className = "form-group";

        var extraParamterLabel = document.createElement("label");
        extraParamGroupDiv.appendChild(extraParamterLabel);
        extraParamterLabel.className = "col-sm-2 control-label";
        extraParamterLabel.innerHTML = "提交参数";
        extraParamterLabel.setAttribute("for", "");

        var extraparamsDiv = document.createElement("div");
        extraParamGroupDiv.appendChild(extraparamsDiv);
        extraparamsDiv.className = "col-sm-10";

        var eparamPanelDiv = document.createElement("div");
        extraparamsDiv.appendChild(eparamPanelDiv);
        eparamPanelDiv.className = "panel panel-default";
        eparamPanelDiv.id = "extraparamsPane" + this.options.id;
        eparamPanelDiv.addEventListener("click", this, false);

        var extraparamsTableDiv = document.createElement("div");
        eparamPanelDiv.appendChild(extraparamsTableDiv);
        extraparamsTableDiv.className = "table-responsive";

        this.extraParamList = document.createElement("table");
        // this.extraParamList.id = "params" + this.options.id;
        this.extraParamList.className = "table table-striped table-hover";
        extraparamsTableDiv.appendChild(this.extraParamList);

        var tr2 = this.extraParamList.insertRow(0);
        this.newTh(tr2, "参数名");
        this.newTh(tr2, "类型");
        this.newTh(tr2, "参数赋值");
        this.newTh(tr2, "参数注释");

        // file attachment setting
        // for web app service (micro service): they are file attachments;
        var attachmentGroupDiv = document.createElement("div");
        appserviceform.appendChild(attachmentGroupDiv);
        attachmentGroupDiv.className = "form-group";

        var attachmentLabel = document.createElement("label");
        attachmentGroupDiv.appendChild(attachmentLabel);
        attachmentLabel.className = "col-sm-2 control-label";
        attachmentLabel.innerHTML = "返回数据";
        attachmentLabel.setAttribute("for", "");

        var attachmentDiv = document.createElement("div");
        attachmentGroupDiv.appendChild(attachmentDiv);
        attachmentDiv.className = "col-sm-10";

        var attachmentPanelDiv = document.createElement("div");
        attachmentDiv.appendChild(attachmentPanelDiv);
        attachmentPanelDiv.className = "panel panel-default";
        attachmentPanelDiv.id = "attachmentPane" + this.options.id;
        attachmentPanelDiv.addEventListener("click", this, false);

        var attachmentsTableDiv = document.createElement("div");
        attachmentPanelDiv.appendChild(attachmentsTableDiv);
        attachmentsTableDiv.className = "table-responsive";

        this.attachList = document.createElement("table");
        // this.attachList.id = "attach" + this.options.id;
        this.attachList.className = "table table-striped table-hover";
        attachmentsTableDiv.appendChild(this.attachList);

        var tr3 = this.attachList.insertRow(0);
        this.newTh(tr3, "获取返回值变量名");
        this.newTh(tr3, "返回类型");
        this.newTh(tr3, "注释");

        this.options.parent.disabledAddButton();
        this.options.parent.disabledModifyButton();
        this.options.parent.disabledRemoveButton();

        this.setTask(this.entity, owner);

    };

    SystetmTaskEditPanel.prototype.createTool = function (group, id, title,
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
        icon.addEventListener('click', this, false);
        icon.className = fontclass;
        icon.setAttribute("title", title);
        icon.id = id;
        return button;
    };

    SystetmTaskEditPanel.prototype.setTask = function (task, owner) {
        this.apiInput.value = task.appServiceName;
        if (task.hasSecurityAccessKey == 1) {
            this.sekeyInput.readOnly = false;
        } else {
            this.sekeyInput.readOnly = true;
        }
        this.sekeyInput.value = task.securityAccessKey;
        this.loadingParams(task.pathParameters, this.paramList);
        this.loadingParams(task.formParameters, this.extraParamList);
        if (task.returnObject != null || task.returnString != "") {
            this.loadingReturn(task.returnObject, this.attachList, task.returnObject);
        }

        if (task.appServiceId != null && task.appServiceId == "") {
            this.appstoredialog.setApp(task.appServiceId, task.appServiceType, task.owner);
        } else {
            this.appstoredialog.setApp("", task.appServiceType, task.owner);
        }

        if (owner instanceof WfProcess) {
            this.searchBtn.disabled = false;
        } else {
            this.searchBtn.disabled = true;
        }
    };

    // owner is wfprocess object.
    SystetmTaskEditPanel.prototype.setAppSearchResult = function (title, apptye, id,
                                                                  appid, pw) {
        var that = this;
        $("#progressbar").show();
        $.getJSON(service.api(18), {
            apptype: apptye,
            id: id,
        }).complete(function (data) {
            that.loadingNew(title, data.responseJSON, apptye, appid, pw);
            $("#progressbar").hide();
        });
    };

    // load a new app service from search engine.
    SystetmTaskEditPanel.prototype.loadingNew = function (title, json, apptye,
                                                          appid, pw) {
        this.apiInput.value = title;
        var haskey = 0;
        if (pw == "Y") {
            this.sekeyInput.readOnly = false;
            haskey = 1;
        } else {
            this.sekeyInput.readOnly = true;
        }
        // if (apptye == "2") { // Java app service
        // var currApp = new JavaAPI();
        // currApp.parse(json);
        // map[this.owner.id].stack.execute(new PMSystemTaskAPIChangedCmd(
        // this.entity, currApp, this.owner, apptye, appid, title,
        // haskey));
        // } else
        if (apptye == "7") { // Web app service
            var currApp = new WebAppService();
            currApp.parseForPM(json);
            map[this.owner.id].stack.execute(new PMSystemTaskWebAppChangedCmd(
                this.entity, currApp, this.owner, apptye, appid, title, haskey));
        }
    };

    // param should be a variable in wfprocess
    SystetmTaskEditPanel.prototype.loadingReturn = function (param, list, returnObject) {
        this.clearParameterTable(list);
        if (param != undefined && param != null && param != "") {
            var row = list.insertRow(-1);
            row.addEventListener("click", this, false);
            row.addEventListener("dblclick", this, false);
            row.id = param.id;

            if (this.owner instanceof WfProcess) {
                var cell1 = row.insertCell(0);
                this.varlist = document.createElement("SELECT");
                cell1.appendChild(this.varlist);
                this.varlist.className = "form-control";
                this.varlist.addEventListener('change', this, false);
                if (returnObject instanceof DataVariable) {
                    var l = this.owner.listVariablesByType(returnObject.datatype);
                    for (var i = 0; i < l.length; i++) {
                        this.addOptions(this.varlist, l[i].name, l[i].id, i);
                    }
                    if (this.varlist.options.length > 0) {
                        this.varlist.value = param.id;
                    }
                }
            } else {
                this.newTd(row, 0, param.name);
            }

            if (param.datatype == "file" || param.datatype == "File") {
                this.newTd(row, 1, formdatatype["File"]);
            } else {
                this.newTd(row, 1, formdatatype[param.datatype]);
            }
            if (param.description != undefined && param.description != null
                && param.description != "" && param.description != "null") {
                var cell1 = this.newTd(row, 2, param.description);
                cell1.setAttribute("title", param.description);
            } else {
                var cell1 = this.newTd(row, 2, "");
                cell1.setAttribute("title", "");
            }
        }
    };

    SystetmTaskEditPanel.prototype.loadingParams = function (params, list) {
        this.clearParameterTable(list);
        if (params != null && params.length > 0) {
            for (var k = 0; k < params.length; k++) {
                if (params[k] != undefined && params[k] != null
                    && params[k] != "") {
                    this.addParameterRow(params[k], list);
                }
            }
        }
    };

    SystetmTaskEditPanel.prototype.clearParameterTable = function (paramList) {
        while (paramList.rows.length > 1) {
            paramList.deleteRow(1);
        }
    };

    SystetmTaskEditPanel.prototype.addParameterRow = function (p, parameterTable) {
        var row = parameterTable.insertRow(-1);
        row.addEventListener("click", this, false);
        row.addEventListener("dblclick", this, false);
        row.id = p.name;
        this.newTd(row, 0, p.name);
        if (p.datatype == "File" || p.datatype == "file") {
            this.newTd(row, 1, formdatatype["File"]);
        } else
            this.newTd(row, 1, formdatatype[p.datatype]);
        if (p.value != null && p.value != "")
            this.newTd(row, 2, p.value);
        else
            this.newTd(row, 2, "");
        if (p.comments != undefined && p.comments != null && p.comments != ""
            && p.comments != "null") {
            var cell1 = this.newTd(row, 3, p.comments);
            cell1.setAttribute("title", p.comments);
        } else {
            var cell1 = this.newTd(row, 3, "");
            cell1.setAttribute("title", "");
        }
    };

    SystetmTaskEditPanel.prototype.newTh = function (row, content) {
        var th = document.createElement('th');
        th.innerHTML = content;
        row.appendChild(th);
    };

    SystetmTaskEditPanel.prototype.newTd = function (row, number, content) {
        var cell1 = row.insertCell(number);
        cell1.innerHTML = content;
        return cell1;
    };

    SystetmTaskEditPanel.prototype.handleEvent = function (e) {
        switch (e.type) {
            case "click":
                this.doClick(e);
                break;
            case "dblclick":
                this.doDblClick(e);
                break;
            case "change":
                this.doChange(e);
                break;
        }
    };

    SystetmTaskEditPanel.prototype.doClick = function (evt) {
        evt.preventDefault();
        var element = evt.target;
        if (element == this.searchBtn
            || (element.tagName == "I" && element.id == "searchAppBtn"
                + this.options.id)) {
            this.appstoredialog.show();
            return;
        }
        if (this.owner instanceof WfProcess) {
            if (element.tagName == "DIV") {
                if (element.id == ("paramsPane" + this.options.id)
                    || element.id == ("extraparamsPane" + this.options.id)
                    || element.id == ("attachmentPane" + this.options.id)) {
                    element.className = "panel panel-primary";
                }
                this.options.parent.disabledAddButton();
                this.options.parent.disabledModifyButton();
                this.options.parent.disabledRemoveButton();
            } else if (element.tagName == "TH") {
                this.options.parent.disabledAddButton();
                this.options.parent.disabledModifyButton();
                this.options.parent.disabledRemoveButton();
                var table = element.parentElement.parentElement;
                table.parentElement.parentElement.parentElement.className = "panel panel-primary";
                this.clearSelection(table);
                this.selectRow(element.parentElement);
            } else if (element.tagName == "TD") {
                this.options.parent.disabledAddButton();
                this.options.parent.disabledModifyButton();
                //this.options.parent.enableModifyButton();
                this.options.parent.disabledRemoveButton();
                var table = element.parentElement.parentElement;
                table.parentElement.parentElement.parentElement.className = "panel panel-primary";
                this.clearSelection(table);
                this.selectRow(element.parentElement);
            }
        }
    };

    SystetmTaskEditPanel.prototype.modifyRow = function (evt) {
        if (this.apiParamterList.rows.length > 1) {
            for (var i = 1; i < this.apiParamterList.rows.length; i++) {
                if (this.rowSelected(this.apiParamterList.rows[i])) {
                    this.ruleditdialog.setParameter(this.entity,
                        this.apiParamterList.rows[i].id);
                    this.ruleditdialog.show();
                }
            }
        }
    };

    SystetmTaskEditPanel.prototype.doDblClick = function (evt) {
        if (this.owner instanceof WfProcess) {
            if (evt.target.tagName == "TD") {
                this.options.parent.disabledAddButton();
                this.options.parent.disabledModifyButton();
                // this.options.parent.enableModifyButton();
                this.options.parent.disabledRemoveButton();
                var table = evt.target.parentElement.parentElement.parentElement;
                if (table != this.attachList) {
                    table.parentElement.parentElement.className = "panel panel-primary";
                    this.clearSelection(table);
                    this.selectRow(evt.target.parentElement);
                    var paratype = 0;
                    if (table == this.paramList) {
                        paratype = 0;
                    } else if (table == this.extraParamList) {
                        paratype = 1;
                        // } else if (table == this.attachList) {
                        // 	paratype = 2;
                    }
                    this.ruleditdialog.setParameter(this.entity,
                        evt.target.parentElement.id, this.owner, paratype);
                    this.ruleditdialog.show();
                }
            }
        }
    };

    SystetmTaskEditPanel.prototype.doChange = function (evt) {
        var element = evt.target;
        if (element == this.sekeyInput) {
            map[this.owner.id].stack.execute(new PMValueChangedCmd(this.entity,
                "securityAccessKey", this.sekeyInput.value, this.owner));
        } else if (element == this.varlist) {
            map[this.owner.id].stack.execute(new PMValueChangedCmd(this.entity,
                "returnObject", this.owner
                    .seekChildByID(this.varlist.value), this.owner));
        }
    };

    SystetmTaskEditPanel.prototype.clearSelection = function (table) {
        if (table.rows.length > 0) {
            for (var i = 0; i < table.rows.length; i++) {
                table.rows[i].style.background = "";
            }
        }
    };

    SystetmTaskEditPanel.prototype.selectRow = function (row) {
        row.style.background = "#d1d1e0";
    };

    SystetmTaskEditPanel.prototype.rowSelected = function (row) {
        return row.style.background == "rgb(209, 209, 224)";
    };

    SystetmTaskEditPanel.prototype.addOptions = function (parent, title, value,
                                                          index) {
        var option = document.createElement("option");
        option.text = title;
        option.value = value;
        parent.options.add(option, index);
    };

    $.fn[pluginName] = function (options) {
        return this.each(function () {
            if (!$.data(this, pluginName)) {
                $.data(this, pluginName,
                    new SystetmTaskEditPanel(this, options));
            } else if ($.isFunction(Plugin.prototype[options])) {
                $.data(this, pluginName)[options]();
            }
        });
    };

})(jQuery, window, document);