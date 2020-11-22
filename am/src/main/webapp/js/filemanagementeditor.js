/**
 *
 */
;
(function ($, window, document, undefined) {
    var pluginName = "amFileManagementEditor";
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

    var Editor = function (element, options) {
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
        this.stack = options.parent.stack;
        this.basicpropsheet = options.basicpropsheet;
        this.propsheet = options.propsheet;
        this.init(options);
    };

    Editor.prototype.init = function (options) {
        var editorPanel = document.createElement("DIV");
        this.element.appendChild(editorPanel);
        editorPanel.id = "fileManagePanel" + options.cid;
        editorPanel.style.width = options.width + "px";
        editorPanel.style.margin = "0px";
        editorPanel.style.marginTop = "4px";
        editorPanel.style.padding = "0px";
        editorPanel.style.overflow = "auto";

        var painterRow = document.createElement("DIV");
        editorPanel.appendChild(painterRow);
        painterRow.className = "row";
        painterRow.style.margin = "0px";
        painterRow.style.padding = "0px";

        var treeviewPanel = document.createElement("DIV");
        painterRow.appendChild(treeviewPanel);
        treeviewPanel.className = "col-lg-3 col-md-3 col-sm-3 col-xs-3";
        treeviewPanel.id = "filetreePane" + options.cid;
        treeviewPanel.style.margin = "0px";
        treeviewPanel.style.padding = "0px";
        treeviewPanel.style.paddingRight = "10px";
        treeviewPanel.style.height = (options.height) + "px";
        this.initLeftTree(treeviewPanel, options); // 初始化树

        var fileListPanel = document.createElement("DIV");
        painterRow.appendChild(fileListPanel);
        fileListPanel.className = "col-lg-9 col-md-9 col-sm-9 col-xs-9";
        fileListPanel.style.margin = "0px";
        fileListPanel.style.padding = "0px";
        this.initRightContent(fileListPanel, options);
    };

    Editor.prototype.initLeftTree = function (parent, options) {
        if ($(parent).treeViewer != undefined) {// treeViewer is a tree view plugin
            var p = $(parent).treeViewer({
                title: "服务器文件",
                topparent: this.element,
                parent: this,
            });
            this.filetree = p.data("treeViewer");
        }
        //this.treeViewer.element.lastChild.id = "lc" + options.cid;
        //this.treeViewer.element.lastChild.style.height = (options.height) + "px";
        this.filetree.treeviewer.style.height = (options.height - 45) + "px";
    };

    Editor.prototype.initRightContent = function (parent, options) {
        if ($(parent).fileManagementContentPane != undefined) {
            var p = $(parent).fileManagementContentPane({
                id: options.id,
                basicpropsheet: options.basicpropsheet,
                propsheet: options.propsheet,
                ownerId: options.ownerId,
                cid: options.cid,
                width: options.width,
                height: options.height,
                parent: this,
            });
            this.filemanagecontent = p.data("fileManagementContentPane");
        }
    };

    Editor.prototype.loadTreeViewer = function (parent) {
        parent.id = "serviceTreeViewer" + this.options.cid;
        var that = this;
        var instance = $(parent).jstree({
            "core": {
                // so that create works
                "multiple": false,
                // "themes": {"dots": false},
                "check_callback": true,
                "data": {
                    "url": service.api(28) + "&oid=" + that.options.ownerId + "&cid=" + that.options.cid,
                    "dataType": "json",
                    // needed only if you do not supply JSON headers
                }
            },
            "plugins": ["contextmenu", "dnd"],
            "contextmenu": {
                "items": {
                    "create": {
                        "label": "打开",
                        "action": function (obj) {
                            that.openEditor();
                        },
                    },
                }
            }
        }).on('create_node.jstree', function (e, data) {
        }).on('load_node.jstree', function (e, data) {
            that.filemanagecontent.setData(e, data.instance._model);
        }).on("select_node.jstree", function (e, data) {
            //SFTP版本
            // that.filemanagecontent.loadFileChildrenData(data.node.text);
        }).on("click.jstree", function (e) {
            var pid = e.target.id;
            this.path = that.getPath();
            pid = pid.substring(0, pid.lastIndexOf("_anchor"));
            that.filemanagecontent.loadFileChildrenData(pid, this.path);
        }).on("dblclick.jstree", this.dblclickJSTree);
    };

    Editor.prototype.loadTreeData = function (data) {
        console.log(data.instance._model);
    };
    //
    // Editor.prototype.filterTreeData = function (d) {
    //     console.log(d);
    //     // for (var i=0;i<d.length;i++) {
    //     //
    //     // }
    //     return d;
    // };

    Editor.prototype.getPath = function () {
        var instance = $('#serviceTreeViewer' + this.options.cid).jstree();
        var p = instance.get_selected(true)[0];
        if (p != null && p.parents != undefined) {
            var str = p.parents;
            var path = "";
            for (var i = str.length - 2; i >= 0; i--) {
                var array = str[i].split("|");
                var s = array[1] + "/";
                path = path + s;
            }
            var text = p.text;
            path = path + text;
            return path;
        }
        return "";
    };

    // Editor.prototype.setPropertySheet = function (obj) {
    //     if (obj == null && this.groups != null && this.groups.length > 0) {
    //         obj = this.groups[0];
    //     }
    //     // basic property setting
    //     if (this.basicpropsheet != null) {
    //         this.basicpropsheet.tabId = this.options.id;
    //         this.basicpropsheet.setSheet(obj);
    //     }
    //     // advanced property setting.
    //     if (this.propsheet != null) {
    //         this.propsheet.tabId = this.options.id;
    //         this.propsheet.setSheet(obj);
    //     }
    // };

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