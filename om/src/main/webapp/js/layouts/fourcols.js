/**
 * 
 */
function FourColumns(cateId, currOwner) {
	this.cateId = cateId;// category Id
	this.currOwner = currOwner;// PC Desktop UI Id
};

FourColumns.prototype.toItem = function() {
	var item = document.createElement("li");
	item.className = "list-group-item";
	var icon = document.createElement("img");
	item.appendChild(icon);
	icon.id = "fourcols" + this.id;
	icon.setAttribute("src", "img/col3_32x32.png");
	icon.setAttribute("title", "四列布局");
	icon.addEventListener("dragstart", this, false);
	icon.addEventListener("drag", this, false);
	icon.addEventListener("dragend", this, false);
	return item;
};

FourColumns.prototype.handleEvent = function(e) {
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

FourColumns.prototype.doDragStart = function(evt) {
	evt.dataTransfer.effectAllowed = 'copy';
	this.newRow(new PCDesktopRow(this.cateId), this.cateId, this.currOwner);
};

FourColumns.prototype.newRow = function(obj, cateId, currOwner) {
	obj.parent = null; // parent Id
	obj.currOwner = currOwner; // PC Desktop UI Id
	for (var i = 0; i < 4; i++) {
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
	// 	for (var i = 0; i < 4; i++) {
	// 		that.newColumn(new PCDesktopColumn(cateId), obj);
	// 	}
	// 	map[cateId].pcDesktopEditor.selected = obj;
	// 	copyclip = obj;
	// });
};

FourColumns.prototype.newColumn = function(obj, parent) {
	obj.className = "col-lg-3 col-md-3 col-sm-12 col-xs-12";
	parent.addChild(obj);

	// var that = this;
	// $.getJSON(service.api(2)).complete(function(data) {
	// 	obj.id = data.responseText;
	// 	obj.toDom();
	// 	obj.className = "col-lg-3 col-md-3 col-sm-12 col-xs-12";
	// 	obj.dom.classList.add("col-lg-3");
	// 	obj.dom.classList.add("col-md-3");
	// 	obj.dom.classList.add("col-sm-12");
	// 	obj.dom.classList.add("col-xs-12");
	// 	parent.addChild(obj);
	// });
};

FourColumns.prototype.doDrag = function(evt) {
	evt.preventDefault();
};

FourColumns.prototype.doDragEnd = function(evt) {
	evt.preventDefault();
};