/**
 *
 */
;
(function ($, window, document, undefined) {
    var pluginName = "omFileManagementEditor";
    var defaults = {
        id: "",
        ownerId: "",
        basicpropsheet: "",
        propsheet: "",
        width: 0,
        height: 0,
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
            parent: "",
        }, defaults, options);
        this._defaults = defaults;
        this._name = pluginName;
        this.stack = new CommandStack();
        this.currFolder = "/"; // by default, the current folder is root folder
        this.delfileid = null;
        this.init(options);
        this.createToolbar(options);
    };

    Editor.prototype.init = function (options) {
        var editorPanel = document.createElement("DIV");
        this.element.appendChild(editorPanel);
        editorPanel.style.margin = "0px";
        editorPanel.style.padding = "0px";
        editorPanel.style.overflow = "auto";

        this.toolbarRow = document.createElement("DIV");
        editorPanel.appendChild(this.toolbarRow);
        this.toolbarRow.className = "row";
        this.toolbarRow.style.margin = "0px";
        this.toolbarRow.style.padding = "0px";

        var uoloadRow = document.createElement("DIV");
        editorPanel.appendChild(uoloadRow);
        uoloadRow.className = "row";
        uoloadRow.style.margin = "0px";
        uoloadRow.style.padding = "0px";

        var uploadFileDivPane = document.createElement("DIV");
        uoloadRow.appendChild(uploadFileDivPane);
        uploadFileDivPane.className = "col-lg-12 col-md-12 col-sm-12 col-xs-12";
        uploadFileDivPane.style.margin = "0px";
        uploadFileDivPane.style.padding = "0px";
        uploadFileDivPane.style.height = "84px";

        if ($(uploadFileDivPane).fmUploadFilesPlugin != undefined) {
            var pp = $(uploadFileDivPane).fmUploadFilesPlugin({
                id : "upload0167A" + options.id, // plugin id
                url : service.uploadapi(6, options.ownerId, ""),
                extpara : this.extpara, // extra parameters for uploading
                actnow : "1", // if 1, dochange method will work
                filer : "*.*", // image.* or image/gif, image/jpeg
                multiple : "1", // if 1, input will can select multiple files
                parent : this, // parent plugin
                ownerId : options.ownerId,
                height : 80,
            });
            this.upld = pp.data("fmUploadFilesPlugin");
        }

        var o1 = new Object();
        o1.ownerId = this.options.ownerId;
        o1.targetpath = this.currFolder;
        this.upld.extpara = o1;

        var painterRow = document.createElement("DIV");
        editorPanel.appendChild(painterRow);
        painterRow.className = "row";
        painterRow.style.margin = "0px";
        painterRow.style.padding = "0px";

        var tableDivPane = document.createElement("DIV");
        painterRow.appendChild(tableDivPane);
        tableDivPane.className = "col-lg-12 col-md-12 col-sm-12 col-xs-12 table-responsive";
        tableDivPane.id = "filemanagepane" + options.id;
        tableDivPane.style.margin = "0px";
        tableDivPane.style.padding = "0px";
        tableDivPane.style.border = "1px solid #ddd";
        if (options.height != undefined && options.height > 168) {
            tableDivPane.style.height = (options.height - 168) + "px";
        }
        tableDivPane.style.borderRadius = "4px";
        tableDivPane.style.overflowY = "auto";

        this.tableList = document.createElement("table");
        tableDivPane.appendChild(this.tableList);
        this.tableList.className = "table table-striped table-hover";
        this.loadingCurrentFolderContent(options);

        // confirm message dialog plugin
        if ($(this.element).confirmInfoDialog != undefined) {
            var p2 = $(this.element).confirmInfoDialog({ // 确认对话框
                id: "00568A" + options.id,
                title: vendor + " - 提示",
                parent: this,
            });
            this.confirmInfoDialog = p2.data("confirmInfoDialog");
        }

        if ($(this.element).fodlerNameEditDialog != undefined) {
            var p2 = $(this.element).fodlerNameEditDialog({ // 确认对话框
                id: "00569A" + options.id,
                title: vendor + " - 编辑名称",
                parent: this,
            });
            this.fodlerNameEditDialog = p2.data("fodlerNameEditDialog");
        }
    };

    Editor.prototype.getDirty = function() {
        return this.stack.isDirty();
    };

    Editor.prototype.createToolbar = function (options) {
        var toolbarForm = document.createElement("form");
        toolbarForm.className = "form-inline";
        this.toolbarRow.appendChild(toolbarForm);

        var toolbarDiv = document.createElement("DIV");
        toolbarForm.appendChild(toolbarDiv);
        toolbarDiv.style.margin = "0px";
        toolbarDiv.style.padding = "2px";
        toolbarDiv.style.padding = "2px";

        var c = "btn btn-default";
        var c1 = "btn btn-dangerous";
        var c2 = "btn btn-primary";
        var c3 = "btn btn-success";
        var c4 = "btn btn-info";

        var group = this.createGroup(toolbarDiv);
        this.undobutton = this.createTool(group, "undoG" + options.id,
            "返回", "btn btn-default", "i", "fa fa-reply fa-lg");
        // fa-lg: 24px; fa-2x ：32px
        this.redobutton = this.createTool(group, "redoG" + options.id,
            "前进", "btn btn-default", "i", "fa fa fa-share fa-lg");
        this.stack.undoButton = this.undobutton;
        this.stack.redoButton = this.redobutton;
        this.undobutton.style.display = "none";
        this.redobutton.style.display = "none";
        //this.disableButton(this.undobutton);
        //this.disableButton(this.redobutton);

        var group1 = this.createGroup(toolbarDiv);
        this.refreshHButton = this.createTool(group1, "refreshS" + options.id, "刷新",
            c3, "i", "fa fa-refresh fa-lg");

        var group2 = this.createGroup(toolbarDiv);
        this.upbutton = this.createTool(group2, "up" + options.id, "下级文件夹",
            c2, "i", "fa fa-arrow-up fa-lg");
        this.downbutton = this.createTool(group2, "down" + options.id, "上级文件夹",
            c2, "i", "fa fa-arrow-down fa-lg");
        this.disableButton(this.upbutton);
        this.disableButton(this.downbutton);

        var group3 = this.createGroup(toolbarDiv);
        this.homebutton = this.createTool(group3, "home" + options.id, "主目录",
            c4, "i", "fa fa-home fa-lg");

        var group4 = this.createGroup(toolbarDiv);
        this.createHButton = this.createTool(group4, "createmyfolder" + options.id, "创建新文件夹",
            c3, "i", "fa fa-plus fa-lg");

        this.createSearchGroup(toolbarDiv);

        var group5 = this.createGroup(toolbarDiv);
        this.pathlabel = this.createLabel(group5, "path" + options.id, "");
        //this.pathlabel.value = this.currFolder;
        this.updateCurrentFolder("/");
    };

    Editor.prototype.createSearchGroup = function (parent) {
        var group = this.crateSGroup(parent);
        this.search = document.createElement("input");
        this.search.type = "text";
        this.search.className = "form-control";
        this.search.setAttribute("placeholder", "搜索...");
        this.search.addEventListener('keydown', this, false);// 为回车键加监听事件
        group.appendChild(this.search);

        var searchSpan = document.createElement("span");
        searchSpan.className = "input-group-btn";
        group.appendChild(searchSpan);

        this.searchBtn = this.createTool(searchSpan, "searchS"
            + this.options.id, "查找", "btn btn-primary", "i",
            "fa fa-search fa-lg");
    };

    Editor.prototype.refresh = function () {
        this.loadingCurrentFolderContent(this.options);
    };

    Editor.prototype.complete = function () {
        this.loadingCurrentFolderContent(this.options);
    };

    Editor.prototype.loadingCurrentFolderContent = function (options) {
        $("progressbar").show();
        var that = this;
        $.getJSON(service.downloadapi(0, options.ownerId, ""), {
            oid: options.ownerId,
            dir: this.currFolder, // current folder;
        }).complete(function (data) {
            var data = JSON.parse(data.responseText);
            that.loadData(data, options);
            if (that.currFolder == "/") { // that means this is root folder
                that.disableButton(that.upbutton);
                that.enableButton(that.downbutton);
            } else {
                that.enableButton(that.upbutton);
                that.enableButton(that.downbutton);
            }
            that.pathlabel.value = that.currFolder;
            $("#progressbar").hide();
        });
    };

    Editor.prototype.loadingParentFodlerContent = function (options) {
        $("progressbar").show();
        var that = this;
        $.getJSON(service.downloadapi(1, options.ownerId, ""), {
            oid: options.ownerId,
            dir: this.currFolder, // current folder;
        }).complete(function (data) {
            var data = JSON.parse(data.responseText);
            that.loadData(data, options);
            var parentPath = that.currFolder.substr(0, that.currFolder.lastIndexOf("/"));
            if (parentPath == "") { // that means this is root folder
                parentPath = "/";
                that.disableButton(that.upbutton);
                that.enableButton(that.downbutton);
            } else { //
                that.enableButton(that.upbutton);
                that.disableButton(that.downbutton);
            }
            that.updateCurrentFolder(parentPath);
            $("#progressbar").hide();
        });
    };

    Editor.prototype.loadData = function (data, options) {
        this.objects = [];
        $(this.tableList).children().remove();
        var objs = data;
        if (objs != null && objs.length > 0) {
            if (objs != null && objs.length > 0) {
                for (var i = 0; i < objs.length; i++) {
                    var fc = new FileConstant();
                    //fc.parseObject(objs[i]);
                    this.objects.push(objs[i]);
                    var row = this.tableList.insertRow(-1);
                    row.setAttribute("key", objs[i].id);
                    row.setAttribute("fname", objs[i].name);
                    row.addEventListener("click", this, false);
                    row.addEventListener("dblclick", this, false);
                    var iconcell = this.createCell(0, "", row);
                    var icon = document.createElement("span");
                    var badge = document.createElement("span");
                    if (objs[i].isDirctory == 0) {
                        row.setAttribute("ftype", "file");
                        icon = this.getIcon(objs[i].filetype, objs[i].size);
                    } else {
                        row.setAttribute("ftype", "folder");
                        icon.style.color = "#21329F";
                        if (objs[i].fileCount == 0) {
                            icon.className = "fa fa-folder-o fa-lg";
                        } else {
                            icon.className = "fa fa-folder fa-lg";
                        }
                        badge.className = "badge";
                        badge.style.backgroundColor = "#3395ff";
                        if (objs[i].fileCount > 0) {
                            badge.innerHTML = objs[i].fileCount;
                        }
                        icon.title = "文件夹";
                    }
                    iconcell.appendChild(icon);
                    iconcell.appendChild(document.createTextNode(" "));
                    iconcell.appendChild(badge);
                    this.createCell(1, Utils.parse(objs[i].name), row);
                    if (objs[i].isDirctory == 0) {
                        this.createCell(2, Utils.formatBytes(objs[i].size), row);
                    } else {
                        this.createCell(2, "", row);
                    }
                    this.createCell(3, Utils.parseDateTime(objs[i].lastupdate), row);
                    if (objs[i].isDirctory == 0) {
                        this.createCell(4, objs[i].filetype + "文件", row);
                    } else {
                        this.createCell(4, "文件夹", row);
                    }
                    var cell = this.createCell(5, "", row);
                    if (objs[i].name != "adm" && objs[i].name != "am" &&
                        objs[i].name != "bdm" && objs[i].name != "blm" &&
                        objs[i].name != "om" && objs[i].name != "pm" &&
                        objs[i].name != "clt" && objs[i].name != "fm" &&
                        objs[i].name != "rlf" && objs[i].name != "rlp" &&
                        objs[i].name != "rt" && objs[i].name != "svm" &&
                        objs[i].name != "news" && objs[i].name != "android_app_plugin" &&
                        objs[i].name != "emltp" && objs[i].name != "idcard" &&
                        objs[i].name != "license" && objs[i].name != "usr") {
                        var b5 = this.createIcon(cell, objs[i].id, "8", "fa fa-pencil-square-o fa-lg",
                            "rename", "重命名", "btn-primary");
                        var b4 = this.createIcon(cell, objs[i].id, "7", "fa fa-trash-o fa-lg",
                            "delete", "删除", "btn-danger");
                    }
                    if (objs[i].isDirctory == 0) {
                        var b3 = this.createIcon(cell, objs[i].id, "6",
                            "fa fa-download fa-lg", "download", "下载", "");
                    }

                }
                if (objs.length < 30) {
                    for (var i = objs.length; i < 30; i++) {
                        var row = this.tableList.insertRow(i);
                        for (var j = 0; j < 6; j++) {
                            this.createCell(j, "&nbsp;", row);
                        }
                    }
                }
            } else {
                this.initList(this.options);
            }
        } else {
            this.initList(this.options);
        }
        this.addListHeader(this.options);
        if (this.objects.length > 0) {
            var f = false;
            if (objs != null && objs.length > 0) {
                for (var i = 0; i < objs.length; i++) {
                    if (objs[i] != null && objs[i].id == this.selectIndex) {
                        f = true;
                        break;
                    }
                }
            }
            if (f) {
                this.selectRow(this.selectIndex);
            } else {
                this.selectIndex = -1;
                this.selectRow(this.objects[0].id);
            }
        } else {
            this.selectIndex = -1;
        }

    };

    /**
     * 未来我们的图标要能支持所有的文件类。
     * 需要美工为现在已经支持的文件类型设计文字图标
     *
     * @author 曹大海，2019-02-21 09:37
     * @param filetype
     * @param size
     * @returns {HTMLElement}
     */
    Editor.prototype.getIcon = function (filetype, size) {
        var icon = document.createElement("span");
        icon.style.color = "#A95C1F";
        icon.setAttribute("aria-hidden", "true");
        if (filetype == "txt") {
            if (size > 0) {
                icon.className = "fa fa-file-text fa-lg";
            } else {
                icon.className = "fa fa-file-text-o fa-lg";
            }
            icon.title = "文本文件";
        } else if (filetype == "js" || filetype == "java" ||
            filetype == "c" || filetype == "php" ||
            filetype == "css" || filetype == "py" ||
            filetype == "rjs" || filetype == "erb" ||
            filetype == "properties" || filetype == "rb" ||
            filetype == "rbw" || filetype == "xml" ||
            filetype == "xmls" || filetype == "log" ||
            filetype == "cpp" || filetype == "html" ||
            filetype == "htm" || filetype == "shtml" ||
            filetype == "html" || filetype == "conf" ||
            filetype == "jsp" || filetype == "asp" ||
            filetype == "aspx" || filetype == "cs" ||
            filetype == "sh" || filetype == "bat" ||
            filetype == "ini") {
            icon.style.color = "#000";
            icon.className = "fa fa-file-code-o fa-lg";
            icon.title = "软件程序源文件";
        } else if (filetype == "zip" || filetype == "rar" ||
            filetype == "tar" || filetype == "gz" ||
            filetype == "7z") {
            icon.style.color = "#a94715";
            icon.className = "fa fa-file-archive-o fa-lg";
            icon.title = "数据压缩文件";
        } else if (filetype == "pdf") {
            icon.style.color = "#ff3622";
            icon.className = "fa fa-file-pdf-o fa-lg";
            icon.title = "PDF文件";
        } else if (filetype == "doc" || filetype == "docx" ||
            filetype == "wps" || filetype == "docm" ||
            filetype == "dotx" || filetype == "dotx" ||
            filetype == "wpt" || filetype == "dot" ||
            filetype == "rtf") {
            icon.style.color = "#1d81ff";
            icon.className = "fa fa-file-word-o fa-lg";
            icon.title = "文档文件";
        } else if (filetype == "ppt" || filetype == "pptx" ||
            filetype == "dps" || filetype == "dpt" ||
            filetype == "pps" || filetype == "pot" ||
            filetype == "ppsx" || filetype == "potx" ||
            filetype == "ppsm" || filetype == "potm" ||
            filetype == "pptm" || filetype == "ppa" ||
            filetype == "ppam") {
            icon.style.color = "#ff7423";
            icon.className = "fa fa-file-powerpoint-o fa-lg";
            icon.title = "演示文件";
        } else if (filetype == "xls" || filetype == "xlsx" ||
            filetype == "et" || filetype == "ett" ||
            filetype == "xlt" || filetype == "xlsm" ||
            filetype == "xltm" || filetype == "xlsb" ||
            filetype == "csv" || filetype == "dif") {
            icon.style.color = "#369018";
            icon.className = "fa fa-file-excel-o fa-lg";
            icon.title = "电子表格文件";
        } else if (filetype == "jpg" || filetype == "png" ||
            filetype == "bmp" || filetype == "dib" ||
            filetype == "jpeg" || filetype == "jpe" ||
            filetype == "tif" || filetype == "tiff" ||
            filetype == "ico" || filetype == "heic" ||
            filetype == "webp" || filetype == "psd" ||
            filetype == "ai" || filetype == "pdd" ||
            filetype == "crw" || filetype == "eps"  ||
            filetype == "jfif") {
            icon.style.color = "#d63492";
            icon.className = "fa fa-file-image-o fa-lg";
            icon.title = "图片文件";
        } else if (filetype == "avi" || filetype == "qt" ||
            filetype == "wmv" || filetype == "rm" ||
            filetype == "rmvb" || filetype == "asf" ||
            filetype == "asf" || filetype == "m2v" ||
            filetype == "mpv" || filetype == "mpv" ||
            filetype == "flv" || filetype == "f4v" ||
            filetype == "f4p" || filetype == "f4a" ||
            filetype == "f4b" || filetype == "swf" ||
            filetype == "ogv" || filetype == "mv4" ||
            filetype == "3mm" || filetype == "gif") {
            icon.style.color = "#d63492";
            icon.className = "fa fa-file-video-o fa-lg";
            icon.title = "视频文件";
        } else if (filetype == "dvf" || filetype == "mmf" ||
            filetype == "mp3" || filetype == "mpc" ||
            filetype == "msv" || filetype == "wav" ||
            filetype == "wma" || filetype == "wv" ||
            filetype == "webm" || filetype == "rm" ||
            filetype == "ra" || filetype == "ra" ||
            filetype == "vob") {
            icon.style.color = "#d63492";
            icon.className = "fa fa-file-audio-o fa-lg";
            icon.title = "音频文件";
        } else if (filetype == "mov" || filetype == "mp4" ||
            filetype == "m4p" || filetype == "m4v" ||
            filetype == "mpg" || filetype == "mpeg" ||
            filetype == "mp2" || filetype == "mpe" ||
            filetype == "mod" || filetype == "pmf" ||
            filetype == "wtv" || filetype == "vivo") {
            icon.style.color = "#d63492";
            icon.className = "fa fa-film fa-lg";
            icon.title = "影音文件";
        } else {
            if (size > 0) {
                icon.className = "fa fa-file fa-lg";
            } else {
                icon.className = "fa fa-file-o fa-lg";
            }
            icon.title = "文件";
        }
        return icon;
    };

    Editor.prototype.initList = function (options) {
        for (var i = 0; i < 30; i++) {
            var row = this.tableList.insertRow(i);
            for (var j = 0; j < 6; j++) {
                var cell1 = row.insertCell(j);
                cell1.innerHTML = "&nbsp;";
            }
        }
    };

    Editor.prototype.addListHeader = function (options) {
        var header = this.tableList.createTHead();
        var row = header.insertRow(0);
        this.createHead("", row);
        this.createHead("文件名", row);
        this.createHead("大小", row);
        this.createHead("最后更新", row);
        this.createHead("类型", row);
        this.createHead("操作", row);
    };

    Editor.prototype.createHead = function (content, row) {
        var th = document.createElement('th');
        th.setAttribute("nowrap", "true");
        th.innerHTML = content;
        row.appendChild(th);
    };

    Editor.prototype.createCell = function (no, cellname, row) {
        var cell = row.insertCell(no);
        cell.setAttribute("nowrap", "true");
        if (cellname != null && cellname != "") {
            cell.innerHTML = cellname;
        }
        return cell;
    };

    Editor.prototype.createIcon = function (parent, id, num,
                                            classname, name,
                                            title, style) {
        var button = document.createElement("BUTTON");
        parent.appendChild(button);
        button.id = id;
        button.name = name;
        button.className = "btn btn-default " + style;
        button.title = title;
        button.style.borderRadius = "15px";
        button.style.width = "29px";
        button.style.padding = "3px";
        var that = this;
        button.addEventListener("click", function (evt) {
            that.delfileid = id;
            if (this.name == "rename") {
                that.fodlerNameEditDialog.show(id);
            } else if (this.name == "download") {
                that.upld.downloadFile(that.options.ownerId, that.currFolder, that.delfileid);
            } else if (this.name == "delete") {
                that.confirmInfoDialog.show("您确定删除该文件吗？（请谨慎操作，不可恢复）");
            }
            Utils.stopBubble(evt);
        });
        var rmspan = document.createElement("SPAN");
        button.appendChild(rmspan);
        rmspan.className = classname;
        rmspan.name = name;
        rmspan.setAttribute("aria-hidden", "true");
        rmspan.setAttribute("data-toggle", "modal");
        rmspan.setAttribute("data-target", "myModal");
        rmspan.title = title;
        rmspan.id = id + "i";
        return button;
    };

    Editor.prototype.doNoAction = function (evt) {
        Utils.stopBubble(evt);
        this.confirmInfoDialog.hide();
    };

    Editor.prototype.doYesAction = function (evt) { // 确认删除文件
        Utils.stopBubble(evt);
        $("progressbar").show();
        this.confirmInfoDialog.hide();
        var that = this;
        $.post(service.uploadapi("7", this.options.ownerId, ""), {
            ownerId: this.options.ownerId, // organization id
            path: this.currFolder, // the current folder
            fname: this.delfileid,// file name to remove
        }).complete(function (data) {
            that.refresh();
            $("progressbar").hide();
        });
    };

    // create new folder
    Editor.prototype.doCreateFolderAction = function (name) {
        $("progressbar").show();
        this.confirmInfoDialog.hide();
        var that = this;
        $.post(service.uploadapi("8", this.options.ownerId, ""), {
            ownerId: this.options.ownerId, // organization id
            path: this.currFolder, // the current folder
            foldername: name,// file name to create
        }).complete(function (data) {
            that.refresh();
            $("progressbar").hide();
        });
    };

    // rename one file name or folder name
    Editor.prototype.doRenameFolderAction = function (oldname, newname) {
        $("progressbar").show();
        this.confirmInfoDialog.hide();
        var that = this;
        $.post(service.uploadapi("9", this.options.ownerId, ""), {
            ownerId: this.options.ownerId, // organization id
            path: this.currFolder, // the current folder
            oldname: oldname,// oldname
            newname: newname,// newname
        }).complete(function (data) {
            that.refresh();
            $("progressbar").hide();
        });
    };

    Editor.prototype.selectRow = function (id) {
        if (this.tableList.rows.length > 1) {
            for (var i = 0; i < this.tableList.rows.length; i++) {
                if (this.tableList.rows[i].getAttribute("key") == id) {
                    this.tableList.rows[i].style.background = "#d1d1e0";
                    this.selectIndex = id;
                    break;
                }
            }
        }
        for (var i = 0; i < this.objects.length; i++) {
            if (this.objects[i].id == id) {
                this.setPropertySheet(this.objects[i]);
                break;
            }
        }
    };

    Editor.prototype.handleEvent = function (e) {
        switch (e.type) {
            case "dblclick":
                this.doDblClick(e);
                break;
            case "click":
                this.doClick(e);
                break;
            case "keydown":
                this.doKeydown(e);
                break;
        }
    };

    Editor.prototype.doKeydown = function (evt) {
        var t = evt.target;
        if (t == this.search) {
            var e = window.event ? window.event : (evt ? evt : arguments[0]);
            var key = e.keyCode || e.which;
            if (key == 13) {// 回车键
                evt.preventDefault();// 阻止该事件
                return false;
            }
        } else if (t == this.pathlabel) {
            var e = window.event ? window.event : (evt ? evt : arguments[0]);
            var key = e.keyCode || e.which;
            if (key == 13) {// 回车键
                evt.preventDefault();// 阻止该事件
                if (this.pathlabel.value != "") {
                    var path = this.pathlabel.value;
                    // 这里有个bug，由于时间紧迫，留待后人解决。
                    // 这里需要一个路径解析器，对不合法的路径要提示。
                    // 要是path is '/ddd//////'就会出现问题了。
                    if (path.endsWith("/") || path.endsWith("\\")) {
                        path = path.substr(0, path.length - 1);
                    }
                    if (path.startsWith("\\")) {
                        path = path.substr(1, path.length);
                    }
                    if (!path.startsWith("/")) {
                        path = "/" + path;
                    }
                    this.updateCurrentFolder(path);
                    this.refresh();
                }
                return false;
            }
        }
    };

    Editor.prototype.doClick = function (evt) {
        if (evt.target.tagName == "TD") {
            var tbody = evt.target.parentElement.parentElement;
            this.clearProcessSheet(tbody);
            evt.target.parentElement.style.background = "#d1d1e0";
            var r = evt.target.parentElement;
            this.selectRow(r.getAttribute("key"));
            Utils.stopBubble(evt);
        } else {
            if (evt.target == this.upbutton
                || evt.target.id == "up" + this.options.id) {
                this.loadingParentFodlerContent(this.options);
            } else if (evt.target == this.downbutton
                || evt.target.id == "down" + this.options.id) {
                for (var i = 0; i < this.objects.length; i++) {
                    if (this.objects[i].id == this.selectIndex && this.objects[i].size == 0) {
                        this.updateCurrFolder(this.selectIndex);
                        this.refresh();
                        break;
                    }
                }
            } else if (evt.target == this.homebutton
                || evt.target.id == "home" + this.options.id) {
                this.updateCurrentFolder("/");
                this.refresh();
            } else if (evt.target == this.createHButton
                || evt.target.id == "createmyfolder" + this.options.id) {
                this.fodlerNameEditDialog.show("");
            }
        }
    };

    Editor.prototype.doDblClick = function (evt) {
        if (evt.target.tagName == "TD") {
            this.tableList.focus();
            var tr = evt.target.parentElement;
            if (tr.tagName == "TR") {
                var r = tr.getAttribute("ftype");
                if (r == "folder") {
                    this.updateCurrFolder(tr.getAttribute("fname"));
                    this.refresh();
                } else if (r == "file") {
                    // downloading...
                }
            }
        }
    };

    Editor.prototype.updateCurrentFolder = function (path) {
        this.currFolder = path;
        var o1 = new Object();
        o1.ownerId = this.options.ownerId;
        o1.targetpath = this.currFolder;
        this.upld.extpara = o1;
        this.pathlabel.value = this.currFolder;
    };

    Editor.prototype.updateCurrFolder = function (path) {
        if (this.currFolder == "/") {
            this.currFolder = this.currFolder + path;
        } else {
            this.currFolder = this.currFolder + "/" + path;
        }
        var o1 = new Object();
        o1.ownerId = this.options.ownerId;
        o1.targetpath = this.currFolder;
        this.upld.extpara = o1;
        this.pathlabel.value = this.currFolder;
    };

    Editor.prototype.clearProcessSheet = function (table) {
        if (table.rows.length > 0) {
            for (var i = 0; i < table.rows.length; i++) {
                table.rows[i].style.background = "";
            }
            this.selectIndex = -1;
        }
    };

    Editor.prototype.crateSGroup = function (parent) {
        var group = document.createElement("DIV");
        group.className = "input-group";
        group.style.padding = "2px";
        group.setAttribute("role", "search");
        group.setAttribute("aria-label", "");
        parent.appendChild(group);
        return group;
    };

    Editor.prototype.createLabel = function (group, id) {
        var input = document.createElement("input");
        input.type = "text";
        input.className = "form-control";
        input.setAttribute("placeholder", "folder path");
        input.addEventListener('keydown', this, false);// 为回车键加监听事件
        group.appendChild(input);
        return input;
    };

    Editor.prototype.createGroup = function (parent) {
        var group = document.createElement("DIV");
        group.className = "btn-group";
        group.style.padding = "2px";
        group.setAttribute("role", "group");
        group.setAttribute("aria-label", "");
        parent.appendChild(group);
        return group;
    };

    Editor.prototype.createTool = function (group, id, title, style, fonttag,
                                            fontclass) {
        var button = document.createElement("button");
        button.className = style;
        button.setAttribute("title", title);
        button.type = "button";
        button.id = id;
        button.addEventListener('click', this, false);
        group.appendChild(button);
        var icon = document.createElement(fonttag);
        icon.className = fontclass;
        icon.setAttribute("title", title);
        icon.id = id;
        button.appendChild(icon);
        return button;
    };

    Editor.prototype.enableButton = function (button) {
        button.removeAttribute("disabled");
    };

    Editor.prototype.disableButton = function (button) {
        button.setAttribute("disabled", "true");
    };

    Editor.prototype.setPropertySheet = function (obj) {
        if (this.options.basicpropsheet != undefined) {

        }
        if (this.options.propsheet != undefined) {

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
