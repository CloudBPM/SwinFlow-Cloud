/**
 * 
 */
function Paragraph() {
	this.id = null;
	this.parent = null; // parent Id
	this.currOwner = null; // form Id
	// basic properties
	this.content = "我的正文段落";
	this.color = "black";
	this.fontFamily = null;
	this.fontStyle = 0; // 0:normal;1:italic
	// 0:xx-small;1:x-small;2:small;3:medium;4:large;5:x-large;6:xx-large;
	this.fontSize = 3;
	this.fontWeight = 0; // 0:normal;1:bold;2:bolder;3:lighter
	this.textAlign = 0; // 0:left;1:center;2:right
	this.lead = 0; // 0:normal;1:lead
	this.hidden = 0; // 0: visible; 1: invisible
	this.classtypename = "Paragraph";
	
	this.varId = null;
	this.ac = null;
	this.evn = 0;
};

Paragraph.prototype = new UIComponent();

// for previewing
Paragraph.prototype.clone = function() {
	var t = new Paragraph();
	t.id = this.id;
	t.parent = this.parent; // parent Id
	t.currOwner = this.currOwner; // form Id
	t.content = this.content;
	t.color = this.color;
	t.fontFamily = this.fontFamily;
	t.fontStyle = this.fontStyle;
	t.fontSize = this.fontSize;
	t.fontWeight = this.fontWeight;
	t.textAlign = this.textAlign; // 0:left; 1:center; 2:right
	t.lead = this.lead;
	t.hidden = this.hidden;
	t.varId = this.varId;
	t.ac = this.ac;
	t.evn = this.evn;
	t.toDomForHTML();
	return t;
};

// for previewing
Paragraph.prototype.toDomForHTML = function(parent) {
	this.dom = document.createElement("DIV");
	parent.appendChild(this.dom);
	this.dom.id = this.id;
	this.dom.className = "form-group";
	this.dom.tabIndex = "-1";
	this.updateDom();
	return this.dom;
};

Paragraph.prototype.toDom = function(parent) {
	this.toDomforFormGroup(parent);
	this.updateDom();
};

Paragraph.prototype.updateDom = function() {
	while (this.dom.hasChildNodes()) { // clear dom
		if (this.dom.lastChild.id != "rm" + this.id) {
			this.dom.removeChild(this.dom.lastChild);
		} else if (this.dom.children.length == 1) {
			break;
		}
	}
	var p = document.createElement("P");
	p.style.color = this.color;
	if (this.fontFamily != null) {
		p.style.fontFamily = this.fontFamily;
	}
	// 0:xx-small;1:x-small;2:small;3:medium;4:large;5:x-large;6:xx-large;
	if (this.fontSize == 0) {
		p.style.fontSize = "xx-small";
	} else if (this.fontSize == 1) {
		p.style.fontSize = "x-small";
	} else if (this.fontSize == 2) {
		p.style.fontSize = "small";
	} else if (this.fontSize == 3) {
		p.style.fontSize = "medium";
	} else if (this.fontSize == 4) {
		p.style.fontSize = "large";
	} else if (this.fontSize == 5) {
		p.style.fontSize = "x-large";
	} else if (this.fontSize == 6) {
		p.style.fontSize = "xx-large";
	}
	if (this.fontStyle == 0) {
		p.style.fontStyle = "normal";
	} else if (this.fontStyle == 1) {
		p.style.fontStyle = "italic";
	} else if (this.fontStyle == 2) {
		p.style.fontStyle = "oblique";
	}
	if (this.textAlign == 0) {
		p.classList.add("text-left");
	} else if (this.textAlign == 1) {
		p.classList.add("text-center");
	} else if (this.textAlign == 2) {
		p.classList.add("text-right");
	}
	if (this.lead == 1) {
		p.classList.add("lead");
	}
	if (this.fontWeight == 0) {
		p.style.fontWeight = "normal";
	} else if (this.fontWeight == 1) {
		p.style.fontWeight = "bold";
	} else if (this.fontWeight == 2) {
		p.style.fontWeight = "bolder";
	} else if (this.fontWeight == 3) {
		p.style.fontWeight = "lighter";
	}
	p.innerHTML = this.content;
	// p.textContent = this.content;
	if (this.hidden == 0)
		this.dom.style.display = "";
	else
		this.dom.style.display = "none";
	this.dom.appendChild(p);
};

Paragraph.prototype.toDomforFormGroup = function(parent) {
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

Paragraph.prototype.handleEvent = function(e) {
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

Paragraph.prototype.doClick = function(evt) {
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

Paragraph.prototype.doFocus = function(evt) {
	bgcache = evt.target.style.backgroundColor;
	evt.target.style.backgroundColor = Utils.highLight();
	Utils.stopBubble(evt);
};

Paragraph.prototype.doBlur = function(evt) {
	evt.target.style.backgroundColor = bgcache;
	bgcache = null;
	Utils.stopBubble(evt);
};

Paragraph.prototype.doDragStart = function(evt) {
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

Paragraph.prototype.doDrag = function(evt) {
	Utils.stopBubble(evt);
};

Paragraph.prototype.doDragEnd = function(evt) {
	if (this.evn == 0) {
		if (map[this.currOwner] != null
			&& map[this.currOwner].currObject instanceof Form) {
			evt.target.style.opacity = '1';
		}
	} else if (this.evn == 1) {
	}
	Utils.stopBubble(evt);
};

Paragraph.prototype.parseFromJSON = function(json, evn) {
	this.id = json.id;
	this.parent = json.parent; // parent Id
	this.currOwner = json.currOwner; // form Id
	this.content = json.content;
	this.color = json.color;
	this.fontFamily = json.fontFamily;
	this.fontStyle = json.fontStyle;
	this.fontSize = json.fontSize;
	this.fontWeight = json.fontWeight;
	this.textAlign = json.textAlign; // 0:left; 1:center; 2:right
	this.lead = json.lead;
	this.hidden = json.hidden;
	this.varId = json.varId;
	this.evn = evn;
};

Paragraph.prototype.toTree = function() {
	return {
		id : this.id,
		text : this.title,
		icon : "fa fa-paragraph",
		data : "正文段落|" + this.content,
	}
};
