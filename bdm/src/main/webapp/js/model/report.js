function Report() {
    this.id = null; // report field id;
    this.name = null; // report field title;
    this.titles = [];
    this.children = [];
    this.classtypename = "Report";
};

Report.prototype = new WorkflowEntity();

Report.prototype.parsefromJSON = function (json) {
    this.id = json.id;
    this.name = json.name;
    if (json.titles.length > 0) {
        for (var i = 0; i < json.titles.length; i++) {
            var r = new ReportField();
            r.parsefromJSON(json.titles[i]);
            this.titles.push(r);
        }
    }
    if (json.children.length > 0) {
        for (var i = 0; i < json.children.length; i++) {
            var row = new ReportDataRow();
            row.parsefromJSON(json.children[i]);
            this.children.push(row);
        }
    }
};
