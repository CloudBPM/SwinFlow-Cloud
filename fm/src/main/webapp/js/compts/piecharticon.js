/**
 *
 */
function PieChartComponent(currOwner) {
    this.currOwner = currOwner;// form Id
};

PieChartComponent.prototype.toItem = function() {
    var item = document.createElement("li");
    item.className = "list-group-item";
    var icon = document.createElement("img");
    item.appendChild(icon);
    icon.setAttribute("src", "img/pie_chart_32x32.png");
    icon.setAttribute("title", "饼图");
    icon.addEventListener("dragstart", this, false);
    icon.addEventListener("drag", this, false);
    icon.addEventListener("dragend", this, false);
    return item;
};

PieChartComponent.prototype.handleEvent = function(e) {
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

PieChartComponent.prototype.doDragStart = function(evt) {
    evt.dataTransfer.effectAllowed = 'copy';
    var obj = new PieChart();
    obj.currOwner = this.currOwner; // form Id
    copyclip = obj;
};

PieChartComponent.prototype.doDrag = function(evt) {
    evt.preventDefault();
};

PieChartComponent.prototype.doDragEnd = function(evt) {
    evt.preventDefault();
};