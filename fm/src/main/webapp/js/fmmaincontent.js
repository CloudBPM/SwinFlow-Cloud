/**
 *
 */
var map = {};
var copyclip = null;
var bgcache = null;
;
(function ($, window, document, undefined) {
    var pluginName = "fmMainContent";
    var defaults = {
        id: "",
        uid: "",
        uname: "",
        sid : "",
    };

    var MainContent = function (element, options) {
        this.element = element;
        this.options = $.extend({
            id: "",
            uid: "",
            uname: "",
            sid : "",
        }, defaults, options);
        this._defaults = defaults;
        this._name = pluginName;
        this.basicpropertySheets = null; // basic property setter;
        this.propertySheets = null; // advanced property setter;
        this.treeviewer;
        this.init(options);
        this.currentObjId = -1;
        this.menubar = null;
    };

    MainContent.prototype.init = function (options) {
        if ($(this.element).mainContentPlugin != undefined) {
            var p4 = $(this.element).mainContentPlugin({
                id: options.id,
                name: "fm",
                uid: options.uid,
                parent: this,
            });
            this.mainContentPlugin = p4.data("mainContentPlugin");
        }
        // create new model dialog plugin
        var p4 = $(this.element).createModelDialog({
            id: "037111",
            title: "轩琦科技 - 新建",
            parent: this,
        });
        this.createModelDialog = p4.data("createModelDialog");
        // rename dialog
        var p5 = $(this.element).renameEditDialog({
            id: "039",
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
                "check_callback": true,
                // "themes": {"dots": false},
                "data": {
                    "url": service.api(0),
                    "dataType": "json"
                }
            },
            "plugins": ["contextmenu", "dnd"],
            "contextmenu": {
                "items": that.customMenu,
            }

        }).on('create_node.jstree', function (e, data) {
        }).on('select_node.jstree', function (e, data) {
            if (data.node.data != "") {
                var arry = data.node.data.split("|");
                if (arry[0] == "2") {
                    if (arry[2] == "118") {
                        that.menubar.newItem.className = "disabled";// disabled
                    } else {
                        that.menubar.newItem.removeAttribute("class");// enabled
                    }
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
                    window.main.createModelDialog.show();
                },
            },
            "open": {
                "label": "打开",
                "action": function (obj) {
                    window.main.openOneEditor(node);
                },
            },
            // "copy": {
            //     "separator_before": true,
            //     "label": "复制到...",
            //     "icon": "fa fa-files-o",
            //     "action": function (obj) {
            //         window.main.openCopyDialog(node);
            //     },
            // },
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
                    var f = "0"; // object
                    if (arry[0] == "2") // folder
                        f = "1";
                    window.main.confirmInfoDialog.show("您确定要删除" + node.text
                        + "？", 2, node.id, arry[1], f);
                },
            }
        }
        if (arry[0] == "1") {
            delete items.create;
            delete items.open;
           // delete items.copy;
            delete items.move;
            delete items.remove;
            delete items.rename;
        } else if (arry[0] == "2") {
            delete items.open;
           // delete items.copy;
            if (arry[3] == "0") {
                delete items.move;
                delete items.remove;
                delete items.rename;
            }
            if (arry[2] == "118") {
                delete items.create;
            }
        } else if (arry[0] == "3") {
            if (arry[3] == "R" ||
                arry[3] == "F" ||
                arry[3] == "RF") {
                delete items.create;
            }
        }
        return items;
    };

    MainContent.prototype.dblclickJSTree = function (e) {
        e.preventDefault();
        var instance = $('#treeview').jstree(true);
        var sel = instance.get_selected(true)[0];
        if (sel != null) {
            var selected = instance.is_leaf(sel);
            var arry = sel.data.split("|");
            if (selected != null && arry[0] == "3") {
                window.main.mainContentPlugin.addNewTab(sel.text, sel.id,
                    arry[1], arry[3]);

                prefer.fm.addId(sel.id);
                var s = JSON.stringify(prefer);
                if (typeof (Storage) !== undefined) {
                    var userId = localStorage.getItem("userId");
                    localStorage.setItem(userId, s)
                }
            }
        }
    };

    MainContent.prototype.openEditor = function (eid, i) {
        if (eid != "" || eid != null) {
            var d = $('#treeview').jstree('get_node', eid);
            var instance = $('#treeview').jstree(true);
            var s = instance.select_node(eid);
            var sel = instance.get_selected(true)[i];
            if (sel != null) {
                var arry = sel.data.split("|");
                if (arry[0] == "3") {
                    this.mainContentPlugin.addNewTab(sel.text, sel.id, arry[1],
                        arry[3]);
                }
            }
        }
    };

    MainContent.prototype.openOneEditor = function (node) {
        var arry = node.data.split("|");
        window.main.mainContentPlugin.addNewTab(sel.text, sel.id, arry[1],
            arry[3]);
        window.main.savePrefer(node.id);
    };

    MainContent.prototype.createFolder = function (parent, name, type, parentid,
                                                   ownerid) {
        $("#progressbar").show();
        $.post(service.api(3), {
            ename: Utils.stringify(name),
            tpe: type,
            pid: parentid,
            oid: ownerid,
        }, function (x) {
            var instance = $('#treeview').jstree();
            var node = {
                id: x.id,
                text: Utils.parse(x.name),
                data: "2|" + x.owner + "|" + type + "|2",
                // parent: data.parent.id,
                icon: "glyphicon glyphicon-folder-open",
            };
            instance.create_node(parent, node, "last");
            instance.redraw(true);
            $('#treeview').jstree('deselect_all', true);
            $('#treeview').jstree('select_node', node.id);
            $("#progressbar").hide();
        });
    };

    MainContent.prototype.createForm = function (
        parent, name, parentid, ownerid, serviceType) {
        $("#progressbar").show();
        var that = this;
        $.post(service.api(4), {
            ename: Utils.stringify(name),
            pid: parentid,
            oid: ownerid,
            authorid: this.options.uid,
            author: this.options.uname,
            stype: serviceType,
        }, function (x) {
            var node = {
                id: x.id,
                text: Utils.parse(x.text),
                data: x.data,
                icon: "glyphicon glyphicon-file",
            };
            var instance = $('#treeview').jstree();
            instance.create_node(parent, node, "last");
            instance.redraw(true);
            $('#treeview').jstree('deselect_all', true);
            $('#treeview').jstree('select_node', node.id);
            that.mainContentPlugin.addNewTab(node.text, node.id,
                ownerid, "F");
            $("#progressbar").hide();
        });
    };

    MainContent.prototype.createReference = function (parent, name, parentid,
                                                      ownerid) {
        $("#progressbar").show();
        var that = this;
        $.post(service.api(7), {
            ename: Utils.stringify(name),
            pid: parentid,
            oid: ownerid,
        }, function (x) {
            var node = {
                id: x.id,
                text: Utils.parse(x.text),
                data: x.data,
                icon: "glyphicon glyphicon-file",
            };
            var instance = $('#treeview').jstree();
            instance.create_node(parent, node, "last");
            instance.redraw(true);
            $('#treeview').jstree('deselect_all', true);
            $('#treeview').jstree('select_node', node.id);
            window.main.mainContentPlugin.addNewTab(node.text, node.id, ownerid, "R");
            $("#progressbar").hide();
        });
    };

    MainContent.prototype.handleEvent = function (e) {
        switch (e.type) {
            case "load":
                this.autoHeight();
                break;
            case "resize":
                this.autoHeight();
                break;
            case "mousedown":
                this.doMouseDown(e);
                break;
            case "mousemove":
                this.doMouseMove(e);
                break;
            case "mouseup":
                this.doMouseUp(e);
                break;
        }
    };

    // f: 0: it is form/reference; 1: it is folder
    MainContent.prototype.doYesAction = function (e, type, id, oid, f) {
        this.confirmInfoDialog.hide();
        if (type == 1) { // reference/form modify
            this.mainContentPlugin.saveChange(1, this);
        } else if (type == 2) { // reference/form delete
            var that = this;
            if (f == 0) { // delete one object
                $("#progressbar").show();
                $.post(service.api(20, oid), {
                    id: id,
                    oid: oid,
                }).complete(function (data) {
                    $("#progressbar").hide();
                    instance = $('#treeview').jstree();
                    var p = instance.get_selected(true)[0];
                    $('#treeview').jstree('delete_node', p);
                    that.removeTab(id);
                    $("#progressbar").hide();
                });
            } else { // delete multiple objects
                instance = $('#treeview').jstree();
                var sel = instance.get_selected(true)[0];
                var fpids = [];
                fpids.push(id);
                if (sel.children_d.length > 0) {
                    fpids = sel.children_d;
                    fpids.push(id);
                }
                $("#progressbar").show();
                $.post(service.api(23, oid), {
                    ids: JSON.stringify(fpids),
                    oid: oid,
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

    // f: 0: it is form/reference; 1: it is folder
    MainContent.prototype.doNoAction = function (e, type, id, f) {
        this.mainContentPlugin.confirmInfoDialog.hide();
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

    // entity: the renamed object;
    // entityId: the renamed folder id or object id;
    MainContent.prototype.doRenameAction = function (entity, entityId, newname) {
        if (entity != null) {
            map[entity.id].stack.execute(new FMRenameCmd(entity, newname));
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
                this.updateObjectName(entityId, Utils.stringify(newname),
                    new Date().getTime(), arry[2], arry[3]);
            } else { // the node is process
                this.updateFolderName(entityId, Utils.stringify(newname),
                    arry[2]);
            }
        }
    };

    MainContent.prototype.updateObjectName = function (id, name,
                                                       lastupdatetime, ownerid, type) {
        $("#progressbar").show();
        $.post(service.api(21, ownerid), {
            id: id,
            entityname: name,
            lastupdate: lastupdatetime,
            type: type,
        }, function (x) {
            $("#progressbar").hide();
        });
    };

    MainContent.prototype.updateFolderName = function (id, name, ownerid) {
        $("#progressbar").show();
        $.post(service.api(22, ownerid), {
            id: id,
            entityname: name,
        }, function (x) {
            $("#progressbar").hide();
        });
    };

    MainContent.prototype.doSaveAction = function () {
        this.mainContentPlugin.saveChange(0, this);
    };

    MainContent.prototype.doCreateNewAction = function () {
        this.createModelDialog.show();
    };

    MainContent.prototype.saveObjects = function (id, closetab, parent, anchor) {
        $("#progressbar").show();
        var api = 0;
        if (map[id].currObject instanceof Form) {
            api = 6;
        } else if (map[id].currObject instanceof Reference) {
            api = 12;
        } else if (map[id].currObject instanceof ReleasedForm) {
            api = 18;
        }
        if (api == 12) {
            $.post(service.api(api), {
                ref: JSON.stringify(map[id].currObject),
                newl: JSON.stringify(map[id].newlist),
                updatedl: JSON.stringify(map[id].updatedlist),
                removedl: JSON.stringify(map[id].removedlist),
            }, function (data) {
                map[id].stack.save();
                if (closetab == 1) {
                    parent.cloaseTab(id, anchor);
                }
                $("#progressbar").hide();
            });
        } else {
            var frm = map[id].currObject.stringifyforJSON();
            $.post(service.api(api), {
                f: JSON.stringify(frm),
            }, function (data) {
                map[id].stack.save();
                if (closetab == 1) {
                    parent.cloaseTab(id, anchor);
                }
                $("#progressbar").hide();
            });
        }
    };

    MainContent.prototype.cloaseTab = function (procid, anchors) {
        delete map[procid];
        var anchor = $(anchors); // close tab
        $(anchor.attr('href')).remove(); // remove tab content;
        $(anchors).parent().remove(); // remove tab header <li>;
        // clear property sheet;
        this.clearPropertySheet();
        this.currentObjId = -1;
        $(".maincontent-nav-tabs li").children('a').first().click();
    };

    // myTabTitle: tab title, myTabID: process ID, myOwnerID: organization ID.
    MainContent.prototype.addNewTab = function (tabcontent, myTabTitle, myTabID,
                                                myOwnerID, type) {
        if (type == "F") {// form object
            var p = $(tabcontent).fmEditor({
                id: myTabID,
                basicpropsheet: this.mainContentPlugin.basicpropertySheets,
                propsheet: this.mainContentPlugin.propertySheets,
                owner: myOwnerID,
                width: this.mainContentPlugin.tabsWidth,
                height: this.mainContentPlugin.tabsHeight,
                parent: this,
                sid : this.options.sid,
                uid : this.options.uid,
                uname : this.options.uname,
            });
            map[myTabID] = p.data("fmEditor");
        } else if (type == "RF") {// released form object
            var instance = $('#treeview').jstree();
            var sel = instance.get_selected(true)[0];
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
            var p = $(tabcontent).fmFormPublishEditor({
                id: myTabID,
                userId: this.options.uid,
                userfullname: this.options.uname,
                ownername: orgName,
                basicpropsheet: this.mainContentPlugin.basicpropertySheets,
                propsheet: this.mainContentPlugin.propertySheets,
                owner: myOwnerID,
                width: this.mainContentPlugin.tabsWidth,
                height: this.mainContentPlugin.tabsHeight,
                sid : this.options.sid,
            });
            map[myTabID] = p.data("fmFormPublishEditor");
        } else if (type == "R") {// reference object
            var p = $(tabcontent).fmReferenceEditor({
                id: myTabID,
                basicpropsheet: this.mainContentPlugin.basicpropertySheets,
                propsheet: this.mainContentPlugin.propertySheets,
                owner: myOwnerID,
                width: this.mainContentPlugin.tabsWidth,
                height: this.mainContentPlugin.tabsHeight,
            });
            map[myTabID] = p.data("fmReferenceEditor");
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
        var t = document.getElementById("convasPane" + id);
        if (t != null) { // form tab
            // 84 is toolbar height + tab height;
            t.style.height = (h - 84) + "px";
        }
        var p = document.getElementById("accordion" + id);
        if (p != null) { // pallette
            p.style.height = (h - 84) + "px";
        }
        var t1 = document.getElementById("canvasPanel" + id);
        if (t1 != null) { // content canvas
            // 76 is 70(pallet width) + 2(border) + 4(gap)
            t1.style.width = (w - 76) + "px";
        }


        var t3 = document.getElementById("rlprocPane" + id);
        if (t3 != null) { // form tab
            // 84 is toolbar height + tab height;
            t3.style.height = (h - 82) + "px";
        }
        var t3 = document.getElementById("rlfrmCsnnvasPane" + id);
        if (t3 != null) { // released form painter content
            // 84 is toolbar height + tab height;
            t3.style.height = (h - 126) + "px";
        }
        var t5 = document.getElementById("rlpcanvasPanel" + id);
        if (t5 != null) {
            // released form canvas
            t5.style.width = (w) + "px";
        }
        var t2 = document.getElementById("rlfrmCanvasPanelRL" + id);
        if (t2 != null) {
            // released form canvas
            t2.style.width = (w) + "px";
        }
        var t4 = document.getElementById("refPanel" + id);
        if (t4 != null) {
            // reference
            t4.style.width = (w) + "px";
        }
    };

    MainContent.prototype.doEastResize = function (evt, id, dx) {
        var aap3 = document.getElementById("canvasPanel" + id);
        if (aap3 != null) {
            aap3.style.width = (parseInt(aap3.style.width) + dx) + "px";
        }
        var aap4 = document.getElementById("refPanel" + id);
        if (aap4 != null) {
            aap4.style.width = (parseInt(aap4.style.width) + dx) + "px";
        }
        var t1 = document.getElementById("rlpcanvasPanel" + id);
        if (t1 != null) {
            // released form
            t1.style.width = (parseInt(t1.style.width) + dx) + "px";
        }
        var t2 = document.getElementById("rlfrmCanvasPanelRL" + id);
        if (t2 != null) {
            // released form tab
            t2.style.width = (parseInt(t2.style.width) + dx) + "px";
        }
    };

    MainContent.prototype.doWestResize = function (evt, id, dx) {
        var t = document.getElementById("canvasPanel" + id);
        if (t != null) {
            t.style.width = (parseInt(t.style.width) - dx) + "px";
        }
        var t1 = document.getElementById("refPanel" + id);
        if (t1 != null) {
            t1.style.width = (parseInt(t1.style.width) - dx) + "px";
        }
        var t2 = document.getElementById("rlpcanvasPanel" + id);
        if (t2 != null) {
            // released form tab
            t2.style.width = (parseInt(t2.style.width) - dx) + "px";
        }
        var t3 = document.getElementById("rlfrmCanvasPanelRL" + id);
        if (t3 != null) {
            // released form tab
            t3.style.width = (parseInt(t3.style.width) - dx) + "px";
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
        if (t != null) {
            t.style.height = (parseInt(t.style.height) + dy) + "px";
        }
        var p = document.getElementById("accordion" + id);
        // pallette
        if (p != null) {
            p.style.height = (parseInt(p.style.height) + dy) + "px";
        }
        var t3 = document.getElementById("rlprocPane" + id);
        if (t3 != null) { // reference tab
            t3.style.height = (parseInt(t3.style.height) + dy) + "px";
        }
        var t4 = document.getElementById("rlfrmCsnnvasPane" + id);
        if (t4 != null) { // reference tab
            t4.style.height = (parseInt(t4.style.height) + dy) + "px";
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