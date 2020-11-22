/**
 * @author Dahai Cao created in 2017-08, last updated at 14:09 on 2019-03-05
 */
function Radios() {
    this.id = null;
    this.parent = null; // parent Id
    this.currOwner = null; // form Id
    // basic properties
    this.title = "单项选择";
    this.help = "我的帮助及提示"; // description
    this.required = 1; // 0: not required; 1: required;
    this.inline = 1; // 0: not inline; 1: inline;
    this.tabIndex = "-1";
    this.initValue = null; // default value
    this.readOnly = 0; // 0:false; 1:true; 如果只读，就只显示内容而不显示文本框
    this.disabled = 0; // 0:false; 1:true
    this.hidden = 0; // 0: visible; 1: invisible
    this.classtypename = "Radios";

    this.children = [];

    this.varId = null;
    this.ac = null;
    this.evn = 0; // environment: 0: design time; 1; runtime
};

Radios.prototype = new UIComponent();

// for previewing
Radios.prototype.clone = function () {
    var t = new Radios();
    t.id = this.id;
    t.parent = this.parent; // parent Id
    t.currOwner = this.currOwner; // form Id
    t.title = this.title;
    t.help = this.help; // description
    t.required = this.required;
    t.inline = this.inline;
    t.tabIndex = this.tabIndex;
    t.initValue = this.initValue;
    t.readOnly = this.readOnly; // 0:false; 1:true; 如果只读，就只显示内容而不显示文本框
    t.disabled = this.disabled; // 0:false; 1:true
    t.hidden = this.hidden;
    t.varId = this.varId;
    t.ac = this.ac;
    t.evn = this.evn;
    t.toDomForHTML();
    for (var i = 0; i < this.children.length; i++) {
        var c = this.children[i].clone();
        t.children.push(c);
        t.dom.appendChild(c.dom);
    }
    return t;
};

Radios.prototype.cloneRules = function (clone, old) {
    for (var i = 0; i < this.children.length; i++) {
        this.children[i].cloneRules(clone, old);
    }
};

Radios.prototype.addChild = function (child) {
    child.parent = this.id;
    child.currOwner = this.currOwner;
    this.children.push(child);
};

Radios.prototype.addRadio = function (child) {
    for (var i = 0; i < this.dom.children.length; i++) {
        if (this.dom.children[i].id == "radiogrp" + this.id) {
            var f = false;
            for (var j = 0; j < this.dom.children[i].children.length; j++) {
                if (child.id == this.dom.children[i].children[j].id) {
                    f = true;
                    break;
                }
            }
            if (!f) {
                child.toDom(this.dom.children[i]);
            }
            break;
        }
    }
};

Radios.prototype.removeChild = function (child) {
    for (var i = 0; i < this.children.length; i++) {
        if (this.children[i].id == child.id) {
            this.children.splice(i, 1);
            for (var j = 0; j < this.dom.children.length; j++) {
                if (this.dom.children[j].id == "radiogrp" + this.id) {
                    this.dom.children[j].removeChild(child.dom);
                    break;
                }
            }
            break;
        }
    }
};

Radios.prototype.insertChild = function (child, siblingId) {
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
        for (var j = 0; j < this.dom.children.length; j++) {
            if (this.dom.children[j].id == "radiogrp" + this.id) {
                this.dom.children[j].insertBefore(child.dom, t.dom);
                break;
            }
        }
    }
};

Radios.prototype.seekObjectByID = function (id) {
    var target = null;
    if (this.id == id) {
        target = this;
    } else if (this.children.length > 0) {
        for (var i = 0; i < this.children.length; i++) {
            if (this.children[i].id == id) {
                target = this.children[i];
                break;
            }
        }
    }
    return target;
};

Radios.prototype.seekObjects = function () {
    var list = [];
    if (this.children.length > 0) {
        for (var i = 0; i < this.children.length; i++) {
            list = list.concat(this.children[i].seekObjects());
        }
    }
    return list;
};

// for previewing
Radios.prototype.toDomForHTML = function(parent) {
    this.dom = document.createElement("DIV");
    parent.appendChild(this.dom);
    this.dom.id = this.id;
    this.dom.className = "form-group";
    this.dom.tabIndex = "-1";
    this.updateDom();
    if (this.children.length > 0) {
        for (var i = 0; i < this.children.length; i++) {
            this.addRadioforHTML(this.children[i]);
        }
    }
    return this.dom;
};

Radios.prototype.addRadioforHTML = function (child) {
    for (var i = 0; i < this.dom.children.length; i++) {
        if (this.dom.children[i].id == "radiogrp" + this.id) {
            var f = false;
            for (var j = 0; j < this.dom.children[i].children.length; j++) {
                if (child.id == this.dom.children[i].children[j].id) {
                    f = true;
                    break;
                }
            }
            if (!f) {
                child.toDomForHTML(this.dom.children[i]);
            }
            break;
        }
    }
};

Radios.prototype.toDom = function (parent) {
    this.toDomforFormGroup(parent);
    this.updateDom();
    if (this.children.length > 0) {
        for (var i = 0; i < this.children.length; i++) {
            this.addRadio(this.children[i]);
        }
    }
};

Radios.prototype.updateDom = function () {
    var i = 0;
    while (this.dom.hasChildNodes()) { // clear dom
        if (this.dom.lastChild.id != "rm" + this.id
            && this.dom.lastChild.id != "pls" + this.id) {
            this.dom.removeChild(this.dom.lastChild);
        } else if (this.dom.children.length == 2) {
            break;
        }
    }
    if (this.hidden == 0)
        this.dom.style.display = "";
    else
        this.dom.style.display = "none";
    if (this.title != null && this.title != "") {
        var titlelabel = document.createElement("LABEL");
        titlelabel.className = "control-label";
        this.dom.appendChild(titlelabel);
        var titleNode = document.createTextNode(this.title);
        titlelabel.appendChild(titleNode);

        if (this.required == 0) { //
            var requiredSpan = document.createElement("SPAN");
            requiredSpan.style.color = "red";
            requiredSpan.innerHTML = " *";
            titlelabel.appendChild(requiredSpan);
            // this.input.setAttribute("required", "");
        } else if (this.required == 1) { //
            // this.input.removeAttribute("required");
        }
    }
    if (this.mycontainer == undefined || this.mycontainer == null) {
        this.mycontainer = document.createElement("DIV");
        this.mycontainer.id = "radiogrp" + this.id;
    }
    this.dom.appendChild(this.mycontainer);
    if (this.help != null && this.help != "") {
        var helpNode = document.createElement("SPAN");
        helpNode.className = "help-block";
        helpNode.textContent = this.help;
        this.dom.appendChild(helpNode);
    }
    //
    if (this.children.length > 0) {
        for (var i = 0; i < this.children.length; i++) {
            this.children[i].inline = this.inline;
            if (this.tabIndex != -1) {
                this.children[i].tabIndex = parseInt(this.tabIndex) + i;
            }
            // it is not suitable for putting codes here, but no other choice
            this.children[i].disabled = this.disabled;
            this.children[i].readOnly = this.readOnly;
            // this.children[i].required = this.required;
            // this.children[i].updateDom();
        }
    }
};

Radios.prototype.toDomforFormGroup = function (parent) {
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

    var add = document.createElement("A");
    add.id = "pls" + this.id;
    add.className = "newcomponent";
    this.dom.appendChild(add);
    var addSpan = document.createElement("i");
    add.appendChild(addSpan);
    addSpan.className = "glyphicon glyphicon-plus";
    addSpan.addEventListener("click", this, false);

    var remove = document.createElement("A");
    remove.id = "rm" + this.id;
    remove.className = "remove";
    this.dom.appendChild(remove);
    var removeSpan = document.createElement("i");
    remove.appendChild(removeSpan);
    removeSpan.className = "glyphicon glyphicon-remove";
    removeSpan.addEventListener("click", this, false);
};

Radios.prototype.handleEvent = function (e) {
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

Radios.prototype.doClick = function (evt) {
    if (this.evn == 0) {
        if (evt.target.className == "glyphicon glyphicon-remove") {
            if (map[this.currOwner] != null
                && map[this.currOwner].currObject instanceof Form) {
                map[this.currOwner].stack.execute(new FMRemoveRowCmd(
                    evt.target.parentNode.parentNode.id,
                    map[this.currOwner].currObject));
            }
        } else if (evt.target.className == "glyphicon glyphicon-plus") {
            if (map[this.currOwner] != null
                && map[this.currOwner].currObject instanceof Form) {
                var rd0 = new Radio();
                rd0.name = "radio";
                rd0.title = "选项x";
                rd0.initValue = "0x";
                RadioComponent.newRadio(rd0, this);
            }
        } else {
            evt.target.focus();
            map[this.currOwner].selected = this;
            map[this.currOwner].enableEditButtons();
            map[this.currOwner].setPropertySheet();
        }
    } else if (this.evn == 1) {

    }
    Utils.stopBubble(evt);
};

Radios.prototype.fetchValue = function () {
    if (this.children.length > 0) {
        var n = this.children[0].name;
        this.initValue = $("input[type='radio'][name='" + n + "']:checked").val();
    }
    if (this.initValue == undefined || this.initValue == null) {
        this.initValue = "";
    }
    return this.initValue;
};

Radios.prototype.updateValueforRuntime = function() {

};

Radios.prototype.doFocus = function (evt) {
    bgcache = evt.target.style.backgroundColor;
    evt.target.style.backgroundColor = Utils.highLight();
    Utils.stopBubble(evt);
};

Radios.prototype.doBlur = function (evt) {
    evt.target.style.backgroundColor = bgcache;
    bgcache = null;
    Utils.stopBubble(evt);
};

Radios.prototype.doDragStart = function (evt) {
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

Radios.prototype.doDrag = function (evt) {
    Utils.stopBubble(evt);
};

Radios.prototype.doDragEnd = function (evt) {
    if (this.evn == 0) {
        if (map[this.currOwner] != null
            && map[this.currOwner].currObject instanceof Form) {
            evt.target.style.opacity = '1';
        }
    } else if (this.evn == 1) {
    }
    Utils.stopBubble(evt);
};

Radios.prototype.parseFromJSON = function (json, evn) {
    this.id = json.id;
    this.parent = json.parent; // parent Id
    this.currOwner = json.currOwner; // form Id
    this.title = json.title;
    this.help = json.help; // description
    this.required = json.required; // 0: not required; 1: required;
    this.inline = json.inline;
    this.tabIndex = json.tabIndex;
    this.initValue = json.initValue;
    this.readOnly = json.readOnly;
    this.disabled = json.disabled; // 0:false; 1:true
    this.hidden = json.hidden;
    this.varId = json.varId;
    this.ac = json.ac;
    this.evn = evn;
    this.parseChildrenFromJSON(json.children, evn);
};

Radios.prototype.parseChildrenFromJSON = function (content, evn) {
    if (content != undefined && content != null && content.length > 0) {
        for (var i = 0; i < content.length; i++) {
            var r = new Radio();
            r.parseFromJSON(content[i], evn, this.initValue);
            this.addChild(r);
        }
    }
};

Radios.prototype.toTree = function () {
    return {
        id: this.id,
        text: this.title,
        icon: "glyphicon glyphicon-record",
        data: "单选框|" + (this.initValue == null ? "" : this.initValue),
    }
};

Radios.prototype.toTreeChildren = function () {
    var children = [];
    for (var i = 0; i < this.children.length; i++) {
        children.push(this.children[i].toTree());
    }
    return children;
};