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
        this.basicpropsheet = options.basicpropsheet;
        this.propsheet = options.propsheet;
        this._defaults = defaults;
        this._name = pluginName;
        this.uid = options.uid;
        this.menubar = null;
        this.init(options);
    };

    MainContent.prototype.init = function (options) {
        if ($(this.element).mainContentPlugin != undefined) {
            var p4 = $(this.element).mainContentPlugin({
                id: options.id,
                name: "pm",
                uid: options.uid,
                parent: this,
            });
            this.mainContentPlugin = p4.data("mainContentPlugin");
        }
        // create new model dialog plugin
        var p4 = $(this.element).createModelDialog({
            id: "004",
            title: "轩琦科技 - 新建",
            parent: this,
        });
        this.createModelDialog = p4.data("createModelDialog");
        // rename dialog
        var p5 = $(this.element).renameEditDialog({
            id: "009",
            title: "轩琦科技 - 重命名",
            parent: this,
            topparent: this.element,
            url: this.domainname,
        });
        this.renameDialog = $(this.element).data("renameEditDialog");
        // process service shopping mall
        var mallplugin = $(this.element).buyhireServiceDialog({
            id: "007",
            title: "轩琦科技  - 商店",
            parent: this,
            topparent: options.parent,
        });
        this.buyhireServiceDialog = mallplugin.data("buyhireServiceDialog");
        var p = document.createElement("DIV");
        this.element.appendChild(p);
        // confirm message dialog plugin
        var p2 = $(p).confirmInfoDialog({
            id: "005",
            title: "轩琦科技 - 提示",
            parent: this,
        });
        this.confirmInfoDialog = p2.data("confirmInfoDialog");
    };

    MainContent.prototype.loadTreeViewer = function (parent) {
        var that = this;
        var instance = $(parent).jstree({
            "core": {
                "multiple": false,
                // "themes": {"dots": false},
                "check_callback": true,
                "data": {
                    "url": service.api(0),
                    "dataType": "json"
                }
            },
            "plugins": ["contextmenu", "dnd"],
            "contextmenu": {
                'items': that.customMenu,
            }
        }).on('create_node.jstree', function (e, data) {
        }).on('select_node.jstree', function (e, data) {
            if (data.node.data != undefined && data.node.data != "") {
                var arry = data.node.data.split("|");
                if (arry[0] == "1") {
                    that.menubar.mallItem.removeAttribute("class");// enabled
                    that.menubar.newItem.className = "disabled";// disabled
                } else if (arry[0] == "2") {
                    if (arry[2] == "100") {
                        if (that.createModelDialog != undefined) {
                            that.createModelDialog.initData(arry[2]);
                        }
                        that.menubar.newItem.removeAttribute("class");// enabled
                    }
                    that.menubar.mallItem.className = "disabled";// disabled
                } else {
                    that.menubar.newItem.className = "disabled";// disabled
                    that.menubar.mallItem.className = "disabled";// disabled
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
                    window.main.createModelDialog.initData(arry[2]);
                    window.main.createModelDialog.show();
                },
            },
            "open": {
                "label": "打开",
                "action": function (obj) {
                    window.main.openOneEditor(node);
                },
            },
            "copy": {
                "separator_before": true,
                "label": "复制到...",
                "icon": "fa fa-files-o",
                "action": function (obj) {
                    window.main.openCopyDialog(node);
                },
            },
            "move": {
                "label": "移动...",
                "icon": "fa fa-scissors",
                "action": function (obj) {
                    window.main.openMoveDialog(node);
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
                            .setEntity(map[node.id].wfprocess);
                    }
                    window.main.renameDialog.show();
                },
            },
            "remove": {
                "label": "删除",
                "icon": "fa fa-remove",
                "disabled": "true",
                "action": function (obj) {
                    var f = "0";
                    if (arry[0] == "2")
                        f = "1";
                    window.main.confirmInfoDialog.show("您确定要删除" + node.text
                        + "？", 2, node.id, arry[1], f);
                },
            }
        }
        if (arry[0] == "1") {
            delete items.create;
            delete items.open;
            delete items.copy;
            delete items.move;
            delete items.remove;
            delete items.rename;
        } else if (arry[0] == "2") {
            delete items.open;
            delete items.copy;
            if (arry[3] == "0") {
                delete items.move;
                delete items.remove;
                delete items.rename;
            }
        } else if (arry[0] == "3") {
            if (arry[3] == "R") {
                delete items.create;
                delete items.rename;
            }
        }
        return items;
    };

    MainContent.prototype.dblclickJSTree = function (e) {
        e.preventDefault();
        var instance = $('#treeview').jstree(true);
        var sel = instance.get_selected(true)[0];
        if (sel != null) {
            var arry = sel.data.split("|");
            if (arry[0] == "3") {
                window.main.mainContentPlugin.addNewTab(sel.text, sel.id,
                    arry[1], arry[3]);
                window.main.savePrefer(sel.id);
            }
        }
    };

    MainContent.prototype.savePrefer = function (id) {
        prefer.pm.addId(id);
        var s = JSON.stringify(prefer);
        if (typeof (Storage) !== undefined) {
            var userId = localStorage.getItem("userId");
            localStorage.setItem(userId, s);
        }
    };

    MainContent.prototype.openEditor = function (eid, i) {
        if (eid != null && eid != "") {
            var d = $('#treeview').jstree('get_node', eid);
            var instance = $('#treeview').jstree(true);
            var s = instance.select_node(eid);
            var sel = instance.get_selected(true)[i];
            if (sel != null) {
                var arry = sel.data.split("|");
                if (arry[0] == "3") {
                    window.main.mainContentPlugin.addNewTab(sel.text, sel.id,
                        arry[1], arry[3]);
                }
            }
        }
    };

    MainContent.prototype.openOneEditor = function (node) {
        var arry = node.data.split("|");
        window.main.mainContentPlugin.addNewTab(node.text, node.id, arry[1],
            arry[3]);
        window.main.savePrefer(node.id);
    };

    // move
    MainContent.prototype.openMoveDialog = function (node) {
        if ($(this).moveWfProcessDialog != undefined) {
            var plugin = $(this).moveWfProcessDialog({
                id: "pm093",
                title: "轩琦科技  - 移动应用...",
                parent: this, // main content panel
            });
            this.moveWfProcessDialog = plugin.data("moveWfProcessDialog");
        }
        this.moveWfProcessDialog.show(node);
    };

    // copy
    MainContent.prototype.openCopyDialog = function (node) {
        if ($(this).copyWfProcessDialog != undefined) {
            var plugin = $(this).copyWfProcessDialog({
                id: "pm094",
                title: "轩琦科技  - 复制应用到...",
                parent: this, // main content panel
            });
            this.copyWfProcessDialog = plugin.data("copyWfProcessDialog");
        }
        this.copyWfProcessDialog.show(node);
    };

    MainContent.prototype.setPropertySheet = function () {
        var obj = this.wfprocess;
        if (this.selected != null && this.selected.length > 0) {
            obj = this.selected[0];
        }
        if (this.basicpropsheet != null) {
            this.basicpropsheet.setSheet(obj, this.wfprocess);
        }
        if (this.propsheet != null) {
            this.propsheet.setSheet(obj, this.wfprocess, this.propsheet
                .getCurrTabIndex(obj));
        }
    };

    MainContent.prototype.createFolder = function (parent, name, parentid,
                                                   ownerid, type) {
        $("#progressbar").show();
        var icon = "glyphicon glyphicon-folder-open";
        if (type == 109) {
            icon = "glyphicon glyphicon-th-large";
        }
        $.post(service.api(3, ownerid), {
            ename: Utils.stringify(name),
            pid: parentid,
            type: type,
        }, function (x) {
            var instance = $('#treeview').jstree();
            var node = {
                id: x.id,
                text: Utils.parse(x.name),
                data: "2|" + x.owner + "|" + type + "|2",
                // parent: data.parent.id,
                icon: icon,
            };
            instance.create_node(parent, node, "last");
            instance.redraw(true);
            $('#treeview').jstree('deselect_all', true);
            $('#treeview').jstree('select_node', node.id);
            $("#progressbar").hide();
        });
    };

    MainContent.prototype.createSaaSAppProcess = function (parent, name, parentid,
                                                      ownerid, pt) {
        $("#progressbar").show();
        $.post(service.api(4, ownerid), {
            ename: Utils.stringify(name),
            pid: parentid,
            authorid: this.options.uid,
            author: this.options.uname,
            pt : pt, // process type/workflow type, 0, 1, 2
        }, function (x) {
            var node = {
                id: x.id,
                text: Utils.parse(x.text),
                data: x.data,
                icon: "glyphicon glyphicon-flash",
            };
            var instance = $('#treeview').jstree();
            instance.create_node(parent, node, "last");
            instance.redraw(true);
            $('#treeview').jstree('deselect_all', true);
            $('#treeview').jstree('select_node', node.id);
            window.main.mainContentPlugin.addNewTab(node.text, node.id,
                ownerid, "P");
            $("#progressbar").hide();
            window.main.savePrefer(node.id);
        });
    };

    // f: 0: it is process; 1: it is folder
    MainContent.prototype.doYesAction = function (e, type, id, oid, f) {
        this.confirmInfoDialog.hide();
        if (type == 1) { // process modify
            this.mainContentPlugin.saveChange(1, this);
        } else if (type == 2) { // process deletion
            var that = this;
            if (f == 0) { // delete one process
                $("#progressbar").show();
                $.post(service.api(15, oid), {
                    id: id,
                }).complete(function (data) {
                    $("#progressbar").hide();
                    instance = $('#treeview').jstree();
                    var p = instance.get_selected(true)[0];
                    $('#treeview').jstree('delete_node', p);
                    that.removeTab(id);
                });
            } else { // delete multiple process
                instance = $('#treeview').jstree();
                var sel = instance.get_selected(true)[0];
                var fpids = [];
                fpids.push(id);
                if (sel.children_d.length > 0) {
                    fpids = sel.children_d;
                    fpids.push(id);
                }
                $("#progressbar").show();
                $.post(service.api(30, oid), {
                    ids: JSON.stringify(fpids),
                }).complete(function (data) {
                    for (var i = 0; i < fpids.length; i++) {
                        that.removeTab(fpids[i]);
                    }
                    $('#treeview').jstree('delete_node', sel);
                    $("#progressbar").hide();
                });
            }

        }
    };

    // f: 0: it is process; 1: it is folder
    MainContent.prototype.doNoAction = function (e, type, id, f) {
        this.confirmInfoDialog.hide();
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

    MainContent.prototype.doSaveAction = function () {
        this.mainContentPlugin.saveChange(0, this);
    };

    MainContent.prototype.doCreateNewAction = function () {
        this.createModelDialog.show();
    };

    MainContent.prototype.saveChange = function (id, closetab, parent) {
        parent.saveObject(id, anchor, closetab);
    };

    MainContent.prototype.showBuyHireDlg = function () {
        this.buyhireServiceDialog.show();
    };

    // entity: the renamed object;
    // entityId: the renamed folder id or object id;
    MainContent.prototype.doRenameAction = function (entity, entityId, newname) {
        if (entity != null) {
            map[entity.id].stack.execute(new PMRenameCmd(entity, newname));
        } else if (entityId != null) {
            // update treeview
            var instance = $('#treeview').jstree();
            $('#treeview').jstree('deselect_all', true);
            $('#treeview').jstree('select_node', entityId);
            parent = instance.get_selected(true)[0];
            parent.text = newname;
            var arry = parent.data.split("|");
            instance.redraw(true);
            // update to repository via web service.
            if (!this.renameDialog.isFolder) { // the node is not folder
                this.updateWfProcessName(entityId, Utils.stringify(newname),
                    new Date().getTime(), arry[2]);
            } else { // the node is process
                this.updateFolderName(entityId, Utils.stringify(newname),
                    arry[2]);
            }
        }
    };

    MainContent.prototype.updateWfProcessName = function (id, name,
                                                          lastupdatetime, ownerid) {
        $("#progressbar").show();
        $.post(service.api(7, ownerid), {
            id: id,
            entityname: name,
            lastupdate: lastupdatetime,
        }, function (x) {
            $("#progressbar").hide();
        });
    };

    MainContent.prototype.updateFolderName = function (id, name, ownerid) {
        $("#progressbar").show();
        $.post(service.api(8, ownerid), {
            id: id,
            entityname: name,
        }, function (x) {
            $("#progressbar").hide();
        });
    };

    // bh: 0: hire; 1: buy; m : 0: not modify; 1: modify
    MainContent.prototype.doBuyHireAction = function (pid, bh, m) {
        $("#progressbar").show();
        var instance = $('#treeview').jstree();
        var p = instance.get_selected(true)[0];
        if (p != null) {
            var ch = p.children;
            var d = null;
            var o = null;
            if (ch.length > 0) {
                if (bh == 1) {
                    if (m == 1) {
                        for (var i = 0; i < ch.length; i++) {
                            // find not published folder
                            d = $('#treeview').jstree('get_node', ch[i]);
                            var arry = d.data.split("|");
                            if (arry[0] == "2" && arry[2] == "100"
                                && arry[3] == "0") {
                                instance.select_node(ch[i]);
                                o = arry[1];
                                break;
                            }
                        }
                    } else {
                        for (var i = 0; i < ch.length; i++) {
                            // find published folder
                            d = $('#treeview').jstree('get_node', ch[i]);
                            var arry = d.data.split("|");
                            if (arry[0] == "2" && arry[2] == "109"
                                && arry[3] == "0") {
                                instance.select_node(ch[i]);
                                o = arry[1];
                                break;
                            }
                        }
                    }
                } else if (bh == 1) {
                    for (var i = 0; i < ch.length; i++) {
                        // find published folder
                        d = $('#treeview').jstree('get_node', ch[i]);
                        var arry = d.data.split("|");
                        if (arry[0] == "2" && arry[2] == "109"
                            && arry[3] == "0") {
                            instance.select_node(ch[i]);
                            o = arry[1];
                            break;
                        }
                    }
                }
            }
            var that = this;
            if (bh == 1) { // buy
                $.post(service.api(28, o), {
                    id: pid,
                    parent: d.id,
                    owner: o,
                    modify: m,
                }, function (node) {
                    var arry = node.data.split("|");
                    instance.create_node(parent, node, "last");
                    instance.redraw(true);
                    $('#treeview').jstree('deselect_all', true);
                    $('#treeview').jstree('select_node', node.id);
                    that.mainContentPlugin.addNewTab(node.text, node.id, o,
                        arry[3]);
                    that.buyhireServiceDialog.hide();
                    $("#progressbar").hide();
                });
            } else if (bh == 0) { // hire

            }
        }
    };

    // target folder object in tree viewer
    MainContent.prototype.copyObjcets = function (target) {
        instance = $('#treeview').jstree();
        var p = instance.get_selected(true)[0];
        if (p.data != null) {
            var ary = p.data.split("|");
            var that = this;
            $.post(service.api(29, ary[1]), {
                pid: p.id,
                fid: target.id, // taget folder ID
                type: ary[3],
                orgid: ary[1], // organization ID
            }, function (data) {
                if (data.status == "1") {
                    var pname = p.text + "_副本";
                    // create a tree view node
                    var node = {
                        id: data.id,
                        text: pname,
                        data: "3|" + ary[1] + "|" + ary[2].code + "|P|",
                        icon: "glyphicon glyphicon-flash",
                    };
                    instance.create_node(target, node, "last");
                    instance.redraw(true);
                    $('#treeview').jstree('deselect_all', true);
                    $('#treeview').jstree('select_node', data.id);
                    that.copyWfProcessDialog.hide();
                    that.mainContentPlugin.addNewTab(pname, data.id, ary[1],
                        "P");
                    $("#progressbar").hide();
                }
            });
        }
    };

    // target folder object in tree viewer
    MainContent.prototype.moveObjcets = function (target) {
        instance = $('#treeview').jstree();
        var p = instance.get_selected(true)[0];
        var ary = p.data.split("|");
        if (ary[0] == "2") {
            var that = this;
            $.post(service.api(31, ary[1]), {
                fid: p.id,
                parent: target.id,
            }, function (data) {
                if (data.status == "1") {
                    instance = $('#treeview').jstree();
                    var p = instance.get_selected(true)[0];
                    // $('#treeview').jstree('delete_node', p);
                    instance.move_node(p, target, "last");
                    $('#treeview').jstree('deselect_all', true);
                    $('#treeview').jstree('select_node', p.id);
                    instance.refresh(true);
                    that.moveWfProcessDialog.hide();
                } else {
                }
                $("#progressbar").hide();
            });
        } else if (ary[0] == "3") {
            var that = this;
            $.post(service.api(27, ary[1]), {
                pid: p.id,
                pfd: target.id,
                orgid: ary[1],
                type: ary[3],
            }, function (data) {
                if (data == "1") {
                    instance = $('#treeview').jstree();
                    var p = instance.get_selected(true)[0];
                    // $('#treeview').jstree('delete_node', p);
                    instance.move_node(p, target, "last");
                    instance.redraw(true);
                    $('#treeview').jstree('deselect_all', true);
                    $('#treeview').jstree('select_node', p.id);
                    if (map[p.id] != null) {
                        map[p.id].wfprocess.parent = target.id;
                        map[p.id].setPropertySheet();
                    }
                    that.moveWfProcessDialog.hide();
                } else {
                }
                $("#progressbar").hide();
            });

        }
    };

    MainContent.prototype.saveObjects = function (id, closetab, parent, anchor) {
        $("#progressbar").show();
        var cmd = 0;
        if (map[id].wfprocess instanceof WfProcess) {
            cmd = 5;
        } else if (map[id].wfprocess instanceof ReleasedWfProcess) {
            cmd = 22;
        }
        var process1 = map[id].wfprocess.stringifyforJSON();
        $.post(service.api(cmd, map[id].wfprocess.owner), {
            process: JSON.stringify(process1),
        }, function (data) {
            map[id].stack.save();
            if (closetab == 1) {
                parent.cloaseTab(id, anchor);
            }
            $("#progressbar").hide();
        });
    };

    // myTabTitle: tab title, myTabID: process ID, myOwnerID: organization ID.
    MainContent.prototype.addNewTab = function (tabcontent, myTabTitle, myTabID,
                                                myOwnerID, type) {
        if (type == "P") {
            var p = $(tabcontent).wfProcessEditor({
                id: myTabID,
                basicpropsheet: this.mainContentPlugin.basicpropertySheets,
                propsheet: this.mainContentPlugin.propertySheets,
                owner: myOwnerID,
                width: this.mainContentPlugin.tabsWidth,
                height: this.mainContentPlugin.tabsHeight,
                parent: this,
                uid: this.options.uid,
                uname: this.options.uname,
            });
            map[myTabID] = p.data("wfProcessEditor");
        } else if (type == "R") {
            var instance = $('#treeview').jstree();
            var root = instance.get_node("#");
            var children = root.children;
            var orgName = "";
            for (var i = 0; i < children.length; i++) {
                if (children[i] == myOwnerID) {
                    var ch = instance.get_node(myOwnerID);
                    orgName = ch.text;
                    break;
                }
            }

            var p = $(tabcontent).pmProcessPublishEditor({
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
            map[myTabID] = p.data("pmProcessPublishEditor");
        }
        tabcontent.setAttribute("data", myTabID);
        $("#tabcontents").append(tabcontent);
    };

    MainContent.prototype.doAutoResizeForAdPTabs = function (h, id) {
        var t = document.getElementById("tablediv" + id);
        if (t != null) {
            t.style.height = "242px";
        }
        var t1 = document.getElementById("listPane" + id);
        if (t1 != null) {
            t1.style.height = "242px";
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
            t5.style.width = (w) + "px";
        }
        // 130 is 126 (2 tab height + tool bar height)
        // + 4 (2 gap height + 2 tab border height)
        if (t2 != null) {
            t2.style.width = (w) + "px";
        }
        if (t3 != null) {
            t3.style.height = (h - 130) + "px";
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
        var t2 = document.getElementById("listPane" + id);
        if (t2 != null) {
            t2.style.height = (parseInt(t2.style.height) - dy) + "px";
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
            t4.style.height = (parseInt(t4.style.height) + dy) + "px";
        }
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