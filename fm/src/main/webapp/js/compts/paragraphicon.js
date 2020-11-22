/**
 * 
 */
function ParagraphComponent(currOwner) {
	this.currOwner = currOwner;// form Id
};

ParagraphComponent.prototype.toItem = function() {
	var item = document.createElement("li");
	item.className = "list-group-item";
	var icon = document.createElement("img");
	item.appendChild(icon);
	icon.setAttribute("src", "img/paragraph_32x32.png");
	icon.setAttribute("title", "段落正文");
	icon.addEventListener("dragstart", this, false);
	icon.addEventListener("drag", this, false);
	icon.addEventListener("dragend", this, false);
	return item;
};

ParagraphComponent.prototype.handleEvent = function(e) {
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

ParagraphComponent.prototype.doDragStart = function(evt) {
	evt.dataTransfer.effectAllowed = 'copy';
	var obj = new Paragraph();
	obj.currOwner = this.currOwner; // form Id
	copyclip = obj;
};

ParagraphComponent.prototype.doDrag = function(evt) {
	evt.preventDefault();
};

ParagraphComponent.prototype.doDragEnd = function(evt) {
	evt.preventDefault();
};