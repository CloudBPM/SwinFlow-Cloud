/**
 * This class will create a new single column layout.
 */
function OneColumn(cateId, currOwner) {
	this.cateId = cateId;// category Id
	this.currOwner = currOwner;// PC desktop UI Id
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
	this.newRow(new PCDesktopRow(this.cateId), this.cateId, this.currOwner);
};

OneColumn.prototype.newRow = function(obj, cateId, currOwner) {
	obj.parent = null; // parent Id
	obj.currOwner = currOwner; // PC Desktop UI Id
	this.newColumn(new PCDesktopColumn(cateId), obj);
	map[cateId].pcDesktopEditor.selected = obj;
	copyclip = obj;

	// var that = this;
	// $.getJSON(service.api(2)).complete(function(data) {
	// 	obj.id = data.responseText;
	// 	obj.parent = null; // parent Id
	// 	obj.currOwner = currOwner; // PC Desktop UI Id
	// 	obj.toDom();
	// 	that.newColumn(new PCDesktopColumn(cateId), obj);
	// 	map[cateId].pcDesktopEditor.selected = obj;
	// 	copyclip = obj;
	// });
};

OneColumn.prototype.newColumn = function(obj, parent) {
	obj.className = "col-lg-12 col-md-12 col-sm-12 col-xs-12";
	parent.addChild(obj);

	// var that = this;
	// $.getJSON(service.api(2)).complete(function(data) {
	// 	obj.id = data.responseText;
	// 	obj.className = "col-lg-12 col-md-12 col-sm-12 col-xs-12";
	// 	obj.toDom();
	// 	obj.dom.classList.add("col-lg-12");
	// 	obj.dom.classList.add("col-md-12");
	// 	obj.dom.classList.add("col-sm-12");
	// 	obj.dom.classList.add("col-xs-12");
	// 	parent.addChild(obj);
	// });
};

OneColumn.prototype.doDrag = function(evt) {
	evt.preventDefault();
};

OneColumn.prototype.doDragEnd = function(evt) {
	evt.preventDefault();
};