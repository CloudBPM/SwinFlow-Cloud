/**
 *
 */
function BarChart() {
    this.id = null;
    this.parent = null; // parent Id
    this.currOwner = null; // form Id
    // basic properties
    this.title = "柱状图";
    this.type = "BarChart"; // type: submit|button|reset
    this.tabIndex = "-1";
    this.fillWidth = 0; // 0: actual width; 1: 100% width
    this.disabled = 0; // 0:false; 1:true
    this.hidden = 0; // 0: visible; 1: invisible
    this.classtypename = "BarChart";
    this.evn = 0;
    this.rules = [];
};

BarChart.prototype = new UIComponent();

// for previewing
BarChart.prototype.clone = function () {
    var t = new BarChart();
    t.id = this.id;
    t.parent = this.parent; // parent Id
    t.currOwner = this.currOwner; // form Id
    t.title = this.title;
    t.type = this.type;
    t.fillWidth = this.fillWidth;
    t.tabIndex = this.tabIndex;
    t.disabled = this.disabled; // 0:false; 1:true
    t.hidden = this.hidden;
    t.evn = this.evn;
    t.toDomForHTML();
    return t;
};

BarChart.prototype.show = function (d) {
    var o = document.getElementById(this.id);
    if (d == "1") {
        o.style.display = "";
    } else {
        o.style.display = "none";
    }
};

BarChart.prototype.enable = function (e) {
    var o = document.getElementById("btn" + this.id);
    if (e == "1") {
        o.disabled = false;
    } else {
        o.disabled = true;
    }
};

BarChart.prototype.cloneRules = function (owner, old) {
    var o = old.seekObjectByID(this.id);
    if (o.rules.length > 0) {
        for (var i = 0; i < o.rules.length; i++) {
            this.rules.push(o.rules[i].clone(owner));
        }
    }
};

// for previewing
BarChart.prototype.toDomForHTML = function (parent) {
    this.dom = document.createElement("DIV");
    parent.appendChild(this.dom);
    this.dom.id = this.id;
    this.dom.className = "form-group";
    // this.dom.style.height  = "100%";
    this.dom.tabIndex = "-1";
    this.updateDom();
    return this.dom;
};

BarChart.prototype.toDom = function (parent) {
    this.toDomforFormGroup(parent);
    this.updateDom();
};

BarChart.prototype.updateDom = function () {
    while (this.dom.hasChildNodes()) { // clear dom
        if (this.dom.lastChild.id != "rm" + this.id) {
            this.dom.removeChild(this.dom.lastChild);
        } else if (this.dom.children.length == 1) {
            break;
        }
    }
    var chart = document.createElement("DIV");
    this.dom.appendChild(chart);
    chart.id = "barchart" + this.id;
    if (this.evn == 0) {
        if (this.dom.parentElement != null) {
            chart.style.height = (this.dom.parentElement.clientHeight) + "px";
        } else {
            chart.style.width = "500px";
            chart.style.height = "600px";
        }
    } else if (this.evn == 1) {
        chart.style.height = (this.dom.parentElement.clientHeight) + "px";
    }

    var myChart = echarts.init(chart);
    // 指定图表的配置项和数据
    var option = {
        title: {
            text: this.title
        },
        tooltip: {},
        legend: {
            data: ['销量']
        },
        xAxis: {
            data: ["衬衫", "羊毛衫", "雪纺衫", "裤子", "高跟鞋", "袜子"]
        },
        yAxis: {},
        series: [{
            name: '销量',
            type: 'bar',
            data: [5, 20, 36, 10, 10, 20]
        }]
    };

    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);


    // var button = document.createElement("button");
    // button.id = "btn" + this.id;
    // button.addEventListener("click", this, false);
    // button.className = "btn";
    // button.classList.add("btn-default");
    // if (this.fillWidth == 1)
    //     button.classList.add("btn-block");
    // if (this.disabled == 1)
    //     button.disabled = true;
    // var buttonlabel = document.createTextNode(this.title);
    // button.appendChild(buttonlabel);
    // button.tabIndex = this.tabIndex;
    // if (this.hidden == 0)
    //     this.dom.style.display = "";
    // else
    //     this.dom.style.display = "none";
    // this.dom.appendChild(button);

};

BarChart.prototype.toDomforFormGroup = function (parent) {
    this.dom = document.createElement("DIV");
    parent.appendChild(this.dom);
    this.dom.id = this.id;
    this.dom.className = "form-group comp_outline";
    this.dom.tabIndex = "-1";
    this.dom.draggable = "true";
    // dragged component
    this.dom.addEventListener("dragstart", this, false);
    this.dom.addEventListener("drag", this, false);
    this.dom.addEventListener("dragend", this, false);
    this.dom.addEventListener("click", this, false);
    this.dom.addEventListener("focus", this, false);
    this.dom.addEventListener("blur", this, false);

    var remove = document.createElement("A");
    remove.id = "rm" + this.id;
    remove.className = "remove";
    this.dom.appendChild(remove);
    var removeSpan = document.createElement("i");
    remove.appendChild(removeSpan);
    removeSpan.className = "glyphicon glyphicon-remove";
    removeSpan.addEventListener("click", this, false);
};

BarChart.prototype.handleEvent = function (e) {
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
        case "click":
            this.doClick(e);
            break;
        case "focus":
            this.doFocus(e);
            break;
        case "blur":
            this.doBlur(e);
            break;
    }
};

BarChart.prototype.doClick = function (evt) {
    if (this.evn == 0) {
        if (evt.target.className == "glyphicon glyphicon-remove") {
            if (map[this.currOwner] != null
                && map[this.currOwner].currObject instanceof Form) {
                map[this.currOwner].stack.execute(new FMRemoveRowCmd(
                    evt.target.parentNode.parentNode.id,
                    map[this.currOwner].currObject));
            }
        } else {
            evt.target.focus();
            map[this.currOwner].selected = this;
            map[this.currOwner].enableEditButtons();
            map[this.currOwner].setPropertySheet();
        }
    } else if (this.evn == 1) {

    }
    Utils.stopBubble(evt);
};

BarChart.prototype.doFocus = function (evt) {
    bgcache = evt.target.style.backgroundColor;
    evt.target.style.backgroundColor = Utils.highLight();
    Utils.stopBubble(evt);
};

BarChart.prototype.doBlur = function (evt) {
    evt.target.style.backgroundColor = bgcache;
    bgcache = null;
    Utils.stopBubble(evt);
};

BarChart.prototype.doDragStart = function (evt) {
    if (this.evn == 0) {
        if (map[this.currOwner] != null
            && map[this.currOwner].currObject instanceof Form) {
            evt.target.style.opacity = '0.7'; // this / e.target is the source
            // node.
            evt.dataTransfer.effectAllowed = 'move';
            copyclip = evt.target.id; // critical
        }
        Utils.stopBubble(evt);
    } else if (this.evn == 1) {

    }
};

BarChart.prototype.doDrag = function (evt) {
    Utils.stopBubble(evt);
};

BarChart.prototype.doDragEnd = function (evt) {
    if (this.evn == 0) {
        if (map[this.currOwner] != null
            && map[this.currOwner].currObject instanceof Form) {
            evt.target.style.opacity = '1';
        }
        Utils.stopBubble(evt);
    } else if (this.evn == 1) {

    }
};

BarChart.prototype.parseFromJSON = function (json, evn) {
    this.id = json.id;
    this.parent = json.parent; // parent Id
    this.currOwner = json.currOwner; // form Id
    this.title = json.title;
    this.type = json.type;
    this.tabIndex = json.tabIndex;
    this.fillWidth = json.fillWidth;
    this.disabled = json.disabled; // 0:false; 1:true
    this.hidden = json.hidden;
    this.evn = evn;
    // parsing propagation rules firstly.
    if (json.rules != undefined && json.rules != null && json.rules.length > 0) {
        for (var i = 0; i < json.rules.length; i++) {
            var r = new PropagateRule();
            r.parseFromJSON(json.rules[i]);
            this.rules.push(r);
        }
    }
};

BarChart.prototype.parseExpressions = function (owner) {
    for (var i = 0; i < this.rules.length; i++) {
        this.rules[i].parseExpressions(owner);
    }
};

BarChart.prototype.toTree = function () {
    return {
        id: this.id,
        text: this.title,
        icon: "glyphicon glyphicon-unchecked",
        data: "柱状图|",
    }
};
