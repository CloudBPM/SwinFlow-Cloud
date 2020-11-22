/**
 *
 */
;
(function ($, window, document, undefined) {
    var pluginName = "fileManagementContentPane";
    var defaults = {
        id: "",
        ownerId: "",
        basicpropsheet: "",
        propsheet: "",
        width: 0,
        height: 0,
        path: "",
        parent: "",
    };

    var Editor = function (element, options) {
        this.element = element;
        this.options = $.extend({
            id: "",
            ownerId: "",
            basicpropsheet: "",
            propsheet: "",
            width: 0,
            height: 0,
            path: "",
            parent: "",
        }, defaults, options);
        this._defaults = defaults;
        this._name = pluginName;
        this.stack = new CommandStack();
        this.basicpropsheet = options.basicpropsheet;
        this.propsheet = options.propsheet;
        this.init(options);
    };

    Editor.prototype.init = function (options) {
        var editorPanel = document.createElement("DIV");
        this.element.appendChild(editorPanel);

        this.o1 = new Object();
        this.o1.oid = this.options.ownerId;
        this.o1.cid = this.options.cid;
        this.o1.path = "";
        if ($(editorPanel).fmUploadFilesPlugin != undefined) {
            var pp = $(editorPanel).fmUploadFilesPlugin({
                id: "upload0167C" + options.cid, // plugin id
                url: service.uploadapi(1, options.ownerId, options.cid),
                extpara: this.o1, // extra parameters for uploading
                actnow: "1", // if 1, dochange method will work
                filer: "", // image.* or image/gif, image/jpeg
                multiple: "1", // if 1, input will can select multiple files
                parent: this, // parent plugin
                ownerId: options.ownerId,
                width: "100%",
                height: 80,
            });
            this.upld = pp.data("fmUploadFilesPlugin");
        }

        var fleListPane = document.createElement("DIV");
        editorPanel.appendChild(fleListPane);

        if ($(fleListPane).listFilePane != undefined) {
            var p1 = $(fleListPane).listFilePane({
                id: options.id,
                cid: options.cid,
                ownerId: options.ownerId,
                basicpropsheet: options.basicpropsheet,
                propsheet: options.propsheet,
                width: options.width,
                height: options.height,
                parent: this,
            });
            this.listFilePane = p1.data("listFilePane");
        }
    };

    //版本2.0
    Editor.prototype.setData = function (e, data) {
        if (this.listFilePane != undefined) {
            this.listFilePane.loadData(data);
        }
    };

    //版本2.0
    Editor.prototype.loadFileChildrenData = function (pid, path) {
        if (this.listFilePane != undefined) {
            this.listFilePane.loadFileChildren(pid);
            this.listFilePane.fileName = path;
        }
    };

    // Editor.prototype.loadFileChildrenData = function (path) {
    //     var that = this;
    //     $.getJSON(service.api("28"), {
    //         oid: this.options.ownerId,
    //         cid: this.options.cid,
    //         childFile: path,
    //     }).complete(function (data) {
    //             that.listFilePane.loadData(data.responseJSON);
    //         $("#progressbar").hide();
    //     });
    //     that.listFilePane.fileName = path;
    //
    // };

    Editor.prototype.handleEvent = function (e) {
        Utils.stopBubble(e);
        switch (e.type) {
            case "click":
                this.doClick(e);
                break;
        }
    };

    $.fn[pluginName] = function (options) {
        return this.each(function () {
            if (!$.data(this, pluginName)) {
                $.data(this, pluginName, new Editor(this, options));
            } else if ($.isFunction(Plugin.prototype[options])) {
                $.data(this, pluginName)[options]();
            }
        });
    };

})(jQuery, window, document);
