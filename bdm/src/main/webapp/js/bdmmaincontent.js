/**
 *
 */
var map = {};
;
(function ($, window, document, undefined) {
    var pluginName = "mainContent";
    var defaults = {
        id: "",
        uid: "",
        uname: "",
    };

    var MainContent = function (element, options) {
        this.element = element;
        this.options = $.extend({
            id: "",
            uid: "",
            uname: "",
        }, defaults, options);
        this._defaults = defaults;
        this._name = pluginName;
        this.basicpropertySheets = null; // basic property setter;
        this.propertySheets = null; // advanced property setter;

        this.init(options);
        this.menubar = null;
    };

    MainContent.prototype.init = function (options) {
        if ($(this.element).mainContentPlugin != undefined) {
            var p4 = $(this.element).mainContentPlugin({
                id: options.id,
                name: "bdm",
                uid: options.uid,
                parent: this,
            });
            this.mainContentPlugin = p4.data("mainContentPlugin");
        }
        // create new model dialog plugin
        var p4 = $(this.element).createModelDialog({
            id: "004BD",
            title: vendor + " - 新建",
            parent: this,
        });
        this.createModelDialog = p4.data("createModelDialog");
        // rename dialog
        var p5 = $(this.element).renameEditDialog({
            id: "009BD",
            title: vendor + " - 重命名",
            parent: this,
            topparent: this.element,
            url: this.domainname,
        });
        this.renameDialog = $(this.element).data("renameEditDialog");
        var p = document.createElement("DIV");
        this.element.appendChild(p);
        // confirm message dialog plugin
        var p2 = $(p).confirmInfoDialog({
            id: "005BD",
            title: vendor + " - 提示",
            parent: this,
        });
        this.confirmInfoDialog = p2.data("confirmInfoDialog");
    };

    MainContent.prototype.loadTreeViewer = function (parent) {
        var that = this;
        var instance = $(parent)
            .jstree(
                {
                    "core": {
                        "multiple": false,
                        // "themes": {"dots": false},
                        "check_callback": true,
                        "data": {
                            "url": service.api(1),
                            "dataType": "json"
                        }
                    },
                    "plugins": ["contextmenu", "dnd"],
                    "contextmenu": {
                        'items': that.customMenu,
                    }
                }).on('create_node.jstree', function (e, data) {
            }).on('select_node.jstree', function (e, data) {
                if (data.node.data != "") {
                    var arry = data.node.data.split("|");
                    if (arry[0] == "3" && arry[2] != "7") {
                        that.createModelDialog.initData(arry[2]);
                        that.menubar.newItem.removeAttribute("class");// enabled
                    } else {
                        that.menubar.newItem.className = "disabled";// disabled
                    }
                }
            }).on('load_node.jstree', function (e, data) {
                that.mainContentPlugin.loadfromStorage(that);
            }).on("dblclick.jstree", this.dblclickJSTree);

    };

    MainContent.prototype.customMenu = function (node) {
        var arry = node.data.split("|");
        var items = {
            "create": {
                "label": "新建",
                "icon": "fa fa-plus",
                "action": function (obj) {// obj is action object
                    window.main.createModelDialog.show(node);
                },
            },
            "open": {
                "label": "打开",
                "action": function (obj) {
                    window.main.openOneEditor(node);
                },
            },
            "rename": {
                "separator_before": true,
                "separator_after": true,
                "label": "重命名",
                "action": function (obj) {
                    if (map[node.id] == null) {
                        window.main.renameDialog.setEntityId(node.id,
                            node.text, node.data);
                    } else {
                        window.main.renameDialog
                            .setEntity(map[node.id].currObject);
                    }
                    window.main.renameDialog.show();
                },
            },
            "remove": {
                "label": "删除",
                "icon": "fa fa-remove",
                "disabled": "true",
                "action": function (obj) {
                    window.main.confirmInfoDialog.show("您确定要删除" + node.text
                        + "？", 2, node.id, arry[1], "0");
                },
            }
        }
        if (arry[0] == "1") {
            delete items.create;
            delete items.open;
            delete items.remove;
            delete items.rename;
        } else if (arry[0] == "2") {
            delete items.create;
            delete items.open;
            delete items.remove;
            delete items.rename;
        } else if (arry[0] == "3") {
            if (arry[2] == "7")
                delete items.create;
            else {
                delete items.open;
                delete items.remove;
                delete items.rename;
            }
        }
        return items;
    }

    MainContent.prototype.dblclickJSTree = function (e) {
        e.preventDefault();
        var instance = $('#treeview').jstree(true);
        var sel = instance.get_selected(true)[0];
        if (sel != null) {
            var arry = sel.data.split("|");
            if (arry[0] == "3") {
                window.main.mainContentPlugin.addNewTab(sel.text, sel.id,
                    arry[1], arry[5]);
                window.main.savePrefer(sel.id);
            }
        }
    };

    MainContent.prototype.savePrefer = function (id) {
        prefer.bdm.addId(id);
        var s = JSON.stringify(prefer);
        if (typeof (Storage) !== undefined) {
            var userId = localStorage.getItem("userId");
            localStorage.setItem(userId, s);
        }
    };

    MainContent.prototype.openEditor = function (eid, i) {
        if (eid != "" || eid != null) {
            var instance = $('#treeview').jstree(true);
            var sel = instance.get_selected(true)[i];
            if (sel != null) {
                var arry = sel.data.split("|");
                if (arry[0] == "3") {
                    window.main.mainContentPlugin.addNewTab(sel.text, sel.id,
                        arry[1], arry[5]);
                }
            }
        }
    };

    MainContent.prototype.openOneEditor = function (node) {
        var arry = node.data.split("|");
        window.main.mainContentPlugin.addNewTab(node.text, node.id, arry[1],
            arry[5]);
        window.main.savePrefer(node.id);
    };

    MainContent.prototype.createObject = function (parent, name, parentid,
                                                   ownerid, type, version,
                                                   reporttype, crossversion) {
        $("#progressbar").show();
        $.post(service.api(8), {
            entityname: Utils.stringify(name),
            parentid: parentid,
            ownerid: ownerid,
            type: type, // SaaS process code
            version: version, // SaaS process version
            reporttype: reporttype,
            crossversion: crossversion,
        }, function (x) {
            var instance = $('#treeview').jstree();
            var node = {
                id: x.id,
                text: Utils.parse(x.text),
                data: "3|" + x.owner + "|7|" + reporttype + "|" + type + "|RPT" + reporttype,
                // parent: data.parent.id,
                icon: "glyphicon glyphicon-file",
            };
            instance.create_node(parent, node, "last");
            instance.redraw(true);
            $('#treeview').jstree('deselect_all', true);
            $('#treeview').jstree('select_node', node.id);
            window.main.mainContentPlugin.addNewTab(
                node.text, node.id, ownerid, "RPT" + reporttype);
            $("#progressbar").hide();
        });
    };

    MainContent.prototype.doYesAction = function (e, type, id, oid, f) {
        this.confirmInfoDialog.hide();
        if (type == 1) { // report service modify
            this.mainContentPlugin.saveChange(1, this);
        } else if (type == 2) { // report service deletion
            var that = this;
            if (f == 0) { // delete one report service
                $("#progressbar").show();
                $.post(service.api(11), {
                    id: id,
                }).complete(function (data) {
                    $("#progressbar").hide();
                    var instance = $('#treeview').jstree();
                    var p = instance.get_selected(true)[0];
                    $('#treeview').jstree('delete_node', p);
                    that.removeTab(id);
                });
            }
        }
    };

    // remove process tab from tab contents, pid is process id
    MainContent.prototype.removeTab = function (pid) {
        var that = this;
        $(".nav-tabs").children('li').each(function (entry) {
            var anchor = $(this).children("a")[0];
            var id = $(anchor).attr('href').substring(5);// #tab_000002A8AS
            if (pid == id) {
                that.mainContentPlugin.cloaseTab(id, anchor);
            }
        });
    };


    MainContent.prototype.doNoAction = function (e, type, id, f) {
        this.confirmInfoDialog.hide();
    };

    MainContent.prototype.doSaveAction = function () {
        this.mainContentPlugin.saveChange(0, this);
    };

    MainContent.prototype.doCreateNewAction = function () {
        this.createModelDialog.show();
    };

    // entity: the renamed object;
    // entityId: the renamed folder id or object id;
    MainContent.prototype.doRenameAction = function (entity, entityId, newname) {
        if (entity != null) {
            map[entity.id].stack.execute(new BDMRenameCmd(entity, newname));
        } else if (entityId != null) {
            // update treeview
            var instance = $('#treeview').jstree();
            $('#treeview').jstree('deselect_all', true);
            $('#treeview').jstree('select_node', entityId);
            var parent = instance.get_selected(true)[0];
            parent.text = newname;
            instance.redraw(true);
            this.doRename(entityId, Utils.stringify(newname),
                new Date().getTime());
        }
    };

    MainContent.prototype.doRename = function (id, name, lastupdatetime) {
        $("#progressbar").show();
        $.post(service.api(10), {
            id: id,
            entityname: name,
            lastupdate: lastupdatetime,
        }, function (x) {
            $("#progressbar").hide();
        });
    };

    MainContent.prototype.saveObjects = function (id, anchor, closetab) {
        var that = this;
        if (map[id].currObject instanceof ReportService) {
            $("#progressbar").show();
            $.post(service.api(5), {
                obj: JSON.stringify(map[id].currObject),
            }, function (data) {
                map[id].stack.save();
                if (closetab == 1) {
                    that.cloaseTab(id, anchor);
                }
                $("#progressbar").hide();
            });
        }

    };

    // myTabTitle: tab title, myTabID: process ID, myOwnerID: organization ID.
    MainContent.prototype.addNewTab = function (tabcontent, myTabTitle,
                                                myTabID, myOwnerID, type) {
        var instance = $('#treeview').jstree();
        var root = instance.get_node("#");
        var selected = instance.get_selected(true);
        var pid = "";
        var d = "";// process node data
        if (selected.length > 0) {
            var parent = instance.get_selected(true)[0];
            pid = parent.id;
            // 获取过程节点的data
            var pID = instance.get_parent(parent);
            var prt = instance.get_node(pID);
            d = prt.data;
        }
        var children = root.children;
        var orgName = "";

        for (var i = 0; i < children.length; i++) {
            if (children[i] == myOwnerID) {
                var ch = instance.get_node(myOwnerID);
                orgName = ch.text;
                break;
            }
        }
        if (type == "R") {
            var p = $(tabcontent).runnedReleasedWfProcessEditor({
                id: myTabID,
                userId: this.options.uid,
                userfullname: this.options.uname,
                ownername: orgName,
                basicpropsheet: this.mainContentPlugin.basicpropertySheets,
                propsheet: this.mainContentPlugin.propertySheets,
                owner: myOwnerID,
                width: this.mainContentPlugin.tabsWidth,
                height: this.mainContentPlugin.tabsHeight,
            });
            map[myTabID] = p.data("runnedReleasedWfProcessEditor");
        } else if (type == "RPT0") { // 不分页式报表服务
            var p = $(tabcontent).reportServiceEditor({
                id: myTabID,
                pid: pid, // wfprocess Id for build report.
                userId: this.options.uid,
                userfullname: this.options.uname,
                ownername: orgName,
                basicpropsheet: this.mainContentPlugin.basicpropertySheets,
                propsheet: this.mainContentPlugin.propertySheets,
                owner: myOwnerID,
                width: this.mainContentPlugin.tabsWidth,
                height: this.mainContentPlugin.tabsHeight,
                edata: d, // attached data
            });
            map[myTabID] = p.data("reportServiceEditor");
        } else if (type == "RPT1") { // 分页式报表服务
            var p = $(tabcontent).pageableReportServiceEditor({
                id: myTabID,
                pid: pid, // wfprocess Id for build report.
                userId: this.options.uid,
                userfullname: this.options.uname,
                ownername: orgName,
                basicpropsheet: this.mainContentPlugin.basicpropertySheets,
                propsheet: this.mainContentPlugin.propertySheets,
                owner: myOwnerID,
                width: this.mainContentPlugin.tabsWidth,
                height: this.mainContentPlugin.tabsHeight,
                edata: d, // attached data
            });
            map[myTabID] = p.data("pageableReportServiceEditor");
        } else if (type == "RPT2") {

        }
        $("#tabcontents").append(tabcontent);
        tabcontent.setAttribute("data", myTabID);
    };

    MainContent.prototype.doAutoResizeForAdPTabs = function (h, id) {
        var t = document.getElementById("tablediv" + id);
        if (t != null) {
            t.style.height = "67px";
        }
    };

    MainContent.prototype.doAutoResizeForEditorTabs = function (w, h, id) {
        var p = document.getElementById("accordion" + id);
        var t = document.getElementById("convasPane" + id);
        var t1 = document.getElementById("canvasPanel" + id);

        var t5 = document.getElementById("rlpcanvasPanel" + id);
        var t4 = document.getElementById("rlprocPane" + id);

        var t2 = document.getElementById("rlprocCanvasPanel" + id);
        var t3 = document.getElementById("rlprocConvasPane" + id);
        if (p != null) {
            p.style.height = (h - 84) + "px";
        }
        if (t != null) {
            // 84 is toolbar height + tab height;
            t.style.height = (h - 84) + "px";
        }
        if (t1 != null) {
            // 76 is 70(pallet width) + 2(border) + 4(gap)
            t1.style.width = (w - 76) + "px";
        }
        if (t4 != null) {
            t4.style.height = (h - 84) + "px";
        }
        if (t5 != null) {
            t5.style.width = (w - 2) + "px";
        }
        // 130 is 126 (2 tab height + tool bar height)
        // + 4 (2 gap height + 2 tab border height)
        if (t2 != null) {
            t2.style.width = (w - 2) + "px";
        }
        if (t3 != null) {
            t3.style.height = (h - 130) + "px";
        }
        var t4 = document.getElementById("leftlist" + id);
        var t5 = document.getElementById("middlelist" + id);
        var t6 = document.getElementById("rightlist" + id);
        if (t4 != null) {
            t4.style.height = (h - 164) + "px";
        }
        if (t5 != null) {
            t5.style.height = (h - 164) + "px";
        }
        if (t6 != null) {
            t6.style.height = (h - 164) + "px";
        }
        var t7 = document.getElementById("previewlist" + id);
        if (t7 != null) {
            t7.style.height = (h - 130) + "px";
        }
        var t8 = document.getElementById("pageablepreviewertable" + id);
        if (t8 != null) {
            t8.style.height = (h - 170) + "px";
        }
        var t9 = document.getElementById("versionstable" + id);
        if (t9 != null) {
            t9.style.height = (h - 130) + "px";
        }
        var t10 = document.getElementById("querycondition" + id);
        if (t10 != null) {
            t10.style.height = (h - 130) + "px";
        }
        var t11 = document.getElementById("othercondition" + id);
        if (t11 != null) {
            t11.style.height = (h - 130) + "px";
        }
    };

    MainContent.prototype.doEastResize = function (evt, id, dx) {
        var t = document.getElementById("canvasPanel" + id);
        var t2 = document.getElementById("rlprocCanvasPanel" + id);
        var t4 = document.getElementById("rlprocPane" + id);
        if (t != null) {
            t.style.width = (parseInt(t.style.width) + dx) + "px";
        }
        if (t2 != null) {
            t2.style.width = (parseInt(t2.style.width) + dx) + "px";
        }
        if (t4 != null) {
            t4.style.width = (parseInt(t4.style.width) + dx) + "px";
        }
        var t5 = document.getElementById("rlpcanvasPanel" + id);
        if (t5 != null) {
            t5.style.width = (parseInt(t5.style.width) + dx) + "px";
        }
    };

    MainContent.prototype.doWestResize = function (evt, id, dx) {
        var t = document.getElementById("canvasPanel" + id);
        var t2 = document.getElementById("rlprocCanvasPanel" + id);
        var t4 = document.getElementById("rlprocPane" + id);
        if (t != null) {
            t.style.width = (parseInt(t.style.width) - dx) + "px";
        }
        if (t2 != null) {
            t2.style.width = (parseInt(t2.style.width) - dx) + "px";
        }
        if (t4 != null) {
            t4.style.width = (parseInt(t4.style.width) - dx) + "px";
        }
        var t5 = document.getElementById("rlpcanvasPanel" + id);
        if (t5 != null) {
            t5.style.width = (parseInt(t5.style.width) - dx) + "px";
        }
    };

    MainContent.prototype.doSouthResizeForAdPTabs = function (evt, id, dy) {
        var t = document.getElementById("tablediv" + id);
        if (t != null) {
            t.style.height = (parseInt(t.style.height) - dy) + "px";
        }
    };

    MainContent.prototype.doSouthResizeForEditorTabs = function (evt, id, dy) {
        var t = document.getElementById("convasPane" + id);
        var p = document.getElementById("accordion" + id);
        var t1 = document.getElementById("rlprocPane" + id);
        var t4 = document.getElementById("rlprocConvasPane" + id);
        if (t != null) {
            t.style.height = (parseInt(t.style.height) + dy) + "px";
        }
        if (p != null) {
            p.style.height = (parseInt(p.style.height) + dy) + "px";
        }
        if (t1 != null) {
            t1.style.height = (parseInt(t1.style.height) + dy) + "px";
        }
        if (t4 != null) {
            // editor tab
            t4.style.height = (parseInt(t4.style.height) + dy) + "px";
        }

        var t5 = document.getElementById("leftlist" + id);
        var t6 = document.getElementById("middlelist" + id);
        var t7 = document.getElementById("rightlist" + id);
        if (t5 != null) {
            t5.style.height = (parseInt(t5.style.height) + dy) + "px";
        }
        if (t6 != null) {
            t6.style.height = (parseInt(t6.style.height) + dy) + "px";
        }
        if (t7 != null) {
            t7.style.height = (parseInt(t7.style.height) + dy) + "px";
        }
        var t8 = document.getElementById("previewlist" + id);
        if (t8 != null) {
            t8.style.height = (parseInt(t8.style.height) + dy) + "px";
        }
        var t9 = document.getElementById("pageablepreviewertable" + id);
        if (t9 != null) {
            t9.style.height = (parseInt(t9.style.height) + dy) + "px";
        }
        var t10 = document.getElementById("versionstable" + id);
        if (t10 != null) {
            t10.style.height = (parseInt(t10.style.height) + dy) + "px";
        }
        var t11 = document.getElementById("querycondition" + id);
        if (t11 != null) {
            t11.style.height = (parseInt(t11.style.height) + dy) + "px";
        }
        var t12 = document.getElementById("othercondition" + id);
        if (t12 != null) {
            t12.style.height = (parseInt(t12.style.height) + dy) + "px";
        }
    };

    MainContent.prototype.doMouseUp = function (evt) {
    };

    $.fn[pluginName] = function (options) {
        return this.each(function () {
            if (!$.data(this, pluginName)) {
                $.data(this, pluginName, new MainContent(this, options));
            } else if ($.isFunction(Plugin.prototype[options])) {
                $.data(this, pluginName)[options]();
            }
        });
    };

})(jQuery, window, document);