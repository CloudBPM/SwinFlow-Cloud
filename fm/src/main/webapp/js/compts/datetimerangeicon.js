/**
 * 
 */
function DateTimeRangeComponent(currOwner) {
	this.currOwner = currOwner;// form Id
};

DateTimeRangeComponent.prototype.toItem = function() {
	var item = document.createElement("li");
	item.className = "list-group-item";
	var icon = document.createElement("img");
	item.appendChild(icon);
	icon.setAttribute("src", "img/datetime_range_32x32.png");
	icon.setAttribute("title", "时间区间输入框");
	icon.addEventListener("dragstart", this, false);
	icon.addEventListener("drag", this, false);
	icon.addEventListener("dragend", this, false);
	return item;
};

DateTimeRangeComponent.prototype.handleEvent = function(e) {
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

DateTimeRangeComponent.prototype.doDragStart = function(evt) {
	evt.dataTransfer.effectAllowed = 'copy';
	var obj = new DateTimeRangeInput();
	obj.currOwner = this.currOwner; // form Id
	copyclip = obj;
};

DateTimeRangeComponent.prototype.doDrag = function(evt) {
	evt.preventDefault();
};

DateTimeRangeComponent.prototype.doDragEnd = function(evt) {
	evt.preventDefault();
};