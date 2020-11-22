/**
 * 
 */
function TwoColumns(cateId, currOwner) {
	this.cateId = cateId;// category Id
	this.currOwner = currOwner;// PC Desktop UI Id
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
	this.newRow(new PCDesktopRow(this.cateId), this.cateId, this.currOwner);
};

TwoColumns.prototype.newRow = function(obj, cateId, currOwner) {
	obj.parent = null; // parent Id
	obj.currOwner = currOwner; // PC Desktop UI Id
	this.newColumn(new PCDesktopColumn(cateId), obj);
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
	// 	that.newColumn(new PCDesktopColumn(cateId), obj);
	// 	map[cateId].pcDesktopEditor.selected = obj;
	// 	copyclip = obj;
	// });
};

TwoColumns.prototype.newColumn = function(obj, parent) {
	obj.className = "col-lg-6 col-md-6 col-sm-12 col-xs-12";
	parent.addChild(obj);

	// var that = this;
	// $.getJSON(service.api(2)).complete(function(data) {
	// 	obj.id = data.responseText;
	// 	obj.toDom();
	// 	obj.className = "col-lg-6 col-md-6 col-sm-12 col-xs-12";
	// 	obj.dom.classList.add("col-lg-6");
	// 	obj.dom.classList.add("col-md-6");
	// 	obj.dom.classList.add("col-sm-12");
	// 	obj.dom.classList.add("col-xs-12");
	// 	parent.addChild(obj);
	// });
};

TwoColumns.prototype.doDrag = function(evt) {
	evt.preventDefault();
};

TwoColumns.prototype.doDragEnd = function(evt) {
	evt.preventDefault();
};