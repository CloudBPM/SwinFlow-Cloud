/**
 * 
 */
function MultipleLineInputComponent(currOwner) {
	this.currOwner = currOwner;// form Id
};

MultipleLineInputComponent.prototype.toItem = function() {
	var item = document.createElement("li");
	item.className = "list-group-item";
	var icon = document.createElement("img");
	item.appendChild(icon);
	icon.setAttribute("src", "img/textarea_32x32.png");
	icon.setAttribute("title", "多行输入文本框");
	icon.addEventListener("dragstart", this, false);
	icon.addEventListener("drag", this, false);
	icon.addEventListener("dragend", this, false);
	return item;
};

MultipleLineInputComponent.prototype.handleEvent = function(e) {
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

MultipleLineInputComponent.prototype.doDragStart = function(evt) {
	evt.dataTransfer.effectAllowed = 'copy';
	var obj = new MultipleLineText();
	obj.currOwner = this.currOwner; // form Id
	copyclip = obj;
};

MultipleLineInputComponent.prototype.doDrag = function(evt) {
	evt.preventDefault();
};

MultipleLineInputComponent.prototype.doDragEnd = function(evt) {
	evt.preventDefault();
};