/**
 * 
 */
function Participant() {
	this.id = null;
	this.taskId = null;
	// 0: position; 1: launcher; 2: specific user;
	this.participationType = 0;
	this.organizationId = null;
	this.organizationName = null;
	this.departmentId = null;
	this.departmentName = null;
	this.positionId = null;
	this.positionName = null;
	this.userId = null;
	this.userFullName = null;
	// work assignment priority:
	// 0: normal; 1: important; 2: urgent;
	this.priority = 0;
	this.currOwner = null;
	this.owner = null;
	this.classtypename = "Participant";
};

Participant.prototype = new WorkflowEntity();

Participant.prototype.clone = function() {
	var a = new Participant();
	a.id = this.id;
	a.taskId = this.taskId;
	a.participationType = this.participationType;
	a.organizationId = this.organizationId;
	a.organizationName = this.organizationName;
	a.departmentId = this.departmentId;
	a.departmentName = this.departmentName;
	a.positionId = this.positionId;
	a.positionName = this.positionName;
	a.userId = this.userId;
	a.userFullName = this.userFullName;
	a.priority = this.priority;
	a.currOwner = this.currOwner;
	a.owner = this.owner;
	return a;
};
