/**
 *
 */
function TableViewComponent(currOwner) {
    this.currOwner = currOwner;// form Id
};

TableViewComponent.prototype.toItem = function() {
    var item = document.createElement("li");
    item.className = "list-group-item";
    var icon = document.createElement("img");
    item.appendChild(icon);
    icon.setAttribute("src", "img/table_32x32.png");
    icon.setAttribute("title", "表格");
    icon.addEventListener("dragstart", this, false);
    icon.addEventListener("drag", this, false);
    icon.addEventListener("dragend", this, false);
    return item;
};

TableViewComponent.prototype.handleEvent = function(e) {
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

TableViewComponent.prototype.doDragStart = function(evt) {
    evt.dataTransfer.effectAllowed = 'copy';
    var obj = new TableView();
    obj.currOwner = this.currOwner; // form Id
    copyclip = obj;
};

TableViewComponent.prototype.doDrag = function(evt) {
    evt.preventDefault();
};

TableViewComponent.prototype.doDragEnd = function(evt) {
    evt.preventDefault();
};