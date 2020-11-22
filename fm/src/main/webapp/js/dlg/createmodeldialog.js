/**
 *
 */

;
(function ($, window, document, undefined) {
    var pluginName = "createModelDialog";
    var defaults = {
        id: "",
        title: "",
        parent: "", // process manager plugin handler
    };

    var CreateModelDialog = function (element, options) {
        this.element = element;
        this.options = $.extend({
            id: "",
            title: "",
            parent: "",
        }, defaults, options);
        this._defaults = defaults;
        this._name = pluginName;
        this.modalframe;
        this.topparent;
        this.init(options);
    };

    CreateModelDialog.prototype.init = function (options) {
        this.topparent = options.topparent;
        // dialog
        this.modalframe = document.createElement("div");
        this.element.appendChild(this.modalframe);
        this.modalframe.className = "modal fade";
        this.modalframe.id = "myModal" + options.id;
        this.modalframe.setAttribute("role", "dialog");
        this.modalframe.setAttribute("aria-labelledby", "modal" + options.id);

        var modaldialogDIV = document.createElement("div");
        this.modalframe.appendChild(modaldialogDIV);
        modaldialogDIV.className = "modal-dialog";
        modaldialogDIV.setAttribute("role", "document");
        modaldialogDIV.style.width = "650px"

        var dialogContentDIV = document.createElement("div");
        modaldialogDIV.appendChild(dialogContentDIV);
        dialogContentDIV.className = "modal-content";

        // dialog headding
        var dialogHeaderDIV = document.createElement("div");
        dialogContentDIV.appendChild(dialogHeaderDIV);
        dialogHeaderDIV.className = "modal-header";

        var closeButton = document.createElement("button");
        dialogHeaderDIV.appendChild(closeButton);
        closeButton.type = "button";
        closeButton.className = "close";
        closeButton.setAttribute("data-dismiss", "modal");
        closeButton.setAttribute("aria-label", "Close");

        var closeSpan = document.createElement("span");
        closeButton.appendChild(closeSpan);
        closeSpan.setAttribute("aria-hidden", "true");
        closeSpan.innerHTML = "&times;";

        var titleH4 = document.createElement("h4");
        dialogHeaderDIV.appendChild(titleH4);
        titleH4.className = "modal-title";
        titleH4.id = "modal" + options.id;

        var infoIcon = document.createElement("i");
        titleH4.appendChild(infoIcon);
        infoIcon.className = "fa fa-plus-circle fa-lg";
        infoIcon.style.color = "green";

        var info = document.createElement("label");
        titleH4.appendChild(info);
        info.innerHTML = options.title;

        // dialog body
        var dialogForm = document.createElement("form");
        dialogContentDIV.appendChild(dialogForm);

        var dialogBodyDIV = document.createElement("div");
        dialogForm.appendChild(dialogBodyDIV);
        dialogBodyDIV.className = "modal-body";

        var dialogBodyFrameDIV = document.createElement("div");
        dialogBodyDIV.appendChild(dialogBodyFrameDIV);
        dialogBodyFrameDIV.className = "container-fluid";

        var bodyRow = document.createElement("div");
        dialogBodyFrameDIV.appendChild(bodyRow);
        bodyRow.className = "row";
        bodyRow.id = "bodyrow" + options.id;

        // add form panel here...
        this.loadPanel(bodyRow);

        // dialog footer
        var dialogFooterDIV = document.createElement("div");
        dialogForm.appendChild(dialogFooterDIV);
        dialogFooterDIV.className = "modal-footer";

        var saveButton = document.createElement("button");
        dialogFooterDIV.appendChild(saveButton);
        saveButton.type = "BUTTON";
        saveButton.id = "OKButton" + options.id;
        saveButton.className = "btn btn-primary";
        saveButton.addEventListener("click", this, false);
        saveButton.innerHTML = "创建";

        var cancelButton = document.createElement("button");
        dialogFooterDIV.appendChild(cancelButton);
        cancelButton.type = "BUTTON";
        cancelButton.id = "CancelButton" + options.id;
        cancelButton.className = "btn btn-default";
        cancelButton.innerHTML = "取消";
        cancelButton.setAttribute("data-dismiss", "modal");

    };

    CreateModelDialog.prototype.loadPanel = function (parent) {
        var form = document.createElement("form");
        parent.appendChild(form);

        // --
        var radiosDIV1 = document.createElement("div");
        form.appendChild(radiosDIV1);
        radiosDIV1.className = "radio-inline";

        var radiosLabel1 = document.createElement("label");
        radiosDIV1.appendChild(radiosLabel1);

        this.radiosInput1 = document.createElement("input");
        radiosLabel1.appendChild(this.radiosInput1);
        this.radiosInput1.type = "radio";
        this.radiosInput1.name = "optionsRadios" + this.options.id;
        this.radiosInput1.value = "1";
        this.radiosInput1.addEventListener("click", this, false);

        var radiosText1 = document.createTextNode("新文件夹");
        radiosLabel1.appendChild(radiosText1);

        // --
        var radiosDIV2 = document.createElement("div");
        form.appendChild(radiosDIV2);
        radiosDIV2.className = "radio-inline";

        var radiosLabel2 = document.createElement("label");
        radiosDIV2.appendChild(radiosLabel2);

        this.radiosInput2 = document.createElement("input");
        radiosLabel2.appendChild(this.radiosInput2);
        this.radiosInput2.type = "radio";
        this.radiosInput2.name = "optionsRadios" + this.options.id;
        this.radiosInput2.value = "2";
        this.radiosInput2.addEventListener("click", this, false);

        var radiosText2 = document.createTextNode("新表单数据应用服务");
        radiosLabel2.appendChild(radiosText2);

        // -- list
        var radiosDIV5 = document.createElement("div");
        form.appendChild(radiosDIV5);
        radiosDIV5.className = "form-group";

        var radiosLabel5 = document.createElement("label");
        radiosDIV5.appendChild(radiosLabel5);
        radiosLabel5.setAttribute("for", "microservicetype");
        radiosLabel5.className = "control-label";
        radiosLabel5.innerHTML = "服务类型";

        this.folderSelect = document.createElement("select");
        radiosDIV5.appendChild(this.folderSelect);
        this.folderSelect.name = "foldertype";
        this.folderSelect.className = "form-control";
        this.folderSelect.id = "foldertype";
        this.folderSelect.disabled = true;

        // --
        var radiosDIV3 = document.createElement("div");
        form.appendChild(radiosDIV3);
        radiosDIV3.className = "form-group";

        var radiosLabel3 = document.createElement("label");
        radiosDIV3.appendChild(radiosLabel3);
        radiosLabel3.setAttribute("for", "entityname");
        radiosLabel3.className = "control-label";
        radiosLabel3.innerHTML = "名称";

        this.nameInput = document.createElement("input");
        radiosDIV3.appendChild(this.nameInput);
        this.nameInput.type = "text";
        this.nameInput.setAttribute("placeholder", "请输入一个名称，名称不能为空");
        this.nameInput.name = "entityname";
        this.nameInput.className = "form-control";
        this.nameInput.id = "entityname" + this.options.id;
        this.nameInput.addEventListener("keydown", this, false);

        var dialog = $(parent).alertBox({
            id: this.options.id,
        });
        this.messageBox = dialog.data("alertBox");

    };

    CreateModelDialog.prototype.addOptions = function (parent, title, value,
                                                       index) {
        var option = document.createElement("option");
        option.text = title;
        option.value = value;
        parent.options.add(option, index);
    };

    CreateModelDialog.prototype.show = function () {
        var instance = $('#treeview').jstree();
        var selected = instance.get_selected(true);
        if (selected.length > 0) {// create model
            var parent = instance.get_selected(true)[0];
            var s = parent.data;
            var arry = s.split("|");
            var nodetype = arry[0]; // node type
            this.foldertype = arry[2]; // folder type
            this.owner = arry[1];
            this.parent = parent.id;
            if (nodetype == "3") {
                var pID = instance.get_parent(parent);
                $('#treeview').jstree('deselect_all', true);
                $('#treeview').jstree('select_node', pID);
                parent = instance.get_selected(true)[0];
            }
            this.radiosInput1.checked = true;
            this.folderSelect.disabled = true;
        } else {
            this.messageBox.show(4, "您没有选择一个文件夹，请选择一个文件夹。", false);
        }
        $(this.modalframe).modal({
            backdrop: 'static',
            keyboard: true
        });
    };

    CreateModelDialog.prototype.hide = function () {
        $(this.modalframe).modal('hide');
    };

    CreateModelDialog.prototype.handleEvent = function (e) {
        switch (e.type) {
            case "click":
                this.doClick(e);
                break;
            case "keydown":
                this.doKeydown(e);
                break;
        }
    };

    CreateModelDialog.prototype.doKeydown = function (evt) {
        var e = window.event ? window.event : (evt ? evt : arguments[0]);
        var key = e.keyCode || e.which;
        if (key == 13) {
            if (evt.target.value != "") {
                this.createNewObject(this.getRadioSelectResult(), evt.target.value);
            } else {
                this.messageBox.show(4, "名称不能为空", false);
            }
            evt.preventDefault();
            return false;
        }
    };

    CreateModelDialog.prototype.doClick = function (evt) {
        if (evt.target == this.radiosInput1) {
            this.folderSelect.disabled = true;
        } else if (evt.target == this.radiosInput2) {
            if (this.foldertype == 104) { // 文件夾
                this.folderSelect.disabled = true;
                $(this.folderSelect).empty();
                //this.addOptions(this.folderSelect, "基础数据", "104", 0);
            } else if (this.foldertype == 105) { // 引用数据
                this.folderSelect.disabled = false;
                $(this.folderSelect).empty();
                this.addOptions(this.folderSelect, "界面引用数据服务", "105", 0);
            } else if (this.foldertype == 106) { // 表单
                this.folderSelect.disabled = false;
                $(this.folderSelect).empty();
                // 3: data-collecting UI application service
                // 4: data-presentation UI application service
                // 5: data-listing UI application service
                // 6: data-statistics UI application service
                this.addOptions(this.folderSelect, "界面应用 - 数据采集服务", "106.3", 1);
                this.addOptions(this.folderSelect, "界面应用 - 数据展示服务", "106.4", 2);
                this.addOptions(this.folderSelect, "界面应用 - 数据列表服务", "106.5", 3);
                this.addOptions(this.folderSelect, "界面应用 - 数据统计服务", "106.6", 4);
            } else if (this.foldertype == 118) { // 已发布表单
                this.folderSelect.disabled = true;
                $(this.folderSelect).empty();
            }
        } else if (evt.target.id == "OKButton" + this.options.id) {
            var name1 = this.nameInput.value;
            if (name1 == "") {
                this.messageBox.show(4, "名称不能为空", false);
                return;
            }
            this.createNewObject(this.getRadioSelectResult(), name1);
        }
    };

    CreateModelDialog.prototype.getRadioSelectResult = function () {
        var radios = document.getElementsByName("optionsRadios" + this.options.id);
        for (var i = 0, length = radios.length; i < length; i++) {
            if (radios[i].checked) {
                return radios[i].value;
            }
        }
        return "0";
    };

    CreateModelDialog.prototype.createNewObject = function (c, name1) {
        var instance = $('#treeview').jstree();
        var selected = instance.get_selected(true);
        if (c == 1) { // create folder
            if (selected.length > 0) {// create folder
                var parent = instance.get_selected(true)[0];
                var parentID = parent.id;
                var s = parent.data;
                var arry = s.split("|");
                var owner = arry[1]; // owner id
                var ownerID = "";
                if (owner == "null") {
                    ownerID = parent.id;
                } else {
                    ownerID = owner;
                }
                this.hide();
                this.options.parent.createFolder(parent, name1,
                    this.foldertype, parentID, ownerID);
            } else {
                this.messageBox.show(4, "您没有选择一个公司或文件夹，请选择一个公司或者文件夹。", false);
            }
        } else if (c == 2) { // create model object: form or reference
            if (selected.length > 0) {
                var parent = instance.get_selected(true)[0];
                var s = parent.data;
                var arry = s.split("|");
                var type = arry[0]; // type
                if (type == "1") {
                    this.messageBox.show(4, "您必须在文件夹下创建，请选择一个文件夹。", false);
                    return;
                } else if (type == "3") {
                    var pID = instance.get_parent(parent);
                    $('#treeview').jstree('deselect_all', true);
                    $('#treeview').jstree('select_node', pID);
                    parent = instance.get_selected(true)[0];
                }
                var parentID = parent.id;
                var ownerID = arry[1];
                this.hide();
                if (this.foldertype == "104") {
                    // basic data
                } else if (this.foldertype == "105") {
                    this.options.parent.createReference(parent, name1,
                        parentID, ownerID);
                } else if (this.foldertype == "106") {
                    if (this.folderSelect.value == "106.3") {
                        this.options.parent.createForm(parent, name1, parentID,
                            ownerID, "3");
                    } else if (this.folderSelect.value == "106.4") {
                        this.options.parent.createForm(parent, name1, parentID,
                            ownerID, "4");
                    } else if (this.folderSelect.value == "106.5") {
                        this.options.parent.createForm(parent, name1, parentID,
                            ownerID, "5");
                    } else if (this.folderSelect.value == "106.6") {
                        this.options.parent.createForm(parent, name1, parentID,
                            ownerID, "6");
                    }
                } else if (this.foldertype == "118") {
                    // released form
                }
            } else {
                this.messageBox.show(4, "您没有选择一个文件夹，请选择一个文件夹。", false);
            }
        }

    };

    $.fn[pluginName] = function (options) {
        return this.each(function () {
            if (!$.data(this, pluginName)) {
                $.data(this, pluginName, new CreateModelDialog(this, options));
            } else if ($.isFunction(Plugin.prototype[options])) {
                $.data(this, pluginName)[options]();
            }
        });
    };

})(jQuery, window, document);