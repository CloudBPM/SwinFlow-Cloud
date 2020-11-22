/**
 * 
 */
function SixColumns(currOwner) {
	this.currOwner = currOwner;// form Id
};

SixColumns.prototype.toItem = function() {
	var item = document.createElement("li");
	item.className = "list-group-item";
	var icon = document.createElement("img");
	item.appendChild(icon);
	icon.id = "sixcols" + this.id;
	icon.setAttribute("src", "img/col2_32x32.png");
	icon.setAttribute("title", "六列布局");
	icon.addEventListener("dragstart", this, false);
	icon.addEventListener("drag", this, false);
	icon.addEventListener("dragend", this, false);
	return item;
};

SixColumns.prototype.handleEvent = function(e) {
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

SixColumns.prototype.doDragStart = function(evt) {
	evt.dataTransfer.effectAllowed = 'copy';
	this.newRow(new Row(), this.currOwner);
};

SixColumns.prototype.newRow = function(obj, currOwner) {
	obj.parent = null; // parent Id
	obj.currOwner = currOwner; // form Id
	for (var i = 0; i < 6; i++) {
		this.newColumn(new Column(), obj);
	}
	map[currOwner].selected = obj;
	copyclip = obj;
};

SixColumns.prototype.newColumn = function(obj, parent) {
	obj.className = "col-lg-2 col-md-2 col-sm-12 col-xs-12";
	parent.addChild(obj);
};

SixColumns.prototype.doDrag = function(evt) {
	evt.preventDefault();
};

SixColumns.prototype.doDragEnd = function(evt) {
	evt.preventDefault();
};