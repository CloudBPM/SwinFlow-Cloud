;
(function($, window, document, undefined) {
    var pluginName = "uploadIconsPlugin";
    var defaults = {
        id : "",
        parent : "",
        width : "",
        height : "",
        opt1 : "",
    };

    var UploadFilesPlugin = function(element, options) {
        this.element = element;
        this.options = $.extend({
            id : "",
            parent : "",
            width : "",
            height : "",
            opt1 : "",
        }, defaults, options);
        this._defaults = defaults;
        this._name = pluginName;
        this.init(options);
    };

    UploadFilesPlugin.prototype.init = function(options) {
        var modalframe = document.createElement("div");
        this.element.appendChild(modalframe);

        var p = $(modalframe).uploadPlugin({
            id : "upload0167B", // plugin id
            url : service.uploadapi(4, options.ownerId, ""),
            extpara : options.opt1, // extra parameters for uploading
            actnow : "1", // if 1, dochange method will work
            filer : ".jpg,.png,.jpeg", // image.* or image/gif, image/jpeg
            multiple : "0", // if 1, input will can select multiple files
            parent : this, // parent plugin
            ownerId : options.ownerId,
        });

        this.p = p.data("uploadPlugin");
        this.p.fileInput.type = "file";
        this.p.fileInput.id = "file";
        this.p.fileInput.name = "file";
        this.p.fileInput.className = "hide";
        this.p.cancelBtn.className = "hide";
        this.p.previewBtn.className = "hide";

        this.box = document.createElement("DIV");
        modalframe.appendChild(this.box);
        this.box.style.width = options.width;
        this.box.style.height = options.height;
        this.box.style.border = "2px #BF3F3F dashed";
        this.box.style.borderRadius = "5px";
        this.box.style.textAlign = "center";
        this.box.innerHTML = "单击或将手机插件图标拖拽到此处";
        this.box.addEventListener("click", this, false);
        this.box.addEventListener('dragover', this, false);
        this.box.addEventListener('drop', this, false);

    };

    UploadFilesPlugin.prototype.complete = function(f, loaded, total, data, child) {
        if (this.options.parent.refresh != undefined) {
            this.options.parent.refresh();
        }
        //var blob = new Blob([ child.uploadAction.fb ]);
        //var url = URL.createObjectURL(blob);
    };

    UploadFilesPlugin.prototype.handleEvent = function(e) {
        switch (e.type) {
            case "click":
                this.doClick(e);
                break;
            case "change":
                this.doChange(e);
                break;
            case "dragover":
                this.handleDragOver(e);
                break;
            case "drop":
                this.handleFileSelect(e);
                break;
        }
    };

    UploadFilesPlugin.prototype.handleDragOver = function(evt) {
        evt.stopPropagation();
        evt.preventDefault();
        evt.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
    };

    UploadFilesPlugin.prototype.handleFileSelect = function(evt) {
        evt.stopPropagation();
        evt.preventDefault();
        var files = evt.dataTransfer.files; // FileList object.
        if (this.p != null) {
            this.p.uploading(files);
        }
    };

    UploadFilesPlugin.prototype.doClick = function(evt) {
        var type = "";
        if (evt.target == this.box) {
            this.p.fileInput.click();
        }
    };

    $.fn[pluginName] = function(options) {
        return this.each(function() {
            if (!$.data(this, pluginName)) {
                $.data(this, pluginName, new UploadFilesPlugin(this, options));
            } else if ($.isFunction(Plugin.prototype[options])) {
                $.data(this, pluginName)[options]();
            }
        });
    };

})(jQuery, window, document);
