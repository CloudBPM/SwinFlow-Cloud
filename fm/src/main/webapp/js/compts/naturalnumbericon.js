/**
 * 
 */
function NaturalNumberInputComponent(currOwner) {
	this.currOwner = currOwner;// form Id
};

NaturalNumberInputComponent.prototype.toItem = function() {
	var item = document.createElement("li");
	item.className = "list-group-item";
	var icon = document.createElement("img");
	item.appendChild(icon);
	icon.setAttribute("src", "img/nature_32x32.png");
	icon.setAttribute("title", "自然数（正整数）输入框");
	icon.addEventListener("dragstart", this, false);
	icon.addEventListener("drag", this, false);
	icon.addEventListener("dragend", this, false);
	return item;
};

NaturalNumberInputComponent.prototype.handleEvent = function(e) {
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

NaturalNumberInputComponent.prototype.doDragStart = function(evt) {
	evt.dataTransfer.effectAllowed = 'copy';
	var obj = new NaturalNumberInput();
	obj.currOwner = this.currOwner; // form Id
	copyclip = obj;
};

NaturalNumberInputComponent.prototype.doDrag = function(evt) {
	evt.preventDefault();
};

NaturalNumberInputComponent.prototype.doDragEnd = function(evt) {
	evt.preventDefault();
};