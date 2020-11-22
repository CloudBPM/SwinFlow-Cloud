/**
 * 
 */
function SystemNotice() {
	this.id = null;
	this.name = null;
	this.messageType = 0;
	// system notification content for PC application
	this.pcContent = null;
	// system notification content for Mobile application
	this.mobileContent = null;
	this.keywords = null;
	// publisher user ID (it is foreign key in user profile)
	this.publisherId = null;
	// publisher user full name
	this.publisher = null;
	// 0: not live; 1: live
	this.liveStatus = 0;
	this.createDatetime = 0;
	this.lastupdate = 0;
	this.organizationName = null;
	this.owner = null;
	// 0: allow to use (not force exit or to allow to login);1: not allow use
	// (force exit or not ban to login)
	this.banned = 0;
	this.banStartTime = 0;
	this.banEndTime = 0;
	// 消息过期时间
	this.expireTime = 0;
	// 这个字段还没有被启用，是备用字段
	// system notice level
	this.level = 0;
};

SystemNotice.prototype = new WorkflowEntity();

SystemNotice.prototype.parseFromJSON = function(json) {
	this.id = json.id;
	this.name = json.name;
	this.messageType = json.messageType;
	this.pcContent = json.pcContent;
	this.mobileContent = json.mobileContent;
	this.keywords = json.keywords;
	this.publisherId = json.publisherId;
	this.publisher = json.publisher;
	this.liveStatus = json.liveStatus;
	this.createDatetime = Utils.getDateTime(json.createDatetime);
	this.lastupdate = Utils.getDateTime(json.lastupdate);
	this.expireTime = json.expireTime;
	this.organizationName = json.organizationName; // org name
	this.owner = json.owner; // organization ID
	this.banned = json.banned;
	if (json.banStartTime != null && json.banStartTime != "")
	   this.banStartTime = Utils.getDateTime(json.banStartTime);
	if (json.banEndTime != null && json.banEndTime != "")
	   this.banEndTime = Utils.getDateTime(json.banEndTime);
	// 这个字段还没有被启用，是备用字段
	// system notice level
	this.level = json.level;
	
};