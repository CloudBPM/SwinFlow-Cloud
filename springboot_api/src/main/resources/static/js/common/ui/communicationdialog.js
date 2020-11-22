/**
 * 沟通对话框信息
 *
 * @author Dahai Cao created at 9:43 on 2019-01-15
 * @create Xuanqi Info Tech http://www.xuanqiyun.com copyright reserved from 2017
 */

;
(function ($, window, document, undefined) {
    var pluginName = "communicationDialog";
    var defaults = {
        id: "",
        parent: ""
    };

    var Dialog = function (element, options) {
        this.element = element;
        this.options = $.extend({
            id: "",
            parent: ""
        }, defaults, options);
        this._defaults = defaults;
        this._name = pluginName;
        this.init(options);
        this.owner = "";
        this.ownerId = "";
    };


    Dialog.prototype.init = function (options) {
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
        modaldialogDIV.style.width = "820px"
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
        var that = this;
        closeButton.addEventListener("click",function (ev) {
           that.options.parent.isShow();
        });

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
        infoIcon.className = "fa fa-comments fa-lg";
        infoIcon.style.color = "#6699cc";
        titleH4.appendChild(infoIcon);

        var info = document.createElement("label");
        info.innerHTML = "工作沟通";
        titleH4.appendChild(info);

        var catchword = document.createElement("span");
        catchword.innerHTML = " —— 工作成就于沟通协作！";
        catchword.style.fontSize = "11px";
        catchword.style.fontWeight = "bold";
        catchword.style.fontFamily = "FangSong";
        titleH4.appendChild(catchword);


        var pluginC = $(dialogContentDIV).communicationPanel({
            id: "99999",
            ownerId: this.options.ownerId,
            ownerName: this.options.ownerName,
            imgUrl: this.options.imgUrl,
            websocket : this.options.websocket,
            userId : this.options.userId,
            userName : this.options.userName,
            parent:this,
            sessionId : this.options.sessionId,

        });

        this.communicationPanel = pluginC.data("communicationPanel")
    };

    Dialog.prototype.show = function (uid) {
        this.uid = uid;
        $(this.modalframe).modal("show");
    };

    // Dialog.prototype.hide = function () {
    //     $(this.modalframe).modal('hide');
    // };

    // Dialog.prototype.handleEvent = function(e) {
    //     switch (e.type) {
    //         case "click":
    //             this.doClick(e);
    //             break;
    //     }
    // };

    // Dialog.prototype.doClick = function (evt) {
    // };

    $.fn[pluginName] = function (options) {
        return this.each(function () {
            if (!$.data(this, pluginName)) {
                $.data(this, pluginName, new Dialog(this, options));
            } else if ($.isFunction(Plugin.prototype[options])) {
                $.data(this, pluginName)[options]();
            }
        });
    };

})(jQuery, window, document);