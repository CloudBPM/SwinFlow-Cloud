/**
 * 
 */

function AppServiceAccessControl() {
	this.appServiceId = null;
	this.organizationId = null;
	this.organizationName = null;
	this.createDateTime = null;
	this.accessCounting = 0;
	this.owner = null;
};

AppServiceAccessControl.prototype.parse = function(json) {
	this.appServiceId = json.appServiceId;
	this.organizationId = json.organizationId;
	this.organizationName = json.organizationName;
	if (json.createDateTime != null) {
		this.createDateTime = Utils.getDateTime(json.createDateTime);
	}
	this.accessCounting = json.accessCounting;
	this.owner = json.owner;
};