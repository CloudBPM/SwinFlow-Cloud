/**
 * @author Dahai Cao created at 19:05 on 2019-01-11
 * @constructor
 */
function ReportField() {
    this.id = null; // report field id;
    this.name = null; // report field title;
};

function ReportField(id, name) {
    this.id = id; // report field id;
    this.name = name; // report field title;
};

ReportField.prototype = new WorkflowEntity();

ReportField.prototype.parsefromJSON = function(json) {
    this.id = json.id;
    this.name = json.name;
};
