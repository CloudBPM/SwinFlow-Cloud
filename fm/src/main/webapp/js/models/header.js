/**
 * 
 */
function Header() {
	this.id = null;
	this.parent = null; // parent Id
	this.currOwner = null; // form Id
	// basic properties
	this.content = "我的标题";
	this.type = 1; // 1:H1;2:H2;3:H3;4:H4;5:H5;6:H6
	this.tabIndex = "-1";
	this.color = "black";
	this.fontFamily = null;
	this.fontStyle = 0; // 0:normal;1:italic
	// xx-small,x-small,small,medium,large,x-large,xx-large
	// this.fontSize = "medium";
	// normal;bold;bolder;lighter
	// this.fontWeight = "normal";
	this.textAlign = 0; // 0:left;1:center;2:right
	this.hidden = 0; // 0: visible; 1: invisible

	this.classtypename = "Header";
	
	this.varId = null;
	this.ac = null;
	this.evn = 0;
};

Header.prototype = new UIComponent();

// for previewing
Header.prototype.clone = function() {
	var t = new Header();
	t.id = this.id;
	t.parent = this.parent; // parent Id
	t.currOwner = this.currOwner; // form Id
	t.content = this.content;
	t.type = this.type;
	t.tabIndex = this.tabIndex;
	t.color = this.color;
	t.fontFamily = this.fontFamily;
	t.textAlign = this.textAlign; // 0:left; 1:center; 2:right
	t.hidden = this.hidden;
	t.varId = this.varId;
	t.ac = this.ac;
	t.evn = this.evn;
	t.toDomForHTML();
	return t;
};

// for previewing
Header.prototype.toDomForHTML = function(parent) {
	this.dom = document.createElement("DIV");
	parent.appendChild(this.dom);
	this.dom.id = this.id;
	this.dom.className = "form-group";
	this.dom.tabIndex = "-1";
	this.updateDom();
	return this.dom;
};

Header.prototype.toDom = function(parent) {
	this.toDomforFormGroup(parent);
	this.updateDom();
};

Header.prototype.updateDom = function() {
	while (this.dom.hasChildNodes()) { // clear dom
		if (this.dom.lastChild.id != "rm" + this.id) {
			this.dom.removeChild(this.dom.lastChild);
		} else if (this.dom.children.length == 1) {
			break;
		}
	}
	var header = null;
	switch (parseInt(this.type)) {
	case 1:
		header = document.createElement("H1");
		break;
	case 2:
		header = document.createElement("H2");
		break;
	case 3:
		header = document.createElement("H3");
		break;
	case 4:
		header = document.createElement("H4");
		break;
	case 5:
		header = document.createElement("H5");
		break;
	case 6:
		header = document.createElement("H6");
		break;
	}
	header.style.color = this.color;
	if (this.fontFamily != null) {
		header.style.fontFamily = this.fontFamily;
	}
	if (this.fontStyle == 0) {
		header.style.fontStyle = "normal";
	} else if (this.fontStyle == 1) {
		header.style.fontStyle = "italic";
	} else if (this.fontStyle == 2) {
		header.style.fontStyle = "oblique";
	}
	if (this.textAlign == 0) {
		header.style.textAlign = "left";
	} else if (this.textAlign == 1) {
		header.style.textAlign = "center";
	} else if (this.textAlign == 2) {
		header.style.textAlign = "right";
	}
	header.innerHTML = this.content;
	// header.textContent = this.content;
	if (this.hidden == 0)
		this.dom.style.display = "";
	else
		this.dom.style.display = "none";
	this.dom.appendChild(header);
};

Header.prototype.toDomforFormGroup = function(parent) {
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

Header.prototype.handleEvent = function(e) {
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

Header.prototype.doClick = function(evt) {
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

Header.prototype.doFocus = function(evt) {
	bgcache = evt.target.style.backgroundColor;
	evt.target.style.backgroundColor = Utils.highLight();
	Utils.stopBubble(evt);
};

Header.prototype.doBlur = function(evt) {
	evt.target.style.backgroundColor = bgcache;
	bgcache = null;
	Utils.stopBubble(evt);
};

Header.prototype.doDragStart = function(evt) {
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

Header.prototype.doDrag = function(evt) {
	Utils.stopBubble(evt);
};

Header.prototype.doDragEnd = function(evt) {
	if (this.evn == 0) {
		if (map[this.currOwner] != null
			&& map[this.currOwner].currObject instanceof Form) {
			evt.target.style.opacity = '1';
		}
	} else if (this.evn == 1) {
	}
	Utils.stopBubble(evt);
};

Header.prototype.parseFromJSON = function(json, evn) {
	this.id = json.id;
	this.parent = json.parent; // parent Id
	this.currOwner = json.currOwner; // form Id
	this.content = json.content;
	this.type = json.type;
	this.tabIndex = json.tabIndex;
	this.color = json.color;
	this.fontFamily = json.fontFamily;
	this.textAlign = json.textAlign; // 0:left; 1:center; 2:right
	this.hidden = json.hidden;
	this.varId = json.varId;
	this.ac = json.ac;
	this.evn = evn;
};

Header.prototype.toTree = function() {
	return {
		id : this.id,
		text : this.title,
		icon : "glyphicon glyphicon-header",
		data : "标题|" + this.content,
	}
};
