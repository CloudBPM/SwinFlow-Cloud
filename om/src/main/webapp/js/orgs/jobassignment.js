/**
 * 
 */
function JobAssignment() {
	this.positionId = null;
	this.staffId = null;
	this.staffCode = null;
	this.staffFullName = null;
	this.userName = null;
	this.onJobDate = null;
	this.ownerId = null;
	this.description = null;
};

JobAssignment.prototype.parseFromJSON = function(json, ownerid) {
	this.positionId = json.positionId;
	this.staffId = json.staffId;
	this.staffFullName = json.staffFullName;
	this.userName = json.userName;
	this.staffCode = json.staffCode;
	this.onJobDate = Utils.getDateTime(json.onJobDate);
	this.ownerId = ownerid;
	this.description = json.description;
};
