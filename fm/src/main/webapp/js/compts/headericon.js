/**
 * 
 */
function HeaderComponent(currOwner) {
	this.currOwner = currOwner;// form Id
};

HeaderComponent.prototype.toItem = function() {
	var item = document.createElement("li");
	item.className = "list-group-item";
	var icon = document.createElement("img");
	item.appendChild(icon);
	icon.setAttribute("src", "img/header_32x32.png");
	icon.setAttribute("title", "表单标题");
	icon.addEventListener("dragstart", this, false);
	icon.addEventListener("drag", this, false);
	icon.addEventListener("dragend", this, false);
	return item;
};

HeaderComponent.prototype.handleEvent = function(e) {
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

HeaderComponent.prototype.doDragStart = function(evt) {
	evt.dataTransfer.effectAllowed = 'copy';
	var obj = new Header();
	obj.currOwner = this.currOwner; // form Id
	copyclip = obj;
};

HeaderComponent.prototype.doDrag = function(evt) {
	evt.preventDefault();
};

HeaderComponent.prototype.doDragEnd = function(evt) {
	evt.preventDefault();
};