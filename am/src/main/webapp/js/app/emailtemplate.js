/**
 * 
 */
function EmailTemplate() {
	this.id = null;
	this.name = null;
	this.emailSubject = null;
	this.emailContent = null;
	this.attachments = [];// this is an array of file constants
	// 0: invalid; 1:valid
	this.status = 0;
	this.useCounting = 0;
	this.createDateTime = null;
	this.lastupdate = null;
	this.onlineDateTime = null;
	this.offlineDateTime = null;
	this.parent = null;
	this.owner = null; // organization ID
	this.classtypename = "EmailTemplate";
};

EmailTemplate.prototype = new WorkflowEntity();

EmailTemplate.prototype.parse = function(json) {
	this.id = json.id;
	this.name = json.name;
	this.emailSubject = json.emailSubject;
	this.emailContent = json.emailContent;
	if (json.attachments != null && json.attachments.length > 0) {
		var atts = JSON.parse(json.attachments);
		for (var i = 0; i < atts.length; i++) {
			var fc = new FileConstant();
			fc.parseObject(atts[i]);
			this.attachments.push(fc);
		}
	}
	this.status = json.status;
	this.useCounting = json.useCounting;
	this.createDateTime = Utils.getDateTime(json.createDateTime);
	this.lastupdate = Utils.getDateTime(json.lastupdate);
	this.onlineDateTime = Utils.getDateTime(json.onlineDateTime);
	this.offlineDateTime = Utils.getDateTime(json.offlineDateTime);
	this.parent = json.parent;
	this.owner = json.owner; // organization ID
};