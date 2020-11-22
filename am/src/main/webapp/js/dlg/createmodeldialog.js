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
        this.modalframe = document.createElement("div");
        this.element.appendChild(this.modalframe);

        // dialog
        this.modalframe.className = "modal fade";
        this.modalframe.id = "myModal" + options.id;
        this.modalframe.setAttribute("role", "dialog");
        this.modalframe.setAttribute("aria-labelledby", "modal" + options.id);

        var modaldialogDIV = document.createElement("div");
        modaldialogDIV.className = "modal-dialog";
        modaldialogDIV.setAttribute("role", "document");
        modaldialogDIV.style.width = "650px"
        this.modalframe.appendChild(modaldialogDIV);

        var dialogContentDIV = document.createElement("div");
        dialogContentDIV.className = "modal-content";
        modaldialogDIV.appendChild(dialogContentDIV);

        // dialog headding
        var dialogHeaderDIV = document.createElement("div");
        dialogHeaderDIV.className = "modal-header";
        dialogContentDIV.appendChild(dialogHeaderDIV);

        var closeButton = document.createElement("button");
        closeButton.type = "button";
        closeButton.className = "close";
        closeButton.setAttribute("data-dismiss", "modal");
        closeButton.setAttribute("aria-label", "Close");

        var closeSpan = document.createElement("span");
        closeSpan.setAttribute("aria-hidden", "true");
        closeSpan.innerHTML = "&times;";
        closeButton.appendChild(closeSpan);
        dialogHeaderDIV.appendChild(closeButton);

        var titleH4 = document.createElement("h4");
        titleH4.className = "modal-title";
        titleH4.id = "modal" + options.id;
        dialogHeaderDIV.appendChild(titleH4);

        var infoIcon = document.createElement("i");
        infoIcon.className = "fa fa-plus-circle fa-lg";
        infoIcon.style.color = "green";
        titleH4.appendChild(infoIcon);

        var info = document.createElement("label");
        info.innerHTML = options.title;
        titleH4.appendChild(info);

        // dialog body
        var dialogForm = document.createElement("form");
        dialogContentDIV.appendChild(dialogForm);

        var dialogBodyDIV = document.createElement("div");
        dialogBodyDIV.className = "modal-body";
        dialogForm.appendChild(dialogBodyDIV);

        var dialogBodyFrameDIV = document.createElement("div");
        dialogBodyFrameDIV.className = "container-fluid";
        dialogBodyDIV.appendChild(dialogBodyFrameDIV);

        var bodyRow = document.createElement("div");
        bodyRow.className = "row";
        bodyRow.id = "bodyrow" + options.id;
        dialogBodyFrameDIV.appendChild(bodyRow);

        // add form panel here...
        this.loadPanel(bodyRow);

        // dialog footer
        var dialogFooterDIV = document.createElement("div");
        dialogFooterDIV.className = "modal-footer";
        dialogForm.appendChild(dialogFooterDIV);

        var saveButton = document.createElement("button");
        saveButton.type = "Button";
        saveButton.id = "OKButton" + options.id;
        saveButton.className = "btn btn-primary";
        saveButton.addEventListener("click", this, false);
        // saveButton.setAttribute("data-dismiss", "modal");
        saveButton.innerHTML = "创建";
        dialogFooterDIV.appendChild(saveButton);

        var cancelButton = document.createElement("button");
        cancelButton.type = "Button";
        cancelButton.id = "CancelButton" + options.id;
        cancelButton.className = "btn btn-default";
        cancelButton.innerHTML = "取消";
        cancelButton.setAttribute("data-dismiss", "modal");
        dialogFooterDIV.appendChild(cancelButton);

        $('input[name=optionsRadios][type=radio]').attr('disabled', true);

    };

    CreateModelDialog.prototype.loadPanel = function (parent) {
        var form = document.createElement("form");
        parent.appendChild(form);

        // -- template
        var radiosDIV1 = document.createElement("div");
        radiosDIV1.className = "radio-inline";
        form.appendChild(radiosDIV1);

        var radiosLabel1 = document.createElement("label");
        radiosDIV1.appendChild(radiosLabel1);

        this.radiosInput1 = document.createElement("input");
        radiosLabel1.appendChild(this.radiosInput1);
        this.radiosInput1.type = "radio";
        this.radiosInput1.name = "optionsRadios";
        this.radiosInput1.setAttribute("value", "1"); // sms template

        var radiosText1 = document.createElement("text");
        radiosText1.innerHTML = "模板";
        radiosLabel1.appendChild(radiosText1);

        // // -- email template
        // var radiosDIV2 = document.createElement("div");
        // radiosDIV2.className = "radio-inline";
        // form.appendChild(radiosDIV2);
        //
        // var radiosLabel2 = document.createElement("label");
        // radiosDIV2.appendChild(radiosLabel2);
        //
        // this.radiosInput2 = document.createElement("input");
        // radiosLabel2.appendChild(this.radiosInput2);
        // this.radiosInput2.type = "radio";
        // this.radiosInput2.name = "optionsRadios";
        // this.radiosInput2.setAttribute("value", "2");// email template
        //
        // var radiosText2 = document.createElement("text");
        // radiosText2.innerHTML = "电子邮件模板";
        // radiosLabel2.appendChild(radiosText2);

        // -- service container
        var radiosDIV4 = document.createElement("div");
        form.appendChild(radiosDIV4);
        radiosDIV4.className = "radio-inline";

        var radiosLabel4 = document.createElement("label");
        radiosDIV4.appendChild(radiosLabel4);

        this.radiosInput4 = document.createElement("input");
        radiosLabel4.appendChild(this.radiosInput4);
        this.radiosInput4.type = "radio";
        this.radiosInput4.name = "optionsRadios";
        this.radiosInput4.setAttribute("value", "5"); // docker container

        var radiosText4 = document.createElement("text");
        radiosLabel4.appendChild(radiosText4);
        radiosText4.innerHTML = "微服务器";

        // -- micro-service
        var radiosDIV3 = document.createElement("div");
        radiosDIV3.className = "radio-inline";
        form.appendChild(radiosDIV3);

        var radiosLabel3 = document.createElement("label");
        radiosDIV3.appendChild(radiosLabel3);

        this.radiosInput3 = document.createElement("input");
        radiosLabel3.appendChild(this.radiosInput3);
        this.radiosInput3.type = "radio";
        this.radiosInput3.name = "optionsRadios";
        this.radiosInput3.setAttribute("value", "3");// 3 micro-service

        var radiosText3 = document.createElement("text");
        radiosLabel3.appendChild(radiosText3);
        radiosText3.innerHTML = "微服务";


        //

        var radiosDIV5 = document.createElement("div");
        form.appendChild(radiosDIV5);
        radiosDIV5.className = "form-group";

        var radiosLabel5 = document.createElement("label");
        radiosDIV5.appendChild(radiosLabel5);
        radiosLabel5.setAttribute("for", "microservicetype");
        radiosLabel5.className = "control-label";
        radiosLabel5.innerHTML = "类型";

        this.typeSelect = document.createElement("select");
        radiosDIV5.appendChild(this.typeSelect);
        this.typeSelect.name = "microservicetype";
        this.typeSelect.className = "form-control";
        this.typeSelect.id = "microservicetype";
        this.typeSelect.disabled = true;

        // --
        var radiosDIV3 = document.createElement("div");
        form.appendChild(radiosDIV3);
        radiosDIV3.className = "form-group";

        this.radiosLabel3 = document.createElement("label");
        radiosDIV3.appendChild(this.radiosLabel3);
        this.radiosLabel3.className = "control-label";
        this.radiosLabel3.innerHTML = "名称";

        this.nameInput = document.createElement("input");
        radiosDIV3.appendChild(this.nameInput);
        this.nameInput.type = "text";
        this.nameInput.setAttribute("placeholder", "请输入一个名称，名称不能为空。")
        this.nameInput.className = "form-control";
        this.nameInput.addEventListener('keydown', this, false);// 为回车键加监听事件

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

    CreateModelDialog.prototype.show = function (node) {
        this.nameInput.value = "";
        var s = node.data;
        var arry = s.split("|");
        this.radiosInput1.checked = false;
        //this.radiosInput2.checked = false;
        this.radiosInput3.checked = false;
        this.radiosInput4.checked = false;
        this.typeSelect.disabled = true;

        $(this.typeSelect).find('option').remove().end()

        if (arry[0] == "2") {
            var foldertype = arry[2]; // folder type
            this.owner = arry[1];
            this.parent = node.id;
            if (foldertype == 110) {// SMS template folder
                this.radiosInput1.checked = true;
                this.typeSelect.disabled = true;
                this.addOptions(this.typeSelect, "短信模板", "5", 0);
            } else if (foldertype == 113) {// Email template folder
                this.typeSelect.disabled = true;
                this.radiosInput1.checked = true;
                this.addOptions(this.typeSelect, "邮件模板", "6", 0);
            } else if (foldertype == 129) { // Web micro-service container folder
                this.radiosInput4.checked = true;
                this.typeSelect.disabled = false;
                this.addOptions(this.typeSelect, "Java Web应用微服务器", "1", 0);
                this.addOptions(this.typeSelect, "PHP应用微服务器", "2", 1);
                this.addOptions(this.typeSelect, "Pyhton应用微服务器", "3", 2);
                this.addOptions(this.typeSelect, "Ruby应用微服务器", "4", 3);
            } else if (foldertype == 117) { // Web micro-service API folder
                this.typeSelect.disabled = true;
                this.radiosInput3.checked = true;
                this.addOptions(this.typeSelect, "Web微服务API", "7", 0);
            } else if (foldertype == 140) { // Mobile application micro-service folder
                this.typeSelect.disabled = false;
                this.radiosInput3.checked = true;
                this.addOptions(this.typeSelect, "安卓APP微服务", "8", 0);
                this.addOptions(this.typeSelect, "苹果APP微服务", "9", 1);
                this.addOptions(this.typeSelect, "手机APP微服务包", "10", 2);
            }
        } else if (arry[0] == "3" && arry[2] == "5") {
            this.parent = node.id;
            this.owner = arry[1];
            if (arry[3] == 116) { // Micro-service container
                this.radiosInput3.checked = true;
                this.typeSelect.disabled = true;
                this.addOptions(this.typeSelect, "Java Web应用微服务器", "1", 0);
                this.addOptions(this.typeSelect, "PHP应用微服务器", "2", 1);
                this.addOptions(this.typeSelect, "Pyhton应用微服务器", "3", 2);
                this.addOptions(this.typeSelect, "Ruby应用微服务器", "4", 3);
                this.typeSelect.value = arry[5];
            }
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

    CreateModelDialog.prototype.doClick = function (evt) {
        evt.preventDefault();
        if (evt.target.id == "OKButton" + this.options.id) {
            var c = $('input[type="radio"][name="optionsRadios"]:checked')
                .val();
            var name1 = this.nameInput.value;
            if (name1.trim() == "") {
                this.messageBox.show(4, "名称不能为空", false);
                return;
            }
            this.checkName(name1, c, this.typeSelect.value, this.owner);
        }
    };

    CreateModelDialog.prototype.doKeydown = function (evt) {
        var e = window.event ? window.event : (evt ? evt : arguments[0]);
        var key = e.keyCode || e.which;
        if (key == 13) {// 回车键
            evt.preventDefault();// 阻止该事件
            if (evt.target.value != "") {
                var c = $('input[type="radio"][name="optionsRadios"]:checked')
                    .val();
                this.checkName(evt.target.value, c,
                    this.typeSelect.value, this.owner);
                this.hide();// close dialog earlier to show progress bar
                return false;
            } else {
                this.messageBox.show(4, "名称不能为空", false);
                return;
            }
        }
    };

    CreateModelDialog.prototype.checkName = function (name, type, ctype, owner) {
        var that = this;
        $("#progressbar").show();
        $.getJSON(service.api(3), { // check if the name existed.
            name: name,
            type: type,
            owner: owner,
        }).complete(function (data) {
            if (data.responseJSON == "1") {
                that.messageBox.show(4, "名称已存在，请重新输入。", false);
                $("#progressbar").hide();
                return;
            } else { // data.responseJSON is "0"
                that.createModel(name, type, ctype, owner);
            }
        });
    };

    CreateModelDialog.prototype.createModel = function (name1, type, ctype,
                                                        owner) {
        var t = null;
        if (type == 1) { // 模板
            if (ctype == 5) { // create sms template
                t = new SMSTemplate();
                t.id = null;
                t.name = name1;
                t.status = 1;
                t.createDateTime = new Date().getTime();
                t.lastupdate = new Date().getTime();
                t.parent = this.parent;
                t.owner = owner; // organization ID
            } else if (ctype == 6) { // create email template
                t = new EmailTemplate();
                t.id = null;
                t.name = name1;
                t.status = 1;
                t.createDateTime = new Date().getTime();
                t.lastupdate = new Date().getTime();
                t.parent = this.parent;
                t.owner = owner; // organization ID
            }
        } else if (type == 5) { // 微服务器
            t = new ServiceContainer();
            t.id = null;
            t.name = name1;
            t.containerType = ctype;
            t.rank = 2;
            t.type = 116;
            t.createDateTime = new Date().getTime();
            t.lastupdate = new Date().getTime();
            t.parent = this.parent;
            t.owner = owner; // organization ID
        } else if (type == 3) { // 微服务
            if (ctype == 1 || ctype == 2 ||
                ctype == 3 || ctype == 4 || ctype == 7) { // web micro-service
                var instance = $('#treeview').jstree(true);
                var sel = instance.get_selected(true)[0];
                if (sel != null) {
                    var ary = sel.data.split("|");
                    if ((ary[0] == "3" && ary[2] == "5")
                        || (ary[0] == "2" && ary[2] == "117")) {
                        t = new WebAppService();
                        t.id = null;
                        t.name = name1;
                        t.createDateTime = new Date().getTime();
                        t.lastupdate = new Date().getTime();
                        t.parent = this.parent;
                        t.owner = owner; // organization ID
                    }
                }
            } else if (ctype == 8) { // Android APP micro-service plugin (APK)
                // create an Android APP micro-service object
                t = new AndroidAppPlugin();
                t.id = null;
                t.alias = null;
                t.name = name1;
                t.createDateTime = new Date().getTime();
                t.lastupdate = new Date().getTime();
                t.parent = this.parent;
                t.owner = owner; // organization ID
            } else if (ctype == 9) { // iOS APP micro-service plugin
                // create an iOS APP micro-service object
            } else if (ctype == 10) { // 手机APP微服务包

            }
        }
        this.hide();
        this.options.parent.create(this.parent, t, type, owner);
    }

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