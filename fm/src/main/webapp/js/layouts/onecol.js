/**
 * This class will create a new single column layout.
 */
function OneColumn(currOwner) {
	this.currOwner = currOwner;// form Id
};

OneColumn.prototype.toItem = function() {
	var item = document.createElement("li");
	item.className = "list-group-item";
	var icon = document.createElement("img");
	item.appendChild(icon);
	icon.setAttribute("src", "img/col12_32x32.png");
	icon.setAttribute("title", "单列布局");
	icon.addEventListener("dragstart", this, false);
	icon.addEventListener("drag", this, false);
	icon.addEventListener("dragend", this, false);
	return item;
};

OneColumn.prototype.handleEvent = function(e) {
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

OneColumn.prototype.doDragStart = function(evt) {
	evt.dataTransfer.effectAllowed = 'copy';
	this.newRow(new Row(), this.currOwner);
};

OneColumn.prototype.newRow = function(obj, currOwner) {
	obj.parent = null; // parent Id
	obj.currOwner = currOwner; // form Id
	this.newColumn(new Column(), obj);
	map[currOwner].selected = obj;
	copyclip = obj;
};

OneColumn.prototype.newColumn = function(obj, parent) {
    obj.className = "col-lg-12 col-md-12 col-sm-12 col-xs-12";
	parent.addChild(obj);
};

OneColumn.prototype.doDrag = function(evt) {
	evt.preventDefault();
};

OneColumn.prototype.doDragEnd = function(evt) {
	evt.preventDefault();
};