/**
 * 
 */
function Image() {
	this.id = null;
	this.parent = null; // parent Id
	this.currOwner = null; // form Id
	// basic properties
	this.title = "我的图片";
	this.alt = "我的图片";
	this.tabIndex = "-1";
	this.src = "img/cloud_140x140.png";
	this.shapeType = 0; // 0:rounded;1:circle;2:thumbnail
	this.href = null;
	this.width = "140";
	this.height = "140";
	this.hidden = 0; // 0: visible; 1: invisible
	this.classtypename = "Image";
	
	this.varId = null;
	this.ac = null;
	this.evn = 0;
};

Image.prototype = new UIComponent();

// for previewing
Image.prototype.clone = function() {
	var t = new Image();
	t.id = this.id;
	t.parent = this.parent; // parent Id
	t.currOwner = this.currOwner; // form Id
	t.title = this.title;
	t.alt = this.alt;
	t.tabIndex = this.tabIndex;
	t.src = this.src;
	t.shapeType = this.shapeType;
	t.href = this.href;
	t.width = this.width;
	t.height = this.height;
	t.hidden = this.hidden;
	t.varId = this.varId;
	t.ac = this.ac;
	t.evn = this.evn;
	t.toDomForHTML();
	return t;
};

// for previewing
Image.prototype.toDomForHTML = function(parent) {
	this.dom = document.createElement("DIV");
	parent.appendChild(this.dom);
	this.dom.id = this.id;
	this.dom.className = "form-group";
	this.dom.tabIndex = "-1";
	this.updateDom();
	return this.dom;
};

Image.prototype.toDom = function(parent) {
	this.toDomforFormGroup(parent);
	this.updateDom();
};

Image.prototype.updateDom = function() {
	while (this.dom.hasChildNodes()) { // clear dom
		if (this.dom.lastChild.id != "rm" + this.id) {
			this.dom.removeChild(this.dom.lastChild);
		} else if (this.dom.children.length == 1) {
			break;
		}
	}
	var image = document.createElement("img");
	this.dom.appendChild(image);
	image.id = "img" + this.id;
	image.tabIndex = this.tabIndex;
	image.title = this.title;
	image.src = this.src;
	image.style.width = this.width;
	image.style.height = this.height;
	image.classList.add("img-responsive");
	if (this.shapeType == 0) {
		image.classList.add("img-rounded");
	} else if (this.shapeType == 1) {
		image.classList.add("img-circle");
	} else if (this.shapeType == 2) {
		image.classList.add("img-thumbnail");
	}
	if (this.hidden == 0)
		this.dom.style.display = "";
	else
		this.dom.style.display = "none";
};

Image.prototype.toDomforFormGroup = function(parent) {
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

Image.prototype.handleEvent = function(e) {
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

Image.prototype.doClick = function(evt) {
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

Image.prototype.doFocus = function(evt) {
	bgcache = evt.target.style.backgroundColor;
	evt.target.style.backgroundColor = Utils.highLight();
	Utils.stopBubble(evt);
};

Image.prototype.doBlur = function(evt) {
	evt.target.style.backgroundColor = bgcache;
	bgcache = null;
	Utils.stopBubble(evt);
};

Image.prototype.doDragStart = function(evt) {
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

Image.prototype.doDrag = function(evt) {
	Utils.stopBubble(evt);
};

Image.prototype.doDragEnd = function(evt) {
	if (this.evn == 0) {
		if (map[this.currOwner] != null
			&& map[this.currOwner].currObject instanceof Form) {
			evt.target.style.opacity = '1';
		}
	} else if (this.evn == 1) {
	}
	Utils.stopBubble(evt);
};

Image.prototype.parseFromJSON = function(json, evn) {
	this.id = json.id;
	this.parent = json.parent; // parent Id
	this.currOwner = json.currOwner; // form Id
	this.title = json.title;
	this.alt = json.alt;
	this.tabIndex = json.tabIndex;
	this.src = json.src;
	this.shapeType = json.shapeType;
	this.href = json.href;
	this.width = json.width;
	this.height = json.height;
	this.hidden = json.hidden;
	this.varId = json.varId;
	this.ac = json.ac;
	this.evn = evn;
};

Image.prototype.toTree = function() {
	return {
		id : this.id,
		text : this.title,
		icon : "glyphicon glyphicon-picture",
		data : "图片|" + this.src,
	}
};
