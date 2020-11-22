/**
 *
 */
function CheckboxComponent(currOwner) {
    this.currOwner = currOwner;// form Id
};

CheckboxComponent.prototype.toItem = function () {
    var item = document.createElement("li");
    item.className = "list-group-item";
    var icon = document.createElement("img");
    item.appendChild(icon);
    icon.setAttribute("src", "img/checkbox_32x32.png");
    icon.setAttribute("title", "复选框");
    icon.addEventListener("dragstart", this, false);
    icon.addEventListener("drag", this, false);
    icon.addEventListener("dragend", this, false);
    return item;
};

CheckboxComponent.prototype.handleEvent = function (e) {
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

CheckboxComponent.prototype.doDragStart = function (evt) {
    evt.dataTransfer.effectAllowed = 'copy';
    this.newComponent(new CheckBoxes(), this.currOwner);
};

CheckboxComponent.prototype.newComponent = function (obj, currOwner) {
    obj.parent = null; // parent Id
    obj.currOwner = currOwner; // form Id
    CheckboxComponent.addDefaultCheckboxes(obj);
    copyclip = obj;
};

CheckboxComponent.prototype.doDrag = function (evt) {
    evt.preventDefault();
};

CheckboxComponent.prototype.doDragEnd = function (evt) {
    evt.preventDefault();
};

CheckboxComponent.addDefaultCheckboxes = function (parent) {
    var chs = [];
    var ch0 = new CheckBox();
    ch0.name = "checkbox";
    ch0.title = "选项1";
    ch0.initValue = "01";
    chs.push(ch0);
    var ch1 = new CheckBox();
    ch1.name = "checkbox";
    ch1.title = "选项2";
    ch1.initValue = "02";
    chs.push(ch1);
    var ch2 = new CheckBox();
    ch2.name = "checkbox";
    ch2.title = "选项3";
    ch2.initValue = "03";
    chs.push(ch2);
    if (chs != null && chs.length > 0) {
        for (var i = 0; i < chs.length; i++) {
            parent.addChild(chs[i]);
        }
    }
};

CheckboxComponent.newCheckbox = function (obj, parent) {
    var that = this;
    $.getJSON(service.api(2)).complete(
        function (data) {
            obj.id = data.responseText;
            map[parent.currOwner].stack.execute(new FMAddCheckRadioCmd(obj,
                parent, map[parent.currOwner].currObject));
        });
};