/**
 * 
 */

function UserLoginHistory() {
	this.id = null;
	this.fk_User = null;
	this.sessionId = null;
	this.lastLoginTime = null;
	this.lastLogoutTime = null;
	this.statusCode = 0;
	this.device = null;
	this.deviceType = null;
	this.deviceManufacturer = null;
	this.os = null;
	this.osType = null;
	this.osManufacturer = null;
	this.browser = null;
	this.browserType = null;
	this.browserVersion = null;
	this.browserManufacturer = null;
	this.ipv4 = null;
	this.ipv6 = null;
	this.country = null;
	this.province = null;
	this.city = null;
	this.town = null;
	this.loginDescription = null;
};

UserLoginHistory.prototype = new WorkflowEntity();

UserLoginHistory.prototype.parseFromJSON = function(json, ownerid) {
	this.id = json.id;
	this.fk_User = json.fk_User;
	this.sessionId = json.sessionId;
	this.lastLoginTime = Utils.getDateTime(json.lastLoginTime);
	if (json.lastLogoutTime != null)
		this.lastLogoutTime = Utils.getDateTime(json.lastLogoutTime);
	else
		this.lastLogoutTime = null;
	this.statusCode = json.statusCode;
	this.device = json.device;
	this.deviceType = json.deviceType;
	this.deviceManufacturer = json.deviceManufacturer;
	this.os = json.os;
	this.osType = json.osType;
	this.osManufacturer = json.osManufacturer;
	this.browser = json.browser;
	this.browserType = json.browserType;
	this.browserVersion = json.browserVersion;
	this.browserManufacturer = json.browserManufacturer;
	this.ipv4 = json.ipv4;
	this.ipv6 = json.ipv6;
	this.country = json.country;
	this.province = json.province;
	this.city = json.city;
	this.town = json.town;
	this.loginDescription = json.loginDescription;
}
