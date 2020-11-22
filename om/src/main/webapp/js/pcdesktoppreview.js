;
(function ($, window, document, undefined) {
    var pluginName = "pcDesktopPreview";
    var defaults = {
        id: "",// form ID
        owner: "", // org ID
        sid: "",
    };

    var UIPreview = function (element, options) {
        this.element = element;
        this.options = $.extend({
            id: "",
            owner: "",
            sid: "",
        }, defaults, options);
        this._defaults = defaults;
        this._name = pluginName;
        this.init(options);
       // this.selected = null; // the selected object;
        window.addEventListener('keydown', this, true);

        this.loading(options);
    };

    UIPreview.prototype.loading = function (options) {
        var that = this;
        $("#progressbar").show();
        $.getJSON(service.api(38, options.owner), {
            cateid: options.id,
        }).complete(function (data) {
            if (data.responseText != "") {
                // category object
                var c = JSON.parse(data.responseText);
                if (c.pcUIContent != null && c.pcUIContent != "") {
                    var o = JSON.parse(c.pcUIContent)
                    var ui = new PCDesktopUI();
                    ui.parseFromJSON(o, 1);
                    that.currObject = ui;
                } else {
                    that.currObject = new PCDesktopUI();
                }
                that.initialize();
            }
            $("#progressbar").hide();
        });
    };

    UIPreview.prototype.initialize = function () {
        this.shading(this.options);
        this.currObject.toDomForHTML(this.canvasPane);
    };

    UIPreview.prototype.init = function (options) {
        var editorPanel = document.createElement("DIV");
        this.element.appendChild(editorPanel);
        editorPanel.className = "container-fluid";

        this.painterRow = document.createElement("DIV");
        editorPanel.appendChild(this.painterRow);
        this.painterRow.className = "row";
    };

    UIPreview.prototype.shading = function (options) {
        this.canvasPane = document.createElement("DIV");
        this.painterRow.appendChild(this.canvasPane);
        // root container
        this.canvasPane.className = "col-lg-12 col-md-12 col-sm-12 col-xs-12";
        this.canvasPane.id = "pcdesktopPane";
        this.canvasPane.style.backgroundColor = "#f6f6f6";
        this.canvasPane.style.height = document.documentElement.clientHeight + "px";

    };

    UIPreview.prototype.removeStyle = function (v) {
        this.style.removeChild(v);
    };

    UIPreview.prototype.getDirty = function () {
        return this.stack.isDirty();
    };

    UIPreview.prototype.handleEvent = function (e) {
        switch (e.type) {
            case "keypress":
                this.doKeypress(e);
                break;
            case "click":
                this.doClick(e);
                break;
        }
    };

    UIPreview.prototype.doClick = function (evt) {
        // Utils.stopBubble(evt);
    };

    UIPreview.prototype.updateDom = function () {
        $(this.canvasPane).empty();
        this.currObject.toDom(this.canvasPane);
    };

    UIPreview.prototype.doKeypress = function (evt) {
        evt = evt || window.event;
        Utils.stopBubble(evt);
    };

    $.fn[pluginName] = function (options) {
        return this.each(function () {
            if (!$.data(this, pluginName)) {
                $.data(this, pluginName, new UIPreview(this, options));
            } else if ($.isFunction(Plugin.prototype[options])) {
                $.data(this, pluginName)[options]();
            }
        });
    };

})(jQuery, window, document);