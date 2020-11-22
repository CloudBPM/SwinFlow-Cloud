/**
 * 
 */

function JobAssignmentHistory() {
	this.organizationName;
	this.departmentName;
	this.positionName;
	this.startDate;
	this.startDescription;
	this.endDate;
	this.endDescription;
};

JobAssignmentHistory.prototype = new WorkflowEntity();

JobAssignmentHistory.prototype.parseFromJSON = function(json, ownerid) {
	this.organizationName = json.organizationName;
	this.departmentName = json.departmentName;
	this.positionName = json.positionName;
	this.startDate = json.startDate;
	this.startDescription = json.startDescription;
	this.endDate = json.endDate;
	this.endDescription = json.endDescription;
}
