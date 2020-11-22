/**
 *
 */
function EarthMap() {
    this.id = null;
    this.parent = null; // parent Id
    this.currOwner = null; // form Id
    // basic properties
    this.title = "地图";
    this.type = "EarthMap"; // type: submit|button|reset
    this.tabIndex = "-1";
    this.fillWidth = 0; // 0: actual width; 1: 100% width
    this.disabled = 0; // 0:false; 1:true
    this.hidden = 0; // 0: visible; 1: invisible
    this.classtypename = "EarthMap";
    this.evn = 0;
    this.rules = [];
};

EarthMap.prototype = new UIComponent();

// for previewing
EarthMap.prototype.clone = function () {
    var t = new Map();
    t.id = this.id;
    t.parent = this.parent; // parent Id
    t.currOwner = this.currOwner; // form Id
    t.title = this.title;
    t.type = this.type;
    t.fillWidth = this.fillWidth;
    t.tabIndex = this.tabIndex;
    t.disabled = this.disabled; // 0:false; 1:true
    t.hidden = this.hidden;
    t.evn = this.evn;
    t.toDomForHTML();
    return t;
};

EarthMap.prototype.show = function (d) {
    var o = document.getElementById(this.id);
    if (d == "1") {
        o.style.display = "";
    } else {
        o.style.display = "none";
    }
};

EarthMap.prototype.enable = function (e) {
    var o = document.getElementById("btn" + this.id);
    if (e == "1") {
        o.disabled = false;
    } else {
        o.disabled = true;
    }
};

EarthMap.prototype.cloneRules = function (owner, old) {
    var o = old.seekObjectByID(this.id);
    if (o.rules.length > 0) {
        for (var i = 0; i < o.rules.length; i++) {
            this.rules.push(o.rules[i].clone(owner));
        }
    }
};

// for previewing
EarthMap.prototype.toDomForHTML = function(parent) {
    this.dom = document.createElement("DIV");
    parent.appendChild(this.dom);
    this.dom.id = this.id;
    this.dom.className = "form-group";
    // this.dom.style.height  = "100%";
    this.dom.tabIndex = "-1";
    this.updateDom();
    return this.dom;
};

EarthMap.prototype.toDom = function (parent) {
    this.toDomforFormGroup(parent);
    this.updateDom();
};

EarthMap.prototype.updateDom = function () {
    while (this.dom.hasChildNodes()) { // clear dom
        if (this.dom.lastChild.id != "rm" + this.id) {
            this.dom.removeChild(this.dom.lastChild);
        } else if (this.dom.children.length == 1) {
            break;
        }
    }
    var mymap = document.createElement("DIV");
    this.dom.appendChild(mymap);
    mymap.id = "earthmap" + this.id;
    if (this.evn == 0) {
        if (this.dom.parentElement != null) {
            mymap.style.height = (this.dom.parentElement.clientHeight) + "px";
        } else {
            mymap.style.width = "500px";
            mymap.style.height = "600px";
        }
    } else if (this.evn == 1) {
        mymap.style.height = (this.dom.parentElement.clientHeight) + "px";
    }

    var map = new AMap.Map('earthmap' + this.id, {
        center: [117.000923, 36.675807],
        zoom: 11
    });
    map.plugin(["AMap.ToolBar"], function () {
        map.addControl(new AMap.ToolBar());
    });

    // var button = document.createElement("button");
    // button.id = "btn" + this.id;
    // button.addEventListener("click", this, false);
    // button.className = "btn";
    // button.classList.add("btn-default");
    // if (this.fillWidth == 1)
    //     button.classList.add("btn-block");
    // if (this.disabled == 1)
    //     button.disabled = true;
    // var buttonlabel = document.createTextNode(this.title);
    // button.appendChild(buttonlabel);
    // button.tabIndex = this.tabIndex;
    // if (this.hidden == 0)
    //     this.dom.style.display = "";
    // else
    //     this.dom.style.display = "none";
    // this.dom.appendChild(button);
};

EarthMap.prototype.toDomforFormGroup = function (parent) {
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

EarthMap.prototype.handleEvent = function (e) {
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

EarthMap.prototype.doClick = function (evt) {
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
            map[this.currOwner].enableEditButtons();
            map[this.currOwner].setPropertySheet();
        }
    } else if (this.evn == 1) {
    }
    Utils.stopBubble(evt);
};

EarthMap.prototype.doFocus = function (evt) {
    bgcache = evt.target.style.backgroundColor;
    evt.target.style.backgroundColor = Utils.highLight();
    Utils.stopBubble(evt);
};

EarthMap.prototype.doBlur = function (evt) {
    evt.target.style.backgroundColor = bgcache;
    bgcache = null;
    Utils.stopBubble(evt);
};

EarthMap.prototype.doDragStart = function (evt) {
    if (this.evn == 0) {
        if (map[this.currOwner] != null
            && map[this.currOwner].currObject instanceof Form) {
            evt.target.style.opacity = '0.7'; // this / e.target is the source
            // node.
            evt.dataTransfer.effectAllowed = 'move';
            copyclip = evt.target.id; // critical
        }
    } else if (this.evn == 1) {
    }
    Utils.stopBubble(evt);
};

EarthMap.prototype.doDrag = function (evt) {
    Utils.stopBubble(evt);
};

EarthMap.prototype.doDragEnd = function (evt) {
    if (this.evn == 0) {
        if (map[this.currOwner] != null
            && map[this.currOwner].currObject instanceof Form) {
            evt.target.style.opacity = '1';
        }
    } else if (this.evn == 1) {
    }
    Utils.stopBubble(evt);
};

EarthMap.prototype.parseFromJSON = function (json, evn) {
    this.id = json.id;
    this.parent = json.parent; // parent Id
    this.currOwner = json.currOwner; // form Id
    this.title = json.title;
    this.type = json.type;
    this.tabIndex = json.tabIndex;
    this.fillWidth = json.fillWidth;
    this.disabled = json.disabled; // 0:false; 1:true
    this.hidden = json.hidden;
    this.evn = evn;
    // parsing propagation rules firstly.
    if (json.rules != undefined && json.rules != null && json.rules.length > 0) {
        for (var i = 0; i < json.rules.length; i++) {
            var r = new PropagateRule();
            r.parseFromJSON(json.rules[i]);
            this.rules.push(r);
        }
    }
};

EarthMap.prototype.parseExpressions = function (owner) {
    for (var i = 0; i < this.rules.length; i++) {
        this.rules[i].parseExpressions(owner);
    }
};

EarthMap.prototype.toTree = function () {
    return {
        id: this.id,
        text: this.title,
        icon: "glyphicon glyphicon-unchecked",
        data: "地图|",
    }
};
