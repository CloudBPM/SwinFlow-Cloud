/**
 * 
 */
function BigThreeColumns(cateId, currOwner) {
	this.cateId = cateId;// category Id
	this.currOwner = currOwner;// PC Desktop UI Id
};

BigThreeColumns.prototype.toItem = function() {
	var item = document.createElement("li");
	item.className = "list-group-item";
	var icon = document.createElement("img");
	item.appendChild(icon);
	icon.id = "threecols" + this.id;
	icon.setAttribute("src", "img/big_col3_32x32.png");
	icon.setAttribute("title", "三列布局（左右小中间大）");
	icon.setAttribute("type", "3");
	icon.addEventListener("dragstart", this, false);
	icon.addEventListener("drag", this, false);
	icon.addEventListener("dragend", this, false);
	return item;
};

BigThreeColumns.prototype.handleEvent = function(e) {
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

BigThreeColumns.prototype.doDragStart = function(evt) {
	evt.dataTransfer.effectAllowed = 'copy';
	this.newRow(new PCDesktopRow(this.cateId), this.cateId, this.currOwner);
};

BigThreeColumns.prototype.newRow = function(obj, cateId, currOwner) {
	obj.parent = null; // parent Id
	obj.currOwner = currOwner; // PC Desktop UI Id
	this.newLeftColumn(new PCDesktopColumn(cateId), obj);
	this.newMiddleColumn(new PCDesktopColumn(cateId), obj);
	this.newRightColumn(new PCDesktopColumn(cateId), obj);
	map[cateId].pcDesktopEditor.selected = obj;
	copyclip = obj;
};

BigThreeColumns.prototype.newLeftColumn = function(obj, parent) {
	obj.className = "col-lg-3 col-md-3 col-sm-12 col-xs-12";
	parent.addChild(obj);

};

BigThreeColumns.prototype.newMiddleColumn = function(obj, parent) {
	obj.className = "col-lg-6 col-md-6 col-sm-12 col-xs-12";
	parent.addChild(obj);

};

BigThreeColumns.prototype.newRightColumn = function(obj, parent) {
	obj.className = "col-lg-3 col-md-3 col-sm-12 col-xs-12";
	parent.addChild(obj);

};



BigThreeColumns.prototype.doDrag = function(evt) {
	evt.preventDefault();
};

BigThreeColumns.prototype.doDragEnd = function(evt) {
	evt.preventDefault();
};