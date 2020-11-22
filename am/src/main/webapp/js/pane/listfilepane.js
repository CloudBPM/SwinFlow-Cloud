/**
 *
 */
;
(function ($, window, document, undefined) {
    var pluginName = "listFilePane";
    var defaults = {
        id: "",
        cid: "",
        ownerId: "",
        basicpropsheet: "",
        propsheet: "",
        width: 0,
        height: 0,
        parent: "",
    };

    var ListFilePane = function (element, options) {
        this.element = element;
        this.options = $.extend({
            id: "",
            cid: "",
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
        this.basicpropsheet = options.basicpropsheet;
        this.propsheet = options.propsheet;
        this.pagesize = 30;
        this.headersize = 4;
        this.fileName = "";
        this.init(options);
        this.createToolbar(options);
    };

    ListFilePane.prototype.init = function (options) {
        var editorPanel = document.createElement("DIV");
        this.element.appendChild(editorPanel);
        editorPanel.style.margin = "0px";
        editorPanel.style.padding = "0px";
        editorPanel.style.overflow = "auto";
        editorPanel.style.width = "100%";

        this.toolbarRow = document.createElement("DIV");
        editorPanel.appendChild(this.toolbarRow);
        this.toolbarRow.className = "row";
        this.toolbarRow.style.margin = "0px";
        this.toolbarRow.style.padding = "0px";

        var painterRow = document.createElement("DIV");
        editorPanel.appendChild(painterRow);
        painterRow.className = "row";
        painterRow.style.margin = "0px";
        painterRow.style.padding = "0px";

        var tableDivPane = document.createElement("DIV");
        painterRow.appendChild(tableDivPane);
        tableDivPane.className = "col-lg-12 col-md-12 col-sm-12 col-xs-12";
        tableDivPane.id = "listFilePane" + options.cid;
        tableDivPane.className = "table-responsive";
        tableDivPane.style.margin = "0px";
        tableDivPane.style.padding = "0px";
        tableDivPane.style.border = "1px solid #ddd";
        tableDivPane.style.boxShadow = "0 1px 1px rgba(0,0,0,.05)";
        tableDivPane.style.height = (options.height - 45 - 79) + "px";
        tableDivPane.style.borderRadius = "4px";
        tableDivPane.style.overflowY = "auto";

        this.tableList = document.createElement("table");
        tableDivPane.appendChild(this.tableList);
        this.tableList.id = "filelist";
        this.tableList.className = "table table-striped table-hover";
        this.initList(options);
        this.addListHeader();

        //  confirm message dialog plugin
        var p2 = $(editorPanel).confirmInfoDialog({
            id: "005" + options.cid,
            title: "轩琦科技 - 提示",
            parent: this,
        });
        this.confirmInfoDialog = p2.data("confirmInfoDialog");
    };

//     ListFilePane.prototype.loadData = function (data) {
//         if (data != null && data != "" && data != undefined) {
//             this.fileconstants = [];
//             this.filechildren = [];
//             this.files = data;
//             for (x in data) {
//                 var file = new FileConstant();
//                 if (x != "#") {
//                     file.name = data[x].text;
//                     file.id = data[x].id;
//                     file.parent = data[x].parent;
//                     file.children = data[x].children;
//                     var str = data[x].data;
//                     var info = str.split("|");
//                     file.filetype = "File"; // 文件类型 文件夹 or 文件
//                     file.size = info[1]; // 文件大小
//                     file.lastupdate = info[2]; // 修改日期
//                     file.path = info[3]; // 文件路径
//                     file.sufix = info[4].toLowerCase(); // 文件后缀
//                     file.operation = 1; //文件操作级别
//                     this.filechildren.push(file);
// //					if (file.parent == "#") {
// //						this.fileconstants.push(file);
// //					}
//                 }
//             }
//             this.loadFiles(this.filechildren);
//         } else {
//             $(this.tableList).children().remove();
//             this.addListHeader();
//         }
//     };

    //版本2.0
    ListFilePane.prototype.loadData = function (data) {
        if (data != null && data != "" && data != undefined) {
            this.fileconstants = [];
            this.filechildren = [];
            this.files = data.data;
            for (x in data.data) {
                var file = new FileConstant();
                if (x != "#") {
                    file.name = data.data[x].text;
                    file.id = data.data[x].id;
                    file.parent = data.data[x].parent;
                    file.children = data.data[x].children;
                    var str = data.data[x].data;
                    if (str != null) {
                        var info = str.split("|");
                        if (info[0] == "File") {
                            file.filetype = info[0]; // 文件类型 文件夹 or 文件
                            file.size = info[1]; // 文件大小
                            file.lastupdate = info[2]; // 修改日期
                            file.path = info[3]; // 文件路径
                            file.sufix = info[4].toLowerCase(); // 文件后缀
                            file.operation = info[5]; // 文件操作级别
                            this.filechildren.push(file);
                        }
                        if (file.parent == "#") {
                            this.fileconstants.push(file);
                        }
                    } else {
                        messageDialog.show("您所在的组织或个人可能因封禁或其他原因,暂时无法进行本次操作");
                        return;
                    }
                }
            }
            this.loadFiles(this.fileconstants);
        } else {
            $(this.tableList).children().remove();
            this.initList();
            this.addListHeader();
        }
    };

    //版本2.0
    ListFilePane.prototype.loadFiles = function (fileconstants) {// 初始加载文件
        // this.lastDirItem.className = "disabled";
        $(this.tableList).children().remove();
        var count = 0;
        if (fileconstants != null && fileconstants.length > 0) {
            for (var i = 0; i < fileconstants[i].length; i++) {
                var currpath = fileconstants[i].path;
                this.ppath = currpath.substring(0, currpath.lastIndexOf("\\"));
                if (this.createRows(fileconstants[i])) {
                    count = count + 1;
                }
            }
            if (count < this.pagesize) {
                for (var i = count; i < this.pagesize; i++) {
                    var row = this.tableList.insertRow(i);
                    for (var j = 0; j < this.headersize; j++) {
                        this.createCell(j, "&nbsp;", row);
                    }
                }
            }
        } else {
            this.initList();
        }
        this.addListHeader();
    };

    //版本1.0
//     ListFilePane.prototype.loadFiles = function (filechildren) {// 初始加载文件
// //		this.lastDirItem.className = "disabled";
//         $(this.tableList).children().remove();
//         if (filechildren != null && filechildren.length > 0) {
//             for (var i = 0; i < filechildren.length; i++) {
//                 var currpath = this.filechildren[i].path;
//                 if (this.options.parent != null) {
//                     this.options.parent.createCells(filechildren[i]);
//                 }
//             }
//             //这里将用于封装选择文件夹后的上传路径，又后台返回过来，暂未实现
//             // this.ppath = currpath;
//         }
//         // this.initList(this.options);
//         this.addListHeader(this.options);
//     };

    ListFilePane.prototype.initList = function (options) {
        for (var i = 0; i < this.pagesize; i++) {
            var row = this.tableList.insertRow(i);
            for (var j = 0; j < this.headersize; j++) {
                var cell1 = row.insertCell(j);
                cell1.innerHTML = "&nbsp;";
            }
        }
    };

    ListFilePane.prototype.addListHeader = function () {
        var header = this.tableList.createTHead();
        var row = header.insertRow(0);
        this.createHead("名称", row);
        this.createHead("修改日期", row);
        this.createHead("大小", row);
        this.createHead("操作", row);
    };

    ListFilePane.prototype.createHead = function (content, row) {
        var th = document.createElement('th');
        th.setAttribute("nowrap", "true");
        th.innerHTML = content;
        row.appendChild(th);
    };

    ListFilePane.prototype.createCell = function (no, cellname, row) {
        var cell = row.insertCell(no);
        cell.setAttribute("nowrap", "true");
        cell.innerHTML = cellname;
        cell.addEventListener("dblclick", this, false);
        return cell;
    };

    ListFilePane.prototype.createToolbar = function (options) {
        var toolbarForm = document.createElement("form");
        toolbarForm.className = "form-inline";
        this.toolbarRow.appendChild(toolbarForm);

        var toolbarDiv = document.createElement("DIV");
        toolbarForm.appendChild(toolbarDiv);
        toolbarDiv.style.margin = "0px";
        toolbarDiv.style.padding = "2px";
        toolbarDiv.style.padding = "2px";
        this.createSearchGroup(toolbarDiv);
    };

    ListFilePane.prototype.createLabel = function (group, id, title) {
        var label = document.createElement("Label");
        label.innerHTML = title;
        label.id = id;
        group.appendChild(label);
        return label;
    };

    ListFilePane.prototype.createSearchGroup = function (parent) {
        //this.initHeader(this.options, parent);
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

    ListFilePane.prototype.createGroup = function (parent) {
        var group = document.createElement("DIV");
        group.className = "btn-group";
        group.style.padding = "2px";
        group.setAttribute("role", "group");
        group.setAttribute("aria-label", "");
        parent.appendChild(group);
        return group;
    };

    ListFilePane.prototype.crateSGroup = function (parent) {
        var group = document.createElement("DIV");
        group.className = "input-group";
        group.style.padding = "2px";
        group.setAttribute("role", "search");
        group.setAttribute("aria-label", "");
        parent.appendChild(group);
        return group;
    };

    ListFilePane.prototype.createTool = function (group, id, title, style,
                                                  fonttag, fontclass) {
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

    ListFilePane.prototype.setPropertySheet = function (obj) {
        if (obj == null && this.fileconstants != null && this.fileconstants.length > 0) {
            obj = this.fileconstants[0];
        }
        // basic property setting
        if (this.basicpropsheet != null) {
            this.basicpropsheet.tabId = this.options.id;
            this.basicpropsheet.setSheet(obj);
        }
        // advanced property setting.
        if (this.propsheet != null) {
            this.propsheet.tabId = this.options.id;
            this.propsheet.setSheet(obj);
        }
    };

    ListFilePane.prototype.handleEvent = function (e) {
        switch (e.type) {
            case "click":
                this.doClick(e);
                break;
            case "dblclick":
                this.doDblClick(e);
                break;
            case "keydown":
                this.doKeydown(e);
                break;
        }
    };

    ListFilePane.prototype.doKeydown = function (evt) {
        var e = window.event ? window.event : (evt ? evt : arguments[0]);
        var key = e.keyCode || e.which;
        if (key == 13) {// 回车键
            evt.preventDefault();// 阻止该事件
            if (this.search.value != "") {
                // search...
            }
            return false;
        }
    };

    ListFilePane.prototype.doDblClick = function (evt) {
    };

//SFTP版本
    // ListFilePane.prototype.loadFileChildren = function (data) {// 根据父文件ID查询其子文件
    // if ((data != undefined && data.indexOf("Directory") != -1)
    // 		|| cid == "#") {
    // 	$(this.tableList).children().remove();
    // 	this.ppath = data.split("|")[3];
    // 	for (var i = 0; i < this.filechildren.length; i++) {
    // 		if (this.filechildren[i].parent == cid) {
    // 			if (this.options.parent != null) {
    // 				this.options.parent.createCells(this.filechildren[i]);
    // 			}
    // 		}
    // 	}
    // 	this.addListHeader(this.options);
    // }
    // };

    //版本2.0
    ListFilePane.prototype.loadFileChildren = function (pId) {// 根据父文件ID查询其子文件
        if (this.files[pId] == undefined) {
            return;
        }
        var data = this.files[pId].data;
        if ((data != undefined
            && data.indexOf("Directory") != -1)
            || pId == "#") {
            $(this.tableList).children().remove();
            this.ppath = data.split("|")[3];
            var count = 0;
            for (var i = 0; i < this.filechildren.length; i++) {
                if (this.filechildren[i].parent == pId) {
                    if (this.createRows(this.filechildren[i])) {
                        count = count + 1;
                    }
                }
            }
            if (count < this.pagesize) {
                for (var i = count; i < this.pagesize; i++) {
                    var row = this.tableList.insertRow(i);
                    for (var j = 0; j < this.headersize; j++) {
                        this.createCell(j, "&nbsp;", row);
                    }
                }
            }
            this.addListHeader();
        }
    };

    ListFilePane.prototype.createRows = function (obj) {
        if (obj != null && obj != undefined && obj.size != -1) {
            var row = this.tableList.insertRow(-1);
            row.setAttribute("key", obj.id);
            row.addEventListener("click", this, false);
            row.addEventListener("dblclick", this, false);
            var fileIconCell = this.createCell(0, "", row);
            var iconClassName = "";
            if (obj.filetype == "File") {
                if (obj.sufix == ".doc" || obj.sufix == ".docx") {
                    iconClassName = "fa fa-file-word-o fa-lg";
                } else if (obj.sufix == ".xml" || obj.sufix == ".java"
                    || obj.sufix == ".html" || obj.sufix == ".php") {
                    iconClassName = "fa fa-file-code-o fa-lg";
                } else if (obj.sufix == ".pdf") {
                    iconClassName = "fa fa-file-pdf-o fa-lg";
                } else if (obj.sufix == ".war") {
                    iconClassName = "fa fa-file-archive-o fa-lg";
                } else if (obj.sufix == ".ppt" || obj.sufix == ".pptx") {
                    iconClassName = "fa fa-file-powerpoint-o fa-lg";
                } else if (obj.sufix == ".xls" || obj.sufix == ".xlsx") {
                    iconClassName = "fa fa-file-excel-o fa-lg";
                } else if (obj.sufix == ".mp3" || obj.sufix == ".mp4"
                    || obj.sufix == ".avi" || obj.sufix == ".rmvb"
                    || obj.sufix == ".mov" || obj.sufix == ".wmv"
                    || obj.sufix == ".flv") {
                    iconClassName = "fa fa-file-video-o fa-lg";
                } else if (obj.sufix == ".bmp" || obj.sufix == ".jpg"
                    || obj.sufix == ".png" || obj.sufix == ".jpeg"
                    || obj.sufix == ".gif") {
                    iconClassName = "fa fa-file-image-o fa-lg";
                } else {
                    iconClassName = "fa fa-file-text-o fa-lg";
                }
            } else {
                iconClassName = "fa fa-folder-open-o fa-lg";
            }
            // parent, id, classname, filename, style
            this.createLabel(fileIconCell, "fileIcon" + this.options.cid, iconClassName, obj.name);
            // obj.lastupdate format is Fri Oct 31 18:00:00 UTC+0800 2008
            this.createCell(1, Utils.getDateTime(new Date(obj.lastupdate).getTime()), row);
            this.createCell(2, obj.size == "0 byte" ? "--" : obj.size, row);
            var removeIconCell = this.createCell(3, "", row);
            if (obj.operation == 1) {// && obj.filetype == "File"
                this.createButton(removeIconCell, "trashIcon" + this.options.cid, "fa fa-trash-o fa-lg",
                    "删除", obj.name, obj.path, "刪除" + obj.name, "btn-danger");
                if (obj.filetype == "File") {
                    this.createButton(removeIconCell, "downloadIcon" + this.options.cid, "fa fa-download fa-lg",
                        "下载", obj.name, obj.path, "下载" + obj.name, "btn-primary");
                }
            }
            return true;
        }
        return false;
    };

    ListFilePane.prototype.createButton = function (parent, id, classname, filetype,
                                                    filename, path, fname, style) {
        var button = document.createElement("BUTTON");
        parent.appendChild(button);
        button.name = id;
        button.className = "btn btn-default " + style;
        button.style.borderRadius = "15px";
        button.style.width = "29px";
        button.style.padding = "3px";
        button.title = fname;
        button.setAttribute("path", path);
        button.setAttribute("filename", filename);
        var that = this;
        button.addEventListener("click", function (evt) {
            var path = this.getAttribute("path");
            var filename = this.getAttribute("filename");
            if (evt.target.name == "trashIcon" + that.options.cid) {
                that.confirmInfoDialog.show("您真的确定删除该文件么？(请谨慎操作，不可恢复)");
                that.confirmInfoDialog.yesButton.setAttribute("path", path);
            } else if (evt.target.name == "downloadIcon" + that.options.cid) {
                var url = service.downloadapi(1, that.options.ownerId, that.options.cid);
                var fd = new FormData();
                fd.append('ownerId', that.options.ownerId);
                fd.append('cid', that.options.cid);
                fd.append('path', path);
                fd.append('filename', filename);
                var xhr = new XMLHttpRequest();
                xhr.responseType = 'blob';
                xhr.open('post', url, true);
                xhr.onreadystatechange = function (e) {
                    if (xhr.readyState == 4 && xhr.status == 200) {
                        var blob = xhr.response;
                        // if (blob.type == "application/json") {
                        //     messageDialog.show("您所在的组织或个人可能因封禁等原因,暂时无法进行本次操作");
                        //     window.location.reload();
                        // }
                        var csvUrl = URL.createObjectURL(blob);
                        var link = document.createElement('a');
                        link.href = csvUrl;
                        link.download = filename;
                        link.click();
                    }
                }
                xhr.send(fd);
            }
        }, false);
        var rmspan = document.createElement("I");
        button.appendChild(rmspan);
        rmspan.className = classname;
        rmspan.name = id;
        rmspan.setAttribute("aria-hidden", "true");
        rmspan.setAttribute("data-toggle", "modal");
        rmspan.setAttribute("data-target", "myModal");
        return button;
    };

    ListFilePane.prototype.createLabel = function (parent, id, classname, filename) {
        var button = document.createElement("BUTTON");
        parent.appendChild(button);
        button.name = id;
        button.className = "btn btn-default ";
        button.style.borderRadius = "15px";
        button.style.width = "29px";
        button.style.padding = "3px";
        button.title = filename;
        var rmspan = document.createElement("I");
        button.appendChild(rmspan);
        rmspan.className = classname;
        rmspan.setAttribute("aria-hidden", "true");
        rmspan.setAttribute("data-toggle", "modal");
        rmspan.setAttribute("data-target", "myModal");
        var p = document.createElement("SPAN");
        parent.appendChild(p);
        p.innerHTML = "&nbsp;" + filename;
        return rmspan;
    };

    ListFilePane.prototype.selectRow = function (id) {
        if (this.tableList.rows.length > 1) {
            for (var i = 0; i < this.tableList.rows.length; i++) {
                if (this.tableList.rows[i].getAttribute("key") == id) {
                    this.tableList.rows[i].style.background = "#d1d1e0";
                }
            }
        }
        for (var i = 0; i < this.fileconstants.length; i++) {
            if (this.fileconstants[i].id == id) {
                this.setPropertySheet(this.fileconstants[i]);
                break;
            }
        }
    };

    ListFilePane.prototype.clearProcessSheet = function (table) {
        if (table.rows.length > 0) {
            for (var i = 0; i < table.rows.length; i++) {
                table.rows[i].style.background = "";
            }
        }
    };

    ListFilePane.prototype.complete = function (f, loaded, total, data, child) {
        this.options.parent.options.parent.filetree.refreshButton.click();//刷新树
    };

    ListFilePane.prototype.deleteFile = function (path) {
        var that = this;
        $.post(service.api(28), {
            path: path,
        }).complete(function (data) {
            that.loadFileChildren(that.fileName);
        });
    };

    ListFilePane.prototype.doClick = function (evt) {
        if (evt.target.tagName == "TD") {
            var tableBody = evt.target.parentElement.parentElement;
            this.clearProcessSheet(tableBody);
            var r = evt.target.parentElement;
            r.style.background = "#d1d1e0";
            this.selectRow(r.getAttribute("key"));
        } else if (evt.target.tagName == "BUTTON") {
            var tableBody = evt.target.parentElement.parentElement.parentElement;
            this.clearProcessSheet(tableBody);
            var r = evt.target.parentElement.parentElement;
            r.style.background = "#d1d1e0";
            this.selectRow(r.getAttribute("key"));
        } else if (evt.target.tagName == "I") {
            var tableBody = evt.target.parentElement.parentElement.parentElement.parentElement;
            this.clearProcessSheet(tableBody);
            var r = evt.target.parentElement.parentElement.parentElement;
            r.style.background = "#d1d1e0";
            this.selectRow(r.getAttribute("key"));
        } else if (evt.target.tagName == "SPAN") {
            var tableBody = evt.target.parentElement.parentElement.parentElement;
            this.clearProcessSheet(tableBody);
            var r = evt.target.parentElement.parentElement;
            r.style.background = "#d1d1e0";
            this.selectRow(r.getAttribute("key"));
        }
    };

    ListFilePane.prototype.doNoAction = function (evt) {
        Utils.stopBubble(evt);
        this.confirmInfoDialog.hide();
    };

    ListFilePane.prototype.doYesAction = function (evt) {
        var path = evt.target.attributes.path.value;
        if (path != null && path != "") {
            this.deleteFile(path);
            this.confirmInfoDialog.hide();
        }
    };

    // ListFilePane.prototype.doClick = function (evt) {
    //     if (evt.target.textContent == " 上传文件") {
    //         evt.preventDefault();
    //         if (this.fileName == undefined || this.fileName == "" || this.fileName == null) {
    //             this.options.parent.basicpropsheet.messageDialog.show("请选择要上传的目标文件夹");
    //         } else if (this.fileName.lastIndexOf(".") != -1) {
    //             this.options.parent.basicpropsheet.messageDialog.show("对不起，您选择的目标是一个文件");
    //         } else {
    //             //此处路径被写死了，如果以后有多台服务器，将导致上传不到需要的目标服务器，后期最好还是从服务器获取目录
    //             this.ppath = "/xq/xqpaas/file/org/" + this.options.ownerId + "/am/" + this.options.cid + "/" + this.fileName;
    //             this.o1.path = this.ppath;
    //             this.p.fileInput.click();
    //         }
    //     }
    // };

    $.fn[pluginName] = function (options) {
        return this.each(function () {
            if (!$.data(this, pluginName)) {
                $.data(this, pluginName, new ListFilePane(this, options));
            } else if ($.isFunction(Plugin.prototype[options])) {
                $.data(this, pluginName)[options]();
            }
        });
    };

})(jQuery, window, document);
