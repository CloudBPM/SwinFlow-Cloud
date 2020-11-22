/**
 * 
 */
function MessageReceiver() {
	this.id = null;
	this.taskId = null;
	// 0: SMS; 1: Email; 2: QQ; 3: WeChat extensible ,etc.
	this.messageType = 0;
	// 0: workflow launcher; 1: all staffs in current organization; 2; all
	// staffs in all associated organizations; 3: specific position(s) or
	// project roles;
	this.receiverType = 0;
	this.organizationId = null;
	this.organizationName = null;
	// division Id, department Id, or project team Id
	this.departmentId = null;
	this.departmentName = null;
	// position Id or project role Id
	this.positionId = null;
	this.positionName = null;
	// WORKFLOW_LAUNCHR;
	// ALL_CUR_STAFFS;
	// ALL_ORG_STAFFS;
	this.userId = null;
	this.userFullName = null;
	this.currOwner = null;
	this.owner = null;
	this.classtypename = "MessageReceiver";
};

MessageReceiver.prototype = new WorkflowEntity();

MessageReceiver.prototype.clone = function() {
	var a = new MessageReceiver();
	a.id = this.id;
	a.taskId = this.taskId;
	a.messageType = this.messageType;
	a.receiverType = this.receiverType;
	a.organizationId = this.organizationId;
	a.organizationName = this.organizationName;
	a.departmentId = this.departmentId;
	a.departmentName = this.departmentName;
	a.positionId = this.positionId;
	a.positionName = this.positionName;
	a.userId = this.userId;
	a.userFullName = this.userFullName;
	a.currOwner = this.currOwner;
	a.owner = this.owner;
	return a;
};