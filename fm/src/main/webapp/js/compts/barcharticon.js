/**
 *
 */
function BarChartComponent(currOwner) {
    this.currOwner = currOwner;// form Id
};

BarChartComponent.prototype.toItem = function() {
    var item = document.createElement("li");
    item.className = "list-group-item";
    var icon = document.createElement("img");
    item.appendChild(icon);
    icon.setAttribute("src", "img/bar_chart_32x32.png");
    icon.setAttribute("title", "柱状图");
    icon.addEventListener("dragstart", this, false);
    icon.addEventListener("drag", this, false);
    icon.addEventListener("dragend", this, false);
    return item;
};

BarChartComponent.prototype.handleEvent = function(e) {
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

BarChartComponent.prototype.doDragStart = function(evt) {
    evt.dataTransfer.effectAllowed = 'copy';
    var obj = new BarChart()
    obj.currOwner = this.currOwner; // form Id
    copyclip = obj;
};

BarChartComponent.prototype.doDrag = function(evt) {
    evt.preventDefault();
};

BarChartComponent.prototype.doDragEnd = function(evt) {
    evt.preventDefault();
};