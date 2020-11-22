/**
 *
 */
function PCDesktopUI() {
    this.id = null;
    this.code = null;
    this.name = null;
    this.status = 0;
    this.description = null;
    this.keywords = null;
    this.author = null;
    this.createDatetime = null;
    this.lastupdate = null;
    this.purchasePrice = 0.00;
    this.usagePrice = 0.00;
    this.parent = null;
    this.owner = null;
    this.readOnly = 0; // 0:false; 1:true; 如果只读，就只显示内容而不显示文本框
    this.disabled = 0; // 0:false; 1:true
    this.classtypename = "PCDesktopUI";
    this.cateId = null;
    this.children = []; // children.
};

PCDesktopUI.prototype = new UIComponent();

// this clone is for preview function
PCDesktopUI.prototype.clone = function () {
    var f = new PCDesktopUI();
    // f.id = this.id;
    // f.code = this.code;
    // f.name = this.name;
    // f.status = this.status;
    // f.description = this.description;
    // f.keywords = this.keywords;
    // f.author = this.author;
    // f.purchasePrice = this.purchasePrice;
    // f.usagePrice = this.usagePrice;
    // f.lastupdate = this.lastupdate;
    // f.readOnly = 0; // 0:false; 1:true; 如果只读，就只显示内容而不显示文本框
    // f.disabled = 0; // 0:false; 1:true
    // f.parent = this.parent;
    // f.cateId = this.cateId;
    // f.toDomForHTML();
    // for (var i = 0; i < this.children.length; i++) {
    //     var c = this.children[i].clone();
    //     f.children.push(c);
    //     f.dom.appendChild(c.dom);
    // }
   // this.cloneRules(f, this);
    return f;
};

PCDesktopUI.prototype.cloneRules = function (owner, old) {
    for (var i = 0; i < owner.children.length; i++) {
        if (!(owner.children[i] instanceof PCDesktopIcon)) {
            owner.children[i].cloneRules(owner, old);
        }
    }
};

PCDesktopUI.prototype.addChild = function (child) {
    child.parent = this.id;
    this.children.push(child);
    //this.dom.appendChild(child.dom);
};

PCDesktopUI.prototype.insertChild = function (child, siblingId) {
    child.parent = this.id;
    var f = 0;
    var t = null;
    for (var i = 0; i < this.children.length; i++) {
        if (this.children[i].id == siblingId) {
            f = i;
            t = this.children[i];
            break;
        }
    }
    this.children.splice(f, 0, child);
    this.dom.insertBefore(child.dom, t.dom);
};

PCDesktopUI.prototype.removeChild = function (child) {
    for (var i = 0; i < this.children.length; i++) {
        if (this.children[i].id == child.id) {
            this.children.splice(i, 1);
            this.dom.removeChild(child.dom);
            break;
        }
    }
};

PCDesktopUI.prototype.removeAllChildren = function () {
    for (var i = 0; i < this.children.length; i++) {
        this.dom.removeChild(this.children[i].dom);
    }
    this.children = [];
};

// 递归，先根遍历
PCDesktopUI.prototype.seekObjectByID = function (id) {
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
PCDesktopUI.prototype.seekObjects = function () {
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

PCDesktopUI.prototype.parseProps = function (json) {
    this.id = json.id;
    this.code = json.code;
    this.name = json.name;
    this.status = json.status;
    this.description = json.description;
    this.keywords = json.keywords;
    this.author = json.author;
    this.createDatetime = json.createDatetime;
    this.lastupdate = json.lastupdate;
    this.purchasePrice = json.purchasePrice;
    this.readOnly = json.readOnly;
    this.disabled = json.disabled;
    this.usagePrice = json.usagePrice;
    this.parent = json.parent;
    this.cateId = json.cateId;
    this.owner = json.owner;
};

PCDesktopUI.prototype.parseFromJSON = function (json, evn) {
    if (json != null) {
        this.parseProps(json);
        //this.toDom();
        this.parseChildrenFromJSON(json.children, evn);
    }
    // parse all propagation rules.
    this.parseRules(this);
};

PCDesktopUI.prototype.parseChildrenFromJSON = function (content, evn) {
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

PCDesktopUI.prototype.parseRules = function (owner) {
    // parsing some rules for form object
    // to do ...
    // parsing some children rules
    this.parseChildrenRules(owner);
};

PCDesktopUI.prototype.parseChildrenRules = function (owner) {
    if (this.children != undefined && this.children != null
        && this.children.length > 0) {
        for (var i = 0; i < this.children.length; i++) {
            if (this.children[i].classtypename == "PCDesktopIcon") {
                this.children[i].parseExpressions(owner);
            } else if (this.children[i].classtypename == "PCDesktopRow") {
                this.children[i].parseRules(owner);
            }
        }
    }
};

PCDesktopUI.prototype.stringifyforJSON = function () {
    // 序列成字符串
    return JSON.stringify(this, Utils.replacer);
};

PCDesktopUI.prototype.toDomForHTML = function (parent) {
    this.dom = document.createElement("DIV");
    parent.appendChild(this.dom);
    this.dom.id = this.id;
    if (this.children.length > 0) {
        for (var i = 0; i < this.children.length; i++) {
            this.children[i].toDomForHTML(this.dom);
        }
    }
    return this.dom;
};

PCDesktopUI.prototype.toDom = function (parent) {
    //this.dom = document.createElement("form");
    this.dom = document.createElement("DIV");
    parent.appendChild(this.dom);
    this.dom.id = this.id;
    this.dom.className = "formedit formtitle";
    this.dom.addEventListener("click", this, false);
    this.dom.addEventListener('dragenter', this, false);
    this.dom.addEventListener('dragover', this, false);
    this.dom.addEventListener('dragleave', this, false);
    this.dom.addEventListener('drop', this, false);
    // form children to DOM
    if (this.children.length > 0) {
        for (var i = 0; i < this.children.length; i++) {
            this.children[i].toDom(this.dom);
        }
    }
    return this.dom;
};

PCDesktopUI.prototype.updateDom = function () {
    if (this.dom == undefined || this.dom == null) {
        this.toDom();
    }
    if (this.children.length > 0) {
        for (var i = 0; i < this.children.length; i++) {
            this.children[i].updateDom();
        }
    }
};

PCDesktopUI.prototype.handleEvent = function (e) {
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
        case "click":
            this.doClick(e);
            break;
    }
    Utils.stopBubble(e);
};

// reference: https://www.html5rocks.com/zh/tutorials/dnd/basics/
PCDesktopUI.prototype.doDragEnter = function (evt) {
    if (map[this.cateId].pcDesktopEditor != null &&
        map[this.cateId].pcDesktopEditor.currObject instanceof PCDesktopUI) {
        Utils.stopDefault(evt);
        bgcache = evt.target.style.backgroundColor;
        Utils.stopBubble(evt);
    }
};

PCDesktopUI.prototype.doDragOver = function (evt) {
    if (map[this.cateId].pcDesktopEditor != null &&
        map[this.cateId].pcDesktopEditor.currObject instanceof PCDesktopUI) {
        Utils.stopDefault(evt);
        evt.target.style.backgroundColor = Utils.highLight();
        evt.dataTransfer.dropEffect = evt.dataTransfer.effectAllowed;
        Utils.stopBubble(evt);
        return false;
    }
};

PCDesktopUI.prototype.doDragLeave = function (evt) {
    if (map[this.cateId].pcDesktopEditor != null &&
        map[this.cateId].pcDesktopEditor.currObject instanceof PCDesktopUI) {
        Utils.stopDefault(evt);
        evt.target.style.backgroundColor = bgcache;
        bgcache = null;
        Utils.stopBubble(evt);
    }
};

PCDesktopUI.prototype.doDrop = function (e) {
    if (map[this.cateId].pcDesktopEditor != null &&
        map[this.cateId].pcDesktopEditor.currObject instanceof PCDesktopUI) {
        Utils.stopDefault(e);
        e.target.style.backgroundColor = bgcache;
        bgcache = null;
        if (copyclip != null) {
            if (this.dom.children.length == 0) {
                if (e.dataTransfer.effectAllowed == "copy") {// create
                    this.newComponent(copyclip);
                    // map[this.cateId].stack
                    //     .execute(new FMDesktopUIAppendLayoutNodeCmd(this, copyclip));
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
                    if (e.dataTransfer.effectAllowed == "copy") {// create
                        this.newInsertComponent(copyclip, t.id);
                        // map[this.cateId].stack
                        //     .execute(new FMDesktopUIInsertBeforeLayoutNodeCmd(this, copyclip, t.id));
                    } else if (e.dataTransfer.effectAllowed == "move") {
                        map[this.cateId].stack
                            .execute(new FMDesktopUIMoveBeforeLayoutNodeCmd(this, copyclip, t.id, this));
                    } else if (e.dataTransfer.effectAllowed == "copyMove") {// copy+move

                    }
                } else { // insert after
                    if (t != null && t.nextSibling != null) {
                        if (e.dataTransfer.effectAllowed == "copy") {// create
                            this.newInsertComponent(copyclip, t.nextSibling.id);
                            // map[this.cateId].stack
                            //     .execute(new FMDesktopUIInsertBeforeLayoutNodeCmd(
                            //         this, copyclip, t.nextSibling.id, this));
                        } else if (e.dataTransfer.effectAllowed == "move") {// move
                            map[this.cateId].stack
                                .execute(new FMDesktopUIMoveBeforeLayoutNodeCmd(
                                    this, copyclip, t.nextSibling.id, this));
                        } else if (e.dataTransfer.effectAllowed == "copyMove") {// copy+move

                        }
                    } else {
                        if (e.dataTransfer.effectAllowed == "copy") {// create
                            this.newComponent(copyclip);
                            // map[this.cateId].stack
                            //     .execute(new FMDesktopUIAppendLayoutNodeCmd(this, copyclip));
                        } else if (e.dataTransfer.effectAllowed == "move") {
                            // moved row Id
                            map[this.cateId].stack
                                .execute(new FMDesktopUIMoveLayoutNodeCmd(this, copyclip, this));
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

PCDesktopUI.prototype.newComponent = function (copyclip, id) {
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

PCDesktopUI.prototype.newInsertComponent = function (copyclip, id) {
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

PCDesktopUI.prototype.doClick = function (evt) {
    copyclip = map[this.cateId].pcDesktopEditor.currObject;
    map[this.cateId].selected = this;
    //map[this.currOwner].disableEditButtons();
    map[this.cateId].setPropertySheet();
    Utils.stopBubble(evt);
};

PCDesktopUI.prototype.toTree = function () {
    return {
        id: this.id,
        text: this.name,
        icon: "glyphicon glyphicon-file",
        data: "PC桌面|",
        children: this.toTreeChildren(),
    }
};

PCDesktopUI.prototype.toTreeChildren = function () {
    var children = [];
    for (var i = 0; i < this.children.length; i++) {
        children.push(this.children[i].toTree());
    }
    return children;
};