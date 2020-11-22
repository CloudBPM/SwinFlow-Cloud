/**
 *
 */
var map = {};
var copyclip = null;
var bgcache = null;
;
(function ($, window, document, undefined) {
    var pluginName = "mainContent";
    var defaults = {
        id: "",
        parent: "",
        uid: "",
        ownerId: "",
    };

    var MainContent = function (element, options) {
        this.element = element;
        this.options = $.extend({
            id: "",
            parent: "",
            uid: "",
            ownerId: "",
        }, defaults, options);
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
                name: "om",
                uid: options.uid,
                parent: this,
                ownerId: options.ownerId,
            });
            this.mainContentPlugin = p4.data("mainContentPlugin");
        }
        // create new model dialog plugin
        var p4 = $(this.element).createModelDialog({
            id: "OM004",
            title: vendor + " - 新建",
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
        this.renameDialog = p5.data("renameEditDialog");
        var p = document.createElement("DIV");
        this.element.appendChild(p);
        // confirm message dialog plugin
        var p2 = $(p).confirmInfoDialog({
            id: "OM005",
            title: vendor + " - 提示",
            parent: this,
        });
        this.confirmInfoDialog = p2.data("confirmInfoDialog");
    };

    MainContent.prototype.loadTreeViewer = function (parent) {
        var that = this;
        var instance = $(parent)
            .jstree({
                "core": {
                    // so that create works
                    "multiple": true,
                    // "themes": {"dots": false},
                    "check_callback": true,
                    "data": {
                        "url": omservices.api(0, "mainContent"),
                        "dataType": "json"
                        // needed only if you do not supply JSON headers
                    }
                },
                "plugins": ["contextmenu", "dnd"],
                "contextmenu": {
                    'items': that.customMenu,
                }
            })
            .on('create_node.jstree', function (e, data) {
            })
            .on('load_node.jstree', function (e, data) {
                that.mainContentPlugin.loadfromStorage(that);
            })
            .on(
                'select_node.jstree',
                function (e, data) {
                    var arry = data.node.data.split("|");
                    if (arry[0] == "2") {
                        if (arry[2] == "135" || arry[2] == "136"
                            || arry[2] == "137" || arry[2] == "138" ||
                            arry[2] == "101" ) {
                            if (that.createModelDialog != undefined) {
                                that.createModelDialog.initData(
                                    arry[2], arry[1]);
                            }
                            that.menubar.newItem
                                .removeAttribute("class");// enabled
                        } else {
                            that.menubar.newItem.className = "disabled";// disabled
                        }
                    } else if (arry[0] == "3") {
                        if (arry[2] == "135" || arry[2] == "136"
                            || arry[2] == "137" || arry[2] == "138") {
                            if (that.createModelDialog != undefined) {
                                that.createModelDialog.initData(
                                    arry[2], arry[1]);
                            }
                            that.menubar.newItem
                                .removeAttribute("class");// enabled
                        } else {
                            that.menubar.newItem.className = "disabled";// disabled
                        }
                    } else {
                        that.menubar.newItem.className = "disabled";// disabled
                    }

                    if (data.node.data != undefined
                        && data.node.data != "") {
                        var arry = data.node.data.split("|");
                        that.options.ownerId = arry[1];
                        that.mainContentPlugin.options.ownerId = that.options.ownerId;
                        that.mainContentPlugin.basicpropertySheets.options.ownerId = arry[1];
                        that.mainContentPlugin.propertySheets.options.ownerId = arry[1];
                    }
                }).on("dblclick.jstree", this.dblclickJSTree);
    };

    MainContent.prototype.customMenu = function (node) {
        var arry = node.data.split("|");
        var items = {
            "create": {
                "label": "新建",
                "icon": "fa fa-plus",
                "action": function (obj) {// obj is action object
                    // arry[2]: type; arry[1]:ownerId
                    window.main.createModelDialog.initData(arry[2], arry[1]);
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
                        + "？", 2, node.id, arry[1], arry[0]);
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
            if (arry[2] != "107") {
                delete items.open;
            }
            delete items.copy;
            delete items.move;
            delete items.remove;
            delete items.rename;
            if (arry[2] != "101" && arry[2] != "135" && arry[2] != "136" && arry[2] != "137"
                && arry[2] != "138") {
                delete items.create;
            }
        } else if (arry[0] == "3") {
            if (arry[2] == "101" || arry[2] == "135" || arry[2] == "136" || arry[2] == "137"
                || arry[2] == "138" || arry[2] == "OfficeCalendar") {
                if (arry[2] == "OfficeCalendar") {
                    delete items.create;
                    delete items.copy;
                    delete items.move;
                    if (arry.length>3 && arry[3] == "1") {
                        delete items.remove;
                    }
                }
            } else {
                delete items.create;
                delete items.copy;
                delete items.move;
                delete items.remove;
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
            var selected = instance.is_leaf(sel);
            var arry = sel.data.split("|");
            if (selected != null) {
                if (arry[0] == "2") {
                    if (arry[2] != "101" &&
                        arry[2] != "134" &&
                        arry[2] != "135" &&
                        arry[2] != "136" &&
                        arry[2] != "137" &&
                        arry[2] != "138") {
                        window.main.mainContentPlugin.addNewTab(sel.text, sel.id,
                            arry[1], arry[2]);
                        prefer.om.addId(sel.id); // save tag id to Array
                        var s = JSON.stringify(prefer);
                        if (typeof (Storage) !== undefined) {
                            var userId = localStorage.getItem("userId");
                            localStorage.setItem(userId, s); // save prefer to
                        }
                    }
                } else if (arry[0] == "3") {
                    window.main.mainContentPlugin.addNewTab(sel.text, sel.id,
                        arry[1], arry[2]);
                    prefer.om.addId(sel.id); // save tag id to Array
                    var s = JSON.stringify(prefer);
                    if (typeof (Storage) !== undefined) {
                        var userId = localStorage.getItem("userId");
                        localStorage.setItem(userId, s); // save prefer to
                    }
                }
            }

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
                        arry[1], arry[2]);
                }
            }
        }
    };

    MainContent.prototype.openOneEditor = function (node) {
        var arry = node.data.split("|");
        window.main.mainContentPlugin.addNewTab(node.text, node.id, arry[1],
            arry[2]);
        window.main.savePrefer(node.id);
    };

    MainContent.prototype.createObject = function (parent,
                                                   name,
                                                   parentid,
                                                   ownerid,
                                                   type,
                                                   currowner,
                                                   topcategory) {
        $("#progressbar").show();
        var icn = "fa fa-cog";
        if(type == "101")
            icn = "glyphicon glyphicon-calendar";
        $.post(service.api(31, ownerid), { // 添加一个日历
            ename: Utils.stringify(name),
            pid: parentid,
            owner: ownerid,
            type: type,
            currowner: currowner,
        }, function (x) {
            var node = {
                id: x.id,
                text: Utils.parse(x.text),
                data: x.data,
                icon: icn,
            };
            var instance = $('#treeview').jstree();
            instance.create_node(parent, node, "last");
            instance.redraw(true);
            $('#treeview').jstree('deselect_all', true);
            $('#treeview').jstree('select_node', node.id);
            window.main.mainContentPlugin.addNewTab(node.text, node.id, ownerid, type);
            $("#progressbar").hide();
            window.main.savePrefer(node.id);
        });
    };

    MainContent.prototype.savePrefer = function (id) {
        prefer.pm.addId(id);
        var s = JSON.stringify(prefer);
        if (typeof (Storage) !== undefined) {
            var userId = localStorage.getItem("userId");
            localStorage.setItem(userId, s);
        }
    };

    MainContent.prototype.doSaveAction = function () {
        this.mainContentPlugin.saveChange(0, this);
    };

    MainContent.prototype.saveObjects = function (id, closetab, parent, anchor) {
        $("#progressbar").show();
        var cmd = 7;
        var org = "";
        if (map[id].currOwner instanceof Organization) {
            cmd = 7;
            org = map[id].currOwner.stringifyforJSON();
        } else if (map[id].currOwner instanceof Department) {
            cmd = 8;
            org = map[id].currOwner.stringifyforJSON();
        } else if (map[id].currOwner instanceof Division) {
            cmd = 9;
            org = map[id].currOwner.stringifyforJSON();
        } else if (map[id].currOwner instanceof ProjectTeam) {
            cmd = 10;
            org = map[id].currOwner.stringifyforJSON();
        } else if (map[id].updatedStaffs != undefined) {
            cmd = 15;
            if (map[id].updatedStaffs.length == 0) {
                return;
            }
            org = map[id].updatedStaffs;
        } else if (map[id].updatedGroups != undefined) {
            cmd = 19;
            if (map[id].updatedGroups.length == 0) {
                return;
            }
            org = map[id].updatedGroups;
        // } else if (map[id].currObject instanceof HomePageTemplate) {
        //     cmd = 28;
        //     org = map[id].currObject.stringifyforJSON();
        } else if (map[id].currObject instanceof Category) {
            cmd = 37;
            org = map[id].fetchObject();
        }

        var that = this;
        // Note: cache should not be re-used by repeated calls to
        // JSON.stringify.
        var cache = [];
        var str = JSON.stringify(org, function (key, value) {
            if (typeof value === 'object' && value !== null) {
                if (cache.indexOf(value) !== -1) {
                    // Circular reference found, discard key
                    return;
                }
                // Store value in our collection
                cache.push(value);
            }
            return value;
        });
        cache = null; // Enable garbage collection
        $.post(omservices.api(cmd, this.options.ownerId), {
            org: str,
        }, function (data) {
            //if (data.status == 1) {
                map[id].stack.save();
                if (map[id].updatedStaffs != undefined) {
                    map[id].updatedStaffs = [];
                    //} else if (map[id].currObject instanceof HomePageTemplate) {
                    //	window.location.reload();// 重新加载公司主页
                }
                if (closetab == 1) {// need to close this tab
                    parent.cloaseTab(id, anchor);
                }
                /*} else if (data.status == 0 || data.status == -10) {
                    messageDialog.show("您所在的组织或个人可能因封禁等原因,暂无本次操作权限");
                    that.init(that.options);*/
            //}
            $("#progressbar").hide();
        });
    };

    // f: 0: it is object; 1: it is folder
    MainContent.prototype.doYesAction = function (e, type, id, oid, f) {
        this.confirmInfoDialog.hide();
        if (type == 1) { // model modify
            this.mainContentPlugin.saveChange(1, this);
        } else if (type == 2) { // leaf object deletion
            var instance = $('#treeview').jstree();
            var sel = instance.get_selected(true)[0];
            var dary = sel.data;
            var ary = dary.split("|");
            var fpids = sel.children_d;
            fpids.push(id);
            if (sel.children_d.length > 0) {
                var that = this;
                $("#progressbar").show();
                if(ary[2] == "OfficeCalendar"){
                    $.post(omservices.api(59, oid), {
                        cid: id,
                    }).complete(function (data) {
                        for (var i = 0; i < fpids.length; i++) {
                            that.removeTab(fpids[i]);
                        }
                        $('#treeview').jstree('delete_node', sel);
                        $("#progressbar").hide();
                    });
                }else {
                    $.post(service.api(32, oid), {
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

    // f: 0: it is process; 1: it is folder
    MainContent.prototype.doNoAction = function (e, type, id, f) {
        this.confirmInfoDialog.hide();
    };

    // entity: the renamed object;
    // entityId: the renamed folder id or object id;
    MainContent.prototype.doRenameAction = function (entity, entityId, newname) {
        if (entity != null) {
            // map[entity.id].stack.execute(new PMRenameCmd(entity, newname));
        } else if (entityId != null) {
            var instance = $('#treeview').jstree();
            $('#treeview').jstree('deselect_all', true);
            $('#treeview').jstree('select_node', entityId);
            parent = instance.get_selected(true)[0];
            parent.text = newname;
            var arry = parent.data.split("|");
            instance.redraw(true);
            this.rename(entityId, Utils.stringify(newname), arry[1],arry[2]);
        }
    };

    MainContent.prototype.doCreateNewAction = function () {
        this.createModelDialog.show();
    };

    // copy
    MainContent.prototype.openCopyDialog = function (node) {
        if ($(this).selectionDialog != undefined) {
            var plugin = $(this).selectionDialog({
                id: "OM094",
                title: vendor + "  - 请选择目标",
                parent: this, // main content panel
            });
            this.selectionDialog = plugin.data("selectionDialog");
        }
        this.selectionDialog.show(node, 0);
    };

    // move
    MainContent.prototype.openMoveDialog = function (node) {
        if ($(this).selectionDialog != undefined) {
            var plugin = $(this).selectionDialog({
                id: "OM098",
                title: vendor + "  - 请选择目标",
                parent: this, // main content panel
            });
            this.selectionDialog = plugin.data("selectionDialog");
        }
        this.selectionDialog.show(node, 1);
    };

    MainContent.prototype.initData = function (source, treeview, okbutton,
                                               action) {
        var arry = source.data.split("|");
        var cowner = "";
        if (arry[0] == "2") {
            cowner = source.id;
        } else if (arry[0] == "3") {
            cowner = arry[3];
        }
        $(treeview).data('jstree', false).empty();
        $(treeview).jstree({
            "core": {
                "multiple": false,
                "check_callback": true,
                "data": {// arry[1]:orgid; arry[2]:folder type;
                    "url": service.cpmvapi(34, arry[1], arry[2], cowner),
                    "dataType": "json"
                }
            },
        }).on('loaded.jstree', function () {
            $(this).jstree('open_all');
        }).on('select_node.jstree', function (e, data) {
            if (action == 0) { // copy
                if (data.node.id == source.id) {
                    okbutton.classList.add("disabled");
                } else {
                    okbutton.classList.remove("disabled");
                }
            } else if (action == 0) { // move
                var children = source.children_d;
                var f = false;
                if (children != null && children.length > 0) {
                    for (var i = 0; i < children.length; i++) {
                        if (data.node.id == children.id) {
                            f = true;
                            break;
                        }
                    }
                    if (f) {
                        okbutton.classList.add("disabled");
                    } else {
                        okbutton.classList.remove("disabled");
                    }
                } else
                    okbutton.classList.remove("disabled");
            }

        })
    };

    MainContent.prototype.doSelectOKAction = function (node, action) {
        if (action == 0) { // copy
            this.copyObject(node);
        } else if (action == 1) { // move
            this.moveObject(node);
        }
    };

    // target folder object in tree viewer
    MainContent.prototype.copyObject = function (target) {
        instance = $('#treeview').jstree();
        var p = instance.get_selected(true)[0];
        if (p.data != null) {
            var ary = p.data.split("|");
            var that = this;
            var instance = $('#treeview').jstree();
            if (p.children_d.length > 0) {
                $.post(service.api(35, ary[1]), {
                    rid: p.id, // the selected node id
                    pid: JSON.stringify(p.children_d), // its children
                    fid: target.id, // taget folder ID
                    type: ary[2], // category type
                    cowner: ary[3], // top category ID
                    orgid: ary[1], // organization ID
                }).complete(function (r) {
                    r = r.responseJSON;
                    for (var i = 0; i < r.length; i++) {
                        var node = {
                            id: r[i].id,
                            text: r[i].text,
                            data: r[i].data,
                            icon: "fa fa-cog",
                        };
                        $('#treeview').jstree('deselect_all', true);
                        $('#treeview').jstree('select_node', r[i].parentId);
                        var parent = instance.get_selected(true)[0];
                        instance.create_node(parent, node, "last");
                        instance.redraw(true);
                    }
                    $('#treeview').jstree('deselect_all', true);
                    that.selectionDialog.hide();
                    // that.mainContentPlugin.addNewTab(r.text,
                    // r.id, ary[1], arry[2]);
                    $("#progressbar").hide();
                });
            }

        }
    };

    MainContent.prototype.moveObject = function (target) {
        instance = $('#treeview').jstree();
        var p = instance.get_selected(true)[0];
        if (p.data != null) {
            var ary = p.data.split("|");
            var that = this;
            var instance = $('#treeview').jstree();
            $.post(service.api(36, ary[1]), {
                rid: p.id, // the selected node id
                fid: target.id, // taget folder ID
            }).complete(function (r) {
                r = r.responseJSON;
                if (r != null) { // success
                    var parent = instance.get_selected(true)[0];
                    instance.move_node(p, target, "last");
                    instance.redraw(true);
                }
                $('#treeview').jstree('deselect_all', true);
                that.selectionDialog.hide();
                // that.mainContentPlugin.addNewTab(r.text,
                // r.id, ary[1], arry[2]);
                $("#progressbar").hide();
            });

        }
    };

    MainContent.prototype.rename = function (id, name, ownerid,type) {
        $("#progressbar").show();
        if(type == "OfficeCalendar"){
            $.ajax({
                url:omservices.api(58, ownerid),
                data:{ cid: id,
                      cname: name,},
                type:'POST',
                complete:function() {
                    $("#progressbar").hide();
                },
                dataType:'JSON'
            });
        }else {
            $.ajax({
                url:omservices.api(33, ownerid),
                data:{ id: id,
                    entityname: name,},
                type:'POST',
                complete:function() {
                    $("#progressbar").hide();
                },
                dataType:'JSON'
            });
        }
    };

    MainContent.prototype.doMouseDown = function (evt) {
    };

    MainContent.prototype.addNewTab = function (tabcontent,
                                                myTabTitle,
                                                myTabID,
                                                ownerID,
                                                type) {
        if (type == "107") {// organization structure
            var p = $(tabcontent).omOrganizationEditor({
                id: myTabID,
                basicpropsheet: this.mainContentPlugin.basicpropertySheets,
                propsheet: this.mainContentPlugin.propertySheets,
                width: this.mainContentPlugin.tabsWidth,
                height: this.mainContentPlugin.tabsHeight,
                ownerId: ownerID,
            });
            map[myTabID] = p.data("omOrganizationEditor");
            tabcontent.setAttribute("data", myTabID);
            $("#tabcontents").append(tabcontent);
        } else if (type == "Division") { // division structure
            var p = $(tabcontent).omDivisionEditor({
                id: myTabID,
                ownerId: ownerID,
                basicpropsheet: this.mainContentPlugin.basicpropertySheets,
                propsheet: this.mainContentPlugin.propertySheets,
                width: this.mainContentPlugin.tabsWidth,
                height: this.mainContentPlugin.tabsHeight,
            });
            map[myTabID] = p.data("omDivisionEditor");
            tabcontent.setAttribute("data", myTabID);
            $("#tabcontents").append(tabcontent);
        } else if (type == "Department") { // department structure
            var p = $(tabcontent).omDepartmentEditor({
                id: myTabID,
                ownerId: ownerID,
                basicpropsheet: this.mainContentPlugin.basicpropertySheets,
                propsheet: this.mainContentPlugin.propertySheets,
                width: this.mainContentPlugin.tabsWidth,
                height: this.mainContentPlugin.tabsHeight,
            });
            map[myTabID] = p.data("omDepartmentEditor");
            tabcontent.setAttribute("data", myTabID);
            $("#tabcontents").append(tabcontent);
        } else if (type == "ProjectTeam") { // project team structure
            var p = $(tabcontent).omProjectTeamEditor({
                id: myTabID,
                ownerId: ownerID,
                basicpropsheet: this.mainContentPlugin.basicpropertySheets,
                propsheet: this.mainContentPlugin.propertySheets,
                width: this.mainContentPlugin.tabsWidth,
                height: this.mainContentPlugin.tabsHeight,
            });
            map[myTabID] = p.data("omProjectTeamEditor");
            tabcontent.setAttribute("data", myTabID);
            $("#tabcontents").append(tabcontent);
        } else if (type == "OfficeCalendar" || type == "101") { // 办公日历
            var p = $(tabcontent).omOfficeCalendarEditor({
                id: myTabID,
                ownerId: ownerID,
                basicpropsheet: this.mainContentPlugin.basicpropertySheets,
                propsheet: this.mainContentPlugin.propertySheets,
                width: this.mainContentPlugin.tabsWidth,
                height: this.mainContentPlugin.tabsHeight,
            });
            map[myTabID] = p.data("omOfficeCalendarEditor");
            tabcontent.setAttribute("data", myTabID);
            $("#tabcontents").append(tabcontent);
        } else if (type == "145") { // 假期表
            var p = $(tabcontent).omHolidayEditor({
                id: myTabID,
                ownerId: ownerID,
                basicpropsheet: this.mainContentPlugin.basicpropertySheets,
                propsheet: this.mainContentPlugin.propertySheets,
                width: this.mainContentPlugin.tabsWidth,
                height: this.mainContentPlugin.tabsHeight,
            });
            map[myTabID] = p.data("omHolidayEditor");
            tabcontent.setAttribute("data", myTabID);
            $("#tabcontents").append(tabcontent);
        } else if (type == "102") { // 权限组
            var p = $(tabcontent).omAuthorityGroupEditor({
                id: myTabID, // folder ID
                ownerId: ownerID,
                basicpropsheet: this.mainContentPlugin.basicpropertySheets,
                propsheet: this.mainContentPlugin.propertySheets,
                width: this.mainContentPlugin.tabsWidth,
                height: this.mainContentPlugin.tabsHeight,
                parent: this,
            });
            map[myTabID] = p.data("omAuthorityGroupEditor");
            tabcontent.setAttribute("data", myTabID);
            $("#tabcontents").append(tabcontent);
        } else if (type == "103") { // 全体职员
            var p = $(tabcontent).omStaffEditor({
                id: myTabID, // folder ID
                ownerId: ownerID,
                basicpropsheet: this.mainContentPlugin.basicpropertySheets,
                propsheet: this.mainContentPlugin.propertySheets,
                width: this.mainContentPlugin.tabsWidth, // 打开界面的时候传入相应的长宽
                height: this.mainContentPlugin.tabsHeight,
                parent: this,
            });
            map[myTabID] = p.data("omStaffEditor");
            tabcontent.setAttribute("data", myTabID);
            $("#tabcontents").append(tabcontent);
        // } else if (type == "119") { // 主页制作
        //     var p = $(tabcontent).omHomePageEditor({
        //         id: myTabID, // folder ID
        //         ownerId: ownerID,
        //         basicpropsheet: this.mainContentPlugin.basicpropertySheets,
        //         propsheet: this.mainContentPlugin.propertySheets,
        //         width: this.mainContentPlugin.tabsWidth,
        //         height: this.mainContentPlugin.tabsHeight,
        //         parent: this,
        //     });
        //     map[myTabID] = p.data("omHomePageEditor");
        //     tabcontent.setAttribute("data", myTabID);
        //     $("#tabcontents").append(tabcontent);
        } else if (type == "120") { // 资料上传(营业执照、法人身份证等)
            var p = $(tabcontent).omLicenceEditor({
                id: myTabID, // folder ID
                ownerId: ownerID,
                basicpropsheet: this.mainContentPlugin.basicpropertySheets,
                propsheet: this.mainContentPlugin.propertySheets,
                width: this.mainContentPlugin.tabsWidth,
                height: this.mainContentPlugin.tabsHeight,
                parent: this,
            });
            map[myTabID] = p.data("omLicenceEditor");
            tabcontent.setAttribute("data", myTabID);
            $("#tabcontents").append(tabcontent);
        } else if (type == "122") { // 支付账号
            var p = $(tabcontent).omPaymentEditor({
                id: myTabID, // folder ID
                ownerId: ownerID,
                basicpropsheet: this.mainContentPlugin.basicpropertySheets,
                propsheet: this.mainContentPlugin.propertySheets,
                width: this.mainContentPlugin.tabsWidth,
                height: this.mainContentPlugin.tabsHeight,
                parent: this,
            });
            map[myTabID] = p.data("omPaymentEditor");
            tabcontent.setAttribute("data", myTabID);
            $("#tabcontents").append(tabcontent);
        } else if (type == "121") { // 文件管理
            var p = $(tabcontent).omFileManagementEditor({
                id: myTabID, // folder ID
                ownerId: ownerID,
                basicpropsheet: this.mainContentPlugin.basicpropertySheets,
                propsheet: this.mainContentPlugin.propertySheets,
                width: this.mainContentPlugin.tabsWidth,
                height: this.mainContentPlugin.tabsHeight,
                parent: this,
            });
            map[myTabID] = p.data("omFileManagementEditor");
            tabcontent.setAttribute("data", myTabID);
            $("#tabcontents").append(tabcontent);
        } else if (type == "135" || type == "136" || type == "137"
            || type == "138") { // 组织/部门项目组/岗位角色/级别类别编辑
            var p = $(tabcontent).omCategoryEditor({
                id: myTabID, // folder ID
                ownerId: ownerID,
                type: type,
                basicpropsheet: this.mainContentPlugin.basicpropertySheets,
                propsheet: this.mainContentPlugin.propertySheets,
                width: this.mainContentPlugin.tabsWidth,
                height: this.mainContentPlugin.tabsHeight,
                parent: this,
            });
            map[myTabID] = p.data("omCategoryEditor");
            tabcontent.setAttribute("data", myTabID);
            $("#tabcontents").append(tabcontent);
        }
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
        if (p != null) {
            p.style.height = (h - 84) + "px";
        }
        var p1 = document.getElementById("pcaccordion" + id);
        if (p1 != null) {
            p1.style.height = (h - 130) + "px";
        }
        var t = document.getElementById("convasPane" + id);
        if (t != null) {
            // 84 is toolbar height + tab height;
            t.style.height = (h - 84) + "px";
        }
        var t15 = document.getElementById("pcdesktopPane" + id);
        if (t15 != null) {
            // 84 is toolbar height + tab height;
            t15.style.height = (h - 130) + "px";
        }

        var t13 = document.getElementById("officeCalendarPane" + id);
        if (t13 != null) {
            // 84 is toolbar height + tab height;
            t13.style.height = (h - 84) + "px";
        }
        var t14 = document.getElementById("holidayPane" + id);
        if (t14 != null) {
            // 84 is toolbar height + tab height;
            t14.style.height = (h - 84) + "px";
        }

        var t6 = document.getElementById("mbconvasPane" + id);
        if (t6 != null) {
            // 84 is toolbar height + tab height;
            t6.style.height = (h - 130) + "px";
        }

        var p1 = document.getElementById("mbaccordion" + id);
        if (p1 != null) {
            p1.style.height = (h - 130) + "px";
        }

        var t1 = document.getElementById("canvasPanel" + id);
        if (t1 != null) {
            // 76 is 70(pallet width) + 2(border) + 4(gap)
            t1.style.width = (w - 76) + "px";
        }
        var t16 = document.getElementById("pcdesktopPanel" + id);
        if (t16 != null) {
            // 76 is 70(pallet width) + 2(border) + 4(gap)
            t16.style.width = (w - 76) + "px";
        }

        var t12 = document.getElementById("officeCalendarPanel" + id);
        if (t12 != null) {
            // 76 is 70(pallet width) + 2(border) + 4(gap)
            t12.style.width = (w) + "px";
        }

        var t5 = document.getElementById("mbcanvasPanel" + id);
        if (t5 != null) {
            // 76 is 70(pallet width) + 2(border) + 4(gap)
            t5.style.width = (w - 76) + "px";
        }

        var t3 = document.getElementById("cateUIPanel" + id);
        if (t3 != null) {
            t3.style.width = w + "px";
        }
        var t4 = document.getElementById("cateUIPane" + id);
        if (t4 != null) {
            t4.style.height = (h - 84) + "px";
        }

        var t2 = document.getElementById("listPanel" + id);
        if (t2 != null) {
            t2.style.width = w + "px";
        }
        var t11 = document.getElementById("license" + id);
        if (t11 != null) {
            t11.style.height = (h - 94) + "px";
        }

        var t7 = document.getElementById("idcard" + id);
        if (t7 != null) {
            t7.style.height = (h - 94) + "px";
        }
        var t8 = document.getElementById("filemanagepane" + id);
        if (t8 != null) {
            t8.style.height = (h - 168) + "px";
        }
        var t9 = document.getElementById("filemanage" + id);
        if (t9 != null) {
            t9.style.width = w + "px";
        }
        var t10 = document.getElementById("companyLOGO" + id);
        if (t10 != null) {
            t10.style.height = (h - 94) + "px";
        }
    };

    MainContent.prototype.doEastResize = function (evt, id, dx) {
        var t = document.getElementById("canvasPanel" + id);
        if (t != null) {
            t.style.width = (parseInt(t.style.width) + dx) + "px";
        }
        var t7 = document.getElementById("pcdesktopPanel" + id);
        if (t7 != null) {
            t7.style.width = (parseInt(t7.style.width) + dx) + "px";
        }

        var t6 = document.getElementById("officeCalendarPanel" + id);
        if (t6 != null) {
            t6.style.width = (parseInt(t6.style.width) + dx) + "px";
        }

        var t2 = document.getElementById("listPanel" + id);
        if (t2 != null) {
            t2.style.width = (parseInt(t2.style.width) + dx) + "px";
        }

        var t4 = document.getElementById("mbcanvasPanel" + id);
        if (t4 != null) {
            t4.style.width = (parseInt(t4.style.width) + dx) + "px";
        }
        var t5 = document.getElementById("cateUIPanel" + id);
        if (t5 != null) {
            t5.style.width = (parseInt(t5.style.width) + dx) + "px";
        }
        var t3 = document.getElementById("filemanage" + id);
        if (t3 != null) {
            t3.style.width = (parseInt(t3.style.width) - dx) + "px";
        }

    };

    MainContent.prototype.doWestResize = function (evt, id, dx) {
        var t = document.getElementById("canvasPanel" + id);
        if (t != null) {
            t.style.width = (parseInt(t.style.width) - dx) + "px";
        }
        var t7 = document.getElementById("pcdesktopPanel" + id);
        if (t7 != null) {
            t7.style.width = (parseInt(t7.style.width) - dx) + "px";
        }

        var t6 = document.getElementById("officeCalendarPanel" + id);
        if (t6 != null) {
            t6.style.width = (parseInt(t6.style.width) - dx) + "px";
        }

        var t2 = document.getElementById("listPanel" + id);
        if (t2 != null) {
            t2.style.width = (parseInt(t2.style.width) - dx) + "px";
        }
        var t3 = document.getElementById("filemanage" + id);
        if (t3 != null) {
            t3.style.width = (parseInt(t3.style.width) - dx) + "px";
        }
        var t4 = document.getElementById("mbcanvasPanel" + id);
        if (t4 != null) {
            t4.style.width = (parseInt(t4.style.width) - dx) + "px";
        }
        var t5 = document.getElementById("cateUIPanel" + id);
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
        var t14 = document.getElementById("pcdesktopPane" + id);
        if (t14 != null) {
            t14.style.height = (parseInt(t14.style.height) + dy) + "px";
        }
        var t = document.getElementById("convasPane" + id);
        if (t != null) {
            t.style.height = (parseInt(t.style.height) + dy) + "px";
        }

        var t12 = document.getElementById("officeCalendarPane" + id);
        if (t12 != null) {
            t12.style.height = (parseInt(t12.style.height) + dy) + "px";
        }
        var t13 = document.getElementById("holidayPane" + id);
        if (t13 != null) {
            t13.style.height = (parseInt(t13.style.height) + dy) + "px";
        }
        var p = document.getElementById("accordion" + id);
        if (p != null) {
            p.style.height = (parseInt(p.style.height) + dy) + "px";
        }
        var p1 = document.getElementById("pcaccordion" + id);
        if (p1 != null) {
            p1.style.height = (parseInt(p1.style.height) + dy) + "px";
        }
        var t1 = document.getElementById("license" + id);
        if (t1 != null) {
            t1.style.height = (parseInt(t1.style.height) + dy) + "px";
        }

        var t2 = document.getElementById("idcard" + id);
        if (t2 != null) {
            t2.style.height = (parseInt(t2.style.height) + dy) + "px";
        }

        var t3 = document.getElementById("box" + id);
        if (t3 != null) {
            t3.style.height = (parseInt(t3.style.height) + dy) + "px";
            t3.style.width = (parseInt(t3.style.height) + dy) + "px";
        }

        var t4 = document.getElementById("box2" + id);
        if (t4 != null) {
            t4.style.height = (parseInt(t4.style.height) + dy) + "px";
            t4.style.width = (parseInt(t4.style.height) + dy) + "px";
        }

        var t5 = document.getElementById("filemanagepane" + id);
        if (t5 != null) {
            t5.style.height = (parseInt(t5.style.height) + dy) + "px";
        }

        var t6 = document.getElementById("listPane" + id);
        if (t6 != null) {
            t6.style.height = (parseInt(t6.style.height) + dy) + "px";
        }

        var t7 = document.getElementById("listFilePane" + id);
        if (t7 != null) {
            t7.style.height = (parseInt(t7.style.height) + dy) + "px";
        }

        var t8 = document.getElementById("cateUIPane" + id);
        if (t8 != null) {
            t8.style.height = (parseInt(t8.style.height) + dy) + "px";
        }

        var t9 = document.getElementById("mbconvasPane" + id);
        if (t9 != null) {
            t9.style.height = (parseInt(t9.style.height) + dy) + "px";
        }

        var p1 = document.getElementById("mbaccordion" + id);
        if (p1 != null) {
            p1.style.height = (parseInt(p1.style.height) + dy) + "px";
        }

        var t10 = document.getElementById("companyLOGO" + id);
        if (t10 != null) {
            t10.style.height = (parseInt(t10.style.height) + dy) + "px";
        }
        var t11 = document.getElementById("box3" + id);
        if (t11 != null) {
            t11.style.height = (parseInt(t11.style.height) + dy) + "px";
            t11.style.width = (parseInt(t11.style.height) + dy) + "px";
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