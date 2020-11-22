/**
 *
 */

;
(function ($, window, document, undefined) {
    var pluginName = "launchProcessInstanceDlg";
    var defaults = {
        id: "",
        title: "",
        parent: "", // process manager plugin handler
    };

    var LaunchDialog = function (element, options) {
        this.element = element;
        this.options = $.extend({
            id: "",
            title: "",
            parent: "",
        }, defaults, options);
        this._defaults = defaults;
        this._name = pluginName;
        this.init(options);
    };

    LaunchDialog.prototype.init = function (options) {
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
        modaldialogDIV.style.width = "1000px"

        var dialogContentDIV = document.createElement("div");
        modaldialogDIV.appendChild(dialogContentDIV);
        dialogContentDIV.className = "modal-content";

        // dialog body
        var dialogForm = document.createElement("form");
        dialogContentDIV.appendChild(dialogForm);

        var dialogBodyDIV = document.createElement("div");
        dialogForm.appendChild(dialogBodyDIV);
        dialogBodyDIV.className = "modal-body";
        dialogBodyDIV.style.padding = "0px";

        var dialogBodyFrameDIV = document.createElement("div");
        dialogBodyDIV.appendChild(dialogBodyFrameDIV);
        dialogBodyFrameDIV.className = "container-fluid";

        this.bodyRow = document.createElement("div");
        dialogBodyFrameDIV.appendChild(this.bodyRow);
        this.bodyRow.className = "row";
        this.bodyRow.id = "bodyrow" + options.id;

        if ($(this.bodyRow).launchSWfPane != undefined) {
            var board = $(this.bodyRow).launchSWfPane({
                id : "launchSWfPane" + options.id,
                parent : this,
            });
            this.launchSWfPane = board.data("launchSWfPane");
            this.launchSWfPane.show(false);
        }

        if ($(this.bodyRow).launchMWfPane != undefined) {
            var board = $(this.bodyRow).launchMWfPane({
                id : "launchMWfPane" + options.id,
                parent : this,
            });
            this.launchMWfPane = board.data("launchMWfPane");
            this.launchMWfPane.show(false);
        }
    };

    LaunchDialog.prototype.loadPanel = function(piid, wftype) {
        if (wftype == 1) {
            // single participant workflow
            this.launchSWfPane.loading(piid);
            this.launchSWfPane.show(true);
        } else if (wftype == 2) {
            // multiple participant workflow
            this.launchMWfPane.loading(piid);
            this.launchMWfPane.show(true);
        }
    };

    LaunchDialog.prototype.show = function (piid, wftype) {
        this.loadPanel(piid, wftype);
        $(this.modalframe).modal({
            backdrop : 'static',
            keyboard : true
        });
    };

    LaunchDialog.prototype.hide = function () {
        $(this.modalframe).modal('hide');
    };

    $.fn[pluginName] = function (options) {
        return this.each(function () {
            if (!$.data(this, pluginName)) {
                $.data(this, pluginName, new LaunchDialog(this, options));
            } else if ($.isFunction(Plugin.prototype[options])) {
                $.data(this, pluginName)[options]();
            }
        });
    };

})(jQuery, window, document);