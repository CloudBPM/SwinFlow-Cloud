/**
 *
 */
;
(function($, window, document, undefined) {
    var pluginName = "bookViewEditor";
    var defaults = {
        id: "",
        owner: "",
        userId: "",
        ownerId: "",
        width: "",
        height: "",
        parent: "",
    };

    var Editor = function(element, options) {
        this.element = element;
        this.options = $.extend({
            id: "",
            owner: "",
            userId: "",
            ownerId: "",
            width: "",
            height: "",
            parent: "",
        }, defaults, options);
        this._defaults = defaults;
        this._name = pluginName;
        this.stack = new CommandStack();
        this.init(options);
    };

    Editor.prototype.init = function(options){
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
        modaldialogDIV.style.width = "1000px"
        modaldialogDIV.style.height = "800px";
        this.modalframe.appendChild(modaldialogDIV);

        var dialogContentDIV = document.createElement("div");
        dialogContentDIV.className = "modal-content";
        dialogContentDIV.style.height = "600px";
        dialogContentDIV.style.width = "850px";
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
        dialogBodyDIV.style.height = "470px";
        dialogForm.appendChild(dialogBodyDIV);

        var dialogBodyFrameDIV = document.createElement("div");
        dialogBodyFrameDIV.style.height = "470px";
        dialogBodyFrameDIV.className = "container-fluid";
        dialogBodyDIV.appendChild(dialogBodyFrameDIV);

        this.bodyRow = document.createElement("div");
        this.bodyRow.className = "row";
        this.bodyRow.id = "bodyrow" + options.id;
        this.bodyRow.style.height = "470px";
        dialogBodyFrameDIV.appendChild(this.bodyRow);

        this.vedioDisplayer = document.createElement("video");
        this.vedioDisplayer.style.width = "800px";
        this.vedioDisplayer.style.height = "450px";
        this.vedioDisplayer.controls = "controls";
        this.bodyRow.appendChild(this.vedioDisplayer);
        this.source = document.createElement("source");
        this.vedioDisplayer.appendChild(this.source);
        this.source.type = "video/mp4";
        this.source.style.width = "500px";
        this.source.style.height = "500px";

        // dialog footer
        var dialogFooterDIV = document.createElement("div");
        dialogFooterDIV.className = "modal-footer";
        dialogForm.appendChild(dialogFooterDIV);

        var cancelButton = document.createElement("button");
        cancelButton.type = "button";
        cancelButton.id = "CancelButton" + options.id;
        cancelButton.className = "btn btn-default";
        cancelButton.innerHTML = "取消";
        cancelButton.setAttribute("data-dismiss", "modal");
        dialogFooterDIV.appendChild(cancelButton);

        // var dialog = $(bodyRow).alertBox({
        //     id : "myalert" + options.id,
        // });
        // this.messageBox = dialog.data("alertBox");
        //
        // var p4 = $(bodyRow).messageDialog({
        //     id: "017",
        //     title: "提示",
        //     parent: this,
        // });
        // this.messageDialog = p4.data("messageDialog");
    };

    Editor.prototype.loadFile = function(data){
        // console.log(data);
        // var url = data.substring(12);
        this.source.src= nginxHost+data;
        console.log(nginxHost+data);
        // d.className = "media";
        // this.vedioDisplayer.src = nginxHost+url;
        // $(d).media({width:"100%", height:700});
    }

    Editor.prototype.show = function(url) {
        this.source.src = "";
        this.loadFile(url);
        $(this.modalframe).modal({
            backdrop : 'static',
            keyboard : true
        });
    };

    $.fn[pluginName] = function(options) {
        return this.each(function() {
            if (!$.data(this, pluginName)) {
                $.data(this, pluginName, new Editor(this, options));
            } else if ($.isFunction(Plugin.prototype[options])) {
                $.data(this, pluginName)[options]();
            }
        });
    };

})(jQuery, window, document);
