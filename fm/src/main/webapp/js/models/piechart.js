/**
 *
 */
function PieChart() {
    this.id = null;
    this.parent = null; // parent Id
    this.currOwner = null; // form Id
    // basic properties
    this.title = "饼图";
    this.type = "PieChart"; // type: submit|button|reset
    this.tabIndex = "-1";
    this.fillWidth = 0; // 0: actual width; 1: 100% width
    this.disabled = 0; // 0:false; 1:true
    this.hidden = 0; // 0: visible; 1: invisible
    this.classtypename = "PieChart";
    this.evn = 0;
    this.rules = [];
};

PieChart.prototype = new UIComponent();

// for previewing
PieChart.prototype.clone = function() {
    var t = new PieChart();
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

PieChart.prototype.show = function(d) {
    var o = document.getElementById(this.id);
    if (d == "1") {
        o.style.display = "";
    } else {
        o.style.display = "none";
    }
};

PieChart.prototype.enable = function(e) {
    var o = document.getElementById("btn" + this.id);
    if (e == "1") {
        o.disabled = false;
    } else {
        o.disabled = true;
    }
};

PieChart.prototype.cloneRules = function(owner, old) {
    var o = old.seekObjectByID(this.id);
    if (o.rules.length > 0) {
        for (var i = 0; i < o.rules.length; i++) {
            this.rules.push(o.rules[i].clone(owner));
        }
    }
};

// for previewing
PieChart.prototype.toDomForHTML = function(parent) {
    this.dom = document.createElement("DIV");
    parent.appendChild(this.dom);
    this.dom.id = this.id;
    this.dom.className = "form-group";
    // this.dom.style.height = "100%";
    this.dom.tabIndex = "-1";
    this.updateDom();
    return this.dom;
};

PieChart.prototype.toDom = function(parent) {
    this.toDomforFormGroup(parent);
    this.updateDom();
};

PieChart.prototype.updateDom = function() {
    while (this.dom.hasChildNodes()) { // clear dom
        if (this.dom.lastChild.id != "rm" + this.id) {
            this.dom.removeChild(this.dom.lastChild);
        } else if (this.dom.children.length == 1) {
            break;
        }
    }
    // 基于准备好的dom，初始化echarts实例
    var chart = document.createElement("DIV");
    this.dom.appendChild(chart);
    chart.id = "piechart" + this.id;
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
    var option = {
        title : {
            text: '某站点用户访问来源',
            subtext: '纯属虚构',
            x:'center'
        },
        tooltip : {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
            orient: 'vertical',
            left: 'left',
            data: ['直接访问','邮件营销','联盟广告','视频广告','搜索引擎']
        },
        series : [
            {
                name: '访问来源',
                type: 'pie',
                radius : '55%',
                center: ['50%', '60%'],
                data:[
                    {value:335, name:'直接访问'},
                    {value:310, name:'邮件营销'},
                    {value:234, name:'联盟广告'},
                    {value:135, name:'视频广告'},
                    {value:1548, name:'搜索引擎'}
                ],
                itemStyle: {
                    emphasis: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }
        ]
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
};

PieChart.prototype.toDomforFormGroup = function(parent) {
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

PieChart.prototype.handleEvent = function(e) {
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

PieChart.prototype.doClick = function(evt) {
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

PieChart.prototype.doFocus = function(evt) {
    bgcache = evt.target.style.backgroundColor;
    evt.target.style.backgroundColor = Utils.highLight();
    Utils.stopBubble(evt);
};

PieChart.prototype.doBlur = function(evt) {
    evt.target.style.backgroundColor = bgcache;
    bgcache = null;
    Utils.stopBubble(evt);
};

PieChart.prototype.doDragStart = function(evt) {
    if (this.evn == 0) {
        if (map[this.currOwner] != null
            && map[this.currOwner].currObject instanceof Form) {
            evt.target.style.opacity = '0.7'; // this / e.target is the source
            // node.
            evt.dataTransfer.effectAllowed = 'move';
            copyclip = evt.target.id; // critical
        }
    } else if (this.evn == 1) {
    }
    Utils.stopBubble(evt);
};

PieChart.prototype.doDrag = function(evt) {
    Utils.stopBubble(evt);
};

PieChart.prototype.doDragEnd = function(evt) {
    if (this.evn == 0) {
        if (map[this.currOwner] != null
            && map[this.currOwner].currObject instanceof Form) {
            evt.target.style.opacity = '1';
        }
    } else if (this.evn == 1) {
    }
    Utils.stopBubble(evt);
};

PieChart.prototype.parseFromJSON = function(json, evn) {
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

PieChart.prototype.parseExpressions = function(owner) {
    for (var i = 0; i < this.rules.length; i++) {
        this.rules[i].parseExpressions(owner);
    }
};

PieChart.prototype.toTree = function() {
    return {
        id : this.id,
        text : this.title,
        icon : "glyphicon glyphicon-unchecked",
        data : "饼图|",
    }
};
