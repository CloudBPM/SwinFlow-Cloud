function ReportCell() {
    this.id = null; // report cell field id;
    this.name = null; // report cell field title;
    this.cellContent = null;
};

ReportCell.prototype = new WorkflowEntity();

ReportCell.prototype.parsefromJSON = function (json) {
    this.id = json.id;
    this.name = json.name;
    this.cellContent = json.cellContent;
};
