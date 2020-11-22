/**
 *
 */
function PCDesktopColumn(cateId) {
    this.id = null;
    this.title = "列";
    this.parent = null; // parent Id
    this.currOwner = null; // form Id
    this.children = []; // children.
    this.className = "";
    this.classtypename = "PCDesktopColumn";
    this.cateId = cateId;
    this.evn = 0; // environment: 0: design time; 1; runtime
};

PCDesktopColumn.prototype = new UIComponent();

// for previewing
PCDesktopColumn.prototype.clone = function () {
    var c = new PCDesktopColumn(this.cateId);
    // c.id = this.id;
    // c.title = this.title;
    // c.parent = this.parent; // parent Id
    // c.currOwner = this.currOwner; // form Id
    // c.evn = this.evn; // environment: 0: design time; 1; runtime
    // c.toDomForHTML();
    // c.dom.className = this.dom.className;
    // c.dom.classList.remove("coledit", "coltitle");
    // for (var i = 0; i < this.children.length; i++) {
    //     var cln = this.children[i].clone();
    //     c.children.push(cln);
    //     c.dom.appendChild(cln.dom);
    // }
    return c;
};

PCDesktopColumn.prototype.cloneRules = function (owner, old) {
    for (var i = 0; i < this.children.length; i++) {
        if (!(owner.children[i] instanceof PCDesktopIcon)) {
            this.children[i].cloneRules(owner, old);
        }
    }
};

PCDesktopColumn.prototype.addChild = function (child) {
    child.parent = this.id;
    child.currOwner = this.currOwner;
    this.children.push(child);
    //this.dom.appendChild(child.dom);
};

PCDesktopColumn.prototype.insertChild = function (child, siblingId) {
    child.parent = this.id;
    child.currOwner = this.currOwner; // form Id
    var f = 0;
    var t = null;
    for (var i = 0; i < this.children.length; i++) {
        if (this.children[i].id == siblingId) {
            f = i;
            t = this.children[i];
            break;
        }
    }
    if (t != null) {
        this.children.splice(f, 0, child);
        this.dom.insertBefore(child.dom, t.dom);
    }
};

PCDesktopColumn.prototype.removeChild = function (child) {
    for (var i = 0; i < this.children.length; i++) {
        if (this.children[i].id == child.id) {
            this.children.splice(i, 1);
            this.dom.removeChild(child.dom);
            break;
        }
    }
};

// 递归，先根遍历
PCDesktopColumn.prototype.seekObjectByID = function (id) {
    var target = null;
    if (this.id == id) {
        target = this;
    } else if (this.children.length > 0) {
        for (var i = 0; i < this.children.length; i++) {
            if (this.children[i] instanceof PCDesktopRow) {
                target = this.children[i].seekObjectByID(id);
            } else if (this.children[i].id == id) {
                target = this.children[i];
            }
            if (target != null) {
                break;
            }
        }
    }
    return target;
};

// 递归，get the component list
PCDesktopColumn.prototype.seekObjects = function () {
    var list = [];
    if (this.children.length > 0) {
        for (var i = 0; i < this.children.length; i++) {
            list.push(this.children[i]);
            if (this.children[i] instanceof PCDesktopRow) {
                list = list.concat(this.children[i].seekObjects());
            }
        }
    }
    return list;
};

PCDesktopColumn.prototype.parseFromJSON = function (json, evn) {
    this.id = json.id;
    this.parent = json.parent; // parent Id
    this.title = json.title;
    this.currOwner = json.currOwner; // form Id
    this.className = json.className;
    this.cateId = json.cateId;
    //this.toDom();
    // var classlist = json.className.split(" ");
    // for (var i = 0; i < classlist.length; i++) {
    //     this.dom.classList.add(classlist[i]);
    // }
    this.parseChildrenFromJSON(json.children, evn);
};

PCDesktopColumn.prototype.parseChildrenFromJSON = function (content, evn) {
    if (content != undefined && content != null && content.length > 0) {
        for (var i = 0; i < content.length; i++) {
            if (content[i].classtypename == "PCDesktopRow") {
                var r = new PCDesktopRow();
                r.parseFromJSON(content[i], evn);
                this.addChild(r);
            } else {
                if (content[i].classtypename == "PCDesktopIcon") {
                    var r = new PCDesktopIcon();
                    r.parseFromJSON(content[i], evn);
                    this.addChild(r);
                }
            }
        }
    }
};

PCDesktopColumn.prototype.parseRules = function (owner) {
    // parsing some rules for column object
    // to do ...
    // parsing some children rules
    this.parseChildrenRules(owner);
};

PCDesktopColumn.prototype.parseChildrenRules = function (owner) {
    if (this.children != undefined && this.children != null
        && this.children.length > 0) {
        for (var i = 0; i < this.children.length; i++) {
            if (this.children[i].classtypename == "PCDesktopIcon") {
                //this.children[i].parseExpressions(owner);
            }
        }
    }
};

PCDesktopColumn.prototype.toDomForHTML = function (parent) {
    this.dom = document.createElement("DIV");
    parent.appendChild(this.dom);
    this.dom.id = this.id;

    var classlist = this.className.split(" ");
    for (var i = 0; i < classlist.length; i++) {
        this.dom.classList.add(classlist[i]);
    }

    if (this.children.length > 0) {
        for (var i = 0; i < this.children.length; i++) {
            this.children[i].toDomForHTML(this.dom);
        }
    }
    return this.dom;
};

PCDesktopColumn.prototype.toDom = function (parent) {
    this.dom = document.createElement("DIV");
    parent.appendChild(this.dom);
    this.dom.id = this.id;
    this.dom.className = "coledit coltitle ";
    this.dom.addEventListener('dragenter', this, false);
    this.dom.addEventListener('dragover', this, false);
    this.dom.addEventListener('dragleave', this, false);
    this.dom.addEventListener('drop', this, false);

    var classlist = this.className.split(" ");
    for (var i = 0; i < classlist.length; i++) {
        this.dom.classList.add(classlist[i]);
    }

    if (this.children.length > 0) {
        for (var i = 0; i < this.children.length; i++) {
            this.children[i].toDom(this.dom);
        }
    }
    return this.dom;
};

PCDesktopColumn.prototype.updateDom = function () {
    if (this.dom == undefined || this.dom == null) {
        this.toDom();
    }
    if (this.children.length > 0) {
        for (var i = 0; i < this.children.length; i++) {
            this.children[i].updateDom();
        }
    }
};

PCDesktopColumn.prototype.handleEvent = function (e) {
    switch (e.type) {
        case "dragenter": // Events fired on the drop target
            this.doDragEnter(e);
            break;
        case "dragover": // Events fired on the drop target
            this.doDragOver(e);
            break;
        case "dragleave": // Events fired on the drop target
            this.doDragLeave(e);
            break;
        case "drop":// Events fired on the drop target
            this.doDrop(e);
            break;
    }
};

PCDesktopColumn.prototype.doDragEnter = function (evt) {
    if (map[this.cateId].pcDesktopEditor != null &&
        map[this.cateId].pcDesktopEditor.currObject instanceof PCDesktopUI) {
        Utils.stopDefault(evt);
        bgcache = evt.target.style.backgroundColor;
        Utils.stopBubble(evt);
    }
};

PCDesktopColumn.prototype.doDragOver = function (evt) {
    if (map[this.cateId].pcDesktopEditor != null &&
        map[this.cateId].pcDesktopEditor.currObject instanceof PCDesktopUI) {
        Utils.stopDefault(evt);
        evt.target.style.backgroundColor = Utils.highLight();
        evt.dataTransfer.dropEffect = evt.dataTransfer.effectAllowed;
        Utils.stopBubble(evt);
        return false;
    }
};

PCDesktopColumn.prototype.doDragLeave = function (evt) {
    if (map[this.cateId].pcDesktopEditor != null &&
        map[this.cateId].pcDesktopEditor.currObject instanceof PCDesktopUI) {
        Utils.stopDefault(evt);
        evt.target.style.backgroundColor = bgcache;
        bgcache = null;
        Utils.stopBubble(evt);
    }
};

PCDesktopColumn.prototype.doDrop = function (e) {
    if (map[this.cateId].pcDesktopEditor != null &&
        map[this.cateId].pcDesktopEditor.currObject instanceof PCDesktopUI) {
        Utils.stopDefault(e);
        e.target.style.backgroundColor = bgcache;
        bgcache = null;
        if (copyclip != null) {
            if (this.dom.children.length == 0) {
                if (e.dataTransfer.effectAllowed == "copy") { // create
                    this.newComponent(copyclip);
                    // map[this.cateId].stack
                    //     .execute(new FMDesktopUIAppendLayoutNodeCmd(this, copyclip));
                } else if (e.dataTransfer.effectAllowed == "move") { // move
                    map[this.cateId].stack.execute(new FMDesktopUIMoveLayoutNodeCmd(
                        this, copyclip, map[this.cateId].pcDesktopEditor.currObject));
                } else if (e.dataTransfer.effectAllowed == "copyMove") {// copy+move

                }
            } else {
                var x = e.clientX
                    - (this.dom.getBoundingClientRect().left + this.dom.scrollLeft);
                var y = e.clientY
                    - (this.dom.getBoundingClientRect().top + this.dom.scrollTop);
                var t = null;
                var before = false;
                for (var i = 0; i < this.dom.children.length; i++) {
                    if (y < this.dom.children[i].getBoundingClientRect().top) {
                        before = true;
                        t = this.dom.children[i];
                        break;
                    }
                    if (y > this.dom.children[i].getBoundingClientRect().bottom) {
                        before = false;
                        break;
                    }
                }
                if (before) { // insert before
                    if (e.dataTransfer.effectAllowed == "copy") { // create
                        this.newInsertComponent(copyclip, t.id);
                        // map[this.cateId].stack
                        //     .execute(new FMDesktopUIInsertBeforeLayoutNodeCmd(this,
                        //         copyclip, t.id));
                    } else if (e.dataTransfer.effectAllowed == "move") { // move
                        map[this.cateId].stack
                            .execute(new FMDesktopUIMoveBeforeLayoutNodeCmd(this,
                                copyclip, t.id, map[this.cateId].pcDesktopEditor.currObject));
                    } else if (e.dataTransfer.effectAllowed == "copyMove") {// copy+move

                    }
                } else { // insert after
                    if (t != null && t.nextSibling != null) {
                        if (e.dataTransfer.effectAllowed == "copy") { // create
                            this.newInsertComponent(copyclip, t.nextSibling.id);
                            // map[this.cateId].stack
                            //     .execute(new FMDesktopUIInsertBeforeLayoutNodeCmd(
                            //         this, copyclip, t.nextSibling.id));
                        } else if (e.dataTransfer.effectAllowed == "move") {// move
                            map[this.cateId].stack
                                .execute(new FMDesktopUIMoveBeforeLayoutNodeCmd(
                                    this, copyclip, t.nextSibling.id,
                                    map[this.cateId].pcDesktopEditor.currObject));
                        } else if (e.dataTransfer.effectAllowed == "copyMove") {// copy+move

                        }
                    } else {
                        if (e.dataTransfer.effectAllowed == "copy") { // create
                            this.newComponent(copyclip);
                            // map[this.cateId].stack
                            //     .execute(new FMDesktopUIAppendLayoutNodeCmd(this, copyclip));
                        } else if (e.dataTransfer.effectAllowed == "move") {// move
                            map[this.cateId].stack.execute(
                                new FMDesktopUIMoveLayoutNodeCmd(this,
                                    copyclip, map[this.cateId].pcDesktopEditor.currObject));
                        } else if (e.dataTransfer.effectAllowed == "copyMove") {// copy+move

                        }
                    }
                }
            }
            copyclip = null;
        }
        Utils.stopBubble(e);
    }
};

PCDesktopColumn.prototype.newComponent = function (copyclip, id) {
    var that = this;
    if (copyclip instanceof Row) {
        if (copyclip.children.length == 1) {
            $.getJSON(service.api(60), {num: "2"}).complete(function (data) {
                var ids = JSON.parse(data.responseText);
                copyclip.id = ids[0];
                copyclip.children[0].id = ids[1];
                map[that.cateId].stack.execute(
                    new FMDesktopUIAppendLayoutNodeCmd(that, copyclip));
            });
        } else if (copyclip.children.length == 2) {
            $.getJSON(service.api(60), {num: "3"}).complete(function (data) {
                var ids = JSON.parse(data.responseText);
                copyclip.id = ids[0];
                copyclip.children[0].id = ids[1];
                copyclip.children[1].id = ids[2];
                map[that.cateId].stack.execute(
                    new FMDesktopUIAppendLayoutNodeCmd(that, copyclip));
            });
        } else if (copyclip.children.length == 3) {
            $.getJSON(service.api(60), {num: "4"}).complete(function (data) {
                var ids = JSON.parse(data.responseText);
                copyclip.id = ids[0];
                copyclip.children[0].id = ids[1];
                copyclip.children[1].id = ids[2];
                copyclip.children[2].id = ids[3];
                map[that.cateId].stack.execute(
                    new FMDesktopUIAppendLayoutNodeCmd(that, copyclip));
            });
        } else if (copyclip.children.length == 4) {
            $.getJSON(service.api(60), {num: "5"}).complete(function (data) {
                var ids = JSON.parse(data.responseText);
                copyclip.id = ids[0];
                copyclip.children[0].id = ids[1];
                copyclip.children[1].id = ids[2];
                copyclip.children[2].id = ids[3];
                copyclip.children[3].id = ids[4];
                map[that.cateId].stack.execute(
                    new FMDesktopUIAppendLayoutNodeCmd(that, copyclip));
            });
        } else if (copyclip.children.length == 6) {
            $.getJSON(service.api(60), {num: "6"}).complete(function (data) {
                var ids = JSON.parse(data.responseText);
                copyclip.id = ids[0];
                copyclip.children[0].id = ids[1];
                copyclip.children[1].id = ids[2];
                copyclip.children[2].id = ids[3];
                copyclip.children[3].id = ids[4];
                copyclip.children[4].id = ids[5];
                copyclip.children[5].id = ids[6];
                map[that.cateId].stack.execute(
                    new FMDesktopUIAppendLayoutNodeCmd(that, copyclip));
            });
        }
    } else {
        $.getJSON(service.api(2)).complete(
            function (data) {
                copyclip.id = data.responseText;
                map[that.cateId].stack.execute(
                    new FMDesktopUIAppendLayoutNodeCmd(that, copyclip));
            });
    }
};

PCDesktopColumn.prototype.newInsertComponent = function (copyclip, id) {
    var that = this;
    if (copyclip instanceof Row) {
        if (copyclip.children.length == 1) {
            $.getJSON(service.api(60), {num: "2"}).complete(function (data) {
                var ids = JSON.parse(data.responseText);
                copyclip.id = ids[0];
                copyclip.children[0].id = ids[1];
                map[that.cateId].stack.execute(
                    new FMDesktopUIInsertBeforeLayoutNodeCmd(that, copyclip, id));
            });
        } else if (copyclip.children.length == 2) {
            $.getJSON(service.api(60), {num: "3"}).complete(function (data) {
                var ids = JSON.parse(data.responseText);
                copyclip.id = ids[0];
                copyclip.children[0].id = ids[1];
                copyclip.children[1].id = ids[2];
                map[that.cateId].stack.execute(
                    new FMDesktopUIInsertBeforeLayoutNodeCmd(that, copyclip, id));
            });
        } else if (copyclip.children.length == 3) {
            $.getJSON(service.api(60), {num: "4"}).complete(function (data) {
                var ids = JSON.parse(data.responseText);
                copyclip.id = ids[0];
                copyclip.children[0].id = ids[1];
                copyclip.children[1].id = ids[2];
                copyclip.children[2].id = ids[3];
                map[that.cateId].stack.execute(
                    new FMDesktopUIInsertBeforeLayoutNodeCmd(that, copyclip, id));
            });
        } else if (copyclip.children.length == 4) {
            $.getJSON(service.api(60), {num: "5"}).complete(function (data) {
                var ids = JSON.parse(data.responseText);
                copyclip.id = ids[0];
                copyclip.children[0].id = ids[1];
                copyclip.children[1].id = ids[2];
                copyclip.children[2].id = ids[3];
                copyclip.children[3].id = ids[4];
                map[that.cateId].stack.execute(
                    new FMDesktopUIInsertBeforeLayoutNodeCmd(that, copyclip, id));
            });
        } else if (copyclip.children.length == 6) {
            $.getJSON(service.api(60), {num: "6"}).complete(function (data) {
                var ids = JSON.parse(data.responseText);
                copyclip.id = ids[0];
                copyclip.children[0].id = ids[1];
                copyclip.children[1].id = ids[2];
                copyclip.children[2].id = ids[3];
                copyclip.children[3].id = ids[4];
                copyclip.children[4].id = ids[5];
                copyclip.children[5].id = ids[6];
                map[that.cateId].stack.execute(
                    new FMDesktopUIInsertBeforeLayoutNodeCmd(that, copyclip, id));
            });
        }
    } else {
        $.getJSON(service.api(2)).complete(
            function (data) {
                copyclip.id = data.responseText;
                map[that.cateId].stack.execute(
                    new FMDesktopUIInsertBeforeLayoutNodeCmd(that, copyclip, id));
            });
    }
};

PCDesktopColumn.prototype.toTree = function () {
    return {
        id: this.id,
        text: this.title,
        icon: "fa fa-columns",
        data: "列|",
        children: this.toTreeChildren(),
    }
};

PCDesktopColumn.prototype.toTreeChildren = function () {
    var children = [];
    for (var i = 0; i < this.children.length; i++) {
        children.push(this.children[i].toTree());
    }
    return children;
};

PCDesktopColumn.prototype.fetchBoundComponents = function () {
    var coms = [];
    for (var i = 0; i < this.children.length; i++) {
        if (this.children[i].classtypename == "PCDesktopIcon") {
            if (this.children[i].varId != null) {
                coms.push(this.children[i]);
            }
        } else if (this.children[i].classtypename == "PCDesktopRow"
            || this.children[i] instanceof UIContainer) {
            coms = coms.concat(this.children[i].fetchBoundComponents());
        }
    }
    return coms;
};