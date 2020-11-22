/**
 *
 */
function MapComponent(currOwner) {
    this.currOwner = currOwner;// form Id
};

MapComponent.prototype.toItem = function() {
    var item = document.createElement("li");
    item.className = "list-group-item";
    var icon = document.createElement("img");
    item.appendChild(icon);
    icon.setAttribute("src", "img/mapicon_32x32.png");
    icon.setAttribute("title", "地图");
    icon.addEventListener("dragstart", this, false);
    icon.addEventListener("drag", this, false);
    icon.addEventListener("dragend", this, false);
    return item;
};

MapComponent.prototype.handleEvent = function(e) {
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

MapComponent.prototype.doDragStart = function(evt) {
    evt.dataTransfer.effectAllowed = 'copy';
    var obj = new EarthMap();
    obj.currOwner = this.currOwner; // form Id
    copyclip = obj;
};

MapComponent.prototype.doDrag = function(evt) {
    evt.preventDefault();
};

MapComponent.prototype.doDragEnd = function(evt) {
    evt.preventDefault();
};