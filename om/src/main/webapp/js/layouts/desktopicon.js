/**
 * 
 */
function Desktopicon(cateId, currOwner) {
	this.cateId = cateId;// category Id
	this.currOwner = currOwner;// PC Desktop UI Id
};

Desktopicon.prototype.toItem = function() {
	var item = document.createElement("li");
	item.className = "list-group-item";
	var icon = document.createElement("img");
	item.appendChild(icon);
	icon.src = "img/default_button_icon.png";
	icon.style.width = "32px";
	icon.style.height = "32px";
	icon.setAttribute("title", "桌面图标");
	icon.addEventListener("dragstart", this, false);
	icon.addEventListener("drag", this, false);
	icon.addEventListener("dragend", this, false);
	return item;
};

Desktopicon.prototype.handleEvent = function(e) {
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

Desktopicon.prototype.doDragStart = function(evt) {
	evt.dataTransfer.effectAllowed = 'copy';
	var obj = new PCDesktopIcon(this.cateId);
	obj.currOwner = this.currOwner; // form Id
	map[this.cateId].pcDesktopEditor.selected = obj;
	copyclip = obj;
	// this.newComponent(new PCDesktopIcon(this.cateId), this.cateId, this.currOwner);
};

// Desktopicon.prototype.newComponent = function(obj, cateId, currOwner) {
// 	var that = this;
// 	$.getJSON(service.api(2)).complete(function(data) {
// 		obj.id = data.responseText;
// 		obj.parent = null; // parent Id
// 		obj.currOwner = currOwner; // PC Desktop UI Id
// 		obj.toDom();
// 		map[cateId].pcDesktopEditor.selected = obj;
// 		copyclip = obj;
// 	});
// };

Desktopicon.prototype.doDrag = function(evt) {
	evt.preventDefault();
};

Desktopicon.prototype.doDragEnd = function(evt) {
	evt.preventDefault();
};