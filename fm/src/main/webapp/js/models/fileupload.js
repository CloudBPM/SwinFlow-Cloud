/**
 *
 */
function FileUpload() {
    this.id = null;
    this.parent = null; // parent Id
    this.currOwner = null; // form Id
    // basic properties
    this.title = "文件上传";
    this.help = "我的帮助及提示"; // description
    this.required = 1; // 0: not required; 1: required;
    this.tabIndex = "-1";
    this.readOnly = 0; // 0:false; 1:true
    this.disabled = 0; // 0:false; 1:true
    this.hidden = 0; // 0: visible; 1: invisible
    this.prependType = "No"; // No; Text; Icon prepend;
    this.prepend = null;
    this.appendType = "No"; // No; Text; Icon prepend;
    this.append = null;
    this.classtypename = "FileUpload";

    this.varId = null;
    this.ac = null;
    this.evn = 0;
};

FileUpload.prototype = new UIComponent();

// for previewing
FileUpload.prototype.clone = function () {
    var t = new FileUpload();
    t.id = this.id;
    t.parent = this.parent; // parent Id
    t.currOwner = this.currOwner; // form Id
    t.title = this.title;
    t.help = this.help; // description
    t.required = this.required;
    t.tabIndex = this.tabIndex;
    t.prependType = this.prependType; // No; Text; Icon prepend;
    t.prepend = this.prepend;
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
FileUpload.prototype.toDomForHTML = function(parent) {
    this.dom = document.createElement("DIV");
    parent.appendChild(this.dom);
    this.dom.id = this.id;
    this.dom.className = "form-group";
    this.dom.tabIndex = "-1";
    this.updateDom();
    return this.dom;
};

FileUpload.prototype.toDom = function (parent) {
    this.toDomforFormGroup(parent);
    this.updateDom();
};

FileUpload.prototype.updateDom = function () {
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
    var input = document.createElement("INPUT");
    input.name = "fileselect" + this.id;
    input.className = "form-control";
    input.addEventListener("click", this, false);
    input.type = "file";
    if (this.required == 0) { //
        var requiredSpan = document.createElement("SPAN");
        requiredSpan.style.color = "red";
        requiredSpan.innerHTML = " *";
        titlelabel.appendChild(requiredSpan);
        input.setAttribute("required", "");
    } else if (this.required == 1) { //
        input.removeAttribute("required");
    }
    input.tabIndex = this.tabIndex;
    if (this.readOnly == 1)
        input.readOnly = true;
    if (this.disabled == 1)
        input.disabled = true;
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
            roupPreAddOn.appendChild(preIcon);
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
            var textPrepend = document.createTextNode("");
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
        this.dom.appendChild(helpNode);
    }
    if (this.hidden == 0)
        this.dom.style.display = "";
    else
        this.dom.style.display = "none";
};

FileUpload.prototype.toDomforFormGroup = function (parent) {
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

FileUpload.prototype.handleEvent = function (e) {
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

FileUpload.prototype.doClick = function (evt) {
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
    } else {
        var obj = document.getElementById("fileselect" + this.id);
        window.android.openFileManage();
        //var files = obj.values;
    }
};

FileUpload.prototype.doFocus = function (evt) {
    bgcache = evt.target.style.backgroundColor;
    evt.target.style.backgroundColor = Utils.highLight();
    Utils.stopBubble(evt);
};

FileUpload.prototype.doBlur = function (evt) {
    evt.target.style.backgroundColor = bgcache;
    bgcache = null;
    Utils.stopBubble(evt);
};

FileUpload.prototype.doDragStart = function (evt) {
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

FileUpload.prototype.doDrag = function (evt) {
    Utils.stopBubble(evt);
};

FileUpload.prototype.doDragEnd = function (evt) {
    if (this.evn == 0) {
        if (map[this.currOwner] != null
            && map[this.currOwner].currObject instanceof Form) {
            evt.target.style.opacity = '1';
        }
    } else if (this.evn == 1) {
    }
    Utils.stopBubble(evt);
};

FileUpload.prototype.parseFromJSON = function (json, evn) {
    this.id = json.id;
    this.parent = json.parent; // parent Id
    this.currOwner = json.currOwner; // form Id
    this.title = json.title;
    this.help = json.help; // description
    this.required = json.required; // 0: not required; 1: required;
    this.tabIndex = json.tabIndex;
    this.hidden = json.hidden;
    this.prependType = json.prependType; // No; Text; Icon prepend;
    this.prepend = json.prepend;
    this.appendType = json.appendType; // No; Text; Icon prepend;
    this.append = json.append;
    this.varId = json.varId;
    this.ac = json.ac;
    this.evn = evn;
};

FileUpload.prototype.toTree = function () {
    return {
        id: this.id,
        text: this.title,
        icon: "glyphicon glyphicon-cloud-upload",
        data: "文件上传|",
    }
};
