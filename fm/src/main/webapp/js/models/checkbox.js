/**
 *
 */
function CheckBox() {
    this.id = null;
    this.name = null;
    this.parent = null; // parent Id
    this.currOwner = null; // form Id
    // basic properties
    this.title = null;
    this.required = 0; // 0: not required; 1: required;
    this.checked = 0; // 0: not checked; 1: checked;
    this.tabIndex = "-1";
    this.inline = 1; // 0: not inline; 1: inline;
    this.initValue = null; // default value
    this.readOnly = 0; // 0:false; 1:true; 如果只读，就只显示内容而不显示文本框
    this.disabled = 0; // 0:false; 1:true
    this.hidden = 0; // 0: visible; 1: invisible
    this.classtypename = "CheckBox";
    this.evn = 0;
    this.rules = [];
};

CheckBox.prototype = new UIComponent();

// for previewing
CheckBox.prototype.clone = function () {
    var t = new CheckBox();
    t.id = this.id;
    t.name = this.name;
    t.parent = this.parent; // parent Id
    t.currOwner = this.currOwner; // form Id
    t.title = this.title;
    t.required = this.required; // 0: not required; 1: required;
    t.checked = this.checked; // 0: not checked; 1: checked;
    t.tabIndex = this.tabIndex;
    t.inline = this.inline; // 0: not inline; 1: inline;
    t.initValue = this.initValue;
    t.readOnly = this.readOnly;
    t.disabled = this.disabled; // 0:false; 1:true
    t.hidden = this.hidden;
    t.evn = this.evn;
    t.toDomForHTML();
    return t;
};

// for previewing
CheckBox.prototype.cloneRules = function (owner, old) {
    var o = old.seekObjectByID(this.id);
    if (o.rules.length > 0) {
        for (var i = 0; i < o.rules.length; i++) {
            this.rules.push(o.rules[i].clone(old));
        }
    }
};

// for previewing
CheckBox.prototype.toDomForHTML = function(parent) {
    this.dom = document.createElement("DIV");
    parent.appendChild(this.dom);
    this.dom.id = this.id;
    this.dom.className = "checkradioedit";
    this.dom.tabIndex = "-1";
    this.updateDom();
    return this.dom;
};

CheckBox.prototype.toDom = function (parent) {
    this.toDomforFormGroup(parent);
    this.updateDom();
};

CheckBox.prototype.toDomforFormGroup = function (parent) {
    this.dom = document.createElement("DIV");
    parent.appendChild(this.dom);
    this.dom.id = this.id;
    this.dom.className = "checkradioedit";
    this.dom.tabIndex = "-1";
    this.dom.draggable = "true";
    // dragged component
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

CheckBox.prototype.updateDom = function () {
    while (this.dom.hasChildNodes()) { // clear dom
        if (this.dom.lastChild.id != "rm" + this.id) {
            this.dom.removeChild(this.dom.lastChild);
        } else if (this.dom.children.length == 1) {
            break;
        }
    }
    if (this.inline == 0) {
        this.dom.classList.remove("checkbox-inline");
        this.dom.classList.add("checkbox");
    } else {
        this.dom.classList.remove("checkbox");
        this.dom.classList.add("checkbox-inline");
    }
    if (this.hidden == 0)
        this.dom.style.display = "";
    else
        this.dom.style.display = "none";
    var checkLabel = document.createElement("LABEL");
    this.dom.appendChild(checkLabel);

    if (this.readOnly == 0) {
        var input = document.createElement("INPUT");
        checkLabel.appendChild(input);
        input.id = "chk" + this.id;
        if (this.name != undefined || this.name != null || this.name != "") {
            input.name = this.name;
        } else {
            input.name = "chk" + this.parent;
        }
        input.type = "checkbox";
        input.tabIndex = this.tabIndex;
        input.addEventListener("click", this, false);
        if (this.checked == 1) {
            input.checked = true;
        }
        if (this.required == 1) {
            input.required = true;
        }
        if (this.disabled == 1) {
            input.disabled = true;
        }
        if (this.initValue != undefined && this.initValue != null)
            input.value = this.initValue;
    } else {
        var icon = document.createElement("i");
        checkLabel.appendChild(icon);
        icon.id = "chk" + this.id;
        icon.style.marginRight = "8px";
        if (this.checked == 1) {
            icon.className = "fa fa-check-square fa-lg";
        } else {
            icon.className = "fa fa-square-o fa-lg";
        }
        icon.setAttribute("aria-hidden", "true");
    }
    if (this.title != null && this.title != "")
        checkLabel.appendChild(document.createTextNode(this.title));
};

CheckBox.prototype.handleEvent = function (e) {
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

CheckBox.prototype.doClick = function (evt) {
    var e = document.getElementById("chk" + this.id);
    if (e == undefined || e == null) {
        return;
    }
    if (e.checked) {
        this.doHandle(evt, 6);
    } else {
        this.doHandle(evt, 7);
    }
    if (this.evn == 0) {
        if (evt.target.className == "glyphicon glyphicon-remove") {
            if (map[this.currOwner] != null
                && map[this.currOwner].currObject instanceof Form) {
                map[this.currOwner].stack.execute(new FMRemoveCheckRadioCmd(
                    evt.target.parentNode.parentNode.id,
                    map[this.currOwner].currObject));
            }
        } else if (evt.target.tagName == "INPUT") {
            var c = 0;
            if (evt.target.checked) {
                c = 1;
            }
            map[this.currOwner].stack.execute(new FMValueChangedCmd(this,
                "checked", c, map[this.currOwner].currObject));
        } else {
            evt.target.focus();
            map[this.currOwner].selected = this;
            map[this.currOwner].enableEditButtons();
            map[this.currOwner].setPropertySheet();
        }
        Utils.stopBubble(evt);
    } else {

    }
};

CheckBox.prototype.updateValueforRuntime = function() {

};

CheckBox.prototype.doFocus = function (evt) {
    bgcache = evt.target.style.backgroundColor;
    evt.target.style.backgroundColor = Utils.highLight();
    Utils.stopBubble(evt);
};

CheckBox.prototype.doBlur = function (evt) {
    evt.target.style.backgroundColor = bgcache;
    bgcache = null;
    Utils.stopBubble(evt);
};

CheckBox.prototype.doDragStart = function (evt) {
    if (this.evn == 0) {
        if (map[this.currOwner] != null
            && map[this.currOwner].currObject instanceof Form) {
            // this / e.target is the source node.
            evt.target.style.opacity = '0.7';
            evt.dataTransfer.effectAllowed = 'move';
            copyclip = evt.target.id; // critical
        }
        Utils.stopBubble(evt);
    } else if (this.evn == 1) {

    }
};

CheckBox.prototype.doDrag = function (evt) {
    Utils.stopBubble(evt);
};

CheckBox.prototype.doDragEnd = function (evt) {
    if (this.evn == 0) {
        if (map[this.currOwner] != null
            && map[this.currOwner].currObject instanceof Form) {
            evt.target.style.opacity = '1';
        }
        Utils.stopBubble(evt);
    } else if (this.evn == 1) {

    }
};

CheckBox.prototype.doHandle = function (evt, cmd) {
    try {
        var e = document.getElementById("chk" + this.id);
        if (e == undefined || e == null) {
            return;
        }
        for (var i = 0; i < this.rules.length; i++) {
            if (this.rules[i].behavior == cmd) {
                if (this.rules[i].conditions == null
                    || this.rules[i].conditions.isNull()) {
                    // execute two commands:
                    // the first command:
                    this.tCmd(evt, this.rules[i], e);
                    // the second command:
                    this.fCmd(evt, this.rules[i], e);
                } else {
                    if (eval(this.rules[i].conditions.toRealValue())) {
                        this.tCmd(evt, this.rules[i], e);
                    } else {
                        this.fCmd(evt, this.rules[i], e);
                    }
                }
            }
        }
    } catch (exception) {
        console.log(exception);
    }
};

CheckBox.prototype.message = function (evt, cmd, msg) {
    if (cmd == 10 || cmd == 11 || cmd == 12 || cmd == 13) {
        var t = document.getElementById("hlp" + this.id);
        if (t == null) {
            t = document.createElement("SPAN");
            this.dom.appendChild(t);
            t.className = "help-block";
            t.id = "hlp" + this.id;
        }
        if (cmd == 10) {
            t.classList.add("alert-success");
        } else if (cmd == 11) {
            t.classList.add("alert-info");
        } else if (cmd == 12) {
            t.classList.add("alert-warning");
        } else if (cmd == 13) {
            t.classList.add("alert-danger");
        }
        t.textContent = msg;
    }
};

CheckBox.prototype.fCmd = function (evt, r, e) {
    if (r.eComId == null || r.eComId == "") {
        return;
    }
    if (r.eComId == 0) {
        this.message(evt, r.eComAction, (r.eComExpressions == null ? ""
            : eval(r.eComExpressions.toRealValue())));
    } else {
        var o = map[this.currOwner].currObject.seekObjectByID(r.eComId);
        this.act(evt, r.eComAction, o, e, (r.eComExpressions == null ? ""
            : eval(r.eComExpressions.toRealValue())));
    }
};

CheckBox.prototype.tCmd = function (evt, r, e) {
    if (r.tComId == null || r.tComId == "") {
        return;
    }
    if (r.tComId == 0) {
        this.message(evt, r.tComAction, (r.tComExpressions == null ? ""
            : eval(r.tComExpressions.toRealValue())));
    } else {
        var o = map[this.currOwner].currObject.seekObjectByID(r.tComId);
        this.act(evt, r.tComAction, o, e, (r.tComExpressions == null ? ""
            : eval(r.tComExpressions.toRealValue())));
    }
};

CheckBox.prototype.act = function (evt, cmd, o, e, val) {
    if (cmd == 1) {
        o.show("0"); // hidden
    } else if (cmd == 2) {
        o.show("1"); // show
    } else if (cmd == 3) {
        if (o.editable)
            o.editable("0"); // writable
    } else if (cmd == 4) {
        if (o.editable)
            o.editable("1"); // read only
    } else if (cmd == 5) {
        if (o.enable)
            o.enable("1"); // enabled
    } else if (cmd == 6) {
        if (o.enable)
            o.enable("0"); // disabled
    } else if (cmd == 7) { // clear
        e.value = "";
        o.initValue = "";
    } else if (cmd == 8) { // update

    } else if (cmd == 9) { // verify

    }
};

CheckBox.prototype.parseFromJSON = function (json, evn, val) {
    this.id = json.id;
    this.name = json.name;
    this.parent = json.parent; // parent Id
    this.currOwner = json.currOwner; // form Id
    this.title = json.title;
    this.required = json.required; // 0: not required; 1: required;
    this.checked = json.checked; // 0: not checked; 1: checked
    this.tabIndex = json.tabIndex;
    this.inline = json.inline;
    this.initValue = json.initValue;
    this.readOnly = json.readOnly;
    this.disabled = json.disabled; // 0:false; 1:true
    this.hidden = json.hidden;
    this.evn = evn;

    if (val!= null && val.length > 0) {
        for (var j = 0; j < val.length; j++) {
            if (this.initValue == val[j]) {

                this.checked = 1;
                break;
            }
        }
    }

    // parsing propagation rules firstly.
    if (json.rules != undefined && json.rules != null && json.rules.length > 0) {
        for (var i = 0; i < json.rules.length; i++) {
            var r = new PropagateRule();
            r.parseFromJSON(json.rules[i]);
            this.rules.push(r);
        }
    }
};

CheckBox.prototype.parseExpressions = function (owner) {
    for (var i = 0; i < this.rules.length; i++) {
        this.rules[i].parseExpressions(owner);
    }
};

CheckBox.prototype.fetchRuleByNum = function (number) {
    if (this.rules.length > 0) {
        for (var i = 0; i < this.rules.length; i++) {
            if (i + 1 == number) {
                return this.rules[i];
            }
        }
    }
    return null;
};

CheckBox.prototype.toString = function () {
    return this.initValue + ":" + this.title + "\n";
};

CheckBox.prototype.toTree = function () {
    return {
        id: this.id,
        text: this.title,
        icon: "glyphicon glyphicon-check",
        data: "复选框|" + (this.initValue == null ? "" : this.initValue),
    }
};

CheckBox.prototype.addRule = function (r) {
    this.rules.push(r);
};

CheckBox.prototype.insertRule = function (r, index) {
    this.rules.splice(index, 0, r);
};

CheckBox.prototype.removeRule = function (r) {
    for (var i = 0; i < this.rules.length; i++) {
        if (this.rules[i] == r) {
            this.rules.splice(i, 1);
            break;
        }
    }
};
