/**
 * 
 */
function CurrencyInputComponent(currOwner) {
	this.currOwner = currOwner;// form Id
};

CurrencyInputComponent.prototype.toItem = function() {
	var item = document.createElement("li");
	item.className = "list-group-item";
	var icon = document.createElement("img");
	item.appendChild(icon);
	icon.setAttribute("src", "img/currency_32x32.png");
	icon.setAttribute("title", "货币输入框");
	icon.addEventListener("dragstart", this, false);
	icon.addEventListener("drag", this, false);
	icon.addEventListener("dragend", this, false);
	return item;
};

CurrencyInputComponent.prototype.handleEvent = function(e) {
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

CurrencyInputComponent.prototype.doDragStart = function(evt) {
	evt.dataTransfer.effectAllowed = 'copy';
	var obj = new CurrencyInput();
	obj.currOwner = this.currOwner; // form Id
	copyclip = obj;
};

CurrencyInputComponent.prototype.doDrag = function(evt) {
	evt.preventDefault();
};

CurrencyInputComponent.prototype.doDragEnd = function(evt) {
	evt.preventDefault();
};