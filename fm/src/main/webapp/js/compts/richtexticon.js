/**
 * 
 */
function RichTextInputComponent(currOwner) {
	this.currOwner = currOwner;// form Id
};

RichTextInputComponent.prototype.toItem = function() {
	var item = document.createElement("li");
	item.className = "list-group-item";
	var icon = document.createElement("img");
	item.appendChild(icon);
	icon.setAttribute("src", "img/richtextarea_32x32.png");
	icon.setAttribute("title", "富文本输入框");
	icon.addEventListener("dragstart", this, false);
	icon.addEventListener("drag", this, false);
	icon.addEventListener("dragend", this, false);
	return item;
};

RichTextInputComponent.prototype.handleEvent = function(e) {
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

RichTextInputComponent.prototype.doDragStart = function(evt) {
	evt.dataTransfer.effectAllowed = 'copy';
	var obj = new RichTextInput();
	obj.currOwner = this.currOwner; // form Id
	copyclip = obj;
};

RichTextInputComponent.prototype.doDrag = function(evt) {
	evt.preventDefault();
};

RichTextInputComponent.prototype.doDragEnd = function(evt) {
	evt.preventDefault();
};