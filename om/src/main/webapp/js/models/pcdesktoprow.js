/**
 * 
 */
function PCDesktopRow(cateId) {
	this.id = null;
	this.title = "行";
	this.parent = null; // parent Id
	this.currOwner = null; // form Id
	this.children = []; // children.
	this.classtypename = "PCDesktopRow";
	this.cateId = cateId;
	this.evn = 0; // environment: 0: design time; 1; runtime
};

PCDesktopRow.prototype = new UIComponent();

// for previewing
PCDesktopRow.prototype.clone = function() {
	var r = new PCDesktopRow(this.cateId);
	// r.id = this.id;
	// r.title = this.title;
	// r.parent = this.parent; // parent Id
	// r.currOwner = this.currOwner; // form Id
	// r.evn = this.evn; // environment: 0: design time; 1; runtime
	// r.toDomForHTML();
	// for (var i = 0; i < this.children.length; i++) {
	// 	var c = this.children[i].clone();
	// 	r.children.push(c);
	// 	r.dom.appendChild(c.dom);
	// }
	return r;
};

PCDesktopRow.prototype.cloneRules = function(clone, old) {
	for (var i = 0; i < this.children.length; i++) {
		this.children[i].cloneRules(clone, old);
	}
};

PCDesktopRow.prototype.addChild = function(child) {
	child.parent = this.id;
	child.currOwner = this.currOwner;
	this.children.push(child);
	//this.dom.appendChild(child.dom);
};

// 递归，先根遍历
PCDesktopRow.prototype.seekObjectByID = function(id) {
	var target = null;
	if (this.id == id) {
		target = this;
	} else if (this.children.length > 0) {
		for (var i = 0; i < this.children.length; i++) {
			target = this.children[i].seekObjectByID(id);
			if (target != null) {
				break;
			}
		}
	}
	return target;
};

PCDesktopRow.prototype.seekObjects = function() {
	var list = [];
	if (this.children.length > 0) {
		for (var i = 0; i < this.children.length; i++) {
			list = list.concat(this.children[i].seekObjects());
		}
	}
	return list;
};

PCDesktopRow.prototype.parseFromJSON = function(json, evn) {
	this.id = json.id;
	this.title = json.title;
	this.parent = json.parent; // parent Id
	this.currOwner = json.currOwner; // form Id
	this.cateId = json.cateId;
	this.evn = evn;
	//this.toDom();
	this.parseChildrenFromJSON(json.children, evn);
};

PCDesktopRow.prototype.parseChildrenFromJSON = function(content, evn) {
	if (content != undefined && content != null && content.length > 0) {
		for (var i = 0; i < content.length; i++) {
			var r = new PCDesktopColumn();
			r.parseFromJSON(content[i], evn);
			this.addChild(r);
		}
	}
};

PCDesktopRow.prototype.parseRules = function(owner) {
	// parsing some rules for row object
	// to do ...
	// parsing some children rules
	this.parseChildrenRules(owner);
};

PCDesktopRow.prototype.parseChildrenRules = function(owner) {
	if (this.children.length > 0) {
		for (var i = 0; i < this.children.length; i++) {
			this.children[i].parseRules(owner);
		}
	}
};

PCDesktopRow.prototype.toDomForHTML = function(parent) {
	this.dom = document.createElement("DIV");
	parent.appendChild(this.dom);
	this.dom.id = this.id;
	this.dom.className = "row";
	for (var i = 0; i < this.children.length; i++) {
		this.children[i].toDomForHTML(this.dom);
	}
	return this.dom;
};

PCDesktopRow.prototype.toDom = function(parent) {
	this.dom = document.createElement("DIV");
	parent.appendChild(this.dom);
	this.dom.className = "row rowedit rowtitle";
	this.dom.draggable = "true";
	this.dom.id = this.id;
	this.dom.tabIndex = "-1";
	// dragged component
	this.dom.addEventListener("dragstart", this, false);
	this.dom.addEventListener("drag", this, false);
	this.dom.addEventListener("dragend", this, false);
	// target component for dragging
	this.dom.addEventListener('dragenter', this, false);
	this.dom.addEventListener('dragover', this, false);
	this.dom.addEventListener('dragleave', this, false);
	this.dom.addEventListener('drop', this, false);
	this.dom.addEventListener("click", this, false);
	this.dom.addEventListener("focus", this, false);
	this.dom.addEventListener("blur", this, false);

	var remove = document.createElement("A");
	remove.className = "remove";
	this.dom.appendChild(remove);
	var removeSpan = document.createElement("i");
	remove.appendChild(removeSpan);
	removeSpan.className = "glyphicon glyphicon-remove";
	removeSpan.addEventListener("click", this, false);

	// form children to DOM
	if (this.children.length > 0) {
		for (var i = 0; i < this.children.length; i++) {
			this.children[i].toDom(this.dom);
		}
	}

	return this.dom;
};

PCDesktopRow.prototype.updateDom = function() {
	if (this.dom == undefined || this.dom == null) {
		this.toDom();
	}
	if (this.children.length > 0) {
		for (var i = 0; i < this.children.length; i++) {
			this.children[i].updateDom();
		}
	}
};

PCDesktopRow.prototype.handleEvent = function(e) {
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
	case "dragenter": // Events fired on the drop target
		this.doDragEnter(e);
		break;
	case "dragover": // Events fired on the drop target
		this.doDragOver(e);
		break;
	case "dragleave": // Events fired on the drop target
		this.doDragLeave(e);
		break;
	case "drop":// Events fired on the drop target
		this.doDrop(e);
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

PCDesktopRow.prototype.doClick = function(evt) {
	if (evt.target.className == "glyphicon glyphicon-remove") {
		if (map[this.cateId].pcDesktopEditor != null &&
			map[this.cateId].pcDesktopEditor.currObject instanceof PCDesktopUI) {
			map[this.cateId].stack.execute(new FMDesktopUIRemoveRowCmd(
					evt.target.parentNode.parentNode.id,
					map[this.cateId].pcDesktopEditor.currObject));
		}
	} else {
		evt.target.focus();
		map[this.cateId].pcDesktopEditor.selected = this;
		// copyclip = this;
		//map[this.currOwner].pcDesktopEditor.enableEditButtons();
		map[this.cateId].setPropertySheet();
	}
	Utils.stopBubble(evt);
};

PCDesktopRow.prototype.doFocus = function(evt) {
	bgcache = evt.target.style.backgroundColor;
	evt.target.style.backgroundColor = Utils.highLight();
};

PCDesktopRow.prototype.doBlur = function(evt) {
	evt.target.style.backgroundColor = bgcache;
	bgcache = null;
};

PCDesktopRow.prototype.doDragStart = function(evt) {
	if (map[this.cateId].pcDesktopEditor != null &&
		map[this.cateId].pcDesktopEditor.currObject instanceof PCDesktopUI) {
		// this / e.target is the source node.
		evt.target.style.opacity = '0.7';
		evt.dataTransfer.effectAllowed = 'move';
		copyclip = evt.target.id; // critical
		Utils.stopBubble(evt);
	}
};

PCDesktopRow.prototype.doDrag = function(evt) {
	if (map[this.cateId].pcDesktopEditor != null &&
		map[this.cateId].pcDesktopEditor.currObject instanceof PCDesktopUI) {
		Utils.stopBubble(evt);
	}
};

PCDesktopRow.prototype.doDragEnd = function(evt) {
	if (map[this.cateId].pcDesktopEditor != null &&
		map[this.cateId].pcDesktopEditor.currObject instanceof PCDesktopUI) {
		evt.target.style.opacity = '1';
		Utils.stopBubble(evt);
	}
};

PCDesktopRow.prototype.doDragEnter = function(evt) {
	Utils.stopDefault(evt);
	Utils.stopBubble(evt);
};

PCDesktopRow.prototype.doDragOver = function(evt) {
	Utils.stopDefault(evt);
	evt.dataTransfer.dropEffect = 'move'
	Utils.stopBubble(evt);
	return false;
};

PCDesktopRow.prototype.doDragLeave = function(evt) {
	Utils.stopDefault(evt);
	Utils.stopBubble(evt);
};

PCDesktopRow.prototype.doDrop = function(evt) {
	Utils.stopDefault(evt);
	Utils.stopBubble(evt);
};

PCDesktopRow.prototype.toTree = function() {
	return {
		id : this.id,
		text : this.title,
		icon : "glyphicon glyphicon-th-list",
		data : "行|",
		children : this.toTreeChildren(),
	}
};

PCDesktopRow.prototype.toTreeChildren = function() {
	var children = [];
	for (var i = 0; i < this.children.length; i++) {
		children.push(this.children[i].toTree());
	}
	return children;
};

PCDesktopRow.prototype.fetchBoundComponents = function() {
	var coms = [];
	for (var i = 0; i < this.children.length; i++) {
		coms = coms.concat(this.children[i].fetchBoundComponents());
	}
	return coms;
};