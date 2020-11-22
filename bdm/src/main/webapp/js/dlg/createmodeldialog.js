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
        saveButton.type = "Button";
        saveButton.id = "OKButton" + options.id;
        saveButton.className = "btn btn-primary";
        saveButton.addEventListener("click", this, false);
        saveButton.innerHTML = "创建";

        var cancelButton = document.createElement("button");
        dialogFooterDIV.appendChild(cancelButton);
        cancelButton.type = "Button";
        cancelButton.id = "CancelButton" + options.id;
        cancelButton.className = "btn btn-default";
        cancelButton.innerHTML = "取消";
        cancelButton.setAttribute("data-dismiss", "modal");

    };

    CreateModelDialog.prototype.loadPanel = function (parent) {
        var form = document.createElement("form");
        parent.appendChild(form);
        // --
        var radiosDIV2 = document.createElement("div");
        form.appendChild(radiosDIV2);
        radiosDIV2.className = "form-group";

        var radiosLabel2 = document.createElement("label");
        radiosDIV2.appendChild(radiosLabel2);
        radiosLabel2.setAttribute("for", "type");
        radiosLabel2.className = "control-label";
        radiosLabel2.innerHTML = "报表类型";

        this.typeSelect = document.createElement("select");
        radiosDIV2.appendChild(this.typeSelect);
        this.typeSelect.className = "form-control";
        this.addOptions(this.typeSelect, "不分页式报表", "0", 0);
        this.addOptions(this.typeSelect, "分页式报表", "1", 1);
        this.addOptions(this.typeSelect, "统计报表", "2", 2);

        // --
        var radiosDIV3 = document.createElement("div");
        form.appendChild(radiosDIV3);
        radiosDIV3.className = "form-group";

        var radiosLabel3 = document.createElement("label");
        radiosDIV3.appendChild(radiosLabel3);
        radiosLabel3.setAttribute("for", "entityname");
        radiosLabel3.className = "control-label";
        radiosLabel3.innerHTML = "报表名称";

        this.nameInput = document.createElement("input");
        radiosDIV3.appendChild(this.nameInput);
        this.nameInput.type = "text";
        this.nameInput.setAttribute("placeholder", "请输入一个名称，名称不能为空。")
        this.nameInput.className = "form-control";
        this.nameInput.id = "entityname";
        this.nameInput.addEventListener("keydown", this, false);

        // --
        var radiosDIV4 = document.createElement("div");
        form.appendChild(radiosDIV4);
        radiosDIV4.className = "form-group";

        var radiosLabel4 = document.createElement("label");
        radiosDIV4.appendChild(radiosLabel4);
        radiosLabel4.setAttribute("for", "entityname");
        radiosLabel4.className = "control-label";
        radiosLabel4.innerHTML = "报表查询范围";

        var radiosLabel5 = document.createElement("label");
        form.appendChild(radiosLabel5);
        radiosLabel5.className = "radio-inline";

        this.redioOption1 = document.createElement("input");
        radiosLabel5.appendChild(this.redioOption1);
        this.redioOption1.name = "crossversion";
        this.redioOption1.type = "radio";
        this.redioOption1.value = "0";
        this.redioOption1.checked = true;
        radiosLabel5.appendChild(document.createTextNode("当前版本查询"));

        var radiosLabel6 = document.createElement("label");
        form.appendChild(radiosLabel6);
        radiosLabel6.className = "radio-inline";

        this.redioOption2 = document.createElement("input");
        radiosLabel6.appendChild(this.redioOption2);
        this.redioOption2.name = "crossversion";
        this.redioOption2.type = "radio";
        this.redioOption2.value = "1";
        radiosLabel6.appendChild(document.createTextNode("跨版本查询"));

        var dialog = $(parent).alertBox({
            id: this.options.id,
        });
        this.messageBox = dialog.data("alertBox");

    };

    CreateModelDialog.prototype.show = function () {
        this.nameInput.value = "";
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
                this.createNewObject(evt.target.value);
            } else {
                this.messageBox.show(4, "名称不能为空", false);
            }
            evt.preventDefault();
            return false;
        }
    };

    CreateModelDialog.prototype.doClick = function (evt) {
        evt.preventDefault();
        if (evt.target.id == "OKButton" + this.options.id) {
            var name1 =  this.nameInput.value;
            if (name1 == "") {
                this.messageBox.show(4, "名称不能为空", false);
                return;
            }
            this.createNewObject(name1, this.typeSelect.value,
                $('input[name="crossversion"][type=radio]:checked').val());
        }
    };

    CreateModelDialog.prototype.initData = function (type) {
    };

    CreateModelDialog.prototype.addOptions = function(parent, title, value, index) {
        var option = document.createElement("option");
        option.text = title;
        option.value = value;
        parent.options.add(option, index);
    };

    CreateModelDialog.prototype.createNewObject = function (name1, reporttype, crossversion) {
        var instance = $('#treeview').jstree();
        var selected = instance.get_selected(true);
        if (selected.length > 0) { // create report
            var parent = instance.get_selected(true)[0];
            var parentID = parent.id;
            var s = parent.data;
            var arry = s.split("|");
            var owner = arry[1]; // owner id
            var type = arry[2]; // type
            var version = arry[3]; // version
            var ownerID = "";
            if (owner == "null") {
                ownerID = parent.id;
            } else {
                ownerID = owner;
            }
            this.hide();
            this.options.parent.createObject(parent, name1, parentID,
                ownerID, type, version, reporttype, crossversion);
        } else {
            this.messageBox.show(4, "你没有选择一个流程应用，请选择一个流程应用。", false);
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