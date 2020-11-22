/**
 * This plug in is used to upload a file to cloud platform.
 *
 * @author Dahai Cao created at 15:43 on 2018-07-10
 */
;
(function ($, window, document, undefined) {
    var pluginName = "backUploadFilesPlugin";
    var defaults = {
        id: "", // plugin id
        url: "", // uploading arget url
        actnow: "", // if 1, dochange method will work
        filer: "", // image.* or image/gif, image/jpeg
        multiple: "", // if 1, input will can select multiple files
        parent: "", // parent plugin
        height: 0,
    };

    var UploadPlugin = function (element, options) {
        this.element = element;
        this.options = $.extend({
            id: "", // plugin id
            url: "", // uploading arget url
            actnow: "", // if 1, dochange method will work
            filer: "", // image.* or image/gif, image/jpeg
            multiple: "", // if 1, input will can select multiple files
            parent: "", // parent plugin
            height: 0,
        }, defaults, options);
        this._defaults = defaults;
        this.extpara = null;
        this._name = pluginName;
        this.init(options);
    };

    UploadPlugin.prototype.init = function (options) {
        var mainframe = document.createElement("DIV");
        this.element.appendChild(mainframe);
        //mainframe.style.float = "left";
        mainframe.style.marginRight = "20px";

        this.form = document.createElement("FORM");
        mainframe.appendChild(this.form);

        var fileInputDiv = document.createElement("DIV");
        this.form.appendChild(fileInputDiv);

        this.fileInput = document.createElement("INPUT");
        fileInputDiv.appendChild(this.fileInput);
        this.fileInput.type = "file";
        this.fileInput.id = "file";
        this.fileInput.className = "hide";
        if (options.multiple == "1") {
            this.fileInput.multiple = true;
        }
        if (options.filter != "") {
            this.fileInput.accept = options.filter;
        }
        if (options.actnow == "1") {
            this.fileInput.addEventListener('change', this, false);
        }

        var infobar = document.createElement("DIV");
        fileInputDiv.appendChild(infobar);
        infobar.style.width = options.width;
        infobar.style.height = options.height;
        infobar.style.border = "1px #999999 dashed";
        infobar.style.borderRadius = "5px";

        // 这两个DIV互相切换显示：this.uploadTip和this.progress互换显示。
        this.uploadTip = document.createElement("DIV");
        infobar.appendChild(this.uploadTip);
        this.uploadTip.style.height =  "100px";
        this.uploadTip.style.textAlign = "center";
        this.uploadTip.style.display = "";
        if (options.height > 27) {
            var tip = document.createElement("P");
            this.uploadTip.appendChild(tip);
            tip.className = "text-center";
            tip.innerHTML = "单击空白处或将文件拖拽到此处";
        } else {
            this.uploadTip.innerHTML = "单击空白处或将文件拖拽到此处";
        }
        this.uploadTip.addEventListener("click", this, false);
        this.uploadTip.addEventListener('dragover', this, false);
        this.uploadTip.addEventListener('drop', this, false);

        this.msgbar = document.createElement("DIV");
        infobar.appendChild(this.msgbar);
        this.msgbar.style.height = "27px";
        this.msgbar.style.display = "none";

        this.progress = document.createElement("DIV");
        infobar.appendChild(this.progress);
        this.progress.style.margin = "2px";
        this.progress.style.height = (options.height - 31) + "px";
        this.progress.style.backgroundColor = "white";
        this.progress.style.borderRadius = "5px";
        this.progress.style.textAlign = "center";
        this.progress.style.display = "none";
        //
        this.progressBar = document.createElement("DIV");
        this.progressBar.style.width = "100%";
        this.progress.appendChild(this.progressBar);
        this.progressBar.style.borderRadius = "5px";
        this.progressBar.innerHTML = "0%";
        this.progressBar.style.textAlign = "center";
        this.progressBar.style.height = (options.height - 37) + "px";

        this.uploadAction = new UploadAction(this, options.url, options.extpara);

    };

    UploadPlugin.prototype.handleEvent = function (e) {
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

    UploadPlugin.prototype.downloadFile = function (owner, path, fname) {
        var that = this;
        $("#progressbar").show();
        var fd = new FormData();
        fd.append('oid', owner);
        fd.append('path', path);
        fd.append('filename', fname);
        var xhh = new XMLHttpRequest();
        xhh.open("post", service.downloadapi(7, owner), true);
        xhh.responseType = 'blob';
        xhh.onreadystatechange = function () {
            if (xhh.readyState == 4 && xhh.status == 200) {
                var contenttype = xhh.getResponseHeader("Content-Type");
                var name = xhh.getResponseHeader("Content-disposition");
                if (name != null) {
                    var filename = name.substring(20, name.length);
                    filename = decodeURI(filename, "utf-8");
                    that.saveFile(this.response, filename, contenttype);
                }

            }
            $("#progressbar").hide();
        };
        xhh.send(fd);
    };

    UploadPlugin.prototype.saveFile = function (blob, fileName, contenttype) {
        var b = Utils.getBrowserType();
        if (b == "Chrome") {
            var link = document.createElement('a');
            var file = new Blob([blob], {
                type: contenttype
            });
            link.href = window.URL.createObjectURL(file);
            link.download = fileName;
            link.click();
        } else if (b == "FF") {
            var file = new File([blob], fileName, {
                type: contenttype
            });
            var url = URL.createObjectURL(file);
            // window.location.href = url;
            parent.location.href = url;
        } else if (Utils.isIE()) {
            var file = new Blob([blob], {
                type: 'application/force-download'
            });
            window.navigator.msSaveBlob(file, fileName);
        }
    };

    UploadPlugin.prototype.doChange = function (evt) {
        if (evt.target == this.fileInput) {
            this.uploadAction.opt = this.extpara;
            if (this.fileInput.files.length > 0) {
                this.uploading(evt.target.files); // FileList object
            }
            //生成图片预览路径
            this.path = window.URL.createObjectURL(evt.target.files[0]);
        }
    };

    UploadPlugin.prototype.start = function () {
        if (this.fileInput.files.length > 0) {
            this.uploading(this.fileInput.files);
        }
    };

    UploadPlugin.prototype.doClick = function (evt) {
        var type = "";
        if (evt.target == this.uploadTip) {
            this.uploadAction.opt = this.extpara;
            this.fileInput.click();
        }
    };

    UploadPlugin.prototype.hasUploadedFiles = function () {
        return this.fileInput.files.length;
    };

    UploadPlugin.prototype.handleDragOver = function (evt) {
        evt.stopPropagation();
        evt.preventDefault();
        evt.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
    };

    UploadPlugin.prototype.handleFileSelect = function (evt) {
        evt.stopPropagation();
        evt.preventDefault();
        var files = evt.dataTransfer.files; // FileList object.
        this.uploadAction.opt = this.extpara;
        this.uploading(files);
    };

    UploadPlugin.prototype.uploading = function (files) {
        this.uploadAction.opt = this.extpara;
        var total = 0;
        for (var i = 0, f; f = files[i]; i++) {
            total = total + f.size;
        }
        for (var i = 0, f; f = files[i]; i++) {
            this.startProgress(f);
            this.uploadAction.doReadandUpload(f, this.totalloaded, total);
        }
    };

    UploadPlugin.prototype.complete = function (f, loaded, total, data) {
        this.form.reset();
        if (this.options.parent != null
            && this.options.parent.complete != undefined) {
            this.options.parent.complete(f, loaded, total, data, this);
            this.options.parent.filePath(this.path);
        }
        this.totalloaded = this.totalloaded + loaded;
        if (this.totalloaded == total) {
            this.endProgress();
        }
    };

    UploadPlugin.prototype.startProgress = function (f) {
        this.totalloaded = 0;
        this.fileInput.style.display = "none";
        this.uploadTip.style.display = "none";
        this.progress.style.display = "";
        this.msgbar.style.display = "";
        this.msgbar.innerHTML = "正在上传" + f.name + "(" + Utils.formatBytes(f.size, 2) + ")";
        // Reset progress indicator on new file selection.
        this.progressBar.style.backgroundColor = "#a4ffb5";
        this.progressBar.style.width = '0%';
        this.setStatus(1, "0%");
    };

    UploadPlugin.prototype.endProgress = function () {
        this.progressBar.style.width = '100%';
        this.progressBar.innerHTML = '100%';
        this.progress.style.display = "none";
        this.msgbar.style.display = "none";
        this.msgbar.innerHTML = "";
        this.uploadTip.style.display = "";
        this.fileInput.style.display = "";
    };

    UploadPlugin.prototype.updateProgress = function (evt, percentLoaded) {
        this.progressBar.style.width = percentLoaded + '%';
        this.progressBar.innerHTML = percentLoaded + '%';
    };

    UploadPlugin.prototype.setStatus = function (s, msg) {
        if (s == 1) { // normal
            this.progress.style.border = "solid 1px #2eb82e";
            this.progressBar.style.backgroundColor = "#a4ffb5";
        } else if (s == 0) { // exception
            this.progress.style.border = "solid 1px red";
            this.progressBar.style.backgroundColor = "red";
            this.progressBar.style.width = '100%';
        }
        this.progressBar.innerHTML = msg;
    };

    UploadPlugin.prototype.errorHandler = function (evt, parent) {
        if (evt.target.error != null) {
            switch (evt.target.error.code) {
                case evt.target.error.NOT_FOUND_ERR:
                    parent.setStatus(0, "文件没找到！");
                    break;
                case evt.target.error.NOT_READABLE_ERR:
                    parent.setStatus(0, "文件不可读");
                    break;
                case evt.target.error.ABORT_ERR:
                    break; // noop
                default:
                    parent.setStatus(0, "读文件错！");
            }
        }
    };

    $.fn[pluginName] = function (options) {
        return this.each(function () {
            if (!$.data(this, pluginName)) {
                $.data(this, pluginName, new UploadPlugin(this, options));
            } else if ($.isFunction(Plugin.prototype[options])) {
                $.data(this, pluginName)[options]();
            }
        });
    };

})(jQuery, window, document);