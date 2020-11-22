;
(function ($, window, document, undefined) {
    var pluginName = "uploadFileEditor";
    var defaults = {
        id: "",
        userId: "",
        userfullname: "",
        ownername: "",
    };

    var Editor = function (element, options) {
        this.element = element;
        this.options = $.extend({
            id: "",
            userId: "",
            userfullname: "",
            ownername: "",
        }, defaults, options);
        this._defaults = defaults;
        this._name = pluginName;
        this.stack = new CommandStack();
        this.url = "";
    };

    Editor.prototype.doUpload = function (fileArray, data,type,parent) {
        var formdata = new FormData();
        var file = null;
        var fname = new Array();
        var flen = new Array()
        for (var i = 0; i < fileArray.length; i++) {//添加每个file文件
            var currentFile = fileArray[i].files;
            file = currentFile[0];
            formdata.append("file"+i, file);
            fname.push(file.name);
            flen.push(file.size);
        }
        formdata.append("fname",fname.toString());
        formdata.append("flen",flen.toString());
        formdata.append("data",data); //添加表单数据；
        formdata.append("type",type);
        var xhr = new XMLHttpRequest();
        xhr.open('post', this.url, true);
        xhr.onerror = function (e) {
            this.options.parent.uploadError();
            return;
        }

        xhr.onprogress = function (e) {
            if (e.lengthComputable) {
                var percentage = (e.loaded / e.total) * 100;
            }
        };

        xhr.onload = function () {
            if (xhr.status == 200) {
                parent.uploadSuccess();
            } else {
                parent.uploadFial();
            }
        };
        xhr.send(formdata);
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
