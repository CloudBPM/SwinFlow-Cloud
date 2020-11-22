/**
 * 
 */
function AccessibleVariable() {
	this.taskId = null;
	this.varId = null;
	// 0: read; 1: write
	this.accessControl = 0;
	this.currOwner = null;
	this.owner = null;
	this.classtypename = "AccessibleVariable";
	this.componentId = null;
};

AccessibleVariable.prototype.clone = function() {
	var a = new AccessibleVariable();
	a.taskId = this.taskId;
	a.varId = this.varId;
	a.accessControl = this.accessControl; 
	a.currOwner = this.currOwner;
	a.owner = this.owner;
	a.componentId = this.componentId;
	return a;
};
