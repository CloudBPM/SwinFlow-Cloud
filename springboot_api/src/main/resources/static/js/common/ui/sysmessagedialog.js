/**
 *
 */
;
(function ($, window, document, undefined) {
    var pluginName = "sysMessageDialog";
    var defaults = {
        id: "",
        title: "",
        parent: "",
        url: "",
    };

    var MessageDialog = function (element, options) {
        this.element = element;
        this.options = $.extend({
            id: "",
            title: "",
            parent: "",
            url: "",
        }, defaults, options);
        this._defaults = defaults;
        this._name = pluginName;
        this.dialogBody;
        this.type = 0;
        this.init(options);
        this.counting = 60;
        this.height = 0;
    };

    MessageDialog.prototype.init = function (options) {
        this.modalframe = document.createElement("div");
        this.element.appendChild(this.modalframe);

        this.modalframe.className = "modal fade:not(in)";
        this.modalframe.id = "myModal" + options.id;
        this.modalframe.setAttribute("role", "dialog");
        this.modalframe.setAttribute("aria-labelledby", "gridSystemModalLabel");

        var modaldialogDIV = document.createElement("div");
        modaldialogDIV.className = "modal-dialog";
        modaldialogDIV.setAttribute("role", "document");
        modaldialogDIV.style.width = "750px";
        modaldialogDIV.style.height = this.height + "px";
        this.modalframe.appendChild(modaldialogDIV);

        var dialogContentDIV = document.createElement("div");
        dialogContentDIV.className = "modal-content";
        modaldialogDIV.appendChild(dialogContentDIV);

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
        titleH4.id = "gridSystemModalLabel" + options.id;

        var infoIcon = document.createElement("i");
        infoIcon.className = "fa fa-exclamation-circle";
        infoIcon.style.color = "red";
        titleH4.appendChild(infoIcon);

        var info = document.createElement("label");
        info.innerHTML = options.title;
        titleH4.appendChild(info);
        dialogHeaderDIV.appendChild(titleH4);

        var dialogForm = document.createElement("form");
        dialogContentDIV.appendChild(dialogForm);

        var dialogBodyDIV = document.createElement("div");
        dialogBodyDIV.className = "modal-body";
        dialogForm.appendChild(dialogBodyDIV);

        // add form panel or main content here...
        this.dialogBody = document.createElement("span");
        dialogBodyDIV.appendChild(this.dialogBody);

        var dialogFooterDIV = document.createElement("div");
        dialogFooterDIV.className = "modal-footer";
        dialogForm.appendChild(dialogFooterDIV);

        this.cancelButton = document.createElement("button");
        this.cancelButton.type = "button";
        this.cancelButton.className = "btn btn-default";
        this.cancelButton.innerHTML = "好的，知道了";
        this.cancelButton.setAttribute("data-dismiss", "modal");
        this.cancelButton.addEventListener("click", this, false);
        this.cancelButton.id = "btnCancel";
        dialogFooterDIV.appendChild(this.cancelButton);

        this.yesButton = document.createElement("button");
        this.yesButton.type = "button";
        this.yesButton.id = "YESButton" + options.id;
        this.yesButton.name = "YESButton" + options.id;
        this.yesButton.className = "btn btn-primary";
        this.yesButton.innerHTML = "立即退出";
        this.yesButton.addEventListener("click", this, false);
        this.yesButton.style.display = "none";
        dialogFooterDIV.appendChild(this.yesButton);

    };

    MessageDialog.prototype.show = function (obj, type) {
        this.setInfo(this, obj, type);
        $(this.modalframe).modal({
            backdrop: 'static',
            keyboard: true
        });
    };

    MessageDialog.prototype.setInfo = function (p, obj, type) {
        p.dialogBody.innerHTML = obj.pcContent;
        p.type = type;
        if (p.type == 1) {
            p.yesButton.style.display = "";
            p.t = setInterval(p.count, 1000, this, obj);
        } else {
            p.yesButton.style.display = "none";
        }
    };

    MessageDialog.prototype.handleEvent = function (e) {
        switch (e.type) {
            case "click":
                this.doClick(e);
                break;
        }
    };

    MessageDialog.prototype.count = function (parent, obj) {
        if (parent.counting > 0) {
            parent.counting = parent.counting - 1;
            parent.dialogBody.innerHTML = obj.pcContent + "（系统即将在"
                + parent.counting + "秒内重启，请尽快保存并退出系统）";
        } else {
            parent.logout();
        }
    };

    MessageDialog.prototype.logout = function () {
        clearInterval(this.t);
        window.location.replace(this.options.url);
    };

    MessageDialog.prototype.doClick = function (evt) {
        evt.preventDefault();
        if (evt.target.id == "YESButton" + this.options.id) {
            if (this.type == 1) {
                this.logout();
            }
        }
        if (evt.target.id === "btnCancel") {
            console.log("123321")
            this.logout();
        }
    };

    $.fn[pluginName] = function (options) {
        return this.each(function () {
            if (!$.data(this, pluginName)) {
                $.data(this, pluginName, new MessageDialog(this, options));
            } else if ($.isFunction(Plugin.prototype[options])) {
                $.data(this, pluginName)[options]();
            }
        });
    };

})(jQuery, window, document);