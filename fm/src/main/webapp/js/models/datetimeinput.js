/**
 * @author Dahai Cao created 2017-08 and last updated at 10:21 on 2019-03-05
 */
function DateTimeInput() {
    this.id = null;
    this.parent = null; // parent Id
    this.currOwner = null; // form Id
    // basic properties
    this.title = "日期时间";
    this.placeholder = "请输入占位描述...";
    this.help = "我的帮助及提示"; // description
    this.required = 1; // 0: not required; 1: required;
    this.tabIndex = "-1";
    this.initValue = "";
    this.readOnly = 0; // 0:false; 1:true; 如果只读，就只显示内容而不显示文本框
    this.disabled = 0; // 0:false; 1:true
    this.hidden = 0; // 0: visible; 1: invisible
    // Three types: DateTime; Date; Time
    this.datatype = "DateTime";
    this.prependType = "Icon"; // No; Text; Icon prepend;
    this.prepend = "fa-calendar-o"; //fa-clock-o
    this.appendType = "No"; // No; Text; Icon prepend;
    this.append = null;
    this.classtypename = "DateTimeInput";
    this.varId = null; // variable Id
    this.ac = null; // accessControl, 0: read only; 1: writable
    this.evn = 0; // environment: 0: design time; 1; runtime

    this.rules = []; // list of rules between the associated components.
};

DateTimeInput.prototype = new UIComponent();

// for previewing
DateTimeInput.prototype.clone = function () {
    var t = new DateTimeInput();
    t.id = this.id;
    t.parent = this.parent; // parent Id
    t.currOwner = this.currOwner; // form Id
    t.title = this.title;
    t.placeholder = this.placeholder;
    t.help = this.help; // description
    t.required = this.required;
    t.tabIndex = this.tabIndex;
    t.initValue = this.initValue;
    t.prependType = this.prependType; // No; Text; Icon prepend;
    t.prepend = this.prepend;
    t.datatype = this.datatype;
    t.appendType = this.appendType; // No; Text; Icon prepend;
    t.append = this.append;
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
DateTimeInput.prototype.cloneRules = function (owner, old) {
    this.f = owner;
    var o = old.seekObjectByID(this.id);
    if (o.rules.length > 0) {
        for (var i = 0; i < o.rules.length; i++) {
            this.rules.push(o.rules[i].clone(old));
        }
    }
};

// for previewing
DateTimeInput.prototype.toDomForHTML = function(parent) {
    this.dom = document.createElement("DIV");
    parent.appendChild(this.dom);
    this.dom.id = this.id;
    this.dom.className = "form-group";
    this.dom.tabIndex = "-1";
    this.updateDom();
    return this.dom;
};

DateTimeInput.prototype.toDom = function (parent) {
    this.toDomforFormGroup(parent);
    this.updateDom();
};

DateTimeInput.prototype.updateDom = function () {
    while (this.dom.hasChildNodes()) { // clear dom
        if (this.dom.lastChild.id != "rm" + this.id) {
            this.dom.removeChild(this.dom.lastChild);
        } else if (this.dom.children.length == 1) {
            break;
        }
    }
    var titlelabel = document.createElement("LABEL");
    titlelabel.className = "control-label";
    this.dom.appendChild(titlelabel);
    var titleNode = document.createTextNode(this.title);
    titlelabel.appendChild(titleNode);
    var that = this;
    if (this.readOnly == 0) {
        var input = document.createElement("INPUT");
        input.id = "datetime" + this.id;
        input.className = "form-control";
        input.type = "button";
        input.style.textAlign = "left";
        if (this.required == 0) { //
            var requiredSpan = document.createElement("SPAN");
            requiredSpan.style.color = "red";
            requiredSpan.innerHTML = " *";
            titlelabel.appendChild(requiredSpan);
            input.setAttribute("required", "");
        } else if (this.required == 1) { //
            input.removeAttribute("required");
        }
        input.value = this.initValue;// write
        if (this.datatype == "DateTime") {
            $(input).datetimepicker({
                dateFormat: "yy-mm-dd",
                timeFormat: "HH:mm:ss",
                onClose: function () {
                    that.initValue = this.value;// read
                },
            });
        } else if (this.datatype == "Date") {
            $(input).datepicker({
                dateFormat: "yy-mm-dd",
                onClose: function () {
                    that.initValue = this.value;// read
                },
            });
        } else if (this.datatype == "Time") {
            $(input).timepicker({
                timeFormat: "HH:mm:ss",
                onClose: function () {
                    that.initValue = this.value;// read
                },
            });
        }
        input.tabIndex = this.tabIndex;
        if (this.disabled == 1)
            input.disabled = true;
        input.setAttribute("placeholder", this.placeholder);
        input.addEventListener("focus", this, false);
        input.addEventListener("blur", this, false);
        input.addEventListener("change", this, false);
        input.addEventListener("input", this, false);
        input.addEventListener("select", this, false);

        if (this.prependType != "No" || this.appendType != "No") {
            var inputGroup = document.createElement("DIV");
            inputGroup.className = "input-group";
            this.dom.appendChild(inputGroup);
            if (this.prependType == "Text") {
                var groupPreAddOn = document.createElement("DIV");
                groupPreAddOn.className = "input-group-addon";
                inputGroup.appendChild(groupPreAddOn);
                var textPrepend = document.createTextNode("");
                groupPreAddOn.appendChild(textPrepend);
                if (this.prepend != null) {
                    textPrepend.textContent = this.prepend;
                } else {
                    textPrepend.textContent = "";
                }
            } else if (this.prependType == "Icon") {
                var groupPreAddOn = document.createElement("DIV");
                groupPreAddOn.className = "input-group-addon";
                inputGroup.appendChild(groupPreAddOn);
                var preIcon = document.createElement("I");
                groupPreAddOn.appendChild(preIcon);
                if (this.prepend != null) {
                    preIcon.className = "fa " + this.prepend;
                } else {
                    preIcon.className = "";
                }
            }
            inputGroup.appendChild(input);
            if (this.appendType == "Text") {
                var groupPostAddOn = document.createElement("DIV");
                groupPostAddOn.className = "input-group-addon";
                inputGroup.appendChild(groupPostAddOn);
                var textAppend = document.createTextNode("");
                groupPostAddOn.appendChild(textAppend);
                if (this.append != null) {
                    textAppend.textContent = this.append;
                } else {
                    textAppend.textContent = "";
                }
            } else if (this.appendType == "Icon") {
                var groupPostAddOn = document.createElement("DIV");
                groupPostAddOn.className = "input-group-addon";
                inputGroup.appendChild(groupPostAddOn);
                var postIcon = document.createElement("I");
                groupPostAddOn.appendChild(postIcon);
                if (this.append != null) {
                    postIcon.className = "fa " + this.append;
                } else {
                    postIcon.className = "";
                }
            }
        } else {
            this.dom.appendChild(input);
        }
        if (this.help != null && this.help != "") {
            var helpNode = document.createElement("SPAN");
            helpNode.className = "help-block";
            helpNode.textContent = this.help;
            helpNode.id = "hlp" + this.id;
            this.dom.appendChild(helpNode);
        }
    } else {
        var input = document.createElement("DIV");
        input.id = "datetime" + this.id;
        input.innerText = this.initValue;
        this.dom.appendChild(input);
    }
    if (this.hidden == 0)
        this.dom.style.display = "";
    else
        this.dom.style.display = "none";
};

DateTimeInput.prototype.fetchValue = function () {
    var format = "";// format
    return this.initValue;
};

DateTimeInput.prototype.updateValueforRuntime = function () {
    var o = document.getElementById("datetime" + this.id);
    o.value = this.initValue;
};

DateTimeInput.prototype.editable = function (e) {
    var o = document.getElementById("datetime" + this.id);
    if (e == "0") {
        o.readOnly = false;
    } else {
        o.readOnly = true;
    }
};

DateTimeInput.prototype.show = function (d) {
    if (this.f != undefined) {
        var o = this.f.seekObjectByID(this.id);
        var i = o.dom;
        if (d == "1") {
            i.style.display = "";
        } else {
            i.style.display = "none";
        }
    } else {
        var o = document.getElementById(this.id);
        if (d == "1") {
            o.style.display = "";
        } else {
            o.style.display = "none";
        }
    }
};

DateTimeInput.prototype.enable = function (e) {
    if (this.f != undefined) {
        var o = this.f.seekObjectByID(this.id);
        var i = o.input;
        if (e == "1") {
            i.disabled = false;
        } else {
            i.disabled = true;
        }
    } else {
        var o = document.getElementById("datetime" + this.id);
        if (e == "1") {
            o.disabled = false;
        } else {
            o.disabled = true;
        }
    }
};

DateTimeInput.prototype.toDomforFormGroup = function (parent) {
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

DateTimeInput.prototype.toRealValue = function () {
    var input = document.getElementById("datetime" + this.id);
    if (input != undefined && input != null) {
        return input.value;
    }
    return null;
};

DateTimeInput.prototype.handleEvent = function (e) {
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
        case "select":
            this.doSelect(e);
            break;
        case "change":
            this.doChange(e);
            break;
        case "input":
            this.doInput(e);
            break;
    }
};

DateTimeInput.prototype.doClick = function (evt) {
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
        Utils.stopBubble(evt);
    } else if (this.evn == 1) {

    }
};

DateTimeInput.prototype.doFocus = function (evt) {
    this.doHandle(evt, 4);

    bgcache = evt.target.style.backgroundColor;
    evt.target.style.backgroundColor = Utils.highLight();
    Utils.stopBubble(evt);
};

DateTimeInput.prototype.doBlur = function (evt) {
    this.doHandle(evt, 5);

    evt.target.style.backgroundColor = bgcache;
    bgcache = null;
    Utils.stopBubble(evt);
};

DateTimeInput.prototype.doChange = function (evt) {
    if (this.evn == 0) {
        this.doHandle(evt, 2);
    } else if (this.evn == 1) {
        map[this.currOwner].stack.execute(new CLValueChangedCmd(this,
            "initValue", evt, this.currOwner));
    }
    Utils.stopBubble(evt);
};

DateTimeInput.prototype.doSelect = function (evt) {
    this.doHandle(evt, 3);
    Utils.stopBubble(evt);
};

DateTimeInput.prototype.doInput = function (evt) {
    this.doHandle(evt, 1);
    Utils.stopBubble(evt);
};

DateTimeInput.prototype.message = function (evt, cmd, msg) {
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

DateTimeInput.prototype.act = function (evt, cmd, o, e, val) {
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
        if (o instanceof SingleLineText || o instanceof MultipleLineText) {
            o.initValue = val;
            o.updateDom();
        }
    } else if (cmd == 9) { // verify

    }
};

DateTimeInput.prototype.fCmd = function (evt, r, e) {
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

DateTimeInput.prototype.tCmd = function (evt, r, e) {
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

DateTimeInput.prototype.doHandle = function (evt, cmd) {
    try {
        var e = document.getElementById("datetime" + this.id);
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

DateTimeInput.prototype.doDragStart = function (evt) {
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

DateTimeInput.prototype.doDrag = function (evt) {
    Utils.stopBubble(evt);
};

DateTimeInput.prototype.doDragEnd = function (evt) {
    if (this.evn == 0) {
        if (map[this.currOwner] != null
            && map[this.currOwner].currObject instanceof Form) {
            evt.target.style.opacity = '1';
        }
        Utils.stopBubble(evt);
    } else if (this.evn == 1) {

    }
};

DateTimeInput.prototype.parseFromJSON = function (json, evn) {
    this.id = json.id;
    this.parent = json.parent; // parent Id
    this.currOwner = json.currOwner; // form Id
    this.title = json.title;
    this.placeholder = json.placeholder;
    this.help = json.help; // description
    this.required = json.required; // 0: not required; 1: required;
    this.tabIndex = json.tabIndex;
    this.initValue = json.initValue;
    this.readOnly = json.readOnly; // 0:false; 1:true
    this.disabled = json.disabled; // 0:false; 1:true
    this.hidden = json.hidden;
    this.datatype = json.datatype;
    this.prependType = json.prependType; // No; Text; Icon prepend;
    this.prepend = json.prepend;
    this.appendType = json.appendType; // No; Text; Icon prepend;
    this.append = json.append;
    this.varId = json.varId;
    this.ac = json.ac;
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

DateTimeInput.prototype.parseExpressions = function (owner) {
    for (var i = 0; i < this.rules.length; i++) {
        this.rules[i].parseExpressions(owner);
    }
};

DateTimeInput.prototype.toTree = function () {
    return {
        id: this.id,
        text: this.title,
        icon: "fa fa-file-text-o",
        data: "日期时间|" + (this.initValue == null ? "" : this.initValue),
    }
};

DateTimeInput.prototype.fetchRuleByNum = function (number) {
    if (this.rules.length > 0) {
        for (var i = 0; i < this.rules.length; i++) {
            if (i + 1 == number) {
                return this.rules[i];
            }
        }
    }
    return null;
};

DateTimeInput.prototype.toString = function () {
    return this.title == null ? "日期时间" : this.title;
};

DateTimeInput.prototype.addRule = function (r) {
    this.rules.push(r);
};

DateTimeInput.prototype.insertRule = function (r, index) {
    this.rules.splice(index, 0, r);
};

DateTimeInput.prototype.removeRule = function (r) {
    for (var i = 0; i < this.rules.length; i++) {
        if (this.rules[i] == r) {
            this.rules.splice(i, 1);
            break;
        }
    }
};
