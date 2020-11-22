/**
 * 
 */
function LargeButton() {
	this.id = null;
	this.parent = null; // parent Id
	this.currOwner = null; // form Id
	// basic properties
	this.title = "卡片按钮";
	this.type = "button"; // type: submit|button|reset
	this.tabIndex = "-1";
	this.disabled = 0; // 0:false; 1:true
	this.fillWidth = 0; // 0: actual width; 1: 100% width
	this.hidden = 0; // 0: visible; 1: invisible
	this.classtypename = "LargeButton";
	this.evn = 0;
};

LargeButton.prototype = new UIComponent();

// for previewing
LargeButton.prototype.clone = function() {
	var t = new LargeButton();
	t.id = this.id;
	t.parent = this.parent; // parent Id
	t.currOwner = this.currOwner; // form Id
	t.title = this.title;
	t.type = this.type;
	t.tabIndex = this.tabIndex;
	t.disabled = this.disabled; // 0:false; 1:true
	t.fillWidth = this.fillWidth;
	t.hidden = this.hidden;
	t.evn = this.evn;
	t.toDomForHTML();
	return t;
};

// for previewing
LargeButton.prototype.toDomForHTML = function(parent) {
	this.dom = document.createElement("DIV");
	parent.appendChild(this.dom);
	this.dom.id = this.id;
	this.dom.className = "form-group";
	this.dom.tabIndex = "-1";
	this.updateDom();
	return this.dom;
};

LargeButton.prototype.toDom = function(parent) {
	this.toDomforFormGroup(parent);
	this.updateDom();
};

LargeButton.prototype.updateDom = function() {
	while (this.dom.hasChildNodes()) { // clear dom
		if (this.dom.lastChild.id != "rm" + this.id) {
			this.dom.removeChild(this.dom.lastChild);
		} else if (this.dom.children.length == 1) {
			break;
		}
	}
	var button = document.createElement("button");
	button.id = "btn" + this.id;
	button.addEventListener("click", this, false);
	button.className = "btn btn-default btn-large";
	if (this.fillWidth == 1)
		button.classList.add("btn-block");
	if (this.disabled == 1)
		button.disabled = true;
	button.appendChild(document.createTextNode(this.title));
	button.tabIndex = this.tabIndex;
	if (this.hidden == 0)
		this.dom.style.display = "";
	else
		this.dom.style.display = "none";
	this.dom.appendChild(button);
};

LargeButton.prototype.toDomforFormGroup = function(parent) {
	this.dom = document.createElement("DIV");
	parent.appendChild(this.dom);
	this.dom.id = this.id;
	this.dom.className = "form-group comp_outline";
	this.dom.tabIndex = "-1";
	this.dom.draggable = "true";
	this.dom.style.minHeight = "100%";
	this.dom.style.height = "100%";
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

LargeButton.prototype.handleEvent = function(e) {
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

LargeButton.prototype.doClick = function(evt) {
	if (evt.target.id == "btn" + this.id) {
		Utils.stopDefault();
	}
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

LargeButton.prototype.doFocus = function(evt) {
	bgcache = evt.target.style.backgroundColor;
	evt.target.style.backgroundColor = Utils.highLight();
	Utils.stopBubble(evt);
};

LargeButton.prototype.doBlur = function(evt) {
	evt.target.style.backgroundColor = bgcache;
	bgcache = null;
	Utils.stopBubble(evt);
};

LargeButton.prototype.doDragStart = function(evt) {
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

LargeButton.prototype.doDrag = function(evt) {
	Utils.stopBubble(evt);
};

LargeButton.prototype.doDragEnd = function(evt) {
	if (this.evn == 0) {
		if (map[this.currOwner] != null
			&& map[this.currOwner].currObject instanceof Form) {
			evt.target.style.opacity = '1';
		}
	} else if (this.evn == 1) {
	}
	Utils.stopBubble(evt);
};

LargeButton.prototype.parseFromJSON = function(json, evn) {
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
};

LargeButton.prototype.toTree = function() {
	return {
		id : this.id,
		text : this.title,
		icon : "glyphicon glyphicon-unchecked",
		data : "卡片按钮|",
	}
};
