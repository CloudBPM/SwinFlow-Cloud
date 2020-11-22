function ReportDataRow() {
    this.id = null; // report field id;
    this.name = null; // report field title;
    this.instanceId = null;
    this.workflowType = 0;
    this.children = [];
};

ReportDataRow.prototype = new WorkflowEntity();

ReportDataRow.prototype.parsefromJSON = function (json) {
    this.id = json.id;
    this.name = json.name;
    this.instanceId = json.instanceId;
    this.workflowType = json.workflowType;
    if (json.children.length > 0) {
        for (var i = 0; i < json.children.length; i++) {
            var r = new ReportCell();
            r.parsefromJSON(json.children[i]);
            this.children.push(r);
        }
    }
};
