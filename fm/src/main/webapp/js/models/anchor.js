/**
 *
 */
function Anchor() {
    this.id = null;
    this.parent = null; // parent Id
    this.currOwner = null; // form Id
    // basic properties
    this.title = "超链接";
    this.tabIndex = "-1";
    this.href = null;
    this.fillWidth = 0; // 0: false; 1: true;
    this.disabled = 0; // 0:false; 1:true
    this.readOnly = 0; // 0:false; 1:true
    this.hidden = 0; // 0: visible; 1: invisible
    this.classtypename = "Anchor";
    this.varId = null;
    this.ac = null;
    this.evn = 0;
};

Anchor.prototype = new UIComponent();

// for previewing
Anchor.prototype.clone = function () {
    var t = new Anchor();
    t.id = this.id;
    t.parent = this.parent; // parent Id
    t.currOwner = this.currOwner; // form Id
    t.title = this.title;
    t.href = this.href;
    t.fillWidth = this.fillWidth;
    t.tabIndex = this.tabIndex;
    t.readOnly = this.readOnly; // 0:false; 1:true
    t.disabled = this.disabled; // 0:false; 1:true
    t.hidden = this.hidden;
    t.varId = this.varId;
    t.ac = this.ac;
    t.evn = this.evn;
    t.toDomForHTML();
    return t;
};

// for previewing
Anchor.prototype.toDomForHTML = function(parent) {
    this.dom = document.createElement("DIV");
    parent.appendChild(this.dom);
    this.dom.id = this.id;
    this.dom.className = "form-group";
    this.dom.tabIndex = "-1";
    this.updateDom();
    return this.dom;
};

Anchor.prototype.toDom = function (parent) {
    this.toDomforFormGroup(parent);
    this.updateDom();
};

Anchor.prototype.updateDom = function () {
    while (this.dom.hasChildNodes()) { // clear dom
        if (this.dom.lastChild.id != "rm" + this.id) {
            this.dom.removeChild(this.dom.lastChild);
        } else if (this.dom.children.length == 1) {
            break;
        }
    }
    var button = document.createElement("A");
    button.id = "a" + this.id;
    button.addEventListener("click", this, false);
    button.className = "btn-link";
    button.classList.add("btn-default");
    if (this.fillWidth == 1) {
        button.classList.add("btn-block");
    }
    var buttonlabel = document.createTextNode(this.title);
    button.appendChild(buttonlabel);
    button.tabIndex = this.tabIndex;
    if (this.hidden == 0)
        this.dom.style.display = "";
    else
        this.dom.style.display = "none";
    this.dom.appendChild(button);
};

Anchor.prototype.toDomforFormGroup = function (parent) {
    this.dom = document.createElement("DIV");
    parent.appendChild(this.dom);
    this.dom.id = this.id;
    this.dom.className = "form-group comp_outline";
    this.dom.tabIndex = "-1";
    this.dom.draggable = "true";

    // dragged component
    this.dom.addEventListener("dragstart", this, false);
    this.dom.addEventListener("drag", this, false);
    this.dom.addEventListener("dragend", this, false);
    this.dom.addEventListener("click", this, false);
    this.dom.addEventListener("focus", this, false);
    this.dom.addEventListener("blur", this, false);

    var remove = document.createElement("A");
    remove.id = "rm" + this.id;
    remove.className = "remove";
    this.dom.appendChild(remove);
    var removeSpan = document.createElement("i");
    remove.appendChild(removeSpan);
    removeSpan.className = "glyphicon glyphicon-remove";
    removeSpan.addEventListener("click", this, false);
};

Anchor.prototype.handleEvent = function (e) {
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

Anchor.prototype.doClick = function (evt) {
    if (this.evn == 0) {
        if (evt.target.id == "btn" + this.id) {
            Utils.stopDefault();
        } else if (evt.target.className == "glyphicon glyphicon-remove") {
            if (map[this.currOwner] != null
                && map[this.currOwner].currObject instanceof Form) {
                map[this.currOwner].stack.execute(new FMRemoveRowCmd(
                    evt.target.parentNode.parentNode.id,
                    map[this.currOwner].currObject));
            }
        } else {
            evt.target.focus();
            map[this.currOwner].selected = this;
            map[this.currOwner].enableEditButtons();
            map[this.currOwner].setPropertySheet();
        }
        Utils.stopBubble(evt);
    } else if (this.evn == 1) {

    }
};

Anchor.prototype.doFocus = function (evt) {
    bgcache = evt.target.style.backgroundColor;
    evt.target.style.backgroundColor = Utils.highLight();
    Utils.stopBubble(evt);
};

Anchor.prototype.doBlur = function (evt) {
    evt.target.style.backgroundColor = bgcache;
    bgcache = null;
    Utils.stopBubble(evt);
};

Anchor.prototype.doDragStart = function (evt) {
    if (this.evn == 0) {
        if (map[this.currOwner] != null
            && map[this.currOwner].currObject instanceof Form) {
            evt.target.style.opacity = '0.7'; // this / e.target is the source
            // node.
            evt.dataTransfer.effectAllowed = 'move';
            copyclip = evt.target.id; // critical
        }
        Utils.stopBubble(evt);
    } else if (this.evn == 1) {

    }
};

Anchor.prototype.doDrag = function (evt) {
    Utils.stopBubble(evt);
};

Anchor.prototype.doDragEnd = function (evt) {
    if (this.evn == 0) {
        if (map[this.currOwner] != null
            && map[this.currOwner].currObject instanceof Form) {
            evt.target.style.opacity = '1';
        }
        Utils.stopBubble(evt);
    } else if (this.evn == 1) {

    }
};

Anchor.prototype.parseFromJSON = function (json, evn) {
    this.id = json.id;
    this.parent = json.parent; // parent Id
    this.currOwner = json.currOwner; // form Id
    this.title = json.title;
    this.fillWidth = json.fillWidth;
    this.href = json.href;
    this.tabIndex = json.tabIndex;
    this.readOnly = json.readOnly; // 0:false; 1:true
    this.disabled = json.disabled; // 0:false; 1:true
    this.hidden = json.hidden;
    this.varId = json.varId;
    this.ac = json.ac;
    this.evn = evn;
};

Anchor.prototype.toTree = function () {
    return {
        id: this.id,
        text: this.title,
        icon: "glyphicon glyphicon-link",
        data: "超链接|" + this.href,
    }
};
