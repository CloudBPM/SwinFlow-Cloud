/**
 * 
 */
function TwoColumns(currOwner) {
	this.currOwner = currOwner;// form Id
};

TwoColumns.prototype.toItem = function() {
	var item = document.createElement("li");
	item.className = "list-group-item";
	var icon = document.createElement("img");
	item.appendChild(icon);
	icon.id = "twocols" + this.id;
	icon.setAttribute("src", "img/col6_32x32.png");
	icon.setAttribute("title", "双列布局");
	icon.addEventListener("dragstart", this, false);
	icon.addEventListener("drag", this, false);
	icon.addEventListener("dragend", this, false);
	return item;
};

TwoColumns.prototype.handleEvent = function(e) {
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

TwoColumns.prototype.doDragStart = function(evt) {
	evt.dataTransfer.effectAllowed = 'copy';
	this.newRow(new Row(), this.currOwner);
};

TwoColumns.prototype.newRow = function(obj, currOwner) {
	obj.parent = null; // parent Id
	obj.currOwner = currOwner; // form Id
	this.newColumn(new Column(), obj);
	this.newColumn(new Column(), obj);
	map[currOwner].selected = obj;
	copyclip = obj;
};

TwoColumns.prototype.newColumn = function(obj, parent) {
	obj.className = "col-lg-6 col-md-6 col-sm-12 col-xs-12";
	parent.addChild(obj);
};

TwoColumns.prototype.doDrag = function(evt) {
	evt.preventDefault();
};

TwoColumns.prototype.doDragEnd = function(evt) {
	evt.preventDefault();
};