/**
 * 
 */
function EightFourColumns(cateId, currOwner) {
	this.cateId = cateId;// category Id
	this.currOwner = currOwner;// PC Desktop UI Id
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
	this.newRow(new PCDesktopRow(this.cateId), this.cateId, this.currOwner);
};

EightFourColumns.prototype.newRow = function(obj, cateId, currOwner) {
	obj.parent = null; // parent Id
	obj.currOwner = currOwner; // PC Desktop UI Id
	this.new8Column(new PCDesktopColumn(cateId), obj);
	this.new4Column(new PCDesktopColumn(cateId), obj);
	map[cateId].pcDesktopEditor.selected = obj;
	copyclip = obj;

	// var that = this;
	// $.getJSON(service.api(2)).complete(function(data) {
	// 	obj.id = data.responseText;
	// 	obj.parent = null; // parent Id
	// 	obj.currOwner = currOwner; // PC Desktop UI Id
	// 	obj.toDom();
	// 	that.new8Column(new PCDesktopColumn(cateId), obj);
	// 	that.new4Column(new PCDesktopColumn(cateId), obj);
	// 	map[cateId].pcDesktopEditor.selected = obj;
	// 	copyclip = obj;
	// });
};

EightFourColumns.prototype.new8Column = function(obj, parent) {
	obj.className = "col-lg-8 col-md-8 col-sm-12 col-xs-12";
	parent.addChild(obj);

	// var that = this;
	// $.getJSON(service.api(2)).complete(function(data) {
	// 	obj.id = data.responseText;
	// 	obj.toDom();
	// 	obj.className = "col-lg-8 col-md-8 col-sm-12 col-xs-12";
	// 	obj.dom.classList.add("col-lg-8");
	// 	obj.dom.classList.add("col-md-8");
	// 	obj.dom.classList.add("col-sm-12");
	// 	obj.dom.classList.add("col-xs-12");
	// 	parent.addChild(obj);
	// });
};

EightFourColumns.prototype.new4Column = function(obj, parent) {
	obj.className = "col-lg-4 col-md-4 col-sm-12 col-xs-12";
	parent.addChild(obj);

	// var that = this;
	// $.getJSON(service.api(2)).complete(function(data) {
	// 	obj.id = data.responseText;
	// 	obj.toDom();
	// 	obj.className = "col-lg-4 col-md-4 col-sm-12 col-xs-12";
	// 	obj.dom.classList.add("col-lg-4");
	// 	obj.dom.classList.add("col-md-4");
	// 	obj.dom.classList.add("col-sm-12");
	// 	obj.dom.classList.add("col-xs-12");
	// 	parent.addChild(obj);
	// });
};

EightFourColumns.prototype.doDrag = function(evt) {
	evt.preventDefault();
};

EightFourColumns.prototype.doDragEnd = function(evt) {
	evt.preventDefault();
};