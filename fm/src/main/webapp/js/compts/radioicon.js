/**
 *
 */
function RadioComponent(currOwner) {
    this.currOwner = currOwner;// form Id
};

RadioComponent.prototype.toItem = function () {
    var item = document.createElement("li");
    item.className = "list-group-item";
    var icon = document.createElement("img");
    item.appendChild(icon);
    icon.setAttribute("src", "img/radio_32x32.png");
    icon.setAttribute("title", "单选框");
    icon.addEventListener("dragstart", this, false);
    icon.addEventListener("drag", this, false);
    icon.addEventListener("dragend", this, false);
    return item;
};

RadioComponent.prototype.handleEvent = function (e) {
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

RadioComponent.prototype.doDragStart = function (evt) {
    evt.dataTransfer.effectAllowed = 'copy';
    this.newComponent(new Radios(), this.currOwner);
};

RadioComponent.prototype.newComponent = function (obj, currOwner) {
    obj.parent = null; // parent Id
    obj.currOwner = currOwner; // form Id
    RadioComponent.addDefaultRadios(obj);
    copyclip = obj;
};

RadioComponent.prototype.doDrag = function (evt) {
    evt.preventDefault();
};

RadioComponent.prototype.doDragEnd = function (evt) {
    evt.preventDefault();
};

RadioComponent.addDefaultRadios = function (parent) {
    var rds = [];
    var rd0 = new Radio();
    rd0.name = "radio";
    rd0.title = "选项1";
    rd0.initValue = "01";
    rds.push(rd0);
    var rd1 = new Radio();
    rd1.name = "radio";
    rd1.title = "选项2";
    rd1.initValue = "02";
    rds.push(rd1);
    var rd2 = new Radio();
    rd2.name = "radio";
    rd2.title = "选项3";
    rd2.initValue = "03";
    rds.push(rd2);
    if (rds != null && rds.length > 0) {
        for (var i = 0; i < rds.length; i++) {
            parent.addChild(rds[i]);
        }
    }
};

RadioComponent.newRadio = function (obj, parent) {
    var that = this;
    $.getJSON(service.api(2)).complete(
        function (data) {
            obj.id = data.responseText;
            map[parent.currOwner].stack.execute(new FMAddCheckRadioCmd(obj,
                parent, map[parent.currOwner].currObject));
        });
};