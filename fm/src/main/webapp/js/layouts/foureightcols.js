/**
 * 
 */
function FourEightColumns(currOwner) {
	this.currOwner = currOwner;// form Id
};

FourEightColumns.prototype.toItem = function() {
	var item = document.createElement("li");
	item.className = "list-group-item";
	var icon = document.createElement("img");
	item.appendChild(icon);
	icon.id = "foureightcols" + this.id;
	icon.setAttribute("src", "img/col48_32x32.png");
	icon.setAttribute("title", "四八开布局");
	icon.addEventListener("dragstart", this, false);
	icon.addEventListener("drag", this, false);
	icon.addEventListener("dragend", this, false);
	return item;
};

FourEightColumns.prototype.handleEvent = function(e) {
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

FourEightColumns.prototype.doDragStart = function(evt) {
	evt.dataTransfer.effectAllowed = 'copy';
	this.newRow(new Row(), this.currOwner);
};

FourEightColumns.prototype.newRow = function(obj, currOwner) {
	obj.parent = null; // parent Id
	obj.currOwner = currOwner; // form Id
	this.new4Column(new Column(), obj);
	this.new8Column(new Column(), obj);
	map[currOwner].selected = obj;
	copyclip = obj;
};

FourEightColumns.prototype.new8Column = function(obj, parent) {
	obj.className = "col-lg-8 col-md-8 col-sm-12 col-xs-12";
	parent.addChild(obj);
};

FourEightColumns.prototype.new4Column = function(obj, parent) {
	obj.className = "col-lg-4 col-md-4 col-sm-12 col-xs-12";
	parent.addChild(obj);
};

FourEightColumns.prototype.doDrag = function(evt) {
	evt.preventDefault();
};

FourEightColumns.prototype.doDragEnd = function(evt) {
	evt.preventDefault();
};