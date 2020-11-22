/**
 * 普通表格组件。
 *
 * @author Dahai Cao created at 12:50pm on 2019-03-09
 */
function TableView() {
    this.id = null;
    this.parent = null; // parent Id
    this.currOwner = null; // form Id
    // basic properties
    this.title = "普通表格";
    this.help = "我的帮助及提示"; // description
    this.required = 1; // 0: not required; 1: required;
    this.tabIndex = "-1";
    this.initValue = null;
    this.width = "0";
    this.height = "300px";
    this.readOnly = 0; // 0:false; 1:true
    this.disabled = 0; // 0:false; 1:true
    this.hidden = 0; // 0: visible; 1: invisible
    this.rptId = null; // report Id
    this.ac = null;
    this.evn = 0;
    this.classtypename = "TableView";
    // 0:no operation buttons;1: has operation buttons
    this.hasOperations = 0;
    // 0:no;1:has
    this.hasViewButton = 0;
    // 0:no;1:has
    this.hasModifyButton = 0;
    // 0:no;1:has
    this.hasDeleteButton = 0;

    this.rules = []; // list of propagation rules
};

TableView.prototype = new UIComponent();

// for previewing
TableView.prototype.clone = function () {
    var t = new TableView();
    t.id = this.id;
    t.parent = this.parent; // parent Id
    t.currOwner = this.currOwner; // form Id
    t.title = this.title;
    t.help = this.help; // description
    t.required = this.required;
    t.tabIndex = this.tabIndex;
    t.initValue = this.initValue;
    t.readOnly = this.readOnly;
    t.disabled = this.disabled; // 0:false; 1:true
    t.hidden = this.hidden;
    t.rptId = this.rptId; // report service Id
    t.ac = this.ac;
    t.evn = this.evn;
    t.width = this.width;
    t.height = this.height;
    t.hasOperations = this.hasOperations;
    t.hasViewButton = this.hasViewButton;
    t.hasModifyButton = this.hasModifyButton;
    t.hasDeleteButton = this.hasDeleteButton;
    t.toDomForHTML();
    return t;
};

// for previewing
TableView.prototype.cloneRules = function (owner, old) {
    var o = old.seekObjectByID(this.id);
    if (o.rules.length > 0) {
        for (var i = 0; i < o.rules.length; i++) {
            this.rules.push(o.rules[i].clone(old));
        }
    }
};

// for previewing
TableView.prototype.toDomForHTML = function(parent) {
    this.dom = document.createElement("DIV");
    parent.appendChild(this.dom);
    this.dom.id = this.id;
    this.dom.className = "form-group";
    this.dom.tabIndex = "-1";
    this.updateDom();
    return this.dom;
};

TableView.prototype.toDom = function (parent) {
    this.toDomforFormGroup(parent);
    this.updateDom();
};

TableView.prototype.updateDom = function () {
    while (this.dom.hasChildNodes()) { // clear dom
        if (this.dom.lastChild.id != "rm" + this.id) {
            this.dom.removeChild(this.dom.lastChild);
        } else if (this.dom.children.length == 1) {
            break;
        }
    }
    if (this.title != null && this.title != "") {
        var titlelabel = document.createElement("LABEL");
        titlelabel.className = "control-label";
        this.dom.appendChild(titlelabel);
        var titleNode = document.createTextNode(this.title);
        titlelabel.appendChild(titleNode);
    }

    var pluginDIV = document.createElement("DIV");
    this.dom.appendChild(pluginDIV);

    if ($(pluginDIV).tableViewPlugin != undefined) {
        var p3 = $(pluginDIV).tableViewPlugin({
            id: "0161",
            rid: this.id,// pageable table view ID
            width: this.width,
            height: this.height,
        });
        this.plugin = p3.data("tableViewPlugin");
    }

    this.plugin.rptId = this.rptId;
    this.plugin.hasOperations = this.hasOperations;
    this.plugin.hasViewButton = this.hasViewButton;
    this.plugin.hasModifyButton = this.hasModifyButton;
    this.plugin.hasDeleteButton = this.hasDeleteButton;

    if (this.help != null && this.help != "") {
        var helpNode = document.createElement("SPAN");
        helpNode.className = "help-block";
        helpNode.id = "hlp" + this.id;
        helpNode.textContent = this.help;
        this.dom.appendChild(helpNode);
    }

    if (this.hidden == 0)
        this.dom.style.display = "";
    else
        this.dom.style.display = "none";

    if (this.rptId == null)
        this.plugin.loadReport(null);
    else
        this.plugin.loadData(this.rptId);
};

TableView.prototype.editable = function (e) {
    var o = document.getElementById("lst" + this.id);
    if (e == "0") {
        o.readOnly = false;
    } else {
        o.readOnly = true;
    }
};

TableView.prototype.show = function (d) {
    var o = document.getElementById(this.id);
    if (d == "1") {
        o.style.display = "";
    } else {
        o.style.display = "none";
    }
};

TableView.prototype.enable = function (e) {
    var o = document.getElementById("lst" + this.id);
    if (e == "1") {
        o.disabled = false;
    } else {
        o.disabled = true;
    }
};

TableView.prototype.addOptions = function (parent, title, value, index) {
    var option = document.createElement("option");
    option.text = title;
    option.value = value;
    parent.options.add(option, index);
};

TableView.prototype.toDomforFormGroup = function (parent) {
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

TableView.prototype.toRealValue = function () {
    var sel = document.getElementById("lst" + this.id);
    if (sel != undefined && sel != null) {
        return "\"" + sel.value + "\"";
    }
    return null;
};

TableView.prototype.handleEvent = function (e) {
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
        case "change":
            this.doChange(e);
            break;
    }
};

TableView.prototype.doClick = function (evt) {
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

TableView.prototype.doFocus = function (evt) {
    this.doHandle(evt, 4);

    this.bgcache = evt.target.style.backgroundColor;
    evt.target.style.backgroundColor = Utils.highLight();
    Utils.stopBubble(evt);
};

TableView.prototype.doBlur = function (evt) {
    this.doHandle(evt, 5);

    evt.target.style.backgroundColor = bgcache;
    this.bgcache = null;
    Utils.stopBubble(evt);
};

TableView.prototype.doChange = function (evt) {
    this.doHandle(evt, 2);

    Utils.stopBubble(evt);
};

TableView.prototype.doHandle = function (evt, cmd) {
    try {
        var e = document.getElementById("lst" + this.id);
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

TableView.prototype.message = function (evt, cmd, msg) {
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

TableView.prototype.fCmd = function (evt, r, e) {
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

TableView.prototype.tCmd = function (evt, r, e) {
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

TableView.prototype.act = function (evt, cmd, o, e, val) {
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
        // if (o instanceof SingleSelect || o instanceof ListSelect) {
        //     if (val != null && val != "") {
        //         o.dsType = 1; // 0: direct data; 1: reference data; 2:
        //         // microservice
        //         o.refoptions = this.refoptions; // reference Id
        //         o.refcode = val; // reference parent code
        //         o.updateDom();
        //     }
        // }
    } else if (cmd == 9) { // verify

    }
};

TableView.prototype.doDragStart = function (evt) {
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

TableView.prototype.doDrag = function (evt) {
    Utils.stopBubble(evt);
};

TableView.prototype.doDragEnd = function (evt) {
    if (this.evn == 0) {
        if (map[this.currOwner] != null
            && map[this.currOwner].currObject instanceof Form) {
            evt.target.style.opacity = '1';
        }
    } else if (this.evn == 1) {
    }
    Utils.stopBubble(evt);
};

TableView.prototype.parseFromJSON = function (json, evn) {
    this.id = json.id;
    this.parent = json.parent; // parent Id
    this.currOwner = json.currOwner; // form Id

    this.title = json.title;
    this.help = json.help; // description
    this.required = json.required; // 0: not required; 1: required;
    this.tabIndex = json.tabIndex;
    this.disabled = json.disabled; // 0:false; 1:true
    this.hidden = json.hidden;
    this.dsType = json.dsType; // 0:direct data;1:reference data;2:microservice
    this.initValue = json.initValue; // default value

    this.width = json.width;
    this.height = json.height;
    this.readOnly = json.readOnly; // 0:false; 1:true
    this.rptId = json.rptId; // report Id
    this.ac = json.ac;
    this.evn = json.evn;
    this.hasOperations = json.hasOperations;
    this.hasViewButton = json.hasViewButton;
    this.hasModifyButton = json.hasModifyButton;
    this.hasDeleteButton = json.hasDeleteButton;
    // parsing propagation rules firstly.
    if (json.rules != undefined && json.rules != null && json.rules.length > 0) {
        for (var i = 0; i < json.rules.length; i++) {
            var r = new PropagateRule();
            r.parseFromJSON(json.rules[i]);
            this.rules.push(r);
        }
    }
};

TableView.prototype.parseExpressions = function (owner) {
    for (var i = 0; i < this.rules.length; i++) {
        this.rules[i].parseExpressions(owner);
    }
};

TableView.prototype.toTree = function () {
    return {
        id: this.id,
        text: this.title,
        icon: "glyphicon glyphicon-list-alt",
        data: "表格|" + (this.initValue == null ? "" : this.initValue),
    }
};

TableView.prototype.fetchRuleByNum = function (number) {
    if (this.rules.length > 0) {
        for (var i = 0; i < this.rules.length; i++) {
            if (i + 1 == number) {
                return this.rules[i];
            }
        }
    }
    return null;
};

TableView.prototype.toString = function () {
    return this.title == null ? "分页式表格" : this.title;
};

TableView.prototype.addRule = function (r) {
    this.rules.push(r);
};

TableView.prototype.insertRule = function (r, index) {
    this.rules.splice(index, 0, r);
};

TableView.prototype.removeRule = function (r) {
    for (var i = 0; i < this.rules.length; i++) {
        if (this.rules[i] == r) {
            this.rules.splice(i, 1);
            break;
        }
    }
};
