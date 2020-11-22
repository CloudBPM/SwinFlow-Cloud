function QueryCondition() {
    this.id = null;
    this.vid = null; // process data variable Id;
    this.operator = null; //
    this.children = [];
    this.value = "";
    this.classtypename = "QueryCondition";
};

QueryCondition.prototype = new WorkflowEntity();

QueryCondition.prototype.parsefromJSON = function (json) {
    this.id = json.id;
    this.vid = json.vid;
    this.operator = json.operator;
    this.value = json.value;
};

QueryCondition.prototype.clone = function () {
    var o = new QueryCondition()
    o.id = this.id;
    o.vid = this.vid;
    o.operator = this.operator;
    o.value = this.value;
    return o;
};
