/**
 * 
 */
function RealInputComponent(currOwner) {
	this.currOwner = currOwner;// form Id
};

RealInputComponent.prototype.toItem = function() {
	var item = document.createElement("li");
	item.className = "list-group-item";
	var icon = document.createElement("img");
	item.appendChild(icon);
	icon.setAttribute("src", "img/real_32x32.png");
	icon.setAttribute("title", "小数输入框");
	icon.addEventListener("dragstart", this, false);
	icon.addEventListener("drag", this, false);
	icon.addEventListener("dragend", this, false);
	return item;
};

RealInputComponent.prototype.handleEvent = function(e) {
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

RealInputComponent.prototype.doDragStart = function(evt) {
	evt.dataTransfer.effectAllowed = 'copy';
	var obj = new DecimalsInput();
	obj.currOwner = this.currOwner; // form Id
	copyclip = obj;

	// this.newComponent(new DecimalsInput(), this.currOwner);
};

RealInputComponent.prototype.newComponent = function(obj, currOwner) {
	obj.parent = null; // parent Id
	obj.currOwner = currOwner; // form Id
	copyclip = obj;

	// var that = this;
	// $.getJSON(service.api(2)).complete(function(data) {
	// 	obj.id = data.responseText;
	// 	obj.parent = null; // parent Id
	// 	obj.currOwner = currOwner; // form Id
	// 	//obj.toDom();
	// 	copyclip = obj;
	// });
};

RealInputComponent.prototype.doDrag = function(evt) {
	evt.preventDefault();
};

RealInputComponent.prototype.doDragEnd = function(evt) {
	evt.preventDefault();
};