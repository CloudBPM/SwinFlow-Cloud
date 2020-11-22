/**
 * 
 */
function SixColumns(cateId, currOwner) {
	this.cateId = cateId;// category Id
	this.currOwner = currOwner;// PC Desktop UI Id
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
	this.newRow(new PCDesktopRow(this.cateId), this.cateId, this.currOwner);
};

SixColumns.prototype.newRow = function(obj, cateId, currOwner) {
	obj.parent = null; // parent Id
	obj.currOwner = currOwner; // PC Desktop UI Id
	for (var i = 0; i < 6; i++) {
		this.newColumn(new PCDesktopColumn(cateId), obj);
	}
	map[cateId].pcDesktopEditor.selected = obj;
	copyclip = obj;

	// var that = this;
	// $.getJSON(service.api(2)).complete(function(data) {
	// 	obj.id = data.responseText;
	// 	obj.parent = null; // parent Id
	// 	obj.currOwner = currOwner; // PC Desktop UI Id
	// 	obj.toDom();
	// 	for (var i = 0; i < 6; i++) {
	// 		that.newColumn(new PCDesktopColumn(cateId), obj);
	// 	}
	// 	map[cateId].pcDesktopEditor.selected = obj;
	// 	copyclip = obj;
	// });
};

SixColumns.prototype.newColumn = function(obj, parent) {
	obj.className = "col-lg-2 col-md-2 col-sm-12 col-xs-12";
	parent.addChild(obj);

	// var that = this;
	// $.getJSON(service.api(2)).complete(function(data) {
	// 	obj.id = data.responseText;
	// 	obj.toDom();
	// 	obj.className = "col-lg-2 col-md-2 col-sm-12 col-xs-12";
	// 	obj.dom.classList.add("col-lg-2");
	// 	obj.dom.classList.add("col-md-2");
	// 	obj.dom.classList.add("col-sm-12");
	// 	obj.dom.classList.add("col-xs-12");
	// 	parent.addChild(obj);
	// });
};

SixColumns.prototype.doDrag = function(evt) {
	evt.preventDefault();
};

SixColumns.prototype.doDragEnd = function(evt) {
	evt.preventDefault();
};