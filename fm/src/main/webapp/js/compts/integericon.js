/**
 * 
 */
function IntegerInputComponent(currOwner) {
	this.currOwner = currOwner;// form Id
};

IntegerInputComponent.prototype.toItem = function() {
	var item = document.createElement("li");
	item.className = "list-group-item";
	var icon = document.createElement("img");
	item.appendChild(icon);
	icon.setAttribute("src", "img/integer_32x32.png");
	icon.setAttribute("title", "整数输入框");
	icon.addEventListener("dragstart", this, false);
	icon.addEventListener("drag", this, false);
	icon.addEventListener("dragend", this, false);
	return item;
};

IntegerInputComponent.prototype.handleEvent = function(e) {
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

IntegerInputComponent.prototype.doDragStart = function(evt) {
	evt.dataTransfer.effectAllowed = 'copy';
	var obj = new IntegerInput();
	obj.currOwner = this.currOwner; // form Id
	copyclip = obj;
};

IntegerInputComponent.prototype.doDrag = function(evt) {
	evt.preventDefault();
};

IntegerInputComponent.prototype.doDragEnd = function(evt) {
	evt.preventDefault();
};