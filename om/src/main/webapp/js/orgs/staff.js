/**
 * 
 */
function Staff() {
	this.id = null;
	this.user = null;
	this.professionalTitle = null;
	this.staffCode = null;
	this.workPhoneNumber = null;
	this.workMobileNumber = null;
	this.workFaxNumber = null;
	this.workEmail = null;
	this.officeLocation = null;
	// 1:full time;2:part time;3:casual;4:intern
	this.workType = 1;
	// 0:idle;1:busy;2:crazy;3:away;4:off
	this.workStatus = 0;
	// 0:resigned;1:on job
	this.jobStatus = 1;
	this.onBoardingDate = null;
	this.resignDate = null;
	this.resignDescription = null;
	this.lastupdate = null;
	this.owner = null;
	this.isHidden = false;
	
	this.currDepartment = null;
	this.currPostion = null;
	this.currGroup = null;
	// true:updated;false:not updated.
	this.dirty = false;
};

Staff.prototype = new WorkflowEntity();

Staff.prototype.parseFromJSON = function(json, ownerid) {
	this.id = json.id;
	this.professionalTitle = json.professionalTitle;
	this.staffCode = json.staffCode;
	this.workPhoneNumber = json.workPhoneNumber;
	this.workMobileNumber = json.workMobileNumber;
	this.workFaxNumber = json.workFaxNumber;
	this.workEmail = json.workEmail;
	this.officeLocation = json.officeLocation;
	this.onBoardingDate = json.onBoardingDate;
	this.resignDate = json.resignDate;
	this.resignDescription = json.resignDescription;
	this.loginCounting = json.loginCounting;
	this.isHidden = json.isHidden;
	this.jobStatus = json.jobStatus;
	this.workType = json.workType;
	this.workStatus = json.workStatus;
	this.lastupdate = Utils.getDateTime(json.lastupdate);
	this.owner = ownerid;

	if (json.user != null) {
		var user = new User();
		user.parseFromJSON(json.user, ownerid);
		this.user = user;
	}
};
