/**
 *
 */
function Row() {
    this.id = null;
    this.title = "行";
    this.parent = null; // parent Id
    this.currOwner = null; // form Id
    this.children = []; // children.
    this.classtypename = "Row";
    this.evn = 0; // environment: 0: design time; 1; runtime
};

Row.prototype = new UIComponent();

// for previewing
Row.prototype.clone = function () {
    var r = new Row();
    // r.id = this.id;
    // r.title = this.title;
    // r.parent = this.parent; // parent Id
    // r.currOwner = this.currOwner; // form Id
    // r.evn = this.evn; // environment: 0: design time; 1; runtime
    // r.toDomForHTML();
    // for (var i = 0; i < this.children.length; i++) {
    //     var c = this.children[i].clone();
    //     r.children.push(c);
    //     r.dom.appendChild(c.dom);
    // }
    return r;
};

Row.prototype.cloneRules = function (clone, old) {
    for (var i = 0; i < this.children.length; i++) {
        this.children[i].cloneRules(clone, old);
    }
};

Row.prototype.addChild = function (child) {
    child.parent = this.id;
    child.currOwner = this.currOwner;
    this.children.push(child);
    //this.dom.appendChild(child.dom);
};

// 递归，先根遍历
Row.prototype.seekObjectByID = function (id) {
    var target = null;
    if (this.id == id) {
        target = this;
    } else if (this.children.length > 0) {
        for (var i = 0; i < this.children.length; i++) {
            target = this.children[i].seekObjectByID(id);
            if (target != null) {
                break;
            }
        }
    }
    return target;
};

Row.prototype.seekObjects = function () {
    var list = [];
    if (this.children.length > 0) {
        for (var i = 0; i < this.children.length; i++) {
            list = list.concat(this.children[i].seekObjects());
        }
    }
    return list;
};

Row.prototype.parseFromJSON = function (json, evn) {
    this.id = json.id;
    this.title = json.title;
    this.parent = json.parent; // parent Id
    this.currOwner = json.currOwner; // form Id
    this.evn = evn;
    this.parseChildrenFromJSON(json.children, evn);
};

Row.prototype.parseChildrenFromJSON = function (content, evn) {
    if (content != undefined && content != null && content.length > 0) {
        for (var i = 0; i < content.length; i++) {
            var r = new Column();
            r.parseFromJSON(content[i], evn);
            this.addChild(r);
        }
    }
};

Row.prototype.parseRules = function (owner) {
    // parsing some rules for row object
    // to do ...
    // parsing some children rules
    this.parseChildrenRules(owner);
};

Row.prototype.parseChildrenRules = function (owner) {
    if (this.children.length > 0) {
        for (var i = 0; i < this.children.length; i++) {
            this.children[i].parseRules(owner);
        }
    }
};

Row.prototype.toDomForHTML = function (parent) {
    this.dom = document.createElement("div");
    parent.appendChild(this.dom);
    this.dom.id = this.id;
    this.dom.className = "row";
    //this.dom.style.height  = "500px";
    for (var i = 0; i < this.children.length; i++) {
        this.children[i].toDomForHTML(this.dom);
    }
    return this.dom;
};

Row.prototype.toDom = function (parent) {
    this.dom = document.createElement("DIV");
    parent.appendChild(this.dom);
    this.dom.className = "row rowedit rowtitle";
    this.dom.draggable = "true";
    this.dom.id = this.id;
    this.dom.tabIndex = "-1";
    // dragged component
    this.dom.addEventListener("dragstart", this, false);
    this.dom.addEventListener("drag", this, false);
    this.dom.addEventListener("dragend", this, false);
    // target component for dragging
    this.dom.addEventListener('dragenter', this, false);
    this.dom.addEventListener('dragover', this, false);
    this.dom.addEventListener('dragleave', this, false);
    this.dom.addEventListener('drop', this, false);
    this.dom.addEventListener("click", this, false);
    this.dom.addEventListener("focus", this, false);
    this.dom.addEventListener("blur", this, false);

    var remove = document.createElement("A");
    remove.className = "remove";
    this.dom.appendChild(remove);
    var removeSpan = document.createElement("i");
    remove.appendChild(removeSpan);
    removeSpan.className = "glyphicon glyphicon-remove";
    removeSpan.addEventListener("click", this, false);

    if (this.children.length > 0) {
        for (var i = 0; i < this.children.length; i++) {
            this.children[i].toDom(this.dom);
        }
    }
    return this.dom;
};

Row.prototype.handleEvent = function (e) {
    switch (e.type) {
        case "dragstart":// Events fired on the draggable target(source element)
            this.doDragStart(e);
            break;
        case "drag":// Events fired on the draggable target (the source element)
            this.doDrag(e);
            break;
        case "dragend":// Events fired on the draggable target(source element)
            this.doDragEnd(e);
            break;
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
        case "focus":
            this.doFocus(e);
            break;
        case "blur":
            this.doBlur(e);
            break;
    }
};

Row.prototype.doClick = function (evt) {
    if (this.evn == 0) {
        if (evt.target.className == "glyphicon glyphicon-remove") {
            if (map[this.currOwner] != null
                && map[this.currOwner].currObject instanceof Form) {
                map[this.currOwner].stack.execute(new FMRemoveRowCmd(
                    evt.target.parentNode.parentNode.id,
                    map[this.currOwner].currObject));
            }
        } else {
            evt.target.focus();
            map[this.currOwner].selected = this;
            // copyclip = this;
            map[this.currOwner].enableEditButtons();
            map[this.currOwner].setPropertySheet();
        }
    } else if (this.evn == 1) {
    }
    Utils.stopBubble(evt);
};

Row.prototype.doFocus = function (evt) {
    bgcache = evt.target.style.backgroundColor;
    evt.target.style.backgroundColor = Utils.highLight();
};

Row.prototype.doBlur = function (evt) {
    evt.target.style.backgroundColor = bgcache;
    bgcache = null;
};

Row.prototype.doDragStart = function (evt) {
    if (this.evn == 0) {
        if (map[this.currOwner] != null
            && map[this.currOwner].currObject instanceof Form) {
            // this / e.target is the source node.
            evt.target.style.opacity = '0.7';
            evt.dataTransfer.effectAllowed = 'move';
            copyclip = evt.target.id; // critical
        }
    } else if (this.evn == 1) {
    }
    Utils.stopBubble(evt);
};

Row.prototype.doDrag = function (evt) {
    if (this.evn == 0) {
        if (map[this.currOwner] != null
            && map[this.currOwner].currObject instanceof Form) {
            Utils.stopBubble(evt);
        }
    } else if (this.evn == 1) {

    }
    Utils.stopBubble(evt);
};

Row.prototype.doDragEnd = function (evt) {
    if (this.evn == 0) {
        if (map[this.currOwner] != null
            && map[this.currOwner].currObject instanceof Form) {
            evt.target.style.opacity = '1';
        }
    } else if (this.evn == 1) {
    }
    Utils.stopBubble(evt);
};

Row.prototype.doDragEnter = function (evt) {
    Utils.stopDefault(evt);
    Utils.stopBubble(evt);
};

Row.prototype.doDragOver = function (evt) {
    Utils.stopDefault(evt);
    evt.dataTransfer.dropEffect = 'move'
    Utils.stopBubble(evt);
    return false;
};

Row.prototype.doDragLeave = function (evt) {
    Utils.stopDefault(evt);
    Utils.stopBubble(evt);
};

Row.prototype.doDrop = function (evt) {
    Utils.stopDefault(evt);
    Utils.stopBubble(evt);
};

Row.prototype.toTree = function () {
    return {
        id: this.id,
        text: this.title,
        icon: "glyphicon glyphicon-th-list",
        data: "行|",
        children: this.toTreeChildren(),
    }
};

Row.prototype.toTreeChildren = function () {
    var children = [];
    for (var i = 0; i < this.children.length; i++) {
        children.push(this.children[i].toTree());
    }
    return children;
};

Row.prototype.fetchBoundComponents = function () {
    var coms = [];
    for (var i = 0; i < this.children.length; i++) {
        coms = coms.concat(this.children[i].fetchBoundComponents());
    }
    return coms;
};