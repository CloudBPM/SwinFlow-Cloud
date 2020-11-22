/**
 * @author Dahai Cao created 2017-08 and last updated at 10:21 on 2019-03-05
 */
function DateTimeRangeInput() {
    this.id = null;
    this.parent = null; // parent Id
    this.currOwner = null; // form Id
    // basic properties
    this.title = "日期时间范围";
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
    this.prependType = "No"; // No; Text; Icon prepend;
    this.prepend = null;
    this.appendType = "No"; // No; Text; Icon prepend;
    this.append = null;
    this.classtypename = "DateTimeRangeInput";
    this.varId = null; // variable Id
    this.ac = null; // accessControl, 0: read only; 1: writable
    this.evn = 0; // environment: 0: design time; 1; runtime
    this.opts = [1, 1, 1, 1];
    this.largeDuration = "0";
    this.largeDurationUnit = "0";
    this.hours = "0";
    this.minutes = "0";
    this.seconds = "0";

    this.rules = []; // list of rules between the associated components.
};

DateTimeRangeInput.prototype = new UIComponent();

// for previewing
DateTimeRangeInput.prototype.clone = function () {
    var t = new DateTimeRangeInput();
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
    t.datetype = this.datatype;
    t.appendType = this.appendType; // No; Text; Icon prepend;
    t.append = this.append;
    t.readOnly = this.readOnly; // 0:false; 1:true
    t.disabled = this.disabled; // 0:false; 1:true
    t.hidden = this.hidden;
    t.varId = this.varId;
    t.ac = this.ac;
    t.evn = this.evn;
    t.opts = this.opts;
    t.largeDuration = this.largeDuration;
    t.largeDurationUnit = this.largeDurationUnit;
    t.hours = this.hours;
    t.minutes = this.minutes;
    t.seconds = this.seconds;
    t.toDomForHTML();
    return t;
};

// for previewing
DateTimeRangeInput.prototype.cloneRules = function (owner, old) {
    this.f = owner;
    var o = old.seekObjectByID(this.id);
    if (o.rules.length > 0) {
        for (var i = 0; i < o.rules.length; i++) {
            this.rules.push(o.rules[i].clone(old));
        }
    }
};

// for previewing
DateTimeRangeInput.prototype.toDomForHTML = function(parent) {
    this.dom = document.createElement("DIV");
    parent.appendChild(this.dom);
    this.dom.id = this.id;
    this.dom.className = "form-group";
    this.dom.tabIndex = "-1";
    this.updateDom();
    return this.dom;
};

DateTimeRangeInput.prototype.toDom = function (parent) {
    this.toDomforFormGroup(parent);
    this.updateDom();
};

DateTimeRangeInput.prototype.updateDom = function () {
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
    if (this.readOnly == 0) {
        var input = document.createElement("INPUT");
        input.id = "dtrange" + this.id;
        input.className = "form-control";
        if (this.required == 0) { //
            var requiredSpan = document.createElement("SPAN");
            requiredSpan.style.color = "red";
            requiredSpan.innerHTML = " *";
            titlelabel.appendChild(requiredSpan);
            input.setAttribute("required", "");
        } else if (this.required == 1) { //
            input.removeAttribute("required");
        }

        var dtrangeDiv = document.createElement("DIV");
        this.dom.appendChild(dtrangeDiv);
        dtrangeDiv.id = "dtrplugin" + this.id;
        $(dtrangeDiv).dateTimeRangePlugin({
            id: "dtrange" + this.id,
            entity: this,
            opts: this.opts,
            disabled: this.disabled,
        });
        //var editor8 = plugin8.data("dateTimeRangePlugin");

        if (this.help != null && this.help != "") {
            var helpNode = document.createElement("SPAN");
            helpNode.className = "help-block";
            helpNode.textContent = this.help;
            helpNode.id = "hlp" + this.id;
            this.dom.appendChild(helpNode);
        }
    } else {
        var input = document.createElement("DIV");
        input.id = "dtrange" + this.id;
        input.innerText = this.initValue;
        this.dom.appendChild(input);
    }
    if (this.hidden == 0)
        this.dom.style.display = "";
    else
        this.dom.style.display = "none";
    this.input = input;
};

DateTimeRangeInput.prototype.updateValueforRuntime = function () {
    var o = document.getElementById("dtrplugin" + this.id);
    var plugin8 = $(o).dateTimeRangePlugin();
    var editor8 = plugin8.data("dateTimeRangePlugin");
    editor8.dayInput.value = this.largeDuration;
    editor8.daySelect.value = this.largeDurationUnit;
    editor8.hourInput.value = this.hours;
    editor8.minuteInput.value = this.minutes;
    editor8.secondInput.value = this.seconds;
};

DateTimeRangeInput.prototype.editable = function (e) {
    var o = document.getElementById("dtrange" + this.id);
    if (e == "0") {
        o.readOnly = false;
    } else {
        o.readOnly = true;
    }
};

DateTimeRangeInput.prototype.show = function (d) {
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

DateTimeRangeInput.prototype.enable = function (e) {
    if (this.f != undefined) {
        var o = this.f.seekObjectByID(this.id);
        var i = o.input;
        if (e == "1") {
            i.disabled = false;
        } else {
            i.disabled = true;
        }
    } else {
        var o = document.getElementById("dtrange" + this.id);
        if (e == "1") {
            o.disabled = false;
        } else {
            o.disabled = true;
        }
    }
};

DateTimeRangeInput.prototype.toDomforFormGroup = function (parent) {
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

DateTimeRangeInput.prototype.toRealValue = function () {
    var input = document.getElementById("dtrange" + this.id);
    if (input != undefined && input != null) {
        return input.value;
    }
    return null;
};

DateTimeRangeInput.prototype.fetchValue = function () {

    var v = "";
    if (this.opts[0] == 1) {
        v = this.largeDuration + "|" + this.largeDurationUnit;
    } else {
        v = "0|0";
    }
    if (this.opts[1] == 1) {
        v = v + "|" + this.hours;
    } else {
        v = v + "|0";
    }
    if (this.opts[2] == 1) {
        v = v + "|" + this.minutes;
    } else {
        v = v + "|0";
    }
    if (this.opts[3] == 1) {
        v = v + "|" + this.seconds;
    } else {
        v = v + "|0";
    }
    return v;
};

DateTimeRangeInput.prototype.handleEvent = function (e) {
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

DateTimeRangeInput.prototype.doClick = function (evt) {
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

DateTimeRangeInput.prototype.doFocus = function (evt) {
    this.doHandle(evt, 4);

    bgcache = evt.target.style.backgroundColor;
    evt.target.style.backgroundColor = Utils.highLight();
    Utils.stopBubble(evt);
};

DateTimeRangeInput.prototype.doBlur = function (evt) {
    this.doHandle(evt, 5);

    evt.target.style.backgroundColor = bgcache;
    bgcache = null;
    Utils.stopBubble(evt);
};

DateTimeRangeInput.prototype.doChange = function (evt) {
    if (this.evn == 0) {
        this.doHandle(evt, 2);
    } else if (this.evn == 1) {
        map[this.currOwner].stack.execute(new CLValueChangedCmd(this,
            "initValue", evt, this.currOwner));
    }
    Utils.stopBubble(evt);
};

DateTimeRangeInput.prototype.doSelect = function (evt) {
    this.doHandle(evt, 3);
    Utils.stopBubble(evt);
};

DateTimeRangeInput.prototype.doInput = function (evt) {
    this.doHandle(evt, 1);
    Utils.stopBubble(evt);
};

DateTimeRangeInput.prototype.message = function (evt, cmd, msg) {
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

DateTimeRangeInput.prototype.act = function (evt, cmd, o, e, val) {
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

DateTimeRangeInput.prototype.fCmd = function (evt, r, e) {
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

DateTimeRangeInput.prototype.tCmd = function (evt, r, e) {
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

DateTimeRangeInput.prototype.doHandle = function (evt, cmd) {
    try {
        var e = document.getElementById("dtrange" + this.id);
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

DateTimeRangeInput.prototype.doDragStart = function (evt) {
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

DateTimeRangeInput.prototype.doDrag = function (evt) {
    Utils.stopBubble(evt);
};

DateTimeRangeInput.prototype.doDragEnd = function (evt) {
    if (this.evn == 0) {
        if (map[this.currOwner] != null
            && map[this.currOwner].currObject instanceof Form) {
            evt.target.style.opacity = '1';
        }
    } else if (this.evn == 1) {
    }
    Utils.stopBubble(evt);
};

DateTimeRangeInput.prototype.parseFromJSON = function (json, evn) {
    this.id = json.id;
    this.parent = json.parent; // parent Id
    this.currOwner = json.currOwner; // form Id
    this.title = json.title;
    this.placeholder = json.placeholder;
    this.help = json.help; // description
    this.required = json.required; // 0: not required; 1: required;
    this.tabIndex = json.tabIndex;
    this.initValue = json.initValue;
    this.datatype = json.datatype;
    this.readOnly = json.readOnly; // 0:false; 1:true
    this.disabled = json.disabled; // 0:false; 1:true
    this.hidden = json.hidden;
    this.prependType = json.prependType; // No; Text; Icon prepend;
    this.prepend = json.prepend;
    this.appendType = json.appendType; // No; Text; Icon prepend;
    this.append = json.append;
    this.varId = json.varId;
    this.ac = json.ac;
    this.evn = evn;
    this.opts = json.opts;
    this.largeDuration = json.largeDuration;
    this.largeDurationUnit = json.largeDurationUnit;
    this.hours = json.hours;
    this.minutes = json.minutes;
    this.seconds = json.seconds;
    // parsing propagation rules firstly.
    if (json.rules != undefined && json.rules != null && json.rules.length > 0) {
        for (var i = 0; i < json.rules.length; i++) {
            var r = new PropagateRule();
            r.parseFromJSON(json.rules[i]);
            this.rules.push(r);
        }
    }
};

DateTimeRangeInput.prototype.parseExpressions = function (owner) {
    for (var i = 0; i < this.rules.length; i++) {
        this.rules[i].parseExpressions(owner);
    }
};

DateTimeRangeInput.prototype.toTree = function () {
    return {
        id: this.id,
        text: this.title,
        icon: "fa fa-file-text-o",
        data: "日期时间范围|" + (this.initValue == null ? "" : this.initValue),
    }
};

DateTimeRangeInput.prototype.fetchRuleByNum = function (number) {
    if (this.rules.length > 0) {
        for (var i = 0; i < this.rules.length; i++) {
            if (i + 1 == number) {
                return this.rules[i];
            }
        }
    }
    return null;
};

DateTimeRangeInput.prototype.toString = function () {
    return this.title == null ? "日期时间范围" : this.title;
};

DateTimeRangeInput.prototype.addRule = function (r) {
    this.rules.push(r);
};

DateTimeRangeInput.prototype.insertRule = function (r, index) {
    this.rules.splice(index, 0, r);
};

DateTimeRangeInput.prototype.removeRule = function (r) {
    for (var i = 0; i < this.rules.length; i++) {
        if (this.rules[i] == r) {
            this.rules.splice(i, 1);
            break;
        }
    }
};
