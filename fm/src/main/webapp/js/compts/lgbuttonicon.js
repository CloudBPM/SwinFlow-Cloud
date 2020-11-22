/**
 * 
 */
function LargeButtonComponent(currOwner) {
	this.currOwner = currOwner;// form Id
};

LargeButtonComponent.prototype.toItem = function() {
	var item = document.createElement("li");
	item.className = "list-group-item";
	var icon = document.createElement("img");
	item.appendChild(icon);
	icon.setAttribute("src", "img/lg_button_32x32.png");
	icon.setAttribute("title", "大按钮");
	icon.addEventListener("dragstart", this, false);
	icon.addEventListener("drag", this, false);
	icon.addEventListener("dragend", this, false);
	return item;
};

LargeButtonComponent.prototype.handleEvent = function(e) {
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

LargeButtonComponent.prototype.doDragStart = function(evt) {
	evt.dataTransfer.effectAllowed = 'copy';
	var obj = new LargeButton();
	obj.currOwner = this.currOwner; // form Id
	copyclip = obj;
};

LargeButtonComponent.prototype.doDrag = function(evt) {
	evt.preventDefault();
};

LargeButtonComponent.prototype.doDragEnd = function(evt) {
	evt.preventDefault();
};