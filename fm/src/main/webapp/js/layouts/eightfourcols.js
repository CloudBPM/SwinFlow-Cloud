/**
 * 
 */
function EightFourColumns(currOwner) {
	this.currOwner = currOwner;// form Id
};

EightFourColumns.prototype.toItem = function() {
	var item = document.createElement("li");
	item.className = "list-group-item";
	var icon = document.createElement("img");
	item.appendChild(icon);
	icon.id = "eightfourcols" + this.id;
	icon.setAttribute("src", "img/col84_32x32.png");
	icon.setAttribute("title", "八四开布局");
	icon.addEventListener("dragstart", this, false);
	icon.addEventListener("drag", this, false);
	icon.addEventListener("dragend", this, false);
	return item;
};

EightFourColumns.prototype.handleEvent = function(e) {
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
	}
};

EightFourColumns.prototype.doDragStart = function(evt) {
	evt.dataTransfer.effectAllowed = 'copy';
	this.newRow(new Row(), this.currOwner);
};

EightFourColumns.prototype.newRow = function(obj, currOwner) {
	obj.parent = null; // parent Id
	obj.currOwner = currOwner; // form Id
	this.new8Column(new Column(), obj);
	this.new4Column(new Column(), obj);
	map[currOwner].selected = obj;
	copyclip = obj;
};

EightFourColumns.prototype.new8Column = function(obj, parent) {
	obj.className = "col-lg-8 col-md-8 col-sm-12 col-xs-12";
	parent.addChild(obj);
};

EightFourColumns.prototype.new4Column = function(obj, parent) {
	obj.className = "col-lg-4 col-md-4 col-sm-12 col-xs-12";
	parent.addChild(obj);
};

EightFourColumns.prototype.doDrag = function(evt) {
	evt.preventDefault();
};

EightFourColumns.prototype.doDragEnd = function(evt) {
	evt.preventDefault();
};