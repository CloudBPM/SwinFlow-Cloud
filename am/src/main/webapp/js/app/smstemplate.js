/**
 * 
 */
function SMSTemplate() {
	this.id = null;
	this.name = null;
	this.smsContent = null;
	this.useCounting = 0;
	// 0: invalid; 1:valid
	this.status = 0;
	this.createDateTime = null;
	this.lastupdate = null;
	this.onlineDateTime = null;
	this.offlineDateTime = null;
	this.parent = null;
	this.owner = null; // organization ID
	this.classtypename = "SMSTemplate";
};

SMSTemplate.prototype = new WorkflowEntity();

SMSTemplate.prototype.parse = function(json) {
	this.id = json.id;
	this.name = json.name;
	this.smsContent = json.smsContent;
	this.status = json.status;
	this.useCounting = json.useCounting;
	this.createDateTime = Utils.getDateTime(json.createDateTime);
	this.lastupdate = Utils.getDateTime(json.lastupdate);
	this.onlineDateTime = Utils.getDateTime(json.onlineDateTime);
	this.offlineDateTime = Utils.getDateTime(json.offlineDateTime);
	this.parent = json.parent;
	this.owner = json.owner; // organization ID
};