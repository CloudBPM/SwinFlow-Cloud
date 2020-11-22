;
(function ($, window, document, undefined) {
    var pluginName = "mbUIEditor";
    var defaults = {
        id: "",
        pid: "",
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
            pid: "",
            ownerId: "",
            basicpropsheet: "",
            propsheet: "",
            width: 0,
            height: 0,
            parent: "",
            owner: "",
        }, defaults, options);
        this._defaults = defaults;
        this._name = pluginName;
        this.stack = options.parent.stack;
        this.currObject = null;
        this.canvas = null;
        this.context = null;
        this.basicpropsheet = options.basicpropsheet;
        this.propsheet = options.propsheet;

        // 0: default status;
        // 1: single selection;
        // 2: multiple selection;
        // 3: draw department;
        this.editorStatus = 0;
        this.moving = false;
        this.creating = null;
        this.selected = []; // selected objects
        this.mouse0 = null;
        this.mouse1 = null;
        this.mousepressed = false;

        this.init(options);
        this.pallet(options);
        this.shading(options);

    };

    Editor.prototype.getDirty = function () {
        return this.stack.isDirty();
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
        this.painterRow = document.createElement("DIV");
        editorPanel.appendChild(this.painterRow);
        this.painterRow.className = "row";
        this.painterRow.style.margin = "0px";
        this.painterRow.style.marginTop = "2px";
        this.painterRow.style.padding = "0px";
    };

    Editor.prototype.loading = function (object) {
        this.category = object; // current category
        if (object.mbUIContent != null) {
            this.currObject = object.mbUIContent;
        } else {
            this.currObject = new MobileUI();
        }
        this.initialize();
        this.repaint();
        this.setPropertySheet();
    };

    Editor.prototype.initialize = function () {
        this.currObject.context = this.context;
        if (this.currObject.children.length > 0) {
            var tb = this.currObject.children[this.currObject.selectBoardIndex]
                .getTopBar();
            if (tb != null) {
                var item = tb.getSelectedItem();
                if (item != null) {
                    this.currObject.children[this.currObject.selectBoardIndex]
                        .addChild(item.children);
                } else {
                    item = tb.getFirstItem();
                    if (item != null) {
                        item.setSelected(true);
                        this.currObject.children[this.currObject.selectBoardIndex]
                            .addChild(item.children);
                    }
                }
            }
        }
    };

    Editor.prototype.createPalletBar = function (id, barname, expanded, clpin,
                                                 parent) {
        var panel = document.createElement("DIV");
        parent.appendChild(panel);
        panel.className = "panel panel-default";
        var panelHeading = document.createElement("DIV");
        panel.appendChild(panelHeading);
        panelHeading.className = "panel-heading";
        panelHeading.setAttribute("role", "tab");
        panelHeading.id = "heading" + id;

        var h4title = document.createElement("h4");
        panelHeading.appendChild(h4title);
        h4title.className = "panel-title";

        var atitle = document.createElement("a");
        h4title.appendChild(atitle);
        atitle.setAttribute("role", "button");
        atitle.setAttribute("data-toggle", "collapse");
        atitle.setAttribute("data-parent", "#accordion");
        atitle.setAttribute("href", "#collapse" + id);
        atitle.setAttribute("aria-expanded", "" + expanded + "");
        atitle.setAttribute("aria-controls", "collapse" + id);
        atitle.text = barname;

        var panelBody = document.createElement("DIV");
        panel.appendChild(panelBody);
        panelBody.id = "collapse" + id;
        panelBody.className = "panel-collapse collapse " + clpin;
        panelBody.setAttribute("role", "tabpanel");
        panelBody.setAttribute("aria-labelledby", "heading" + id);

        var componentList = document.createElement("ul");
        panelBody.appendChild(componentList);
        componentList.className = "list-group";

        return componentList;
    };

    Editor.prototype.pallet = function (options) {
        var palletPanel = document.createElement("DIV");
        this.painterRow.appendChild(palletPanel);
        palletPanel.id = "mbaccordion" + options.pid;
        palletPanel.className = "col";
        palletPanel.style.width = "72px";
        palletPanel.style.margin = "0px";
        palletPanel.style.padding = "0px";
        palletPanel.style.overflowY = "auto";
        palletPanel.style.height = options.height + "px";
        var group = document.createElement("DIV");
        palletPanel.appendChild(group);
        group.id = "accordion";
        group.className = "panel-group";
        group.style.margin = "0px";
        group.style.padding = "0px";
        group.style.width = "72px";
        group.style.minWidth = "72px";
        group.style.maxWidth = "72px";

        group.setAttribute('role', 'tablist');// $("input").attr("value","txt");
        group.setAttribute('aria-multiselectable', 'true');

        var taskbar1 = this.createPalletBar("One" + options.pid, "布局", true, "in", group);
        taskbar1.appendChild(this.createIconOnBar("新建首页板块", "d", options.id,
            "img/mb_home_board_32x32.png"));
        taskbar1.appendChild(this.createIconOnBar("新建板块", "e", options.id,
            "img/mb_board_32x32.png"));
        taskbar1.appendChild(this.createIconOnBar("搜索栏", "f", options.id,
            "img/mb_search_32x32.png"));
        taskbar1.appendChild(this.createIconOnBar("顶部菜单栏", "g", options.id,
            "img/mb_group_32x32.png"));
        taskbar1.appendChild(this.createIconOnBar("顶部菜单项", "h", options.id,
            "img/mb_menuitem_32x32.png"));
        taskbar1.appendChild(this.createIconOnBar("内容面板", "p", options.id,
            "img/mb_menuitem_32x32.png"));
        taskbar1.appendChild(this.createIconOnBar("单行单列", "i", options.id,
            "img/single_col_32x32.png"));
        taskbar1.appendChild(this.createIconOnBar("单行两列", "j", options.id,
            "img/single_two_cols_32x32.png"));
        taskbar1.appendChild(this.createIconOnBar("单行三列", "k", options.id,
            "img/single_three_cols_32x32.png"));
        taskbar1.appendChild(this.createIconOnBar("单行四列", "l", options.id,
            "img/single_four_cols_32x32.png"));
        taskbar1.appendChild(this.createIconOnBar("单行五列", "m", options.id,
            "img/single_five_cols_32x32.png"));
        taskbar1.appendChild(this.createIconOnBar("创建列", "n", options.id,
            "img/column_32x32.png"));
        taskbar1.appendChild(this.createIconOnBar("按钮", "o", options.id,
            "img/mb_button_32x32.png"));
    };

    Editor.prototype.createIconOnBar = function (dptname, type, imgid, iconsrc) {
        var componentItem = document.createElement("li");
        componentItem.className = "list-group-item";
        var icon = this.createIcon(dptname, type, imgid, iconsrc, this);
        componentItem.appendChild(icon);
        return componentItem;
    };

    Editor.prototype.createIcon = function (partname, type, imgid, iconsrc,
                                            parent) {
        var icon = document.createElement("img");
        icon.id = partname + " " + imgid;
        icon.setAttribute("src", iconsrc);
        icon.setAttribute("title", partname);
        icon.setAttribute("type", type);
        icon.setAttribute("draggable", "true");
        icon.addEventListener('click', function (e) {
            parent.setCursor("crosshair");
            parent.creating = this.getAttribute("type");
            parent.editorStatus = 3; // draw part
        });
        icon.addEventListener('dragstart', function (e) {
            var t = this.getAttribute("type");
            parent.creating = t;
            e.dataTransfer.setData("Text", e.target.id);
            e.dataTransfer.setData("type", t);
            parent.editorStatus = 3; // draw part
        });
        return icon;
    };

    Editor.prototype.shading = function (options) {
        var canvasPanel = document.createElement("DIV");
        this.painterRow.appendChild(canvasPanel);

        canvasPanel.id = "mbcanvasPanel" + options.pid;
        canvasPanel.className = "col";
        canvasPanel.style.width = (options.width - 76) + "px";
        canvasPanel.style.margin = "0px";
        canvasPanel.style.marginLeft = "4px";
        canvasPanel.style.padding = "0px";

        this.canvasPane = document.createElement("DIV");
        canvasPanel.appendChild(this.canvasPane);

        this.canvasPane.className = "col-lg-12 col-md-12 col-sm-12 col-xs-12";
        this.canvasPane.id = "mbconvasPane" + options.pid;
        this.canvasPane.style.margin = "0px";
        this.canvasPane.style.padding = "0px";
        this.canvasPane.style.overflowX = "auto";
        this.canvasPane.style.overflowY = "auto";
        this.canvasPane.style.border = "1px solid #ddd";
        this.canvasPane.style.height = options.height + "px";

        this.canvas = document.createElement("canvas");
        this.canvasPane.appendChild(this.canvas);
        this.canvas.style.cursor = "default";
        this.canvas.width = (options.width - 80);
        this.canvas.height = 1100;
        this.context = this.canvas.getContext("2d");
        this.canvas.addEventListener("mousedown", this, false);
        this.canvas.addEventListener('mousemove', this, false);
        this.canvas.addEventListener('mouseup', this, false);
        this.canvas.addEventListener('mouseout', this, false);
        this.canvas.addEventListener('drop', this, false);
        this.canvas.addEventListener('dragover', this, false);
        window.addEventListener('keydown', this, true);

    };

    Editor.prototype.getPointOnCanvas = function (evt) {
        var mouse = {
            x: evt.clientX - this.canvas.getBoundingClientRect().left,
            y: evt.clientY - this.canvas.getBoundingClientRect().top,
        };
        return mouse;
    };

    Editor.prototype.repaint = function () {
        this.context.clearRect(0, 0, (this.options.width - 80), 1100);
        this.currObject.drawOnContext();
    };

    Editor.prototype.lookupObjects = function (mouse) {
        return this.currObject.findCovered(mouse.x, mouse.y);
    };

    Editor.prototype.handleEvent = function (e) {
        switch (e.type) {
            case "mousedown":
                this.doMouseDown(e);
                break;
            case "mousemove":
                this.doMouseMove(e);
                break;
            case "mouseup":
                this.doMouseUp(e);
                break;
            case "mouseout":
                break;
            case "drop":
                this.doDrop(e);
                break;
            case "dragover":
                this.doDragOver(e);
                break;
            case "keydown":
                this.doKeypress(e);
                break;
            case "click":
                this.doClick(e);
                break;
            case "dblclick":
                e.preventDefault();
                break;
        }
    };

    Editor.prototype.doClick = function (evt) {
    };

    Editor.prototype.setPropertySheet = function () {
        var obj = this.currObject;// mobile UI object.
        if (this.selected) {
            obj = this.selected;
        }
        if (this.basicpropsheet != null) {
            this.basicpropsheet.setSheet(obj, this.currObject);
        }
        if (this.propsheet != null) {
            this.propsheet.setSheet(obj, this.currObject, this.category);
        }
    };

    Editor.prototype.setCursor = function (cursor) {
        this.canvas.style.cursor = cursor;
    };

    Editor.prototype.doKeypress = function (evt) {
    };

    Editor.prototype.doMouseDown = function (evt) {
        evt.preventDefault();
        $('.nav-tabs a[href="#cateuitab_' + this.currObject.id + '"]').tab(
            'show');
        this.mousepressed = true;
        this.mouse0 = this.getPointOnCanvas(evt);
        this.options.parent.disableAllArrowButtons();
        if (this.editorStatus == 0) { // default status
            var a = this.lookupObjects(this.mouse0);
            if (a != null) {
                this.currObject.deselectAll();
                a.setSelected(true);
                this.selected = a;
                if (a instanceof MbTopBarItem) {
                    this.clip = a;
                    this.currObject.findCurrentBoard().addChild(a.children);
                    this.clipparent = this.currObject.findParent(a);
                    var pos = this.clipparent.getPosition(a);
                    if (pos == 0) {
                        this.options.parent.enableRightButton();
                    } else if (pos == this.clipparent.children.length - 1) {
                        this.options.parent.enableLeftButton();
                    } else {
                        this.options.parent.enableRightButton();
                        this.options.parent.enableLeftButton();
                    }
                } else if (a instanceof MbRow) {
                    this.clip = a;
                    this.clipparent = this.currObject.findParent(a);
                    var pos = this.clipparent.getPosition(a);
                    if (pos == 0) {
                        this.options.parent.enableDownButton();
                    } else if (pos == this.clipparent.children.length - 1) {
                        this.options.parent.enableUpButton();
                    } else {
                        this.options.parent.enableDownButton();
                        this.options.parent.enableUpButton();
                    }
                }
                this.editorStatus = 1;
            }
            this.repaint();
            this.setPropertySheet();
        } else if (this.editorStatus == 1) {
            var a = this.lookupObjects(this.mouse0);
            if (a != null) {
                this.currObject.deselectAll();
                a.setSelected(true);
                this.selected = a;
                if (a instanceof MbTopBarItem) {
                    this.clip = a;
                    this.currObject.findCurrentBoard().addChild(a.children);
                    this.clipparent = this.currObject.findParent(a);
                    var pos = this.clipparent.getPosition(a);
                    if (pos == 0) {
                        this.options.parent.enableRightButton();
                    } else if (pos == this.clipparent.children.length - 1) {
                        this.options.parent.enableLeftButton();
                    } else {
                        this.options.parent.enableRightButton();
                        this.options.parent.enableLeftButton();
                    }
                } else if (a instanceof MbRow) {
                    this.clip = a;
                    this.clipparent = this.currObject.findParent(a);
                    var pos = this.clipparent.getPosition(a);
                    if (pos == 0) {
                        this.options.parent.enableDownButton();
                    } else if (pos == this.clipparent.children.length - 1) {
                        this.options.parent.enableUpButton();
                    } else {
                        this.options.parent.enableDownButton();
                        this.options.parent.enableUpButton();
                    }
                }
            } else {
                this.currObject.deselectAll();
            }
            this.setPropertySheet();
            this.repaint();
        } else if (this.editorStatus == 3) { // draw department
            this.setCursor("crosshair");
            this.repaint();
        }
        // code below prevents the mouse down from having an effect on the main
        // browser window:
        if (evt.preventDefault) {
            evt.preventDefault();
        } else if (evt.returnValue) { // standard
            evt.returnValue = false;
        } // older IE
    };

    Editor.prototype.dropoutSelected = function (obj) {
        for (var i = 0; i < this.selected.length; i++) {
            if (this.selected[i].id == obj.id) {
                this.selected[i].setSelected(false);
                this.selected.splice(i, 1);
            }
        }
    };

    Editor.prototype.withinSelected = function (obj) {
        for (var i = 0; i < this.selected.length; i++) {
            if (this.selected[i].id == obj.id) {
                return true;
            }
        }
        return false;
    };

    Editor.prototype.getMouseButton = function (event) {
        var button;
        if (event.which == null) { /* IE case */
            button = (event.button < 2) ? "LEFT"
                : ((event.button == 4) ? "MIDDLE" : "RIGHT");
        } else { /* All others */
            button = (event.which < 2) ? "LEFT"
                : ((event.which == 2) ? "MIDDLE" : "RIGHT");
        }
        return button;
    };

    Editor.prototype.doMouseMove = function (evt) {
        evt.preventDefault();
        if (this.mousepressed) {
            if (this.editorStatus == 1) { // default status
                this.mouse1 = this.getPointOnCanvas(evt);
                var dx = this.mouse1.x - this.mouse0.x;
                var dy = this.mouse1.y - this.mouse0.y;
                var sel = this.lookupObjects(this.mouse0);
                if (!this.moving) {
                    if (sel instanceof MbButton) {
                        this.currObject.deselectAll();
                        sel.setSelected(true);
                        // this.clipparent = this.currObject.removeObject(sel);
                        this.clip = sel;
                    } else if (sel instanceof MbBoard) {
                        this.currObject.deselectAll();
                        sel.setSelected(true);
                        this.clip = sel;
                    } else if (sel instanceof MbTopBarItem) {
                        this.currObject.deselectAll();
                        sel.setSelected(true);
                        // 放开以后会有问题，以后在研究
                        //this.clipparent = this.currObject.removeObject(sel);
                        this.clip = sel;
                        this.repaint();
                    } else if (sel instanceof MbRow) {
                        this.currObject.deselectAll();
                        sel.setSelected(true);
                        // 放开以后会有问题，以后在研究
                        //this.clipparent = this.currObject.removeObject(sel);
                        this.clip = sel;
                        this.repaint();
                    }
                } else {
                    var a = this.lookupObjects(this.mouse1);
                    if (this.clip instanceof MbButton && a instanceof MbColumn) {
                        Utils.stopDefaultEvent(evt);
                        this.repaint();
                        if (this.clip != null) {
                            this.clip.x0 = this.mouse1.x;
                            this.clip.y0 = this.mouse1.y;
                            this.clip.x1 = this.mouse1.x + this.clip.width;
                            this.clip.y1 = this.mouse1.y + this.clip.height;
                            this.clip.drawOnContext();
                        }
                    } else if (this.clip instanceof MbRow
                        && a instanceof MbContentPanel) {
                        Utils.stopDefaultEvent(evt);
                    } else if (this.clip instanceof MbTopBarItem
                        && a instanceof MbTopBar) {
                        Utils.stopDefaultEvent(evt);
                    }
                    this.repaint();
                }
                if (dx != 0 || dy != 0) {
                    this.moving = true;
                    //this.setCursor("move");
                }
                this.mouse0.x = this.mouse1.x;
                this.mouse0.y = this.mouse1.y;


            }
        }
        Utils.stopDefaultEvent(evt);
        // // code below prevents the mouse down from having an effect on the main
        // // browser window:
        // if (evt.preventDefault) {
        //     evt.preventDefault();
        // } // standard
        // else if (evt.returnValue) {
        //     evt.returnValue = false;
        // } // older IE
    };

    Editor.prototype.doMouseUp = function (evt) {
        if (this.mousepressed) {
            if (this.moving) {
                var a = this.lookupObjects(this.mouse1);
                if (this.clip instanceof MbButton && a instanceof MbColumn) {
                    // a.addChild(this.clip);
                } else if (this.clip instanceof MbRow
                    && a instanceof MbContentPanel) {
                    // this.mouse1 = this.getPointOnCanvas(evt);
                    // var j = this.clipparent.findPosition(this.mouse1.x,
                    //     this.mouse1.y);
                    // if (j >= 0) {
                    //     this.clipparent.insertChild(j, this.clip);
                    // } else {
                    //     this.clipparent.insertChild(
                    //         this.clipparent.selectedIndex, this.clip);
                    // }
                } else if (this.clip instanceof MbTopBarItem
                    && a instanceof MbTopBar
                    || this.clip instanceof MbTopBarItem
                    && a instanceof MbTopBarItem) {
                    // this.mouse1 = this.getPointOnCanvas(evt);
                    // var j = this.clipparent.findPosition(this.mouse1.x,
                    //     this.mouse1.y);
                    // if (j >= 0) {
                    //     this.clipparent.insertChild(j, this.clip);
                    // } else {
                    //     this.clipparent.insertChild(
                    //         this.clipparent.selectedIndex, this.clip);
                    // }
                } else {
                    // if (this.clip != null) {
                    //     if (this.clip instanceof MbButton
                    //         && !(a instanceof MbColumn)) {
                    //         this.clipparent.addChild(this.clip);
                    //     } else if (this.clip instanceof MbTopBarItem
                    //         && !(a instanceof MbTopBar)
                    //         || this.clip instanceof MbTopBarItem
                    //         && !(a instanceof MbTopBarItem)) {
                    //         if (this.clipparent.selectedIndex > 0) {
                    //             this.clipparent.insertChild(
                    //                 this.clipparent.selectedIndex + 1,
                    //                 this.clip);
                    //         } else if (this.clipparent.selectedIndex == 0) {
                    //             this.clipparent.insertChild(0, this.clip);
                    //         }
                    //     } else if (this.clip instanceof MbRow
                    //         && !(a instanceof MbContentPanel)) {
                    //         if (this.clipparent.selectedIndex > 0) {
                    //             this.clipparent.insertChild(
                    //                 this.clipparent.selectedIndex + 1,
                    //                 this.clip);
                    //         } else if (this.clipparent.selectedIndex == 0) {
                    //             this.clipparent.insertChild(0, this.clip);
                    //         }
                    //     }
                    // }
                }
                this.setCursor("default");
                this.moving = false;
                this.clip = null;
                this.repaint();
                this.editorStatus = 1;
                this.selected = this.clip;
            }
        }
        this.mousepressed = false;
        Utils.stopDefaultEvent(evt);
    };

    Editor.prototype.doDragOver = function (evt) {
        this.mouse0 = this.getPointOnCanvas(evt);
        if (this.editorStatus == 3) { // default status
            if (this.creating == "e") {
                if (this.currObject.children.length < 5) {
                    Utils.stopDefaultEvent(evt);
                    var part = this.createTempObject(this.mouse0);
                    this.repaint();
                    part.drawOnContext();
                }
            } else if (this.creating == "f" || this.creating == "g") {
                var a = this.lookupObjects(this.mouse0);
                var part = this.createTempObject(this.mouse0);
                if (a instanceof MbBoard) {
                    if (a.children.length < 3) {
                        Utils.stopDefaultEvent(evt);
                        this.repaint();
                        part.drawOnContext();
                    } else {
                        this.repaint();
                    }
                } else {
                    this.repaint();
                }
            } else if (this.creating == "p") {
                var a = this.lookupObjects(this.mouse0);
                var part = this.createTempObject(this.mouse0);
                if (a instanceof MbBoard) {
                    if (a.children.length < 3) {
                        if (!a.hasMenubar()) {
                            Utils.stopDefaultEvent(evt);
                            this.repaint();
                            part.drawOnContext();
                        } else {
                            this.repaint();
                        }
                    } else {
                        this.repaint();
                    }
                } else {
                    this.repaint();
                }
            } else if (this.creating == "h") {
                var a = this.lookupObjects(this.mouse0);
                var part = this.createTempObject(this.mouse0);
                if (a instanceof MbTopBar) {
                    Utils.stopDefaultEvent(evt);
                    this.repaint();
                    part.drawOnContext();
                } else {
                    this.repaint();
                }
            } else if (this.creating == "i" || this.creating == "j"
                || this.creating == "k" || this.creating == "l"
                || this.creating == "m") {
                var a = this.lookupObjects(this.mouse0);
                var part = this.createTempObject(this.mouse0);
                if (a instanceof MbContentPanel) {
                    Utils.stopDefaultEvent(evt);
                    this.repaint();
                    part.drawOnContext();
                } else {
                    this.repaint();
                }
            } else if (this.creating == "n") {
                var a = this.lookupObjects(this.mouse0);
                var part = this.createTempObject(this.mouse0);
                if (a instanceof MbRow) {
                    Utils.stopDefaultEvent(evt);
                    this.repaint();
                    part.drawOnContext();
                } else {
                    this.repaint();
                }
            } else if (this.creating == "o") {
                var a = this.lookupObjects(this.mouse0);
                var part = this.createTempObject(this.mouse0);
                if (a instanceof MbColumn) {
                    Utils.stopDefaultEvent(evt);
                    this.repaint();
                    part.drawOnContext();
                } else {
                    this.repaint();
                }
            }
        }
    };

    Editor.prototype.doDrop = function (evt) {
        var data = evt.dataTransfer.getData("Text");
        var data1 = evt.dataTransfer.getData("type");
        this.mouse1 = this.getPointOnCanvas(evt);
        var part = this.createObject(this.mouse1);
        this.currObject.deselectAll();
        var p = null;
        if (this.editorStatus == 3) { // single selection status
            if (this.creating == "e") {
                p = this.currObject;
                // this.currObject.addChild(part);
            } else if (this.creating == "f" || this.creating == "g") {
                var a = this.lookupObjects(this.mouse1);
                if (a instanceof MbBoard) {
                    p = a;// .addChild(part);
                    // a.addChild(part);
                }
            } else if (this.creating == "h") {
                var a = this.lookupObjects(this.mouse1);
                if (a instanceof MbTopBar) {
                    p = a;// .addChild(part);
                    // a.addChild(part);
                    // this.currObject.findCurrentBoard().addChild(part.children);
                }
            } else if (this.creating == "i" || this.creating == "j"
                || this.creating == "k" || this.creating == "l"
                || this.creating == "m") {
                var a = this.lookupObjects(this.mouse1);
                if (a instanceof MbContentPanel) {
                    p = a;// .addChild(part);
                    // a.addChild(part);
                }
            } else if (this.creating == "p") {
                var a = this.lookupObjects(this.mouse1);
                if (a instanceof MbBoard) {
                    p = a;// .addChild(part);
                    // a.addChild(part);
                }
            } else if (this.creating == "n") {
                var a = this.lookupObjects(this.mouse1);
                if (a instanceof MbRow) {
                    p = a;// .addChild(part);
                    // a.addChild(part);
                }
            } else if (this.creating == "o") {
                var a = this.lookupObjects(this.mouse1);
                if (a instanceof MbColumn) {
                    p = a;// .addChild(part);
                    // a.addChild(part);
                }
            }
            this.selected = part;
            if (p != null) {
                this.doCreationAction(part, p);
            }
        }
        // this.repaint();
        Utils.stopDefaultEvent(evt);
    };

    // drag and drop or click for adding
    Editor.prototype.createTempObject = function (mouse) {
        var part = this.createObject(mouse);
        part.x0 = Math.floor(mouse.x) + 0.5;
        part.y0 = Math.floor(mouse.y) + 0.5;
        part.x1 = Math.floor(mouse.x + part.x1) + 0.5;
        part.y1 = Math.floor(mouse.y + part.y1) + 0.5;
        return part;
    };

    // drag and drop or click for adding
    Editor.prototype.createObject = function (mouse) {
        var part = null;
        if (this.creating == "d") {
            part = new MbBoard();
            part.name = "首页";
            part.type = 0;
        } else if (this.creating == "e") {
            part = new MbBoard();
            part.name = "二层/三层页面";
            part.type = 1;
        } else if (this.creating == "f") {
            part = new MbSearchBar();
            part.name = "搜索栏";
        } else if (this.creating == "g") {
            part = new MbTopBar();
            part.name = "顶部菜单栏";
            part.children = [];
        } else if (this.creating == "h") {
            part = new MbTopBarItem();
            part.name = "菜单项";
        } else if (this.creating == "i") {
            part = new MbRow();
            part.name = "单行单列布局";
        } else if (this.creating == "j") {
            part = new MbRow();
            part.name = "单行两列布局";
            part.addChild(new MbColumn());
        } else if (this.creating == "k") {
            part = new MbRow();
            part.name = "单行三列布局";
            part.addChild(new MbColumn());
            part.addChild(new MbColumn());
        } else if (this.creating == "l") {
            part = new MbRow();
            part.name = "单行四列布局";
            part.addChild(new MbColumn());
            part.addChild(new MbColumn());
            part.addChild(new MbColumn());
        } else if (this.creating == "m") {
            part = new MbRow();
            part.name = "单行五列布局";
            part.addChild(new MbColumn());
            part.addChild(new MbColumn());
            part.addChild(new MbColumn());
            part.addChild(new MbColumn());
        } else if (this.creating == "n") {
            part = new MbColumn();
            part.name = "创建一个列";
        } else if (this.creating == "o") {
            part = new MbButton();
            part.name = "按钮";
        } else if (this.creating == "p") {
            part = new MbContentPanel();
            part.name = "neirongmianban";
        }
        part.lastupdate = new Date().getTime();
        part.createDateTime = new Date().getTime();
        part.context = this.context;
        part.owner = this.currObject.id;
        return part;
    };

    Editor.prototype.doCreationAction = function (obj, p) {
        if (obj instanceof MbButton || obj instanceof MbBoard
            || obj instanceof MbSearchBar || obj instanceof MbTopBar
            || obj instanceof MbTopBarItem || obj instanceof MbContentPanel) {
            var that = this;
            $.getJSON(service.api(2, this.options.ownerId)).complete(
                function (data) {
                    obj.id = data.responseText;
                    that.addtoGraph(obj, p);
                });
        } else {
            this.addtoGraph(obj, p);
        }
    };

    Editor.prototype.moveLeftAction = function () {
        this.clipparent.moveLeft(this.clip);
        var pos = this.clipparent.getPosition(this.clip);
        if (pos == 0) {
            this.options.parent.enableRightButton();
            this.options.parent.disableLeftButton();
        } else if (pos == this.clipparent.children.length - 1) {
            this.options.parent.enableLeftButton();
            this.options.parent.disableRightButton();
        } else {
            this.options.parent.enableRightButton();
            this.options.parent.enableLeftButton();
        }
        this.repaint();
    };

    Editor.prototype.moveRightAction = function () {
        this.clipparent.moveRight(this.clip);
        var pos = this.clipparent.getPosition(this.clip);
        if (pos == 0) {
            this.options.parent.enableRightButton();
            this.options.parent.disableLeftButton();
        } else if (pos == this.clipparent.children.length - 1) {
            this.options.parent.enableLeftButton();
            this.options.parent.disableRightButton();
        } else {
            this.options.parent.enableRightButton();
            this.options.parent.enableLeftButton();
        }
        this.repaint();
    };

    Editor.prototype.moveUpAction = function () {
        this.clipparent.moveUp(this.clip);
        var pos = this.clipparent.getPosition(this.clip);
        if (pos == 0) {
            this.options.parent.enableDownButton();
            this.options.parent.disableUpButton();
        } else if (pos == this.clipparent.children.length - 1) {
            this.options.parent.enableUpButton();
            this.options.parent.disableDownButton();
        } else {
            this.options.parent.enableDownButton();
            this.options.parent.enableUpButton();
        }
        this.repaint();
    };

    Editor.prototype.moveDownAction = function () {
        this.clipparent.moveDown(this.clip);
        var pos = this.clipparent.getPosition(this.clip);
        if (pos == 0) {
            this.options.parent.enableDownButton();
            this.options.parent.disableUpButton();
        } else if (pos == this.clipparent.children.length - 1) {
            this.options.parent.enableUpButton();
            this.options.parent.disableDownButton();
        } else {
            this.options.parent.enableDownButton();
            this.options.parent.enableUpButton();
        }
        this.repaint();
    };

    Editor.prototype.addtoGraph = function (part, p) {
        this.stack.execute(new OMCreatePartCmd(part, p, this.currObject, this.category));
        this.creating = null;
        this.editorStatus = 1;
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