/**
 * 
 */
function FileReadersComponent(currOwner) {
	this.currOwner = currOwner;// form Id
};

FileReadersComponent.prototype.toItem = function() {
	var item = document.createElement("li");
	item.className = "list-group-item";
	var icon = document.createElement("img");
	item.appendChild(icon);
	icon.setAttribute("src", "img/filereaders_32x32.png");
	icon.setAttribute("title", "按钮");
	icon.addEventListener("dragstart", this, false);
	icon.addEventListener("drag", this, false);
	icon.addEventListener("dragend", this, false);
	return item;
};

FileReadersComponent.prototype.handleEvent = function(e) {
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

FileReadersComponent.prototype.doDragStart = function(evt) {
	evt.dataTransfer.effectAllowed = 'copy';
	var obj = new FilesDisplayer();
	obj.currOwner = currOwner; // form Id
	copyclip = obj;
};

FileReadersComponent.prototype.doDrag = function(evt) {
	evt.preventDefault();
};

FileReadersComponent.prototype.doDragEnd = function(evt) {
	evt.preventDefault();
};