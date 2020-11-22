/**
 * 
 */
function GroupMember() {
	this.groupId = null;
	this.staffId = null;
	this.staffCode = null;
	this.boardDate = null;
	this.userAccount = null;
	this.userSurname = null;
	this.userGivenName = null;
	this.staffFullName = null;
	this.owner = null;
};

GroupMember.prototype.parseFromJSON = function(json, ownerid) {
	this.groupId = json.groupId;
	this.staffId = json.staffId;
	this.staffCode = json.staffCode;
	this.boardDate = Utils.getDate(json.boardDate);
	this.userAccount = json.userAccount;
	this.userGivenName = json.userGivenName;
	this.userSurname = json.userSurname;
	this.staffFullName = this.userSurname + this.userGivenName;
	this.owner = ownerid;
};
